/**
 * 目标进度审核
 * Created by yuanzhou on 17/02.
 */
import React, {Component} from 'react'
import {
    InteractionManager,
    View,
    ScrollView,
    TouchableOpacity,
    Text,
    Dimensions,
    RefreshControl,
    StyleSheet,
    Keyboard,
    Image
} from 'react-native'
import TopBar from '../common/TopBar'
import IconTitle from '../common/IconTitle'
import ImageResource from '../../utils/ImageResource'
import moment from 'moment'
import {
    clientUserTargetManage,
    updatePage,
    clientUserTargetDelayManage,
    getUserTarget,
    changeUserTargetProgress
} from '../../actions'
import TargetProgress from './TargetProgress'
import * as SizeController from '../../SizeController'
let topHeight = SizeController.getTopHeight();
let tabBarHeight = SizeController.getTabBarHeight();
let changeRatio = SizeController.getChangeRatio();
var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;
class TargetProgressCheck extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toDelayTarget: false,
            toNowTarget: false,
            sliderUniqueid: null,
            progressRefs: [],
            delayProgressRefs: [],
            keyboardHeight: 0,
            showShouhui: false,
            shouhuiBottom: 0,
            textInputIndex: -1,
            isRefreshing: true,
            needScrollAndShow: true

        }
        //键盘相关 start
        this.subscriptions = [];
        this.updateKeyboardSpace = this.updateKeyboardSpace.bind(this);
        this.resetKeyboardSpace = this.resetKeyboardSpace.bind(this);
        this._textInputOnFocus = this._textInputOnFocus.bind(this);
        this.keyboardEnsure = this.keyboardEnsure.bind(this);
        this.keyboardCancel = this.keyboardCancel.bind(this);
        this.showProgressError = this.showProgressError.bind(this);
        this._scrollView = null;
        //键盘相关 end
        this.toback = this.toback.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        this.updateProgress = this.updateProgress.bind(this);
        this.progressCancelAndReset = this.progressCancelAndReset.bind(this);
    }

    toback() {
        //this.props.navigator.pop();
        let {dispatch} = this.props;
        let obj = {
            route: null,
            toBack: true,
            needInitUpdate: 1
        }
        updatePage(dispatch, obj);
    }

    componentDidMount() {

        InteractionManager.runAfterInteractions(() => {
            this._onRefresh();
        })

        //   this.setState({isRefreshing:true})
        // getUserTarget(this.props.dispatch,{token:PageData.token,userUniqueid:routeInfo.checkUserUniqueid,orgUniqueid:PageData.orgUniqueid})
    }

    componentWillMount() {
        let {routeInfo} = this.props;
        let PageData = this.props.pageModel.PageData
        PageData.passTargets = []
        PageData.targetsNotPass = []
        PageData.lastMonthTargets = []
        PageData.newTargetsChecking = []
        PageData.newTargetsNeedSubmit = []
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
        this.subscriptions.forEach((sub) => sub.remove())
    }

    componentWillReceiveProps(nextProps) {
        let isRefreshing = true;
        let preFetching = this.props.pageModel.PageState.fetching;
        let nextFetching = nextProps.pageModel.PageState.fetching;
        // alert(nextFetching)
        if (nextFetching === false) {
            this.setState({isRefreshing: false});
        } else {
            if (preFetching !== nextFetching) {
                this.setState({isRefreshing: isRefreshing});
            }
        }
    }

    // Keyboard actions
    updateKeyboardSpace(frames) {
        console.log("updateKeyboardSpace");
        //if(this.state.needScrollAndShow){
        //console.log(this._scrollView)
        const keyboardSpace = frames.endCoordinates.height;//获取键盘高度
        if (Platform.OS === 'ios') {
            this.setState({showShouhui: true, shouhuiBottom: keyboardSpace});
        } else {
            this.setState({showShouhui: true, shouhuiBottom: false});
        }

        let heightTemp = this.props.layoutStyle.height;
        let y = this.state.textInputIndex * (140 + 10) * changeRatio + 150 * changeRatio + keyboardSpace + 40 * changeRatio;
        y += 10 * changeRatio;
        if (heightTemp - topHeight < y) {
            let temp1 = y % heightTemp;
            let size = Math.floor(y / heightTemp);
            let scrollY = temp1 + (size - 1) * heightTemp + topHeight + 60 * changeRatio;
            if (this._scrollView) {
                this._scrollView.scrollTo({y: scrollY, animated: false})
            }
        }
        // }

    }

    resetKeyboardSpace() {
        console.log("resetKeyboardSpace");
        this.setState({showShouhui: false, shouhuiBottom: 0});
        // if(this.state.needScrollAndShow){
        let heightTemp = this.props.layoutStyle.height;
        let y = this.state.textInputIndex * (140 + 10) * changeRatio + 150 * changeRatio;
        y += 10 * changeRatio;
        if (heightTemp - topHeight < y) {
            let temp1 = y % heightTemp;
            let size = Math.floor(y / heightTemp);
            let scrollY = temp1 + (size - 1) * heightTemp + topHeight;
            if (this._scrollView) {
                this._scrollView.scrollTo({y: scrollY, animated: true})
            }
        } else {
            if (this._scrollView) {
                this._scrollView.scrollTo({y: 0, animated: true})
            }
        }
        //}
    }

    _textInputOnFocus(index) {
        //alert(index)
        this.state.textInputIndex = index
    }

    keyboardEnsure() {//确认
        let key = this.state.textInputIndex;
        this.state.progressRefs[key].progressEnsure();
    }

    keyboardCancel() {//取消
        let key = this.state.textInputIndex;
        //alert(key)
        this.state.progressRefs[key].progressCancel();
    }

    showProgressError(message) {
        this.state.needScrollAndShow = false;
        Alert.alert("提示", message, [{text: '确认', onPress: () => this.progressCancelAndReset()}]);
    }

    progressCancelAndReset() {
        this.state.needScrollAndShow = true;
        // this.setState({needScrollAndShow:true});
    }

    _onRefresh() {
        // this.setState({isRefreshing:true})
        let {routeInfo} = this.props;
        let PageData = this.props.pageModel.PageData
        getUserTarget(this.props.dispatch, {
            token: PageData.token,
            userUniqueid: routeInfo.checkUserUniqueid,
            orgUniqueid: PageData.orgUniqueid
        }, {}, true)

    }

    updateProgress(progress, kpiMTargetUniqueid) {//更新进度
        let {routeInfo} = this.props;
        let kpiMTargetUniqueidArray = [];
        let progressArray = [];
        kpiMTargetUniqueidArray[0] = kpiMTargetUniqueid;
        progressArray[0] = progress + "";
        let PageData = this.props.pageModel.PageData
        let postData = {
            kpiMTargetUniqueidArray: kpiMTargetUniqueidArray,
            progressArray: progressArray,
            token: PageData.token,
            userUniqueid: routeInfo.checkUserUniqueid,
            orgUniqueid: PageData.orgUniqueid,
            type: "chargeAdjust"
        }
        //alert(JSON.stringify(postData))
        /*let currentRoutes = this.props.navigator.getCurrentRoutes()
         let currentRoute = currentRoutes[currentRoutes.length - 1]
         let route={
         name:'Evaluate',
         type:'Evaluate',
         path:'none',
         component:Evaluate,
         index:currentRoute.index+1
         }
         this.state.sliderValueInit = false;*/
        changeUserTargetProgress(this.props.dispatch, postData, null);
    }

    render() {
        let PageData = this.props.pageModel.PageData;
        let {routeInfo} = this.props;
        let nowMonthTargetsList = [];
        let that = this;
        if (PageData.passTargets !== undefined && PageData.passTargets !== null) {
            that.state.progressRefs = [];
            nowMonthTargetsList = PageData.passTargets.map(function (obj, key) {
                that.state.progressRefs.push("");
                let count = "";
                let progress = obj.superiorAdjustProgress;
                if (key < 9) {
                    count += "0" + (key + 1) + ". ";
                } else {
                    count += key + 1 + ". ";
                }

                let rightText = moment(obj.createTime).format("YYYY年MM月");
                let slideComponent = null;
                let slideComponentWidth = 80 * changeRatio;
                let showRightImage = false;
                slideComponent = <TouchableOpacity onPressIn={()=>that.delayTargetPress(obj.kpiMTargetUniqueid)}
                                                   style={{flex: 0,width: 80 * changeRatio,height: 140 * changeRatio,backgroundColor: "rgb(244,63,60)",justifyContent: "center",alignItems: "center"}}>
                    <Text style={{textAlign: "center",fontSize: 20 * changeRatio,color: "rgb(255,255,255)"}}>延期</Text>
                </TouchableOpacity>

                return <TargetProgress keyIndex={key}
                                       key={obj.kpiMTargetUniqueid}
                                       sid={obj.kpiMTargetUniqueid}
                                       title={count + obj.content}
                                       ref={(e)=>that.state.progressRefs[key] = e}
                                       focusIndex={that._textInputOnFocus}
                                       showProgressError={that.showProgressError}
                                       sliderValueChange={that.updateProgress}
                                       sliderValue={progress}
                                       onChangeText={that.updateProgress}
                                       showRight={false}
                                       showRightImage={showRightImage}
                    //rightText={rightText}
                                       style={{height: 140 * changeRatio}}
                                       height={140 * changeRatio}
                                       disabled={false}
                                       toInitial={false}
                                       useInput={true}
                                       width={deviceWidth}
                                       maximumTrackTintColor={"rgb(237,240,243)"}
                                       minimumTrackTintColor={"rgb(26,219,221)"}

                />
            });

        }
        return (
            <View style={styles.container}>
                <TopBar
                    toback={this.toback}
                    layoutStyle={this.props.layoutStyle}
                    useAnimated={false}
                    showRightImage={false}
                    topBarText="进度考评"
                    topBarTextBottomShow={true}
                    topBarTextBottom={routeInfo.checkName}
                    topBarTextRight="历史"
                    showRight={false}
                    showLeft={true}
                />
                <View
                    style={[this.props.layoutStyle,styles.btnView,this.state.showShouhui ? {backgroundColor: "rgb(237,240,243)",flexDirection: "row",bottom: this.state.shouhuiBottom,zIndex: 700} : {bottom: -40 * changeRatio,height: 0,width: 0,zIndex: 0} ]}>
                    <TouchableOpacity activeOpacity={0.8}
                                      style={[styles.submitBtn,{position: "absolute",top: 0,left: 15 * changeRatio}]}
                                      onPressOut={this.keyboardCancel}>
                        <Text style={styles.btnText}>取消</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8}
                                      style={[styles.submitBtn,{position: "absolute",top: 0,right: 0,paddingRight: 15 * changeRatio}]}
                                      onPressOut={this.keyboardEnsure}>
                        <Text style={[styles.btnText,{textAlign: "right"}]}>确定</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    refreshControl={
			             <RefreshControl
			                    refreshing={this.state.isRefreshing}
			                    onRefresh={this._onRefresh}
			                    tintColor="rgb(0,0,0)"
			                    colors={['rgb(0,171,243)']}
			                    progressBackgroundColor="#ffffff"
			                  />
	          		}
                    ref={(ref)=>this._scrollView = ref}
                    scrollEnabled={this.state.canCancelContentTouches}
                    //alwaysBounceVertical={false}
                    style={{width: deviceWidth,paddingTop: 10 * changeRatio,marginTop: topHeight,zIndex: 500,height: deviceHeight}}
                >
                    {nowMonthTargetsList}
                </ScrollView>
            </View>
        )
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(248,248,248)"
    },
    btnView: {
        backgroundColor: '#ffffff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        flex: 0,
        flex: 1,
        height: 40 * changeRatio,
        zIndex: 500,
        alignItems: 'center',
        justifyContent: 'center'
    },
    submitBtn: {
        height: 40 * changeRatio,
        width: 60 * changeRatio,
        justifyContent: 'center'
    },
    btnText: {
        color: "rgb(29,169,252)",
        fontSize: 15 * changeRatio
    }
})
export default TargetProgressCheck;