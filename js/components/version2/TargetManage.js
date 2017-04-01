/**
 * 目标管理
 * Created by yuanzhou on 17/02.
 */
import React, {Component} from 'react'
import {
    InteractionManager,
    Alert,
    Animated,
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
import AddTarget from '../AddTarget'
import {
    clientUserTargetManage,
    deleteTargetPress,
    tabManage,
    updatePage,
    clientUserTargetDelayManage,
    getUserTarget,
    changeUserTargetProgress
} from '../../actions'
import UserTargetHistory from '../UserTargetHistory'
import MonthCheck from './MonthCheck'
import ProgressView from './ProgressView'
import * as SizeController from '../../SizeController'
const topHeight = SizeController.getTopHeight();
const tabBarHeight = SizeController.getTabBarHeight();
const changeRatio = SizeController.getChangeRatio();
const topBarRatio = SizeController.getTopBarRatio();
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
class TargetManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            delayTop: new Animated.Value(250 * changeRatio + topHeight),
            marginAnimated: new Animated.Value(20),
            nowTop: new Animated.Value(430 * changeRatio + topHeight),
            borderRadiusAnimated: new Animated.Value(15),
            widthAnimated: new Animated.Value(deviceWidth - 40),
            opacityAnimated: new Animated.Value(1),
            opacityAnimatedShow: new Animated.Value(0),
            toDelayTarget: false,
            toNowTarget: false,
            canCancelContentTouches: true,
            sliderUniqueid: null,
            isRefreshing: false
        };
        this.toback = this.toback.bind(this);
        this.showNowTarget = this.showNowTarget.bind(this);
        this.showDelayTarget = this.showDelayTarget.bind(this);
        this.backTarget = this.backTarget.bind(this);
        this.addTarget = this.addTarget.bind(this);
        this.toHistory = this.toHistory.bind(this);
        this.updateProgress = this.updateProgress.bind(this);
        this.toEvaluate = this.toEvaluate.bind(this);
        this.doInitUpdate = this.doInitUpdate.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        this.distanceX = -1;
    }

    static defaultProps = {
        showBack: true
    };

    componentDidMount() {
        if (this.props.showNowTarget) {
            this.showNowTarget();
        } else {
            let PageData = this.props.pageModel.PageData
            InteractionManager.runAfterInteractions(() => {
                getUserTarget(this.props.dispatch, {
                    token: PageData.token,
                    userUniqueid: PageData.userUniqueid,
                    orgUniqueid: PageData.orgUniqueid
                })
            });
        }
    }


    componentWillReceiveProps(nextProps, nextState) {
        let {pageModel} = nextProps;
        let PageData = pageModel.PageData;
        if (PageData.needInitUpdate !== undefined && PageData.needInitUpdate !== null) {
            if (pageModel.PageData.needInitUpdate == 1 || pageModel.PageData.needInitUpdate == 0) {
                this.doInitUpdate();
            }
            pageModel.PageData.needInitUpdate = -1;
        }
    }

    doInitUpdate(canUseBack) {
        let PageData = this.props.pageModel.PageData
        let {routeInfo} = this.props;
        if (canUseBack) {
            canUseBack = null;
        }
        let postData = {
            token: PageData.token,
            userUniqueid: PageData.userUniqueid,
            orgUniqueid: PageData.orgUniqueid
        };
        getUserTarget(this.props.dispatch, postData, {}, true)
    }

    /** 刷新数据 **/
    _onRefresh() {
        let PageData = this.props.pageModel.PageData;
        let postData = {token: PageData.token, userUniqueid: PageData.userUniqueid, orgUniqueid: PageData.orgUniqueid};
        getUserTarget(this.props.dispatch, {}, true);

    }

    /**
     * 返回
     * @return {[type]}
     */
    toback() {
        let obj = {
            route: null,
            toBack: true,
            needInitUpdate: 1
        }
        updatePage(this.props.dispatch, obj);
    }


    /**
     * 返回目标
     * @return {[type]}
     */
    backTarget() {
        this.setState({
            toDelayTarget: false,
            toNowTarget: false
        });
        Animated.parallel(
            [
                Animated.timing(this.state.delayTop, {
                    toValue: 250 * changeRatio + topHeight,
                    duration: 0.5 * 1000,//7
                    // tension
                    easing: Easing.out(Easing.ease)
                }),
                Animated.timing(this.state.nowTop, {
                    toValue: 430 * changeRatio + topHeight,
                    duration: 0.5 * 1000,//7
                    // tension
                    easing: Easing.out(Easing.ease)
                }),
                Animated.timing(this.state.marginAnimated, {
                    toValue: 20,
                    duration: 0.5 * 1000,//7
                    // tension
                    easing: Easing.out(Easing.ease)
                }),
                Animated.timing(this.state.borderRadiusAnimated, {
                    toValue: 15,
                    duration: 0.5 * 1000,//7
                    // tension
                    easing: Easing.out(Easing.ease)
                }),
                Animated.timing(this.state.widthAnimated, {
                    toValue: deviceWidth - 40,
                    duration: 0.5 * 1000,//7
                    // tension
                    easing: Easing.out(Easing.ease)
                }),
                Animated.timing(this.state.opacityAnimated, {
                    toValue: 1,
                    duration: 0.5 * 1000,//7
                    // tension
                    easing: Easing.out(Easing.ease)
                }),
                Animated.timing(this.state.opacityAnimatedShow, {
                    toValue: 0,
                    duration: 0.5 * 1000,//7
                    // tension
                    easing: Easing.out(Easing.ease)
                })

            ]).start();
        let {routeInfo, dispatch} = this.props;
        updatePage(dispatch, {canUseBack: true, isShowTabBar: true});
    }

    /**
     * 显示延期目标
     * @return {[type]}
     */
    showDelayTarget() {
        let {routeInfo, dispatch} = this.props;
        this.setState({
            toDelayTarget: true,
            toNowTarget: false
        });
        Animated.parallel(
            [
                Animated.timing(this.state.delayTop, {
                    toValue: -20 * changeRatio,
                    duration: 0.5 * 1000,
                    easing: Easing.out(Easing.ease)
                }),
                Animated.timing(this.state.nowTop, {
                    toValue: deviceHeight + 170 * changeRatio,
                    duration: 0.5 * 1000,//7
                    // tension
                    easing: Easing.out(Easing.ease)
                }),
                Animated.timing(this.state.marginAnimated, {
                    toValue: 0,
                    duration: 0.5 * 1000,//7
                    // tension
                    easing: Easing.out(Easing.ease)
                }),
                Animated.timing(this.state.borderRadiusAnimated, {
                    toValue: 0,
                    duration: 0.5 * 1000,//7
                    // tension
                    easing: Easing.out(Easing.ease)
                }),
                Animated.timing(this.state.widthAnimated, {
                    toValue: deviceWidth,
                    duration: 0.5 * 1000,//7
                    // tension
                    easing: Easing.out(Easing.ease)
                }),
                Animated.timing(this.state.opacityAnimated, {
                    toValue: 0,
                    duration: 0.5 * 1000//7
                    // tension
                    //easing:Easing.out(Easing.ease),
                }),
                Animated.timing(this.state.opacityAnimatedShow, {
                    toValue: 1,
                    duration: 0.5 * 1000,//7
                    // tension
                    easing: Easing.out(Easing.ease)
                })
            ]).start();

        updatePage(dispatch, {canUseBack: false, isShowTabBar: false});
        InteractionManager.runAfterInteractions(() => {
            this.doInitUpdate(false);
        })
    }

    /**
     * 显示当月目标
     * @return {[type]}
     */
    showNowTarget() {
        let {routeInfo, dispatch} = this.props;
        this.setState({
            toDelayTarget: false,
            toNowTarget: true
        });
        Animated.parallel(
            [
                Animated.timing(this.state.delayTop, {
                    toValue: -170 * changeRatio,
                    duration: 0.5 * 1000,//7
                    // tension
                    easing: Easing.out(Easing.ease)
                }),
                Animated.timing(this.state.nowTop, {
                    toValue: 90 * changeRatio,
                    duration: 0.5 * 1000,//7
                    // tension
                    easing: Easing.out(Easing.ease)
                }),
                Animated.timing(this.state.marginAnimated, {
                    toValue: 0,
                    duration: 0.5 * 1000,//7
                    // tension
                    easing: Easing.out(Easing.ease)
                }),
                Animated.timing(this.state.borderRadiusAnimated, {
                    toValue: 0,
                    duration: 0.5 * 1000,//7
                    // tension
                    easing: Easing.out(Easing.ease)
                }),
                Animated.timing(this.state.widthAnimated, {
                    toValue: deviceWidth,
                    duration: 0.5 * 1000,//7
                    // tension
                    easing: Easing.out(Easing.ease)
                }),
                Animated.timing(this.state.opacityAnimated, {
                    toValue: 0,
                    duration: 0.5 * 1000,//7
                    // tension
                    easing: Easing.out(Easing.ease)
                }),
                Animated.timing(this.state.opacityAnimatedShow, {
                    toValue: 1,
                    duration: 0.5 * 1000,//7
                    // tension
                    easing: Easing.out(Easing.ease)
                })
            ]).start();

        updatePage(dispatch, {canUseBack: false, isShowTabBar: false});
        InteractionManager.runAfterInteractions(() => {
            this.doInitUpdate(false);
        })

    }

    /**
     *  前往目标页面
     *  @return {[type]}
     */
    addTarget() {
        let route = {
            name: "AddTarget",
            type: 'AddTarget',
            path: 'none',
            component: AddTarget,
            index: 3
            //  tabManageInfo:AddTarget,
        }
        this.props.navigator.push(route)
    }

    /**
     * 去目标历史
     * @return {[type]}
     */
    toHistory() {
        let route = {
            name: "UserTargetHistory",
            type: 'UserTargetHistory',
            path: 'none',
            component: UserTargetHistory,
            index: 3
            //  tabManageInfo:AddTarget,
        }
        this.props.navigator.push(route)
    }

    /** 前往下属考评页面 **/
    toEvaluate() {
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
                name: "MonthCheck",
                type: 'MonthCheck',
                path: 'none',
                component: MonthCheck,
                index: currentRoute + 1
                //  tabManageInfo:AddTarget,
            }
            this.props.navigator.push(route)
        } else {
            Alert.alert("提示", "不好意思，您尚无该权限!");
        }

    }

    /** 进行目标延期操作 **/
    delayTargetPress(kpiMTargetUniqueid) {//目标延期
        let {dispatch, pageModel} = this.props;
        let PageData = pageModel.PageData;
        let postData = {
            token: PageData.token,
            userUniqueid: PageData.userUniqueid,
            orgUniqueid: PageData.orgUniqueid,
            kpiMTargetUniqueid: kpiMTargetUniqueid,
            x_token: PageData.token,
            type: "selfDelay"
        }
        //alert(this.props.navigator.getCurrentRoutes()[0].index)
        let obj = {
            route: null,
            toBack: false,
            needInitUpdate: -1
        }
        clientUserTargetDelayManage(this.props.dispatch, postData, obj, false)
    }

    /** 删除目标 **/
    deleteTargetPress(kpiMTargetUniqueid, key) {
        let {dispatch, pageModel} = this.props;
        let PageData = pageModel.PageData;
        let removeKpiMTargetUniqueidList = [];
        removeKpiMTargetUniqueidList[0] = kpiMTargetUniqueid;
        let postData = {
            token: PageData.token,
            userUniqueid: PageData.userUniqueid,
            orgUniqueid: PageData.orgUniqueid,
            removeKpiMTargetUniqueidList: removeKpiMTargetUniqueidList,
            x_token: PageData.token,
            type: "selfDeleteTarget"
        }
        //alert(this.props.navigator.getCurrentRoutes()[0].index)
        let obj = {
            route: null,
            toBack: false,
            needInitUpdate: -1
        }
        clientUserTargetManage(this.props.dispatch, postData, obj, false)
    }

    /** 申请关闭 **/
    delayTargetCloseRequestPress(kpiMTargetUniqueid, kpiMTDelayUniqueid, key) {
        let {dispatch, pageModel} = this.props;
        let PageData = pageModel.PageData;
        let postData = {
            token: PageData.token,
            userUniqueid: PageData.userUniqueid,
            orgUniqueid: PageData.orgUniqueid,
            kpiMTargetUniqueid: kpiMTargetUniqueid,
            kpiMTDelayUniqueid: kpiMTDelayUniqueid,
            x_token: PageData.token,
            type: "selfDelayCloseRequest"
        }
        //alert(this.props.navigator.getCurrentRoutes()[0].index)
        let obj = {
            route: null,
            toBack: false,
            needInitUpdate: -1
        }
        clientUserTargetDelayManage(this.props.dispatch, postData, obj, false)
    }

    /** 取消关闭 **/
    delayTargetCloseCancelPress(kpiMTargetUniqueid, kpiMTDelayUniqueid) {
        let {dispatch, pageModel} = this.props;
        let PageData = pageModel.PageData;
        let postData = {
            token: PageData.token,
            userUniqueid: PageData.userUniqueid,
            orgUniqueid: PageData.orgUniqueid,
            kpiMTargetUniqueid: kpiMTargetUniqueid,
            kpiMTDelayUniqueid: kpiMTDelayUniqueid,
            x_token: PageData.token,
            type: "selfDelayCloseCancel"
        }
        //alert(this.props.navigator.getCurrentRoutes()[0].index)
        let obj = {
            route: null,
            toBack: false,
            needInitUpdate: -1
        }
        clientUserTargetDelayManage(this.props.dispatch, postData, obj, false);
    }

    /** 更新进度 **/
    updateProgress(progress, kpiMTargetUniqueid) {
        let kpiMTargetUniqueidArray = [];
        let progressArray = [];
        kpiMTargetUniqueidArray[0] = kpiMTargetUniqueid;
        progressArray[0] = progress + "";
        let PageData = this.props.pageModel.PageData
        let postData = {
            kpiMTargetUniqueidArray: kpiMTargetUniqueidArray,
            progressArray: progressArray,
            token: PageData.token,
            userUniqueid: PageData.userUniqueid,
            orgUniqueid: PageData.orgUniqueid
        }
        changeUserTargetProgress(this.props.dispatch, postData, null);
    }

    render() {
        let PageData = this.props.pageModel.PageData;
        let lastMonthTargetsList = [];
        let nowMonthTargetsList = [];
        let lastMonthTargetSize = 0;
        let nowMonthTargetSize = 0;
        let totalProgess = 0;
        let currentMonthCompleteTargeSize = 0;
        let currentMonthCloseDelaySize = 0;
        let currentMonthExploitValue = 0;
        let currentMonthDelayTargetSize = 0;
        if (PageData.currentMonthCloseDelaySize !== undefined && PageData.currentMonthCloseDelaySize !== null) {
            currentMonthCloseDelaySize = PageData.currentMonthCloseDelaySize;
        }
        if (PageData.currentMonthCompleteTargeSize !== undefined && PageData.currentMonthCompleteTargeSize !== null) {
            currentMonthCompleteTargeSize = PageData.currentMonthCompleteTargeSize;
        }
        if (PageData.currentMonthExploitValue !== undefined && PageData.currentMonthExploitValue !== null) {
            currentMonthExploitValue = PageData.currentMonthExploitValue;
        }
        if (PageData.currentMonthDelayTargetSize !== undefined && PageData.currentMonthDelayTargetSize !== null) {
            currentMonthDelayTargetSize = PageData.currentMonthDelayTargetSize;
        }
        if (PageData.isRefreshing !== undefined && PageData.isRefreshing != null) {
            this.state.isRefreshing = PageData.isRefreshing
        }
        //上月遗留目标
        let that = this;
        if (PageData.lastMonthTargets !== undefined && PageData.lastMonthTargets !== null) {
            lastMonthTargetSize = PageData.lastMonthTargets.length;
        }
        if (PageData.passTargets !== undefined && PageData.passTargets !== null) {
            nowMonthTargetSize = PageData.passTargets.length;
            PageData.passTargets.forEach(function (obj, key) {
                let progress = obj.progress;
                let progressTemp = obj.progress;
                totalProgess += progressTemp;
            });

        }
        if (nowMonthTargetSize === 0) {
            totalProgess = 0;
        } else {
            totalProgess /= nowMonthTargetSize;
        }
        let rightComponent = <TouchableOpacity onPress={this.toHistory} style={{justifyContent: "center"}}><Text
            style={{color: "#ffffff",fontSize: 17 * topBarRatio}}>历史</Text></TouchableOpacity>;
        let progressViewType = "";
        let progressViewData = [];
        if (this.state.toNowTarget) {
            progressViewType = "selfPassTargets";
            progressViewData = PageData.passTargets;
        }
        if (this.state.toDelayTarget) {
            progressViewType = "selfDelayTargets";
            progressViewData = PageData.lastMonthTargets;
        }
        return (
            <View style={styles.container}>
                <TopBar
                    toback={this.toback}
                    layoutStyle={this.props.layoutStyle}
                    useAnimated={true}
                    AnimatedView={Animated.View}
                    style={{opacity: this.state.opacityAnimated}}
                    showRightImage={true}
                    rightComponent={rightComponent}
                    topBarText="目标"
                    showRight={false}
                    showLeft={this.props.showBack}
                />
                <Animated.View style={{flex: 0,opacity: this.state.opacityAnimatedShow}}>
                    {(this.state.toNowTarget || this.state.toDelayTarget) &&
                    <View
                        style={{width: deviceWidth,marginTop: 170 * changeRatio,flex:0,height:deviceHeight-170 * changeRatio}}>
                        <ProgressView focusIndex={this._textInputOnFocus}
                                      showProgressError={this.showProgressError}
                                      showFooter={true}
                            {...this.props}
                                      fetching={this.props.pageModel.PageState.fetching}
                                      sliderValueChange={this.updateProgress}
                                      delayTargetCloseRequestPress={this.delayTargetCloseRequestPress.bind(this)}
                                      delayTargetCloseCancelPress={this.delayTargetCloseCancelPress.bind(this)}
                                      delayTargetPress={this.delayTargetPress.bind(this)}
                                      deleteTargetPress={this.deleteTargetPress.bind(this)}
                                      data={progressViewData}
                                      type={progressViewType}
                                      layoutStyle={this.props.layoutStyle}
                                      isMostLevel={PageData.isMostLevel}
                        />
                    </View>
                    }
                </Animated.View>
                <Animated.View style={{flex: 1,opacity: this.state.opacityAnimated}}>
                    <View style={styles.top}>
                        <View style={styles.iconTitleView}>
                            <IconTitle fontStyle={styles.iconTitleFontStyle} imageStyle={styles.iconTitleStyle}
                                       style={{flex: 1}} describe={'立目标'} source={ImageResource['btn-01-target@2x.png']}
                                       onPress={this.addTarget}>
                            </IconTitle>
                        </View>
                        <View style={styles.iconTitleView}>
                            <IconTitle fontStyle={styles.iconTitleFontStyle} imageStyle={styles.iconTitleStyle}
                                       style={{flex: 1}} describe={'下属考评'}
                                       source={ImageResource['btn-02-evaluation@2x.png']} onPress={this.toEvaluate}>
                            </IconTitle>
                        </View>
                    </View>
                    <View style={styles.targetStatistical}>
                        <View style={styles.targetStatisticalHead}>
                            <View style={{justifyContent: "center",flex: 0,height: 40 * changeRatio}}><Image
                                style={styles.targetStatisticalHeadImage}
                                source={ImageResource['icon-target-red@2x.png']}></Image></View>
                            <View style={{justifyContent: "center",flex: 0,height: 40 * changeRatio}}><Text
                                style={styles.targetStatisticalHeadText}>本月目标统计</Text></View>
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
                            <View style={styles.targetStatisticalDetailRow}>
                                <View style={styles.targetStatisticalDetailRowTop}>
                                    <Text
                                        style={styles.targetStatisticalDetailRowTopText}>{currentMonthExploitValue}</Text>
                                </View>
                                <View style={styles.targetStatisticalDetailRowBottom}>
                                    <Text style={styles.targetStatisticalDetailRowBottomText}>获得功勋</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Animated.View>

                <Animated.Image
                    style={[styles.bgRedImage,{zIndex: 600,position: "absolute",top: this.state.delayTop,borderRadius: this.state.borderRadiusAnimated,marginLeft: this.state.marginAnimated,marginRight: this.state.marginAnimated,width: this.state.widthAnimated}]}
                    source={ImageResource["bg-target-past2@3x.png"]}>
                    {!this.state.toDelayTarget ?
                        <TouchableOpacity onPress={this.showDelayTarget} style={styles.bgImageContainer}>
                            <View style={styles.bgImageViewLeft}>
                                <Text style={styles.bgImageTextLeft}>延期目标</Text>
                            </View>

                            <View style={styles.bgImageViewRight}>
                                <Text style={styles.bgRedImageTextRight}>{lastMonthTargetSize}</Text>
                            </View>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={this.backTarget} style={styles.bgImageTopContainer}>

                            <Text style={styles.bgImageTopText}>延期目标</Text>
                            <Text style={styles.bgImageTopText2}>{lastMonthTargetSize}</Text>
                            <Text style={styles.bgImageTopText3}>延期目标总数</Text>

                        </TouchableOpacity>
                    }
                </Animated.Image>
                <Animated.Image
                    style={[styles.bgBlueImage,{zIndex: 600,position: "absolute",top: this.state.nowTop,borderRadius: this.state.borderRadiusAnimated,marginLeft: this.state.marginAnimated,marginRight: this.state.marginAnimated,width: this.state.widthAnimated}]}
                    source={ImageResource["bg-target-now2@3x.png"]}>
                    {!this.state.toNowTarget ?
                        <TouchableOpacity onPress={this.showNowTarget} style={styles.bgImageContainer}>
                            <View style={styles.bgImageViewLeft}>
                                <Text style={styles.bgImageTextLeft}>本月目标</Text>
                            </View>

                            <View style={styles.bgImageViewRight}>
                                <Text style={styles.bgBlueImageTextRight}>{nowMonthTargetSize}</Text>
                            </View>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={this.backTarget} style={styles.bgImageTopContainer}>

                            <Text style={styles.bgImageTopText}>本月目标</Text>
                            <Text style={styles.bgImageTopText2}>{totalProgess.toFixed(2)}%</Text>
                            <Text style={styles.bgImageTopText3}>个人综合进度</Text>

                        </TouchableOpacity>
                    }
                </Animated.Image>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(248,248,248)"
        //alignItems: "center"
    },
    top: {
        marginTop: topHeight,
        flex: 0,
        height: 120 * changeRatio,
        width: deviceWidth,
        backgroundColor: "rgb(48,173,245)",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
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
        flex: 0
    },
    iconTitleFontStyle: {
        fontSize: 17 * changeRatio,
        marginTop: 17 * changeRatio,
        color: "rgb(255,255,255)"
    },
    targetStatistical: {
        flex: 0,
        width: deviceWidth,
        height: 130 * changeRatio
    },
    targetStatisticalHead: {
        flex: 0,
        flexDirection: "row",
        height: 40 * changeRatio,
        width: deviceWidth - 40,
        marginLeft: 20 * changeRatio,
        marginRight: 20 * changeRatio,
        borderColor: "#e4ecf0",
        borderBottomWidth: 1
    },
    targetStatisticalHeadImage: {
        width: 18 * changeRatio,
        height: 18 * changeRatio,
        borderRadius: 9 * changeRatio,
        flex: 0
    },
    targetStatisticalHeadText: {
        flex: 0,
        marginLeft: 5 * changeRatio,
        fontSize: 14 * changeRatio,
        paddingLeft: 20 * changeRatio
    },
    targetStatisticalDetail: {
        flex: 0,
        height: 90 * changeRatio,
        width: deviceWidth,
        borderColor: "#e4ecf0",
        borderBottomWidth: 1,
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
        fontSize: 20 * changeRatio,
        color: "#2b3d54"
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
        color: "#838f9f"
    },
    bgBlueImage: {
        marginTop: -90 * changeRatio,
        height: 170 * changeRatio,
        flex: 0,
        borderRadius: 15 * changeRatio,
        width: deviceWidth - 40 * changeRatio,
        marginLeft: 20 * changeRatio,
        marginRight: 20 * changeRatio
    },
    bgImageContainer: {
        flex: 1,
        flexDirection: "row",
        padding: 20 * changeRatio
    },
    bgImageTopContainer: {
        flex: 1,
        alignItems: "center",
        padding: 20 * changeRatio,
        paddingTop: 30 * changeRatio
    },
    bgImageViewLeft: {
        alignItems: "flex-start",
        flex: 1,
        width: 100 * changeRatio,
        height: 40 * changeRatio,
        backgroundColor: "rgba(0,0,0,0)"
    },
    bgImageTextLeft: {
        fontSize: 24 * changeRatio,
        color: "#ffffff"
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
        flex: 0,
        width: 40 * changeRatio,
        height: 24 * changeRatio,
        borderRadius: 8,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center"
    },
    bgRedImageTextRight: {
        fontSize: 18 * changeRatio,
        color: "#d9432a"
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
        width: deviceWidth - 40 * changeRatio,
        height: 170 * changeRatio
    },
    btnText: {
        color: "#ffffff",
        fontSize: 15 * changeRatio
    }
});

export default TargetManage;