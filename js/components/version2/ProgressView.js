/**
 * 进度统一入口
 * Created by yuanzhou on 17/02.
 */
import React, {Component} from 'react';
import {
    Platform,
    RefreshControl,
    ActivityIndicator,
    AppRegistry,
    Keyboard,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    ListView,
    Text,
    View,
    Alert
} from 'react-native';
import TargetProgress from './TargetProgress'
import moment from 'moment'
import  * as SizeController from '../../SizeController'
let topHeight = SizeController.getTopHeight();
let tabBarHeight = SizeController.getTabBarHeight();
let changeRatio = SizeController.getChangeRatio();
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class ProgressView extends Component {

    constructor(props) {
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (row1, row2) => true});
        this.state = {
            dataSource: ds.cloneWithRows([]),
            scrollEnabled: true,
            showShouhui: false,
            shouhuiBottom: 0,
            paddingBottom: 80 * changeRatio,
            isEnding: false,
            isRefreshing: true,
        };


        this._updateDataSource = this._updateDataSource.bind(this);
        this._updateDataSourceInit = this._updateDataSourceInit.bind(this);
        this._allowScroll = this._allowScroll.bind(this);
        this._getSelfPassTargets = this._getSelfPassTargets.bind(this);
        this._getSelfDelayTargets = this._getSelfDelayTargets.bind(this);
        this._getChargeCheckPassTargets = this._getChargeCheckPassTargets.bind(this);
        this._getChargeCheckDelayTargets = this._getChargeCheckDelayTargets.bind(this);
        //键盘相关 start
        this.subscriptions = [];
        this.updateKeyboardSpace = this.updateKeyboardSpace.bind(this);
        this.resetKeyboardSpace = this.resetKeyboardSpace.bind(this);
        this._textInputOnFocus = this._textInputOnFocus.bind(this);
        this.keyboardEnsure = this.keyboardEnsure.bind(this);
        this.keyboardCancel = this.keyboardCancel.bind(this);
        this.showProgressError = this.showProgressError.bind(this);
        this._scrollView = null;
        this.textInputIndex = -1;
        this.needScrollAndShow = true;
        //键盘相关 end
        this.progressRefs = [];
    }

    componentWillMount() {

        // Keyboard events监听
        if (Platform.OS === 'ios') {
            this.subscriptions = [
                Keyboard.addListener('keyboardWillShow', this.updateKeyboardSpace),
                Keyboard.addListener('keyboardWillHide', this.resetKeyboardSpace)]
        } else {
            this.subscriptions = [
                Keyboard.addListener('keyboardDidShow', this.updateKeyboardSpace),
                Keyboard.addListener('keyboardDidHide', this.resetKeyboardSpace)]
        }
    }

    componentWillUnmount() {
        //移除监听
        this.subscriptions.forEach((sub) => sub.remove())
    }

    componentDidMount() {

        if (this.props.data !== undefined && this.props.data !== null) {
            this._updateDataSourceInit(this.props.data, true);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    componentWillReceiveProps(nextProps) {

        let isRefreshing = true;
        let preFetching = this.props.pageModel.PageState.fetching;
        let nextFetching = nextProps.pageModel.PageState.fetching;
        if (nextFetching === false) {
            if (nextProps.data !== undefined && nextProps.data !== null) {
                isRefreshing = false;
                if (this.props.showFooter !== nextProps.showFooter && nextProps.showFooter) {
                    isRefreshing = true;
                }
                this._updateDataSourceInit(nextProps.data, false);
            }
        } else {
            if (preFetching !== nextFetching) {
                if (this.props.data !== nextProps.data && nextProps.data) {
                    this._updateDataSourceInit(nextProps.data, true);
                } else {
                    this.setState({isRefreshing: false});
                }
            }
        }
    }

    /** 键盘出现 --> 进行操作 **/
    updateKeyboardSpace(frames) {
        console.log("updateKeyboardSpace");
        const keyboardSpace = frames.endCoordinates.height;//获取键盘高度
        let heightTemp = deviceHeight - 170 * changeRatio;
        if (Platform.OS === 'ios') {
            this.setState({showShouhui: true, shouhuiBottom: keyboardSpace, paddingBottom: 80 + keyboardSpace});
            let y = (this.textInputIndex) * (140 + 10) * changeRatio;
            let scrollY = y;
            if (this._scrollView) {
                this._scrollView.scrollTo({y: scrollY, animated: false})
            }
        } else {
            this.setState({showShouhui: true, shouhuiBottom: keyboardSpace + 20, paddingBottom: 80 + keyboardSpace});
            heightTemp -= 20;
            let y = (this.textInputIndex) * (140 + 10) * changeRatio;
            let scrollY = y;
            if (this._scrollView) {
                this._scrollView.scrollTo({y: scrollY, animated: false})
            }
        }
        //let y = (this.textInputIndex) * (140 + 10) * changeRatio;
        // if(Platform.OS === 'ios'){
        // y += keyboardSpace;
        //}
        // y+=10*changeRatio;
        //y+=40*changeRatio;
        /* if (heightTemp < y) {
         let temp1 = y % heightTemp;
         let size = Math.floor(y / heightTemp);
         let scrollY = temp1 + (size - 1) * heightTemp;
         scrollY = y;
         if (this._scrollView) {
         this._scrollView.scrollTo({y: scrollY, animated: false})
         }
         }*/

    }

    /** 键盘隐藏 --> 进行操作 **/
    resetKeyboardSpace() {
        console.log("resetKeyboardSpace");
        this.setState({showShouhui: false, shouhuiBottom: 0, paddingBottom: 80});
        //if(this.needScrollAndShow){
        /*let heightTemp = deviceHeight - 170 * changeRatio;//this.props.layoutStyle.height;
         let y = (this.textInputIndex) * (140 + 10) * changeRatio + 150 * changeRatio;
         y += 10 * changeRatio;
         if (heightTemp < y) {
         let temp1 = y % heightTemp;
         let size = Math.floor(y / heightTemp);
         let scrollY = temp1 + (size - 1) * heightTemp + 40 * changeRatio;
         if (this._scrollView) {
         this._scrollView.scrollTo({y: scrollY, animated: false})
         }
         } else {
         if (this._scrollView) {
         this._scrollView.scrollTo({y: 0, animated: false})
         }
         }*/
        //}
    }

    /**
     *  设更新触发键盘的控件位置
     *
     */
    _textInputOnFocus(index) {
        this.textInputIndex = index
    }

    /** 确认确认操作 **/
    keyboardEnsure() {
        let key = this.textInputIndex;
        if (this.progressRefs.length > key) {
            this.progressRefs[key].progressEnsure();
        } else {
            Alert.alert("提示", "出错了，请重新尝试!")
        }

    }

    /** 键盘取消操作 **/
    keyboardCancel() {
        let key = this.textInputIndex;
        //alert(key)
        if (this.progressRefs.length > key) {
            this.progressRefs[key].progressCancel();
        } else {
            Alert.alert("提示", "出错了，请重新尝试!")
        }
    }

    /** 显示进度错误信息 **/
    showProgressError(message) {
        this.needScrollAndShow = false;
        Alert.alert("提示", message, [{text: '确认', onPress: () => this.progressCancelAndReset()}]);
    }

    /** 设置显示确定和取消按钮 **/
    progressCancelAndReset() {
        this.needScrollAndShow = true;
        // this.setState({needScrollAndShow:true});
    }


    /** 设置是否允许滚动 **/
    _allowScroll(scrollEnabled) {
        this.setState({scrollEnabled: scrollEnabled});
    }

    /** 更新ListView列，右滑与隐藏 **/
    _handleOpen(sectionID, rowID) {
        let rows = this.props.data;
        for (var i = 0; i < rows.length; i++) {
            if (i != rowID) rows[i].active = false;
            else rows[i].active = true;
        }
        this._updateDataSource(rows);
    }

    /** 更新数据源 **/
    _updateDataSourceInit(data, isRefreshing) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(data),
            isRefreshing: isRefreshing
        });
    }

    /** 更新数据源 **/
    _updateDataSource(data) {

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(data),
        });
    }

    /** 获取个人目标通过行 **/
    _getSelfPassTargets(rowData, sectionID, rowID) {
        this.progressRefs.push("");
        let obj = rowData;
        let count = "";
        let progress = obj.progress;
        let key = Number(rowID);
        if (key < 9) {
            count += "0" + (key + 1) + ". ";
        } else {
            count += (key + 1) + ". ";
        }
        let rightText = moment(obj.createTime).format("YYYY年MM月");
        let slideComponent = null;
        let slideComponentWidth = 80 * changeRatio;
        let showRightImage = false;
        if (this.props.isMostLevel) {
            slideComponentWidth = 120 * changeRatio;
            slideComponent = slideComponent = (
                <View style={{flex:0,width:120*changeRatio,height:140*changeRatio,flexDirection:"row"}}>
                    <TouchableOpacity onPressIn={()=>this.props.delayTargetPress(obj.kpiMTargetUniqueid)}
                                      style={{flex:0,width:60*changeRatio,height:140*changeRatio,backgroundColor:"rgb(171,181,196)",justifyContent:"center",alignItems:"center"}}>
                        <Text style={{textAlign:"center",fontSize:18*changeRatio,color:"rgb(255,255,255)"}}>延期</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPressIn={()=>this.props.deleteTargetPress(obj.kpiMTargetUniqueid)}
                                      style={{flex:0,width:60*changeRatio,height:140*changeRatio,backgroundColor:"rgb(244,63,60)",justifyContent:"center",alignItems:"center"}}>
                        <Text style={{textAlign:"center",fontSize:18*changeRatio,color:"rgb(255,255,255)"}}>删除</Text>
                    </TouchableOpacity>
                </View>)
        } else {
            slideComponent = (<TouchableOpacity onPressIn={()=>this.props.delayTargetPress(obj.kpiMTargetUniqueid)}
                                                style={{flex:0,width:80*changeRatio,height:140*changeRatio,backgroundColor:"rgb(244,63,60)",justifyContent:"center",alignItems:"center"}}>
                <Text style={{textAlign:"center",fontSize:20*changeRatio,color:"rgb(255,255,255)"}}>延期</Text>
            </TouchableOpacity>)
        }

        return (<TargetProgress
            keyIndex={rowID}
            key={obj.kpiMTargetUniqueid}
            sid={obj.kpiMTargetUniqueid}
            title={count+obj.content}
            sliderValue={progress}
            showRight={false}
            showRightImage={showRightImage}
            ref={(e)=>this.progressRefs[rowID]=e}
            rowID={rowID}
            sectionID={sectionID}
            close={!rowData.active}
            scroll={this._allowScroll}

            onOpen={(sectionID, rowID) => this._handleOpen(sectionID, rowID) }
            focusIndex={this._textInputOnFocus}
            showProgressError={this.props.showProgressError}
            sliderValueChange={this.props.sliderValueChange}
            style={{height:140*changeRatio}}
            height={140*changeRatio}
            disabled={false}
            useInput={true}
            width={deviceWidth}
            maximumTrackTintColor={"rgb(237,240,243)"}
            minimumTrackTintColor={"rgb(26,219,221)"}
            slideComponent={slideComponent}
            slideComponentWidth={slideComponentWidth}

        />)
    }

    /** 获取个人目标延期通过行 **/
    _getSelfDelayTargets(rowData, sectionID, rowID) {
        this.progressRefs.push("");
        let obj = rowData;
        let count = "";
        let progress = obj.progress;
        let key = Number(rowID);
        if (key < 9) {
            count += "0" + (key + 1) + ". "
        } else {
            count += (key + 1) + ". ";
        }
        let rightText = moment(obj.createTime).format("YYYY年MM月");
        let slideComponent = null;
        let rightTextColor = "#abb5c4";
        let slideComponentWidth = 80 * changeRatio;
        if (obj.attrA === "申请关闭") {
            slideComponent = <TouchableOpacity
                onPressIn={()=>this.props.delayTargetCloseCancelPress(obj.kpiMTargetUniqueid,obj.kpiMTDelayUniqueid)}
                style={{flex:0,width:0,height:110*changeRatio,backgroundColor:"rgb(244,63,60)",justifyContent:"center",alignItems:"center"}}>
                <Text style={{textAlign:"center",fontSize:20*changeRatio,color:"rgb(255,255,255)"}}>结束</Text>
                <Text style={{textAlign:"center",fontSize:20*changeRatio,color:"rgb(255,255,255)"}}>关闭</Text>

            </TouchableOpacity>

            //slideComponent = null;
            rightText = "申请关闭中";
            rightTextColor = "green";
            slideComponentWidth = 0;
        } else {
            if (this.props.isMostLevel) {
                slideComponent = <TouchableOpacity
                    onPressIn={()=>this.props.delayTargetCloseCancelPress(obj.kpiMTargetUniqueid,obj.kpiMTDelayUniqueid)}
                    style={{flex:0,width:80*changeRatio,height:110*changeRatio,backgroundColor:"rgb(244,63,60)",justifyContent:"center",alignItems:"center"}}>
                    <Text style={{textAlign:"center",fontSize:20*changeRatio,color:"rgb(255,255,255)"}}>结束</Text>
                    <Text style={{textAlign:"center",fontSize:20*changeRatio,color:"rgb(255,255,255)"}}>关闭</Text>

                </TouchableOpacity>
            } else {
                slideComponent = <TouchableOpacity
                    onPressIn={()=>this.props.delayTargetCloseRequestPress(obj.kpiMTargetUniqueid,obj.kpiMTDelayUniqueid,key)}
                    style={{flex:0,width:80*changeRatio,height:110*changeRatio,backgroundColor:"rgb(244,63,60)",justifyContent:"center",alignItems:"center"}}>
                    <Text style={{textAlign:"center",fontSize:20*changeRatio,color:"rgb(255,255,255)"}}>申请</Text>
                    <Text style={{textAlign:"center",fontSize:20*changeRatio,color:"rgb(255,255,255)"}}>关闭</Text>

                </TouchableOpacity>
            }
        }

        return (<TargetProgress keyIndex={rowID}
                                key={obj.kpiMTargetUniqueid}
                                sid={obj.kpiMTargetUniqueid}
                                title={count+obj.content}
                                sliderValueChange={this.props.sliderValueChange}
                                sliderValue={progress}
                                showRight={true}
                                showRightText={true}
                                rightText={rightText}
                                style={{height:110*changeRatio}}
                                rightTextColor={rightTextColor}
                                height={110*changeRatio}
                                isYiliu={true}
                                disabled={true}
                                ref={(e)=>this.progressRefs[rowID]=e}
                                rowID={rowID}
                                sectionID={sectionID}
                                close={!rowData.active}
                                scroll={this._allowScroll}
                                onOpen={(sectionID, rowID) => this._handleOpen(sectionID, rowID) }

                                maximumTrackTintColor={"rgb(237,240,243)"}
                                minimumTrackTintColor={"rgb(245,101,39)"}
                                width={deviceWidth}
                                slideComponent={slideComponent}
                                slideComponentWidth={slideComponentWidth}

        />)
    }

    /** 获取主管目标通过行 **/
    _getChargeCheckPassTargets(rowData, sectionID, rowID) {
        this.progressRefs.push("");
        let obj = rowData;
        let count = "";
        let progress = obj.progress;
        let key = Number(rowID);
        if (key < 9) {
            count += "0" + (key + 1) + ". "
        } else {
            count += (key + 1) + ". "
        }

        let rightText = moment(obj.createTime).format("YYYY年MM月");
        let rightColor = "rgb(93,109,129)";
        let slideComponent = null;
        let slideComponentWidth = 120 * changeRatio;
        let showRightImage = false;
        /* <TouchableOpacity onPressIn={()=>this.props.toEditTarget(key)} style={{flex:0,width:60*changeRatio,height:110*changeRatio,backgroundColor:"rgb(243,175,43)",justifyContent:"center",alignItems:"center"}}>
         <Text style={{textAlign:"center",fontSize:18*changeRatio,color:"rgb(255,255,255)"}}>修改</Text>
         </TouchableOpacity>*/
        slideComponent = slideComponent = (
            <View style={{flex:0,width:120*changeRatio,height:110*changeRatio,flexDirection:"row"}}>
                <TouchableOpacity onPressIn={()=>this.props.delayTargetPress(obj.kpiMTargetUniqueid,key)}
                                  style={{flex:0,width:60*changeRatio,height:110*changeRatio,backgroundColor:"rgb(171,181,196)",justifyContent:"center",alignItems:"center"}}>
                    <Text style={{textAlign:"center",fontSize:18*changeRatio,color:"rgb(255,255,255)"}}>延期</Text>
                </TouchableOpacity>

                <TouchableOpacity onPressIn={()=>this.props.deleteTargetPress(obj.kpiMTargetUniqueid,key)}
                                  style={{flex:0,width:60*changeRatio,height:110*changeRatio,backgroundColor:"rgb(244,63,60)",justifyContent:"center",alignItems:"center"}}>
                    <Text style={{textAlign:"center",fontSize:18*changeRatio,color:"rgb(255,255,255)"}}>删除</Text>
                </TouchableOpacity>
            </View>)
        if (this.props.canEvaluate) {
            return (<TargetProgress keyIndex={key}
                                    key={obj.kpiMTargetUniqueid}
                                    sid={obj.kpiMTargetUniqueid}
                                    title={obj.content}
                                    titleCount={count}
                                    ref={(e)=>this.progressRefs[key]=e}
                                    focusIndex={this._textInputOnFocus}
                                    sliderValueChange={this.updateProgress}
                                    sliderValue={progress}
                                    changeTitleText={this.changeTitleText}
                                    showRight={true}
                                    showProgressError={this.showProgressError}
                                    showRightImage={showRightImage}
                                    style={{height:110*changeRatio}}
                                    height={110*changeRatio}
                                    rightColor={rightColor}
                                    disabled={true}
                                    canEditTitle={true}
                                    useInput={false}
                                    width={deviceWidth}
                                    maximumTrackTintColor={"rgb(237,240,243)"}
                                    minimumTrackTintColor={"rgb(26,219,221)"}
                                    slideComponent={slideComponent} //滑动组件
                                    slideComponentWidth={slideComponentWidth} //滑动宽度
                                    //下面为滑动时的参数
                                    rowID={rowID}
                                    sectionID={sectionID}
                                    close={!rowData.active}
                                    scroll={this._allowScroll}
                                    onOpen={(sectionID, rowID) => this._handleOpen(sectionID, rowID) }
            />)
        } else {
            return (<TargetProgress keyIndex={key}
                                    key={obj.kpiMTargetUniqueid}
                                    sid={obj.kpiMTargetUniqueid}
                                    title={obj.content}
                                    titleCount={count}
                                    sliderValue={progress}
                                    showRight={true}
                                    showRightImage={showRightImage}
                                    style={{height:110*changeRatio}}
                                    height={110*changeRatio}
                                    rightColor={rightColor}
                                    disabled={true}
                                    width={deviceWidth}
                                    maximumTrackTintColor={"rgb(237,240,243)"}
                                    minimumTrackTintColor={"rgb(26,219,221)"}
            />)
        }

    }

    /** 获取主管目标延期通过行 **/
    _getChargeCheckDelayTargets(rowData, sectionID, rowID) {
        this.progressRefs.push("");
        let obj = rowData;
        let key = Number(rowID);
        let count = "";
        let progress = obj.progress;
        if (key < 9) {
            count += "0" + (key + 1) + ". "
        } else {
            count += (key + 1) + ". "
        }
        let rightText = moment(obj.createTime).format("YYYY年MM月");
        rightTextColor = "#abb5c4";
        let slideComponent = null;
        let rightColor = "rgb(93,109,129)";
        let showRightText = false;
        let showRightImage = false;

        if (obj.attrA === "申请关闭") {
            slideComponent = <TouchableOpacity
                onPressIn={()=>this.props.delayTargetClose(obj.kpiMTargetUniqueid,obj.kpiMTDelayUniqueid)}
                style={{flex:0,width:80*changeRatio,height:110*changeRatio,backgroundColor:"rgb(244,63,60)",justifyContent:"center",alignItems:"center"}}>
                <Text style={{textAlign:"center",fontSize:20*changeRatio,color:"rgb(255,255,255)"}}>结束</Text>
                <Text style={{textAlign:"center",fontSize:20*changeRatio,color:"rgb(255,255,255)"}}>关闭</Text>

            </TouchableOpacity>
            rightText = "申请关闭中";
            rightTextColor = "green";
            showRightText = true;
        } else {
            if (obj.attrA === "延期结束") {
                closeDelaySize++;
            }
            showRightImage = true;
            slideComponent = <TouchableOpacity
                onPressIn={()=>this.props.delayTargetClose(obj.kpiMTargetUniqueid,obj.kpiMTDelayUniqueid)}
                style={{flex:0,width:80*changeRatio,height:110*changeRatio,backgroundColor:"rgb(244,63,60)",justifyContent:"center",alignItems:"center"}}>
                <Text style={{textAlign:"center",fontSize:20*changeRatio,color:"rgb(255,255,255)"}}>结束</Text>
                <Text style={{textAlign:"center",fontSize:20*changeRatio,color:"rgb(255,255,255)"}}>关闭</Text>

            </TouchableOpacity>
        }
        if (this.props.canEvaluate) {
            return (<TargetProgress keyIndex={key}
                                    key={obj.kpiMTargetUniqueid}
                                    sid={obj.kpiMTargetUniqueid}
                                    title={count+obj.content}
                                    sliderValueChange={this.props.sliderValueChange}
                                    sliderValue={progress}
                                    showRight={true}
                                    showRightText={showRightText}
                                    showRightImage={showRightImage}
                                    rightText={rightText}
                                    rightTextColor={rightTextColor}
                                    style={{height:110*changeRatio}}
                                    height={110*changeRatio}
                                    isYiliu={false}
                                    disabled={true}
                                    rightColor={rightColor}
                                    ref={(e)=>this.progressRefs[key]=e}
                                    maximumTrackTintColor={"rgb(237,240,243)"}
                                    minimumTrackTintColor={"rgb(245,101,39)"}
                                    width={deviceWidth}
                                    slideComponent={slideComponent}
                                    slideComponentWidth={80*changeRatio}
                //下面为滑动时的参数
                                    rowID={rowID}
                                    sectionID={sectionID}
                                    close={!rowData.active}
                                    scroll={this._allowScroll}
                                    onOpen={(sectionID, rowID) => this._handleOpen(sectionID, rowID) }
            />)
        } else {
            return (<TargetProgress keyIndex={key}
                                    key={obj.kpiMTargetUniqueid}
                                    sid={obj.kpiMTargetUniqueid}
                                    title={count+obj.content}

                                    sliderValue={progress}
                                    showRight={true}
                                    showRightText={showRightText}
                                    showRightImage={showRightImage}
                                    rightText={rightText}
                                    rightTextColor={rightTextColor}
                                    style={{height:110*changeRatio}}
                                    height={110*changeRatio}
                                    isYiliu={false}
                                    disabled={true}
                                    rightColor={rightColor}

                                    maximumTrackTintColor={"rgb(237,240,243)"}
                                    minimumTrackTintColor={"rgb(245,101,39)"}
                                    width={deviceWidth}

            />)
        }

    }

    /** 渲染行 **/
    _renderRow(rowData: string, sectionID: number, rowID: number) {
        if (this.props.type === "selfPassTargets") {
            return this._getSelfPassTargets(rowData, sectionID, rowID);
        } else if (this.props.type === "selfDelayTargets") {
            return this._getSelfDelayTargets(rowData, sectionID, rowID);
        } else if (this.props.type === "chargeCheckPassTargets") {
            return this._getChargeCheckPassTargets(rowData, sectionID, rowID);
        } else if (this.props.type === "chargeCheckDelayTargets") {
            return this._getChargeCheckDelayTargets(rowData, sectionID, rowID);
        } else {
            return <View></View>
        }
    }

    /** 渲染底部样式 **/
    _renderFooter() {


        if (this.state.isEnding) {
            if (this.state.dataSource.getRowCount() <= -1) {
                return (
                    <View style={{alignItems:"center",flexDirection:"row",justifyContent:"center",height:30,flex:1}}>
                        <Text style={{marginLeft:10,fontSize:14}}>没有更多数据了...</Text>
                    </View>
                )
            } else {
                return (
                    <View></View>
                )
            }
        } else {
            if (this.props.showFooter) {
                return (
                    <View style={{alignItems:"center",flexDirection:"row",justifyContent:"center",height:30,flex:1}}>
                        <ActivityIndicator
                            animating={true}
                            color="rgb(0,171,243)"
                            size="small"
                        />
                        <Text style={{marginLeft:10,fontSize:14}}>加载中...</Text>
                    </View>
                )
            } else {
                return (
                    <View></View>
                )
            }
        }
    }

    //进行滑动到底部的操作
    onEndReached() {
        //this.setState({isRefreshing:true})

        if (this.state.isEnding == false) {
            this.setState({isEnding: true})
        }
    }

    render() {
        this.progressRefs = [];
        let refreshControl = null;
        if (this.props.showFooter) {
            refreshControl = <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh}
                tintColor="rgb(0,171,243)"
                colors={['rgb(0,171,243)']}
                progressBackgroundColor="#ffffff"
            />
        }

        return (
            <View style={{flex:1}}>
                <View
                    style={[this.props.layoutStyle,styles.btnView,this.state.showShouhui ? {left:0,bottom:this.state.shouhuiBottom,zIndex:700}:{}]}>
                    <TouchableOpacity activeOpacity={0.8} style={[styles.submitBtn,{position:"absolute",top:0,left:15}]}
                                      onPressOut={this.keyboardCancel}>
                        <Text style={styles.btnText}>取消</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8}
                                      style={[styles.submitBtn,{position:"absolute",top:0,right:0,paddingRight:15}]}
                                      onPressOut={this.keyboardEnsure}>
                        <Text style={[styles.btnText,{textAlign:"right"}]}>确定</Text>
                    </TouchableOpacity>
                </View>

                <ListView
                    scrollEnabled={this.state.scrollEnabled}
                    ref={(e)=>this._scrollView=e}
                    //initialListSize={3}
                    //pageSize={8}
                    //onEndReachedThreshold={5}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow.bind(this)}
                    enableEmptySections={true}
                    alwaysBounceVertical={Platform.OS==='ios'?true:false}
                    removeClippedSubviews={false}
                    overScrollMode={"always"}
                    //renderFooter={()=>this._renderFooter()}
                    //onEndReached={()=>this.onEndReached()}
                    refreshControl={
                         refreshControl
                      }
                    contentContainerStyle={[styles.contentContainer,{paddingBottom:this.state.paddingBottom}]}
                    style={[{flex:1},this.props.style]}/>

            </View>

        );
    }

}

const styles = StyleSheet.create({
    contentContainer: {
        paddingBottom: 80,
        paddingTop: 0,
    },
    btnView: {
        backgroundColor: "rgb(237,240,243)",
        position: 'absolute',
        bottom: -200,
        left: -2 * deviceWidth,
        flex: 1,
        height: 40 * changeRatio,
        width: deviceWidth,
        zIndex: 700,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitBtn: {
        //borderRadius:8,
        //borderColor:'rgb(29,169,252)',
        //backgroundColor:"rgb(29,169,252)",
        //borderWidth:1,
        //width:(deviceWidth-30)/2,
        //flex:1,
        //padding:15,

        //marginTop:10,
        //marginBottom:10,
        flex: 0,
        height: 40 * changeRatio,
        width: 60 * changeRatio,
        justifyContent: 'center',
    },
    btnText: {
        color: "rgb(29,169,252)",
        fontSize: 15 * changeRatio,
    },
})
export default ProgressView;