/**
 * 主管周评
 * Created by yuanzhou on 17/02.
 */
import React, {Component} from "react"
import {
    InteractionManager,
    View,
    Alert,
    Dimensions,
    Keyboard,
    StyleSheet,
    TextInput,
    Animated,
    ScrollView,
    TouchableOpacity,
    Image,
    Text,
    Modal
} from "react-native"
import ImageResource from '../../utils/ImageResource';
import TopBar from '../common/TopBar'
import Calendar from '../common/Calendar/Calendar'
import {
    getPeopleRelationship,
    clearPageInfo,
    getSelfEvaluate,
    updatePage,
    doPostWeekEvaluateAnswer,
    rewardManage
} from '../../actions'
import moment from 'moment'
import ChoosePeople from './ChooseUser'
import StarRating from '../common/StarRating'
import WeekStarEvaluate from '../WeekStarEvaluate'
import WeekEvaluateHistory from './WeekEvaluateHistory'
import EvaluateRowItem from './EvaluateRowItem'
import * as SizeController from '../../SizeController'
import {handleUrl} from '../../utils/UrlHandle'

let topHeight = SizeController.getTopHeight();
let tabBarHeight = SizeController.getTabBarHeight();
let changeRatio = SizeController.getChangeRatio();
const topBarRatio = SizeController.getTopBarRatio();
const imageViewBackgroundColor = "rgb(228,236,240)";
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
function getLength(str) {
    var ranges = ['\ud83c[\udf00-\udfff]', '\ud83d[\udc00-\ude4f]', '\ud83d[\ude80-\udeff]'];
    str = str.replace(new RegExp(ranges.join('|'), 'g'), 'aa');
    return str.replace(/[\u0391-\uFFE5]/g, "aa").length;
}
function isExistToArray(array, value, key) {
    for (let i = 0; i < array.length; i++) {
        if (array[i][key] == value) {
            return true;
        }
    }
    return false;
}

