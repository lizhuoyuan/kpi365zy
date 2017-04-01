/**
 * 每日自评页
 * Created by yuanzhou on 16/11.
 */
import React, {Component, PropTypes} from 'react'
import {
    Animated,
    Easing,
    View,
    Slider,
    PixelRatio,
    Keyboard,
    TouchableHighlight,
    KeyboardAvoidingView,
    ScrollView,
    Text,
    Alert,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
    Dimensions,
    InteractionManager
} from 'react-native'
import StarRating from './common/StarRating'
import {selfEvaluate, getSelfEvaluate, updatePage} from '../actions'
import TopBar from './common/TopBar'
import RadioGroup from './common/RadioGroup'
import ImageResource from '../utils/ImageResource'
import WeekEvaluateHistory from './version2/WeekEvaluateHistory'
import  * as SizeController from '../SizeController'
import ChooseUser from './version2/ChooseUser'


let topHeight = SizeController.getTopHeight();
let changeRatio = SizeController.getChangeRatio();
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const options = [{sid: "private", text: "推送国主"}, {sid: "country", text: "推送国家"}, {sid: "world", text: "推送全部"}];

/**
 * 移除数组
 * @param array
 * @param uniqueid
 * @param key
 * @returns {Array}
 */
function removeToArray(array, uniqueid, key) {
    let tempArray = [];
    let index = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i][key] != uniqueid) {
            tempArray[index] = array[i];
            index++;
        }
    }
    return tempArray;
}

