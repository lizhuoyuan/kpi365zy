/**
 * 关注目标
 * Created by yuanzhou on 17/02.
 */
import React, {Component} from 'react';
import {
    Platform,
    RefreshControl,
    ActivityIndicator,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    ListView,
    Text,
    Image,
    View,
    PanResponder,
    Animated,
    Easing,
    ScrollView
} from 'react-native';
import moment from 'moment'
import TopBar from '../common/TopBar'
import  * as SizeController from '../../SizeController'
import {fetchFocus, updatePage, focusTargetRecall} from '../../actions'
let changeRatio = SizeController.getChangeRatio();
let topHeight = SizeController.getTopHeight();
topHeight = Platform.OS === 'ios' ? 64 : 44;
let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;

class TargetItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rightPan: new Animated.ValueXY({x: 0, y: 0})
        }
    }

    static defaultProps = {
        slideComponentWidth: 105,
    }

    componentWillMount() {
        this.watcher = PanResponder.create({
            onStartShouldSetPanResponder: (event, gestureState) => true,
            onMoveShouldSetPanResponder: (event, gestureState) => !(gestureState.dx === 0 || gestureState.dy === 0),
            onStartShouldSetPanResponder: (evt, gestureState) => this._handleStartShouldSetPanResponder(evt, gestureState),
            onMoveShouldSetPanResponder: (evt, gestureState) => this._handleMoveShouldSetPanResponder(evt, gestureState),
            onPanResponderGrant: (evt, gestureState) => this._onPanResponderGrant(evt, gestureState),
            onPanResponderMove: (evt, gestureState) => this._onPanResponderMove(evt, gestureState),
            onPanResponderTerminate: (evt, gestureState) => this._onPanResponderEnd(evt, gestureState),
            onPanResponderRelease: (evt, gestureState) => this._onPanResponderEnd(evt, gestureState),
            onShouldBlockNativeResponder: (event, gestureState) => true,
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.close) {
            Animated.timing(this.state.rightPan, {
                toValue: {x: 0, y: 0},
                duration: 0.25 * 1000,//7
                easing: Easing.out(Easing.ease),
            }).start();
        }
    }

    _onPanResponderGrant(e, gestureState) {
        this.props.onOpen && this.props.onOpen(this.props.sectionID, this.props.rowID);
        this.startX = gestureState.x0;
        this.distanceX = 0;
        this.isFirstMove = true;
        this.isMove = false;

        Animated.spring(this.state.rightPan, {toValue: {x: Math.min(0, 0), y: 0}}
        ).start();
    }


    _onPanResponderMove(e, gestureState) {
        let posX = gestureState.dx
        let posY = gestureState.dy
        this.distanceX = gestureState.dx
        let leftWidth = this.state.btnsLeftWidth
        let rightWidth = this.props.slideComponentWidth;
        let moveX = Math.abs(posX) > Math.abs(posY)
        if (this.props.scroll) {
            if (moveX) this.props.scroll(false);
            else this.props.scroll(true);
        }
        if (moveX) {
            if (posX >= 0) {
            } else {
                if (Math.abs(posX) > this.props.slideComponentWidth) {
                    posX = -this.props.slideComponentWidth;
                }
                Animated.spring(this.state.rightPan, {toValue: {x: Math.min(posX, 0), y: 0}}
                ).start();
            }
        }

    }

    _onPanResponderEnd(evt, gestureState) {
        this.arrayDistane = []
        if (this.distanceX <= (-this.props.slideComponentWidth / 2)) {
            this.showRightPanel = true
            Animated.timing(this.state.rightPan, {
                toValue: {x: -this.props.slideComponentWidth, y: 0},
                duration: 0.25 * 1000,
                easing: Easing.inOut(Easing.ease),
            }).start();
        } else {
            this.showRightPanel = false
            Animated.timing(this.state.rightPan, {
                toValue: {x: 0, y: 0},
                duration: 0.25 * 1000,
                easing: Easing.out(Easing.ease),
            }).start();

        }
        this.props.scroll && this.props.scroll(true)
    }

    _handleStartShouldSetPanResponder(e, gestureState) {
        return true;
    }

    _handleMoveShouldSetPanResponder(e, estureState) {
        return true;
    }

    /**
     *  取消关注
     */
    _onRecallFocus() {
        let {data, userUniqueid} = this.props;
        let {uniqueid} = data;
        let postData = {
            type: "target_focus",
            targetUniqueid: uniqueid,
            targetUserUniqueid: userUniqueid
        }
        this.props.onRecallFocus && this.props.onRecallFocus(postData);
        Animated.timing(this.state.rightPan, {
            toValue: {x: 0, y: 0},
            duration: 0.25 * 1000,
            easing: Easing.out(Easing.ease),
        }).start();
    }

    render() {
        let {data} = this.props;
        let {text} = data;
        let rightText = (
            <View style={styles.rightViewAbsolute}>
                <Text style={styles.rightText}>{data.progress}%</Text>
            </View>);
        return (
            <Animated.View
                style={[{flexDirection:"row"},this.state.rightPan.getLayout()]}>
                <View {...this.watcher.panHandlers} style={styles.targetContainer}>
                    <View style={styles.leftContainer}>
                        <View style={styles.targetTextView}>
                            <Text numberOfLines={3}
                                  style={styles.targetText}>{text}</Text>
                        </View>
                    </View>
                    { rightText }
                </View>
                <TouchableOpacity
                    onPress={()=>this._onRecallFocus()}
                    style={styles.rightSlideBtn}>
                    <Text style={{fontSize:14,color:"#ffffff"}}>取消关注</Text>
                </TouchableOpacity>

            </Animated.View>
        )
    }
}