class WeekEvaluate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fadeMin: new Animated.Value(0),
            selectPeopleIndex: -1,
            selectRowData: null,
            showLoading: false,
            progressRefs: [],
            scrollY: 0,
            keyboardHeight: 0,
            showShouhui: false,
            shouhuiBottom: 0,
            rowItemRefs: [],
            chargeRowItemRefs: [],
            textInputIndex: 0,
            modalVisible: false,
            selectUBKey: -1,
            showSuccessAnswer: false,
            textInputIndexChange: false,
        };
        this.toback = this.toback.bind(this);
        this.doInitUpdate = this.doInitUpdate.bind(this);
        this.choosePeople = this.choosePeople.bind(this);
        this.chooseMorePeople = this.chooseMorePeople.bind(this);
        this.subscriptions = [];
        this.updateKeyboardSpace = this.updateKeyboardSpace.bind(this);
        this.resetKeyboardSpace = this.resetKeyboardSpace.bind(this);
        this._textInputOnFocus = this._textInputOnFocus.bind(this);
        this.getScrollLayout = this.getScrollLayout.bind(this);
        this.shouhui = this.shouhui.bind(this);
        this.toReward = this.toReward.bind(this);
        this.toRealReward = this.toRealReward.bind(this);
        this.toWeekStarEvaluate = this.toWeekStarEvaluate.bind(this);
        this.toHistory = this.toHistory.bind(this);
        this.showAnswerSuccess = this.showAnswerSuccess.bind(this);
        this._scrollView = null;
        this.userScroll = null;
        this.scrollHandleInteval = null;
        //this.progressRefs = [];
        //this.delayTargetPress=this.delayTargetPress.bind(this);
    }

    toHistory() {
        let currentRoutes = this.props.navigator.getCurrentRoutes()
        let currentRoute = currentRoutes[currentRoutes.length - 1]
        let route = {
            name: 'WeekEvaluateHistory',
            type: 'WeekEvaluateHistory',
            path: 'none',
            component: WeekEvaluateHistory,
            index: currentRoute.index + 1
        }
        let {dispatch, pageModel} = this.props;
        let PageData = pageModel.PageData;
        PageData.checkUserUniqueid = this.state.selectRowData.userUniqueid;
        PageData.checkName = this.state.selectRowData.name;
        this.props.navigator.push(route);

    }

    toback() {
        let obj = {
            route: null,
            toBack: true,
            needInitUpdate: 0
        }
        updatePage(this.props.dispatch, obj);

        //this.props.navigator.pop();
    }

    componentWillMount() {
        let PageData = this.props.pageModel.PageData
        PageData.weekStarEvaluation = null;
        PageData.evaluations = null;
        // Keyboard events监听
        this.subscriptions = [
            Keyboard.addListener('keyboardWillShow', this.updateKeyboardSpace),
            Keyboard.addListener('keyboardWillHide', this.resetKeyboardSpace)]
    }

    componentWillUnmount() {
        this.subscriptions.forEach((sub) => sub.remove())
        if (this.scrollHandleInteval !== null) {
            clearInterval(this.scrollHandleInteval);
        }
        //clearPageInfo(this.props.dispatch, "clearWeekEvaluate");
    }

    componentDidUpdate() {
        return true;
    }

    componentDidMount() {
        let PageData = this.props.pageModel.PageData
        if (PageData.needInitUpdate !== undefined && PageData.needInitUpdate) {
            PageData.needInitUpdate = -1;
        }
        let postData = {
            token: PageData.token,
            userUniqueid: PageData.userUniqueid,
            orgUniqueid: PageData.orgUniqueid,
            type: "evaluateRelationship"
        }
        InteractionManager.runAfterInteractions(() => {
            getPeopleRelationship(this.props.dispatch, postData, false, {route: null}, "weekEvaluateUpdate");
        })

    }

    componentWillReceiveProps(nextProps) {
        let {pageModel} = nextProps;
        let {PageData, weekEvaluateInfo} = pageModel;
        let {pre_fetching_success} = this.props.pageModel.weekEvaluateInfo;
        let {fetching_success} = nextProps.pageModel.weekEvaluateInfo;
        if (pre_fetching_success !== fetching_success && fetching_success === true) {
            this.showAnswerSuccess();
        }

        if (PageData.needInitUpdate !== undefined && PageData.needInitUpdate !== null) {
            if (pageModel.PageData.needInitUpdate == 1) {
                this.doInitUpdate(this.state.selectRowData);
            } else if (pageModel.PageData.needInitUpdate == 0) {
                if (weekEvaluateInfo.userRelationships !== undefined && weekEvaluateInfo.userRelationships !== null && weekEvaluateInfo.userRelationships.length > 0) {
                    let rowData = weekEvaluateInfo.userRelationships[0];
                    this.state.selectPeopleIndex = 0;
                    this.state.selectRowData = rowData;
                    this.doInitUpdate(rowData);
                }
            } else {
            }
            pageModel.PageData.needInitUpdate = -1;
        }
    }

    setTimeoutFunction() {

    }

    showAnswerSuccess() {
        Keyboard.dismiss();
        this.setState({
            showSuccessAnswer: true
        });
        setTimeout(() => {
            this.setState({
                showSuccessAnswer: false
            })
        }, 1500);
    }

    doInitUpdate(rowData) {
        let PageData = this.props.pageModel.PageData
        let startDate = "";
        let endDate = "";
        let date = moment();
        if (date.day() == 0) {
            endDate = date.format("YYYY-MM-DD");
            startDate = date.day(-6).format("YYYY-MM-DD");
        } else {
            startDate = date.day(1).format("YYYY-MM-DD");
            endDate = date.day(7).format("YYYY-MM-DD");
        }
        let postData = {
            token: PageData.token,
            userUniqueid: rowData.userUniqueid,
            orgUniqueid: PageData.orgUniqueid,
            type: "chooseWeek",
            startDate: startDate,
            endDate: endDate
        };
        getSelfEvaluate(this.props.dispatch, postData, false, "weekEvaluateUpdate");
    }

