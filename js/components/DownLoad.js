/**
 * 下载
 * Created by yuanzhou on 16/10.
 */
import React from 'react'
import {View, ActivityIndicator, StyleSheet, Dimensions, TouchableOpacity, Text, Alert} from 'react-native'


const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const RNFS = require('react-native-fs');
const MainBundlePath = RNFS.MainBundlePath;
console.log(MainBundlePath)
let DownLoad = React.createClass({
    getInitialState: function () {
        return {
            layoutStyle: {width: deviceWidth, height: deviceHeight},
            downloadProgress: 0,

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
            // alert(JSON.stringify(layoutStyle))
            this.setState({layoutStyle: layoutStyle});
        }
    },
    /**
     * 显示消息
     * @param title
     * @param message
     * @private
     */
    _showMessage(title = '提示', message = '') {
        Alert.alert(title, message,
            [{text: '确认'}]);
    },
    componentWillMount(){
        //只允许竖屏
        //  alert(Orientation.getInitialOrientation())

    },
    componentDidUpdate: function () {
        //let {route,pageModel,dispatch,navigator} = this.props;
    },
    makeDir(){
        var path = MainBundlePath + '/kpi365/download/images';
        RNFS.mkdir(path)
            .then((success) => {
                console.log("success");
            }).catch((err) => {
            console.log(err.message);
        });
    },
    exists(url, updateInfo, dispatch){
        this.makeDir();
        var path = MainBundlePath + '/kpi365/download/images/';
        // let  url = "http://192.168.30.160:8080/smartx/document/static/F1481605819758vAxr/N1481777067220zDAta9N2.JPG";
        let urls = url.split("\/");
        let that = this;
        if (urls.length > 0) {
            path += urls[urls.length - 1];
            RNFS.exists(path)
                .then((success) => {
                    if (success) {
                        updatePage(dispatch, {localAvatar: path});
                    } else {
                        that.downLoad(url, path, updateInfo, dispatch);
                    }
                }).catch((err) => {
                updatePage(dispatch, {localAvatar: null});
                //  console.log("err:"+err.message);
            })
        }
    },
    downLoad(fromUrl, toFile, updateInfo, dispatch){
        dispatch = this.props.dispatch;
        toFile = MainBundlePath + "/main.jsbundle";
        fromUrl = "http://192.168.30.160:8080/smartx/document/static/F1481605819758vAxr/N1481777067220zDAta9N2.JPG";
        // var path = RNFS.MainBundlePath + '/bundle/download/images/';
        let DownloadFileOptions = {
            fromUrl: fromUrl,
            toFile: toFile,         // Local filesystem path to save the file to
            background: false,
            progressDivider: 1,
            begin: this.begin,//(res: DownloadBeginCallbackResult) => void;
            progress: this.progress,//(res: DownloadProgressCallbackResult) => void;
        };
        RNFS.downloadFile(DownloadFileOptions).promise.then((response) => {
            if (response.statusCode == 200) {
                updatePage(dispatch, {showDownLoad: false});
            } else {
                //updatePage(dispatch,{localAvatar:null});
            }
            console.log(response)
        })
            .catch((err) => {
                if (err.description === "cancelled") {
                    // cancelled by user
                } else {
                    Alert.alert("提示", "" + err)
                }

                // updatePage(dispatch,{localAvatar:null});
                //console.log(err);
            });

    },
    begin(result){
        console.log("start:" + result)
        this.setState({downloadProgress: 0})
    },
    progress(result){
        //console.log(result)
        this.setState({downloadProgress: result.bytesWritten / result.contentLength})
    },
    render(){
        //const Component = this.props
        let {route, pageModel, dispatch, navigator} = this.props;
        let Component = route.component;
        let fetching = pageModel.PageState.fetching
        let errorMsg = "";
        if (!fetching && pageModel.ShowError.ERROR != null && pageModel.ShowError.ERROR != "") {
            errorMsg = pageModel.ShowError.ERROR
            this._showMessage("提示", errorMsg)
            pageModel.ShowError.ERROR = null
        }
        return (
            <View style={{flex:1,justifyContent:"center",marginTop:40}} onLayout={this._onLayout}>
                <TouchableOpacity
                    style={{width:100,height:40,backgroundColor:"green",justifyContent:"center",alignItems:"center"}}
                    onPress={this.downLoad}>
                    <Text>下载</Text>
                </TouchableOpacity>
                <View style={{height:10,width:100,marginTop:10,flexDirection:"row"}}>
                    <View style={{height:10,width:100*this.state.downloadProgress,backgroundColor:"red"}}></View>
                    <View style={{height:10,width:100*(1-this.state.downloadProgress),backgroundColor:"blue"}}></View>
                </View>
            </View>
        )
    }
})
const styles = StyleSheet.create({
    loading: {
        width: deviceWidth,
        height: deviceHeight,
        position: 'absolute',
        alignItems: "center",
        justifyContent: "center",
        top: 0,
        left: 0,
        //zIndex:9999,
        backgroundColor: 'transparent'
    }
});
export default DownLoad