class FocusTargetDetail extends Component {

    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (row1, row2) => true});
        this.state = {
            dataSource: ds.cloneWithRows([]),
            scrollEnabled: true,
            isEnding: false,
            isRefreshing: true,
            focusTargetInfo: {}
        };
        this._allowScroll = this._allowScroll.bind(this);
        this._updateDataSource = this._updateDataSource.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        this.fetch = this.fetch.bind(this);
        this._scrollView = null;
        this.progressRefs = [];
    }


    componentDidMount() {
        let {pageModel, focusTargetInfo} = this.props;
        if (focusTargetInfo) {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(focusTargetInfo.content),
                isRefreshing: false,
                focusTargetInfo: focusTargetInfo,
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    componentWillReceiveProps(nextProps) {
        let preFetching = this.props.pageModel.focusTargets.fetching;
        let nextFetching = nextProps.pageModel.focusTargets.fetching;
        let {pageModel} = nextProps;
        let {focusTargetInfo} = this.state;
        let {focusTargets} = pageModel;
        if (focusTargetInfo !== null && focusTargetInfo.userUniqueid) {
            let focusTargetInfoNew = focusTargets.entities[focusTargetInfo.userUniqueid];
            if (focusTargetInfoNew) {
                this._updateDataSourceInit(focusTargetInfoNew.contents, nextFetching);
            } else {
                this._updateDataSourceInit([], nextFetching);
            }
        } else {
            this._updateDataSourceInit([], nextFetching);
        }

    }


    /** 设置是否允许滚动 **/
    _allowScroll(scrollEnabled) {
        this.setState({scrollEnabled: scrollEnabled});
    }

    /** 更新ListView列，右滑与隐藏 **/
    _handleOpen(sectionID, rowID) {
        let {focusTargetInfo} = this.state;
        let {pageModel} = this.props;
        let {focusTargets} = pageModel;
        let rows = [];
        if (focusTargetInfo && focusTargetInfo.userUniqueid !== null) {
            let focusTargetInfoNew = focusTargets.entities[focusTargetInfo.userUniqueid];
            if (focusTargetInfoNew) {
                rows = focusTargetInfoNew.contents;
            }
        }
        for (let i = 0; i < rows.length; i++) {
            if (i != rowID) rows[i].active = false;
            else rows[i].active = true;
        }
        this._updateDataSource(rows);
    }

    /** 更新数据源 **/
    _updateDataSourceInit(data, isRefreshing) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(data),
            isRefreshing: isRefreshing
        });
    }

    /** 更新数据源 **/
    _updateDataSource(data) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(data),
        });
    }

    /**
     * 获取数据
     * @param action
     */
    fetch(action = 'init') {
        // InteractionManager.runAfterInteractions(() => {
        this.props.dispatch(fetchFocus(action));
        //});
    }


    _onRefresh() {
        this.fetch('down')
    }

    /**
     * 删除关注目标
     * @param postData
     * @private
     */
    _onRecallFocus(postData) {
        this.props.dispatch(focusTargetRecall(postData));
    }

    /** 渲染行 **/
    _renderRow(rowData, sectionID, rowID) {
        let {focusTargetInfo} = this.state;
        let userUniqueid = "";
        if (focusTargetInfo) {
            userUniqueid = focusTargetInfo.userUniqueid;
        }
        return <TargetItem
            data={rowData}
            //下面为滑动时的参数
            rowID={rowID}
            sectionID={sectionID}
            onRecallFocus={(obj)=>this._onRecallFocus(obj)}
            userUniqueid={userUniqueid}
            close={!rowData.active}
            scroll={this._allowScroll}
            onOpen={(sectionID, rowID) => this._handleOpen(sectionID, rowID)}
        />
    }

    /** 渲染底部样式 **/
    _renderFooter() {
        if (this.state.isEnding) {
            if (this.state.dataSource.getRowCount() <= -1) {
                return (
                    <View style={{alignItems:"center",flexDirection:"row",justifyContent:"center",height:30,flex:1}}>
                        <Text style={{marginLeft:10,fontSize:14}}>没有更多数据了...</Text>
                    </View>
                )
            } else {
                return (
                    <View></View>
                )
            }
        } else {
            if (this.props.showFooter) {
                return (
                    <View style={{alignItems:"center",flexDirection:"row",justifyContent:"center",height:30,flex:1}}>
                        <ActivityIndicator
                            animating={true}
                            color="rgb(0,171,243)"
                            size="small"
                        />
                        <Text style={{marginLeft:10,fontSize:14}}>加载中...</Text>
                    </View>
                )
            } else {
                return (
                    <View></View>
                )
            }
        }
    }

    //进行滑动到底部的操作
    onEndReached() {
        //this.setState({isRefreshing:true})

        if (this.state.isEnding == false) {
            this.setState({isEnding: true})
        }
    }

    /**
     * 返回
     * @private
     */
    _toback() {
        //this.props.navigator.pop();
        updatePage(this.props.dispatch, {
            toBack: true,
            needInitUpdate: 1,
        });
    }

    render() {
        let refreshControl = null;
        let {focusTargetInfo} = this.state;
        if (this.props.showFooter) {

        }

        return (
            <View style={styles.container}>
                <TopBar
                    toback={()=>this._toback()}
                    topBarText="目标详情"
                    topBarTextRight=""
                    showRight={false}
                    showLeft={true}
                    style={Platform.OS=='ios'?
                       {height:64,paddingTop:20}
                       :
                       {
                         height:44
                       }
                    }

                />
                <ScrollView
                    scrollEnabled={this.state.scrollEnabled}
                    contentContainer={styles.contentContainer2}
                    refreshControl={<RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._onRefresh}
                                tintColor="rgb(0,171,243)"
                                colors={['rgb(0,171,243)']}
                                progressBackgroundColor="#ffffff"
                            />}
                >
                    <View style={styles.container2}>
                        <View style={styles.topContainer}>
                            <View style={styles.avatarContainer}>
                                <Image source={focusTargetInfo.avatarSource} style={styles.avatar}/>
                            </View>
                            <View style={styles.topRightContainer}>
                                <Text style={styles.name}>{focusTargetInfo.username}</Text>
                                <Text style={styles.title}>{focusTargetInfo.subtitle}</Text>
                            </View>
                        </View>
                        <View style={styles.contentContainer}>
                            <ListView
                                scrollEnabled={false}
                                ref={(e)=>this._scrollView=e}
                                dataSource={this.state.dataSource}
                                renderRow={this._renderRow.bind(this)}
                                enableEmptySections={true}
                                alwaysBounceVertical={Platform.OS==='ios'?true:false}
                                removeClippedSubviews={false}
                                overScrollMode={"always"}
                            />

                        </View>

                        <View style={styles.bottomContainer}>
                            <View style={styles.bottomLeftContainer}>
                                <Text style={styles.time}>{focusTargetInfo.time}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>


        );
    }

}