let Evaluate = React.createClass({
    getInitialState() {
        return {
            starEvaluation1: 0,
            starEvaluation4: 0,
            starEvaluation2: 0,
            starEvaluation3: 0,
            sidArray: [],
            selectUsers: [],
            isFirstInit: true,
            showChooseUser: false,
            selectedKey: "country",
            kpiSEvalutionUniqueid: null,
            bottomValue: new Animated.Value(0),
            showShouhui: false,
            height: 0,
        }
    },
    subscriptions: null,
    selectedUserScrollRef: null,
    summaryText: "",
    componentDidMount() {
        let PageData = this.props.pageModel.PageData;
        let postData = {
            token: PageData.token,
            userUniqueid: PageData.userUniqueid,
            orgUniqueid: PageData.orgUniqueid,
            type: "currentDay"
        }
        this.doFirstInit(this.props);
        InteractionManager.runAfterInteractions(() => {
            getSelfEvaluate(this.props.dispatch, postData, false, null, {fetching_success: true})
        });
    },
    /**
     * 首次初始化
     * @param props
     */
    doFirstInit(props){
        let PageData = props.pageModel.PageData;
        if (PageData.evaluation && PageData.evaluation.isExist === 1) {
            this.summaryText = PageData.evaluation.questionOrSummary;
            this.setState({
                starEvaluation1: PageData.evaluation.starEvaluation1 === null ? 0 : PageData.evaluation.starEvaluation1,
                starEvaluation2: PageData.evaluation.starEvaluation2 === null ? 0 : PageData.evaluation.starEvaluation2,
                starEvaluation3: PageData.evaluation.starEvaluation3 === null ? 0 : PageData.evaluation.starEvaluation3,
                starEvaluation4: PageData.evaluation.starEvaluation4 === null ? 0 : PageData.evaluation.starEvaluation4,
                kpiSEvalutionUniqueid: PageData.evaluation.kpiSEvalutionUniqueid,
                selectUsers: PageData.evaluation.atUsers,
                selectedKey: PageData.evaluation.tweetRange,
            });
        }
    },
    componentWillMount(){
        this.subscriptions = [
            Keyboard.addListener('keyboardWillShow', this.updateKeyboardSpace),
            Keyboard.addListener('keyboardWillHide', this.resetKeyboardSpace)]
    },
    componentWillUnmount(){
        this.subscriptions.forEach((sub) => sub.remove())
    },
    getLayout(e){
        if (this.state.height !== e.nativeEvent.layout.height) {
            this.setState({height: e.nativeEvent.layout.height});
        }
    },
    /**
     * 键盘出现
     * @param frames
     */
    updateKeyboardSpace(frames) {
        const keyboardSpace = frames.endCoordinates.height//获取键盘高度
        this.setState({showShouhui: false, shouhuiBottom: keyboardSpace})
        let heightTemp = this.props.layoutStyle.height;
        let y = this.state.height + keyboardSpace;
        if ((heightTemp - topHeight) < y) {
            let temp1 = y % heightTemp;
            let size = Math.floor(y / heightTemp);
            let scrollY = temp1 + (size - 1) * heightTemp + topHeight;
            this.refs.scrollView.scrollTo({y: scrollY, animated: false})
        }

    },
    /**
     * 键盘隐藏
     */
    resetKeyboardSpace() {
        this.setState({showShouhui: false, shouhuiBottom: 0});
        this.refs.scrollView.scrollTo({y: 0, animated: true});
    },
    componentWillReceiveProps(nextProps){
        let {pageModel} = nextProps;
        let {fetching_success} = pageModel.PageData;
        if (fetching_success) {
            this.doFirstInit(nextProps);
        }
        let PageData = pageModel.PageData;
        if (PageData.needInitUpdate !== undefined && PageData.needInitUpdate !== null) {
            if (pageModel.PageData.needInitUpdate == 0) {
                this.doInitUpdate();
            }
            pageModel.PageData.needInitUpdate = -1;
        }
    },
    /**
     * 请求日报数据
     */
    doInitUpdate(){
        let PageData = this.props.pageModel.PageData
        let postData = {
            token: PageData.token,
            userUniqueid: PageData.userUniqueid,
            orgUniqueid: PageData.orgUniqueid,
            type: "currentDay"
        }
        getSelfEvaluate(this.props.dispatch, postData)
    },
    /**
     * 提交
     */
    submit(){
        let PageData = this.props.pageModel.PageData;
        let {loginUserInfo} = PageData;
        if (this.state.starEvaluation1 === 0 && this.state.starEvaluation2 === 0 && this.state.starEvaluation3 === 0 && this.state.starEvaluation4 === 0) {
            Alert.alert("提示", "请至少选择一个维度进行星评~",
                [{text: '确认'}]);
        } else {
            let userList = [];
            let atUserNames = "";
            this.state.selectUsers.forEach((obj, key) => {
                userList.push(obj.userUniqueid);
                atUserNames += " @" + obj.name + " ";
            });
            let countryLeader = "";
            if (this.state.selectedKey === "private") {
                countryLeader = loginUserInfo ? loginUserInfo.countryLeader : "";
            }
            let postData = {
                starEvaluation1: this.state.starEvaluation1,
                starEvaluation2: this.state.starEvaluation2,
                starEvaluation3: this.state.starEvaluation3,
                starEvaluation4: this.state.starEvaluation4,
                questionOrSummary: this.summaryText,
                token: PageData.token,
                userUniqueid: PageData.userUniqueid,
                orgUniqueid: PageData.orgUniqueid,
                kpiSEvalutionUniqueid: this.state.kpiSEvalutionUniqueid,
                notices: userList,
                atUserNames: atUserNames,
                countryLeader: countryLeader,
                tweetRange: this.state.selectedKey
            };

            let route = null;
            let obj = null;
            if (postData.kpiSEvalutionUniqueid !== null && postData.kpiSEvalutionUniqueid !== "") {
                let {routeInfo} = this.props;
                route = {
                    name: 'WeekEvaluateHistory',
                    type: 'WeekEvaluateHistory',
                    path: 'none',
                    component: WeekEvaluateHistory,
                    index: routeInfo.index
                };
                PageData.checkUserUniqueid = PageData.userUniqueid;
                PageData.checkName = PageData.loginUserInfo.name;
                obj = {
                    // route:route,
                    toBack: true,
                    needInitUpdate: 1,
                    showReWardDialog: false,
                    //fetching_success:true,
                };
            } else {
                obj = {
                    route: route,
                    toBack: false,
                    needInitUpdate: -1,
                    showReWardDialog: true,
                    fetching_success: true,
                };
            }

            this.refs.textInput.blur();
            selfEvaluate(this.props.dispatch, postData, true, obj);
        }
    },
    /**
     * 更改文本
     * @param text
     */
    onChangeText(text){
        this.setState({
                isFirstInit: false
            }
        );
        this.summaryText = text
    },
    /**
     * 星评1
     * @param rating
     */
    onStarRatingPress(rating) {
        this.setState({
            starEvaluation1: rating,
            isFirstInit: false,
        })
    },
    /**
     * 星评2
     * @param rating
     */
    onStarRatingPress2(rating) {
        this.setState({
            starEvaluation2: rating,
            isFirstInit: false,
        })
    },
    /**
     * 星评3
     * @param rating
     */
    onStarRatingPress3(rating) {
        this.setState({
            starEvaluation3: rating,
            isFirstInit: false,
        })
    },
    /**
     * 星评4
     * @param rating
     */
    onStarRatingPress4(rating) {
        this.setState({
            starEvaluation4: rating,
            isFirstInit: false,
        })
    },
    /**
     * 推送范围选择
     * @param key
     */
    onSelect(key){
        this.setState({
            selectedKey: key,
            isFirstInit: false,
        });
    },
    /**
     * 键盘按下操作
     * @param key
     * @private
     */
    _onKeyPress(key){
    },
    /**
     * 返回
     */
    toback(){
        let obj = {
            route: null,
            toBack: true,
            needInitUpdate: 0,
        }
        updatePage(this.props.dispatch, obj);
    },
    /**
     * 确认奖励
     */
    enSureReward(){
        let PageData = this.props.pageModel.PageData;
        let {routeInfo} = this.props;
        let route = {
            name: 'WeekEvaluateHistory',
            type: 'WeekEvaluateHistory',
            path: 'none',
            component: WeekEvaluateHistory,
            index: routeInfo.index
        };
        let obj = {
            //route:route,
            toBack: true,
            needInitUpdate: 1,
            showReWardDialog: false,
            checkUserUniqueid: PageData.userUniqueid,
            checkName: PageData.loginUserInfo.name,

        };
        updatePage(this.props.dispatch, obj);
    },
    /**
     * 键盘收回
     */
    shouhui(){
        this.refs.textInput.blur();
    },
    /**
     * 出现选人控件
     */
    showChooseUser(){
        this.setState({
            showChooseUser: true
        });
    },
    /**
     *  选人确认
     * @param selectUsers
     */
    chooseUserEnsureSubmit(selectUsers){
        this.setState({
            showChooseUser: false,
            selectUsers: selectUsers,
            isFirstInit: false,
        });

    },
    componentDidUpdate(){
        //this.selectedUserScrollRef && this.selectedUserScrollRef.scrollToEnd();
    },
    /**
     * 移除人
     * @param obj
     */
    removeChooseUser(obj){
        let selectUsers = removeToArray(this.state.selectUsers, obj.userUniqueid, "userUniqueid");
        this.setState({
            selectUsers: selectUsers,
            isFirstInit: false,
        });
    },
    render(){
        const PageData = this.props.pageModel.PageData;
        let rightComponent = <TouchableOpacity
            onPress={this.submit}
            style={{justifyContent:"center",marginRight:10*changeRatio}}>
            <Text style={{color:"#ffffff",fontSize:17*changeRatio}}>发送</Text>
        </TouchableOpacity>;
        let that = this;
        let userList = this.state.selectUsers.map((obj, key) => {
            let name = obj.name;
            let temp = null;
            if (obj.avatar && obj.avatar.indexOf("http") === 0) {
                let avatar = {uri: obj.avatar};
                return (
                    <TouchableOpacity
                        onPress={()=>that.removeChooseUser(obj)}
                        style={styles.atListRightImageBtn}
                        key={key}
                    >
                        <View
                            style={styles.atListRightImageView}>
                            <Image
                                source={avatar}
                                style={styles.atListRightImage}>
                            </Image>
                        </View>
                    </TouchableOpacity>
                )
            } else {
                return (
                    <TouchableOpacity
                        onPress={()=>that.removeChooseUser(obj)}
                        style={styles.atListRightImageBtn}
                        key={key}
                    >
                        <View style={styles.atListRightTextView}>
                            <Text numberOfLines={2} style={styles.atListRightText}>{name}</Text>
                        </View>
                    </TouchableOpacity>
                )
            }
        });
        return (
            <View style={styles.container_all}>
                {PageData.showReWardDialog &&
                <View style={[styles.rewardView,this.props.layoutStyle]}>
                    <View style={styles.rewardSecondView}>
                        <Image
                            style={styles.rewardImage}
                            source={ImageResource["icon-reward@3x.png"]}>
                        </Image>
                        <View style={styles.rewardThirdView}>
                            <View style={styles.rewardExploitView}>
                                <Text style={styles.rewardExploitLeftText}>功勋</Text>
                                <Text style={styles.rewardExploitRightText}>+{PageData.selfEvaluateExploitValue}</Text>
                            </View>
                            <View style={styles.rewardWealthView}>
                                <Text style={styles.rewardWealthLeftText}>财富</Text>
                                <Text style={styles.rewardWealthRightText}>+{PageData.selfEvaluateWealth}</Text>
                            </View>
                            <TouchableOpacity onPress={this.enSureReward} style={styles.rewardBtn}>
                                <Text style={styles.rewardBtnText}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                }
                <View
                    style={[styles.chooseUserView,this.state.showChooseUser ? {} : {left:-2*deviceWidth}]}
                >
                    <ChooseUser
                        showTopBar={true}
                        toBack={()=>this.setState({showChooseUser:false})}
                        ensureSubmit={this.chooseUserEnsureSubmit}
                        selectAllSubmit={this.chooseUserEnsureSubmit}
                        chooseType={"organizationUsers"}
                        deptKey="countryUniqueid"
                        userDeptKey="countryUniqueid"
                        seletedUsers={this.state.selectUsers}
                        {...this.props}
                    />
                </View>
                <TopBar toback={this.toback}
                        layoutStyle={this.props.layoutStyle}
                        topBarText="日报小结"
                        topBarTextRight=""
                        showRight={false}
                        showLeft={true}
                        showRightImage={true}
                        rightComponent={rightComponent}
                >

                </TopBar>


                <ScrollView showsVerticalScrollIndicator={true}
                            style={styles.container}
                            ref="scrollView"
                            contentContainerStyle={[styles.contentContainer]}>
                    <View onLayout={this.getLayout} style={{flex:1}}>
                        <View style={styles.container2}>
                            <Text style={styles.titleText}>自我评分：</Text>
                            <View style={styles.starContainer}>
                                <Text style={styles.starText}>{'工作量'} </Text>
                                <StarRating
                                    starStyle={styles.starStyle}
                                    rating={this.state.starEvaluation1}
                                    selectedStar={(rating) => this.onStarRatingPress(rating)}
                                />
                            </View>
                            <View style={styles.starContainer}>
                                <Text style={styles.starText}>{'完成度'}</Text>
                                <StarRating
                                    starStyle={styles.starStyle}
                                    rating={this.state.starEvaluation2}
                                    selectedStar={(rating) => this.onStarRatingPress2(rating)}
                                />
                            </View>
                            <View style={styles.starContainer}>
                                <Text style={styles.starText}>工作质量</Text>
                                <StarRating
                                    starStyle={styles.starStyle}
                                    rating={this.state.starEvaluation3}
                                    selectedStar={(rating) => this.onStarRatingPress3(rating)}
                                />
                            </View>
                            <View style={styles.starContainer}>
                                <Text style={styles.starText}>幸福指数</Text>
                                <StarRating
                                    starStyle={styles.starStyle}
                                    rating={this.state.starEvaluation4}
                                    selectedStar={(rating) => this.onStarRatingPress4(rating)}
                                />
                            </View>
                            <Text style={styles.titleText}>工作问题、小结：</Text>
                            <View style={styles.textAreaView}>
                                <TextInput
                                    returnKeyType="default"
                                    ref="textInput"
                                    onKeyPress={this._onKeyPress}
                                    underlineColorAndroid={'transparent'}
                                    placeholder={'请填写工作问题、小结'}
                                    defaultValue={this.summaryText}
                                    onChangeText={this.onChangeText}
                                    style={styles.textArea}
                                    multiline={true}
                                >
                                </TextInput>
                            </View>
                        </View>
                        <View
                            style={styles.atListView}>
                            <TouchableOpacity
                                style={styles.atListLeftView}
                                onPress={()=>this.showChooseUser()}>
                                <Text style={styles.atListLeftText}>{"@提问"}</Text>
                            </TouchableOpacity>
                            <ScrollView
                                ref={(ref)=>this.selectedUserScrollRef=ref}
                                horizontal
                                scrollEnabled
                                removeClippedSubviews
                                scrollEventThrottle={1000}
                                showsHorizontalScrollIndicator={false}
                                automaticallyAdjustContentInsets
                            >
                                {userList}
                            </ScrollView>
                        </View>
                        <View style={styles.RadioGroupView}>
                            <RadioGroup
                                radioStyle={styles.rateStyle}
                                options={options}
                                selectedKey={this.state.selectedKey}
                                onSelect={(key)=>this.onSelect(key)}
                            />
                        </View>
                    </View>

                </ScrollView>
                <View style={{height:this.state.shouhuiBottom}}>
                </View>
                {this.state.showShouhui &&
                <Animated.View style={[this.props.layoutStyle,styles.btnView,{bottom:this.state.shouhuiBottom}]}>
                    <TouchableOpacity style={styles.submitBtn} onPress={this.shouhui}>
                        <Text style={styles.btnText}>收回</Text>
                    </TouchableOpacity>
                </Animated.View>
                }
            </View>

        )
    }
})


