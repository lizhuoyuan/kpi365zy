/**
 * 主管周评
 * Created by yuanzhou on 17/02/01.
 */

import React, { Component, PropTypes } from 'react'
import {Animated,Easing,Keyboard,View,Slider,PixelRatio,TouchableHighlight,ScrollView,Text,Alert,TouchableOpacity,TextInput,StyleSheet,Image,Dimensions} from 'react-native'
import StarRating from './common/StarRating'
import TabBar from './common/TabBar'
import {tabManage,weekStarEvaluate,getWeekStarEvaluation} from '../actions'
import CommonStyles from '../styles'
import Tab_First from './Tab_First'
import TopBar from './common/TopBar'
import RadioGroup from './common/RadioGroup'
import WeekEvaluateHistory from './version2/WeekEvaluateHistory'
import  Home from './Home'
import  * as SizeController from '../SizeController'
let topHeight = SizeController.getTopHeight();
let tabBarHeight = SizeController.getTabBarHeight();
let changeRatio = SizeController.getChangeRatio();
const WeekStarEvaluate = React.createClass({
getInitialState:function(){
    return {
      starEvaluation1: 0,
      starEvaluation4: 0,
      starEvaluation2: 0,
      starEvaluation3: 0,
      sliderValue:0,
      sidArray:[],
      isFirstInit:true,
      selectedKey:0,
      kpiCWRemarkUniqueid:null,
      bottomValue:new Animated.Value(0),
      showShouhui:false,
      height:0,
    }
  },
   subscriptions:null,
   componentDidMount:function(){
      let PageData = this.props.pageModel.PageData
      let postData = {
	        token:PageData.token,
	        userUniqueid:PageData.checkUserUniqueid,
	        orgUniqueid:PageData.orgUniqueid,
	        type:"getCurrentWeekStarEvaluate"
	      }; 
	  let obj = {

	  };
		getWeekStarEvaluation(this.props.dispatch,postData,false,obj);
  },
  getLayout(e){
    if(this.state.height !== e.nativeEvent.layout.height){
      this.setState({height:e.nativeEvent.layout.height});
    }
  },
  componentWillMount(){
     this.subscriptions = [
    Keyboard.addListener('keyboardWillShow', this.updateKeyboardSpace),
    Keyboard.addListener('keyboardWillHide', this.resetKeyboardSpace)]
  },
  componentWillUnmount(){
     this.subscriptions.forEach((sub)=>sub.remove())
  },
  updateKeyboardSpace: function (frames) {
    　　const keyboardSpace =  frames.endCoordinates.height//获取键盘高度
        // this.setState({showShouhui:true,shouhuiBottom:keyboardSpace})
        let heightTemp = this.props.layoutStyle.height;
        let y = this.state.height + keyboardSpace;
        if((heightTemp-topHeight) < y){
          let temp1 = y % heightTemp;
          let size = Math.floor(y / heightTemp);
          let scrollY = temp1 + (size-1) * heightTemp + topHeight;
         this.refs.scrollView.scrollTo({y:scrollY,animated:false})
        }
    },

    resetKeyboardSpace: function () {
      //console.log(Easing);
     // Animated.timing(this.state.bottomValue,{toValue:0,
       //   duration:0.25*1000,//7
         // tension
         //easing:Easing.out(Easing.ease),
         //}).start();
         // this.setState({showShouhui:false,shouhuiBottom:0})
       this.refs.scrollView.scrollTo({y:0,animated:true})
      //_scrollView.scrollTo({y:0,animated:true})
    },
  submit(){
    let  PageData = this.props.pageModel.PageData
    let postData = {}
    if(this.state.starEvaluation1 == 0  && this.state.starEvaluation2 ==0 && this.state.starEvaluation3 ==0 && this.state.starEvaluation4 == 0){
      Alert.alert("提示", "请至少选择一个维度进行星评~",
      [{text: '确认'}]);
    }else{
      postData.starEvaluation1 = this.state.starEvaluation1;
      postData.starEvaluation2 = this.state.starEvaluation2;
      postData.starEvaluation4 = this.state.starEvaluation4;
      postData.starEvaluation3 = this.state.starEvaluation3;
      postData.evaluationText = this.evaluationText;
      postData.token = PageData.token;
      postData.userUniqueid = PageData.checkUserUniqueid;
      postData.orgUniqueid = PageData.orgUniqueid;
      postData.type = "weekStarEvaluate";
      postData.kpiCWRemarkUniqueid = this.state.kpiCWRemarkUniqueid;
      let currentRoutes = this.props.navigator.getCurrentRoutes()
      let currentRoute = currentRoutes[currentRoutes.length - 1]
      let route = {
          name:"WeekEvaluateHistory",
          type:'WeekEvaluateHistory',
          path:'none',
          component:WeekEvaluateHistory,
          index:currentRoute.index,
         // tabManageInfo:tabManageInfo,
        }      
      let obj = {toBack:false,needInitUpdate:-1,route:route};
      weekStarEvaluate(this.props.dispatch,postData,false,obj);
    }
  },
  evaluationText:"",
  onChangeText(text){
    this.state.isFirstInit = false
    this.evaluationText = text
  },
  onStarRatingPress(rating) {
    this.state.isFirstInit = false
    this.setState({
      starEvaluation1: rating
    })
  },
  onStarRatingPress2(rating) {
    this.state.isFirstInit = false
    this.setState({
      starEvaluation2: rating
    })
  },
  onStarRatingPress3(rating) {
    this.state.isFirstInit = false
    this.setState({
      starEvaluation3: rating
    })
  },
  onStarRatingPress4(rating) {
    this.state.isFirstInit = false
    this.setState({
      starEvaluation4 : rating
    })
  },
  sliderValue(value){
    this.state.isFirstInit = false
    this.setState({
      sliderValue: value
    })
},
onSelect(key){
  this.state.isFirstInit = false
  this.setState({selectedKey:key})
},
_onKeyPress(key){
 
 //alert(JSON.stringify(key))
},
toback(){
    this.props.navigator.pop()
   // tabManage(this.props.dispatch,this.props.pageModel.tabManage.tabClickIndex,DailyReport,'',false)
},
shouhui(){
  this.refs.textInput.blur();
},
    render(){
      const PageData = this.props.pageModel.PageData
      let topName = PageData.checkName;
      //alert(JSON.stringify(PageData.evaluation))
      let weekStarEvaluation = PageData.weekStarEvaluation
        if( weekStarEvaluation!== undefined && weekStarEvaluation !== null && weekStarEvaluation.isExist == 1){
            if(this.state.isFirstInit){
              this.state.starEvaluation1 =  weekStarEvaluation.starEvaluation1==null?0:weekStarEvaluation.starEvaluation1
              this.state.starEvaluation2 =  weekStarEvaluation.starEvaluation2==null?0:weekStarEvaluation.starEvaluation2
              this.state.starEvaluation3 =  weekStarEvaluation.starEvaluation3==null?0:weekStarEvaluation.starEvaluation3
              this.state.starEvaluation4 =  weekStarEvaluation.starEvaluation4==null?0:weekStarEvaluation.starEvaluation4
              this.evaluationText = weekStarEvaluation.evaluationText              
              this.state.kpiCWRemarkUniqueid = weekStarEvaluation.kpiCWRemarkUniqueid
            }
          }
            let rightComponent = <TouchableOpacity onPress={this.submit} style={{justifyContent:"center",marginRight:10}}><Text style={{color:"#ffffff",fontSize:17*changeRatio}} >发送</Text></TouchableOpacity>;
      return(
        <View style={styles.container_all}>
        <TopBar toback={this.toback} 
        layoutStyle={this.props.layoutStyle} 
        topBarText={topName} 
        topBarTextRight="" 
        showRight={false} 
        showLeft={true}
        showRightImage={true}
        rightComponent={rightComponent}
        ></TopBar>
        {this.state.showShouhui && <Animated.View style={[this.props.layoutStyle,styles.btnView,{bottom:this.state.shouhuiBottom}]}>
        <TouchableOpacity style={styles.submitBtn} onPress={this.shouhui}>
              <Text style={styles.btnText}>收回</Text>
            </TouchableOpacity>
        </Animated.View>
      }
        <ScrollView showsVerticalScrollIndicator={true}
           ref="scrollView"
          contentContainerStyle={styles.contentContainer}>
        <View onLayout={this.getLayout} style={styles.container}>
          <Text style={styles.titleText}>评分：</Text>
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
              <Text style={styles.starText}>工作态度</Text>
              <StarRating
                  starStyle={styles.starStyle}
                  rating={this.state.starEvaluation4}
                  selectedStar={(rating) => this.onStarRatingPress4(rating)}
                />
            </View>
            <Text style={styles.titleText}>点评：</Text>
            <View style={styles.textAreaView}>
              <TextInput ref={"textInput"} returnKeyType="default"  onKeyPress={this._onKeyPress} underlineColorAndroid={'transparent'} placeholder={'点评'} defaultValue={this.evaluationText} onChangeText={this.onChangeText} style={styles.textArea} multiline={true}>
              </TextInput>
            </View>
   
        </View>
        </ScrollView>
        </View>
      )
    }
  })