const styles = StyleSheet.create({
    contentContainer2: {
        paddingBottom: 10,

    },
    container: {
        flex: 1,
        paddingTop: topHeight,
        backgroundColor: "rgb(248,248,248)",
    },
    container2: {
        flex: 0,
        backgroundColor: "#ffffff",
    },
    topContainer: {
        flexDirection: 'row',
    },
    avatarContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    avatar: {
        margin: 10,
        backgroundColor: '#ddd',
        width: 40,
        height: 40,
        borderRadius: 20,
        overlayColor: "#fff"
    },
    topRightContainer: {
        marginTop: 15,
    },

    contentContainer: {
        margin: 10,
        marginLeft: 15
    },
    content: {
        textAlign: 'left',
        color: '#002546',
        fontSize: 15
    },

    bottomContainer: {
        flex: 0,
        flexDirection: 'row',
        margin: 10,
        marginLeft: 15
    },
    bottomLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottomRightContainer: {
        flexGrow: 1,
        flexBasis: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },

    time: {
        fontSize: 10,
        color: '#8999a5',
    },
    name: {
        color: '#000031',
        fontSize: 15
    },
    title: {
        color: '#929CA9',
        fontSize: 10,
        marginTop: 3
    },
    targetContainer: {
        paddingLeft: 15,
        paddingRight: 15,
        width: deviceWidth - 30,
        paddingTop: 13,
        paddingBottom: 13,
        minHeight: 44,
        borderRadius: 10,
        marginBottom: 5,
        flexDirection: "row",
        backgroundColor: "rgb(228,236,240)"
    },
    leftContainer: {
        flexDirection: "row",
        width: (deviceWidth - 60) * 0.8,
    },
    targetTextView: {
        justifyContent: "center"
    },
    targetText: {
        fontSize: 14,
        color: "#2b3d54"
    },
    targetFocusTouchableView: {
        flex: 0,
        paddingLeft: 10,
        alignItems: "flex-end"
    },
    targetImageView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    targetImage: {
        width: 15,
        height: 15
    },
    rightViewAbsolute: {
        flex: 0,
        width: (deviceWidth - 60) * 0.2,
        justifyContent: "center",
        //alignItems: "center"

    },
    rightText: {
        fontSize: 14,
        textAlign: "right",
        color: "#1da9fc"
    },
    rightSlideBtn: {
        flex: 0,
        marginLeft: 5,
        borderRadius: 5,
        marginBottom: 5,
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        backgroundColor: "red"
    }
})
export default FocusTargetDetail;