/**
 * 二维码显示页
 * Created by yuanzhou on 17/01.
 */
import React from 'react'
import {View,StyleSheet,Text} from 'react-native'
import TopBar from './common/TopBar'
const QrCodeShow = React.createClass({
	toback(){
		this.props.navigator.pop();
	},
	render(){
		let {pageModel} = this.props;
			let PageData = pageModel.PageData;
		return (
			
			<View style={styles.container}>
				 <TopBar toback={this.toback} 
				 layoutStyle={this.props.layoutStyle} 
				 topBarText={"提示"} 
				 topBarTextBottomShow={false} 
				 topBarTextRight="" 
				 showRight={false} 
				 showLeft={true}
				 />
				 <View style={{marginTop:90,flex:0,alignItems:"center",justifyContent:"center"}}>
				 	<Text>扫描到以下内容</Text>
				 </View>
				 <View style={{marginTop:10,borderWidth:1,borderColor:"red",height:100,flex:0,alignItems:"center",justifyContent:"center",padding:10}}>
					 <Text selectable={true} style={{fontSize:16}}>
					 {PageData.qrResult}
					 </Text>
				 </View>
				 <View style={{marginTop:10,flex:0,alignItems:"center",justifyContent:"center"}}>
				 <Text>扫描所得内容并非本程序提供，请谨慎使用</Text>
				  <Text>如需使用，可通过复制操作获取内容</Text>
				  </View>
			</View>
		)
	}
});
const styles = StyleSheet.create({
	container:{
		flex:1,
		padding:10,
		backgroundColor:"rgb(248,248,248)"
	}
});
export default QrCodeShow