// Keyboard actions
    updateKeyboardSpace(frames) {
        const keyboardSpace = frames.endCoordinates.height;//获取键盘高度
        this.setState({showShouhui: false, shouhuiBottom: keyboardSpace});
        this.scrollHandleInteval = setInterval(() => this.scrollHandle(), 1);
    }

    /**
     * 处理键盘出现后scrollView滚出
     */
    scrollHandle() {
        if (this.state.textInputIndexChange) {
            let heightTemp = deviceHeight;
            let y = 0;
            for (let i = 0; i < this.state.textInputIndex; i++) {
                let obj = this.state.rowItemRefs[i];
                if (obj != undefined && obj != null) {
                    y += obj.getContainerHeight();
                }
            }
            y += this.state.textInputIndex * 22 * changeRatio + 10;
            y += 135 * changeRatio;
            if (this.state.chargeRowItemRefs.length > 0) {
                let obj = this.state.chargeRowItemRefs[0];
            }
            this._scrollView && this._scrollView.scrollTo({y: y, animated: false});
            if (this.scrollHandleInteval !== null) {
                clearInterval(this.scrollHandleInteval);
            }
        }

    }

    resetKeyboardSpace() {
        this.setState({
            showShouhui: false,
            shouhuiBottom: 0,
            textInputIndexChange: false
        });
    }

    getScrollLayout(e) {
        //alert(e.nativeEvent.layout.y)
    }

    _textInputOnFocus(index) {
        this.setState({
            textInputIndex: index,
            textInputIndexChange: true,
        });
    }

    shouhui() {//收回
        let key = this.state.textInputIndex;
        this.state.rowItemRefs[key].toBlur();
    }

//选择人
    choosePeople(index, rowData) {
        let startDate = "";
        let endDate = "";
        let date = moment();
        // alert(date.day())
        if (date.day() == 0) {
            endDate = date.format("YYYY-MM-DD");
            startDate = date.day(-6).format("YYYY-MM-DD");
        } else {
            startDate = date.day(1).format("YYYY-MM-DD");
            endDate = date.day(7).format("YYYY-MM-DD");
        }
        let {PageData, weekEvaluateInfo} = this.props.pageModel;
        let postData = {
            token: PageData.token,
            userUniqueid: rowData.userUniqueid,
            orgUniqueid: PageData.orgUniqueid,
            type: "chooseWeek",
            startDate: startDate,
            endDate: endDate
        }
        if (weekEvaluateInfo.userRelationships !== undefined && weekEvaluateInfo.userRelationships !== null) {
            let size = weekEvaluateInfo.userRelationships.length;
            let width = deviceWidth;
            if (index >= 2 && index < size - 1) {
                this.userScroll.scrollTo({x: width / 5 * (index - 2)}, true);
            } else if (index < 2) {
                this.userScroll.scrollTo({x: 0}, true);
            }
        }
        PageData.evaluations = null;

        getSelfEvaluate(this.props.dispatch, postData, false, "weekEvaluateUpdate");
        this.setState({selectPeopleIndex: index, selectRowData: rowData})
        this._scrollView && this._scrollView.scrollTo({y: 0, animated: false});
    }

    chooseMorePeople() {//选择人员
        let currentRoutes = this.props.navigator.getCurrentRoutes()
        let currentRoute = currentRoutes[currentRoutes.length - 1]
        let route = {
            name: "ChoosePeople",
            type: 'ChoosePeople',
            path: 'none',
            component: ChoosePeople,
            index: currentRoute + 1,
            params: {
                actionType: "weekEvaluateUpdate"
            }
        }
        this.props.navigator.push(route);
    }

    toWeekStarEvaluate() {
        let currentRoutes = this.props.navigator.getCurrentRoutes()
        let currentRoute = currentRoutes[currentRoutes.length - 1]
        let {dispatch, pageModel} = this.props;
        let PageData = pageModel.PageData;
        PageData.checkUserUniqueid = this.state.selectRowData.userUniqueid;
        PageData.checkName = this.state.selectRowData.name;
        let route = {
            name: "WeekStarEvaluate",
            type: 'WeekStarEvaluate',
            path: 'none',
            component: WeekStarEvaluate,
            index: currentRoute + 1
            // tabManageInfo:tabManageInfo,
        };
        this.props.navigator.push(route);
    }

