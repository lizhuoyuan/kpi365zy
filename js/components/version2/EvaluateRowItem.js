/**
 * 自评／主管周评项
 * Created by yuanzhou on 17/02.
 */
import React, {Component} from "react"
import {
    View,
    StyleSheet,
    Platform,
    Dimensions,
    TextInput,
    Animated,
    ScrollView,
    TouchableOpacity,
    Image,
    Text,
    Modal,
    Alert
} from "react-native"
import ImageResource from '../../utils/ImageResource';
import StarRating from '../common/StarRating'
import {doPostWeekEvaluateAnswer} from '../../actions'
import moment from 'moment'
import {handleUrl} from '../../utils/UrlHandle'
import  * as SizeController from '../../SizeController'
let topHeight = SizeController.getTopHeight();
let tabBarHeight = SizeController.getTabBarHeight();
let changeRatio = SizeController.getChangeRatio();
const imageViewBackgroundColor = "rgb(228,236,240)";
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
class LayoutItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: 0,
            answerText: "",
        }
        this.fabiaoInput = null;
        this.onFocus = this.onFocus.bind(this);
        this.toBlur = this.toBlur.bind(this);
        this.answerPress = this.answerPress.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        // this.answerText = "";
    }

    componentDidMount() {
        let {rowData} = this.props;
        if (rowData) {
            let answer = rowData.answer;
            this.setState({
                answerText: answer
            });
        }
    }

    componentWillReceiveProps(nextProps, nextState) {

        let preRowData = this.props.rowData;
        let {rowData} = nextProps;
        if (preRowData.answer !== rowData.answer) {
            this.setState({
                answerText: rowData.answer
            });

        }
    }

    onLayout(e) {
        this.props.getLayoutHeight && this.props.getLayoutHeight(e.nativeEvent.layout.height)
        this.setState({height: e.nativeEvent.layout.height});
    }


    getLayout() {
        return this.state.height;
    }

    toReward() {
        let {rowData} = this.props;
        this.props.toReward && this.props.toReward(rowData.kpiSEvalutionUniqueid);
    }

    onChangeText(text) {
        this.setState({
            answerText: text
        })
    }

    toBlur() {//失焦
        this.fabiaoInput.blur();
    }

    onFocus() { //聚焦返回key,调整输入框位置
        this.fabiaoInput.focus();
        this.props.focusIndex && this.props.focusIndex(this.props.keyIndex);
    }

    answerPress() {
        let answer = this.state.answerText;
        if (answer !== "") {
            let {PageData, weekEvaluateInfo} = this.props.pageModel;
            let {dispatch, rowData, keyIndex} = this.props;
            let startDate = "";
            let endDate = "";
            let date = moment();
            if (date.day() == 0) {
                endDate = date.format("YYYY-MM-DD");
                startDate = date.day(-6).format("YYYY-MM-DD");
            } else {
                startDate = date.day(1).format("YYYY-MM-DD");
                endDate = date.day(7).format("YYYY-MM-DD");
            }
            let postDataToUpdateAll = {
                token: PageData.token,
                userUniqueid: rowData.userInfo.userUniqueid,
                orgUniqueid: PageData.orgUniqueid,
                type: "chooseWeek",
                startDate: startDate,
                endDate: endDate
            };
            let postData = {
                token: PageData.token,
                userUniqueid: rowData.userInfo.userUniqueid,
                kpiSEvalutionUniqueid: rowData.kpiSEvalutionUniqueid,
                orgUniqueid: PageData.orgUniqueid,
                answer: answer,
                type: "answer"
            };
            let reducerInfo = {
                fetching_success: true
            };
            doPostWeekEvaluateAnswer(dispatch, postData, false, reducerInfo, postDataToUpdateAll, "weekEvaluateUpdate");
        } else {
            Alert.alert("提示", "发表点评不能为空");
        }

    }

    render() {
        let {showStar, rowData, showReward, canEvaluate}  = this.props;
        let answer = "无点评";
        let value = "无问题";
        let fontSizeMin = 12;
        let fontSizeMin3 = 13;
        let starEvaluation1 = 0;
        let starEvaluation2 = 0;
        let starEvaluation3 = 0;
        let starEvaluation4 = 0;
        let totalStar = 0;
        let time = "";
        let week = "";
        let date = "";
        let userAvatar = {uri: "http://111"};
        let userName = "";
        let answerUserAvatar = {uri: "http://111"};
        let answerUserName = "";
        let answerTime = "";
        let showAnswer = false;
        if (canEvaluate) {
            showAnswer = true;
            value = "";
            answer = "";
        }
        if (rowData) {
            starEvaluation1 = rowData.starEvaluation1 == null ? 0 : rowData.starEvaluation1;
            starEvaluation2 = rowData.starEvaluation2 == null ? 0 : rowData.starEvaluation2;
            starEvaluation3 = rowData.starEvaluation3 == null ? 0 : rowData.starEvaluation3;
            starEvaluation4 = rowData.starEvaluation4 == null ? 0 : rowData.starEvaluation4;
            if (rowData.questionOrSummary !== undefined && rowData.questionOrSummary !== null && rowData.questionOrSummary !== "") {
                value = rowData.questionOrSummary;
            }
            if (rowData.createTime !== undefined && rowData.createTime !== null && rowData.createTime !== "") {
                time = moment(rowData.createTime).format("YYYY年MM月DD日 HH:mm");
                date = moment(rowData.createTime).format("MM月DD日") + " " + weekdays[moment(rowData.createTime).day()];
            }
            if (rowData.answer) {
                answer = rowData.answer;
                showAnswer = true;
            }
            if (rowData.answerTime !== undefined && rowData.answerTime !== null && rowData.answerTime !== "") {
                answerTime = moment(rowData.answerTime).format("YYYY年MM月DD日 HH:mm");
            }
            if (rowData.evaluationText !== undefined && rowData.evaluationText !== null && rowData.evaluationText !== "") {
                answer = rowData.evaluationText;
            }
            let userInfo = rowData.userInfo;
            if (userInfo) {
                name = userInfo.name
                let url = handleUrl(userInfo.avatar);
                if (url) {
                    userAvatar = {uri: url}
                } else {
                    if (userInfo.sex == "男") {
                        userAvatar = ImageResource["header-boy@2x.png"];
                    } else if (userInfo.sex == "女") {
                        userAvatar = ImageResource["header-girl@2x.png"];
                    }
                }
            }
            let answerUserInfo = rowData.answerUserInfo;
            if (answerUserInfo !== undefined && answerUserInfo !== null && answerUserInfo !== "") {
                answerUserName = answerUserInfo.name;
                let url = handleUrl(answerUserInfo.avatar);
                if (url) {
                    answerUserAvatar = {uri: url};
                } else {
                    if (answerUserInfo.sex == "男") {
                        answerUserAvatar = ImageResource["header-boy@2x.png"];
                    } else if (userInfo.sex == "女") {
                        answerUserAvatar = ImageResource["header-girl@2x.png"];
                    }
                }
            }
        }
        totalStar = starEvaluation1 + starEvaluation2 + starEvaluation3 + starEvaluation4;

        return (
            <View onLayout={(e)=>this.onLayout(e)}
                  style={[{flex:0,width:deviceWidth-30*changeRatio,backgroundColor:"#ffffff"},this.state.height > 0 ? {backgroundColor:"rgba(0,0,0,0)"}:{}]}>
                <View style={[{flex:1,marginLeft:5*changeRatio,marginBottom:5*changeRatio}]}>
                    {canEvaluate && showAnswer && <View
                        style={{marginLeft:15*changeRatio,marginTop:10*changeRatio,marginBottom:15*changeRatio,flex:0,flexDirection:"row",}}>
                        <View style={{flex:0,width:deviceWidth-110*changeRatio,height:60*changeRatio}}>
                            <View
                                style={{height:60*changeRatio,flex:0,borderColor:"rgb(228,236,240)",borderWidth:1,borderRadius:8*changeRatio,padding:8}}>
                                <TextInput autoFocus={false} onChangeText={this.onChangeText} onFocus={this.onFocus}
                                           ref={(e)=>this.fabiaoInput=e} placeholder={"发表点评..."}
                                           value={this.state.answerText}
                                           placeholderTextColor={"#1da9fc"} multiline={true} defaultValue={answer}
                                           style={{flex:1,backgroundColor:"rgba(0,0,0,0)",color:"#1da9fc",fontSize:12*changeRatio,}}>
                                </TextInput>
                            </View>
                        </View>
                        <View style={{flex:1,justifyContent:"center",height:60*changeRatio}}>
                            <TouchableOpacity onPress={this.answerPress}
                                              style={{marginLeft:11*changeRatio,backgroundColor:"rgb(248,248,248)",width:34*changeRatio,height:34*changeRatio,borderRadius:17*changeRatio,marginTop:4}}>
                                <Image source={ImageResource["btn-send@2x.png"]}
                                       style={{width:34*changeRatio,height:34*changeRatio,borderRadius:17*changeRatio}}></Image>
                            </TouchableOpacity>
                        </View>
                    </View>}
                    {!canEvaluate && showAnswer && <View
                        style={{marginLeft:15*changeRatio,marginBottom:15*changeRatio,flex:0,height:this.state.chargeHeight,flexDirection:"row",}}>
                        <View
                            style={{flex:0,backgroundColor:imageViewBackgroundColor,width:34*changeRatio,height:34*changeRatio,borderRadius:17,marginTop:4}}>
                            <Image source={answerUserAvatar}
                                   style={{width:34*changeRatio,height:34*changeRatio,borderRadius:17}}></Image>
                        </View>
                        <View style={{marginLeft:11*changeRatio,marginTop:4*changeRatio,flex:1,flexDirection:"column"}}>
                            <View style={{flex:1,width:deviceWidth-110*changeRatio,backgroundColor:"#ffffff"}}>
                                <View style={{flex:0,flexDirection:"row",height:20*changeRatio}}>
                                    <Text style={{fontSize:12*changeRatio,color:"#1da9fc"}}>{answerUserName}</Text>
                                    <Text
                                        style={{position:"absolute",right:0,fontSize:10*changeRatio,color:"rgb(184,192,204)"}}>{answerTime}</Text>
                                </View>
                                <View
                                    style={{marginTop:2*changeRatio,flex:0,backgroundColor:"rgb(228,236,240)",borderRadius:8*changeRatio,padding:8*changeRatio}}>
                                    <Text
                                        style={{backgroundColor:"rgba(0,0,0,0)",color:"rgb(93,109,129)",fontSize:12*changeRatio,}}>{answer}</Text>
                                </View>
                            </View>
                        </View>
                    </View>}
                    {((canEvaluate && !showAnswer) || (!canEvaluate && showAnswer)) &&
                    <View style={{marginLeft:15,flex:1,flexDirection:"row"}}>
                        <View style={{marginTop:5*changeRatio,flex:0,flexDirection:"column"}}>
                            <View style={{flex:1,width:deviceWidth-110*changeRatio,backgroundColor:"#ffffff"}}>
                                <View style={{flex:0,flexDirection:"row",height:20*changeRatio}}>
                                    <Text style={{fontSize:10*changeRatio,color:"#abb5c4"}}>{time}</Text>
                                    <Text
                                        style={{position:"absolute",right:0,fontSize:12*changeRatio,color:"#1da9fc"}}>{name}</Text>
                                </View>
                                <View
                                    style={{marginTop:2*changeRatio,flex:0,backgroundColor:"rgb(228,236,240)",borderRadius:8*changeRatio,padding:8*changeRatio}}>
                                    <Text
                                        style={{backgroundColor:"rgba(0,0,0,0)",textAlign:"left",color:"#5d6d81",fontSize:12*changeRatio}}>{value}</Text>
                                </View>
                            </View>
                        </View>
                        <View
                            style={{flex:0,marginLeft:11*changeRatio,backgroundColor:imageViewBackgroundColor,width:34*changeRatio,height:34*changeRatio,borderRadius:17*changeRatio}}>
                            <Image source={userAvatar}
                                   style={{width:34*changeRatio,height:34*changeRatio,borderRadius:17*changeRatio}}></Image>
                        </View>

                    </View>}
                    {((canEvaluate && showAnswer) || (!canEvaluate && !showAnswer)) &&
                    <View style={{marginLeft:15*changeRatio,flex:1,flexDirection:"row",}}>
                        <View
                            style={{flex:0,backgroundColor:imageViewBackgroundColor,width:34*changeRatio,height:34*changeRatio,borderRadius:17*changeRatio,marginTop:4*changeRatio}}>
                            <Image source={userAvatar}
                                   style={{width:34*changeRatio,height:34*changeRatio,borderRadius:17}}></Image>
                        </View>
                        <View style={{marginLeft:11*changeRatio,marginTop:4*changeRatio,flex:1,flexDirection:"column"}}>
                            <View style={{flex:1,width:deviceWidth-110*changeRatio,backgroundColor:"#ffffff"}}>
                                <View style={{flex:0,flexDirection:"row",height:20*changeRatio}}>
                                    <Text style={{fontSize:12*changeRatio,color:"#1da9fc"}}>{name}</Text>
                                    <Text
                                        style={{position:"absolute",right:0,fontSize:10*changeRatio,color:"rgb(184,192,204)"}}>{time}</Text>
                                </View>
                                <View
                                    style={{marginTop:2*changeRatio,flex:0,backgroundColor:"rgb(228,236,240)",borderRadius:8*changeRatio,padding:8*changeRatio}}>
                                    <Text
                                        style={{backgroundColor:"rgba(0,0,0,0)",color:"rgb(93,109,129)",fontSize:12*changeRatio,}}>{value}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    }
                    {showStar && <View style={{flex:0,marginTop:20*changeRatio,width:deviceWidth,alignItems:"center"}}>
                        <View
                            style={{flex:0,width:(deviceWidth-40*changeRatio),flexDirection:"row",height:22*changeRatio}}>
                            <View style={{flex:1,width:(deviceWidth-40*changeRatio)/2,flexDirection:"row"}}>
                                <Text
                                    style={{fontSize:12*changeRatio,color:"#5d6d81",backgroundColor:"rgba(0,0,0,0)"}}>{'工作量'} </Text>
                                <StarRating
                                    starStyle={[styles.starStyle]}
                                    rating={starEvaluation1}
                                    containerStyle={styles.starContainerStyle}
                                />
                            </View>
                            <View
                                style={{marginLeft:-15*changeRatio,flex:1,width:(deviceWidth-40)/2,flexDirection:"row"}}>
                                <Text
                                    style={{fontSize:12*changeRatio,color:"#5d6d81",backgroundColor:"rgba(0,0,0,0)"}}>{'工作质量'} </Text>
                                <StarRating
                                    starStyle={[styles.starStyle]}
                                    rating={starEvaluation3}
                                    containerStyle={styles.starContainerStyle}
                                />
                            </View>
                        </View>
                        <View
                            style={{flex:0,width:(deviceWidth-40*changeRatio),flexDirection:"row",height:22*changeRatio}}>
                            <View style={{flex:1,width:(deviceWidth-40*changeRatio)/2,flexDirection:"row"}}>
                                <Text
                                    style={{fontSize:12*changeRatio,color:"#5d6d81",backgroundColor:"rgba(0,0,0,0)"}}>{'完成度'} </Text>
                                <StarRating
                                    starStyle={[styles.starStyle]}
                                    rating={starEvaluation2}
                                    containerStyle={styles.starContainerStyle}
                                />
                            </View>
                            <View
                                style={{marginLeft:-15*changeRatio,flex:1,width:(deviceWidth-40*changeRatio)/2,flexDirection:"row"}}>
                                <Text style={styles.starText}>{'幸福指数'} </Text>
                                <StarRating
                                    starStyle={[styles.starStyle]}
                                    rating={starEvaluation4}
                                    containerStyle={styles.starContainerStyle}
                                />

                            </View>
                        </View>
                    </View>
                    }
                </View>
            </View>
        )
    }
}
class EvaluateRowItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showStar: false,
            realShowStar: false,
            height: 0,
            chargeHeight: 0,
            containerHeight: 0,
        }
        this.doClick = this.doClick.bind(this);
        this.toReward = this.toReward.bind(this);
        this.reSizecontainerLayout = this.reSizecontainerLayout.bind(this);
        this.getContainerHeight = this.getContainerHeight.bind(this);
    }

    _onLayout(e) {

        if (this.state.height !== e.nativeEvent.layout.height) {
            let realShowStar = false;
            if (this.state.showStar) {
                realShowStar = true;
            }
            this.setState({height: e.nativeEvent.layout.height, realShowStar: realShowStar});
        }
    }

    toReward() {
        let {rowData} = this.props;
        this.props.toReward && this.props.toReward(rowData.kpiSEvalutionUniqueid);
    }

    _onLayoutCharge(e) {
        if (this.state.chargeHeight !== e.nativeEvent.layout.height) {
            this.setState({chargeHeight: e.nativeEvent.layout.height});
        }
    }

    reSizecontainerLayout(e) {
        if (this.state.containerHeight !== e.nativeEvent.layout.height) {
            this.setState({containerHeight: e.nativeEvent.layout.height});
        }
    }

    getContainerHeight() {
        return this.state.containerHeight;
    }

    showStarEvaluation() {
        this.setState({showStar: !this.state.showStar})
    }

    componentDidMount() {
    }

    componentDidUpdate() {
        return true;
    }

    componentWillReceiveProps(nextProps) {

    }

    getLayoutHeight(height) {
        this.setState({height: height});
        if (height > 0) {
            this.props.showDetailFunc && this.props.showDetailFunc();
        }

    }

    doClick() {
        this.props.doClick && this.props.doClick();
    }

    render() {
        let answer = "无点评";
        let value = "无问题";
        let {rowData, showReward} =  this.props;
        let fontSizeMin = 12;
        let fontSizeMin3 = 13;
        let starEvaluation1 = 0;
        let starEvaluation2 = 0;
        let starEvaluation3 = 0;
        let starEvaluation4 = 0;
        let totalStar = 0;
        let time = "";
        let week = "";
        let date = "";
        let userAvatar = {uri: "http://111"};
        let userName = "";
        let answerUserAvatar = {uri: "http://111"};
        let answerUserName = "";
        let answerTime = "";
        let showAnswer = false;

        if (rowData) {
            starEvaluation1 = rowData.starEvaluation1 == null ? 0 : rowData.starEvaluation1;
            starEvaluation2 = rowData.starEvaluation2 == null ? 0 : rowData.starEvaluation2;
            starEvaluation3 = rowData.starEvaluation3 == null ? 0 : rowData.starEvaluation3;
            starEvaluation4 = rowData.starEvaluation4 == null ? 0 : rowData.starEvaluation4;
            if (rowData.questionOrSummary !== undefined && rowData.questionOrSummary !== null && rowData.questionOrSummary !== "") {
                value = rowData.questionOrSummary;
            }
            if (rowData.createTime !== undefined && rowData.createTime !== null && rowData.createTime !== "") {
                time = moment(rowData.createTime).format("YYYY年MM月DD日 HH:mm");
                date = moment(rowData.createTime).format("MM月DD日") + " " + weekdays[moment(rowData.createTime).day()];
            }
        }
        totalStar = starEvaluation1 + starEvaluation2 + starEvaluation3 + starEvaluation4;
        if (this.props.showRedPacket) {
            return (<View onLayout={this.reSizecontainerLayout}
                          style={{marginTop:15*changeRatio,paddingTop:22*changeRatio,flex:1,width:deviceWidth,alignItems:"center"}}>

                {showReward ? <TouchableOpacity onPress={this.toReward}
                                                style={{position:"absolute",width:44*changeRatio,height:44*changeRatio,top:0,zIndex:500,left:(deviceWidth-20*changeRatio)/2}}>
                        <Image style={{flex:1,width:44*changeRatio,height:44*changeRatio}}
                               source={ImageResource["btn-giveRedPackets@2x.png"]}>
                        </Image>
                    </TouchableOpacity>
                    :
                    <View onPress={null}
                          style={{position:"absolute",width:44*changeRatio,height:44*changeRatio,top:0,zIndex:500,left:(deviceWidth-20*changeRatio)/2}}>
                        <Image style={{flex:1,width:44*changeRatio,height:44*changeRatio}}
                               source={ImageResource["btn-givedRedPackets@2x.png"]}>
                        </Image>
                    </View>
                }
                <Image style={{flex:0,width:deviceWidth-20*changeRatio,height:50*changeRatio}} resizeMode="stretch"
                       source={ImageResource["bg-report-top@3x.png"]}>
                    <View style={{flex:0,width:deviceWidth-20*changeRatio,height:50*changeRatio,flexDirection:"row"}}>

                        <View
                            style={{flex:0,height:50*changeRatio,justifyContent:"center",backgroundColor:"rgba(0,0,0,0)",flexDirection:"row"}}>
                            <Text
                                style={{marginLeft:20*changeRatio,fontSize:18*changeRatio,color:"#2b3d54",marginTop:16*changeRatio}}>日报</Text>
                            <Text
                                style={{fontSize:12*changeRatio,color:"#2b3d54",marginTop:20*changeRatio,marginLeft:5*changeRatio}}>({date})</Text>
                        </View>

                        <TouchableOpacity onPress={()=>this.showStarEvaluation()}
                                          style={{position:"absolute",top:0,right:0,width:80*changeRatio,height:45*changeRatio,flex:1,justifyContent:"center"}}>
                            <Image source={ImageResource["icon-stars@2x.png"]} resizeMode="contain"
                                   style={{flex:0,width:80*changeRatio,height:30*changeRatio}}>
                                <View
                                    style={{flex:1,alignItems:"center",backgroundColor:"rgba(0,0,0,0)",justifyContent:"center"}}>
                                    <Text style={styles.starTextRight}>{totalStar}</Text>
                                </View>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </Image>
                <Image source={ImageResource["bg-report-repeat@3x.png"]} resizeMode="stretch"
                       style={{position:"absolute",left:10*changeRatio,top:71*changeRatio,flex:0,width:deviceWidth-20*changeRatio,height:this.state.height+1}}>

                </Image>
                <LayoutItem
                    getLayoutHeight={this.getLayoutHeight.bind(this)}
                    showStar={this.state.showStar}
                    {...this.props}
                />
                <Image source={ImageResource["bg-report-btm@3x.png"]} resizeMode="stretch"
                       style={{flex:0,width:deviceWidth-20*changeRatio,height:15*changeRatio}}>
                </Image>
            </View>)
        }
        if (!this.props.canClick) {
            return (
                <View style={{marginTop:15*changeRatio,flex:1,width:deviceWidth,alignItems:"center"}}>
                    <Image style={{flex:0,width:deviceWidth-20*changeRatio,height:50*changeRatio}} resizeMode="stretch"
                           source={ImageResource["bg-report-top@3x.png"]}>
                        <View
                            style={{flex:0,width:deviceWidth-20*changeRatio,height:50*changeRatio,flexDirection:"row"}}>

                            {!this.props.isChargeWeekEvaluate ? <View
                                    style={{flex:0,height:50*changeRatio,justifyContent:"center",backgroundColor:"rgba(0,0,0,0)",flexDirection:"row"}}>
                                    <Text
                                        style={{marginLeft:20*changeRatio,fontSize:18*changeRatio,color:"#2b3d54",marginTop:16*changeRatio}}>日报</Text>
                                    <Text
                                        style={{fontSize:12*changeRatio,color:"#2b3d54",marginTop:20*changeRatio,marginLeft:5*changeRatio,}}>({date})</Text>
                                </View>
                                :
                                <View
                                    style={{flex:0,height:50*changeRatio,backgroundColor:"rgba(0,0,0,0)",justifyContent:"center",}}>
                                    <Text
                                        style={{marginLeft:20*changeRatio,fontSize:18*changeRatio,color:"#2b3d54",textAlign:"left",marginTop:16*changeRatio}}>主管周评</Text>
                                </View>
                            }

                            <TouchableOpacity onPress={()=>this.showStarEvaluation()}
                                              style={{position:"absolute",top:0,right:0,width:80*changeRatio,height:45*changeRatio,flex:1,justifyContent:"center"}}>
                                <Image source={ImageResource["icon-stars@2x.png"]} resizeMode="contain"
                                       style={{flex:0,width:80*changeRatio,height:30*changeRatio}}>
                                    <View
                                        style={{flex:1,alignItems:"center",backgroundColor:"rgba(0,0,0,0)",justifyContent:"center"}}>
                                        <Text style={styles.starTextRight}>{totalStar}</Text>
                                    </View>
                                </Image>
                            </TouchableOpacity>
                        </View>
                    </Image>

                    <Image source={ImageResource["bg-report-repeat@3x.png"]} resizeMode="stretch"
                           style={{position:"absolute",left:10*changeRatio,top:50*changeRatio,flex:0,width:deviceWidth-20*changeRatio,height:this.state.height}}>

                    </Image>
                    <LayoutItem
                        getLayoutHeight={this.getLayoutHeight.bind(this)}
                        showStar={this.state.showStar}
                        {...this.props}
                    />
                    <Image source={ImageResource["bg-report-btm@3x.png"]} resizeMode="stretch"
                           style={{flex:0,width:deviceWidth-20*changeRatio,height:15*changeRatio}}>
                    </Image>
                </View>
            )
        } else {
            return (
                <TouchableOpacity activeOpacity={1} onPress={this.doClick}
                                  style={{marginTop:15*changeRatio,flex:1,width:deviceWidth,alignItems:"center"}}>
                    <Image style={{flex:0,width:deviceWidth-20*changeRatio,height:50*changeRatio}} resizeMode="stretch"
                           source={ImageResource["bg-report-top@3x.png"]}>
                        <View
                            style={{flex:0,width:deviceWidth-20*changeRatio,height:50*changeRatio,flexDirection:"row"}}>

                            {!this.props.isChargeWeekEvaluate ? <View
                                    style={{flex:0,height:50*changeRatio,justifyContent:"center",backgroundColor:"rgba(0,0,0,0)",flexDirection:"row"}}>
                                    <Text
                                        style={{marginLeft:20*changeRatio,fontSize:18*changeRatio,color:"#2b3d54",marginTop:16*changeRatio}}>日报</Text>
                                    <Text
                                        style={{fontSize:12*changeRatio,color:"#2b3d54",marginTop:20*changeRatio,marginLeft:5*changeRatio,}}>({date})</Text>
                                </View>
                                :
                                <View
                                    style={{flex:0,height:50*changeRatio,backgroundColor:"rgba(0,0,0,0)",justifyContent:"center",}}>
                                    <Text
                                        style={{marginLeft:20*changeRatio,fontSize:18*changeRatio,color:"#2b3d54",textAlign:"left",marginTop:16*changeRatio}}>主管周评</Text>
                                </View>
                            }
                            <TouchableOpacity onPress={()=>this.showStarEvaluation()}
                                              style={{position:"absolute",top:0,right:0,width:80*changeRatio,height:45*changeRatio,flex:1,justifyContent:"center"}}>
                                <Image source={ImageResource["icon-stars@2x.png"]} resizeMode="contain"
                                       style={{flex:0,width:80*changeRatio,height:30*changeRatio}}>
                                    <View
                                        style={{flex:1,alignItems:"center",backgroundColor:"rgba(0,0,0,0)",justifyContent:"center"}}>
                                        <Text style={styles.starTextRight}>{totalStar}</Text>
                                    </View>
                                </Image>
                            </TouchableOpacity>
                        </View>
                    </Image>

                    <Image source={ImageResource["bg-report-repeat@3x.png"]} resizeMode="stretch"
                           style={{position:"absolute",left:10*changeRatio,top:50*changeRatio,flex:0,width:deviceWidth-20*changeRatio,height:this.state.height}}>

                    </Image>
                    <LayoutItem
                        getLayoutHeight={this.getLayoutHeight.bind(this)}
                        showStar={this.state.showStar}
                        {...this.props}
                    />
                    <Image source={ImageResource["bg-report-btm@3x.png"]} resizeMode="stretch"
                           style={{flex:0,width:deviceWidth-20*changeRatio,height:15*changeRatio}}>
                    </Image>
                </TouchableOpacity>
            )
        }

    }
}
const styles = StyleSheet.create({
    starText: {
        fontSize: 14 * changeRatio,
        margin: 2 * changeRatio,
        width: 100 * changeRatio,
        color: "rgb(93,109,129)",
        marginLeft: 0,
    },
    starContainer: {
        flexDirection: 'row',
        flex: 1,
        height: 35 * changeRatio,
        padding: 15 * changeRatio,
        paddingBottom: 0,
        paddingTop: 10 * changeRatio,
    },
    starStyle: {
        width: 13 * changeRatio,
        height: 13 * changeRatio,
        marginRight: 4 * changeRatio
    },
    starContainerStyle: {
        marginLeft: 5 * changeRatio,
        flex: 0,
        width: 80 * changeRatio
    },
    starText: {
        fontSize: 12 * changeRatio,
        color: "#5d6d81",
        backgroundColor: "rgba(0,0,0,0)"
    },
    starTextRight: {
        fontSize: 12 * changeRatio,
        color: "#ffffff"
    },
});
export default EvaluateRowItem;