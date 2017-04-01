/**
 * 更新头像
 * Created by yuanzhou on 17/01.
 */
import React from 'react'
import {View, Text, Image, Alert, TouchableOpacity, Platform, DatePickerIOS, StyleSheet, ScrollView} from 'react-native'
import ImagePicker from 'react-native-image-picker'
import {createAction} from 'redux-actions'
import TopBar from './common/TopBar'
import config from '../config'
import * as ActionTypes from '../actions/ActionTypes'
import http from '../utils/http'
import  * as SizeController from '../SizeController'
import {handleUrl} from '../utils/UrlHandle'

const FileUpload = require('NativeModules').FileUpload;
const RNFS = require('react-native-fs');
const MainBundlePath = RNFS.DocumentDirectoryPath;
let topHeight = SizeController.getTopHeight();
let tabBarHeight = SizeController.getTabBarHeight();
let changeRatio = SizeController.getChangeRatio();

let options = {
    title: '选择头像',
    // customButtons: [
    //   {name: 'fb', title: 'Choose Photo from Facebook'},
    // ],
    cancelButtonTitle: "取消",
    takePhotoButtonTitle: "拍摄照片",
    chooseFromLibraryButtonTitle: "从相册选择",
    allowsEditing: true,
    //storageOptions: {
    //skipBackup: true,
    //path: 'images'
    //}
};

