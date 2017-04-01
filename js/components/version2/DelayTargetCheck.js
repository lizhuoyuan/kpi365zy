/**
 * 延期目标审核
 * Created by yuanzhou on 17/02.
 */
import React,{Component} from 'react'
import {InteractionManager,Dimensions,ActivityIndicator,ListView,RefreshControl,View,Text,Image,ScrollView,TouchableOpacity,StyleSheet} from 'react-native'
import TopBar from '../common/TopBar'
import ImageResource from '../../utils/ImageResource'
import {tabManage,getUserTarget,clientUserTargetDelayManage,updatePage} from '../../actions'
import Tab_First from '../Tab_First'
import moment from 'moment'
import  * as SizeController from '../../SizeController'
let topHeight = SizeController.getTopHeight();
let tabBarHeight = SizeController.getTabBarHeight();
let changeRatio = SizeController.getChangeRatio();
const imageViewBackgroundColor = "rgb(228,236,240)";
var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;
function getFixNumberLength(str,ele){
	let count = 0;
	pos = str.indexOf(ele);
	while(pos != -1){
		count ++;
		pos = str.indexOf(ele,pos + 1);
	}
	return count;
}

class RowItem extends Component{
	constructor(props){
		super(props);
	}
	static defaultProps={
		rowData:{}
	}
	checkNotPass(){
		let {dispatch,rowData} =  this.props;
		let PageData = this.props.pageModel.PageData
		let postData = {
          token:PageData.token,
          userUniqueid:rowData.userUniqueid,
          orgUniqueid:rowData.orgUniqueid,
          kpiMTargetUniqueid:rowData.kpiMTargetUniqueid,
          kpiMTDelayUniqueid:rowData.kpiMTDelayUniqueid,
   		  x_token:PageData.token,
          type:"chargeEnsureNotPassCloseDelayTarget"
        }
		clientUserTargetDelayManage(dispatch,postData,{},false);
	}
	checkPass(){
		let {dispatch,rowData} =  this.props;
		let PageData = this.props.pageModel.PageData
		let postData = {
          token:PageData.token,
          userUniqueid:rowData.userUniqueid,
          orgUniqueid:rowData.orgUniqueid,
          kpiMTargetUniqueid:rowData.kpiMTargetUniqueid,
          kpiMTDelayUniqueid:rowData.kpiMTDelayUniqueid,
   		  x_token:PageData.token,
          type:"chargeEnsureCloseDelayTarget"
        }
		clientUserTargetDelayManage(dispatch,postData,{},false);
	}
	render(){
		let rowData = this.props.rowData;
		let targets = [];
		let needCheckTargets = rowData.needCheckTargets;
		let times = "";
		let kpiMTargetUniqueids = [];
		let avatar = null;
		let userName = "";
		let createtime = "";
	    if(rowData !== undefined && rowData !== null ){
	      userName = rowData.name;
	      createtime = rowData.createTime;
          if(rowData.avatar && rowData.avatar.indexOf("http") !== -1){
            avatar = {uri:rowData.avatar}
          }else{
          	if(rowData.sex == "男"){
              avatar = ImageResource["header-boy@2x.png"];
            }else if(rowData.sex == "女"){
              avatar = ImageResource["header-girl@2x.png"];
            }
          }
	    }
	    if(createtime !== ""){
	    	times = moment(createtime).format("YYYY年MM月");
	    	createtime = moment(createtime).format("MM月DD日 HH:mm");	
	    }
		return(
			<View style={{backgroundColor:"#ffffff",marginBottom:10}}>
				<View style={{marginTop:15*changeRatio,paddingLeft:15*changeRatio,flex:0,height:34*changeRatio,width:deviceWidth,flexDirection:"row"}}>
					<View style={{flex:0,width:34*changeRatio,height:34*changeRatio,borderRadius:17*changeRatio,backgroundColor:imageViewBackgroundColor}}>
						<Image source={avatar} style={{width:34*changeRatio,height:34*changeRatio,borderRadius:17*changeRatio}}/>
					</View>
					<View style={{marginLeft:12*changeRatio,justifyContent:"center"}}>
						<Text style={{fontSize:16*changeRatio,color:"#838f9f"}}>{userName}</Text>
					</View>
					<View style={{position:"absolute",right:15*changeRatio,height:34*changeRatio,justifyContent:"center"}}>
						<Text style={{fontSize:12*changeRatio,color:"#c5cdd7"}}>{createtime}</Text>
					</View>	
				</View>
				<View style={{marginTop:15*changeRatio,paddingLeft:61*changeRatio,width:deviceWidth,paddingRight:15*changeRatio}}>
					<Text style={{fontSize:14*changeRatio,color:"#2b3d54"}}>{times}延期目标已完成，申请关闭：</Text>
					<View style={{flex:0,borderRadius:8*changeRatio,marginTop:15*changeRatio,paddingLeft:5*changeRatio,height:44*changeRatio,justifyContent:"center",width:deviceWidth-(76*changeRatio),backgroundColor:imageViewBackgroundColor}}>
						<Text style={{fontSize:14*changeRatio,color:"#1e2c3c"}}>{rowData.content}</Text>
						<View style={{width:30*changeRatio,height:44*changeRatio,top:0,right:5*changeRatio,position:"absolute",justifyContent:"center"}}>
						<Image style={{width:30*changeRatio,height:30*changeRatio,borderRadius:15*changeRatio}} source={ImageResource["icon-stamp@2x.png"]}></Image>
						</View>
					</View>
				</View>
				<View style={{flex:0,paddingLeft:61*changeRatio,marginTop:20*changeRatio,marginBottom:20*changeRatio,height:35*changeRatio,width:deviceWidth,flexDirection:"row"}}>
					<TouchableOpacity onPress={()=>this.checkNotPass()} style={{borderRadius:17.5*changeRatio,width:105*changeRatio,height:35*changeRatio,backgroundColor:"rgb(29,169,252)",alignItems:"center",justifyContent:"center"}}>
						<Text style={{fontSize:16*changeRatio,color:"#ffffff"}}>驳回</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={()=>this.checkPass()} style={{marginLeft:50*changeRatio,borderRadius:17.5*changeRatio,width:105*changeRatio,height:35*changeRatio,backgroundColor:"rgb(29,169,252)",alignItems:"center",justifyContent:"center"}}>
						<Text style={{fontSize:16*changeRatio,color:"#ffffff"}}>关闭</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}
class DelayTargetCheck extends Component{
	constructor(props){
		super(props);
		let ds = new ListView.DataSource({rowHasChanged: (row1, row2) => true});
		this.state={
			dataSource:ds.cloneWithRows([]),
			isRefreshing:true,
			isAdding:false,
			isEnding:false,
		}
		this.toback = this.toback.bind(this);
		this._renderRow = this._renderRow.bind(this);
		this._renderFooter = this._renderFooter.bind(this);
		this.onEndReached = this.onEndReached.bind(this);
		this._onScroll = this._onScroll.bind(this);
		this._onRefresh = this._onRefresh.bind(this);
	}
	componentDidMount(){
		let PageData = this.props.pageModel.PageData
		PageData.userLowerLevelNeedCheckMonthTarget = []
		let postData = {
        token:PageData.token,
        userUniqueid:PageData.userUniqueid,
        orgUniqueid:PageData.orgUniqueid,
        type:"getUserLowerLevelNeedCheckDelayTarget"
      }  
        InteractionManager.runAfterInteractions(()=>{
         getUserTarget (this.props.dispatch,postData,{},true);
      })
  
    }
     componentWillReceiveProps(nextProps){
	    let isRefreshing = true;
	    let preFetching = this.props.pageModel.PageState.fetching;
	    let nextFetching = nextProps.pageModel.PageState.fetching;
	    let PageData = nextProps.pageModel.PageData;
	    if(nextFetching === false){
	       if(PageData.userLowerLevelNeedCheckDelayTarget !== undefined && PageData.userLowerLevelNeedCheckDelayTarget !== null){
	       	 this._updateDataSourceInit(PageData.userLowerLevelNeedCheckDelayTarget,false);
	       }
	    }else{
	       if(preFetching !== nextFetching){
	      	if(PageData.userLowerLevelNeedCheckDelayTarget !== undefined && PageData.userLowerLevelNeedCheckDelayTarget !== null){
		         this._updateDataSourceInit(PageData.userLowerLevelNeedCheckDelayTarget,true);
		    }else{
		    	this.setState({isRefreshing:true});
		    }
		   }
	    }
	  }
	  _updateDataSourceInit(data,isRefreshing) {
	    this.setState({
	      dataSource: this.state.dataSource.cloneWithRows(data),
	       isRefreshing:isRefreshing
	    });
  }
    _renderRow(rowData:object,sectionID:number,rowID:number,hignlightRow:(sectionID:number,rowID:number)=>void){	
		return (<RowItem rowData={rowData} rowID={rowID} {...this.props}/>)
	}
	//渲染底部样式
	_renderFooter(){
		if(this.state.isEnding){
			if(this.state.dataSource.length <= 0){
				return (
					<View style={{alignItems:"center",flexDirection:"row",justifyContent:"center",height:30,flex:1}}>
						<Text style={{marginLeft:10,fontSize:14}}>没有更多数据了...</Text>
					</View>
					)
			}
		}else{
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
		}
	}
	//刷新数据
	_onRefresh(){
		this.setState({isRefreshing:true})
		let PageData = this.props.pageModel.PageData
		let postData = {
        token:PageData.token,
        userUniqueid:PageData.userUniqueid,
        orgUniqueid:PageData.orgUniqueid,
        type:"getUserLowerLevelNeedCheckDelayTarget"
      }  
    	getUserTarget (this.props.dispatch,postData,{},true);
	}
	//加载数据
	_onAdding(){
		this.setState({isAdding:true,isEnding:true})
	}
	//进行滑动到底部的操作
	onEndReached(){
		if(this.state.isAdding == false && this.state.isEnding == false){
			this._onAdding()
		}
	}
	_onScroll(){

	}
	/**
	* 获取listview 数据源
	*/
	_getDataSource(){
		var ds = new ListView.DataSource({rowHasChanged:(r1,r2)=>r1 !== r2});
		let PageData = this.props.pageModel.PageData
		if(PageData.isRefreshing !== undefined && PageData.isRefreshing != null){
	      this.state.isRefreshing = PageData.isRefreshing
	    }
	    if(PageData.userLowerLevelNeedCheckDelayTarget !== undefined && PageData.userLowerLevelNeedCheckDelayTarget !== null){
	      this.state.dataSource = PageData.userLowerLevelNeedCheckDelayTarget
	    }
		return ds.cloneWithRows(this.state.dataSource)
	}
	//返回 
	toback(){
		let obj = {
        route:null,
        toBack:true,
        needInitUpdate:0,
      }
      updatePage(this.props.dispatch,obj);
	}
	render(){
		return(
			<View style={styles.container}>
				<TopBar 
			        toback={this.toback} 
			        layoutStyle={this.props.layoutStyle} 
			        showRightImage={false}
			        topBarText="关闭延期目标" 
			        showRight={false} 
			        showLeft={true}
		        />
		        <View style={{marginTop:topHeight}}></View>
		       <ListView
					dataSource={this.state.dataSource}
					renderRow={this._renderRow}
					initialListSize={5}
					pageSize={6}
					enableEmptySections={true}
					onEndReached={this.onEndReached}
					onEndReachedThreshold={5}
					refreshControl={
						 <RefreshControl
			        	  refreshing={this.state.isRefreshing}
			              onRefresh={this._onRefresh}
			              tintColor="rgb(0,171,243)"
			              colors={['rgb(0,171,243)']}
			              progressBackgroundColor="#ffffff"
			            />
					}
					onScroll={this._onScroll}		
					/>
				
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container:{
		flex:1,
		backgroundColor:"rgb(248,248,248)",
	}
});

export default DelayTargetCheck;