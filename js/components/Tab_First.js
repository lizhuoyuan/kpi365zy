/**
 * 首页
 * Created by yuanzhou on 16/11.
 */
import React, {Component, PropTypes} from 'react'
import {
    InteractionManager,
    Alert,
    View,
    Slider,
    RefreshControl,
    ScrollView,
    TouchableHighlight,
    Platform,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
    Dimensions
} from 'react-native'
import IconTitle from './common/IconTitle'
import TargetManage from './version2/TargetManage'
import {tabManage, sign, logoutAction, getHomeInfo, getPeopleRelationship, getUserTarget, updatePage} from '../actions'
import CommonStyles from '../styles'
import TargetCheck from './version2/TargetCheck'
import DelayTargetCheck from './version2/DelayTargetCheck'
import MonthCheck from './version2/MonthCheck'
import DailyReport from './version2/DailyReport'
import ImageResource from '../utils/ImageResource'
import WeekEvaluate from "./version2/WeekEvaluate"
import QrCodeCamera from './QrCodeCamera'
import SelfCenter from './SelfCenter'
import moment from 'moment'
import AddTarget from './AddTarget'
import Evaluate from './Evaluate'
import Zhao from '../zhaoxianguan/Zhao'
import  * as SizeController from '../SizeController'
import {handleUrl} from '../utils/UrlHandle'
let changeRatio = SizeController.getChangeRatio();
const RNFS = require('react-native-fs');
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const MainBundlePath = RNFS.DocumentDirectoryPath;
let _scrollView = null;
let SignDayReward = React.createClass({
    getDefaultProps(){
        return {
            type: "UB",
            isSign: false,
            reward: 0,
            dayInfo: '1天',
            showLine: false,
            lineWidth: 13,
        }
    },
    render(){
        let {type, isSign, reward, dayInfo, showLine, lineWidth} = this.props;
        let color = "#c5cdd7";
        let source = ImageResource["signin-ub@2x.png"];
        let rewardComponent = null;
        if (isSign) {
            color = "#f7d80a";
            source = ImageResource["signin-ubbg@2x.png"];
            if (type === "UB") {
                let fontSize = 13 * changeRatio;
                if (reward > 100 || reward < -10) {
                    fontSize = 10 * changeRatio;
                }
                rewardComponent =
                    <Image style={{flex:0,width:25*changeRatio,height:25*changeRatio,borderRadius:12.5*changeRatio}}
                           source={source}>
                        <View style={{flex:0,height:25*changeRatio,justifyContent:"center",alignItems:"center"}}>
                            <Text
                                style={{flex:0,fontSize:fontSize,color:"#ffffff",backgroundColor:"rgba(0,0,0,0)"}}>{reward}</Text>
                        </View>
                    </Image>
            } else {
                rewardComponent = <View
                    style={{flex:0,width:25*changeRatio,height:25*changeRatio,borderRadius:12.5*changeRatio,backgroundColor:color,borderWidth:0,justifyContent:"center",alignItems:"center"}}>
                    <Image style={{width:24*changeRatio,height:24*changeRatio,borderRadius:12*changeRatio}}
                           source={ImageResource["signin-gift@2x.png"]}>
                    </Image>
                </View>
            }
        } else {
            if (type === "UB") {
                rewardComponent =
                    <Image style={{flex:0,width:25*changeRatio,height:25*changeRatio,borderRadius:12.5*changeRatio}}
                           source={source}>
                    </Image>
            } else {
                rewardComponent = <View
                    style={{flex:0,width:25*changeRatio,height:25*changeRatio,borderRadius:12.5*changeRatio,backgroundColor:color,borderWidth:0,justifyContent:"center",alignItems:"center"}}>
                    <Image style={{width:24*changeRatio,height:24*changeRatio,borderRadius:12*changeRatio}}
                           source={ImageResource["signin-gift@2x.png"]}>
                    </Image>
                </View>
            }
        }
        return (
            <View style={{flex:0,flexDirection:"row"}}>
                {showLine && <View style={{flex:0,justifyContent:"center",height:25*changeRatio}}>
                    <View
                        style={{flex:0,height:2*changeRatio,backgroundColor:color,marginRight:-1*changeRatio,width:lineWidth}}>
                    </View>
                </View>}
                <View style={{flex:0,flexDirection:"column",height:25*changeRatio}}>
                    {rewardComponent}
                    <View style={{flex:0,justifyContent:"center",alignItems:"center",marginTop:8*changeRatio}}>
                        <Text style={{fontSize:10*changeRatio,color:color}}>{dayInfo}</Text>
                    </View>
                </View>
            </View>
        )
    }
});
let Tab_First = React.createClass({
    getInitialState: function () {
        return {
            isRefreshing: false,
        }
    },
    componentDidMount: function () {
        let {pageModel, dispatch} = this.props;
        let PageData = pageModel.PageData;
        if (PageData.needInitUpdate !== undefined && PageData.needInitUpdate !== null) {
            if (pageModel.PageData.needInitUpdate == 1) {
                //this.doInitUpdate(this.state.selectRowData);
            } else if (pageModel.PageData.needInitUpdate == 0) {
                this.doInitUpdate();
            } else {
            }
            PageData.needInitUpdate = -1;
        }
        let loginUserInfo = PageData.loginUserInfo;
        if (loginUserInfo.avatar !== undefined && loginUserInfo.avatar !== null && loginUserInfo.avatar.indexOf("http") !== -1) {
            //this.exists(loginUserInfo.avatar, {}, dispatch);
        }

    },
    componentWillUpdate(){
        let {pageModel} = this.props;
        let PageData = pageModel.PageData;
        if (PageData.needInitUpdate !== undefined && PageData.needInitUpdate !== null) {
            if (pageModel.PageData.needInitUpdate == 1) {
                this.doInitUpdate();
            } else if (pageModel.PageData.needInitUpdate == 0) {
                this.doInitUpdate();
            } else {
            }
            PageData.needInitUpdate = -1;
        }
    },
    doInitUpdate(){
        let PageData = this.props.pageModel.PageData
        let postData = {
            token: PageData.token,
            orgUniqueid: PageData.orgUniqueid,
            userUniqueid: PageData.userUniqueid
        }
        //InteractionManager.runAfterInteractions(()=>{
        getHomeInfo(this.props.dispatch, postData, null, false);
        //});


    },
    //刷新数据
    _onRefresh(){
        let PageData = this.props.pageModel.PageData
        PageData.isRefreshing = true;
        this.setState({isRefreshing: true})

        let postData = {
            token: PageData.token,
            orgUniqueid: PageData.orgUniqueid,
            userUniqueid: PageData.userUniqueid
        }
        getHomeInfo(this.props.dispatch, postData, null, true)
    },
    ribaoOnPress(){
        //tabManage(this.props.dispatch,this.props.pageModel.tabManage.tabClickIndex,DailyReport,'',false)
        let route = {
            name: "DailyReport",
            type: 'DailyReport',
            path: 'none',
            component: DailyReport,
            index: 2,
        }
        this.props.navigator.push(route)
    },
    kaopinOnpress(){
        let route = {
            name: "MonthCheck",
            type: 'MonthCheck',
            path: 'none',
            component: MonthCheck,
            index: 2,
        };
        this.props.navigator.push(route)
    },
    addTargetOnpress(){
        let {routeInfo} = this.props;
        let route = {
            name: "AddTarget",
            type: 'AddTarget',
            path: 'none',
            component: AddTarget,
            index: routeInfo.index + 1,
        }
        this.props.navigator.push(route);
    },
    mubiaoOnpress(){
        let route = {
            name: "TargetManage",
            type: 'TargetManage',
            path: 'none',
            component: TargetManage,
            index: 2,
        };
        this.props.navigator.push(route);
    },
    mubiaozipingOnpress(){
        let route = {
            name: "TargetManage",
            type: 'TargetManage',
            path: 'none',
            component: TargetManage,
            index: 2,
            params: {
                showNowTarget: true
            }
        }
        this.props.navigator.push(route);
    },
    weixinOnPress(){
        let route = {
            name: "SwipoutExample",
            type: 'SwipoutExample',
            path: 'none',
            component: SwipoutExample,
            index: 2,
        };
        this.props.navigator.push(route)


    },
    selfEvluateOnPress(){
        let {routeInfo} = this.props;
        let route = {
            name: "Evaluate",
            type: 'Evaluate',
            path: 'none',
            component: Evaluate,
            index: routeInfo.index + 1,
        };
        this.props.navigator.push(route)
    },
    toSelfCenter(){//去个人中心
        let route = {
            name: "SelfCenter",
            type: 'SelfCenter',
            path: 'none',
            component: SelfCenter,
            index: 1,
        };
        tabManage(this.props.dispatch, {tabClickIndex: 3, component: SelfCenter, isShowTabBar: true});
    },
    /**
     * 前往招贤馆
     */
    zhaoxianguanOnPress(){
        let route = {
            name: "Zhao",
            type: 'Zhao',
            path: 'none',
            component: Zhao,
            index: 2,
        };
        this.props.navigator.push(route);
    },
    /**
     * 目标审核
     */
    checkTargetOnPress(){
        let route = {
            name: "TargetCheck",
            type: 'TargetCheck',
            path: 'none',
            component: TargetCheck,
            index: 2,
        };
        this.props.navigator.push(route);
    },
    checkDelayTargetOnPress(){
        let route = {
            name: "DelayTargetCheck",
            type: 'DelayTargetCheck',
            path: 'none',
            component: DelayTargetCheck,
            index: 2,
        }
        this.props.navigator.push(route)
    },
    gongshibangOnPress(){
        Alert.alert("提示", "程序猿还在加班加点中！");
    },
    zhoupingOnPress(){
        let route = {
            name: "WeekEvaluate",
            type: 'WeekEvaluate',
            path: 'none',
            component: WeekEvaluate,
            index: 2,
        };
        this.props.navigator.push(route)
    },
    toQrCodeCamera(){
        let route = {
            name: "QrCodeCamera",
            type: 'QrCodeCamera',
            path: 'none',
            component: QrCodeCamera,
            index: 2,
        };
        this.props.navigator.push(route);
    },
    makeDir(){
        var path = MainBundlePath + '/kpi365/download/images';
        RNFS.mkdir(path)
            .then((success) => {
                console.log("success");
            }).catch((err) => {
            console.log(err.message);
        });
    },
    exists(url, updateInfo, dispatch){
        this.makeDir();
        var path = MainBundlePath + '/kpi365/download/images/';
        let urls = url.split("\/");
        let that = this;
        if (urls.length > 0) {
            path += urls[urls.length - 1];
            RNFS.exists(path)
                .then((success) => {
                    if (success) {
                        updatePage(dispatch, {localAvatar: path});
                    } else {
                        that.downLoad(url, path, updateInfo, dispatch);
                    }
                }).catch((err) => {
                updatePage(dispatch, {localAvatar: null});
                //  console.log("err:"+err.message);
            })
        }
    },
    downLoad(fromUrl, toFile, updateInfo, dispatch){
        let DownloadFileOptions = {
            fromUrl: fromUrl,
            toFile: toFile,         // Local filesystem path to save the file to
        };
        RNFS.downloadFile(DownloadFileOptions).promise.then((response) => {
            if (response.statusCode == 200) {
                updatePage(dispatch, {localAvatar: toFile});
            } else {
                updatePage(dispatch, {localAvatar: null});
            }
        })
            .catch((err) => {
                if (err.description === "cancelled") {
                    // cancelled by user
                }
                updatePage(dispatch, {localAvatar: null});
                //console.log(err);
            });

    },
    toSign(){ //签到
        let PageData = this.props.pageModel.PageData
        let postData = {
            token: PageData.token,
            orgUniqueid: PageData.orgUniqueid,
            userUniqueid: PageData.userUniqueid,
            type: "sign"
        }
        sign(this.props.dispatch, postData, null)
    },
    render(){
        let PageData = this.props.pageModel.PageData
        let name = ""
        let exploitValue = 0;
        let wealth = 0;
        let popularity = 0;
        let sexSource = null;
        let signature = "";
        let isManage = false;
        let needCheckTargetSize = 0;
        let loginUserInfo = PageData.loginUserInfo;
        let identitys = PageData.identitys;
        let needCheckTargetsSize = PageData.needCheckTargetsSize;
        let isSignToday = PageData.isSignToday;
        let signRewards = PageData.signRewards;
        let exploitValueRanking = 0, wealthRanking = 0, popularityRanking = 0;
        let targetRejectSize = 0, needCheckDelayTargetsSize = 0, monthEvaluateSize = 0, weekEvaluateSize = 0, hadChangeTodayTargetProgress = false, hadSelfEvaluateToday = false;
        if (PageData.needCheckDelayTargetsSize) {
            needCheckDelayTargetsSize = PageData.needCheckDelayTargetsSize;
        }
        if (PageData.targetRejectSize) {
            targetRejectSize = PageData.targetRejectSize;
        }
        if (PageData.monthEvaluateSize) {
            monthEvaluateSize = PageData.monthEvaluateSize;
        }
        if (PageData.weekEvaluateSize) {
            weekEvaluateSize = PageData.weekEvaluateSize;
        }
        if (PageData.hadChangeTodayTargetProgress) {
            hadChangeTodayTargetProgress = PageData.hadChangeTodayTargetProgress;
        }
        if (PageData.hadSelfEvaluateToday) {
            hadSelfEvaluateToday = PageData.hadSelfEvaluateToday;
        }
        if (PageData.exploitValueRanking) {
            exploitValueRanking = PageData.exploitValueRanking;
        }
        if (PageData.wealthRanking) {
            wealthRanking = PageData.wealthRanking;
        }
        if (PageData.popularityRanking) {
            popularityRanking = PageData.popularityRanking;
        }
        let avatar = null;
        let daySignComponents = [];
        let daySignArray = [
            {isSign: false, type: "UB", reward: 0, showLine: false, dayInfo: "1天"}, {
                isSign: false,
                type: "UB",
                reward: 0,
                showLine: true,
                dayInfo: "2天"
            },
            {isSign: false, type: "gift", reward: 0, showLine: true, dayInfo: "3天"}, {
                isSign: false,
                type: "UB",
                reward: 0,
                showLine: true,
                dayInfo: "4天"
            }
            , {isSign: false, type: "UB", reward: 0, showLine: true, dayInfo: "5天"}, {
                isSign: false,
                type: "UB",
                reward: 0,
                showLine: true,
                dayInfo: "6天"
            },
            {isSign: false, type: "gift", reward: 0, showLine: true, dayInfo: "7天"}
        ];
        if (signRewards !== undefined && signRewards !== null) {
            signRewards.forEach(function (obj) {
                let index = moment(obj.signDate).day();
                if (index == 0) {
                    index = 7;
                }
                let obj2 = daySignArray[index - 1];
                obj2.isSign = true;
                obj2.reward = obj.reward;
                obj2.type = "UB";
            });
        }
        let signLeftPng = "icon-signin@2x.png";
        if (isSignToday) {
            signLeftPng = "icon-signin@2x.png";
        }
        let lineWidth = (this.props.layoutStyle.width - 7 * 25 * changeRatio - 40 * changeRatio - 20 * changeRatio) / 6 + 1;
        daySignComponents = daySignArray.map(function (obj, index) {
            return <SignDayReward key={index} {...obj} lineWidth={lineWidth}/>
        })
        if (PageData.isRefreshing !== undefined && PageData.isRefreshing !== null) {
            this.state.isRefreshing = PageData.isRefreshing
        }
        if (loginUserInfo) {
            name = loginUserInfo.name;
            if (loginUserInfo.description) {
                signature = loginUserInfo.description;
            }
            if (loginUserInfo.sex == "男") {
                sexSource = ImageResource["icon-male@2x.png"];
            } else if (loginUserInfo.sex == "女") {
                sexSource = ImageResource["icon-female@2x.png"];
            }
            let avatarUrl = handleUrl(loginUserInfo.avatar);
            if (avatarUrl) {
                avatar = {uri: avatarUrl}
            } else {
                if (loginUserInfo.sex === "男") {
                    avatar = ImageResource["header-boy@2x.png"];
                } else if (loginUserInfo.sex === "女") {
                    avatar = ImageResource["header-girl@2x.png"];
                }
            }
        }
        if (identitys !== undefined && identitys !== null) {
            if (identitys.length > 0) {
                isManage = true
            }
        }
        if (needCheckTargetsSize) {
            needCheckTargetSize = needCheckTargetsSize
        }
       /* if (PageData.localAvatar) {
            if (Platform.OS === 'ios') {
                avatar = {uri: PageData.localAvatar, isStatic: true};
            } else {
                if (PageData.localAvatar.indexOf("file:") != -1) {
                    avatar = {uri: PageData.localAvatar, isStatic: true};
                } else {
                    avatar = {uri: "file://" + PageData.localAvatar, isStatic: true};
                }

            }
        }*/

        return (

            <View style={styles.container}>
                <Image style={styles.topImage} source={ImageResource['bg-index.png']}>
                    <View style={{flex:1}}>
                        <View
                            style={{padding:10*changeRatio,paddingBottom:0,paddingTop:25*changeRatio,flexDirection:"row"}}>
                            <View style={[CommonStyles.leftView,{ borderWidth:0,borderColor:"red"}]}>
                                <View style={{flex:0,width:30*changeRatio,height:30*changeRatio}}>
                                    <Image style={{width:30*changeRatio,height:30*changeRatio}}
                                           source={ImageResource["nav-bell@2x.png"]}>
                                    </Image>

                                </View>
                            </View>
                            { false && <View style={[CommonStyles.rightView,{borderWidth:0,borderColor:"red"}]}>
                                <TouchableOpacity style={{flex:0}}>
                                    <Image style={{width:30*changeRatio,height:30*changeRatio}}
                                           source={ImageResource['nav-QRcode@2x.png']}>
                                    </Image>
                                </TouchableOpacity>
                            </View> }
                        </View>
                        <View style={[CommonStyles.centerView,{marginTop:10*changeRatio}]}>
                            <TouchableOpacity style={{flex:0}} onPress={this.toSelfCenter}>
                                <View style={[styles.topImageAvatar,{backgroundColor:"#ffffff"}]}>
                                    <Image style={[styles.topImageAvatar]} source={avatar}/>
                                </View>
                            </TouchableOpacity>
                            <View
                                style={[CommonStyles.rowView,{flex: 0,justifyContent: "center",marginTop: 10*changeRatio}]}>
                                <View
                                    style={{flex:0,alignItems:"center",justifyContent: "center"}}>
                                    <Text style={styles.textName}>{name}</Text>
                                </View>
                                <View style={{justifyContent: "center"}}>
                                    <Image
                                        source={sexSource}
                                        style={styles.sexImage}
                                    >
                                    </Image>
                                </View>
                            </View>
                            <Text
                                style={[styles.signature,{fontSize:12*changeRatio}]}>{signature}</Text>
                        </View>
                    </View>
                </Image>
                <View style={styles.iconsView}>
                    {false && <IconTitle fontStyle={{fontSize:12*changeRatio,color:"rgb(93,109,129)"}}
                                         imageStyle={styles.imageStyle} style={{flex:1}} describe={'公事榜'}
                                         source={ImageResource['module1@2x.png']} onPress={this.gongshibangOnPress}>
                    </IconTitle>}
                    <IconTitle fontStyle={{fontSize:12*changeRatio,color:"rgb(93,109,129)"}}
                               imageStyle={styles.imageStyle} style={{flex:1}} describe={'报告'}
                               source={ImageResource['module2@2x.png']} onPress={this.ribaoOnPress}>
                    </IconTitle>
                    {isManage &&
                    <IconTitle fontStyle={{fontSize:12*changeRatio,color:"rgb(93,109,129)"}}
                               imageStyle={styles.imageStyle} style={{flex:1}}
                               describe={'招贤馆'}
                               onPress={this.zhaoxianguanOnPress}
                               source={ImageResource['module6@2x.png']}>
                    </IconTitle>
                    }
                    <IconTitle fontStyle={{fontSize:12*changeRatio,color:"rgb(93,109,129)"}}
                               imageStyle={styles.imageStyle} style={{flex:1}} describe={'目标'}
                               source={ImageResource['module3@2x.png']} onPress={this.mubiaoOnpress}>
                    </IconTitle>
                    { false && <IconTitle fontStyle={{fontSize:12*changeRatio,color:"rgb(93,109,129)"}}
                                          imageStyle={styles.imageStyle} style={{flex:1}} describe={'日报点评'}
                                          source={ImageResource['module4@2x.png']} onPress={this.zhoupingOnPress}>
                    </IconTitle>}
                    {false && <IconTitle fontStyle={{fontSize:12*changeRatio,color:"rgb(93,109,129)"}}
                                         imageStyle={styles.imageStyle} style={{flex:1}} describe={'目标考评'}
                                         source={ImageResource['module5@2x.png']} onPress={this.kaopinOnpress}>
                    </IconTitle>}
                </View>

                <ScrollView showsVerticalScrollIndicator={true}
                            ref={(scrollView)=>{_scrollView = scrollView}}
                            refreshControl={
                                 <RefreshControl
                                  refreshing={this.state.isRefreshing}
                                  onRefresh={this._onRefresh}
                                  tintColor="rgb(0,171,243)"
                                  colors={['rgb(0,171,243)']}
                                  progressBackgroundColor="#ffffff"
                                />
                            }
                            contentContainerStyle={styles.contentContainer}>
                    {false && <View
                        style={{flex:1,width:this.props.layoutStyle.width-20*changeRatio,borderRadius:8*changeRatio,height:125*changeRatio,backgroundColor:"#ffffff",margin:10*changeRatio,padding:20*changeRatio}}>
                        <View style={{flexDirection:"row",height:25*changeRatio,flex:0}}>
                            <View
                                style={{width:25*changeRatio,height:25*changeRatio,borderRadius:12.5*changeRatio,backgroundColor:"rgb(245,168,126)",alignItems:"center",justifyContent:"center"}}
                            >
                                <Image style={{width:20*changeRatio,height:20*changeRatio,flex:0}}
                                       source={ImageResource[signLeftPng]}>
                                </Image>
                            </View>
                            <View style={{marginLeft:10,flex:0,justifyContent:"center",height:25*changeRatio}}>
                                <Text style={{fontSize:16*changeRatio,color:"#1e2c3c"}}>每日签到</Text>
                            </View>
                            <View
                                style={{flex:0,position:"absolute",right:0,justifyContent:"center",height:25*changeRatio}}>
                                {!isSignToday && false &&
                                <TouchableOpacity
                                    onPress={this.toSign}
                                    style={{height:22*changeRatio,width:50*changeRatio,borderRadius:8*changeRatio,borderWidth:1,borderColor:"#1da9fc",flex:0,justifyContent:"center",alignItems:"center"}}
                                >
                                    <Text style={{fontSize:13*changeRatio,color:"#1da9fc"}}>签到</Text>
                                </TouchableOpacity>
                                }
                                { false && <TouchableOpacity
                                    style={{height:22*changeRatio,width:50*changeRatio,borderRadius:8*changeRatio,borderWidth:1,borderColor:"#1da9fc",flex:0,justifyContent:"center",alignItems:"center"}}>
                                    <Text style={{fontSize:13*changeRatio,color:"#1da9fc"}}>去商场</Text>
                                </TouchableOpacity>
                                }
                            </View>
                        </View>
                        <View
                            style={{marginTop:18*changeRatio,flex:0,height:55*changeRatio,width:this.props.layoutStyle.width-60*changeRatio,backgroundColor:"#ffffff",flexDirection:"row"}}>
                            {daySignComponents}
                        </View>
                    </View>
                    }

                    {false && <TouchableOpacity>
                        <View
                            style={{flexDirection:"row",alignItems:"center",justifyContent:"center",padding:15*changeRatio,margin:10*changeRatio,marginTop:0,marginBottom:0,borderRadius:8*changeRatio,backgroundColor:"#ffffff"}}>
                            <View
                                style={{height:25*changeRatio,width:25*changeRatio,borderRadius:12.5*changeRatio,backgroundColor:"rgb(80,210,194)",justifyContent:"center",alignItems:"center"}}>
                                <Text style={{fontSize:10*changeRatio,color:"#ffffff"}}>13</Text>
                            </View>
                            <Text style={{marginLeft:20*changeRatio,fontSize:13*changeRatio,color:"#000000"}}>公事榜</Text>
                            <View style={{alignItems:"flex-end",flex:1}}>
                                <Image style={styles.rightArrow} source={ImageResource['right-arrow.png']}></Image>
                            </View>
                        </View>
                    </TouchableOpacity>}
                    { !hadSelfEvaluateToday && <TouchableOpacity onPress={this.selfEvluateOnPress}>
                        <View
                            style={{flexDirection:"row",alignItems:"center",justifyContent:"center",padding:15*changeRatio,margin:10*changeRatio,marginBottom:0,borderRadius:8*changeRatio,backgroundColor:"#ffffff"}}>
                            <View
                                style={{height:25*changeRatio,width:25*changeRatio,borderRadius:12.5*changeRatio,backgroundColor:"rgb(108,118,175)",justifyContent:"center",alignItems:"center"}}>
                                <Text style={{fontSize:10*changeRatio,color:"#ffffff"}}>1</Text>
                            </View>
                            <Text
                                style={{marginLeft:20*changeRatio,fontSize:13*changeRatio,color:"#000000"}}>每日自评</Text>
                            <View style={{alignItems:"flex-end",flex:1}}>

                                <Image style={styles.rightArrow} source={ImageResource['right-arrow.png']}></Image>

                            </View>
                        </View>
                    </TouchableOpacity>
                    }
                    {targetRejectSize > 0 && <TouchableOpacity onPress={this.addTargetOnpress}>
                        <View
                            style={{flexDirection:"row",alignItems:"center",justifyContent:"center",padding:15*changeRatio,margin:10*changeRatio,marginBottom:0,borderRadius:8*changeRatio,backgroundColor:"#ffffff"}}>
                            <View
                                style={{height:25*changeRatio,width:25*changeRatio,borderRadius:12.5*changeRatio,backgroundColor:"rgb(231,50,24)",justifyContent:"center",alignItems:"center"}}>
                                <Text style={{fontSize:10*changeRatio,color:"#ffffff"}}>{targetRejectSize}</Text>
                            </View>
                            <Text
                                style={{marginLeft:20*changeRatio,fontSize:13*changeRatio,color:"#000000"}}>目标驳回</Text>
                            <View style={{alignItems:"flex-end",flex:1}}>
                                <Image style={styles.rightArrow} source={ImageResource['right-arrow.png']}></Image>
                            </View>
                        </View>
                    </TouchableOpacity>
                    }
                    <TouchableOpacity onPress={this.addTargetOnpress}>
                        <View
                            style={{flexDirection:"row",alignItems:"center",justifyContent:"center",padding:15*changeRatio,margin:10*changeRatio,marginBottom:0,borderRadius:8*changeRatio,backgroundColor:"#ffffff"}}>
                            <View
                                style={{height:25*changeRatio,width:25*changeRatio,borderRadius:12.5*changeRatio,backgroundColor:"rgb(44,211,111)",justifyContent:"center",alignItems:"center"}}>
                                <Text style={{fontSize:10,color:"#ffffff"}}>1</Text>
                            </View>
                            <Text
                                style={{marginLeft:20*changeRatio,fontSize:13*changeRatio,color:"#000000"}}>目标设置</Text>
                            <View style={{alignItems:"flex-end",flex:1}}>
                                <Image style={styles.rightArrow} source={ImageResource['right-arrow.png']}></Image>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {!hadChangeTodayTargetProgress && <TouchableOpacity onPress={this.mubiaozipingOnpress}>
                        <View
                            style={{flexDirection:"row",alignItems:"center",justifyContent:"center",padding:15*changeRatio,margin:10*changeRatio,marginBottom:0,borderRadius:8*changeRatio,backgroundColor:"#ffffff"}}>
                            <View
                                style={{height:25*changeRatio,width:25*changeRatio,borderRadius:12.5*changeRatio,backgroundColor:"rgb(72,174,183)",justifyContent:"center",alignItems:"center"}}>
                                <Text style={{fontSize:10*changeRatio,color:"#ffffff"}}>1</Text>
                            </View>
                            <Text
                                style={{marginLeft:20*changeRatio,fontSize:13*changeRatio,color:"#000000"}}>目标自评</Text>
                            <View style={{alignItems:"flex-end",flex:1}}>
                                <Image style={styles.rightArrow} source={ImageResource['right-arrow.png']}></Image>
                            </View>
                        </View>
                    </TouchableOpacity>
                    }
                    {isManage && needCheckTargetSize > 0 && <TouchableOpacity onPress={this.checkTargetOnPress}>
                        <View
                            style={{flexDirection:"row",alignItems:"center",justifyContent:"center",padding:15*changeRatio,margin:10*changeRatio,marginBottom:0,borderRadius:8,backgroundColor:"#ffffff"}}>
                            <View
                                style={{height:25*changeRatio,width:25*changeRatio,borderRadius:12.5*changeRatio,backgroundColor:"rgb(225,129,146)",justifyContent:"center",alignItems:"center"}}>
                                <Text
                                    style={{fontSize:10*changeRatio,color:"#ffffff"}}>{needCheckTargetSize > 99 ? '···' : needCheckTargetSize}</Text>
                            </View>
                            <Text
                                style={{marginLeft:20*changeRatio,fontSize:13*changeRatio,color:"#000000"}}>目标审核</Text>
                            <View style={{alignItems:"flex-end",flex:1}}>
                                <Image style={styles.rightArrow} source={ImageResource['right-arrow.png']}></Image>
                            </View>
                        </View>
                    </TouchableOpacity> }
                    {isManage && needCheckDelayTargetsSize > 0 &&
                    <TouchableOpacity onPress={this.checkDelayTargetOnPress}>
                        <View
                            style={{flexDirection:"row",alignItems:"center",justifyContent:"center",padding:15*changeRatio,margin:10*changeRatio,marginBottom:0,borderRadius:8*changeRatio,backgroundColor:"#ffffff"}}>
                            <View
                                style={{height:25*changeRatio,width:25*changeRatio,borderRadius:12.5*changeRatio,backgroundColor:"rgb(225,129,146)",justifyContent:"center",alignItems:"center"}}>
                                <Text
                                    style={{fontSize:10*changeRatio,color:"#ffffff"}}>{needCheckDelayTargetsSize > 99 ? '···' : needCheckDelayTargetsSize}</Text>
                            </View>
                            <Text
                                style={{marginLeft:20*changeRatio,fontSize:13*changeRatio,color:"#000000"}}>关闭延期目标</Text>
                            <View style={{alignItems:"flex-end",flex:1}}>
                                <Image style={styles.rightArrow} source={ImageResource['right-arrow.png']}></Image>
                            </View>
                        </View>
                    </TouchableOpacity> }
                    { isManage && weekEvaluateSize > 0 && <TouchableOpacity onPress={this.zhoupingOnPress}>
                        <View
                            style={{flexDirection:"row",alignItems:"center",justifyContent:"center",padding:15*changeRatio,margin:10*changeRatio,marginBottom:0,borderRadius:8*changeRatio,backgroundColor:"#ffffff"}}>
                            <View
                                style={{height:25*changeRatio,width:25*changeRatio,borderRadius:12.5*changeRatio,backgroundColor:"rgb(90,37,78)",justifyContent:"center",alignItems:"center"}}>
                                <Text
                                    style={{fontSize:10*changeRatio,color:"#ffffff"}}>{weekEvaluateSize > 99 ? '···' : weekEvaluateSize}</Text>
                            </View>
                            <Text
                                style={{marginLeft:20*changeRatio,fontSize:13*changeRatio,color:"#000000"}}>下属周评</Text>
                            <View style={{alignItems:"flex-end",flex:1}}>
                                <Image style={styles.rightArrow} source={ImageResource['right-arrow.png']}></Image>
                            </View>
                        </View>
                    </TouchableOpacity>}
                    { isManage && monthEvaluateSize > 0 && <TouchableOpacity onPress={this.kaopinOnpress}>
                        <View
                            style={{flexDirection:"row",alignItems:"center",justifyContent:"center",padding:15*changeRatio,margin:10*changeRatio,marginBottom:0,borderRadius:8*changeRatio,backgroundColor:"#ffffff"}}>
                            <View
                                style={{height:25*changeRatio,width:25*changeRatio,borderRadius:12.5*changeRatio,backgroundColor:"rgb(71,104,120)",justifyContent:"center",alignItems:"center"}}>
                                <Text
                                    style={{fontSize:10*changeRatio,color:"#ffffff"}}>{monthEvaluateSize > 99 ? '···' : monthEvaluateSize}</Text>
                            </View>
                            <Text
                                style={{marginLeft:20*changeRatio,fontSize:13*changeRatio,color:"#000000"}}>月度考评</Text>
                            <View style={{alignItems:"flex-end",flex:1}}>
                                <Image style={styles.rightArrow} source={ImageResource['right-arrow.png']}></Image>
                            </View>
                        </View>
                    </TouchableOpacity>}
                </ScrollView>
            </View>

        )
    }
});
const styles = StyleSheet.create({
    tab: {
        position: 'absolute',
        bottom: 0,
        height: 45 * changeRatio
    },
    contentContainer: {
        paddingBottom: 125 * changeRatio,
    },
    image: {
        width: 50 * changeRatio,
        height: 50 * changeRatio,
        borderRadius: 25 * changeRatio,
    },
    rightArrow: {
        height: 16 * changeRatio,
        width: 16 * changeRatio
    },
    iconsView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#ffffff",
        flex: 0,
        marginTop: 10 * changeRatio,
        paddingTop: 10 * changeRatio,
        paddingBottom: 10 * changeRatio,
        height: 80 * changeRatio,
        borderBottomWidth: 1,
        borderBottomColor: "rgb(248,248,248)",
    },
    container: {
        flex: 1,
        backgroundColor: "rgb(248,248,248)",
    },
    imageStyle: {
        width: 35 * changeRatio,
        height: 35 * changeRatio,
        flex: 0,
    },
    text: {
        marginTop: 10 * changeRatio,
        fontSize: 17 * changeRatio,
        color: "#ffffff",
        backgroundColor: "rgba(0,0,0,0)"
    },
    signature: {
        fontSize: 12 * changeRatio,
        marginTop: 10 * changeRatio,
        color: "#e6ffffff",
        backgroundColor: "rgba(0,0,0,0)",
    },
    topImage: {
        height: 194 * changeRatio,
        width: deviceWidth,

    },
    topImageAvatar: {
        height: 60 * changeRatio,
        width: 60 * changeRatio,
        borderRadius: 30 * changeRatio,
    },
    sexImage: {
        width: 16 * changeRatio,
        height: 16 * changeRatio,
        marginLeft: 6 * changeRatio,
    },
    textName: {
        fontSize: 17 * changeRatio,
        color: "#ffffff",
        backgroundColor: "rgba(0,0,0,0)"
    }
});
export default Tab_First