const styles = StyleSheet.create({
    container_all: {
        flex: 1,
        backgroundColor: "rgb(248,248,248)"
    },
    contentContainer: {
        //paddingBottom: 300,
        paddingTop: topHeight,
    },
    container: {
        flex: 1,
    },
    container2: {
        flex: 0,
    },
    starContainer: {
        flex: 0,
        flexDirection: 'row', alignItems: 'center',
        padding: 20 * changeRatio,
        paddingBottom: 0,
    },
    image: {
        flex: 0,
        borderRadius: topHeight,
        width: 25 * changeRatio,
        height: 25 * changeRatio
    },
    textAreaView: {
        margin: 15 * changeRatio,
        marginTop: 15 * changeRatio,
        marginLeft: 16 * changeRatio,
        marginRight: 16 * changeRatio,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 8 * changeRatio,
        height: 100 * changeRatio,
    },
    textArea: {
        flex: 1,
        fontSize: 16 * changeRatio,
        padding: 10 * changeRatio,
        marginBottom: 0,
    },
    starText: {
        fontSize: 15 * changeRatio,
        width: 100 * changeRatio,
        color: "rgb(180,186,194)",
        marginLeft: 15 * changeRatio,
    },
    starStyle: {
        width: 23 * changeRatio,
        height: 23 * changeRatio,
        flex: 1,
        // marginRight:15
    },
    titleText: {
        color: "rgb(58,68,80)",
        fontSize: 16 * changeRatio,
        marginTop: 25 * changeRatio,
        marginLeft: 15 * changeRatio,
    },
    btnText: {
        color: "#ffffff",
        fontSize: 15 * changeRatio,
    },
    btnView: {
        backgroundColor: '#ffffff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        //width:500,
        height: 60 * changeRatio,
        zIndex: 500,
        //alignItems: 'center',
        justifyContent: 'center',
    },
    submitBtn: {
        marginTop: 15 * changeRatio,
        borderRadius: 8 * changeRatio,
        borderColor: 'rgb(29,169,252)',
        backgroundColor: "rgb(29,169,252)",
        borderWidth: 1,
        //padding:15,
        margin: 10 * changeRatio,
        height: 40 * changeRatio,
        alignItems: 'center',
        justifyContent: 'center',
    },
    blueCircleView: {
        width: 25 * changeRatio,
        height: 25 * changeRatio,
        borderRadius: 12.5 * changeRatio,
        borderColor: 'rgb(29,169,252)',
        borderWidth: 1,
    },
    atListView: {
        flexDirection: "row",
        flex: 1,
        //flexWrap: "wrap",
        height: 40 * changeRatio,
        marginLeft: 15 * changeRatio,
        marginRight: 15 * changeRatio,
    },
    atListLeftView: {
        flex: 0,
        height: 40 * changeRatio,
        width: 60 * changeRatio,
        borderRadius: 10 * changeRatio,
        marginRight: 10 * changeRatio,
        backgroundColor: "rgb(29,169,252)",
        justifyContent: "center",
        alignItems: "center"
    },
    atListLeftText: {
        color: "#ffffff",
        fontSize: 14 * changeRatio,
    },
    atListRightImageView: {
        flex: 0,
        backgroundColor: "rgb(29,169,252)",
        borderRadius: 16 * changeRatio,
        height: 33 * changeRatio,
        width: 32 * changeRatio,
    },
    atListRightImageBtn: {
        flex: 0,
        justifyContent: "center",
        alignItems: "center",
        height: 40 * changeRatio,
        width: 32 * changeRatio,
        marginRight: 5 * changeRatio
    },
    atListRightTextView: {
        justifyContent: "center",
        alignItems: "center",
        flex: 0,
        backgroundColor: "rgb(29,169,252)",
        borderRadius: 16 * changeRatio,
        height: 33 * changeRatio,
        width: 32 * changeRatio,
    },
    atListRightImage: {
        height: 32 * changeRatio,
        width: 32 * changeRatio,
        borderRadius: 16 * changeRatio,
    },
    atListRightText: {
        backgroundColor: "rgba(0,0,0,0)",
        color: "#ffffff",
        textAlign: "center",
        fontSize: 10 * changeRatio,
    },
    radioStyle: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    RadioGroupView: {
        marginTop: 10 * changeRatio,
        marginLeft: 15 * changeRatio,
        flex: 1,
    },
    chooseUserView: {
        width: deviceWidth,
        height: deviceHeight,
        position: "absolute",
        zIndex: 600,
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    rewardView: {
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        zIndex: 600,
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    rewardSecondView: {
        flex: 0,
        backgroundColor: "rgba(0,0,0,0)",
        width: 300 * changeRatio,
        height: 280 * changeRatio,
        paddingTop: 50 * changeRatio,
    },
    rewardThirdView: {
        flex: 0,
        borderRadius: 20 * changeRatio,
        backgroundColor: "#ffffff",
        width: 300 * changeRatio,
        height: 230 * changeRatio,
        alignItems: "center",
        justifyContent: "center"
    },
    rewardImage: {
        flex: 0,
        left: 100 * changeRatio,
        height: 100 * changeRatio,
        width: 100 * changeRatio,
        borderRadius: 50 * changeRatio,
        position: "absolute",
        top: 0,
        zIndex: 601
    },
    rewardExploitView: {
        flex: 0, flexDirection: "row",
        marginTop: 50 * changeRatio,
        height: 40 * changeRatio,
    },
    rewardExploitLeftText: {
        letterSpacing: 5 * changeRatio,
        fontSize: 15 * changeRatio,
        color: "#838f9f",
        marginRight: 5 * changeRatio,
        marginTop: 9 * changeRatio,
    },
    rewardExploitRightText: {
        letterSpacing: 5 * changeRatio,
        fontSize: 24 * changeRatio,
        color: "#f3af2b",
    },
    rewardWealthView: {
        flex: 0,
        flexDirection: "row",
        height: 40 * changeRatio,
    },
    rewardWealthLeftText: {
        letterSpacing: 5 * changeRatio,
        fontSize: 15 * changeRatio,
        color: "#838f9f",
        marginRight: 5 * changeRatio,
        marginTop: 9 * changeRatio,
    },
    rewardWealthRightText: {
        letterSpacing: 5 * changeRatio,
        fontSize: 24 * changeRatio,
        color: "#f3af2b",
    },
    rewardBtn: {
        flex: 0,
        marginTop: 20 * changeRatio,
        height: 40 * changeRatio,
        width: 240 * changeRatio,
        alignItems: "center",
        borderRadius: 20 * changeRatio,
        backgroundColor: "rgb(29,169,252)",
        justifyContent: "center",
    },
    rewardBtnText: {
        letterSpacing: 5 * changeRatio,
        fontSize: 24 * changeRatio,
        color: "#ffffff",
    }


});
export default Evaluate