/*<View></View>*/

const styles = StyleSheet.create({
  container_all:{
      flex:1,
      backgroundColor:"rgb(248,248,248)"
    },
  contentContainer: {
    paddingBottom:125,
    paddingTop:topHeight,
  },
  container:{
    flex:1,
   // padding:15
  },
  starContainer:{
    flexDirection: 'row',alignItems:'center',
   // margin:20,
  //  marginTop:15,
   // marginBottom:0
   padding:20*changeRatio,
   paddingBottom:0,
   //paddingTop:15,
  },
  image:{
    borderRadius:55*changeRatio,
    width:25*changeRatio,
    height:25*changeRatio
  },
  textAreaView:{
    margin:15*changeRatio,
    marginTop:15*changeRatio,
    marginLeft:16*changeRatio,
    marginRight:16*changeRatio,
    borderWidth: 1,
    borderColor:'#cccccc',
    borderRadius : 8*changeRatio,
    height:100*changeRatio,
  },
  textArea:{
   flex: 1,
   fontSize: 16*changeRatio,
   padding: 10*changeRatio,
   marginBottom: 0,
 },
 starText:{
   fontSize:15*changeRatio,
   width:100*changeRatio,
   color:"rgb(180,186,194)",
   marginLeft:15*changeRatio,
 },
 starStyle:{
   width:23*changeRatio,height:23*changeRatio,
   flex:1,
  // marginRight:15
 },
  titleText:{
    color:"rgb(58,68,80)",
    fontSize:16*changeRatio,
    marginTop:25*changeRatio,
    marginLeft:15*changeRatio,
  },
  btnText:{
    color:"#ffffff",
    fontSize:15*changeRatio,
  },
   btnView:{
      backgroundColor:'#ffffff',
      position:'absolute',
      bottom:0,
      left:0,
     //width:500,
      height:60*changeRatio,
      zIndex:500,
      //alignItems: 'center',
      justifyContent :'center',
    },
  submitBtn:{
    marginTop:15*changeRatio,
    borderRadius:8*changeRatio,
    borderColor:'rgb(29,169,252)',
    backgroundColor:"rgb(29,169,252)",
    borderWidth:1,
    //padding:15,
    margin:10*changeRatio,
    height:40*changeRatio,
    alignItems: 'center',
    justifyContent :'center',
  },
  blueCircleView:{
    width:25*changeRatio,
    height:25*changeRatio,
    borderRadius:12.5*changeRatio,
    borderColor:'rgb(29,169,252)',
    borderWidth:1,
  }
});
export default  WeekStarEvaluate