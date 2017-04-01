/**
 * 登录页
 * Created by yuanzhou on 16/10.
 */
import React, {Component} from 'react'
import {
    KeyboardAvoidingView,
    View,
    Alert,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Text,
    TextInput,
    ImagePickerIOS,
    Image
} from 'react-native';
import {login} from '../actions'
import InitPage from './InitPage'
import Home from './Home'
import ImageResource from '../utils/ImageResource'
import  * as SizeController from '../SizeController'
import SplashScreen from 'react-native-splash-screen'
let topHeight = SizeController.getTopHeight();
let tabBarHeight = SizeController.getTabBarHeight();
let changeRatio = SizeController.getChangeRatio();
let tabBarRatio = SizeController.getTabBarRatio();
let messageNum = 1;
let Login = React.createClass({
    userId: "",
    password: "",
    getInitialState: function () {
        return {
            isFirstInit: true,
            fetching: false,
            userId: "",
            password: "",
        }
    },
    componentDidMount(){
        SplashScreen.hide();//关闭启动屏幕
        this.setState({
            userId: this.props.pageModel.PageData.userId,
            password: this.props.pageModel.PageData.password
        });
    },
    componentWillReceiveProps(nextProps, nextStates){
        if (this.state.userId == "") {
            this.setState({
                userId: nextProps.pageModel.PageData.userId,
                password: nextProps.pageModel.PageData.password
            });
        }
    },
    doPost(){
        this.state.isFirstInit = false
        let route = {
            name: 'home',
            type: 'home',
            path: 'none',
            component: Home,
            index: 1
        };
        let params = {};
        if (this.state.userId != null && this.state.userId != "" && this.state.password != null && this.state.password != "") {
            params.userId = this.state.userId//"administrator"
            params.password = this.state.password//"123456"
            const {dispatch} = this.props
            login(dispatch, params, route, false)
        } else {
            Alert.alert("提示", "账号密码不能为空😅",
                [{text: '确认'}]);
        }
    },
    _getSource(){

    },
    _onLoadEnd(){

    },
    changeUserId(value){
        this.setState({userId: value});
    },
    changePassword(value){
        this.setState({password: value});
    },
    toBack(){
        let route = {
            name: '_appInit',
            type: '_appInit',
            path: 'none',
            component: InitPage,
            index: 0
        };
        this.props.navigator.replace(route)
    },
    /**
     * 显示消息
     * @param title
     * @param message
     * @private
     */
    _showMessage(title = '提示', message = '') {
        messageNum++;
        Alert.alert(title, message,
            [{text: '确认'}]);
    },
    render(){
        let pageModel = this.props.pageModel
        this.state.fetching = pageModel.PageState.fetching
        let errorMsg = "";
        return (
            <View style={styles.login}>

                {false && <TouchableOpacity onPress={this.toBack}
                                            style={{backgroundColor:"rgb(48,173,245)",height:55*changeRatio,justifyContent:"center",paddingTop:15*changeRatio}}>
                    <Image
                        style={styles.backImg}
                        source={ImageResource['nav-back@2x.png']}
                        onLoadEnd={this._onLoadEnd}
                    />
                </TouchableOpacity>}

                <View style={{padding:20*changeRatio}}>
                    <KeyboardAvoidingView behavior={"position"}>
                        <View style={{alignItems:"center"}}>
                            <View style={styles.imageView}>
                                <Image
                                    style={styles.loginlogo}
                                    source={ImageResource["login-LOGO@2x.png"]}
                                    onLoadEnd={this._onLoadEnd}
                                />
                            </View>
                        </View>

                        <View style={styles.loginuserno}>
                            <View style={styles.imageStyleView}>
                                <Image style={styles.imageStyle}
                                       source={ImageResource["login-ueser@2x.png"]}>
                                </Image>
                            </View>
                            <View style={styles.textInputView}>
                                <TextInput underlineColorAndroid={'transparent'} style={styles.textInputFlex}
                                           ref={"userId"}
                                           placeholder="账号" defaultValue={this.state.userId}
                                           onChangeText={this.changeUserId}>
                                </TextInput>
                            </View>
                        </View>
                        <View style={styles.loginpassword}>
                            <View style={styles.imageStyleView}>
                                <Image style={styles.imageStyle}
                                       source={ImageResource["login-pswd@2x.png"]}>
                                </Image>
                            </View>
                            <View style={styles.textInputView}>
                                <TextInput underlineColorAndroid={'transparent'} style={styles.textInputFlex}
                                           ref={"password"} defaultValue={this.state.password}
                                           onChangeText={this.changePassword} secureTextEntry={true} placeholder="密码">
                                </TextInput>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.loginbtnlogin}
                            activeOpacity={0.7}
                            onPress={this.doPost}>
                            <View >
                                <Text
                                    style={{color:"#ffffff",letterSpacing:10*changeRatio,marginLeft:10*changeRatio,fontSize:18*changeRatio}}>
                                    登录
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                    {false &&
                     <TouchableOpacity
                        style={{alignItems:"center"}}
                        activeOpacity={0.7}
                        //onPress={}
                    >
                        <View >
                            <Text style={{color:"#abb5c4",fontSize:15*changeRatio}}>
                                忘记密码？
                            </Text>
                        </View>
                    </TouchableOpacity>
                    }
                </View>

                <View style={{alignItems:"center"}}><Text
                    style={{color:"red",fontSize:16*changeRatio}}>{errorMsg}</Text></View>

            </View>
        )
    }
})
const styles = StyleSheet.create({
    login: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: "#ffffff"
    },
    "imageView": {
        alignItems: 'center',
        marginTop: 90 * changeRatio,
        height: 80 * changeRatio,
        width: 80 * changeRatio,
        borderRadius: 40 * changeRatio,
        marginBottom: 100 * changeRatio,
        borderColor: "rgb(229,229,229)",
        borderWidth: 1
    },
    "loginlogo": {
        height: 80 * changeRatio,
        width: 80 * changeRatio,
        borderRadius: 40 * changeRatio,
        alignItems: 'center',
    },
    textInputFlex: {
        flex: 1,
        padding:0,
        fontSize: 18 * changeRatio,
        color: "rgb(43,61,84)"
    },
    "loginuserno": {
        flex: 0,
        flexDirection: "row",
        height: 40 * changeRatio,
        marginBottom: 15 * changeRatio,
        borderWidth: 1,
        borderRadius: 8 * changeRatio,
        borderColor: 'rgb(229,229,229)',
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        paddingLeft: 10 * changeRatio,
        paddingRight: 10 * changeRatio
    },
    "loginpassword": {
        flex: 0,
        flexDirection: "row",
        height: 40 * changeRatio,
        borderWidth: 1,
        borderRadius: 8 * changeRatio,
        borderColor: 'rgb(229,229,229)',
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        paddingLeft: 10 * changeRatio,
        paddingRight: 10 * changeRatio
    },

    "loginbtnlogin": {
        marginTop: 20 * changeRatio,
        borderRadius: 20 * changeRatio,
        backgroundColor: "rgb(29,169,252)",
        height: 40 * changeRatio,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20 * changeRatio,
    },
    backImg: {
        width: 20 * changeRatio,
        height: 20 * changeRatio,
        marginLeft: 20 * changeRatio
    },
    imageStyle: {
        flex:0,
        width: 25 * changeRatio,
        height: 25 * changeRatio,
    },
    imageStyleView: {
        flex:0,
        justifyContent: "center",
        height: 36 * changeRatio,
    },
    textInputView:{
        flex:1,
        justifyContent:"center",
        marginLeft: 10 * changeRatio
    }
});

export default Login
