/**
 * 个人中心
 * Created by yuanzhou on 17/01.
 */
import React from 'react'
import {View, Dimensions, Text, Image, StyleSheet, Platform, TouchableOpacity, ScrollView} from 'react-native'
import ImageResource from '../utils/ImageResource'
import CommonStyles from '../styles'
import IconTitle from './common/IconTitle'
import SetCenter from './SetCenter'
import SelfInfo from './SelfInfo'
import * as SizeController from '../SizeController'
import {handleUrl} from '../utils/UrlHandle'
let changeRatio = SizeController.getChangeRatio();
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const SelfCenter = React.createClass({
    toSetCenter(){
        let route = {
            name: "SetCenter",
            type: 'SetCenter',
            path: 'none',
            component: SetCenter,
            index: 2
        }
        this.props.navigator.push(route);
    },
    toSlefInfo(){
        let route = {
            name: "SelfInfo",
            type: 'SelfInfo',
            path: 'none',
            component: SelfInfo,
            index: 2
        }
        this.props.navigator.push(route);
    },
    render(){
        let PageData = this.props.pageModel.PageData
        let name = ""
        let exploitValue = 0
        let wealth = 0
        let popularity = 0
        let loginUserInfo = PageData.loginUserInfo
        let avatar = null;
        let sexSource = null;
        let signature = "";
        let exploitValueRanking = 0, wealthRanking = 0, popularityRanking = 0;
        if (PageData.exploitValueRanking !== undefined) {
            exploitValueRanking = PageData.exploitValueRanking;
        }
        if (PageData.wealthRanking !== undefined) {
            wealthRanking = PageData.wealthRanking;
        }
        if (PageData.popularityRanking !== undefined) {
            popularityRanking = PageData.popularityRanking;
        }
        if (loginUserInfo !== undefined && loginUserInfo !== null) {
            name = loginUserInfo.name
            exploitValue = loginUserInfo.exploitValue
            wealth = loginUserInfo.wealth
            popularity = loginUserInfo.popularity
            let url = handleUrl(loginUserInfo.avatar);
            if (url) {
                avatar = {uri: url}
            } else {
                if (loginUserInfo.sex == "男") {
                    avatar = ImageResource["header-boy@2x.png"];
                } else if (loginUserInfo.sex == "女") {
                    avatar = ImageResource["header-girl@2x.png"];
                }
            }
            if (loginUserInfo.sex == "男") {
                sexSource = ImageResource["icon-male@2x.png"];
            } else if (loginUserInfo.sex == "女") {
                sexSource = ImageResource["icon-female@2x.png"];
            }
            if (loginUserInfo.description) {
                signature = loginUserInfo.description;
            }
        }
        /*if (PageData.localAvatar !== undefined && PageData.localAvatar !== null && PageData.localAvatar !== "") {
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
        let width = this.props.layoutStyle.width;
        let iconTitleStyle = {width: width / 3, flex: 0};
        return (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={true}
                            contentContainerStyle={styles.contentContainer}>
                    <Image style={[this.props.layoutStyle,styles.topImage]} source={ImageResource['bg@2x.png']}>
                        <View style={[this.props.layoutStyle,{flex: 1}]}>
                            <View
                                style={{padding: 10 * changeRatio,paddingBottom: 0,paddingTop: 25 * changeRatio,flexDirection: "row"}}>

                                <View style={[CommonStyles.rightView,{borderWidth: 0,borderColor: "red"}]}>
                                    <TouchableOpacity onPress={this.toSetCenter}>
                                        <Image style={{width: 30 * changeRatio,height: 30 * changeRatio}}
                                               source={ImageResource['nav-set@2x.png']}></Image>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={CommonStyles.centerView}>
                                <TouchableOpacity onPress={this.toSlefInfo}>
                                    <View
                                        style={[styles.image,{backgroundColor: "#ffffff",marginTop: 5 * changeRatio}]}><Image
                                        style={[styles.image]} source={avatar}>
                                    </Image></View>
                                </TouchableOpacity>
                                <View style={[CommonStyles.rowView,{flex: 0,justifyContent: "center",marginTop: 10}]}>
                                    <Text style={styles.text}>{name}</Text>
                                    <View style={{justifyContent: "center"}}>
                                        <Image source={sexSource}
                                               style={{width: 16 * changeRatio,height: 16 * changeRatio,marginLeft: 5 * changeRatio}}></Image>
                                    </View>
                                </View>
                                <View
                                    style={{flex: 1,justifyContent: "center",marginLeft: 10 * changeRatio,marginRight: 10 * changeRatio}}>
                                    <Text
                                        style={[styles.text,{fontSize: 12 * changeRatio,textAlign: "center"}]}>{signature}</Text>
                                </View>
                            </View>
                        </View>
                    </Image>

                    <View style={[CommonStyles.rowView,{flex: 0,height: 50 * changeRatio,backgroundColor: "#ffffff"}]}>
                        <View
                            style={[CommonStyles.columnView,{flex: 0,width: width / 3 - 1,alignItems: "center",justifyContent: "center"}]}>
                            <Text style={[styles.textRate,{color: "rgb(29,169,252)"}]}>{exploitValue}</Text>
                            <Text style={styles.textTop}>功勋值</Text>
                        </View>
                        <View
                            style={{borderRightWidth: 1,marginTop: 18 * changeRatio,marginBottom: 18 * changeRatio,borderColor: "rgb(197,205,215)"}}></View>
                        <View
                            style={[CommonStyles.columnView,{flex: 0,width: width / 3 - 1,alignItems: "center",justifyContent: "center"}]}>
                            <Text style={[styles.textRate,,{color: "rgb(29,169,252)"}]}>{wealth}</Text>
                            <Text style={styles.textTop}>财富值</Text>
                        </View>
                        <View
                            style={{borderRightWidth: 1,marginTop: 18 * changeRatio,marginBottom: 18 * changeRatio,borderColor: "rgb(197,205,215)"}}></View>
                        <View
                            style={[CommonStyles.columnView,{flex: 0,width: width / 3,alignItems: "center",justifyContent: "center"}]}>
                            <Text style={[styles.textRate,{color: "rgb(29,169,252)"}]}>{popularity}</Text>
                            <Text style={styles.textTop}>人气值</Text>
                        </View>
                    </View>

                    <View style={[CommonStyles.rowView,{flex: 0,height: 50 * changeRatio,backgroundColor: "#ffffff"}]}>
                        <View
                            style={[CommonStyles.columnView,{flex: 0,width: width / 3 - 1,alignItems: "center",justifyContent: "center"}]}>
                            <Text style={[styles.textRate]}>{exploitValueRanking}</Text>
                            <Text style={styles.textTop}>排名</Text>
                        </View>
                        <View
                            style={{borderRightWidth: 1,marginTop: 18 * changeRatio,marginBottom: 18 * changeRatio,borderColor: "rgb(197,205,215)"}}></View>
                        <View
                            style={[CommonStyles.columnView,{flex: 0,width: width / 3 - 1,alignItems: "center",justifyContent: "center"}]}>
                            <Text style={[styles.textRate]}>{wealthRanking}</Text>
                            <Text style={styles.textTop}>排名</Text>
                        </View>
                        <View
                            style={{borderRightWidth: 1,marginTop: 18 * changeRatio,marginBottom: 18 * changeRatio,borderColor: "rgb(197,205,215)"}}></View>
                        <View
                            style={[CommonStyles.columnView,{flex: 0,width: width / 3,alignItems: "center",justifyContent: "center"}]}>
                            <Text style={[styles.textRate]}>{popularityRanking}</Text>
                            <Text style={styles.textTop}>排名</Text>
                        </View>
                    </View>

                    {false &&
                    <View
                        style={[CommonStyles.rowView,{flex: 0,height: 90 * changeRatio,backgroundColor: "#ffffff",marginTop: 10 * changeRatio,paddingTop: 10 * changeRatio,paddingBottom: 10 * changeRatio}]}>
                        <IconTitle fontStyle={styles.fontStyle} imageStyle={styles.imageStyle} style={iconTitleStyle}
                                   describe={'我的赞'} source={ImageResource['set-thumbs@2x.png']}
                                   onPress={this.weixinOnPress}>
                        </IconTitle>
                        <IconTitle fontStyle={styles.fontStyle} imageStyle={styles.imageStyle} style={iconTitleStyle}
                                   describe={'我的动态'} source={ImageResource['set-mycircle@2x.png']}
                                   onPress={this.ribaoOnPress}>
                        </IconTitle>
                        <IconTitle fontStyle={styles.fontStyle} imageStyle={styles.imageStyle} style={iconTitleStyle}
                                   describe={'我的关注'} source={ImageResource['set-like@2x.png']}
                                   onPress={this.mubiaoOmpress}>
                        </IconTitle>
                    </View>
                    }
                    {false &&
                    <View
                        style={[CommonStyles.rowView,{flex: 0,height: 90 * changeRatio,backgroundColor: "#ffffff",paddingTop: 10 * changeRatio,paddingBottom: 10 * changeRatio}]}>
                        <IconTitle fontStyle={styles.fontStyle} imageStyle={styles.imageStyle} style={iconTitleStyle}
                                   describe={'国家信息'} source={ImageResource['set-nation@2x.png']}
                                   onPress={this.weixinOnPress}>
                        </IconTitle>
                        <IconTitle fontStyle={styles.fontStyle} imageStyle={styles.imageStyle} style={iconTitleStyle}
                                   describe={'我的勋章'} source={ImageResource['set-badge@2x.png']}
                                   onPress={this.ribaoOnPress}>
                        </IconTitle>
                        <IconTitle fontStyle={styles.fontStyle} imageStyle={styles.imageStyle} style={iconTitleStyle}
                                   describe={'财富商城'} source={ImageResource['set-store@2x.png']}
                                   onPress={this.mubiaoOmpress}>
                        </IconTitle>
                    </View>
                    }
                    { false &&
                    <View
                        style={[{flexDirection: "row",alignItems: "flex-start",flex: 0,height: 90 * changeRatio,backgroundColor: "#ffffff",paddingTop: 10 * changeRatio,paddingBottom: 10 * changeRatio}]}>
                        <View style={styles.iconTitleView}>
                            <IconTitle fontStyle={styles.fontStyle} imageStyle={styles.imageStyle}
                                       style={styles.iconTitleStyle} describe={'新手帮助'}
                                       source={ImageResource['set-help@2x.png']} onPress={this.weixinOnPress}>
                            </IconTitle>
                        </View>
                        <IconTitle fontStyle={styles.fontStyle} imageStyle={styles.imageStyle}
                                   style={styles.iconTitleStyle} describe={'分享邀请'}
                                   source={ImageResource['set-share@2x.png']} onPress={this.weixinOnPress}>
                        </IconTitle>

                    </View>
                    }
                </ScrollView>
            </View>
        )
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(248,248,248)"
    },
    contentContainer: {
        paddingBottom: 70 * changeRatio
    },
    topImage: {
        //flex:0,
        height: 170 * changeRatio
        //backgroundColor:"blue"
    },
    image: {
        //marginTop:5,
        width: 50 * changeRatio,
        height: 50 * changeRatio,
        borderRadius: 25 * changeRatio
        // marginBottom:20,
    },
    text: {
        //fontWeight:'700',
        //fontSize:30
        //marginTop:10,
        fontSize: 16 * changeRatio,
        color: "#ffffff",
        // flex:1,
        backgroundColor: "rgba(0,0,0,0)"
    },
    textRate: {
        fontSize: 16 * changeRatio,
        color: "rgb(244,63,60)"
    },
    textTop: {
        marginTop: 5 * changeRatio,
        fontSize: 12 * changeRatio,
        color: "rgb(93,109,129)"
    },
    imageStyle: {
        width: 25 * changeRatio,
        height: 25 * changeRatio
    },
    iconTitleStyle: {
        flex: 0,
        width: deviceWidth / 3
    },
    iconTitleView: {
        flex: 0,
        alignItems: "flex-start",
        width: deviceWidth / 3
        // backgroundColor:"red"
    },
    fontStyle: {
        fontSize: 14 * changeRatio, color: "rgb(43,61,84)", marginTop: 15 * changeRatio
    }
});

export default SelfCenter;