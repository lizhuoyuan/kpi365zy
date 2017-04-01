/**
 * 	目标列表测试
 *  create by yuanzhou 2017/03/07
 */
import React,{Component} from 'react'
import {
	StyleSheet,
	Text,
	ScrollView,
	View,
	Image,
	Dimensions,
	TouchableOpacity
} from 'react-native'
import {
	fetch,
	create,
	recall
} from '../actions'
import moment from 'moment'
import ImageResource from '../utils/ImageResource'
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
class TargetItem extends Component{
	focus(){
		let {id, focusKey, targetUniqueid } = this.props;
		let postData = {
			type:"target_focus",
			content:{},
			notice:[],
			parent:id,
			view:[],
			custom:{
				target:targetUniqueid
			}
		};
		this.props.dispatch(create(postData));
	}
	unFocus(){
		let {id, focusKey, targetUniqueid } = this.props;
		let postData = {
			type:"target_focus",
			id:focusKey,
			root:id,
		}
		this.props.dispatch(recall(postData));
	}
	render(){
		let { data, id, isFocus, focusKey, targetUniqueid } = this.props;
		let { content , text } = data;
		let realText = "";
		realText = content;
		if(!content){
			realText = text;
		}
		return(
			<View style={{flex:1,padding:10,marginBottom:10,flexDirection:"row",backgroundColor:"rgb(248,248,248)"}}>
				<Text>{realText}</Text>
				{!isFocus ? <TouchableOpacity onPress={()=>this.focus()} style={{position:"absolute",right:10,top:0,backgroundColor:"rgb(29,169,252)",alignItems:"center",justifyContent:"center"}}>
								<Text style={{color:"#ffffff"}}>关注</Text>
							</TouchableOpacity>
				:
							<TouchableOpacity onPress={()=>this.unFocus()} style={{position:"absolute",right:10,top:0,backgroundColor:"rgb(29,169,252)",alignItems:"center",justifyContent:"center"}}>
								<Text style={{color:"#ffffff"}}>取消关注</Text>
							</TouchableOpacity>
				}
			</View>
		)
	}
}
class RowItem extends Component{
	constructor(props){
		super(props);
		this.state = {

		};
	}

	render(){
		let { userUniqueid, rowData } = this.props;
		let { content, user , date, id, refs } = rowData;
		let items = [];
		let { name, header, sex } = user;
		let { target_focus } = refs;
		let times = moment(date).format("YYYY-MM-DD");
		let avatar = null;
        if(header && header.indexOf("http") !== -1){
            avatar = {uri:header}
        }else{
          	if(sex === 0){
              avatar = ImageResource["header-boy@2x.png"];
            }else{
              avatar = ImageResource["header-girl@2x.png"];
            }
        }
		if( content ){
			let keyIndex = 0;
			for(let key in content){
				keyIndex ++ ;
				if ( content.hasOwnProperty(key) ){
					let item = content[key];
					let isFocus = false;
					let focusKey = "";
  					if(target_focus){
  						for(let i = 0; i < target_focus.length; i++){
  							let obj = target_focus[i];
  							for(let key2 in obj){
  								if(obj.hasOwnProperty(key2) ){
  									if( key === obj[key2] ){
  										isFocus = true;
  										focusKey = key2;
  										break;
  									}
  								}
  							}
  							if(isFocus){
  								break;
  							}
  						}
  					}
					let ItemView  = <TargetItem targetUniqueid={key} dispatch={this.props.dispatch} isFocus={isFocus} id={id} focusKey={focusKey} userUniqueid={userUniqueid} key={keyIndex} data={item}/>
					items.push(ItemView);
				}
			}
		}
		return (
			<View style={{backgroundColor:"#ffffff",marginBottom:10}}>
				<View style={{marginTop:15,paddingLeft:15,flex:0,height:34,width:deviceWidth,flexDirection:"row"}}>
					<View style={{flex:0,width:34,height:34,borderRadius:17,backgroundColor:"rgb(248,248,248)"}}>
						<Image source={avatar} style={{width:34,height:34,borderRadius:17}}/>
					</View>
					<View style={{marginLeft:12,justifyContent:"center"}}>
						<Text style={{fontSize:16,color:"#838f9f"}}>{name}</Text>
					</View>
					<View style={{position:"absolute",right:15,height:34,justifyContent:"center"}}>
						<Text style={{fontSize:12,color:"#c5cdd7"}}>{times}</Text>
					</View>	
				</View>
				<View style={{marginTop:9,paddingLeft:61,width:deviceWidth,paddingRight:15}}>
					{items}
				</View>
				
			</View>
		)
	}
}
class TargetTest extends Component{
	constructor(props){
		super(props);
		this.state = {

		};
	}

	componentDidMount(){
		this.props.dispatch(fetch("init"));
	}

	render(){
		let { PageData } = this.props.pageModel;
		let { items, userUniqueid } = PageData;

		let targets = [];
		if(items){
			let that = this;
			items.forEach((obj,index)=>{
				if(obj.type === "target"){
					targets.push(<RowItem dispatch={that.props.dispatch} userUniqueid={userUniqueid} key={index} rowData={obj} />)
				}
			});
		}
		
		return(
			
			<ScrollView style={styles.container}>
					{targets}	
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});
export default TargetTest;