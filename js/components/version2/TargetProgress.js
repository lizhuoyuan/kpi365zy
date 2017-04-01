/**
 * 目标进度详细
 * Created by yuanzhou on 17/02.
 */
import React, {Component}from 'react'
import {
    PanResponder,
    Animated,
    Easing,
    Dimensions,
    View,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Alert,
    TextInput,
    Text,
    TouchableOpacity,
    Image,
    Slider
} from 'react-native'
import ImageResource from '../../utils/ImageResource'
import LinearGradient from 'react-native-linear-gradient';
import Slider2 from '../common/Slider'
import  * as SizeController from '../../SizeController'
let topHeight = SizeController.getTopHeight();
let tabBarHeight = SizeController.getTabBarHeight();
let changeRatio = SizeController.getChangeRatio();
//var Slider = require('react-native-slider');
var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;
function tranform(startColor, endColor, size) {
    let startR = parseInt(startColor.replace("#", "").substring(0, 2), 16);
    let startG = parseInt(startColor.replace("#", "").substring(2, 4), 16);
    let startB = parseInt(startColor.replace("#", "").substring(4), 16);
    let endR = parseInt(endColor.replace("#", "").substring(0, 2), 16);
    let endG = parseInt(endColor.replace("#", "").substring(2, 4), 16);
    let endB = parseInt(endColor.replace("#", "").substring(4), 16);
    let diffL = 1 / (size + 1);
    let locationDiff = diffL;
    let locationArray = [];
    let colorArray = [];
    //colorArray.push(startColor);
    //locationArray.push(0);
    for (let i = 0; i < size; i++) {
        let R = startR + Math.ceil((endR - startR) / size * i);
        let G = startG + Math.ceil((endG - startG) / size * i);
        let B = startB + Math.ceil((endB - startB) / size * i);
        colorArray.push("rgb(" + R + "," + G + "," + B + ")");
        if (locationDiff.toFixed(2) >= 1) {
            locationArray.push(1);
        } else {
            locationArray.push(Number(locationDiff.toFixed(2)));
        }
        locationDiff += diffL;
    }
    colorArray.push(endColor);
    locationArray.push(1);

    let obj = {
        locations: locationArray,
        colors: colorArray
    }
    return obj;
}
let startColor1 = "#1da9fc";
let endColor1 = "#18fcc9";
let startColor2 = "#9ced44";
let endColor2 = "#f2d54b";
let startColor3 = "#ee3634";
let endColor3 = "#ffa516";
let linerObj1 = tranform(startColor1, endColor1, 10);
let locationArray1 = linerObj1.locations;
let colorArray1 = linerObj1.colors;
let linerObj2 = tranform(startColor2, endColor2, 10);
let locationArray2 = linerObj2.locations;
let colorArray2 = linerObj2.colors;
let linerObj3 = tranform(startColor3, endColor3, 10);
let locationArray3 = linerObj3.locations;
let colorArray3 = linerObj3.colors;

