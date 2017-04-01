/**
 * 个人信息页
 * Created by yuanzhou on 17/01.
 */
import React from 'react'
import {View, Text, Image, TouchableOpacity, Platform, DatePickerIOS, StyleSheet, ScrollView} from 'react-native'
import TopBar from './common/TopBar'
import ImageResource from '../utils/ImageResource'
import {logoutAction, doPost, doErrorOperation} from '../actions'
import RmcDatePicker from 'rmc-date-picker'
import moment from 'moment'
import UpdateAvatar from './UpdateAvatar'
import config from '../config'
import * as ActionTypes from '../actions/ActionTypes'
import http from '../utils/http'
import {createAction, handleAction, handleActions} from 'redux-actions'
import PersonalizedSignature from './PersonalizedSignature'
import  * as SizeController from '../SizeController'
import {handleUrl} from '../utils/UrlHandle'
let topHeight = SizeController.getTopHeight();
let tabBarHeight = SizeController.getTabBarHeight();
let changeRatio = SizeController.getChangeRatio();


const zhCn = {
    year: '年',
    month: '月',
    day: '日',
    hour: '时',
    minute: '分',
};
const SelfInfo = React.createClass({
    getInitialState(){
        return {
            date: moment(),
            showBirthdayChoose: false,
            birthday: "",
            avatarSource: {uri: "http://1111"}
        };
    },
    getDefaultProps(){
        return {};
    },
    toback(){
        this.props.navigator.pop();
    },
    toSign(){
        let route = {
            name: "PersonalizedSignature",
            type: 'PersonalizedSignature',
            path: 'none',
            component: PersonalizedSignature,
            index: 3,
        }
        this.props.navigator.push(route);
    },
    chooseAvatar(){
        let route = {
            name: "UpdateAvatar",
            type: 'UpdateAvatar',
            path: 'none',
            component: UpdateAvatar,
            index: 3,
        }
        this.props.navigator.push(route);
    },
    onDateChange: function (date) {
        this.setState({date: date});
    },
    chooseDateEnsure(){
        let {dispatch, pageModel} = this.props;
        let PageData = pageModel.PageData;
        let that = this;
        let loaderUrl = config.webapi.clientSelfCenter;
        let postData = {
            token: PageData.token,
            userUniqueid: PageData.userUniqueid,
            orgUniqueid: PageData.orgUniqueid,
            type: "updateBirthday",
            birthday: this.state.date.format("YYYY-MM-DD")
        };
        http.post(loaderUrl, postData)
            .then((response) => {
                if (response.code == 'OK') {
                    let dataTemp = response.datas.data
                    if (dataTemp.status == 'OK') {
                        dispatch(createAction(ActionTypes.UPDATE_PAGE, (model) => model)(Object.assign({}, dataTemp, {
                            route: null,
                            isRefreshing: false,
                            showBirthdayChoose: false
                        })));
                    } else {
                        doErrorOperation(dispatch, dataTemp.status, dataTemp.msg)
                    }
                } else {
                    if (response.code === undefined || response.code === null) {
                        doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                    } else {
                        doErrorOperation(dispatch, null, response.msg)
                    }
                }
            })
            .catch((err) => {
                const error = new TypeError(err);

                dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(error));
            });
    },
    updateBirthday(){
        this.setState({showBirthdayChoose: true, isChooseBirthday: false});
    },
    chooseDateCancel(){
        this.setState({isChooseBirthday: false, showBirthdayChoose: false});
    },
    render(){
        //let birthday = "未选择";
        let PageData = this.props.pageModel.PageData;
        let loginUserInfo = PageData.loginUserInfo;
        let signature = "未填写";
        let name = "", phoneNumber = "", email = "", sex = "", country = "", deptName = "", technicalTitle = "";
        if (loginUserInfo !== undefined && loginUserInfo !== null) {
            let url = handleUrl(loginUserInfo.avatar);
            if (url) {
                this.state.avatarSource = {uri: url};
            } else {
                if (loginUserInfo.sex == "男") {
                    this.state.avatarSource = ImageResource["header-boy@2x.png"];
                } else if (loginUserInfo.sex == "女") {
                    this.state.avatarSource = ImageResource["header-girl@2x.png"];
                }
            }
            if (loginUserInfo.birthday !== undefined && loginUserInfo.birthday !== null && loginUserInfo.birthday !== "") {
                //this.state.date = moment(loginUserInfo.birthday);
                this.state.birthday = loginUserInfo.birthday;
            }
            if (loginUserInfo.description !== undefined && loginUserInfo.description !== null && loginUserInfo.description !== "") {
                signature = loginUserInfo.description;
            }
            name = loginUserInfo.name;
            phoneNumber = loginUserInfo.phoneNumber;
            email = loginUserInfo.email;
            sex = loginUserInfo.sex;
            country = loginUserInfo.country;
            deptName = loginUserInfo.deptName;
            technicalTitle = loginUserInfo.technicalTitle;

        }
        /*if (PageData.localAvatar !== undefined && PageData.localAvatar !== null && PageData.localAvatar !== "") {
            if (Platform.OS === 'ios') {
                this.state.avatarSource = {uri: PageData.localAvatar, isStatic: true};
            } else {
                if (PageData.localAvatar.indexOf("file:") != -1) {
                    this.state.avatarSource = {uri: PageData.localAvatar, isStatic: true};
                } else {
                    this.state.avatarSource = {uri: "file://" + PageData.localAvatar, isStatic: true};
                }

            }

        }*/
        if (PageData.showBirthdayChoose !== undefined && PageData.showBirthdayChoose !== null) {
            this.state.showBirthdayChoose = PageData.showBirthdayChoose;
            PageData.showBirthdayChoose = null;
        }
        return (
            <View style={styles.container}>
                <TopBar toback={this.toback}
                        layoutStyle={this.props.layoutStyle}
                        topBarText={"帐号管理"}
                        topBarTextBottomShow={false}
                        topBarTextRight=""
                        showRight={false}
                        showLeft={true}
                />
                {this.state.showBirthdayChoose && <View
                    style={[{position:"absolute",top:topHeight,height:this.props.layoutStyle.height-topHeight,left:0,zIndex:999,flex:1,width:this.props.layoutStyle.width},this.state.showBirthdayChoose?{zIndex:999}:{zIndex:-200}]}>
                    <TouchableOpacity onPress={this.chooseDateCancel}
                                      style={{height:this.props.layoutStyle.height-250*changeRatio-topHeight,backgroundColor:"rgba(0,0,0,0.5)",width:this.props.layoutStyle.width}}></TouchableOpacity>
                    <View style={{backgroundColor:"#ffffff",height:250*changeRatio}}>
                        <View
                            style={{flexDirection:"row",height:44*changeRatio,borderBottomWidth:1,borderTopWidth:1,borderColor:"rgb(197,205,215)",paddingLeft:10*changeRatio}}>
                            <TouchableOpacity onPress={this.chooseDateCancel}
                                              style={{alignItems:"flex-start",width:44*changeRatio,flex:0,justifyContent:"center",height:44*changeRatio}}>
                                <Text style={{fontSize:14*changeRatio,color:"rgb(29,169,252)"}}>取消</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.chooseDateEnsure}
                                              style={{position:"absolute",right:10,alignItems:"flex-end",flex:0,width:44*changeRatio,justifyContent:"center",height:44*changeRatio}}>
                                <Text style={{fontSize:14*changeRatio,color:"rgb(29,169,252)"}}>确定</Text>
                            </TouchableOpacity>
                        </View>
                        <RmcDatePicker
                            styles={dateTimeStyles}
                            mode={"date"}
                            locale={zhCn}
                            minDate={moment([1971,1,1,0,0,0])}
                            maxDate={moment()}
                            date={this.state.date}
                            onDateChange={this.onDateChange}
                        />
                    </View>
                </View>
                }
                <ScrollView
                    style={{flex:1}}
                    scrollIndicatorInsets={{top:0,left:0,bottom:0,right:-2.5*changeRatio}}
                    contentContainerStyle={styles.contentContainer}
                >
                    <TouchableOpacity onPress={this.chooseAvatar}
                                      style={[styles.viewStyle,{height:70*changeRatio,marginTop:topHeight,borderTopWidth:1,borderColor:"rgb(197,205,215)"}]}>
                        <View
                            style={{alignItems:"flex-start",width:50*changeRatio,height:50*changeRatio,borderRadius:25*changeRatio,backgroundColor:"gray",flex:0,justifyContent:"center"}}>
                            <Image source={this.state.avatarSource}
                                   style={{width:50*changeRatio,height:50*changeRatio,borderRadius:25*changeRatio}}></Image>
                        </View>
                        <View style={{alignItems:"flex-end",flex:1}}>
                            <View style={{flexDirection:"row",flex:1}}>
                                <View style={{justifyContent:"center",marginRight:10*changeRatio}}><Text
                                    style={styles.leftText}>修改头像</Text></View>
                                <View style={{justifyContent:"center",}}><Image style={styles.imageStyle}
                                                                                source={ImageResource["arrows@2x.png"]}></Image></View>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.hrView}></View>
                    <TouchableOpacity onPress={this.toSign} style={[styles.viewStyle]}>
                        <View
                            style={{alignItems:"flex-start",width:80*changeRatio,flex:0,justifyContent:"center"}}><Text
                            style={styles.leftText}>个性签名</Text></View>
                        <View style={{alignItems:"flex-end",flex:1}}>
                            <View style={{flexDirection:"row",flex:1}}>
                                <View
                                    style={{justifyContent:"center",paddingRight:10*changeRatio,width:this.props.layoutStyle.width-80*changeRatio-40*changeRatio}}><Text
                                    numberOfLines={1} style={[styles.leftText,,{textAlign:"right"}]}>{signature}</Text></View>
                                <View style={{justifyContent:"center"}}>
                                    <Image style={styles.imageStyle} source={ImageResource["arrows@2x.png"]}></Image>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.hrView}></View>
                    <TouchableOpacity onPress={this.updateBirthday}
                                      style={[styles.viewStyle,{borderBottomWidth:1,borderColor:"rgb(197,205,215)"}]}>
                        <View
                            style={{alignItems:"flex-start",width:60*changeRatio,flex:0,justifyContent:"center"}}><Text
                            style={styles.leftText}>生日</Text></View>
                        <View style={{alignItems:"flex-end",flex:1}}>
                            <View style={{flexDirection:"row",flex:1}}>
                                <View style={{justifyContent:"center",marginRight:10*changeRatio}}><Text
                                    style={[styles.leftText]}>{this.state.birthday}</Text></View>
                                <View style={{justifyContent:"center"}}><Image style={styles.imageStyle}
                                                                               source={ImageResource["arrows@2x.png"]}></Image></View>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.viewStyle,{marginTop:10*changeRatio}]}>
                        <View style={{alignItems:"flex-start",justifyContent:"center",flex:0}}>
                            <Text style={styles.leftText}>{PageData.orgName}</Text>
                        </View>
                    </View>
                    <View style={[styles.viewStyle,{borderTopWidth:1,borderColor:"rgb(197,205,215)"}]}>
                        <View
                            style={{alignItems:"flex-start",width:60*changeRatio,flex:0,justifyContent:"center"}}><Text
                            style={styles.leftText}>姓名</Text></View>
                        <View style={{alignItems:"flex-end",flex:1,justifyContent:"center",marginRight:10*changeRatio}}>
                            <Text style={styles.rightText}>{name}</Text>
                        </View>
                    </View>
                    <View style={styles.hrView}></View>
                    <View style={styles.viewStyle}>
                        <View
                            style={{alignItems:"flex-start",width:60*changeRatio,flex:0,justifyContent:"center"}}><Text
                            style={styles.leftText}>手机</Text></View>
                        <View style={{alignItems:"flex-end",flex:1,justifyContent:"center",marginRight:10*changeRatio}}>
                            <Text style={styles.rightText}>{phoneNumber}</Text>
                        </View>
                    </View>
                    <View style={styles.hrView}></View>
                    <View style={styles.viewStyle}>
                        <View
                            style={{alignItems:"flex-start",justifyContent:"center",width:60*changeRatio,flex:0}}><Text
                            style={styles.leftText}>邮箱</Text></View>
                        <View style={{alignItems:"flex-end",flex:1,justifyContent:"center",marginRight:10*changeRatio}}>
                            <Text style={styles.rightText}>{email}</Text>
                        </View>
                    </View>
                    <View style={styles.hrView}></View>
                    <View style={styles.viewStyle}>
                        <View
                            style={{alignItems:"flex-start",width:60*changeRatio,flex:0,justifyContent:"center"}}><Text
                            style={styles.leftText}>性别</Text></View>
                        <View style={{alignItems:"flex-end",flex:1,justifyContent:"center",marginRight:10*changeRatio}}>
                            <Text style={styles.rightText}>{sex}</Text>
                        </View>
                    </View>
                    <View style={styles.hrView}></View>
                    <View style={styles.viewStyle}>
                        <View
                            style={{alignItems:"flex-start",width:60*changeRatio,flex:0,justifyContent:"center"}}><Text
                            style={styles.leftText}>入职日</Text></View>
                        <View style={{alignItems:"flex-end",flex:1,justifyContent:"center",marginRight:10*changeRatio}}>
                            <Text style={styles.rightText}></Text>
                        </View>
                    </View>
                    <View style={styles.hrView}></View>
                    <View style={styles.viewStyle}>
                        <View
                            style={{alignItems:"flex-start",width:60*changeRatio,flex:0,justifyContent:"center"}}><Text
                            style={styles.leftText}>国家</Text></View>
                        <View style={{alignItems:"flex-end",flex:1,justifyContent:"center",marginRight:10*changeRatio}}>
                            <Text style={styles.rightText}>{country}</Text>
                        </View>
                    </View>
                    <View style={styles.hrView}></View>
                    <View style={styles.viewStyle}>
                        <View
                            style={{alignItems:"flex-start",width:60*changeRatio,flex:0,justifyContent:"center"}}><Text
                            style={styles.leftText}>部门</Text></View>
                        <View style={{alignItems:"flex-end",flex:1,justifyContent:"center",marginRight:10*changeRatio}}>
                            <Text style={styles.rightText}>{deptName}</Text>
                        </View>
                    </View>
                    <View style={styles.hrView}></View>
                    <View style={[styles.viewStyle,{borderBottomWidth:1,borderColor:"rgb(197,205,215)"}]}>
                        <View
                            style={{alignItems:"flex-start",width:60*changeRatio,flex:0,justifyContent:"center"}}><Text
                            style={styles.leftText}>职位</Text></View>
                        <View style={{alignItems:"flex-end",flex:1,justifyContent:"center",marginRight:10*changeRatio}}>
                            <Text style={styles.rightText}>{technicalTitle}</Text>
                        </View>
                    </View>

                </ScrollView>
            </View>
        )
    }
});
var textStyle = {
    color: 'red',
    fontSize: 10,
    textAlign: 'center'
};
const dateTimeStyles = StyleSheet.create({
    modal: {
        flexDirection: 'column',
        justifyContent: 'flex-end'
    },
    header: {
        // flex:1, 0.39.0 needs to remove
        height: 44,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e7e7e7'
    },
    headerItem: {
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    actionText: textStyle,
    title: textStyle,
    smallPickerItem: {
        fontSize: 10,
        color: "yellow"
    },
    itemText: {
        fontSize: 10,
        color: "yellow"
    },

});
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(248,248,248)"
    },
    contentContainer: {
        paddingBottom: 50 * changeRatio,
        //padding:10,
        // marginTop:45,

    },
    leftText: {
        color: "rgb(43,61,84)",
        fontSize: 16 * changeRatio
    },
    rightText: {
        color: "rgb(197,205,215)",
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
        backgroundColor: "rgb(197,205,215)",
        flex: 1,
        height: 1,
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

export default SelfInfo;