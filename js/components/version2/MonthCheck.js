/**
 * 月度审核
 * Created by yuanzhou on 17/02.
 */
import React, {Component} from "react"
import {
    InteractionManager,
    Alert,
    View,
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
import StarRating from '../common/StarRating'

import {
    clearPageInfo,
    getPeopleRelationship,
    getUserTarget,
    changeUserTargetProgress,
    updatePage,
    clientUserTargetDelayManage,
    clientUserTargetManage
} from '../../actions'
import moment from 'moment'
import Loader from '../common/Loader'
import config from '../../config'
import ChoosePeople from './ChooseUser'
import TargetProgress from './TargetProgress'
import TargetProgressCheck from './TargetProgressCheck'
import ProgressView from './ProgressView'
import  * as SizeController from '../../SizeController'
import {handleUrl} from '../../utils/UrlHandle'
let topHeight = SizeController.getTopHeight();
let tabBarHeight = SizeController.getTabBarHeight();
let changeRatio = SizeController.getChangeRatio();
const topBarRatio = SizeController.getTopBarRatio();
var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;
class MonthCheck extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fadeMin: new Animated.Value(0),
            selectPeopleIndex: -1,
            selectRowData: null,
            showLoading: false,
            selectTab: 0,
            scrollY: 0,
            keyboardHeight: 0,
            showFooter: false

        }
        this.toback = this.toback.bind(this);
        this.doInitUpdate = this.doInitUpdate.bind(this);
        this.choosePeople = this.choosePeople.bind(this);
        this.chooseMorePeople = this.chooseMorePeople.bind(this);
        this.updateProgress = this.updateProgress.bind(this);

        this.getScrollLayout = this.getScrollLayout.bind(this);
        this.toEditTarget = this.toEditTarget.bind(this);
        this._scrollView = null;
        this.userScroll = null;
        //this.progressRefs = [];
        //this.delayTargetPress=this.delayTargetPress.bind(this);
        this.toTargetProgressCheck = this.toTargetProgressCheck.bind(this);
    }

    toback() {
        let obj = {
            route: null,
            toBack: true,
            needInitUpdate: 1,
        }
        updatePage(this.props.dispatch, obj);

        //this.props.navigator.pop();
    }

    toTargetProgressCheck() {//去目标进度审核页面
        let {routeInfo, dispatch} = this.props;
        let route = {
            name: "TargetProgressCheck",
            type: 'TargetProgressCheck',
            path: 'none',
            component: TargetProgressCheck,
            index: routeInfo.index + 1,
            checkUserUniqueid: this.state.selectRowData.userUniqueid,
            checkName: this.state.selectRowData.name
        }
        this.props.navigator.push(route);
    }

    componentWillMount() {

    }

    componentWillUnmount() {
        // clearPageInfo(this.props.dispatch,"clearMonthCheck");
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
            type: "monthRelationship"
        }

        InteractionManager.runAfterInteractions(() => {
            getPeopleRelationship(this.props.dispatch, postData, false, {}, "monthCheckUpdate");
        })

    }

    componentWillReceiveProps(nextProps) {
        let {pageModel} = nextProps;
        let {PageData, monthCheckInfo} = pageModel;
        if (PageData.needInitUpdate !== undefined && PageData.needInitUpdate !== null) {
            if (pageModel.PageData.needInitUpdate == 1) {
                this.doInitUpdate(this.state.selectRowData);
            } else if (pageModel.PageData.needInitUpdate == 0) {
                if (monthCheckInfo.userRelationships !== undefined && monthCheckInfo.userRelationships !== null && monthCheckInfo.userRelationships.length > 0) {
                    let rowData = monthCheckInfo.userRelationships[0];
                    this.state.selectPeopleIndex = 0;
                    this.state.selectRowData = rowData;
                    this.doInitUpdate(rowData);
                }
            } else {
            }
            pageModel.PageData.needInitUpdate = -1;
        }
    }

    doInitUpdate(rowData) {
        let PageData = this.props.pageModel.PageData
        if (PageData.needInitUpdate !== undefined && PageData.needInitUpdate) {
            PageData.needInitUpdate = -1;
        }
        let postData = {
            token: PageData.token,
            userUniqueid: rowData.userUniqueid,
            orgUniqueid: PageData.orgUniqueid,
        }
        getUserTarget(this.props.dispatch, postData, {}, false, "monthCheckUpdate");
        // getPeopleRelationship(this.props.dispatch,postData,false,{route:null});
    }

    getScrollLayout(e) {
        //alert(e.nativeEvent.layout.y)
    }

    //选择人
    choosePeople(index, rowData) {
        let {PageData, monthCheckInfo} = this.props.pageModel
        let postData = {
            token: PageData.token,
            userUniqueid: rowData.userUniqueid,
            orgUniqueid: PageData.orgUniqueid,
        }
        if (monthCheckInfo.userRelationships !== undefined && monthCheckInfo.userRelationships !== null) {
            let size = monthCheckInfo.userRelationships.length;
            let width = deviceWidth;
            if (index >= 2 && index < size - 1) {
                this.userScroll.scrollTo({x: (width / 5 * (index - 2))}, true);
            } else if (index < 2) {
                this.userScroll.scrollTo({x: 0}, true);
            }
        }

        getUserTarget(this.props.dispatch, postData, {}, false, "monthCheckUpdate");
        this.setState({selectTab: 0, showFooter: false, selectPeopleIndex: index, selectRowData: rowData})
    }

    chooseMorePeople() {//选择人员

        let currentRoutes = this.props.navigator.getCurrentRoutes()
        this.setState({showFooter: false});
        let currentRoute = currentRoutes[currentRoutes.length - 1]
        let route = {
            name: "ChoosePeople",
            type: 'ChoosePeople',
            path: 'none',
            component: ChoosePeople,
            index: currentRoute + 1,
            params: {
                actionType: "monthCheckUpdate"
            }
            // tabManageInfo:tabManageInfo,
        }
        this.props.navigator.push(route);
    }

    toEditTarget(key) {

    }

    selectTab(index) {//选择tab
        if (this.state.selectTab !== index) {
            this.setState({selectTab: index, showFooter: true});
            if (this.state.selectRowData) {
                let PageData = this.props.pageModel.PageData
                let postData = {
                    token: PageData.token,
                    userUniqueid: this.state.selectRowData.userUniqueid,
                    orgUniqueid: PageData.orgUniqueid,
                }
                getUserTarget(this.props.dispatch, postData, {}, true, "monthCheckUpdate")
            }
        }
    }

    delayTargetPress(kpiMTargetUniqueid, key) {//目标延期

        let {dispatch, pageModel} =  this.props;
        let rowData = this.state.selectRowData;
        let PageData = pageModel.PageData;
        let postData = {
            token: PageData.token,
            userUniqueid: rowData.userUniqueid,
            orgUniqueid: PageData.orgUniqueid,
            kpiMTargetUniqueid: kpiMTargetUniqueid,
            x_token: PageData.token,
            type: "chargeDelay"
        }
        //alert(this.props.navigator.getCurrentRoutes()[0].index)
        let obj = {
            route: null,
            toBack: false,
            needInitUpdate: -1,
        }
        clientUserTargetDelayManage(this.props.dispatch, postData, obj, false, "monthCheckUpdate")
    }

    deleteTargetPress(kpiMTargetUniqueid, key) {//删除目标


        let {dispatch, pageModel} =  this.props;
        let rowData = this.state.selectRowData;
        let PageData = pageModel.PageData;
        let removeKpiMTargetUniqueidList = [];
        removeKpiMTargetUniqueidList[0] = kpiMTargetUniqueid;
        let postData = {
            token: PageData.token,
            userUniqueid: rowData.userUniqueid,
            orgUniqueid: PageData.orgUniqueid,
            removeKpiMTargetUniqueidList: removeKpiMTargetUniqueidList,
            x_token: PageData.token,
            type: "chargeDeleteTarget"
        }
        //alert(this.props.navigator.getCurrentRoutes()[0].index)
        let obj = {
            route: null,
            toBack: false,
            needInitUpdate: -1,
        }
        clientUserTargetManage(this.props.dispatch, postData, obj, false, "monthCheckUpdate")
    }

    delayTargetClose(kpiMTargetUniqueid, kpiMTDelayUniqueid) {
        let {dispatch, pageModel} =  this.props;
        let rowData = this.state.selectRowData;
        let PageData = pageModel.PageData;
        let postData = {
            token: PageData.token,
            userUniqueid: rowData.userUniqueid,
            orgUniqueid: PageData.orgUniqueid,
            kpiMTargetUniqueid: kpiMTargetUniqueid,
            kpiMTDelayUniqueid: kpiMTDelayUniqueid,
            x_token: PageData.token,
            type: "chargeEnsureCloseDelayTarget"
        }
        //alert(this.props.navigator.getCurrentRoutes()[0].index)
        let obj = {
            route: null,
            toBack: false,
            needInitUpdate: -1,
        }
        clientUserTargetDelayManage(this.props.dispatch, postData, obj, false, "monthCheckUpdate")
    }

    updateProgress(progress, kpiMTargetUniqueid) {//更新进度
        let kpiMTargetUniqueidArray = [];
        let progressArray = [];
        kpiMTargetUniqueidArray[0] = kpiMTargetUniqueid;
        let rowData = this.state.selectRowData;
        progressArray[0] = progress + "";
        let PageData = this.props.pageModel.PageData
        let postData = {
            kpiMTargetUniqueidArray: kpiMTargetUniqueidArray,
            progressArray: progressArray,
            token: PageData.token,
            userUniqueid: rowData.userUniqueid,
            orgUniqueid: PageData.orgUniqueid,
            type: "chargeAdjust"

        }
        changeUserTargetProgress(this.props.dispatch, postData, null, "monthCheckUpdate");
    }

    changeTitleText(title, kpiMTargetUniqueid) {//更新目标
        let rowData = this.state.selectRowData;
        let PageData = this.props.pageModel.PageData
        let postData = {
            token: PageData.token,
            userUniqueid: rowData.userUniqueid,
            orgUniqueid: PageData.orgUniqueid,
            kpiMTargetUniqueid: kpiMTargetUniqueid,
            content: title,
            x_token: PageData.token,
            type: "chargeUpdateTarget"
        }
        let obj = {
            route: null,
            toBack: false,
            needInitUpdate: -1,
        }
        clientUserTargetManage(this.props.dispatch, postData, obj, false, "monthCheckUpdate")
    }

    onScroll(e) {
        //console.log(e)
    }

    render() {
        //   {this.state.showLoading && <Loader zIndex={this.state.showLoading?999:0}/>}
        let {PageData, monthCheckInfo} = this.props.pageModel;

        let currentMonthCompleteTargeSize = 0;
        let currentMonthCloseDelaySize = 0;
        let currentMonthExploitValue = 0;
        let currentMonthDelayTargetSize = 0;
        if (monthCheckInfo.currentMonthCloseDelaySize !== undefined && monthCheckInfo.currentMonthCloseDelaySize !== null) {
            currentMonthCloseDelaySize = monthCheckInfo.currentMonthCloseDelaySize;
        }
        if (monthCheckInfo.currentMonthCompleteTargeSize !== undefined && monthCheckInfo.currentMonthCompleteTargeSize !== null) {
            currentMonthCompleteTargeSize = monthCheckInfo.currentMonthCompleteTargeSize;
        }
        if (monthCheckInfo.currentMonthExploitValue !== undefined && monthCheckInfo.currentMonthExploitValue !== null) {
            currentMonthExploitValue = monthCheckInfo.currentMonthExploitValue;
        }
        if (monthCheckInfo.currentMonthDelayTargetSize !== undefined && monthCheckInfo.currentMonthDelayTargetSize !== null) {
            currentMonthDelayTargetSize = monthCheckInfo.currentMonthDelayTargetSize;
        }
        let width = this.props.layoutStyle.width
        let fontSizeMin = (this.props.layoutStyle.width) / 27;
        if (fontSizeMin > 14) {
            fontSizeMin = 14
        }
        let fontSizeMin2 = fontSizeMin + 1;
        let fontSizeMin3 = fontSizeMin2 + 1;
        // let scrollEnabled = true;
        let rightComponent = <TouchableOpacity onPress={this.rilicontrol}
                                               style={{justifyContent:"center",padding:15*changeRatio,paddingRight:10*changeRatio,marginRight:0}}><Image
            source={ImageResource["rili.png"]}
            style={{width:20*topBarRatio,height:20*topBarRatio}}/></TouchableOpacity>;
        let peoples = []
        let morePeople = []
        morePeople[0] = <TouchableOpacity key={"x-0-1-2-3-4"} onPress={this.chooseMorePeople}
                                          style={{width:width/5,borderBottomWidth:1,borderLeftWidth:1,alignItems:"center",justifyContent:"center",borderColor:"rgb(196,204,213)",height:40*changeRatio}}>
            <Text style={{textAlign:"center",fontSize:14*changeRatio,color:"rgb(29,169,252)"}}>更多</Text>
        </TouchableOpacity>

        let widthSize = 5;
        if (monthCheckInfo.userRelationships !== undefined && monthCheckInfo.userRelationships !== null) {
            let size = monthCheckInfo.userRelationships.length;
            widthSize = 5
            for (let i = 0; i <= size - 1; i++) {
                let rowData = monthCheckInfo.userRelationships[i];
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
                                               style={{width:width/widthSize,height:40*changeRatio,alignItems:"center",justifyContent:"center"}}
                                               onPress={()=>this.choosePeople(i,rowData)}>
                    <Text numberOfLines={1}
                          style={{textAlign:"center",fontSize:14*changeRatio,color:color}}>{rowData.name}</Text>
                </TouchableOpacity>
            }

        }

        let rowScroll = <View style={{width:width/5*4,borderBottomWidth:1,borderColor:"rgb(196,204,213)"}}><ScrollView
            ref={(ref)=>this.userScroll=ref}
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
        //let value = "";
        let userInfo = this.state.selectRowData;
        if (userInfo !== undefined && userInfo !== null && userInfo !== "") {
            name = userInfo.name;
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


        let lastMonthTargetsList = [];
        let nowMonthTargetsList = [];
        let lastMonthTargetSize = 0;
        let nowMonthTargetSize = 0;
        let totalProgess = 0;
        let hadFinishedTargetSize = 0;
        let closeDelaySize = 0;
        let nowMonthDelaySize = 0;
        //上月遗留目标
        let that = this;
        if (monthCheckInfo.lastMonthTargets !== undefined && monthCheckInfo.lastMonthTargets !== null) {
            lastMonthTargetSize = monthCheckInfo.lastMonthTargets.length;

        }
        if (monthCheckInfo.passTargets !== undefined && monthCheckInfo.passTargets !== null) {
            nowMonthTargetSize = monthCheckInfo.passTargets.length;
            nowMonthTargetsList = monthCheckInfo.passTargets.map(function (obj, key) {
                let progressTemp = obj.progress * 0.3 + obj.superiorAdjustProgress * 0.7;
                totalProgess += progressTemp;
                if (progressTemp >= 1) {
                    hadFinishedTargetSize++;
                }
            });

        }
        let progressViewData = [];
        let progressViewType = "";
        if (this.state.selectTab === 0) {
            progressViewType = "chargeCheckPassTargets";
            progressViewData = monthCheckInfo.passTargets;
        } else {
            progressViewType = "chargeCheckDelayTargets";
            progressViewData = monthCheckInfo.lastMonthTargets;
        }
        let canEvaluate = false;
        if (this.state.selectRowData !== undefined && this.state.selectRowData !== null) {
            if (this.state.selectRowData.canEvaluate === 1) {
                canEvaluate = true;
            }
        }
        return (
            <View style={[styles.container]}>
                <TopBar
                    toback={this.toback}
                    layoutStyle={this.props.layoutStyle}
                    showRightImage={false}
                    rightComponent={rightComponent}
                    topBarText="下属考评"
                    topBarTextRight="今天"
                    showRight={false}
                    showLeft={true}
                />

                <View
                    style={[{flexDirection:"row",height:40*changeRatio,marginTop:topHeight,backgroundColor:"#ffffff"}]}>

                    {rowScroll}

                    {morePeople}
                </View>


                <ScrollView showsVerticalScrollIndicator={true}
                    //style={[{marginTop:55}]}
                    //stickyHeaderIndices={[1]}
                            onScroll={(e)=>this.onScroll(e)}
                            onLayout={this.getScrollLayout}
                            keyboardShouldPersisTaps={true}
                            canCancelContentTouches={this.state.canCancelContentTouches}
                            alwaysBounceVertical={true}
                            keyboardDismissMode='interactive'
                            ref={(e)=>this._scrollView=e}
                            contentContainerStyle={styles.contentContainer}
                >
                    <View
                        style={{flex:1,height:135*changeRatio,marginTop:10*changeRatio,backgroundColor:"#ffffff",flexDirection:"row"}}>
                        {canEvaluate ?
                            <TouchableOpacity onPress={this.toTargetProgressCheck}
                                              style={{flex:0,width:width/4,justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
                                <View
                                    style={{flex:0,width:60*changeRatio,height:60*changeRatio,borderRadius:30*changeRatio,backgroundColor:"rgb(248,248,248)"}}>
                                    <Image
                                        style={{flex:0,width:60*changeRatio,height:60*changeRatio,borderRadius:30*changeRatio}}
                                        source={userAvatar}></Image>
                                </View>
                                <View
                                    style={{flex:0,width:60*changeRatio,borderRadius:8*changeRatio,marginTop:15*changeRatio,height:20*changeRatio,justifyContent:"center",alignItems:"center",backgroundColor:"#1da9fc"}}>
                                    <Text style={{fontSize:12*changeRatio,color:"#ffffff"}}>进度考评</Text>
                                </View>
                            </TouchableOpacity>
                            :
                            <View onPress={this.toTargetProgressCheck}
                                  style={{flex:0,width:width/4,justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
                                <View
                                    style={{flex:0,width:60*changeRatio,height:60*changeRatio,borderRadius:30*changeRatio,backgroundColor:"rgb(248,248,248)"}}>
                                    <Image
                                        style={{flex:0,width:60*changeRatio,height:60*changeRatio,borderRadius:30*changeRatio}}
                                        source={userAvatar}></Image>
                                </View>
                                <View
                                    style={{flex:0,width:60*changeRatio,borderRadius:8*changeRatio,marginTop:15*changeRatio,height:20*changeRatio,justifyContent:"center",alignItems:"center",backgroundColor:"#1da9fc"}}>
                                    <Text style={{fontSize:12*changeRatio,color:"#ffffff"}}>进度考评</Text>
                                </View>
                            </View>
                        }
                        <View style={{flex:0}}>
                            <View
                                style={{flex:0,height:45*changeRatio,width:width/4*3,borderBottomWidth:1,borderColor:"#e4ecf0",justifyContent:"center",alignItems:"center",flexDirection:"row"}}>
                                <Image
                                    style={{flex:0,width:18*changeRatio,height:18*changeRatio,borderRadius:9*changeRatio}}
                                    source={ImageResource['icon-target-red@2x.png']}></Image>
                                <Text
                                    style={{marginLeft:10*changeRatio,flex:0,fontSize:14*changeRatio,color:"#838f9f"}}>本月目标统计</Text>
                            </View>
                            <View style={styles.targetStatisticalDetail}>
                                <View style={styles.targetStatisticalDetailRow}>
                                    <View style={styles.targetStatisticalDetailRowTop}>
                                        <Text
                                            style={styles.targetStatisticalDetailRowTopText}>{currentMonthCompleteTargeSize}</Text>
                                    </View>
                                    <View style={styles.targetStatisticalDetailRowBottom}>
                                        <Text style={styles.targetStatisticalDetailRowBottomText}>已完成</Text>
                                    </View>
                                </View>
                                <View style={styles.targetStatisticalDetailRow}>
                                    <View style={styles.targetStatisticalDetailRowTop}>
                                        <Text
                                            style={styles.targetStatisticalDetailRowTopText}>{currentMonthCloseDelaySize}</Text>
                                    </View>
                                    <View style={styles.targetStatisticalDetailRowBottom}>
                                        <Text style={styles.targetStatisticalDetailRowBottomText}>结束延期</Text>
                                    </View>
                                </View>
                                <View style={styles.targetStatisticalDetailRow}>
                                    <View style={styles.targetStatisticalDetailRowTop}>
                                        <Text
                                            style={styles.targetStatisticalDetailRowTopText}>{currentMonthDelayTargetSize}</Text>
                                    </View>
                                    <View style={styles.targetStatisticalDetailRowBottom}>
                                        <Text style={styles.targetStatisticalDetailRowBottomText}>本月延期</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View
                        style={[{flex:0,width:width-20*changeRatio,borderRadius:8*changeRatio,flexDirection:"row",height:30*changeRatio,marginLeft:10*changeRatio,marginRight:10*changeRatio,marginTop:20*changeRatio,backgroundColor:"#ffffff"},this.state.selectTab===0?{backgroundColor:"#1da9fc"}:{backgroundColor:"#ffffff"}]}>
                        <TouchableOpacity onPress={()=>this.selectTab(0)}
                                          style={[{flex:0,borderTopLeftRadius:8*changeRatio,borderBottomLeftRadius:8*changeRatio,justifyContent:"center",alignItems:"center",width:(width-20*changeRatio)/2,height:30*changeRatio,backgroundColor:"#1da9fc"},this.state.selectTab===0?{backgroundColor:"#1da9fc"}:{backgroundColor:"#ffffff"}]}>
                            <Text
                                style={[{fontSize:16*changeRatio,color:"#ffffff"},this.state.selectTab===0?{color:"#ffffff"}:{color:"#1da9fc"}]}>本月目标</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.selectTab(1)}
                                          style={[{flex:0,width:(width-20*changeRatio)/2,borderTopRightRadius:8*changeRatio,borderBottomRightRadius:8*changeRatio,justifyContent:"center",alignItems:"center",height:30*changeRatio,backgroundColor:"#ffffff"},this.state.selectTab===1?{backgroundColor:"#1da9fc"}:{backgroundColor:"#ffffff"}]}>
                            <Text
                                style={[{fontSize:16*changeRatio,color:"#1da9fc"},this.state.selectTab===1?{color:"#ffffff"}:{color:"#1da9fc"}]}>延期目标</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1,marginTop:20*changeRatio}}>
                        {this.state.selectTab === 0 ? <ProgressView focusIndex={this._textInputOnFocus}
                                                                    showProgressError={this.showProgressError}
                                                                    sliderValueChange={this.updateProgress}
                                                                    showFooter={this.state.showFooter}
                                {...this.props}
                                                                    canEvaluate={canEvaluate}
                                                                    delayTargetPress={this.delayTargetPress.bind(this)}
                                                                    toEditTarget={this.toEditTarget.bind(this)}
                                                                    deleteTargetPress={this.deleteTargetPress.bind(this)}
                                                                    delayTargetClose={this.delayTargetClose.bind(this)}
                                                                    data={monthCheckInfo.passTargets}
                                                                    type={"chargeCheckPassTargets"}
                                                                    layoutStyle={this.props.layoutStyle}
                                                                    isMostLevel={PageData.isMostLevel}
                                                                    style={{flex:1}}
                            />
                            :
                            <ProgressView focusIndex={this._textInputOnFocus}
                                          showProgressError={this.showProgressError}
                                          sliderValueChange={this.updateProgress}
                                          showFooter={this.state.showFooter}
                                {...this.props}
                                          canEvaluate={canEvaluate}
                                          delayTargetPress={this.delayTargetPress.bind(this)}
                                          toEditTarget={this.toEditTarget.bind(this)}
                                          deleteTargetPress={this.deleteTargetPress.bind(this)}
                                          delayTargetClose={this.delayTargetClose.bind(this)}
                                          data={monthCheckInfo.lastMonthTargets}
                                          type={"chargeCheckDelayTargets"}
                                          layoutStyle={this.props.layoutStyle}
                                          isMostLevel={PageData.isMostLevel}
                                          style={{flex:1}}
                            />
                        }
                    </View>
                </ScrollView>
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
        paddingTop: 0,
    },
    starText: {
        fontSize: 14 * changeRatio,
        margin: 2 * changeRatio,
        width: 100 * changeRatio,
        color: "rgb(93,109,129)",
        marginLeft: 0,
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
        alignItems: "center",
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
        color: "#2b3d54",
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
        //lineHeight:28,
        fontSize: 12 * changeRatio,
        color: "#838f9f",
    },
    btnView: {
        backgroundColor: '#ffffff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        flex: 0,
        flex: 1,
        height: 40,
        zIndex: 500,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitBtn: {
        //borderRadius:8,
        //borderColor:'rgb(29,169,252)',
        //backgroundColor:"rgb(29,169,252)",
        //borderWidth:1,
        //width:(deviceWidth-30)/2,
        //flex:1,
        //padding:15,

        //marginTop:10,
        //marginBottom:10,
        height: 40,
        width: 60,
        justifyContent: 'center',
    },
    btnText: {
        color: "rgb(29,169,252)",
        fontSize: 15,
    },
});

export default MonthCheck;