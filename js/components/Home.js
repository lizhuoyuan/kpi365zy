/**
 * 主页面
 * Created by yuanzhou on 16/10.
 */
import React, {Component, PropTypes} from 'react'
import {
    Animated,
    Platform,
    View,
    Slider,
    TouchableHighlight,
    PanResponder,
    Text,
    TextInput,
    StyleSheet,
    Image,
    Dimensions
} from 'react-native'
import TabBar from './common/TabBar'
import Tab_First from './Tab_First'
import {tabManage} from '../actions'
import SelfCenter from './SelfCenter'
import ImageResource from '../utils/ImageResource'
import Tweets from '../tweet/components/MainRouter'
import  * as SizeController from '../SizeController'
import CircularProgress from './common/CircularProgress'
import SplashScreen from 'react-native-splash-screen'
import DailyReport from './version2/DailyReport'
import TargetManage from './version2/TargetManage'
let topHeight = SizeController.getTopHeight();
let tabBarHeight = SizeController.getTabBarHeight();
let changeRatio = SizeController.getChangeRatio();
let tabBarRatio = SizeController.getTabBarRatio();

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
//'动态圈',
let tabsName = ['首页',
    '动态圈',
    '榜单',
    //'报告',
    //'目标',
    '我'];
let icons = [ImageResource['tab-home@2x.png'],
    ImageResource['tab-moment@2x.png'],
    // ImageResource['tab-report@2x.png'],
    //ImageResource['tab-target@2x.png'],
    ImageResource['tab-list@2x.png'],
    ImageResource['tab-user@2x.png'],
];
let iconClick = [ImageResource['tab-home2@2x.png'],
    ImageResource['tab-moment2@2x.png'],
    // ImageResource['tab-report2@2x.png'],
    //ImageResource['tab-target2@2x.png'],
    ImageResource['tab-list2@2x.png'],
    ImageResource['tab-user2@2x.png'],
];
let TestView = React.createClass({
    render(){
        return (<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Image style={{flex:0}} source={ImageResource["404-2@3x.png"]}></Image>
        </View>)
    }
});
let TestView2 = React.createClass({
    render(){
        return (<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <CircularProgress
                size={120}
                width={10}
                style={{backgroundColor:"red",height:60,width:120}}
                // tension={0}
                friction={0}
                fill={8/14*100}
                //prefill={70}
                //rotation={0}
                tintColor="#00e0ff"
                backgroundColor="#3d5875">
                {
                    (fill) => (
                        <Text>1/7</Text>
                    )
                }
            </CircularProgress>
        </View>)
    }
});
//Tweets,
const tabPages = [
    Tab_First,
    Tweets,
    // DailyReport,
    //TargetManage,
    TestView,
    SelfCenter
];
let Home = React.createClass({
    tabClick(index){
        let tabManageInfo = {
            tabClickIndex: index,
            component: tabPages[index],
            title: tabsName[index],
            isShowTabBar: true
        };
        tabManage(this.props.dispatch, tabManageInfo);
    },
    getInitialState: function () {
        return {
            tabClickIndex: 0,
            showLeftPanel: false,
            layoutStyle: {width: deviceWidth, height: deviceHeight},
            tabManage: {
                tabClickIndex: 0,
                component: null,
                isShowTabBar: true
            },
            pan: new Animated.ValueXY()
        }
    },
    watcher: null,
    startX: 0,
    componentDidMount: function () {
        SplashScreen.hide();//关闭启动屏幕
        this.watcher = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetResponder: (evt) => true,
            onPanResponderGrant: this._onPanResponderGrant,
            onPanResponderMove: this._onPanResponderMove,
        });
    },
    _onPanResponderGrant: function (e: Object, gestureState: Object) {
        this.startX = gestureState.x0
    },
    _onPanResponderMove: function (e: Object, gestureState: Object) {
        if (gestureState.moveX > (this.startX + 20)) {
            if (!this.state.showLeftPanel) {
                //Animated.spring(this.state.pan,{toValue:{x:0,y:0}}).start()
                this.setState({showLeftPanel: true})
            }
        }
        if (gestureState.moveX < (this.startX - 5)) {
            if (this.state.showLeftPanel) {
                this.setState({showLeftPanel: false, fadeAnim: new Animated.Value(0)})
            }
        }
    },
    _onLayout(e){
        if (this.state.layoutStyle.width != e.nativeEvent.layout.width || this.state.layoutStyle.height != e.nativeEvent.layout.height) {
            let layoutStyle = {}
            if (e.nativeEvent.layout.width > 0) {
                layoutStyle.width = e.nativeEvent.layout.width
            }
            if (e.nativeEvent.layout.height > 0) {
                layoutStyle.height = e.nativeEvent.layout.height
            }
            this.setState({layoutStyle: layoutStyle});
        }
    },
    //回退
    toback(e){
        //alert(1)
    },
    render(){
        let {pageModel} = this.props;
        let {tabManage, PageData} = pageModel;
        const tab_top_initStyle = Platform.OS == 'ios' ? styles.tab_top_ios : styles.tab_top_android
        if (this.props.navigator !== undefined && this.props.navigator !== null) {
            let currentRoutes = this.props.navigator.getCurrentRoutes()
            let currentRoute = currentRoutes[currentRoutes.length - 1]
            if (currentRoute.tabManageInfo !== undefined && currentRoute.tabManageInfo !== null) {
                tabManage = currentRoute.tabManageInfo
            }
        }
        let TabPage = tabPages[tabManage.tabClickIndex];
        let isShowTabBar = true;
        if (tabManage.isShowTabBar !== undefined && tabManage.isShowTabBar !== null) {
            isShowTabBar = tabManage.isShowTabBar;
        }
        if (tabManage.component) {
            TabPage = tabManage.component;
        }
        let tabText = tabsName[tabManage.tabClickIndex];
        if (tabManage.title) {
            tabText = tabManage.title
        }
        return (
            <View style={{flex:1,backgroundColor:"rgba(0,0,0,0)"}}>
                <View style={[{flex:1,backgroundColor:"rgba(0,0,0,0)"},isShowTabBar?{marginBottom:tabBarHeight}:{}]}>
                    <TabPage showBack={false} {...this.props} />
                </View>
                { isShowTabBar &&
                <TabBar
                    number={100}
                    layoutStyle={this.props.layoutStyle}
                    icons={icons} //初始时显示图片数组
                    iconClick={iconClick} //选中时显示图片数组
                    tabsName={tabsName} //底部文字数组
                    showMessageNumber={false} //是否显示数字  安卓版本尚有问题，待优化
                    showMessageNumberIndex={1} //显示数字的下标，从0开始
                    styleIcon={{width:this.props.layoutStyle.width/tabsName.length,flex:1,justifyContent:"center",}}
                    imageStyle={{width:24*tabBarRatio,height:24*tabBarRatio,borderRadius:0}}//有文字时的图片大小
                    imageStyleNoText={{width:45,height:45}}//无文字时图片大小
                    fontStyle={{color:"rgb(171,181,196)",fontSize:11*tabBarRatio,marginTop:4*tabBarRatio}} //底部文字样式
                    fontSelectedStyle={{color:"rgb(29,169,252)",fontSize:11*tabBarRatio,marginTop:4*tabBarRatio}}
                    tabClickIndex={tabManage.tabClickIndex} //选中的下标
                    tabClick={(index)=>this.tabClick(index)}/>
                }
            </View>
        )
    }
});