const UpdateAvatar = React.createClass({
    getInitialState(){
        return {
            avatarSource: {uri: "http://111"},
            fileName: null,
            filePath: null
        }
    },
    chooseAvatar(){ //选择相片
        //let {dispatch} = this.props;
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                // You can display the image using either data...
                //const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

                // or a reference to the platform specific asset location
                if (Platform.OS === 'ios') {
                    const source = {uri: response.uri.replace('file://', ''), isStatic: true};
                    //  this.existsAndCopy(response.uri.replace('file://', ''),response.fileName);
                    //this.toFileUpload(response.fileName,response.uri);
                    this.setState({fileName: response.fileName, filePath: response.uri.replace('file://', '')})

                } else {
                    const source = {uri: response.uri, isStatic: true};
                    // alert(response.path)
                    this.setState({fileName: response.fileName, filePath: response.path})
                    // this.toFileUpload(response.fileName,response.path);
                }
            }
        });
    },
    existsAndCopy(filePath, filename){ //判断是否存在以及复制文件
        this.makeDir();
        let destPath = MainBundlePath + '/kpi365/download/images/';
        destPath += filename;
        //let  url = "http://192.168.30.160:8080/smartx/document/static/F1481605819758vAxr/N1481777067220zDAta9N2.JPG";
        // let  urls = url.split("\/");
        let that = this;
        RNFS.exists(destPath)
            .then((success) => {
                if (success) {

                } else {
                    RNFS.copyFile(filePath, destPath).then((success) => {
                    }).catch((err) => {
                    })
                }
            }).catch((err) => {
            console.log("err:" + err.message);
        })
    },
    makeDir(){  //创建文件夹
        var path = MainBundlePath + '/kpi365/download/images';
        RNFS.mkdir(path)
            .then((success) => {
                console.log("success");
            }).catch((err) => {
            console.log(err.message);
        });
    },
    exists(url, updateInfo, dispatch){ //判断文件是否存在
        this.makeDir();
        var path = MainBundlePath + '/kpi365/download/images/';
        let urls = url.split("\/");
        let that = this;
        if (urls.length > 0) {
            path += urls[urls.length - 1];
            RNFS.exists(path)
                .then((success) => {
                    if (success) {
                        dispatch(createAction(ActionTypes.UPDATE_PAGE, (model) => model)
                        (Object.assign({}, updateInfo, {
                            route: null,
                            isRefreshing: false,
                            localAvatar: path,
                            toBack: true
                        })));
                    } else {
                        that.downLoad(url, path, updateInfo, dispatch);
                    }
                }).catch((err) => {
                dispatch(createAction(ActionTypes.UPDATE_PAGE, (model) => model)
                (Object.assign({}, updateInfo, {route: null, isRefreshing: false, localAvatar: null})));
                console.log("err:" + err.message);
            })
        }
    },
    downLoad(fromUrl, toFile, updateInfo, dispatch){   //下载文件
        // var path = RNFS.MainBundlePath + '/bundle/download/images/';
        let DownloadFileOptions = {
            fromUrl: fromUrl,
            toFile: toFile,         // Local filesystem path to save the file to
        };
        RNFS.downloadFile(DownloadFileOptions).promise.then((response) => {
            if (response.statusCode == 200) {
                dispatch(createAction(ActionTypes.UPDATE_PAGE, (model) => model)
                (Object.assign({}, updateInfo, {route: null, isRefreshing: false, localAvatar: toFile, toBack: true})));
            } else {
                dispatch(createAction(ActionTypes.UPDATE_PAGE, (model) => model)
                (Object.assign({}, updateInfo, {route: null, isRefreshing: false, localAvatar: null})));
            }
        })
            .catch((err) => {
                if (err.description === "cancelled") {
                    // cancelled by user
                }
                dispatch(createAction(ActionTypes.UPDATE_PAGE, (model) => model)
                (Object.assign({}, updateInfo, {route: null, isRefreshing: false, localAvatar: null})));
            });

    },
    toFileUpload(){  //上传文件
        let {fileName, filePath} = this.state;
        if (filePath !== null && filePath !== "") {
            let {dispatch} = this.props;
            dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)());
            //dispatch(createAction(ActionTypes.SHOW_LOADING, (model)=> model)());
            if (fileName == undefined || fileName == null || fileName == "") {
                let urls = filePath.split("\/");
                if (urls.length > 0) {
                    fileName = urls[urls.length - 1];
                }
            }
            let obj = {
                uploadUrl: config.upload,
                method: 'POST', // default 'POST',support 'POST' and 'PUT'
                headers: {
                    'Accept': 'application/json',
                },
                fields: {
                    // 'hello': 'world',
                },
                files: [
                    {
                        name: 'one', // optional, if none then `filename` is used instead
                        filename: fileName, // require, file name
                        filepath: filePath, // require, file absoluete path
                        filetype: "image/jpeg", // options, if none, will get mimetype from `filepath` extension
                    },
                ]
            };
            let that = this;
            FileUpload.upload(obj, function (err, result) {
                if (err === null) {
                    if (result !== null && result.status == 200) {
                        let data = JSON.parse(result.data);
                        //data: '{"code":"OK","msg":"T1481606907880rLzvK1QS","msgtype":"alert","refUrl":"http://192.168.30.160:8080/smartx/document/static/F1481605819758vAxr/N1481606907880hr0ZSqYB.JPG"}' }
                        if (data !== null && data.code === "OK") {
                            that.doPost(data.msg, data.refUrl, filePath);
                        } else {
                            dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(data.msg));
                        }
                    } else {
                        dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(JSON.stringify(result)));
                    }
                } else {
                    dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(JSON.stringify(err)));
                }


                console.log('upload:', err, result);
            })
        } else {
            Alert.alert("提示", "请先选择图片");
        }
    },
    doPost(imgToken, refUrl, filepath){  //上传imgtoken数据
        let {dispatch, pageModel} = this.props;
        let PageData = pageModel.PageData;
        let loginUserInfo = PageData.loginUserInfo
        let loaderUrl = config.webapi.clientSelfCenter;
        let postData = {
            token: PageData.token,
            userUniqueid: PageData.userUniqueid,
            orgUniqueid: PageData.orgUniqueid,
            imgToken: imgToken,
            type: "uploadAvatar"
        };
        let that = this;
        let avatar = null;
        let url = handleUrl(refUrl);
        if (!url) {
            if (Platform.OS === 'ios') {
                avatar = filepath.replace('file://', '');//{uri: filepath.replace('file://', ''), isStatic: true};
            } else {
                avatar = filepath;//{uri: filepath, isStatic: true};
            }
        } else {
            avatar = url;//{uri:refUrl};
        }
        http.post(loaderUrl, postData)
            .then((response) => {
                if (response.code == 'OK') {
                    let dataTemp = response.datas.data
                    if (dataTemp.status == 'OK') {
                        dispatch(createAction(ActionTypes.UPDATE_PAGE, (model) => model)
                        (Object.assign({}, dataTemp, {route: null, isRefreshing: false, localAvatar: null, toBack: true})));
                        //that.exists(refUrl, dataTemp, dispatch);
                    } else {
                        dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(response.msg));
                    }
                } else {
                    dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(response.msg));
                }
            })
            .catch((err) => {
                const error = new TypeError(err);

                dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(error));
            });
    },
    toback(){ //返回
        this.props.navigator.pop();
    },
    render(){
        let PageData = this.props.pageModel.PageData;
        let loginUserInfo = PageData.loginUserInfo;
        if (loginUserInfo) {
            let url = handleUrl(loginUserInfo.avatarDetail);
            if (url) {
                this.state.avatarSource = {uri: url};
            }
        }
        /*if (PageData.localAvatar) {
            if (Platform.OS === 'ios') {
                this.state.avatarSource = {uri: PageData.localAvatar, isStatic: true};
            } else {
                if (PageData.localAvatar.indexOf("file:") !== -1) {
                    this.state.avatarSource = {uri: PageData.localAvatar, isStatic: true};
                } else {
                    this.state.avatarSource = {uri: "file://" + PageData.localAvatar, isStatic: true};
                }

            }

        }*/
        let filepath = this.state.filePath;
        if (filepath) {
            if (Platform.OS === 'ios') {
                this.state.avatarSource = {uri: filepath};
            } else {
                if (filepath.indexOf("file:") !== -1) {
                    this.state.avatarSource = {uri: filepath};
                } else {
                    this.state.avatarSource = {uri: "file://" + filepath};
                }

            }

        }
        return (<View style={styles.container}>
                <TopBar toback={this.toback}
                        layoutStyle={this.props.layoutStyle}
                        topBarText={"更改头像"}
                        topBarTextBottomShow={false}
                        topBarTextRight=""
                        showRight={false}
                        showLeft={true}
                />
                <View style={{alignItems:"center",justifyContent:"center",flex:0,marginTop:topHeight+30*changeRatio}}>
                    <View style={{width:250*changeRatio,height:250*changeRatio,backgroundColor:"grey"}}>
                        <Image
                            source={this.state.avatarSource}
                            style={{width:250*changeRatio,height:250*changeRatio}}
                        >
                        </Image>
                    </View>
                </View>
                <View style={{alignItems:"center",marginTop:40*changeRatio}}>
                    <TouchableOpacity onPress={this.chooseAvatar} style={styles.btnView}>
                        <Text style={{color:"rgb(244,63,60)",fontSize:16*changeRatio}}>选择图片</Text>
                    </TouchableOpacity>
                </View>
                <View style={{alignItems:"center"}}>
                    <TouchableOpacity onPress={this.toFileUpload} style={styles.btnView}>
                        <Text style={{color:"rgb(244,63,60)",fontSize:16*changeRatio}}>确认</Text>
                    </TouchableOpacity>
                </View>
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
        paddingBottom: 50 * changeRatio,
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
        width: 200 * changeRatio,
        marginTop: 15 * changeRatio,
        borderWidth: 1,
        borderRadius: 25 * changeRatio,
        //borderTopWidth:1,
        borderColor: "rgb(197,205,215)"
    }
});

export default UpdateAvatar;