/**
 * 关于我们
 * Created by yuanzhou on 17/01.
 */
import React from 'react'
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native'
import TopBar from './common/TopBar'
import ImageResource from '../utils/ImageResource'
import {logoutAction} from '../actions'
import Login from './Login'
import  * as SizeController from '../SizeController'
let topHeight = SizeController.getTopHeight();
let tabBarHeight = SizeController.getTabBarHeight();
let changeRatio = SizeController.getChangeRatio();

const AboutUs = React.createClass({
    toback(){
        this.props.navigator.pop();
    },
    render(){

        return (
            <View style={styles.container}>
                <TopBar toback={this.toback}
                        layoutStyle={this.props.layoutStyle}
                        topBarText={"关于我们"}
                        topBarTextBottomShow={false}
                        topBarTextRight=""
                        showRight={false}
                        showLeft={true}
                />
                <View
                    style={{marginTop:topHeight+15*changeRatio,justifyContent:"center",alignItems:"center",height:120*changeRatio,flex:0}}>
                    <View style={{width:80,backgroundColor:"#ffffff",height:80*changeRatio,flex:0}}>
                        <Image style={{width:80*changeRatio,height:80*changeRatio}}
                               source={ImageResource["LOGO@1x.png"]}>
                        </Image>
                    </View>
                    <Text style={{marginTop:5*changeRatio,fontSize:16*changeRatio}}>KPI 1.0</Text>
                </View>
                {false &&
                <View>
                    <TouchableOpacity
                        style={[styles.viewStyle,{marginTop:15*changeRatio,borderTopWidth:1,borderBottomWidth:1,borderColor:"rgb(197,205,215)"}]}>
                        <View style={{alignItems:"flex-start",flex:1,justifyContent:"center"}}><Text
                            style={styles.leftText}>去评分</Text></View>
                        <View style={{alignItems:"flex-end",flex:1,justifyContent:"center"}}><Image
                            style={styles.imageStyle} source={ImageResource["arrows@2x.png"]}></Image></View>
                    </TouchableOpacity>
                    <View style={styles.hrView}></View>
                    <TouchableOpacity
                        style={{flex:0,height:50*changeRatio,backgroundColor:"#ffffff",flexDirection:"row",padding:10*changeRatio}}>
                        <View style={{alignItems:"flex-start",flex:1,justifyContent:"center"}}><Text
                            style={styles.leftText}>新功能介绍</Text></View>
                        <View style={{alignItems:"flex-end",flex:1,justifyContent:"center"}}><Image
                            style={styles.imageStyle} source={ImageResource["arrows@2x.png"]}></Image></View>
                    </TouchableOpacity>
                    <View style={styles.hrView}></View>
                    <TouchableOpacity style={styles.viewStyle}>
                        <View style={{alignItems:"flex-start",flex:1,justifyContent:"center"}}><Text
                            style={styles.leftText}>服务协议</Text></View>
                        <View style={{alignItems:"flex-end",flex:1,justifyContent:"center"}}><Image
                            style={styles.imageStyle} source={ImageResource["arrows@2x.png"]}></Image></View>
                    </TouchableOpacity>
                    <View style={styles.hrView}></View>
                    <TouchableOpacity style={styles.viewStyle}>
                        <View style={{alignItems:"flex-start",flex:1,justifyContent:"center"}}><Text
                            style={styles.leftText}>隐私政策</Text></View>
                        <View style={{alignItems:"flex-end",flex:1,justifyContent:"center"}}><Image
                            style={styles.imageStyle} source={ImageResource["arrows@2x.png"]}></Image></View>
                    </TouchableOpacity>
                    <View style={styles.hrView}></View>
                    <TouchableOpacity style={[styles.viewStyle,{borderBottomWidth:1,borderColor:"rgb(197,205,215)"}]}>
                        <View style={{alignItems:"flex-start",flex:1,justifyContent:"center"}}><Text
                            style={styles.leftText}>意见反馈</Text></View>
                        <View style={{alignItems:"flex-end",flex:1,justifyContent:"center"}}><Image
                            style={styles.imageStyle} source={ImageResource["arrows@2x.png"]}></Image></View>
                    </TouchableOpacity>
                </View>
                }
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
        marginRight: 10 * changeRatio
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

export default AboutUs;