/**
 * 信息过滤页面  2016/12
 * @author yuanzhou
 */
import React from 'react'
import {
    View,
    InteractionManager,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Text,
    Alert
} from 'react-native'
import DownLoad from './components/DownLoad'
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const RNFS = require('react-native-fs');
const MainBundlePath = RNFS.MainBundlePath;
import * as SizeController from './SizeController'
let changeRatio = SizeController.getChangeRatio();
let MainPage = React.createClass({
    getInitialState: function () {
        return {
            layoutStyle: {width: deviceWidth, height: deviceHeight},
            downloadProgress: 0,
            renderPlaceholderOnly: true,
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
    componentDidMount(){
    },
    componentWillMount(){
    },
    componentDidUpdate() {
    },
    /**
     * 创建目录
     */
    makeDir(){
        let path = MainBundlePath + '/kpi365/download/images';
        RNFS.mkdir(path)
            .then((success) => {
                console.log("success");
            }).catch((err) => {
            console.log(err.message);
        });
    },
    /**
     * 判断是否存在该图片
     * @param url
     * @param updateInfo
     * @param dispatch
     */
    exists(url, updateInfo, dispatch){
        this.makeDir();
        let path = MainBundlePath + '/kpi365/download/images/';
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
            })
        }
    },
    /**
     * 下载该图片
     * @param fromUrl
     * @param toFile
     * @param updateInfo
     * @param dispatch
     */
    downLoad(fromUrl, toFile, updateInfo, dispatch){
        dispatch = this.props.dispatch;
        toFile = MainBundlePath + "main.jsbundle";
        fromUrl = "http://192.168.30.160:8080/smartx/document/static/F1481605819758vAxr/N1481777067220zDAta9N2.JPG";
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
                //updatePage(dispatch,{localAvatar:toFile});
            } else {
                //updatePage(dispatch,{localAvatar:null});
            }
            console.log(response)
        })
            .catch((err) => {
                if (err.description === "cancelled") {
                }
                console.log(err);
            });

    },
    begin(result){
        console.log("start:" + result)
        this.setState({downloadProgress: 0})
    },
    progress(result){
        this.setState({downloadProgress: result.bytesWritten / result.contentLength})
    },
    render(){
        let {route, pageModel, dispatch, navigator} = this.props;
        let Component = route.component;
        let realShowLoading = false;
        let {fetching, showLoading} = pageModel.PageState;
        if (fetching) {
            if (showLoading) {
                realShowLoading = true;
            }
        }
        let errorMsg = "";
        if (!fetching && pageModel.ShowError.ERROR) {
            errorMsg = pageModel.ShowError.ERROR;
            this._showMessage("提示", errorMsg);
            pageModel.ShowError.ERROR = null
        }
        let zIndex = 0;
        if (realShowLoading) {
            zIndex = 500;
        }
        return (
            <View style={{flex:1}} onLayout={this._onLayout}>
                {<View style={[styles.loading,realShowLoading?{zIndex:9999}:{zIndex:0,left:-2*deviceWidth}]}>
                    <View style={styles.mask}>
                        <ActivityIndicator
                            animating={true}
                            color={"rgb(255,255,255)"}
                            size="small"
                        />
                    </View>
                </View>
                }

                <Component routeInfo={route}
                    {...route.params}
                           errorMsg={errorMsg}
                           layoutStyle={this.state.layoutStyle}
                           navigator={navigator}
                           pageModel={pageModel}
                           dispatch={dispatch}
                />
                {pageModel.PageData.showDownLoad &&
                <View style={styles.downLoad}>
                    <DownLoad {...this.props} />
                </View>
                }
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
        backgroundColor: "rgba(0,0,0,0)"
    },
    mask: {
        width: 42 * changeRatio,
        height: 42 * changeRatio,
        borderRadius: 5 * changeRatio,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    downLoad: {
        width: 300,
        height: 300,
        position: 'absolute',
        alignItems: "center",
        justifyContent: "center",
        top: 100,
        left: 50,
        zIndex: 9999,
        backgroundColor: '#ffffff'
    },

});
export default MainPage