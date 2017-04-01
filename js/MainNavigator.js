'use strict';
import React, {Component} from 'react';
import {
    Platform,
    PropTypes,
    StyleSheet,
    View,
    Navigator,
    Text,
    Alert,
    BackAndroid,
    ToastAndroid,
    AppState,
    Dimensions,
    TouchableOpacity,
    Animated,
    PanResponder,
    Image

} from 'react-native'
import {connect} from 'react-redux'
import {createAction} from 'redux-actions'
import {initApp, clearError} from './actions'
import * as ActionTypes from './actions/ActionTypes'
//import Orientation from 'react-native-orientation'
import Login from './components/Login'
import InitPage from './components/InitPage'
import MainPage from './MainPage'
import Loader from './components/common/Loader'
import codePush from 'react-native-code-push'
import appVersionManager from './AppVersionManager'
import ImageResource from './utils/ImageResource'
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const topHeight = 70;
if (Platform.OS === 'ios') {
    topHeight = 70;
} else {
    topHeight = 55;
}
class MainNavigator extends Component {
    constructor() {
        super();
        this.state = {
            layoutStyle: {width: deviceWidth, height: deviceHeight},
            showUpdate: false,
            hideUpdate: false,
            receivedBytes: 0,
            totalBytes: 0,
            rightPan: new Animated.ValueXY({x: 0, y: 60}),
            initTop: 60,
            initLeft: 0,
            downLoadComplete: false,
        };

        this.current = {
            route: {
                name: '_appInit',
                type: '_appInit',
                path: 'none',
                component: InitPage,
                index: 0,
            }
        };
        this.pending = false;
        this.backgroudTime = Date.now();
    }


    codePushStatusDidChange(status) {
        switch (status) {
            case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                console.log("Checking for updates.");
                break;
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                console.log("Downloading package.");
                break;
            case codePush.SyncStatus.INSTALLING_UPDATE:
                console.log("Installing update.");
                break;
            case codePush.SyncStatus.UP_TO_DATE:
                console.log("Up-to-date.");
                break;
            case codePush.SyncStatus.UPDATE_INSTALLED:
                console.log("Update installed.");
                break;
        }
    }

    codePushDownloadDidProgress(progress) {
        if (progress.receivedBytes < progress.totalBytes) {
            this.setState({
                showUpdate: true,
                receivedBytes: progress.receivedBytes,
                totalBytes: progress.totalBytes,
                downLoadComplete: false
            });
        } else {
            this.setState({
                showUpdate: true,
                receivedBytes: progress.receivedBytes,
                totalBytes: progress.totalBytes,
                downLoadComplete: true
            });
        }
    }

    _onLayout(e) {
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
    }

    renderScene(route, navigator) {
        let {pageModel, dispatch} = this.props;
        let Component = route.component;
        return (
            <MainPage route={route} navigator={navigator} pageModel={pageModel} dispatch={dispatch}/>
        )
    }

    initRoute() {
        return this.current.route;
    }

    clearError() {
        clearError(this.props.dispatch)
    }

    /**
     * 显示消息
     * @param title
     * @param message
     * @private
     */
    _showMessage(title = '提示', message = '') {
        Alert.alert(title, message,
            [{text: '确认', onPress: () => this.clearError()}]);
    }

    componentWillReceiveProps(nextProps) {
        let {pageModel} = nextProps;
        let PageData = pageModel.PageData;
        //判断是否session过期
        if (PageData.ERROR && PageData.ERROR === "SESSION_ERROR") {
            PageData.ERROR = null
            let route = {
                name: 'Login',
                type: 'Login',
                path: 'none',
                component: Login,
                index: 0,
            }
            this.refs.kpiNavigator.resetTo(route)
        }
        //判断是否可以使用左滑
        if (PageData.canUseBack !== undefined && PageData.canUseBack !== null) {
            let navigator = this.refs.kpiNavigator;
            let routes = navigator.getCurrentRoutes();
            let route = routes[routes.length - 1];
            route["canUseBack"] = PageData.canUseBack;
            this.refs.kpiNavigator.immediatelyResetRouteStack(routes);
        }
        //判断是否返回
        if (PageData.toBack) {
            if (PageData.toBackIndex && PageData.toBackIndex >= 0) {
                PageData.toBack = false;
                let index = PageData.toBackIndex;
                PageData.toBackIndex = -1;
                let navigator = this.refs.kpiNavigator;
                navigator.popToRoute(navigator.getCurrentRoutes()[index]);
            } else {
                pageModel.PageData.toBack = false;
                this.refs.kpiNavigator.pop();
            }
        } else {
            //判断route是否为null
            if (PageData.route) {
                let currentRoutes = this.refs.kpiNavigator.getCurrentRoutes();
                let currentRoute = currentRoutes[currentRoutes.length - 1];
                let nextRoute = PageData.route;
                if (currentRoute.index === 0) {
                    if (nextRoute.name !== currentRoute.name) {
                        if (nextRoute.index === 0) {
                            this.refs.kpiNavigator.push(nextRoute);
                        } else {
                            this.refs.kpiNavigator.resetTo(nextRoute);
                        }
                    }
                } else {
                    //判断当前route和下一个route名称是否相等
                    if (nextRoute.name !== currentRoute.name) {
                        if (nextRoute.tabManageInfo) {
                            pageModel.tabManage = nextRoute.tabManageInfo;
                        }
                        if (nextRoute.index === 1 || nextRoute.index === 0) {
                            this.refs.kpiNavigator.resetTo(nextRoute);
                        } else {
                            if (currentRoute.index === nextRoute.index) {
                                this.refs.kpiNavigator.replace(nextRoute);
                            } else {
                                this.refs.kpiNavigator.push(nextRoute);
                            }
                        }
                    }
                }
                PageData.route = null;
            }
        }


    }

