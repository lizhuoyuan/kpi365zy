/**
 * 报告（日报）页
 * Created by yuanzhou on 17/02.
 */
import React, {Component} from 'react'
import {
    InteractionManager,
    Modal,
    Alert,
    RefreshControl,
    PanResponder,
    Platform,
    Animated,
    ScrollView,
    Easing,
    StyleSheet,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    Text
} from 'react-native'
import TopBar from '../common/TopBar'
import IconTitle from '../common/IconTitle'
import ImageResource from '../../utils/ImageResource'
import moment from 'moment'
import {
    getSelfEvaluate,
    clearPageInfo,
    rewardManage,
    updatePage
} from '../../actions'
import WeekEvaluateHistory from './WeekEvaluateHistory'
import StarRating from '../common/StarRating'
import Evaluate from '../Evaluate'
import WeekEvaluate from './WeekEvaluate'
import EvaluateRowItem from './EvaluateRowItem'
import  * as SizeController from '../../SizeController'
const topHeight = SizeController.getTopHeight();
const tabBarHeight = SizeController.getTabBarHeight();
const changeRatio = SizeController.getChangeRatio();
const topBarRatio = SizeController.getTopBarRatio();
const redPacketTop = (15 + (55 - 20) / 2) * changeRatio;
const redPacketRight = 10 * changeRatio;
const redPacketWidth = 20;
const redPacketHeight = 20;
const imageViewBackgroundColor = "rgb(228,236,240)";
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class DailyReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            delayTop: new Animated.Value(320),
            marginAnimated: new Animated.Value(20),
            nowTop: new Animated.Value(500),
            borderRadiusAnimated: new Animated.Value(15),
            widthAnimated: new Animated.Value(deviceWidth - 40),
            opacityAnimated: new Animated.Value(1),
            opacityAnimatedShow: new Animated.Value(0),
            toDelayTarget: false,
            toNowTarget: false,
            canCancelContentTouches: true,
            sliderUniqueid: null,
            selectDate: moment(),
            isRefreshing: false,
            modalVisible: false,
            showRewardPacket: false,
            animatedShow: new Animated.Value(0),
            redPacketShow: new Animated.Value(0),
            redPacketWidth: new Animated.Value(redPacketWidth),
            redPacketHeight: new Animated.Value(redPacketHeight),
            redPacketTop: new Animated.Value(redPacketTop),
            redPacketRight: new Animated.Value(redPacketRight),
            hadShowRedPacket: false,
            isEndAnimated: false,
            isFirstInit: true

        };
        this.toback = this.toback.bind(this);
        this.toWeekEvaluate = this.toWeekEvaluate.bind(this);
        this.writeDailyReport = this.writeDailyReport.bind(this);
        this.toHistory = this.toHistory.bind(this);
        this.doInitUpdate = this.doInitUpdate.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        this._toOpenRedPacket = this._toOpenRedPacket.bind(this);
        this._toStillOpenRedPacket = this._toStillOpenRedPacket.bind(this);
        this.doAnimated = this.doAnimated.bind(this);
        //this.doAnimated2=this.doAnimated2.bind(this);
        this.doRedPacketAnimate = this.doRedPacketAnimate.bind(this);
    }

    static defaultProps = {
        showBack: true
    };

    componentWillMount() {

    }

    componentDidMount() {
        let PageData = this.props.pageModel.PageData
        let startDate = "";
        let endDate = "";
        let date = this.state.selectDate;
        if (moment(date).day() == 0) {
            startDate = moment(date).day(-6).format("YYYY-MM-DD");
            endDate = moment(date).day(0).format("YYYY-MM-DD");
        } else {
            startDate = moment(date).day(1).format("YYYY-MM-DD");
            endDate = moment(date).day(7).format("YYYY-MM-DD");
        }
        let postData = {
            token: PageData.token,
            userUniqueid: PageData.userUniqueid,
            orgUniqueid: PageData.orgUniqueid,
            type: "selfWeekNeedPacket",
            startDate: startDate,
            endDate: endDate
        }

        InteractionManager.runAfterInteractions(() => {
            getSelfEvaluate(this.props.dispatch, postData, false, "toDailyReport");
        });
    }

    componentWillReceiveProps(nextProps) {
        let {pageModel} = nextProps;
        let PageData = pageModel.PageData;
        let dailyReportInfo = pageModel.dailyReportInfo
        let selfNeedOpenRedPacketSize = 0;
        if (dailyReportInfo.selfNeedOpenRedPacketSize !== undefined && dailyReportInfo.selfNeedOpenRedPacketSize !== null) {
            selfNeedOpenRedPacketSize = dailyReportInfo.selfNeedOpenRedPacketSize;
        }
        if (dailyReportInfo.isRefreshing !== undefined && dailyReportInfo.isRefreshing !== null) {
            this.setState({isRefreshing: dailyReportInfo.isRefreshing});
        }
        if (PageData.needInitUpdate) {
            if (pageModel.PageData.needInitUpdate === 0 || pageModel.PageData.needInitUpdate === 1) {
                this.doInitUpdate();
                pageModel.PageData.needInitUpdate = -1;
            } else {
                pageModel.PageData.needInitUpdate = -1;
                if (this.state.isFirstInit && !this.state.hadShowRedPacket && selfNeedOpenRedPacketSize > 0) {
                    this._setModalVisibled(true);
                }
            }
        } else {
            if (this.state.isFirstInit && !this.state.hadShowRedPacket && selfNeedOpenRedPacketSize > 0) {
                this._setModalVisibled(true);
            }
        }

    }

    doRedPacketAnimate() {
        this.state.redPacketHeight.setValue(redPacketHeight);
        this.state.redPacketShow.setValue(0);
        this.state.redPacketTop.setValue(redPacketTop);
        this.state.redPacketRight.setValue(redPacketRight);
        this.state.redPacketWidth.setValue(redPacketWidth);
        let toRight = (deviceWidth - 225.5 * changeRatio) / 2;
        let toTop = (deviceHeight - 350 * changeRatio) / 2;
        Animated.parallel(
            [
                Animated.timing(this.state.redPacketHeight, {
                    toValue: 350,
                    duration: 0.75 * 1000,//7
                    // tension
                    easing: Easing.out(Easing.ease),
                }),
                Animated.timing(this.state.redPacketWidth, {
                    toValue: 225.5,
                    duration: 0.75 * 1000,//7
                    // tension
                    easing: Easing.out(Easing.ease),
                }),
                Animated.timing(this.state.redPacketTop, {
                    toValue: toTop,
                    duration: 0.75 * 1000,//7
                    // tension
                    easing: Easing.out(Easing.ease),
                }),
                Animated.timing(this.state.redPacketRight, {
                    toValue: toRight,
                    duration: 0.75 * 1000,//7
                    // tension
                    easing: Easing.out(Easing.ease),
                }),

                //Animated.sequence([Animated.timing(this.state.redPacketShow,{toValue:360,
                //  duration:0.5*1000,//7
                // tension
                //easing:Easing.out(Easing.ease)
                //})
                //]),

            ]).start();
    }

    doInitUpdate() {
        let PageData = this.props.pageModel.PageData
        let startDate = "";
        let endDate = "";
        let date = this.state.selectDate;
        if (moment(date).day() == 0) {
            startDate = moment(date).day(-6).format("YYYY-MM-DD");
            endDate = moment(date).day(0).format("YYYY-MM-DD");
        } else {
            startDate = moment(date).day(1).format("YYYY-MM-DD");
            endDate = moment(date).day(7).format("YYYY-MM-DD");
        }
        let postData = {
            token: PageData.token,
            userUniqueid: PageData.userUniqueid,
            orgUniqueid: PageData.orgUniqueid,
            type: "selfWeekNeedPacket",
            startDate: startDate,
            endDate: endDate
        }
        getSelfEvaluate(this.props.dispatch, postData, false, "toDailyReport");
    }

    //刷新数据
    _onRefresh() {
        this.setState({isRefreshing: true})
        let PageData = this.props.pageModel.PageData
        let startDate = "";
        let endDate = "";
        let date = this.state.selectDate;
        if (moment(date).day() == 0) {
            startDate = moment(date).day(-6).format("YYYY-MM-DD");
            endDate = moment(date).day(0).format("YYYY-MM-DD");
        } else {
            startDate = moment(date).day(1).format("YYYY-MM-DD");
            endDate = moment(date).day(7).format("YYYY-MM-DD");
        }
        let postData = {
            token: PageData.token,
            userUniqueid: PageData.userUniqueid,
            orgUniqueid: PageData.orgUniqueid,
            type: "selfWeekNeedPacket",
            startDate: startDate,
            endDate: endDate
        }
        getSelfEvaluate(this.props.dispatch, postData, true, "toDailyReport");
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
        let {dispatch, pageModel} =  this.props;
        let PageData = pageModel.PageData;
        PageData.checkUserUniqueid = PageData.userUniqueid;
        PageData.checkName = PageData.loginUserInfo.name;
        this.props.navigator.push(route);

    }

    writeDailyReport() {

        let currentRoutes = this.props.navigator.getCurrentRoutes()
        let currentRoute = currentRoutes[currentRoutes.length - 1]
        let route = {
            name: 'Evaluate',
            type: 'Evaluate',
            path: 'none',
            component: Evaluate,
            index: currentRoute.index + 1
        }
        this.props.navigator.push(route);


    }

    _canCancelContentTouches(isCan) {
        this.setState({
            canCancelContentTouches: isCan
        })
    }

    toWeekEvaluate() {
        let isManage = false;
        let identitys = this.props.pageModel.PageData.identitys;
        if (identitys !== undefined && identitys !== null) {
            if (identitys.length > 0) {
                isManage = true
            }
        }
        if (isManage) {
            let currentRoutes = this.props.navigator.getCurrentRoutes()
            let currentRoute = currentRoutes[currentRoutes.length - 1]
            let route = {
                name: 'WeekEvaluate',
                type: 'WeekEvaluate',
                path: 'none',
                component: WeekEvaluate,
                index: currentRoute.index + 1
            }
            this.props.navigator.push(route);
        } else {
            Alert.alert("提示", "不好意思，您尚无该权限!");
        }
    }

    componentWillUnmount() {
        //clearPageInfo(this.props.dispatch, "clearDailyReport");
        if (this.clearIntervalEvent !== undefined && this.clearIntervalEvent !== null) {
            clearInterval(this.clearIntervalEvent)
        }

    }

    doAnimated() {
        this.state.animatedShow.setValue(0);
        Animated.sequence([Animated.timing(this.state.animatedShow, {
            toValue: 360,
            duration: 1 * 1000,//7
            // tension
            //easing:Easing.out(Easing.ease)
        }),
            Animated.timing(this.state.animatedShow, {
                toValue: 0,
                duration: 1 * 1000,//7
                // tension
                //easing:Easing.out(Easing.ease)
            }),
        ]).start();
        // this.doAnimated();
    }

    //设置Model可见与否
    _setModalVisibled(visible) {
        if (visible) {
            this.doRedPacketAnimate();
            //let that = this;
            //this.state.animatedShow.setValue(-45);
            //this.doAnimated();
            //this.clearIntervalEvent = setInterval(this.doAnimated,2000);
            //this.clearIntervalEvent2 = setInterval(this.doAnimated,2000);
        } else {
            if (this.clearIntervalEvent !== undefined && this.clearIntervalEvent !== null) {
                clearInterval(this.clearIntervalEvent)
                //this.state.animatedShow.removeListener(this.clearIntervalEvent);
            }
        }
        this.setState({
            isFirstInit: false,
            modalVisible: visible,
            showRewardPacket: false,
            hadShowRedPacket: true,
            isEndAnimated: false
        });
    }

    _toOpenRedPacket() {
        let {dispatch} = this.props;
        let PageData = this.props.pageModel.PageData;
        let dailyReportInfo = this.props.pageModel.dailyReportInfo;
        let selfNeedOpenRedPacket = null;
        let selfNeedOpenRedPacketSize = 0;
        if (dailyReportInfo.selfNeedOpenRedPacket !== undefined && dailyReportInfo.selfNeedOpenRedPacket !== null) {
            selfNeedOpenRedPacket = dailyReportInfo.selfNeedOpenRedPacket;
        }
        if (dailyReportInfo.selfNeedOpenRedPacketSize !== undefined && dailyReportInfo.selfNeedOpenRedPacketSize !== null) {
            selfNeedOpenRedPacketSize = dailyReportInfo.selfNeedOpenRedPacketSize;
        }
        if (selfNeedOpenRedPacket !== null) {
            let postData = {
                token: PageData.token,
                userUniqueid: PageData.userUniqueid,
                orgUniqueid: PageData.orgUniqueid,
                type: "openWeekEvaluateReward",
                uniqueid: selfNeedOpenRedPacket.rewardUniqueid
            };
            this.doAnimated();
            let that = this;
            this.clearIntervalEvent = setInterval(this.doAnimated, 1000);
            setTimeout(() => that.setState({isEndAnimated: true}), 1000);
            rewardManage(dispatch, postData, {
                showRewardPacket: true,
                selfNeedOpenRedPacketPreReward: selfNeedOpenRedPacket
            }, true, "toDailyReport");

        } else {
            Alert.alert("提示", "红包开启失败，请重新尝试!")
        }

        //this.setState({showRewardPacket:true})
    }

    _toStillOpenRedPacket() {
        if (this.clearIntervalEvent !== undefined && this.clearIntervalEvent !== null) {
            clearInterval(this.clearIntervalEvent)
        }
        this.state.animatedShow.setValue(0);
        this.setState({showRewardPacket: false, modalVisible: true, isEndAnimated: false});


    }

    render() {
        let {PageData, dailyReportInfo} = this.props.pageModel;
        let currentWeekGetRedPacketSize = 0;
        let currentWeekDailyReportSize = 0;
        let currentWeekGetWealth = 0;
        let currentWeekGetExploitValue = 0;
        let selfNeedOpenRedPacket = null;
        let selfNeedOpenRedPacketSize = 0;
        let selfNeedOpenRedPacketPreReward = null;
        if (dailyReportInfo.selfNeedOpenRedPacketPreReward !== undefined && dailyReportInfo.selfNeedOpenRedPacketPreReward !== null) {
            selfNeedOpenRedPacketPreReward = dailyReportInfo.selfNeedOpenRedPacketPreReward;
        }
        let showRewardPacket = this.state.showRewardPacket;
        if (dailyReportInfo.showRewardPacket !== undefined && dailyReportInfo.showRewardPacket !== null) {
            if (this.state.isEndAnimated) {
                showRewardPacket = dailyReportInfo.showRewardPacket;
               // dailyReportInfo.showRewardPacket = null;
            }
        }
        if (dailyReportInfo.selfNeedOpenRedPacket !== undefined && dailyReportInfo.selfNeedOpenRedPacket !== null) {
            selfNeedOpenRedPacket = dailyReportInfo.selfNeedOpenRedPacket;
        }
        if (dailyReportInfo.selfNeedOpenRedPacketSize !== undefined && dailyReportInfo.selfNeedOpenRedPacketSize !== null) {
            selfNeedOpenRedPacketSize = dailyReportInfo.selfNeedOpenRedPacketSize;
        }
        if (dailyReportInfo.currentWeekGetRedPacketSize !== undefined && dailyReportInfo.currentWeekGetRedPacketSize !== null) {
            currentWeekGetRedPacketSize = dailyReportInfo.currentWeekGetRedPacketSize;
        }
        if (dailyReportInfo.currentWeekDailyReportSize !== undefined && dailyReportInfo.currentWeekDailyReportSize !== null) {
            currentWeekDailyReportSize = dailyReportInfo.currentWeekDailyReportSize;
        }
        if (dailyReportInfo.currentWeekGetExploitValue !== undefined && dailyReportInfo.currentWeekGetExploitValue !== null) {
            currentWeekGetExploitValue = dailyReportInfo.currentWeekGetExploitValue;
        }
        if (dailyReportInfo.currentWeekGetWealth !== undefined && dailyReportInfo.currentWeekGetWealth !== null) {
            currentWeekGetWealth = dailyReportInfo.currentWeekGetWealth;
        }
        let commitSize = 0;
        let rightComponent = null;
        if (selfNeedOpenRedPacketSize > 0) {
            rightComponent = <TouchableOpacity onPress={()=>this._setModalVisibled(true)}
                                               style={{justifyContent:"center",paddingRight:10*topBarRatio,marginRight:0}}><Image
                source={ImageResource["nav-redPacket@2x.png"]}
                style={{width:20*topBarRatio,height:20*topBarRatio}}/></TouchableOpacity>;
        } else {
            rightComponent = <TouchableOpacity
                style={{justifyContent:"center",padding:15,paddingRight:10,marginRight:0}}></TouchableOpacity>;
        }
        let chargeRowItem = null;
        if (dailyReportInfo.weekStarEvaluation !== undefined && dailyReportInfo.weekStarEvaluation !== null && dailyReportInfo.weekStarEvaluation !== "") {
            if (dailyReportInfo.weekStarEvaluation.isExist === "exist") {
                chargeRowItem = <EvaluateRowItem doClick={this.toHistory} isChargeWeekEvaluate={true} canClick={true}
                                                 rowData={dailyReportInfo.weekStarEvaluation} {...this.props} />
            }
        }
        let rowItems = [];
        let that = this;
        if (dailyReportInfo.evaluations !== undefined && dailyReportInfo.evaluations !== null) {
            commitSize = dailyReportInfo.evaluations.length;
            rowItems = dailyReportInfo.evaluations.map(function (obj, index) {
                return <EvaluateRowItem isChargeWeekEvaluate={false} canClick={true} doClick={that.toHistory}
                                        index={index} key={index} rowData={obj} {...that.props}/>
            });
        }
        let redPacketUserAvatar = null;
        let redPacketUserName = "";
        let redPacketPreUserAvatar = null;
        let redPacketPreUserName = "";
        let redPacketPreUserReward = "";
        if (selfNeedOpenRedPacket != null) {
            let obj = selfNeedOpenRedPacket;
            redPacketUserName = obj.name;
            //redPacketUserReward = obj.reward;
            if (obj.avatar && obj.avatar.indexOf("http") !== -1) {
                redPacketUserAvatar = {uri: obj.avatar};
            } else {
                if (obj.sex == "男") {
                    redPacketUserAvatar = ImageResource["header-boy@2x.png"];
                } else if (obj.sex == "女") {
                    redPacketUserAvatar = ImageResource["header-girl@2x.png"];
                }
            }
        }
        if (selfNeedOpenRedPacketPreReward != null) {
            let obj = selfNeedOpenRedPacketPreReward;
            redPacketPreUserName = obj.name;
            redPacketPreUserReward = obj.reward;
            if (obj.avatar && obj.avatar.indexOf("http") !== -1) {
                redPacketPreUserAvatar = {uri: obj.avatar};
            } else {
                if (obj.sex == "男") {
                    redPacketPreUserAvatar = ImageResource["header-boy@2x.png"];
                } else if (obj.sex == "女") {
                    redPacketPreUserAvatar = ImageResource["header-girl@2x.png"];
                }
            }
            if(!this.state.isEndAnimated){
                redPacketUserAvatar = redPacketPreUserAvatar;
            }
        }
        return (
            <View style={styles.container}>
                <View
                    style={[{position:"absolute",width:deviceWidth,height:deviceHeight,top:0,left:0,zIndex:600,flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"rgba(0,0,0,0.5)"},this.state.modalVisible?{}:{width:0,height:0,zIndex:-100}]}>

                    <TouchableOpacity onPress={this._setModalVisibled.bind(this,false)}
                                      style={{position:"absolute",top:0,left:0,width:deviceWidth,height:deviceHeight}}>
                    </TouchableOpacity>
                    { !showRewardPacket && <Animated.Image style={[{width:225.5*changeRatio,height:350*changeRatio,borderRadius:6*changeRatio,flex:0},{transform:[{rotateY:this.state.redPacketShow.interpolate({inputRange: [-180,180],outputRange: ['-180deg', '180deg']})},
                                  ],width:this.state.redPacketWidth.interpolate({inputRange: [redPacketWidth,225.5],outputRange:[redPacketWidth, 225.5*changeRatio]}),height:this.state.redPacketHeight.interpolate({inputRange: [20,350],outputRange:[20*changeRatio, 350*changeRatio]}),position:"absolute",top:this.state.redPacketTop,right:this.state.redPacketRight}]}
                                                                      source={ImageResource["bg-redPacket-close@3x.png"]}>

                        <View style={{alignItems:"center"}}>
                            <TouchableOpacity onPressIn={this._setModalVisibled.bind(this,false)}
                                              style={{position:"absolute",top:5*changeRatio,right:5*changeRatio}}>
                                <Animated.Image style={[{width:12,height:12},{width:this.state.redPacketWidth.interpolate({inputRange: [redPacketWidth,225.5],outputRange:[0, 12*changeRatio]}),
                                      height:this.state.redPacketHeight.interpolate({inputRange: [redPacketHeight,350],outputRange:[0, 12*changeRatio]}),} ]}
                                                source={ImageResource["icon-redPacket-close@2x.png"]}>
                                </Animated.Image>
                            </TouchableOpacity>
                            <Animated.View style={[{marginTop:20,flex:0,width:60,height:60,borderRadius:30,backgroundColor:imageViewBackgroundColor},
                         {width:this.state.redPacketWidth.interpolate({inputRange: [redPacketWidth,225.5],outputRange:[0, 60*changeRatio]}),
                          borderRadius:this.state.redPacketWidth.interpolate({inputRange: [redPacketWidth,225.5],outputRange:[0, 30*changeRatio]}),
                                      marginTop:this.state.redPacketWidth.interpolate({inputRange: [redPacketHeight,225.5],outputRange:[0, 20*changeRatio]}),height:this.state.redPacketHeight.interpolate({inputRange: [20,350],outputRange:[0, 60*changeRatio]}),}]}>
                                <Animated.Image style={[{flex:0,width:60,height:60,borderRadius:30},
                          {width:this.state.redPacketWidth.interpolate({inputRange: [redPacketWidth,225.5],outputRange:[0, 60*changeRatio]}),
                               borderRadius:this.state.redPacketWidth.interpolate({inputRange: [redPacketWidth,225.5],outputRange:[0, 30*changeRatio]}),
                                      height:this.state.redPacketHeight.interpolate({inputRange: [redPacketHeight,350],outputRange:[0, 60*changeRatio]}),}]}
                                                source={redPacketUserAvatar}></Animated.Image>
                            </Animated.View>
                            <Animated.Text style={[{marginTop:10,fontSize:12,color:"#ffe6b4"},
                        {fontSize:this.state.redPacketWidth.interpolate({inputRange: [redPacketWidth,225.5],outputRange:[0, 12*changeRatio]}),
                                      marginTop:this.state.redPacketHeight.interpolate({inputRange: [redPacketHeight,350],outputRange:[0, 10*changeRatio]}),}]}>{redPacketUserName}</Animated.Text>
                            <Animated.Text style={[{marginTop:10,fontSize:12,color:"#ffe6b4"},
                        {fontSize:this.state.redPacketWidth.interpolate({inputRange: [redPacketWidth,225.5],outputRange:[0, 12*changeRatio]}),
                                      marginTop:this.state.redPacketHeight.interpolate({inputRange: [redPacketHeight,350],outputRange:[0, 10*changeRatio]}),}]}>给你发了一个红包</Animated.Text>
                            <Animated.Text style={[{marginTop:40,fontSize:18,color:"#ffe6b4"},
                        {fontSize:this.state.redPacketWidth.interpolate({inputRange: [redPacketWidth,225.5],outputRange:[0, 18*changeRatio]}),
                                      marginTop:this.state.redPacketHeight.interpolate({inputRange: [redPacketHeight,350],outputRange:[0, 40*changeRatio]}),}]}>今天辛苦了，为你充电!</Animated.Text>
                            <Animated.View
                                style={[{flex:0,marginTop:30,width:80,height:80,borderRadius:40,backgroundColor:"#ddbc84",transform:[{rotateY:this.state.animatedShow.interpolate({inputRange: [-180,180],outputRange: ['-180deg', '180deg']})},
                                  ]   
                                },{width:this.state.redPacketWidth.interpolate({inputRange: [redPacketWidth,225.5],outputRange:[0, 80*changeRatio]}),
                                      height:this.state.redPacketHeight.interpolate({inputRange: [redPacketHeight,350],outputRange:[0, 80*changeRatio]}),
                                       borderRadius:this.state.redPacketWidth.interpolate({inputRange: [redPacketWidth,225.5],outputRange:[0, 40*changeRatio]}),
                                          marginTop:this.state.redPacketWidth.interpolate({inputRange: [redPacketWidth,225.5],outputRange:[0, 30*changeRatio]}),
                                    }]}
                            >
                                <TouchableOpacity
                                    style={{flex:0,alignItems:"center",justifyContent:"center",}}
                                    onPress={this._toOpenRedPacket}
                                >
                                    <Animated.Image style={[{width:80,height:80,borderRadius:40},
                         {width:this.state.redPacketWidth.interpolate({inputRange: [redPacketWidth,225.5],outputRange:[0, 80*changeRatio]}),
                         borderRadius:this.state.redPacketWidth.interpolate({inputRange: [redPacketWidth,225.5],outputRange:[0, 40*changeRatio]}),
                                      height:this.state.redPacketHeight.interpolate({inputRange: [redPacketHeight,350],outputRange:[0, 80*changeRatio]}),}]}
                                                    source={ImageResource["btn-openRedPacket@2x.png"]}>
                                    </Animated.Image>

                                </TouchableOpacity>
                            </Animated.View>
                        </View>

                    </Animated.Image>
                    }
                    {showRewardPacket &&
                    <Image style={{width:225.5*changeRatio,height:350*changeRatio,borderRadius:6*changeRatio,flex:0}}
                           source={ImageResource["bg-redPacket-open@3x.png"]}>

                        <View style={{alignItems:"center",justifyContent:"center"}}>
                            <TouchableOpacity onPressIn={this._setModalVisibled.bind(this,false)}
                                              style={{position:"absolute",top:5*changeRatio,right:5*changeRatio}}>
                                <Image style={{width:12*changeRatio,height:12*changeRatio}}
                                       source={ImageResource["icon-redPacket-close@2x.png"]}></Image>
                            </TouchableOpacity>
                            <View
                                style={{marginTop:55*changeRatio,flex:0,width:60*changeRatio,height:60*changeRatio,borderRadius:30*changeRatio,backgroundColor:imageViewBackgroundColor}}>
                                <Image
                                    style={{flex:0,width:60*changeRatio,height:60*changeRatio,borderRadius:30*changeRatio}}
                                    source={redPacketPreUserAvatar}></Image>
                            </View>
                            <Text
                                style={{marginTop:13*changeRatio,fontSize:12*changeRatio,color:"#ffe6b4"}}>{redPacketPreUserName}的红包</Text>
                            <View style={{flex:0,marginTop:15*changeRatio,flexDirection:"row"}}>
                                <Text style={{fontSize:50*changeRatio,color:"#ffe6b4"}}>{redPacketPreUserReward}</Text>
                                <Text
                                    style={{marginTop:33*changeRatio,marginLeft:7.5*changeRatio,fontSize:15*changeRatio,color:"#ffe6b4"}}>UB</Text>
                            </View>
                            {selfNeedOpenRedPacketSize > 0 && <TouchableOpacity
                                style={{flex:0,alignItems:"center",justifyContent:"center",marginTop:40*changeRatio,backgroundColor:"#ddbc84",width:130*changeRatio,height:30*changeRatio,borderRadius:15*changeRatio}}
                                onPress={this._toStillOpenRedPacket}
                            >
                                <Text style={{fontSize:18*changeRatio,color:"#473d3b"}}>继续拆</Text>
                            </TouchableOpacity>}
                            {selfNeedOpenRedPacketSize <= 0 && <TouchableOpacity
                                style={{flex:0,alignItems:"center",justifyContent:"center",marginTop:40*changeRatio,backgroundColor:"#ddbc84",width:130*changeRatio,height:30*changeRatio,borderRadius:15*changeRatio}}
                                onPress={this._setModalVisibled.bind(this,false)}
                            >
                                <Text style={{fontSize:18*changeRatio,color:"#473d3b"}}>拆完啦</Text>
                            </TouchableOpacity>}
                        </View>

                    </Image>
                    }
                </View>
                <TopBar
                    toback={this.toback}
                    layoutStyle={this.props.layoutStyle}
                    useAnimated={true}
                    AnimatedView={Animated.View}
                    style={{opacity:this.state.opacityAnimated}}
                    showRightImage={true}
                    rightComponent={rightComponent}
                    topBarText="报告"
                    topBarTextRight="历史"
                    showRight={false}
                    showLeft={this.props.showBack}
                />


                <View style={styles.top}>
                    <View style={styles.iconTitleView}>
                        <IconTitle fontStyle={styles.iconTitleFontStyle} imageStyle={styles.iconTitleStyle}
                                   style={{flex:1}} describe={'写日报'} source={ImageResource['btn-03-report@2x.png']}
                                   onPress={this.writeDailyReport}>
                        </IconTitle>
                    </View>
                    <View style={styles.iconTitleView}>
                        <IconTitle fontStyle={styles.iconTitleFontStyle} imageStyle={styles.iconTitleStyle}
                                   style={{flex:1}} describe={'下属点评'} source={ImageResource['btn-02-evaluation@2x.png']}
                                   onPress={this.toWeekEvaluate}>
                        </IconTitle>
                    </View>
                </View>

                <View style={styles.targetStatistical}>
                    <View style={styles.targetStatisticalHead}>
                        <View style={{justifyContent:"center",flex:0,height:40}}><Image
                            style={styles.targetStatisticalHeadImage}
                            source={ImageResource['icon-target-white@2x.png']}></Image></View>
                        <View style={{justifyContent:"center",flex:0,height:40}}><Text
                            style={styles.targetStatisticalHeadText}>本周日报统计</Text></View>
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
                        {!PageData.isMostLevel && <View style={styles.targetStatisticalDetailRow}>
                            <View style={styles.targetStatisticalDetailRowTop}>
                                <Text
                                    style={styles.targetStatisticalDetailRowTopText}>{currentWeekGetRedPacketSize}</Text>
                            </View>
                            <View style={styles.targetStatisticalDetailRowBottom}>
                                <Text style={styles.targetStatisticalDetailRowBottomText}>本周红包</Text>
                            </View>
                        </View>}
                        <View style={styles.targetStatisticalDetailRow}>
                            <View style={styles.targetStatisticalDetailRowTop}>
                                <Text style={styles.targetStatisticalDetailRowTopText}>{currentWeekGetWealth}</Text>
                            </View>
                            <View style={styles.targetStatisticalDetailRowBottom}>
                                <Text style={styles.targetStatisticalDetailRowBottomText}>获得财富</Text>
                            </View>
                        </View>
                        <View style={styles.targetStatisticalDetailRow}>
                            <View style={styles.targetStatisticalDetailRowTop}>
                                <Text
                                    style={styles.targetStatisticalDetailRowTopText}>{currentWeekGetExploitValue}</Text>
                            </View>
                            <View style={styles.targetStatisticalDetailRowBottom}>
                                <Text style={styles.targetStatisticalDetailRowBottomText}>获得功勋</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <ScrollView
                    refreshControl={
             <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={this._onRefresh}
                    tintColor="rgb(0,0,0)"
                    colors={['rgb(0,171,243)']}
                    progressBackgroundColor="#ffffff"
                  />
          }
                    style={{flex:1}}
                >
                    {chargeRowItem}

                    {rowItems}
                </ScrollView>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(48,173,245)",

        //alignItems:"center"
    },
    top: {
        marginTop: topHeight,
        flex: 0,
        height: 120 * changeRatio,
        width: deviceWidth,
        backgroundColor: "rgb(48,173,245)",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    iconTitleView: {
        flex: 0,
        height: 90 * changeRatio,
        width: deviceWidth / 2
    },
    iconTitleStyle: {
        width: 45 * changeRatio,
        height: 45 * changeRatio,
        borderRadius: 0,
        flex: 0,
    },
    iconTitleFontStyle: {
        fontSize: 17 * changeRatio,
        marginTop: 17 * changeRatio,
        color: "rgb(255,255,255)"
    },
    targetStatistical: {
        flex: 0,
        width: deviceWidth,
        height: 130 * changeRatio,
        borderTopWidth: 1,
        borderColor: "#e4ecf0",
    },
    targetStatisticalHead: {
        flex: 0,
        flexDirection: "row",
        height: 40 * changeRatio,
        width: deviceWidth - 40,
        marginLeft: 20 * changeRatio,
        marginRight: 20 * changeRatio,
        borderBottomWidth: 1,
        borderColor: "#e4ecf0",
        //backgroundColor:"red",
    },
    targetStatisticalHeadImage: {
        width: 18 * changeRatio,
        height: 18 * changeRatio,
        borderRadius: 9,
        flex: 0
    },
    targetStatisticalHeadText: {
        flex: 0,
        marginLeft: 5 * changeRatio,
        fontSize: 14 * changeRatio,
        //color:"#838f9f"
        color: "rgb(255,255,255)"
    },
    targetStatisticalDetail: {
        flex: 0,
        height: 90 * changeRatio,
        width: deviceWidth,
        borderColor: "#e4ecf0",
        //borderTopWidth:1,
        borderBottomWidth: 1,
        flexDirection: "row"
    },
    targetStatisticalDetailRow: {
        height: 90 * changeRatio,
        flex: 1,
        alignItems: "center",
    },
    targetStatisticalDetailRowTop: {
        flex: 0,
        height: 40 * changeRatio,
        marginTop: 10 * changeRatio,
        justifyContent: "center",
        alignItems: "center"
    },
    targetStatisticalDetailRowTopText: {
        flex: 0,
        fontSize: 20 * changeRatio,
        color: "#ffffff",
    },
    targetStatisticalDetailRowBottom: {
        flex: 0,
        height: 30 * changeRatio,
        marginBottom: 12 * changeRatio,
        justifyContent: "center",
        alignItems: "center"
    },
    targetStatisticalDetailRowBottomText: {
        flex: 0,
        fontSize: 12 * changeRatio,
        color: "#ffffff",
    },
    bgBlueImage: {
        marginTop: -90 * changeRatio,
        height: 170 * changeRatio,
        flex: 0,
        borderRadius: 15 * changeRatio,
        width: deviceWidth - 40 * changeRatio,
        marginLeft: 20 * changeRatio,
        marginRight: 20 * changeRatio,
    },
    bgImageContainer: {
        flex: 1, flexDirection: "row",
    },
    bgImageTopContainer: {
        flex: 1, alignItems: "center", padding: 20 * changeRatio, paddingTop: 30 * changeRatio
    },
    bgImageViewLeft: {
        alignItems: "flex-start",
        flex: 1,
        backgroundColor: "rgba(0,0,0,0)"
    },
    bgImageTextLeft: {
        fontSize: 24 * changeRatio,
        color: "#000000",
        flex: 1
    },
    bgImageTopText: {
        fontSize: 20 * changeRatio,
        color: "#ffffff",
        backgroundColor: "rgba(0,0,0,0)"
    },
    bgImageTopText2: {
        marginTop: 30 * changeRatio,
        fontSize: 24 * changeRatio,
        color: "#ffffff",
        backgroundColor: "rgba(0,0,0,0)"
    },
    bgImageTopText3: {
        marginTop: 5 * changeRatio,
        fontSize: 18 * changeRatio,
        color: "#ffffff",
        backgroundColor: "rgba(0,0,0,0)"
    },
    bgImageViewRight: {
        //alignItems:"flex-end",
        flex: 0,
        width: 80 * changeRatio,
        height: 80 * changeRatio,
        borderRadius: 8 * changeRatio,
        backgroundColor: "rgba(0,0,0,0)",
        justifyContent: "center",
        alignItems: "center"
    },
    bgRedImageTextRight: {
        fontSize: 12 * changeRatio,
        color: "#ffffff"
    },
    bgBlueImageTextRight: {
        fontSize: 18 * changeRatio,
        color: "#31aff5"
    },
    bgRedImage: {
        marginTop: 20 * changeRatio,
        marginLeft: 20 * changeRatio,
        marginRight: 20 * changeRatio,
        flex: 0,
        borderRadius: 15 * changeRatio,
        width: deviceWidth - 40,
        height: 170 * changeRatio,

    },
    starText: {
        fontSize: 14,
        margin: 2,
        width: 100,
        color: "rgb(93,109,129)",
        marginLeft: 0,
    },
    starContainer: {
        flexDirection: 'row',
        flex: 1,
        height: 35 * changeRatio,
        padding: 15 * changeRatio,
        paddingBottom: 0,
        paddingTop: 10 * changeRatio,
    },
    starStyle: {
        width: 15 * changeRatio, height: 15 * changeRatio,
        //flex:1,
        marginRight: 4 * changeRatio
    },
});

export default DailyReport;