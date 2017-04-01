/**
 * 目标审核
 * Created by yuanzhou on 17/02.
 */
import React, {Component} from 'react'
import {
    InteractionManager,
    Dimensions,
    ActivityIndicator,
    ListView,
    RefreshControl,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    StyleSheet
} from 'react-native'
import TopBar from '../common/TopBar'
import ImageResource from '../../utils/ImageResource'
import {tabManage, getUserTarget, userTargetCheck, updatePage} from '../../actions'
import Tab_First from '../Tab_First'
import moment from 'moment'
import  * as SizeController from '../../SizeController'
import {handleUrl} from '../../utils/UrlHandle'
let topHeight = SizeController.getTopHeight();
let tabBarHeight = SizeController.getTabBarHeight();
let changeRatio = SizeController.getChangeRatio();

const imageViewBackgroundColor = "rgb(228,236,240)";
var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;
function getFixNumberLength(str, ele) {
    let count = 0;
    pos = str.indexOf(ele);
    while (pos != -1) {
        count++;
        pos = str.indexOf(ele, pos + 1);
    }
    return count;
}
class RowItem extends Component {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        rowData: {}
    }

    checkNotPass(userUniqueid, orgUniqueid, kpiMTargetUniqueids) {
        let PageData = this.props.pageModel.PageData
        let postData = {
            token: PageData.token,
            userUniqueid: userUniqueid,
            orgUniqueid: orgUniqueid,
            kpiMTargetUniqueids: kpiMTargetUniqueids,
            type: "checkNotPass"
        }
        userTargetCheck(this.props.dispatch, postData, 0, Tab_First, '', true, null)
    }

    checkPass(userUniqueid, orgUniqueid, kpiMTargetUniqueids) {
        let PageData = this.props.pageModel.PageData
        let postData = {
            token: PageData.token,
            userUniqueid: userUniqueid,
            orgUniqueid: orgUniqueid,
            kpiMTargetUniqueids: kpiMTargetUniqueids,
            type: "checkPass"
        }
        userTargetCheck(this.props.dispatch, postData, 0, Tab_First, '', true, null)
    }

    render() {
        let rowData = this.props.rowData
        let targets = []
        let needCheckTargets = rowData.needCheckTargets
        let userInfo = rowData.userInfo
        let times = ""
        let kpiMTargetUniqueids = []

        if (needCheckTargets !== undefined && needCheckTargets !== null) {
            for (let i = 0; i < needCheckTargets.length; i++) {
                let obj = needCheckTargets[i]
                let keyIndex = i + 1;
                if (keyIndex < 10) {
                    keyIndex = "0" + keyIndex + ". ";
                } else {
                    keyIndex = keyIndex + ". ";
                }
                let numberOfOne = getFixNumberLength(keyIndex, "1");
                let numberOfSeven = getFixNumberLength(keyIndex, "7");
                let totalNumber = numberOfOne + numberOfSeven;
                let marginTop = 0;
                let fontSize = 14;
                //判断emoji
                let ranges = ['\ud83c[\udf00-\udfff]', '\ud83d[\udc00-\ude4f]', '\ud83d[\ude80-\udeff]'];
                let patt2 = new RegExp(ranges.join('|'), 'g');
                //判断汉字
                let patt1 = /[\u4e00-\u9fa5]/ig;
                if (patt1.test(obj.content)) {
                    marginTop = 1;

                }
                if (patt2.test(obj.content)) {
                    marginTop = 3;
                    fontSize = 15;

                }
                kpiMTargetUniqueids.push(obj.kpiMTargetUniqueid)
                targets[i] = <View key={i} style={{flexDirection:"row",paddingRight:15}}>
                    <View style={{justifyContent:"center",height:26}}>
                        <Text style={{marginTop:marginTop,fontSize:fontSize,color:"#2b3d54"}}>{keyIndex}</Text>
                    </View>
                    <View style={{justifyContent:"center",height:26}}>
                        <Text style={{marginLeft:totalNumber*1.5,fontSize:14,color:"#2b3d54"}}>{obj.content}</Text>
                    </View>
                </View>
                times = obj.updateTime
                if (times == "") {
                    times = obj.createtime
                }
            }
        }
        let avatar = null;
        let userName = "";
        let createtime = "";
        if (userInfo !== undefined && userInfo !== null) {
            userName = userInfo.name;
            createtime = userInfo.createtime;
            let url = handleUrl(userInfo.avatar);
            if (url) {
                avatar = {uri: url}
            } else {
                if (userInfo.sex == "男") {
                    avatar = ImageResource["header-boy@2x.png"];
                } else if (userInfo.sex == "女") {
                    avatar = ImageResource["header-girl@2x.png"];
                }
            }
        }
        if (createtime !== "") {
            createtime = moment(createtime).format("MM月DD日 HH:mm");
        }
        if (times !== "") {
            times = moment(times).format("MM月DD日 HH:mm");
        }
        return (
            <View style={{backgroundColor:"#ffffff",marginBottom:10*changeRatio}}>
                <View
                    style={{marginTop:15*changeRatio,paddingLeft:15*changeRatio,flex:0,height:34*changeRatio,width:deviceWidth,flexDirection:"row"}}>
                    <View
                        style={{flex:0,width:34*changeRatio,height:34*changeRatio,borderRadius:17*changeRatio,backgroundColor:imageViewBackgroundColor}}>
                        <Image source={avatar}
                               style={{width:34*changeRatio,height:34*changeRatio,borderRadius:17*changeRatio}}/>
                    </View>
                    <View style={{marginLeft:12*changeRatio,justifyContent:"center"}}>
                        <Text style={{fontSize:16*changeRatio,color:"#838f9f"}}>{userName}</Text>
                    </View>
                    <View
                        style={{position:"absolute",right:15*changeRatio,height:34*changeRatio,justifyContent:"center"}}>
                        <Text style={{fontSize:12*changeRatio,color:"#c5cdd7"}}>{times}</Text>
                    </View>
                </View>
                <View
                    style={{marginTop:9*changeRatio,paddingLeft:61*changeRatio,width:deviceWidth*changeRatio,paddingRight:15*changeRatio}}>
                    {targets}
                </View>
                <View
                    style={{flex:0,paddingLeft:61*changeRatio,marginTop:14*changeRatio,marginBottom:20*changeRatio,height:35*changeRatio,width:deviceWidth,flexDirection:"row"}}>
                    <TouchableOpacity
                        onPress={()=>this.checkNotPass(userInfo.userUniqueid,userInfo.orgUniqueid,kpiMTargetUniqueids)}
                        style={{borderRadius:17.5*changeRatio,width:105*changeRatio,height:35*changeRatio,backgroundColor:"rgb(29,169,252)",alignItems:"center",justifyContent:"center"}}>
                        <Text style={{fontSize:16*changeRatio,color:"#ffffff"}}>驳回</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>this.checkPass(userInfo.userUniqueid,userInfo.orgUniqueid,kpiMTargetUniqueids)}
                        style={{marginLeft:50*changeRatio,borderRadius:17.5*changeRatio,width:105*changeRatio,height:35*changeRatio,backgroundColor:"rgb(29,169,252)",alignItems:"center",justifyContent:"center"}}>
                        <Text style={{fontSize:16*changeRatio,color:"#ffffff"}}>通过</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
class TargetCheck extends Component {
    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (row1, row2) => true});
        this.state = {
            dataSource: ds.cloneWithRows([]),
            isRefreshing: true,
            isAdding: false,
            isEnding: false,
        }
        this.toback = this.toback.bind(this);
        this._renderRow = this._renderRow.bind(this);
        this._renderFooter = this._renderFooter.bind(this);
        this.onEndReached = this.onEndReached.bind(this);
        this._onScroll = this._onScroll.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
    }

    componentDidMount() {
        let PageData = this.props.pageModel.PageData
        PageData.userLowerLevelNeedCheckMonthTarget = []
        let postData = {
            token: PageData.token,
            userUniqueid: PageData.userUniqueid,
            orgUniqueid: PageData.orgUniqueid,
            type: "getUserLowerLevelNeedCheckMonthTarget"
        }
        InteractionManager.runAfterInteractions(() => {
            getUserTarget(this.props.dispatch, postData, {}, true);
        })

    }

    componentWillReceiveProps(nextProps) {
        let isRefreshing = true;
        let preFetching = this.props.pageModel.PageState.fetching;
        let nextFetching = nextProps.pageModel.PageState.fetching;
        let PageData = nextProps.pageModel.PageData;
        if (nextFetching === false) {
            if (PageData.userLowerLevelNeedCheckMonthTarget !== undefined && PageData.userLowerLevelNeedCheckMonthTarget !== null) {
                this._updateDataSourceInit(PageData.userLowerLevelNeedCheckMonthTarget, false);
            }
        } else {
            if (preFetching !== nextFetching) {
                if (PageData.userLowerLevelNeedCheckMonthTarget !== undefined && PageData.userLowerLevelNeedCheckMonthTarget !== null) {
                    this._updateDataSourceInit(PageData.userLowerLevelNeedCheckMonthTarget, true);
                } else {
                    this.setState({isRefreshing: true});
                }
            }
        }
    }

    _updateDataSourceInit(data, isRefreshing) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(data),
            isRefreshing: isRefreshing
        });
    }

    _renderRow(rowData: object, sectionID: number, rowID: number, hignlightRow: (sectionID: number, rowID: number)=>void) {
        return (<RowItem rowData={rowData} rowID={rowID} {...this.props}/>)
    }

    //渲染底部样式
    _renderFooter() {
        if (this.state.isEnding) {
            if (this.state.dataSource.getRowCount() <= 0) {
                return (
                    <View
                        style={{alignItems:"center",flexDirection:"row",justifyContent:"center",height:30*changeRatio,flex:1}}>
                        <Text style={{marginLeft:10*changeRatio,fontSize:14*changeRatio}}>没有更多数据了...</Text>
                    </View>
                )
            }
        } else {
            return (
                <View
                    style={{alignItems:"center",flexDirection:"row",justifyContent:"center",height:30*changeRatio,flex:1}}>
                    <ActivityIndicator
                        animating={true}
                        color="rgb(0,171,243)"
                        size="small"
                    />
                    <Text style={{marginLeft:10*changeRatio,fontSize:14*changeRatio}}>加载中...</Text>
                </View>
            )
        }
    }

    //刷新数据
    _onRefresh() {
        this.setState({isRefreshing: true})
        let PageData = this.props.pageModel.PageData
        let postData = {
            token: PageData.token,
            userUniqueid: PageData.userUniqueid,
            orgUniqueid: PageData.orgUniqueid,
            type: "getUserLowerLevelNeedCheckMonthTarget"
        }
        getUserTarget(this.props.dispatch, postData, {}, true)
    }

    //加载数据
    _onAdding() {
        this.setState({isAdding: true, isEnding: true})
    }

    //进行滑动到底部的操作
    onEndReached() {
        //this.setState({isRefreshing:true})
        //alert(1)
        if (this.state.isAdding == false && this.state.isEnding == false) {
            this._onAdding()
        }
    }

    _onScroll() {
        //alert(a)

    }

    /**
     * 获取listview 数据源
     */
    _getDataSource() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let PageData = this.props.pageModel.PageData
        if (PageData.isRefreshing !== undefined && PageData.isRefreshing != null) {
            this.state.isRefreshing = PageData.isRefreshing
        }
        if (PageData.userLowerLevelNeedCheckMonthTarget !== undefined && PageData.userLowerLevelNeedCheckMonthTarget !== null) {
            this.state.dataSource = PageData.userLowerLevelNeedCheckMonthTarget
        }
        return ds.cloneWithRows(this.state.dataSource)
    }

    //返回
    toback() {
        let obj = {
            route: null,
            toBack: true,
            needInitUpdate: 0,
        }
        updatePage(this.props.dispatch, obj);
    }

    render() {
        //let realDataSource = this._getDataSource()
        return (
            <View style={styles.container}>
                <TopBar
                    toback={this.toback}
                    layoutStyle={this.props.layoutStyle}
                    showRightImage={false}
                    //rightComponent={}
                    topBarText="目标审核"
                    //topBarTextRight="今天"
                    showRight={false}
                    showLeft={true}
                />
                <View style={{marginTop:topHeight}}></View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    initialListSize={5}
                    pageSize={6}
                    enableEmptySections={true}
                    //renderFooter={this._renderFooter}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={5}
                    refreshControl={
						 <RefreshControl
			        	  refreshing={this.state.isRefreshing}
			              onRefresh={this._onRefresh}
			              tintColor="rgb(0,171,243)"
			              colors={['rgb(0,171,243)']}
			              progressBackgroundColor="#ffffff"
			            />
					}
                    onScroll={this._onScroll}
                />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(248,248,248)",
    }
});

export default TargetCheck;