    lastBackPressed: 0

    /**
     * 处理场景动画
     * @param route
     * @param routeStack
     * @returns {*}
     * @private
     */
    _handleConfigureScene(route, routeStack) {
        if (route.canUseBack && !route.canUseBack) {
            return {...Navigator.SceneConfigs.PushFromRight, gestures: null};
        } else {
            return Navigator.SceneConfigs.PushFromRight;
        }
    }

    /**
     * 处理返回键
     * @returns {boolean}
     * @private
     */
    _handleBack(e) {
        // TODO 如果在顶层Navigator, 则退出App
        let currentRoutes = this.refs.kpiNavigator.getCurrentRoutes()
        let currentRoute = currentRoutes[currentRoutes.length - 1]
        if (currentRoutes.length > 0 && currentRoute.index > 1) {
            this.refs.kpiNavigator.pop()
        } else {
            if (e.lastBackPressed && (e.lastBackPressed + 2000 >= Date.now())) {
                //最近2秒内按过back键，可以退出应用。
                BackAndroid.exitApp();
                return true;
            }
            e.lastBackPressed = Date.now();
            ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
        }

        return true;
    }

    componentWillMount() {
       // Orientation.lockToPortrait();
    }

    componentDidMount() {
        let {pageModel, dispatch} = this.props;
        // pageModel.PageData.showDownLoad = true;
        initApp(dispatch);
        // 检查app更新
        // appVersionManager.upgrade();
        //appVersionManager.update();
        //监听键盘
        //  DeviceEventEmitter.addEventListener('keyBoardWillShow',(frame)=>this.updateKeyboardSpace.bind(this,this))
        // 监听返回键
        BackAndroid.addEventListener('hardwareBackPress', this._handleBack.bind(this, this));
        AppState.addEventListener("change", (newState) => {
            if (newState === 'background') {
                this.backgroudTime = Date.now();
            } else if (newState === 'active'
                && (Date.now() - this.backgroudTime) > 3600000) {
                dispatch(createAction(ActionTypes.APP_RESTART, () => {
                })());
            }
        });
    }

    componentWillUnMount() {
        BackAndroid.removeEventListener('hardwareBackPress', this._handleBack);
        AppState.removeEventListener('change', () => {
        });

    }

    /**
     * 重启app
     * @private
     */
    _restartApp() {
        codePush.restartApp();
    }

    _hideUpdate() {
        this.setState({hideUpdate: !this.state.hideUpdate});
    }

