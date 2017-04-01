/**
 * 初始页
 * Created by yuanzhou on 16/11.
 */
import React, {Component} from 'react'
import {
    Dimensions,
    ActivityIndicator,
    View,
    Alert,
    Animated,
    StyleSheet,
    TouchableOpacity,
    Text,
    TextInput,
    Image
} from 'react-native';
import IconTitle from './common/IconTitle'
import Login from './Login'
import Home from './Home'
import {doAutoLogin, login} from '../actions'
import ImageResource from '../utils/ImageResource'
import ViewPager from 'react-native-viewpager'
import SplashScreen from 'react-native-splash-screen'
import  * as SizeController from '../SizeController'
let topHeight = SizeController.getTopHeight();
let tabBarHeight = SizeController.getTabBarHeight();
let changeRatio = SizeController.getChangeRatio();
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const IMGS = [
    ImageResource['引导页-1@2x.png'],
    ImageResource['引导页-2@2x.png'],
    ImageResource['引导页-3@2x.png'],
];

let count = 0;
let InitPage = React.createClass({
    getInitialState: function () {
        var dataSource = new ViewPager.DataSource({
            pageHasChanged: (p1, p2) => p1 !== p2,
        });
        return {
            dataSource: dataSource.cloneWithPages(IMGS),
            page: 0,
            showLoading: false,
            doLogin: false
        };
    },
    viewpager: null,
    weixinOnPress(){
        Alert.alert('提示', "暂不支持该功能");
    },
    toLoginPage(){
        let route = {
            name: 'logn',
            type: 'login',
            path: 'none',
            component: Login,
            index: 0
        }
        this.props.navigator.resetTo(route);
    },
    _renderPage: function (data: Object, pageID: number | string,) {
        if (pageID < 3) {
            return (
                <Image
                    source={data}
                    style={styles.page}/>);
        } else {
            return (<Image source={data} style={styles.page}>
                    <TouchableOpacity style={styles.buttonText} onPress={this.toLoginPage}>
                        <Text style={{color:"#000000",fontSize:18}}>
                            登录
                        </Text>
                    </TouchableOpacity>
                </Image>
            )
        }
    },
    toRegistPage(){
        Alert.alert('提示', "暂不支持该功能");
    },
    onChangePage(index){
    },
    handleFunction(props){
        let {pageModel, dispatch, errorMsg} = props;
        let PageData = pageModel.PageData;
        let autoLogin = PageData.autoLogin;
        if (errorMsg) {
            this.toLoginPage();
        }
        if (autoLogin) {
            if (PageData.userId && PageData.password) {
                this.setState({
                    showLoading: true,
                });
                let route = {
                    name: 'home',
                    type: 'home',
                    path: 'none',
                    component: Home,
                    index: 1
                }
                let params = {};
                params.userId = PageData.userId;
                params.password = PageData.password;
                if (this.state.doLogin === false) {
                    login(dispatch, params, route, true);
                    this.setState({
                        doLogin: true,
                    });
                }

            } else if (PageData.userId) {
                this.toLoginPage();
            } else {
                SplashScreen.hide();//关闭启动屏幕
            }
        } else {
            SplashScreen.hide();//关闭启动屏幕
        }
    },
    componentDidMount(){
        let {getLocalInfoSuccess} = this.props.pageModel.PageData;
        if (getLocalInfoSuccess === true) {
            this.handleFunction(this.props);
        }
        //this.handleFunction(this.props);
        //SplashScreen.hide();//关闭启动屏幕
    },
    componentWillReceiveProps(nextProps){
        let {errorMsg} = nextProps;
        if (errorMsg) {
            this.toLoginPage();
        }
        let {getLocalInfoSuccess} = nextProps.pageModel.PageData;
        if (getLocalInfoSuccess === true) {
            this.handleFunction(nextProps);
        }
    },
    reload(){
        let {pageModel, dispatch} = this.props;
        let PageData = pageModel.PageData;
        let route = {
            name: 'home',
            type: 'home',
            path: 'none',
            component: Home,
            index: 1
        }
        let params = {};
        params.userId = PageData.userId;
        params.password = PageData.password;
        login(dispatch, params, route, true);
    },
    render(){
        let {errorMsg} = this.props;
        let showErrorMsg = false;
        if (errorMsg !== "") {
            showErrorMsg = true;
        }
        return (

            <View style={{flex:1}}>
                { this.state.showLoading ?
                    null
                    :
                    <View style={{flex:1,marginTop:40*changeRatio}}>
                        <ViewPager
                            ref={(viewpager) => {this.viewpager = viewpager}}
                            style={{flex:1}}
                            dataSource={this.state.dataSource}
                            renderPage={this._renderPage}
                            isLoop={false}
                            onChangePage={this.onChangePage}
                            autoPlay={false}
                        />
                        <View style={{height:100*changeRatio,backgroundColor:"#ffffff"}}></View>
                        <TouchableOpacity style={styles.buttonText} onPress={this.toLoginPage}>
                            <Text
                                style={{color:"#ffffff",letterSpacing:10*changeRatio,marginLeft:10*changeRatio,fontSize:18*changeRatio,textAlign:"center"}}
                            >
                                登录
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>

        )
    }
})
const styles = StyleSheet.create({
    page: {
        height: deviceHeight - 100 * changeRatio,
        width: deviceWidth,
        flex: 1
    },
    container: {
        flex: 1,
        padding: 20 * changeRatio
    },
    container_top: {
        width: deviceWidth - 40 * changeRatio,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50 * changeRatio
    },
    titleFirstView: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleFirstText: {
        fontSize: 30 * changeRatio,
        fontWeight: '600'
    },
    titleSecondView: {
        marginTop: 20 * changeRatio,
        alignItems: 'center',
        justifyContent: 'center'
    },
    hrView: {
        borderTopColor: '#cccccc',
        borderTopWidth: 1,
        width: (deviceWidth - 130 * changeRatio) / 2
    },
    container_bottom: {
        width: deviceWidth - 40 * changeRatio,
        position: 'absolute',
        bottom: 20 * changeRatio
    },
    shejiao: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    shejiao_text: {
        fontSize: 15 * changeRatio
    },
    shejiao_icon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15 * changeRatio
    },
    buttonText: {

        height: 40 * changeRatio,
        position: "absolute",
        bottom: 30 * changeRatio,
        margin: 20 * changeRatio,
        width: deviceWidth - 40 * changeRatio,
        backgroundColor: "rgb(29,169,252)",
        borderRadius: 20 * changeRatio,
        borderColor: '#000000',
        justifyContent: "center",
        alignItems: "center",
        zIndex: 300,
    }
});
export default InitPage