const styles = StyleSheet.create({
    tab: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: deviceWidth,
        height: 45,
        zIndex: 500,
        backgroundColor: '#cccccc'
    },
    backBtn: {
        flex: 1,
    },
    panView: {
        flex: 1,
        //marginTop:45,
        width: deviceWidth,
        height: deviceHeight,
        zIndex: 1,
        borderColor: '#ffffff',
        borderWidth: 1
    },
    tab_top_ios: {
        position: 'absolute',
        top: 0,
        width: deviceWidth,
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
        paddingTop: 15,
        backgroundColor: "rgb(48,173,245)",
        zIndex: 500,
        flexDirection: 'row'
    },
    tab_top_android: {
        position: 'absolute',
        top: 0,
        width: deviceWidth,
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
        backgroundColor: "rgb(48,173,245)",
        zIndex: 500,
        flexDirection: 'row'
    },
    leftPanel: {
        width: deviceWidth * 0.6,
        flex: 1,
        position: 'absolute',
        left: 0,
        backgroundColor: '#000000',
        height: deviceHeight,
        zIndex: 999
    },
    textColorWhite: {
        color: '#ffffff'
    },
    image: {
        borderRadius: 55,
        width: 25,
        height: 25,
    },
    backImage: {
        width: 25,
        height: 25,
        flex: 1
    },
    alignItemsLeft_IOS: {
        position: "absolute",
        left: 10,
        marginTop: 7.5,
        zIndex: 501
    },
    alignItemsLeft_ANDROID: {
        position: "absolute",
        left: 10,
        marginTop: 15,
        zIndex: 501,
    },
    alignItemsCenter: {
        alignItems: 'center',
        flex: 1,
    },
    alignItemsRight_IOS: {
        alignItems: 'flex-end',
        position: "absolute",
        marginTop: 7.5,
        right: 10,
    },
    alignItemsRight_ANDROID: {
        //alignItems:'flex-end',
        position: "absolute",
        //marginTop:15
        right: 10,
    },
    text: {
        fontWeight: '200',
        fontSize: 10
    }
});
export default Home
