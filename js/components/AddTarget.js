/**
 * 目标添加
 * Created by yuanzhou on 16/12.
 */
import React from 'react'
import {
    View,
    Keyboard,
    Text,
    KeyboardAvoidingView,
    PixelRatio,
    Alert,
    Image,
    ScrollView,
    TextInput,
    TouchableOpacity,
    StyleSheet
} from 'react-native'
import {getUserTarget, clientUserTargetManage} from '../actions'
import TopBar from './common/TopBar'
import ImageResource from '../utils/ImageResource'
import * as SizeController from '../SizeController'
let topHeight = SizeController.getTopHeight();
let changeRatio = SizeController.getChangeRatio();
let _scrollView = null;
let AddTarget = React.createClass({
	targetText: "",
	subscriptions: [],
	onChangeText(text, index){
		this.state.isFirstInit = false;
		let obj = this.state.editTargetsList[index];
		obj.content = text;
		obj.needAutoFocus = false;
	},
	deleteTarget(index){
		this.state.isFirstInit = false
		let obj = this.state.editTargetsList[index]
		if (obj.type == "old") {
			this.state.removeTargetsList.push(obj)
		}
		this.state.editTargetsList.splice(index, 1)
		this.setState({editTargetsList: this.state.editTargetsList})
	},
	AddTarget(){
		this.state.isFirstInit = false
		let length = this.state.editTargetsList.length
		if ( length + this.state.passTargets >= 5 && this.state.hadRemind == false) {
			this.state.hadRemind = true
			Alert.alert("提示", "温馨提示：您的本月目标总数已经达到5个了哟~",
                [{text: '确认'}]);
		}
		let obj = {type: "new", content: this.state.addTargetText, needAutoFocus: true}
		this.state.editTargetsList.push(obj)
		this.state.addTargetText = ""
		this.refs.addTargetInput.clear()
		this.setState({editTargetsList: this.state.editTargetsList})
		_scrollView.scrollTo({y: 0, animated: true})
	},
	addTargetOnChange(text){
		this.state.addTargetText = text
	},
	getInitialState: function () {
		return {
			editTargetsList: [],
			isFirstInit: true,
			removeTargetsList: [],
			hadRemind: false,
			passTargets: 0,
			keyboardSpace: 0,
			textInputIndex: 0,
			addTargetText: ""
		}
	},
    //保存操作
	ensureSubmit(){
		this.state.isFirstInit = false;
		let isExistEmptyTarget = false;
		let index = 0;
		if (this.state.editTargetsList.length > 0 || this.state.removeTargetsList.length > 0) {
			for (let i = 0; i < this.state.editTargetsList.length; i++) {
				let obj = this.state.editTargetsList[i];
				if (obj.content == "") {
					isExistEmptyTarget = true;
					index = i;
					break
				}
			}
			if (isExistEmptyTarget == false) {
				let removeKpiMTargetUniqueidList = [];
				for (let i = 0; i < this.state.removeTargetsList.length; i++) {
					let obj = this.state.removeTargetsList[i];
					removeKpiMTargetUniqueidList.push(obj.kpiMTargetUniqueid)
				}
				let PageData = this.props.pageModel.PageData;
				let postData = {
					token: PageData.token,
					userUniqueid: PageData.userUniqueid,
					orgUniqueid: PageData.orgUniqueid,
					removeKpiMTargetUniqueidList: removeKpiMTargetUniqueidList,
					editTargetsList: this.state.editTargetsList,
					type: "selfEditUserTarget"
				};

				let obj = {
					route: null,
					toBack: true,
					needInitUpdate: 0
				};
				clientUserTargetManage(this.props.dispatch, postData, obj);
			} else {
				let heightTemp = this.props.layoutStyle.height;
				let y = this.state.editTargetsList.length * (60 + 10);
				if (heightTemp < y + 65 + topHeight) {
					let size = (y + 65 + topHeight) / heightTemp;
					y = heightTemp * (size - 1) + 60 + topHeight;
					_scrollView.scrollTo({y: y, animated: true});
				}
				Alert.alert("提示", "目标不能为空",
                    [{text: '确认'}]);
			}
		} else {
			Alert.alert("提示", "没有任何需要提交的数据...",
                [{text: '确认'}]);
		}
	},
	_relativeKeyboardHeiHeight(keyboardFrame){

	},
	componentWillUnmount: function () {

		this.subscriptions.forEach((sub) => sub.remove());

	},
	componentDidMount: function () {
        // Keyboard events监听
		this.subscriptions = [
			Keyboard.addListener('keyboardWillShow', this.updateKeyboardSpace),
			Keyboard.addListener('keyboardWillHide', this.resetKeyboardSpace)];

		let PageData = this.props.pageModel.PageData;

		getUserTarget(this.props.dispatch, {
			token: PageData.token,
			userUniqueid: PageData.userUniqueid,
			orgUniqueid: PageData.orgUniqueid
		});

	},
    // Keyboard actions
	updateKeyboardSpace: function (frames) {
		const keyboardSpace = frames.endCoordinates.height;//获取键盘高度

		let heightTemp = this.props.layoutStyle.height;

		let y = this.state.textInputIndex * (60 + 10) * changeRatio + 70 * changeRatio + keyboardSpace

		if (heightTemp < y + 65 * changeRatio + topHeight) {
			let size = (y + 65 * changeRatio + topHeight) / heightTemp;
			y = heightTemp * (size - 1) + 65 * changeRatio;
			_scrollView.scrollTo({y: y, animated: true});
		}
	},

	resetKeyboardSpace: function () {

		_scrollView.scrollTo({y: 0, animated: true})
	},
	_textInputOnFocus(index){
        // alert(index)
		this.state.textInputIndex = index
	},
	toback(){
		this.props.navigator.pop()
	},
	render(){
		const PageData = this.props.pageModel.PageData;
		let userTargetsNotSubmitOrPassList = [];
		if (this.state.isFirstInit) {
			this.state.editTargetsList = [];

			if (PageData.newTargetsNeedSubmit && PageData.newTargetsNeedSubmit.length > 0) {
				for (let i = 0; i < PageData.newTargetsNeedSubmit.length; i++) {
					let obj = PageData.newTargetsNeedSubmit[i];
					obj.type = "old";
					obj.needAutoFocus = false;
					this.state.editTargetsList.push(obj);
				}
			}
			if (PageData.targetsNotPass && PageData.targetsNotPass.length > 0) {
				for (let i = 0; i < PageData.targetsNotPass.length; i++) {
					let obj = PageData.targetsNotPass[i];
					obj.type = "old";
					obj.needAutoFocus = false;
					this.state.editTargetsList.push(obj);
				}
			}

		}

		let that = this
		let size = this.state.editTargetsList.length;
		for (let i = size - 1; i >= 0; i--) {
			let index = size - i - 1
			let obj = this.state.editTargetsList[i];
			userTargetsNotSubmitOrPassList[index] = <View key={i}
                                                          style={{flexDirection: "row",alignItems: "center",justifyContent: "center",backgroundColor: "#ffffff",height:60*changeRatio,padding:10*changeRatio,borderRadius: 8 * changeRatio,flex: 1,marginTop: 10 * changeRatio}}>
               <View style={{flex:0,justifyContent:"center"}}></View>
                <TextInput returnKeyType={'done'}
                           onFocus={()=>that._textInputOnFocus(index)}
                           underlineColorAndroid={'transparent'}
                           maxLength={32}
                          // multiline = {true}
                           blurOnSubmit={true}
                           autoFocus={false}
                           defaultValue={obj.content}
                           placeholder={'目标限制16个字符'}
                           style={styles.textInputFlex}
                           ref={"input" + i}
                           onChangeText={(text)=>that.onChangeText(text,i)}
                />

                <TouchableOpacity onPress={()=>that.deleteTarget(i)} style={{alignItems: "flex-end"}}>
                    <Image
                        style={{width: 20 * changeRatio,height: 20 * changeRatio}}
                        source={require('../resource/images/kpi/delete@2x.png')}>
                    </Image>
                </TouchableOpacity>
            </View>
		}

		return (
            <View style={styles.container}>
                <TopBar toback={this.toback}
                        layoutStyle={this.props.layoutStyle}
                        topBarText="创建与编辑"
                        topBarTextRight=""
                        showRight={false}
                        showLeft={true}
                />
                <View style={[this.props.layoutStyle,styles.btnView]}>
                    <TouchableOpacity style={styles.btnAbsolute} onPress={this.ensureSubmit}>
                        <Text style={styles.buttonText}>{PageData.isMostLevel === 1 ? '保存' : '提交审批' }</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.rowView1}>
                    <View style={styles.rowView2}>
                        <Image
                            style={{width: 22 * changeRatio,height: 22 * changeRatio,marginLeft: 10 * changeRatio}}
                            source={ImageResource["add.png"]}>
                        </Image>
                        <TextInput keyboardAppearance={"default"}
                                   enablesReturnKeyAutomatically={true}
                                   ref="addTargetInput"
                                   returnKeyType={'done'}
                                   onSubmitEditing={this.AddTarget}
                                   onChangeText={this.addTargetOnChange}
                                   placeholderTextColor="#ffffff"
                                   placeholder="添加目标..."
                                   maxLength={32}

                                   style={styles.addTargetTextInput}
                        />
                    </View>
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={true}
                    KeyboardShouldPersisTaps={true}
                    keyboardDismissMode='interactive'
                    contentInset={{bottom: this.state.keyboardSpace}}
                    ref={(scrollView)=>{_scrollView = scrollView}}
                    contentContainerStyle={styles.contentContainer}
                >
                    {userTargetsNotSubmitOrPassList}
                </ScrollView>
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
		paddingBottom: 125 * changeRatio,
		padding: 10 * changeRatio,
		paddingTop: 0
	},
	textInputFlex: {
		flex: 1,
        //height:40,
        //backgroundColor:"yellow",
        //width:300,
        //padding:10
		fontSize: 14 * changeRatio,
		color: "rgb(40,45,49)"
	},
	rowView1: {
		marginTop: topHeight + 5 * changeRatio,
		backgroundColor: "#ffffff"
	},
	rowView2: {
		margin: 10 * changeRatio,
		flexDirection: "row",
		alignItems: "center",
        //padding:10,
		paddingLeft: 10 * changeRatio,
		borderRadius: 8 * changeRatio,
		backgroundColor: "rgb(240,84,85)",
        //borderColor:"rgb(228,228,228)",
        //borderTopWidth:1,
        // borderBottomWidth:1,
        // height:84,
		height: 60 * changeRatio
	},
	rowView: {
		flexDirection: "row",
		height: 40 * changeRatio,
		padding: 10 * changeRatio,
		paddingLeft: 15 * changeRatio
	},
	describeText: {
		color: "rgb(198,201,206)",
		fontSize: 15 * changeRatio
	},
	circleDescribeText: {
		color: "#ffffff",
		fontSize: 15 * changeRatio
	},
	circleView: {
        // backgroundColor:"rgb(117,201,250)",
		width: 20 * changeRatio,
		height: 20 * changeRatio,
        // borderWidth:1,
		borderRadius: 10 * changeRatio,
		zIndex: 500
        // borderColor:"rgb(117,201,250)",
        // alignItems:"center",
        // justifyContent:"center"
	},
	image: {
		width: 30 * changeRatio,
		height: 30 * changeRatio
	},
	textView: {
		flex: 1,
		flexDirection: "row"
	},
	targetText: {
		fontSize: 20 * changeRatio,
		marginLeft: 15 * changeRatio
	},
	textInput: {
		flex: 1,
        // justifyContent :'center',
		paddingLeft: 10 * changeRatio,
		paddingRight: 10 * changeRatio
	},
	viewCenter: {
		alignItems: 'center',
		marginBottom: 10 * changeRatio
	},
	button: {
		backgroundColor: '#ffffff',
		borderRadius: 8 * changeRatio,
		borderWidth: 1,
		borderColor: '#ffffff',
        //height: 84,
		height: 42 * changeRatio,
		margin: 10 * changeRatio,
		alignItems: 'center',
		justifyContent: 'center'
	},
	buttonText: {
		color: 'rgb(255,255,255)',
		fontSize: 15 * changeRatio
        //fontWeight:"400"
	},
	btnView: {
		flex: 1,
        //height:70,
		flexDirection: 'row',
		backgroundColor: '#ffffff',
		position: 'absolute',
		bottom: 0,
		left: 0,
		paddingLeft: 5 * changeRatio,
		paddingRight: 5 * changeRatio,
        //width:500,
		height: 60 * changeRatio,
		zIndex: 500
	},
	btnAbsolute: {
		flex: 1,
		borderRadius: 8 * changeRatio,
        // borderColor:'rgb(29,169,252)',
		backgroundColor: "rgb(29,169,252)",
        // borderWidth:1,
        //padding:10,
		height: 40 * changeRatio,
		margin: 10 * changeRatio,
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 500,
        //height:70,
		marginRight: 5 * changeRatio,
		marginLeft: 5 * changeRatio
	},
	addTargetTextInput: {
		flex: 1,
		marginLeft: -40 * changeRatio,
		paddingLeft: 60 * changeRatio,
		color: "rgb(255,255,255)",
		fontSize: 16 * changeRatio,
		fontWeight: "600"
	}
});

export default AddTarget
