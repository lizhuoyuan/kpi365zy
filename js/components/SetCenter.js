/**
 * 设置中心
 * Created by yuanzhou on 17/1.
 */
import React from 'react'
import {View, Text, Image, Switch, TouchableOpacity, StyleSheet} from 'react-native'
import TopBar from './common/TopBar'
import ImageResource from '../utils/ImageResource'
import {logoutAction} from '../actions'
import Login from './Login'
import AboutUs from './AboutUs'
import AccountAndSecurity from './AccountAndSecurity'
import  * as SizeController from '../SizeController'
let topHeight = SizeController.getTopHeight();
let tabBarHeight = SizeController.getTabBarHeight();
let changeRatio = SizeController.getChangeRatio();
const SetCenter = React.createClass({
    toback(){ //返回
        this.props.navigator.pop();
    },
    toLogout(){ //登出
        let route = {
            name: 'Login',
            type: 'Login',
            path: 'none',
            component: Login,
            index: 0,
        };
        logoutAction(this.props.dispatch);
        this.props.navigator.resetTo(route);
    },
    toAboutUs(){ //去关于我们页面
        let {navigator} = this.props;
        let route = {
            name: 'AboutUs',
            type: 'AboutUs',
            path: 'none',
            component: AboutUs,
            index: navigator.getCurrentRoutes().length + 1,
        };

        navigator.push(route);
    },
    /**
     * 前往帐号与安全页面
     */
    toAccountAndSecurity(){
        let {navigator, routeInfo} = this.props;
        let route = {
            name: 'AccountAndSecurity',
            type: 'AccountAndSecurity',
            path: 'none',
            component: AccountAndSecurity,
            index: routeInfo.index + 1,
        };

        navigator.push(route);
    },
    getInitialState(){
        return {
            isSwitchOpen: true,
        }
    },
    _onValueChange(value){
        this.setState({isSwitchOpen: value});
    },
    render(){

        return (
            <View style={styles.container}>
                <TopBar toback={this.toback}
                        layoutStyle={this.props.layoutStyle}
                        topBarText={"设置"}
                        topBarTextBottomShow={false}
                        topBarTextRight=""
                        showRight={false}
                        showLeft={true}
                />
                <TouchableOpacity onPress={this.toAccountAndSecurity}
                                  style={[styles.viewStyle,{marginTop:topHeight,borderTopWidth:1,borderColor:"rgb(197,205,215)"}]}>
                    <View style={{alignItems:"flex-start",width:100*changeRatio,flex:0,justifyContent:"center"}}><Text
                        style={styles.leftText}>账户与安全</Text></View>
                    <View style={{alignItems:"flex-end",flex:1}}>
                        <View style={{flexDirection:"row",flex:1}}>
                            <View style={{justifyContent:"center"}}>
                                <Image style={styles.imageStyle} source={ImageResource["login-pswd@2x.png"]}>
                                </Image>
                            </View>
                            <View style={{justifyContent:"center",marginLeft:5*changeRatio,marginRight:10*changeRatio}}><Text
                                style={[styles.rightRightText]}>已保护</Text></View>
                            <View style={{justifyContent:"center"}}>
                                <Image style={styles.imageStyle} source={ImageResource["arrows@2x.png"]}>
                                </Image>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={styles.hrView}>
                </View>
                {false && <View
                    style={{flex:0,height:50*changeRatio,backgroundColor:"#ffffff",flexDirection:"row",padding:10*changeRatio}}>
                    <View style={{alignItems:"flex-start",flex:1,justifyContent:"center"}}><Text
                        style={styles.leftText}>消息通知</Text></View>
                    <View style={{alignItems:"flex-end",flex:1,justifyContent:"center"}}>
                        <Switch value={this.state.isSwitchOpen} onValueChange={this._onValueChange}/>
                    </View>
                </View>
                }
                {false && <View style={styles.hrView}>
                </View>
                }
                {false &&
                <TouchableOpacity style={styles.viewStyle}>
                    <View style={{alignItems:"flex-start",width:80*changeRatio,flex:0,justifyContent:"center"}}><Text
                        style={styles.leftText}>清理缓存</Text></View>
                    <View style={{alignItems:"flex-end",flex:1}}>
                        <View style={{flexDirection:"row",flex:1}}>
                            <View style={{justifyContent:"center",marginRight:10*changeRatio}}><Text
                                style={[styles.rightRightText]}>320M</Text></View>
                            <View style={{justifyContent:"center"}}>
                                <Image style={styles.imageStyle} source={ImageResource["arrows@2x.png"]}>
                                </Image>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                }
                {false &&
                <View style={styles.hrView}>
                </View>
                }
                <TouchableOpacity onPress={this.toAboutUs}
                                  style={[styles.viewStyle,{borderBottomWidth:1,borderColor:"rgb(197,205,215)"}]}>
                    <View style={{alignItems:"flex-start",flex:1,justifyContent:"center"}}><Text
                        style={styles.leftText}>关于我们</Text></View>
                    <View style={{alignItems:"flex-end",flex:1,justifyContent:"center"}}>
                        <Image style={styles.imageStyle} source={ImageResource["arrows@2x.png"]}>
                        </Image>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.toLogout} style={styles.btnView}>
                    <Text style={{color:"rgb(244,63,60)",fontSize:16*changeRatio}}>退出登录</Text>
                </TouchableOpacity>
            </View>
        )
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(248,248,248)"
    },

    leftText: {
        color: "rgb(43,61,84)",
        fontSize: 16 * changeRatio
    },
    rightText: {
        color: "rgb(197,205,215)",
        fontSize: 16 * changeRatio
    },
    rightRightText: {
        fontSize: 15 * changeRatio,
        color: "#838f9f",
        marginLeft: 5 * changeRatio,
    },
    imageStyle: {
        height: 20 * changeRatio,
        width: 20 * changeRatio
    },
    viewStyle: {
        flex: 0,
        height: 50 * changeRatio,
        backgroundColor: "#ffffff",
        flexDirection: "row",
        padding: 10 * changeRatio
    },
    hrView: {
        borderBottomWidth: 1,
        borderColor: "rgb(197,205,215)",
        marginLeft: 10 * changeRatio,
        marginRight: 10 * changeRatio,
    },
    btnView: {
        flex: 0,
        height: 50 * changeRatio,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        padding: 10 * changeRatio,
        marginTop: 15 * changeRatio,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: "rgb(197,205,215)"
    }
});

export default SetCenter;