    render() {
        return (
            <View style={{flex:1}}>
                {this.state.showUpdate &&
                <Animated.View
                    style={[styles.updateAnimatedView,styles.updateAnimatedViewTransform,this.state.hideUpdate?{left:-2*deviceWidth,zIndex:0,width:0,height:0}:{}]}
                >
                    <Text style={styles.updateText}>下载完成后需重启app方能生效😀</Text>
                    <Text style={styles.updateTextProgress}>
                        {(this.state.receivedBytes / 1024 / 1024).toFixed(1) + "M/" + (this.state.totalBytes / 1024 / 1024).toFixed(1) + "M"}
                    </Text>
                    <View style={styles.updateProgressViewContainer}>
                        <View
                            style={{height:10,width:80*(this.state.receivedBytes/this.state.totalBytes),backgroundColor:"rgb(29,169,252)"}}>
                        </View>
                    </View>
                    <View style={styles.updateBtnView}>
                        { this.state.downLoadComplete &&
                        <TouchableOpacity
                            onPress={this._restartApp.bind(this)}
                            style={styles.updateBtnLeft}
                        >
                            <Text style={{fontSize:11,color:"#ffffff"}}>重启</Text>
                        </TouchableOpacity>}
                        <TouchableOpacity
                            onPress={this._hideUpdate.bind(this)}
                            style={styles.updateBtnRight}>
                            <Text style={{fontSize:11,color:"#ffffff"}}>隐藏</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
                }
                {this.state.showUpdate &&
                <TouchableOpacity
                    onPress={this._hideUpdate.bind(this)}
                    style={[styles.updateBtnShowDetail,this.state.hideUpdate?{}:{left:-2*deviceWidth,zIndex:0,width:0,height:0}]}
                >
                    <Text style={styles.updateBtnShowDetailText}>更新显示</Text>
                </TouchableOpacity>
                }

                <Navigator
                    renderScene={this.renderScene.bind(this)}
                    ref="kpiNavigator"
                    initialRoute={this.initRoute.bind(this)()}
                    configureScene={(route,routeStack)=>{
                        if (route.canUseBack === false) {
                            return {...Navigator.SceneConfigs.PushFromRight, gestures: null};
                        } else {
                            return Navigator.SceneConfigs.PushFromRight;
                        }
                    }}
                    sceneStyle={styles.sceneStyle}
                />
            </View>
        );
    }
}


let codePushOptions = {

    updateDialog: {
        appendReleaseDescription: true,
        descriptionPrefix: "\n\n更新日志:\n",
        optionalIgnoreButtonLabel: '忽略',
        optionalInstallButtonLabel: '安装',
        optionalUpdateMessage: '发现增量更新包,是否更新?',
        title: '增量更新'
    },
    installMode: codePush.InstallMode.ON_NEXT_RESTART
};
// 开启热更新
MainNavigator = codePush(codePushOptions)(MainNavigator);

function mapStateToProps(state) {
    return {
        pageModel: state,

    }
}
/**
 * 使用了动态创建Action的函数，不在bind到具体的Action
 * @param dispatch
 * @returns {{dispatch: *}}
 */
function mapDispatchToProps(dispatch) {
    return {
        //actions: bindActionCreators(Actions, dispatch)
        dispatch: dispatch
    }
}

const styles = StyleSheet.create({
    sceneStyle: {
        flex: 1,
        backgroundColor: "transparent"
    },
    updateAnimatedView: {
        position: "absolute",
        top: topHeight + 5,
        right: 20,
        backgroundColor: "rgb(187,229,254)",
        padding: 10,
        borderTopLeftRadius: 160,
        borderBottomLeftRadius: 160,
        borderBottomRightRadius: 160,
        borderTopRightRadius: 0,
        zIndex: 500,
        flex: 0,
        justifyContent: "center",
        height: 140,
        width: 130,
        alignItems: "center"
    },
    updateAnimatedViewTransform: {
        transform: [
            {translateY: -15},
            {skewX: "2deg"},
            {skewY: "2deg"},
            {rotateZ: "20deg"}
        ]
    },
    updateText: {
        fontSize: 11,
        marginLeft: 30,
        width: 70,
        textAlign: "center",
        color: "red",
        flex: 1
    },
    updateTextProgress: {
        fontSize: 11,
        marginTop: 8,
        color: "black"
    },
    updateProgressViewContainer: {
        height: 10,
        width: 80,
        marginTop: 0,
        flexDirection: "row",
        backgroundColor: "grey"
    },
    updateProgressView: {},
    updateBtnLeft: {
        flex: 0,
        height: 23,
        justifyContent: "center",
        marginRight: 10,
        backgroundColor: "rgb(29,169,252)",
        padding: 4
    },
    updateBtnRight: {
        flex: 0,
        height: 23,
        justifyContent: "center",
        backgroundColor: "rgb(29,169,252)",
        padding: 4
    },
    updateBtnView: {
        flex: 1,
        marginTop: 8,
        flexDirection: "row",
        alignItems: "center"
    },
    updateBtnShowDetail: {
        top: topHeight + 5,
        borderTopLeftRadius: 10,
        position: "absolute",
        right: 0,
        flex: 1,
        zIndex: 500,
        height: 23,
        justifyContent: "center",
        backgroundColor: "rgb(29,169,252)",
        padding: 4
    },
    updateBtnShowDetailText: {
        fontSize: 11,
        color: "#ffffff"
    }
});
// 包装 component ，注入 dispatch 和 state ；
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainNavigator);