//设置Model可见与否
    _setModalVisibled(visible) {
        this.setState({modalVisible: visible});
    }

    toReward(eventUniqueid) {
        this.eventUniqueid = eventUniqueid;
        this.setState({modalVisible: true});
    }

    selectUB(key) {
        this.setState({selectUBKey: key});
    }

    toRealReward() {
        let PageData = this.props.pageModel.PageData;
        let {dispatch} = this.props;
        let rewardUB = 0;
        if (this.state.selectUBKey === 1) {
            rewardUB = 3;
        } else if (this.state.selectUBKey === 2) {
            rewardUB = 5;
        } else if (this.state.selectUBKey === 3) {
            rewardUB = 10;
        }
        if (rewardUB === 0) {
            Alert.alert("提示", "请先选择UB");
        } else {
            let postData = {
                token: PageData.token,
                userUniqueid: this.state.selectRowData.userUniqueid,
                eventUniqueid: this.eventUniqueid,
                orgUniqueid: PageData.orgUniqueid,
                reward: rewardUB,
                type: "weekEvaluateReward"
            };
            this.setState({modalVisible: false});
            rewardManage(dispatch, postData, {}, false, "weekEvaluateUpdate");
        }
    }

    render() {
        let {PageData, weekEvaluateInfo} = this.props.pageModel;
        let currentWeekGetRedPacketSize = 0;
        let currentWeekDailyReportSize = 0;
        let currentWeekGetWealth = 0;
        let currentWeekGetExploitValue = 0;
        let currentWeekGiveRedPacketList = [];
        let currentWeekQuestionOrSummarySize = 0;
        if (weekEvaluateInfo.currentWeekGetRedPacketSize) {
            currentWeekGetRedPacketSize = weekEvaluateInfo.currentWeekGetRedPacketSize;
        }
        if (weekEvaluateInfo.currentWeekDailyReportSize) {
            currentWeekDailyReportSize = weekEvaluateInfo.currentWeekDailyReportSize;
        }
        if (weekEvaluateInfo.currentWeekGetExploitValue) {
            currentWeekGetExploitValue = weekEvaluateInfo.currentWeekGetExploitValue;
        }
        if (weekEvaluateInfo.currentWeekGetWealth) {
            currentWeekGetWealth = weekEvaluateInfo.currentWeekGetWealth;
        }
        if (weekEvaluateInfo.currentWeekGiveRedPacketList) {
            currentWeekGiveRedPacketList = weekEvaluateInfo.currentWeekGiveRedPacketList;
        }
        if (weekEvaluateInfo.currentWeekQuestionOrSummarySize) {
            currentWeekQuestionOrSummarySize = weekEvaluateInfo.currentWeekQuestionOrSummarySize;
        }
        let width = this.props.layoutStyle.width
        let fontSizeMin = this.props.layoutStyle.width / 27;
        if (fontSizeMin > 14) {
            fontSizeMin = 14
        }
        let fontSizeMin2 = fontSizeMin + 1;
        let fontSizeMin3 = fontSizeMin2 + 1;
        let rightComponent = <TouchableOpacity onPress={this.toHistory}
                                               style={{justifyContent: "center",marginRight: 10*topBarRatio}}><Text
            style={{color: "#ffffff",fontSize: 17 * topBarRatio}}>历史</Text></TouchableOpacity>;
        let peoples = []
        let morePeople = []
        morePeople[0] = <TouchableOpacity key={"x-0-1-2-3-4"} onPress={this.chooseMorePeople}
                                          style={{width: width / 5,borderBottomWidth: 1,borderLeftWidth: 1,alignItems: "center",justifyContent: "center",borderColor: "rgb(196,204,213)",height: 40 * changeRatio}}>
            <Text style={{textAlign: "center",fontSize: 14 * changeRatio,color: "rgb(29,169,252)"}}>更多</Text>
        </TouchableOpacity>
        let widthSize = 5;
        if (weekEvaluateInfo.userRelationships !== undefined && weekEvaluateInfo.userRelationships !== null) {
            let size = weekEvaluateInfo.userRelationships.length;
            widthSize = 5
            for (let i = 0; i <= size - 1; i++) {
                let rowData = weekEvaluateInfo.userRelationships[i];
                if (rowData.initChoose !== undefined && rowData.initChoose !== null && rowData.initChoose == 1) {
                    if (this.state.selectPeopleIndex == -1) {
                        this.state.selectPeopleIndex = i;
                        this.state.selectRowData = rowData;
                        rowData.initChoose = 0;
                    }
                }
                let color = "rgb(196,204,213)"
                if (this.state.selectPeopleIndex == i) {
                    color = "rgb(29,169,252)"
                }
                peoples[i] = <TouchableOpacity key={i} index={i}
                                               style={{width: width / widthSize,height: 40 * changeRatio,alignItems: "center",justifyContent: "center"}}
                                               onPress={()=>this.choosePeople(i,rowData)}>
                    <Text numberOfLines={1}
                          style={{textAlign: "center",fontSize: 14 * changeRatio,color: color}}>{rowData.name}</Text>
                </TouchableOpacity>
            }

        }

        let rowScroll = <View
            style={{width: width / 5 * 4,borderBottomWidth: 1,borderColor: "rgb(196,204,213)"}}><ScrollView
            ref={(ref)=>this.userScroll = ref}
            horizontal
            scrollEnabled
            scrollEventThrottle={1000}
            showsHorizontalScrollIndicator={false}
            automaticallyAdjustContentInsets
        >
            {peoples}
        </ScrollView>
        </View>
        let userName = "";
        let userAvatar = null;
        let userInfo = this.state.selectRowData;
        if (userInfo !== undefined && userInfo !== null && userInfo !== "") {
            userName = userInfo.name;
            let url = handleUrl(userInfo.avatar);
            if (url) {
                userAvatar = {uri: url};
            } else {
                if (userInfo.sex == "男") {
                    userAvatar = ImageResource["header-boy@2x.png"];
                } else if (userInfo.sex == "女") {
                    userAvatar = ImageResource["header-girl@2x.png"];
                }
            }
        }
        let loginUserInfo = PageData.loginUserInfo;
        let wealth = 0;
        if (loginUserInfo !== undefined && loginUserInfo !== null) {
            wealth = loginUserInfo.wealth
        }

        let chargeRowItem = null;

        let canEvaluate = false;
        if (this.state.selectRowData !== undefined && this.state.selectRowData !== null) {
            if (this.state.selectRowData.canEvaluate === 1) {
                canEvaluate = true;
            }
        }
        let rowItems = [];
        var that = this;
        if (weekEvaluateInfo.evaluations !== undefined && weekEvaluateInfo.evaluations !== null) {
            commitSize = weekEvaluateInfo.evaluations.length;
            /* if (commitSize > 0 && commitSize < 5) {
             weekEvaluateInfo.evaluations.push(weekEvaluateInfo.evaluations[0]);
             weekEvaluateInfo.evaluations.push(weekEvaluateInfo.evaluations[0]);
             }*/


            rowItems = weekEvaluateInfo.evaluations.map(function (obj, index) {
                let isExist = false;
                if (obj && obj.kpiSEvalutionUniqueid) {
                    isExist = isExistToArray(currentWeekGiveRedPacketList, obj.kpiSEvalutionUniqueid, "eventUniqueid");
                }
                return <EvaluateRowItem showRedPacket={true} canEvaluate={canEvaluate} toReward={that.toReward}
                                        showReward={canEvaluate && !isExist} focusIndex={that._textInputOnFocus}
                                        ref={(e)=>that.state.rowItemRefs[index] = e} keyIndex={index} key={index}
                                        rowData={obj} {...that.props}/>
            });
        }

        return (
            <View style={[styles.container]}>
                {<View
                    style={[styles.loading,this.state.showSuccessAnswer?{zIndex:19999}:{zIndex:0,left:-2*deviceWidth}]}>
                    <View style={styles.mask}>
                        <Image style={styles.loadingImage} source={ImageResource["sendok@2x.png"]}>
                        </Image>
                        <Text style={styles.loadingText}>发送成功</Text>
                    </View>
                </View>
                }
                <View
                    style={[{position: "absolute",width: deviceWidth,height: deviceHeight,top: 0,left: 0,zIndex: 600,flex: 1,justifyContent: "center",alignItems: "center",backgroundColor: "rgba(0,0,0,0.5)"},this.state.modalVisible ? {} : {width: 0,height: 0,left: -deviceWidth,zIndex: -100}]}>
                    <TouchableOpacity onPress={this._setModalVisibled.bind(this,false)}
                                      style={{position: "absolute",top: 0,left: 0,width: deviceWidth,height: deviceHeight}}>
                    </TouchableOpacity>
                    <Image
                        style={{width: 225.5 * changeRatio,height: 350 * changeRatio,borderRadius: 6 * changeRatio,flex: 0}}
                        source={ImageResource["bg-redPacket-open@3x.png"]}>

                        <View style={{alignItems: "center",justifyContent: "center"}}>
                            <TouchableOpacity onPressIn={this._setModalVisibled.bind(this,false)}
                                              style={{position: "absolute",top: 5 * changeRatio,right: 5 * changeRatio}}>
                                <Image style={{width: 12 * changeRatio,height: 12 * changeRatio}}
                                       source={ImageResource["icon-redPacket-close@2x.png"]}/>
                            </TouchableOpacity>
                            <View
                                style={{marginTop: 55 * changeRatio,flex: 0,width: 60 * changeRatio,height: 60 * changeRatio,borderRadius: 30 * changeRatio,backgroundColor: imageViewBackgroundColor}}>
                                <Image
                                    style={{flex: 0,width: 60 * changeRatio,height: 60 * changeRatio,borderRadius: 30}}
                                    source={userAvatar}>
                                </Image>
                            </View>
                            <Text
                                style={{marginTop: 5 * changeRatio,fontSize: 18 * changeRatio,color: "#ffe6b4"}}>{userName}</Text>
                            <Text style={{marginTop: 5 * changeRatio,fontSize: 12 * changeRatio,color: "#ffe6b4"}}>辛苦一天了，为我充电吧！</Text>
                            <View style={{flex: 0,marginTop: 30 * changeRatio,flexDirection: "row"}}>
                                <TouchableOpacity onPress={()=>this.selectUB(1)}
                                                  style={[{justifyContent: "center",alignItems: "center",width: 70 * changeRatio,height: 44 * changeRatio,borderRadius: 6 * changeRatio,borderWidth: 1,borderColor: "#d4b278"},this.state.selectUBKey === 1 ? {backgroundColor: "rgba(0,0,0,0.1)"} : {}]}>
                                    <View style={{flexDirection: "row"}}>
                                        <Text style={{fontSize: 27 * changeRatio,color: "#ffe6b4"}}>3</Text>
                                        <Text
                                            style={{marginTop: 17 * changeRatio,fontSize: 10 * changeRatio,color: "#ffe6b4"}}>UB</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={()=>this.selectUB(2)}
                                                  style={[{justifyContent: "center",alignItems: "center",borderRadius: 6 * changeRatio,width: 70 * changeRatio,height: 44 * changeRatio,borderWidth: 1,borderColor: "#d4b278",marginLeft: 2 * changeRatio,marginRight: 2 * changeRatio},this.state.selectUBKey === 2 ? {backgroundColor: "rgba(0,0,0,0.1)"} : {}]}>
                                    <View style={{flexDirection: "row"}}>
                                        <Text style={{fontSize: 27 * changeRatio,color: "#ffe6b4"}}>5</Text>
                                        <Text
                                            style={{marginTop: 17 * changeRatio,fontSize: 10 * changeRatio,color: "#ffe6b4"}}>UB</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={()=>this.selectUB(3)}
                                                  style={[{justifyContent: "center",alignItems: "center",borderRadius: 6 * changeRatio,width: 70 * changeRatio,height: 44 * changeRatio,borderWidth: 1,borderColor: "#d4b278"},this.state.selectUBKey === 3 ? {backgroundColor: "rgba(0,0,0,0.1)"} : {}]}>
                                    <View style={{flexDirection: "row"}}>
                                        <Text style={{fontSize: 27 * changeRatio,color: "#ffe6b4"}}>10</Text>
                                        <Text
                                            style={{marginTop: 17 * changeRatio,fontSize: 10 * changeRatio,color: "#ffe6b4"}}>UB</Text>
                                    </View>
                                </TouchableOpacity>


                            </View>

                            <TouchableOpacity
                                style={{flex: 0,alignItems: "center",justifyContent: "center",marginTop: 40 * changeRatio,backgroundColor: "#ddbc84",width: 130 * changeRatio,height: 30 * changeRatio,borderRadius: 15}}
                                onPress={this.toRealReward}
                            >
                                <Text style={{fontSize: 18 * changeRatio,color: "#473d3b"}}>打赏</Text>
                            </TouchableOpacity>
                        </View>

                    </Image>


                </View>

                <TopBar
                    toback={this.toback}
                    layoutStyle={this.props.layoutStyle}
                    showRightImage={true}
                    rightComponent={rightComponent}
                    topBarText="下属点评"
                    topBarTextRight="今天"
                    showRight={false}
                    showLeft={true}
                />
                {this.state.showShouhui &&
                <View style={[this.props.layoutStyle,styles.btnView,{bottom: this.state.shouhuiBottom}]}>
                    <TouchableOpacity style={styles.submitBtn} onPress={this.shouhui}>
                        <Text style={styles.btnText}>收回</Text>
                    </TouchableOpacity>
                </View>
                }
                <View
                    style={[{flexDirection: "row",height: 40 * changeRatio,marginTop: topHeight,backgroundColor: "#ffffff"}]}>

                    {rowScroll}

                    {morePeople}
                </View>

                <ScrollView showsVerticalScrollIndicator={true}
                    //style={[{marginTop:55}]}
                            onLayout={this.getScrollLayout}
                            keyboardShouldPersistTaps={"handled"}
                            keyboardDismissMode='interactive'
                            removeClippedSubviews={false}
                            ref={(e)=>this._scrollView = e}
                            contentContainerStyle={[styles.contentContainer,{paddingBottom:125 * changeRatio}]}
                >
                    <View
                        style={{flex: 0,height: 135 * changeRatio,marginTop: 10 * changeRatio,backgroundColor: "#ffffff",flexDirection: "row"}}>
                        {canEvaluate ? <TouchableOpacity onPress={this.toWeekStarEvaluate}
                                                         style={{flex: 0,width: width / 4,justifyContent: "center",alignItems: "center",flexDirection: "column"}}>
                                <View
                                    style={{flex: 0,width: 60 * changeRatio,height: 60 * changeRatio,borderRadius: 30 * changeRatio,backgroundColor: imageViewBackgroundColor}}>
                                    <Image
                                        style={{flex: 0,width: 60 * changeRatio,height: 60 * changeRatio,borderRadius: 30 * changeRatio}}
                                        source={userAvatar}
                                    >
                                    </Image>
                                </View>
                                <View
                                    style={{flex: 0,width: 60 * changeRatio,borderRadius: 8,marginTop: 15,height: 20,justifyContent: "center",alignItems: "center",backgroundColor: "#1da9fc"}}>
                                    <Text style={{fontSize: 12 * changeRatio,color: "#ffffff"}}>周评</Text>
                                </View>
                            </TouchableOpacity>
                            :
                            <View onPress={this.toWeekStarEvaluate}
                                  style={{flex: 0,width: width / 4,justifyContent: "center",alignItems: "center",flexDirection: "column"}}>
                                <View
                                    style={{flex: 0,width: 60 * changeRatio,height: 60 * changeRatio,borderRadius: 30 * changeRatio,backgroundColor: imageViewBackgroundColor}}>
                                    <Image
                                        style={{flex: 0,width: 60 * changeRatio,height: 60 * changeRatio,borderRadius: 30 * changeRatio}}
                                        source={userAvatar}
                                    >
                                    </Image>
                                </View>
                                <View
                                    style={{flex: 0,width: 60 * changeRatio,borderRadius: 8 * changeRatio,marginTop: 15 * changeRatio,height: 20 * changeRatio,justifyContent: "center",alignItems: "center",backgroundColor: "#1da9fc"}}>
                                    <Text style={{fontSize: 12 * changeRatio,color: "#ffffff"}}>周评</Text>
                                </View>
                            </View>
                        }

                        <View style={{flex: 0}}>
                            <View
                                style={{flex: 0,height: 45 * changeRatio,width: width / 4 * 3,borderBottomWidth: 1,borderColor: "#e4ecf0",justifyContent: "center",alignItems: "center",flexDirection: "row"}}>
                                <Image
                                    style={{flex: 0,width: 18 * changeRatio,height: 18 * changeRatio,borderRadius: 9 * changeRatio}}
                                    source={ImageResource['icon-target-red@2x.png']}></Image>
                                <Text
                                    style={{marginLeft: 10 * changeRatio,flex: 0,fontSize: 14 * changeRatio,color: "#838f9f"}}>本周日报统计</Text>
                            </View>
                            <View style={styles.targetStatisticalDetail}>
                                <View style={styles.targetStatisticalDetailRow}>
                                    <View style={styles.targetStatisticalDetailRowTop}>
                                        <Text
                                            style={styles.targetStatisticalDetailRowTopText}>{currentWeekDailyReportSize}</Text>
                                    </View>
                                    <View style={styles.targetStatisticalDetailRowBottom}>
                                        <Text style={styles.targetStatisticalDetailRowBottomText}>日报提交</Text>
                                    </View>
                                </View>
                                <View style={styles.targetStatisticalDetailRow}>
                                    <View style={styles.targetStatisticalDetailRowTop}>
                                        <Text
                                            style={styles.targetStatisticalDetailRowTopText}>{currentWeekQuestionOrSummarySize}</Text>
                                    </View>
                                    <View style={styles.targetStatisticalDetailRowBottom}>
                                        <Text style={styles.targetStatisticalDetailRowBottomText}>小结次数</Text>
                                    </View>
                                </View>
                                <View style={styles.targetStatisticalDetailRow}>
                                    <View style={styles.targetStatisticalDetailRowTop}>
                                        <Text
                                            style={styles.targetStatisticalDetailRowTopText}>{currentWeekGiveRedPacketList.length}</Text>
                                    </View>
                                    <View style={styles.targetStatisticalDetailRowBottom}>
                                        <Text style={styles.targetStatisticalDetailRowBottomText}>打赏次数</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {rowItems}
                </ScrollView>
                <View style={{flex:0,height: this.state.shouhuiBottom}}>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //marginTop:45,

        //paddingTop:69,

        backgroundColor: "rgb(248,248,248)"
    },
    contentContainer: {
        paddingBottom: 125 * changeRatio,
        //padding:10,
        paddingTop: 0
    },
    starText: {
        fontSize: 14 * changeRatio,
        margin: 2 * changeRatio,
        width: 100 * changeRatio,
        color: "rgb(93,109,129)",
        marginLeft: 0
    },
    starStyle: {
        width: 15, height: 15,
        //flex:1,
        marginRight: 2 * changeRatio
    },
    starContainerStyle: {
        marginLeft: 5 * changeRatio, flex: 0, width: 80 * changeRatio
    },
    btnView: {
        flex: 1,
        //height:70,
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        paddingLeft: 5,
        paddingRight: 5,
        //width:500,
        height: 60 * changeRatio,
        zIndex: 500
    },
    btnAbsolute: {
        flex: 1,
        borderRadius: 8,
        // borderColor:'rgb(29,169,252)',
        backgroundColor: "rgb(29,169,252)",
        // borderWidth:1,
        //padding:10,
        height: 40 * changeRatio,
        margin: 10 * changeRatio,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 500,
        //height:70,
        marginRight: 5 * changeRatio,
        marginLeft: 5 * changeRatio
    },
    buttonText: {
        color: 'rgb(255,255,255)',
        fontSize: 15 * changeRatio
        //fontWeight:"400"
    },
    targetStatisticalDetail: {
        flex: 0,
        height: 90 * changeRatio,
        width: deviceWidth / 4 * 3,
        //backgroundColor:"red",
        //borderColor:"#e4ecf0",
        //borderTopWidth:1,
        //borderBottomWidth:1,
        flexDirection: "row"
    },
    targetStatisticalDetailRow: {
        width: deviceWidth / 4,
        height: 90 * changeRatio,
        flex: 0,
        alignItems: "center"
    },
    targetStatisticalDetailRowTop: {
        flex: 0,
        height: 40 * changeRatio,
        width: deviceWidth / 4,
        marginTop: 10 * changeRatio,
        justifyContent: "center",
        alignItems: "center"
    },
    targetStatisticalDetailRowTopText: {
        flex: 0,
        //lineHeight:40*changeRatio,
        fontSize: 20 * changeRatio,
        color: "#2b3d54"
    },
    targetStatisticalDetailRowBottom: {
        flex: 0,
        height: 28 * changeRatio,
        //marginBottom:12,
        justifyContent: "center",
        alignItems: "center"
    },
    targetStatisticalDetailRowBottomText: {
        flex: 0,
        //lineHeight:28*changeRatio,
        fontSize: 12 * changeRatio,
        color: "#838f9f"
    },
    btnView: {
        backgroundColor: '#ffffff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        //width:500,
        height: 60 * changeRatio,
        zIndex: 500,
        //alignItems: 'center',
        justifyContent: 'center'
    },
    submitBtn: {
        marginTop: 15 * changeRatio,
        borderRadius: 8 * changeRatio,
        borderColor: 'rgb(29,169,252)',
        backgroundColor: "rgb(29,169,252)",
        borderWidth: 1,
        //padding:15,
        margin: 10 * changeRatio,
        height: 40 * changeRatio,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnText: {
        color: "#ffffff",
        fontSize: 15 * changeRatio
    },
    bgRedImageTextRight: {
        fontSize: 12 * changeRatio,
        color: "#ffffff"
    },
    loading: {
        width: deviceWidth,
        height: deviceHeight,
        position: 'absolute',
        alignItems: "center",
        justifyContent: "center",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0,0,0,0)"
    },
    mask: {
        width: 120 * changeRatio,
        height: 120 * changeRatio,
        borderRadius: 10 * changeRatio,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    loadingImage: {
        height: 30 * changeRatio,
        width: 30 * changeRatio
    },
    loadingText: {
        marginTop: 10 * changeRatio,
        color: "#ffffff",
        fontSize: 15 * changeRatio,
    }
});

export default WeekEvaluate;