let TargetProgress = React.createClass({
    sliderValueChange(value){
        this.setState({sliderValue: value});
        this.props.sliderValueChange && this.props.sliderValueChange(value, this.props.sid);
    },
    onValueChange(value){
        //this.sliderValue = value
    },
    sliderValue: -1,
    startX: 0,//右滑
    distanceX: 0,
    showRightPanel: false,
    arrayDistane: [],
    isDidcanCancelContentTouches: false,
    isFirstMove: true,
    isMove: false,
    watcher: null,
    rateInputRef: null,
    titleInputRef: null,
    realRef: null,
    titleText: null,
    canSubmit: false,
    doCancel: false,
    widthTemp: 0,
    widthTemp2: 0,
    tempSliderValue: 0,
    _onPanResponderGrant: function (e: Object, gestureState: Object) {
        this.props.onOpen && this.props.onOpen(this.props.sectionID, this.props.rowID);
        this.startX = gestureState.x0;
        this.distanceX = 0;
        //this.isDidcanCancelContentTouches = false;
        this.isFirstMove = true;
        this.isMove = false;
        //if(!this.isDidcanCancelContentTouches){
        // this.props.canCancelContentTouches&&this.props.canCancelContentTouches(false);
        // this.isDidcanCancelContentTouches = true;
        // console.log("x0:"+gestureState.x0+"y0:"+gestureState.y0);
        //console.log("x:"+gestureState.moveX+"y:"+gestureState.moveY);
        //this.startX = e.nativeEvent.pageX;
        // this.props.canCancelContentTouches&&this.props.canCancelContentTouches(false);
        Animated.spring(this.state.rightPan, {toValue: {x: Math.min(0, 0), y: 0}}
        ).start();
    },
    _onPanResponderMove: function (e: Object, gestureState: Object) {
        console.log("Move--x:" + gestureState.moveX + "y:" + gestureState.moveY);
        /* let pageX = e.nativeEvent.pageX;
         this.distanceX = gestureState.dx
         let moveY = gestureState.dy;
         let moveX = gestureState.dx;
         let vx = gestureState.vx;
         let vy = gestureState.vy;
         let absMoveX = Math.abs(moveX);
         let absMovey = Math.abs(moveY);
         console.log("Move--dx:"+gestureState.dx+"dy:"+gestureState.dy);
         if(this.isFirstMove && absMoveX != absMovey){
         this.isMove =  absMoveX > absMovey ;
         this.isFirstMove=false;
         }*/
        console.log("Move--dx:" + gestureState.dx + "dy:" + gestureState.dy);
        let posX = gestureState.dx
        let posY = gestureState.dy
        this.distanceX = gestureState.dx
        let leftWidth = this.state.btnsLeftWidth
        let rightWidth = this.props.slideComponentWidth//this.state.btnsRightWidth
        // posX = gestureState.dx - rightWidth
        let moveX = Math.abs(posX) > Math.abs(posY)
        if (this.props.scroll) {
            if (moveX) this.props.scroll(false)//this.props.scroll(false)
            else this.props.scroll(true)//this.props.scroll(true)
        }
        if (moveX) {
            if (posX >= 0) {
                /*if(Math.abs(posX) > this.props.slideComponentWidth){
                 posX = this.props.slideComponentWidth;
                 }
                 Animated.spring(this.state.rightPan,{toValue:{x:Math.max(posX, 0),y:0}}
                 ).start();*/

            } else {
                if (Math.abs(posX) > this.props.slideComponentWidth) {
                    posX = -this.props.slideComponentWidth;
                }
                Animated.spring(this.state.rightPan, {toValue: {x: Math.min(posX, 0), y: 0}}
                ).start();
            }
        }
        //this.setState({ contentPos: Math.max(posX, 0) })
        /* if (this.props.scroll) {
         if (moveX) this.props.scroll(false)
         else this.props.scroll(true)
         }*/
        /* if(!this.isFirstMove ){
         //&& !this.isMove
         if(this.isMove){
         this.props.canCancelContentTouches&&this.props.canCancelContentTouches(false);
         this.isDidcanCancelContentTouches = true;
         }else{
         this.props.canCancelContentTouches&&this.props.canCancelContentTouches(true);
         this.isDidcanCancelContentTouches = false;
         }

         }*/
        /* console.log("isDidcanCancelContentTouches",this.isDidcanCancelContentTouches)
         this.arrayDistane.push(moveX);
         if(moveX <= -this.props.slideComponentWidth){
         moveX = -this.props.slideComponentWidth;
         }else if(moveX>=0){
         moveX  = 0;
         }
         if(this.isDidcanCancelContentTouches && this.isMove) {
         Animated.spring(this.state.rightPan,{toValue:{x:moveX,y:0}}
         ).start();
         }*/

    },
    _onPanResponderEnd(evt, gestureState){
        this.arrayDistane = []
        if (this.distanceX <= (-this.props.slideComponentWidth / 2)) {
            this.showRightPanel = true
            Animated.timing(this.state.rightPan, {
                toValue: {x: -this.props.slideComponentWidth, y: 0},
                duration: 0.25 * 1000,//7
                easing: Easing.inOut(Easing.ease),
            }).start();
            //Animated.spring(
            //  this.state.rightPan,{toValue:{x:-80,y:0}}
            //).start()
        } else {
            this.showRightPanel = false
            Animated.timing(this.state.rightPan, {
                toValue: {x: 0, y: 0},
                duration: 0.25 * 1000,//7
                easing: Easing.out(Easing.ease),
            }).start();

        }
        this.props.scroll && this.props.scroll(true)
        //this.props.canCancelContentTouches&&this.props.canCancelContentTouches(true);
    },
    _handleStartShouldSetPanResponder: function (e: Object, gestureState: Object): boolean {
        // Should we become active when the user presses down on the circle?
        return true;
    },

    _handleMoveShouldSetPanResponder: function (e: Object, gestureState: Object): boolean {
        // Should we become active when the user moves a touch over the circle?
        let moveY = gestureState.dy;
        let moveX = gestureState.dx;
        let isMove = Math.abs(moveX) > Math.abs(moveY);

        return true;//isMove && this.isDidcanCancelContentTouches;
    },
    getInitialState(){
        return {
            editable: false,
            sliderValue: -1,
            showRighrPanel: false,
            titleEditable: false,
            showRemind: false,
            titleText: null,
            useRateValue: false,
            shouldUpdate: true,
            rightPan: new Animated.ValueXY({x: 0, y: 0}),
        }
    },
    getDefaultProps(){
        return {
            showLeft: false,
            leftText: "",
            height: 110,
            style: {},
            showRight: false,
            disabled: false,
            title: "",
            slideComponentWidth: 80,
            slideComponent: null,
            rightTextColor: "#abb5c4",
            rightColor: "#f43f3c",
            isYiliu: false,
            canEditTitle: false,
        }
    },
    shouldComPonentUpdate(nextProps, nextState){
        return true;
    },
    componentWillMount(){
        this.watcher = PanResponder.create({
            //onStartShouldSetResponderCapture:(evt)=>false,
            // onMoveShouldSetResponderCapture:(evt)=>false,
            //onStartShouldSetPanResponder:(evt)=>true,
            //onMoveShouldSetResponder: (evt) => true,
            onStartShouldSetPanResponder: (event, gestureState) => true,
            onMoveShouldSetPanResponder: (event, gestureState) => !(gestureState.dx === 0 || gestureState.dy === 0),
            onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
            onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
            // onMoveShouldSetPanResponder: (event, gestureState) =>
            // Math.abs(gestureState.dx) > 10 &&
            //Math.abs(gestureState.dy) > 10,
            onPanResponderGrant: (evt, gestureState) => this._onPanResponderGrant(evt, gestureState),
            onPanResponderMove: (evt, gestureState) => this._onPanResponderMove(evt, gestureState),
            // onPanResponderMove:Animated.event([null,{dx:this.state.rightPan.x}]),//dy:this.state.rightPan.y,
            // onShouldBlockNativeResponder: (event, gestureState) => true,
            onPanResponderTerminate: (evt, gestureState) => this._onPanResponderEnd(evt, gestureState),
            onPanResponderRelease: (evt, gestureState) => this._onPanResponderEnd(evt, gestureState),
            onShouldBlockNativeResponder: (event, gestureState) => true,
        });
    },

    componentWillReceiveProps(nextProps){
        if (nextProps.close) {
            Animated.timing(this.state.rightPan, {
                toValue: {x: 0, y: 0},
                duration: 0.25 * 1000,//7
                easing: Easing.out(Easing.ease),
            }).start();
        }
    },
    toInitialStyle(){
        Animated.timing(this.state.rightPan, {
            toValue: {x: 0, y: 0},
            duration: 0.25 * 1000,//7
            easing: Easing.out(Easing.ease),
        }).start();
    },
    editPress(){//聚焦
        this.props.focusIndex && this.props.focusIndex(this.props.keyIndex);
        this.realRef = "rateInputRef";
        this.setState({editable: true});
        this.rateInputRef.focus();

    },

    progressCancel(){//失焦
        this.canSubmit = false;
        this.doCancel = true;
        if (this.realRef === "titleInputRef") {
            this.titleInputRef.blur();
        } else {
            this.rateInputRef.blur();
        }
        this.setState({editable: false, titleEditable: false});
    },
    progressEnsure(){
        this.canSubmit = true;
        this.doCancel = false;
        if (this.realRef === "titleInputRef") {
            this.titleInputRef.blur();
        } else {
            this.rateInputRef.blur();
        }

    },
    onTitleEndEditing(){

        let title = this.titleInputRef._lastNativeText;
        if (title !== this.props.title) {
            if (this.canSubmit) {
                this.setState({titleEditable: false, showRemind: false});
                this.props.changeTitleText && this.props.changeTitleText(title, this.props.sid);
            } else {
                if (this.doCancel) {
                    //this.titleInputRef._lastNativeText = this.props.title;
                    let titleText = this.props.title;
                    this.doCancel = false;
                    this.setState({showRemind: false, titleEditable: false, titleText: titleText});
                } else {
                    this.setState({showRemind: true, titleEditable: false});
                }
            }
        } else {
            this.setState({titleEditable: false, showRemind: false});
        }

    },
    progressCancelAndReset(){
        //this.rateInput.blur();
        //this.setState({sliderValue:this.props.sliderValue,editable:false});
    },
    onChangeText(value){   //更改文本
        this.sliderValue = value;
        this.setState({sliderValue: value, shouldUpdate: false});
    },
    onChangeTitleText(value){
        this.setState({titleText: value});
    },
    onFocusTitle(){ //聚焦返回key,调整输入框位置
        this.realRef = "titleInputRef";
        this.props.focusIndex && this.props.focusIndex(this.props.keyIndex);
    },
    onFocusRate(){
        this.realRef = "rateInputRef";
        this.setState({
            useReteValue : false
        })
       // this.state.useRateValue = false;
    },
    onEndEditing(){  //输入完成
        let numberValue = Number(this.state.sliderValue);
        if (numberValue == null) {
            numberValue = 0;
        }

        if (!isNaN(numberValue)) {
            if (this.state.sliderValue !== numberValue) {
                if (this.canSubmit) {
                    this.setState({sliderValue: numberValue, editable: false, useRateValue: false, shouldUpdate: true});
                    this.props.sliderValueChange && this.props.sliderValueChange(numberValue, this.props.sid);
                } else {
                    this.setState({sliderValue: this.props.sliderValue, editable: false, shouldUpdate: true});
                }
            }
        } else {
            this.setState({sliderValue: this.props.sliderValue, editable: false, shouldUpdate: true});
            this.props.showProgressError && this.props.showProgressError("请正确输入进度");
        }
    },
    button1OnPress(){
        // Animated.spring(this.state.rightPan,{toValue:{x:moveX,y:0}}
        //      ).start();
        //this.props.button1OnPress&&this.props.button1OnPress(this.props.sid);
    },
    onValueChange(value){
        this.setState({sliderValue: value});
    },
    onSlidingStart(){
        //this.props.canCancelContentTouches&&this.props.canCancelContentTouches(false);
    },
    editTitle(){//编辑标题
        this.realRef = "titleInputRef";
        this.toInitialStyle();
        this.setState({titleEditable: true});
        this.titleInputRef.focus();
    },
    render(){
        let titleText = this.state.titleText;
        if (titleText == null) {
            titleText = this.props.title;
        }
        let sliderValue = this.state.sliderValue;
        if (sliderValue == -1) {
            sliderValue = this.props.sliderValue;
        }
        if (sliderValue == null || sliderValue == "") {
            // sliderValue = 0;
        }
        //sliderValue = 100;

        let locationArray = locationArray1;
        let colorArray = colorArray1;
        let endColor = startColor1;
        let neesReverse = true;
        let progressColor = "rgb(29,169,252)"
        if (sliderValue < 70) {
            progressColor = "rgb(243,175,43)";
            locationArray = locationArray2;
            colorArray = colorArray2;
            endColor = startColor2;
            /*if(sliderValue > 0){
             let diff = Math.floor(sliderValue/7);
             console.log("diff",diff)
             endColor = colorArray[diff];
             console.log(endColor)
             }*/


        } else {
            /* let diff = Math.floor(sliderValue/10);
             endColor = colorArray[colorArray.length-diff];*/
        }
        if (this.state.shouldUpdate) {
            this.tempSliderValue = sliderValue > 100 ? 100 : sliderValue;
            this.widthTemp = (deviceWidth - 100 * changeRatio) * this.tempSliderValue * 0.01;
            this.widthTemp2 = (deviceWidth - 100 * changeRatio) * (1 - this.tempSliderValue * 0.01);
            if (this.widthTemp > (deviceWidth - 100 * changeRatio)) {
                this.widthTemp = deviceWidth - 100 * changeRatio;
                this.widthTemp2 = 0;
            }
        }
        if (this.props.isYiliu) {
            endColor = startColor3;
            locationArray = locationArray3;
            colorArray = colorArray3;
        }
        //alert(colorArray)

        // this.isDidcanCancelContentTouches = this.props.isDidcanCancelContentTouches;

        // alert(colorArray.length)
        //colorArray.reverse();
        // alert(colorArray)
        /*
         <View style={{flex:0,position:"absolute",top:-15,left:-1,width:deviceWidth,height:40,justifyContent:"center"}}>
         <LinearGradient start={{x:1, y: 1}} end={{x: 0, y:1}}   locations={locationArray} colors={colorArray} style={[{flex:0,borderRadius:8,height:12,width:Math.ceil((deviceWidth-40)*sliderValue/100+5)},(sliderValue==0||sliderValue>=90)?{width:Math.ceil((deviceWidth-40)*sliderValue/100)}:{}]}>
         </LinearGradient>
         <View style={[{position:"absolute",left:(deviceWidth-40)*sliderValue/100+5,flex:0,borderRadius:20,borderTopLeftRadius:0,borderBottomLeftRadius:0,borderTopRightRadius:8,borderBottomRightRadius:8,top:13,backgroundColor:"rgb(237,240,243)",height:12,width:(deviceWidth-30)*(1-sliderValue/100)},sliderValue==0?{borderRadius:8,left:4}:{}]}>
         </View>
         </View>
         <Slider minimumValue={0}
         style={{flex:1}}
         step={1}
         //disabled={}
         minimumValue={0}
         maximumValue={100}
         value={sliderValue}
         maximumValue={100}
         maximumTrackTintColor="rgba(0,0,0,0)"//{this.props.maximumTrackTintColor}
         minimumTrackTintColor="rgba(0,0,0,0)"//{this.props.minimumTrackTintColor}
         // minimumTrackImage={ImageResource["icon-reward@2x.png"]}
         onValueChange={this.onValueChange}
         onSlidingComplete={this.sliderValueChange}/>

         */
        return (

            <Animated.View {... this.props.slideComponent ? this.watcher.panHandlers : {} }
                style={[{flex:1,flexDirection:"row"},this.state.rightPan.getLayout()]}>
                <View style={[{flex:1,justifyContent:"center",width:deviceWidth},styles.container,this.props.style]}>
                    <View style={{flexDirection:"row",flex:0,/*backgroundColor:"red",*/height:50*changeRatio,}}>
                        {this.props.showLeft && <View
                            style={{backgroundColor:"rgb(243,175,43)",justifyContent:"center",height:20*changeRatio,padding:2*changeRatio,marginRight:10*changeRatio,}}><Text
                            style={{fontSize:12*changeRatio,color:"#ffffff"}}>{this.props.leftText}</Text></View>}
                        {!this.props.canEditTitle ?
                            <View style={{flex:0,height:50*changeRatio,justifyContent:"center"}}>
                                <Text numberOfLines={1} style={[styles.fontStyle]}>{this.props.title}
                                </Text>
                            </View>
                            :
                            <View
                                style={[this.state.titleEditable?{flex:0,borderRadius:0,height:50*changeRatio,marginBottom:0,width:deviceWidth-30*changeRatio,paddingLeft:8*changeRatio,justifyContent:"center",backgroundColor:"#ffffff",flexDirection:"row"}:{flex:0,flexDirection:"row",height:50*changeRatio,marginBottom:0,width:deviceWidth-30*changeRatio,justifyContent:"center",backgroundColor:"#ffffff"}]}>
                                <View style={{flex:0,justifyContent:"center",height:50*changeRatio}}><Text
                                    editable={false}
                                    style={[this.state.titleEditable?{flex:0,fontSize:15*changeRatio,marginTop:0,fontWeight:"400",color:"#000000"}:{flex:0,fontSize:15*changeRatio,color:"#000000",marginTop:0,fontWeight:"400"}]}>{this.props.titleCount}</Text></View>
                                <View style={{flex:1,justifyContent:"center",height:50*changeRatio}}>
                                    <TextInput value={titleText} onChangeText={this.onChangeTitleText}
                                               onEndEditing={this.onTitleEndEditing} editable={this.state.titleEditable}
                                               ref={(ref)=>this.titleInputRef=ref} maxLength={16}
                                               onFocus={this.onFocusTitle} numberOfLines={1} defaultValue={titleText}
                                               style={[styles.fontStyle,this.state.titleEditable?{color:"#000000",flex:1}:{color:"#000000",flex:1}]}>
                                    </TextInput>
                                </View>
                            </View>
                        }

                        { this.props.showRightText &&
                        <View style={{justifyContent:"center",height:50*changeRatio,position:"absolute",right:0}}><Text
                            style={[{fontSize:12*changeRatio,color:"#abb5c4"},{color:this.props.rightTextColor}]}>{this.props.rightText}</Text></View>}
                        { this.state.showRemind && !this.state.titleEditable &&
                        <View style={{justifyContent:"center",height:20*changeRatio,position:"absolute",right:0}}><Text
                            style={[{fontSize:12*changeRatio,color:"#abb5c4",},{color:"red"}]}>{"待提交"}</Text></View>}

                        { this.props.showRightImage && <View
                            style={{justifyContent:"center",width:44*changeRatio,height:44*changeRatio,borderRadius:22*changeRatio,top:0,position:"absolute",right:0}}><Image
                            style={{flex:1,width:44*changeRatio,height:44*changeRatio,borderRadius:22*changeRatio}}
                            source={ImageResource["icon-stamp@2x.png"]}></Image></View>}
                    </View>
                    { this.props.useInput && <View
                        style={[styles.viewCenter,{flexDirection:"row",/*backgroundColor:"yellow",*/flex:0,height:50*changeRatio,borderColor:"red",borderWidth:0}]}>
                        <View
                            style={{flex:0,width:(deviceWidth-30*changeRatio)*0.5,marginTop:0,height:50*changeRatio,justifyContent:"center"}}>

                            <TextInput
                                keyboardType={"numeric"}
                                value={""+sliderValue}
                                onFocus={this.onFocusRate}
                                onChangeText={this.onChangeText}
                                onEndEditing={this.onEndEditing}
                                ref={(ref)=>this.rateInputRef=ref}
                                editable={this.state.editable}
                                style={{color:"#1da9fc",textAlign:"right",flex:1,fontSize:20*changeRatio}}
                                defaultValue={""+sliderValue}
                                underlineColorAndroid={'transparent'}
                            >
                            </TextInput>
                        </View>
                        <Text style={[styles.rateStyle,{marginLeft:5*changeRatio}]}>{"%"}</Text>
                        <TouchableOpacity onPressIn={this.editPress}
                                          style={{zIndex:999,position:"absolute",top:-6*changeRatio,left:((deviceWidth-30*changeRatio)*0.5+30*changeRatio),height:60*changeRatio,width:50*changeRatio,flex:1,justifyContent:"center"}}>
                            <Image style={{flex:0,width:22*changeRatio,height:22*changeRatio}}
                                   source={ImageResource["pencil@2x.png"]}/>
                        </TouchableOpacity>
                    </View>
                    }

                    <View
                        style={{flex:0,width:deviceWidth-(30*changeRatio),flexDirection:"row",height:40*changeRatio,/*backgroundColor:"green"*/}}>
                        {!this.props.disabled ? <View style={{flex:1,justifyContent:"center"}}>

                                <Slider2 locations={locationArray}
                                         thumbStyle={{height:20*changeRatio,width:20*changeRatio,borderRadius:10*changeRatio,borderTopLeftRadius:10*changeRatio,borderBottomLeftRadius:10*changeRatio,backgroundColor:endColor}}
                                         trackStyle={{height:8*changeRatio,borderRadius:8*changeRatio}}
                                         step={1}
                                    //disabled={}
                                         minimumValue={0}
                                         maximumValue={100}
                                         value={this.tempSliderValue}
                                         minimumTrackTintColor="rgba(0,0,0,0)"
                                         colors={colorArray}
                                         onValueChange={this.onValueChange}
                                         onSlidingStart={this.onSlidingStart}
                                         onSlidingComplete={this.sliderValueChange}
                                />
                            </View>
                            :
                            <View
                                style={[{flexDirection:"row",flex:0,/*backgroundColor:"orange",*/width:deviceWidth-(100*changeRatio),height:40*changeRatio}]}>
                                <View style={{justifyContent:"center"}}>
                                    <LinearGradient start={{x:1, y: 1}} end={{x: 0, y:1}} locations={locationArray}
                                                    colors={colorArray}
                                                    style={[{width:this.widthTemp,marginLeft:0,height:8*changeRatio,borderRadius:8*changeRatio,backgroundColor:"rgba(0,0,0,0)"},this.widthTemp>0?{width:this.widthTemp+4*changeRatio}:{},sliderValue==100?{borderTopRightRadius:8*changeRatio,borderBottomRightRadius:8*changeRatio,width:this.widthTemp}:{}]}></LinearGradient>
                                </View>
                                <View style={{justifyContent:"center"}}>
                                    <View
                                        style={[{width:this.widthTemp2,height:8*changeRatio,borderTopRightRadius:8,marginLeft:-4*changeRatio,borderBottomRightRadius:8*changeRatio,backgroundColor:"rgb(237,240,243)"},sliderValue==0?{borderTopLeftRadius:8*changeRatio,borderBottomLeftRadius:8*changeRatio,marginLeft:0}:{},sliderValue==100?{marginLeft:0}:{}]}>
                                    </View>
                                </View>
                            </View>
                        }
                        {this.props.showRight &&
                        <View style={{flex:0,width:70*changeRatio,height:40*changeRatio,justifyContent:"center"}}>
                            <View style={{justifyContent:"center"}}>
                                <Text
                                    style={[{textAlign:"right",color:"#f43f3c",fontSize:18*changeRatio},{color:this.props.rightColor}]}>{"" + sliderValue + "%"}</Text>
                            </View>
                        </View>}
                    </View>
                </View>
                {this.props.slideComponent}
            </Animated.View>

        )
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 0,
        backgroundColor: '#ffffff',
        //borderRadius:8,
        padding: 0,
        paddingLeft: 15 * changeRatio,
        paddingRight: 15 * changeRatio,
        marginBottom: 10 * changeRatio,
        height: 140 * changeRatio
    },
    rateStyle: {
        color: "#1da9fc",
        fontSize: 20 * changeRatio,
        width: 20 * changeRatio,
    },
    fontStyle: {
        color: "#1e2c3c",
        fontSize: 15 * changeRatio,
        //lineHeight:30,
        // height:35,
        // alignSelf:"flex-start"
    },
    textInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: "#ffffff",
        borderWidth: 1,
        borderRadius: 20 * changeRatio,
        width: 60 * changeRatio,
        height: 45 * changeRatio

    },
    textInputFlex: {
        flex: 1,
        textAlign: 'center',
        fontSize: 13 * changeRatio
    },
    input: {
        flex: 1,
        //backgroundColor:'yellow'
    },
    leftTextView: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ffffff"

    },
    titleView: {
        flex: 1,
        margin: 10 * changeRatio,
        borderWidth: 1,
        borderColor: "#ffffff"
    },
    viewCenter: {
        alignItems: 'center',
        flex: 1,
        // marginBottom:15,
    },
    leftText: {
        textAlign: 'left',
        color: '#ffffff'
    },
    rightTextView: {
        alignItems: 'flex-end',
        flex: 1,
    },
    rightText: {
        textAlign: 'right',
        color: '#ffffff'
    },
    viewHr: {
        borderTopWidth: 1,
        borderTopColor: '#ffffff',
        marginTop: 10 * changeRatio,
        marginBottom: 10 * changeRatio
    },
    handleTouch: {
        borderWidth: 1,
        borderColor: '#ffffff',
        borderRadius: 8 * changeRatio,
        marginRight: 10 * changeRatio,
        padding: 5 * changeRatio,
        justifyContent: 'center',
    },
    handleView: {
        flex: 1,
        flexDirection: 'row',
    },
    handleText: {
        color: '#ffffff'
    }
});
export default TargetProgress
