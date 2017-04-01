/**
 * 自评／周评历史
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
    Modal
} from "react-native"
import ImageResource from '../../utils/ImageResource';
import TopBar from '../common/TopBar'
import Calendar from '../common/Calendar/Calendar'
import {getSelfEvaluate,  updatePage} from '../../actions'
import moment from 'moment'
import * as SizeController from '../../SizeController'
import EvaluateRowItem from './EvaluateRowItem'
let topHeight = SizeController.getTopHeight();
let tabBarHeight = SizeController.getTabBarHeight();
let changeRatio = SizeController.getChangeRatio();
const topBarRatio = SizeController.getTopBarRatio();
const imageViewBackgroundColor = "rgb(228,236,240)";
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
//const weekdays = ["星期天","星期一","星期二","星期三","星期四","星期五","星期六"];
const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

const WeekEvaluateHistory = React.createClass({
    getInitialState: function () {
        return {
            isShowRili: false,
            fadeMin: new Animated.Value(0),
            selectPeopleIndex: -1,
            selectRowData: null,
            showLoading: false,
            selectDate: moment().format("YYYY-MM-DD"),
            canEvaluate: false,
            showDetail: false
        }
    },
    toback(){
        //this.props.navigator.pop();
        let obj = {
            route: null,
            toBack: true,
            needInitUpdate: 1
        }
        updatePage(this.props.dispatch, obj);
    },
    rilicontrol(){
        this.setState({isShowRili: !this.state.isShowRili});
    },
    componentDidMount: function () {
        let PageData = this.props.pageModel.PageData
        let startDate = "";
        let endDate = "";
        let date = this.state.selectDate;
        if (moment(date).day() == 0) {
            startDate = moment(date).day(-6).format("YYYY-MM-DD");
            endDate = moment(date).day(0).format("YYYY-MM-DD");
        } else {
            startDate = moment(date).day(1).format("YYYY-MM-DD");
            endDate = moment(date).day(7).format("YYYY-MM-DD");
        }
        PageData.weekStarEvaluation = null;
        PageData.evaluations = null;
        let postData = {
            token: PageData.token,
            userUniqueid: PageData.checkUserUniqueid,
            orgUniqueid: PageData.orgUniqueid,
            type: "chooseWeek",
            startDate: startDate,
            endDate: endDate
        }
        getSelfEvaluate(this.props.dispatch, postData, false);
    },
    componentDidUpdate: function () {
        //alert(this.state.chooseUserDistance);
        //if(this.state.selectPeopleIndex == -1){
        //alert(this.state.chooseUserDistance)
        //this.refs.userScroll.scrollTo({x:this.state.selectPeopleIndex * 100,y:0,animated:true});
        //}
    },
    //选择日期
    onDateSelect(date){
        // alert(date);
        //alert(moment(date).day(1).format("YYYY-MM-DD"));
        // alert(moment(date).day(7).format("YYYY-MM-DD"));
        let startDate = "";
        let endDate = "";
        if (moment(date).day() == 0) {
            startDate = moment(date).day(-6).format("YYYY-MM-DD");
            endDate = moment(date).day(0).format("YYYY-MM-DD");
        } else {
            startDate = moment(date).day(1).format("YYYY-MM-DD");
            endDate = moment(date).day(7).format("YYYY-MM-DD");
        }

        let PageData = this.props.pageModel.PageData
        //PageData.evaluations=[];
        //PageData.weekStarEvaluation = [];
        let postData = {
            token: PageData.token,
            userUniqueid: PageData.checkUserUniqueid,
            orgUniqueid: PageData.orgUniqueid,
            type: "chooseWeek",
            startDate: startDate,
            endDate: endDate
        }
        PageData.weekStarEvaluation = null;
        PageData.evaluations = null;
        this.setState({showLoading: true, showDetail: false, isShowRili: false, selectDate: date});
        getSelfEvaluate(this.props.dispatch, postData, false);


    },
    toHideRiLi(){
        this.setState({isShowRili: false});
    },
    toPreWeek(){
        let date = this.state.selectDate;
        let realDate = moment(date).add(-7, "days");
        // this.setState({selectDate:realDate});
        this.onDateSelect(realDate);

    },

    toNextWeek(){
        let date = this.state.selectDate;
        let realDate = moment(date).add(7, "days");
        this.onDateSelect(realDate);
        //this.setState({selectDate:realDate});
    },
    canAnswer(selectDate){		//判断是否是当周
        let startDate = "";
        let endDate = "";
        if (moment().day() == 0) {
            startDate = moment().day(-6).format("MM-DD");
            endDate = moment().day(0).format("MM-DD");
        } else {
            startDate = moment().day(1).format("MM-DD");
            endDate = moment().day(7).format("MM-DD");
        }
        if (selectDate >= startDate && selectDate <= endDate) {
            return true;
        }
        return false;
    },
    doTimeout(){
        if (!this.state.showDetail) {
            this.setState({showDetail: true});
        }
    },
    showDetailFunc(){
        //this.setState({showDetail:true});
        setTimeout(this.doTimeout, 125);
    },
    render(){
        //   {this.state.showLoading && <Loader zIndex={this.state.showLoading?999:0}/>}
        let PageData = this.props.pageModel.PageData;
        let width = this.props.layoutStyle.width
        let fontSizeMin = this.props.layoutStyle.width / 27;
        if (fontSizeMin > 14) {
            fontSizeMin = 14
        }
        let fontSizeMin2 = fontSizeMin + 1;
        let fontSizeMin3 = fontSizeMin2 + 1;
        // let scrollEnabled = true;
        if (this.canAnswer(this.state.selectDate)) {
            if (this.state.selectRowData !== undefined && this.state.selectRowData !== null && this.state.selectRowData.canEvaluate == 1) {
                this.state.canEvaluate = true;
            }
        } else {
            this.state.canEvaluate = false;
        }
        let rightComponent = <TouchableOpacity onPress={()=>this.onDateSelect(moment())}
                                               style={{justifyContent: "center",marginRight: 10}}><Text
            style={{textAlign: "right",fontSize: 17 * topBarRatio,color: "#ffffff"}}>本周</Text></TouchableOpacity>;

        let chargeRowItem = <View></View>
        if (PageData.weekStarEvaluation !== undefined && PageData.weekStarEvaluation !== null && PageData.weekStarEvaluation !== "") {
            if (PageData.weekStarEvaluation.isExist === "exist") {
                chargeRowItem = <EvaluateRowItem isChargeWeekEvaluate={true} showDetailFunc={this.showDetailFunc}
                                                 rowData={PageData.weekStarEvaluation} {...this.props} />
            }
        }

        let rowItems = [];
        var that = this;
        if (PageData.evaluations !== undefined && PageData.evaluations !== null) {
            rowItems = PageData.evaluations.map(function (obj, index) {
                return <EvaluateRowItem isChargeWeekEvaluate={false} showDetailFunc={that.showDetailFunc}
                                        canEvaluate={that.state.canEvaluate} index={index} key={index}
                                        rowData={obj} {...that.props}/>
            });
        }
        let riLi = null
        if (!this.state.isShowRili) {
            riLiStyle = {};
        } else {
            riLiStyle = [{
                top: topHeight,
                position: "absolute",
                left: 0,
                zIndex: 501,
                backgroundColor: "rgba(0,0,0,0.5)"
            }, this.props.layoutStyle];
            riLi = <View style={{flex: 1}}>
                <Calendar
                    scrollEnabled={Platform.OS === 'ios' ? true : false}
                    showControls={true}
                    useFixedHeight={true}    //固定高度
                    showWeekCircle={true}    //显示选定周
                    showHook={false}        //显示✓
                    isPushAllday={true}    //铺满数据
                    width={width}
                    dayHeadings={['日','一','二','三','四','五','六']}
                    customStyle={
			{day: {fontSize: 13},
              		             controlButton: {},calendarContainer: {backgroundColor: "rgb(255,255,255)"},
              		             monthContainer: {width: width},
              		             dayButton: {width: width / 7},
              		             dayButtonFiller: {width: width / 7},
              		             weekRow: {width: width},
				calendarHeading: {height: 40},
              		             holidayText: {width: (width - 20) / 7}
              		            }
                  }
                    showHolidayText={true}  //显示节假日信息
                    showBackToToDay={false}
                    showDayInfoHoliday={false}
                    showLunarInfo={false}
                    onDateSelect={this.onDateSelect}
                    startDate={this.state.selectDate}
                    selectedDate={this.state.selectDate}
                    weekStart={1}
                />
                <TouchableOpacity onPress={this.toHideRiLi} style={{flex: 1}}>
                </TouchableOpacity>
            </View>
        }
        let topBarText = "";
        let date = this.state.selectDate
        let startDate = "";
        let endDate = "";
        if (moment(date).day() == 0) {
            startDate = moment(date).day(-6).format("MM-DD");
            endDate = moment(date).day(0).format("MM-DD");
            topBarText += startDate + "至";
            topBarText += endDate;
        } else {
            startDate = moment(date).day(1).format("MM-DD");
            endDate = moment(date).day(7).format("MM-DD");
            topBarText += startDate + "至";
            topBarText += endDate;
        }
        let middleComponent = <View style={{flexDirection: "row",justifyContent: "center"}}>
            <TouchableOpacity onPress={this.toPreWeek} style={{justifyContent: "center"}}>
                <Image style={{width: 17 * topBarRatio,height: 17 * topBarRatio}}
                       source={ImageResource["arrow-calendar-prev@2x.png"]}></Image>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.rilicontrol}
                              style={{marginLeft: 15 * topBarRatio,marginRight: 15 * topBarRatio,flexDirection: "row"}}>
                <View style={{justifyContent: "center"}}>
                    <Text style={{fontSize: 17 * topBarRatio,color: "#ffffff"}}>{startDate}</Text>
                </View>
                <View style={{justifyContent: "center",marginLeft: 5,marginRight: 5}}>
                    <Text style={{fontSize: 17 * topBarRatio,color: "#ffffff"}}>{"至"}</Text>
                </View>
                <View style={{justifyContent: "center"}}>
                    <Text style={{fontSize: 17 * topBarRatio,color: "#ffffff"}}>{endDate}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.toNextWeek} style={{justifyContent: "center"}}>
                <Image style={{width: 17 * topBarRatio,height: 17 * topBarRatio}}
                       source={ImageResource["arrow-calendar-down@2x.png"]}></Image>
            </TouchableOpacity>
        </View>
        return (
            <View style={[styles.container]}>
                <TopBar
                    toback={this.toback}
                    layoutStyle={this.props.layoutStyle}
                    showRightImage={true}
                    middleWidth={{width: deviceWidth / 8 * 6}}
                    leftWidth={{width: deviceWidth / 8}}
                    rightWidth={{width: deviceWidth / 8}}
                    rightComponent={rightComponent}
                    topBarText={topBarText}
                    topBarTextRight="今天"
                    showRight={false}
                    showLeft={true}
                    showMiddleComponent={true}
                    middleComponent={middleComponent}
                />
                <View style={riLiStyle}>{riLi}</View>
                <View style={{flex: 1,marginTop: topHeight,backgroundColor: "rgb(48,173,245)"}}>
                    <ScrollView showsVerticalScrollIndicator={true}
                        // style={[{position:"absolute",top:0,left:-deviceWidth,height:deviceHeight-topHeight},this.state.showDetail?{left:0}:{}]}
                                keyboardShouldPersisTaps={true}
                                keyboardDismissMode='interactive'
                                ref={"scrollView"}
                                contentContainerStyle={styles.contentContainer}
                    >
                        {chargeRowItem}
                        {rowItems}
                    </ScrollView>
                </View>


            </View>
        )
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(48,173,245)"
    },
    contentContainer: {
        paddingBottom: 125,
        paddingTop: 0
    },
    starText: {
        fontSize: 14,
        margin: 2,
        width: 100,
        color: "rgb(93,109,129)",
        marginLeft: 0
    },
    starContainer: {
        flexDirection: 'row',
        flex: 1,
        height: 35,
        padding: 15,
        paddingBottom: 0,
        paddingTop: 10
    },
    starStyle: {
        width: 15, height: 15,
        marginRight: 4
    },
    starContainerStyle: {
        marginLeft: 5, flex: 0, width: 80
    },
    textAreaView: {
        margin: 5,
        flex: 0
    },
    textArea: {
        flex: 0,
        fontSize: 16,
        padding: 5,
        paddingLeft: 10
    },
    textInputFlex: {
        flex: 1
    },
    textInputView: {
        width: 200,
        height: 40,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 5,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: "flex-start"
    },
    btnView: {
        flex: 1,
        //height:70,
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        paddingLeft: 5,
        paddingRight: 5,
        //width:500,
        height: 60,
        zIndex: 500
    },
    btnAbsolute: {
        flex: 1,
        borderRadius: 8,
        // borderColor:'rgb(29,169,252)',
        backgroundColor: "rgb(29,169,252)",
        // borderWidth:1,
        //padding:10,
        height: 40,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 500,
        //height:70,
        marginRight: 5,
        marginLeft: 5
    },
    buttonText: {
        color: 'rgb(255,255,255)',
        fontSize: 15
        //fontWeight:"400"
    },
    bgRedImageTextRight: {
        fontSize: 12,
        color: "#ffffff"
    }
});

export default WeekEvaluateHistory;