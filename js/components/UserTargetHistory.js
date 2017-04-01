/**
 * 目标历史
 * Created by yuanzhou on 16/11.
 */
import React,{Component} from "react"
import {View,Image,PanResponder,Animated,RefreshControl,StyleSheet,ActivityIndicator,ListView,TouchableOpacity,Text} from 'react-native'
import CommonStyles from '../styles'
import TopBar from './common/TopBar'
import Tab_First from './Tab_First'
import {tabManage,getUserYearTarget} from '../actions'
import ImageResource from '../utils/ImageResource'
import  * as SizeController from '../SizeController'
let topHeight = SizeController.getTopHeight();
let tabBarHeight = SizeController.getTabBarHeight();
let changeRatio = SizeController.getChangeRatio();
class RowItemContainer extends Component{
	constructor(props){
		super(props);
		this.state = {
			isFirstInit:false,
			showDetail:false,
		}
		this.showDetail = this.showDetail.bind(this);
	}
	showDetail(){
		this.setState({showDetail:!this.state.showDetail});
	}
	render(){

			let {rowID,rowData} = this.props;
			let PageData = this.props.pageModel.PageData;

			if(rowID == 0 && !this.state.isFirstInit){
				this.state.showDetail = true;
				this.state.isFirstInit = true;
			}
			let monthTargets = [];
			let month = rowData.month
			if(month !== undefined && month !== null){
				if(month < 10){
					month = "0" + month
				}
			}
			let superiorWidth = this.props.layoutStyle.width*0.3*rowData.superiorAdjustProgressTotal*0.01;
			let selfWidth = this.props.layoutStyle.width*0.3*rowData.selfProgressTotal*0.01;
			if(superiorWidth > this.props.layoutStyle.width*0.3){
				superiorWidth = this.props.layoutStyle.width*0.3;
			}
			if(selfWidth > this.props.layoutStyle.width*0.3){
				selfWidth = this.props.layoutStyle.width*0.3;
			}
			if(rowData.monthTargets !==undefined && rowData.monthTargets !== null){
				let that = this;
				monthTargets = rowData.monthTargets.map((obj,index)=>{
					return <RowItem  key={index} {...that.props} rowID={rowID} rowData={obj}/>
				})
			}
			let totalRate = 0;
			if(PageData.isMostLevel !== undefined && PageData.isMostLevel === 1){
				totalRate = parseFloat(rowData.selfProgressTotal).toFixed(1)
			}else{
				totalRate = parseFloat(rowData.superiorAdjustProgressTotal*0.7 + rowData.selfProgressTotal*0.3).toFixed(1)
			}
		return(
			<View>
			 <TouchableOpacity onPress={this.showDetail} style={[{backgroundColor:"rgb(236,238,242)",flex:0,borderColor:"rgb(229,229,229)",padding:10*changeRatio,borderTopWidth:1,height:65*changeRatio}]}>
						<View style={{flexDirection:"row",flex:0,width:this.props.layoutStyle.width-20*changeRatio,height:20*changeRatio,borderColor:"red",borderWidth:0}}>
						    <View style={{alignItems:"flex-start",flex:1}}><Text style={{textAlign:"left",fontSize:13*changeRatio,color:"rgb(30,44,60)"}}>{rowData.year}年</Text></View>
							<View style={{alignItems:"flex-end",flex:1}}><Text style={{textAlign:"right",fontSize:13*changeRatio,color:"rgb(30,44,60)"}}>总功勋加成 {rowData.addScore>=0?"+"+rowData.addScore:rowData.addScore}</Text>
							</View>
						</View>
						<View style={{flexDirection:"row",flex:1,borderWidth:0,borderColor:"red",flex:1}}>
							<View style={{flexDirection:"row",alignItems:"flex-start",flex:1}}>
								<Text style={{textAlign:"left",fontSize:20*changeRatio,color:"rgb(30,44,60)"}}>{month}</Text>
								<Text style={{marginTop:7*changeRatio,fontSize:13*changeRatio,color:"rgb(30,44,60)"}}>月</Text>
							</View>
							<View style={{alignItems:"flex-end",flex:1}}>
								<View style={{flex:1,flexDirection:"row",}}>
									<Text style={{marginTop:7*changeRatio,fontSize:13*changeRatio,color:"rgb(30,44,60)"}}>总进度</Text>
									<Text style={{fontSize:20*changeRatio,color:"rgb(30,44,60)"}}>{"  "+totalRate}%</Text>
								</View>
							</View>
						</View>
						
				</TouchableOpacity>
				{this.state.showDetail && monthTargets}
			</View>
				
		)
	}
}
var RowItem = React.createClass({
  startX:0,//右滑
  rowID:-1,//行
  distanceX:0,
  showRightPanel:false,
  arrayDistane:[],
  //showDirection:
  componentWillMount:function(){
    
  },
  _onPanResponderGrant:function(e:Object,gestureState:Object,rowID){
  		 this.startX = gestureState.x0
   		 this.rowID = rowID 
    //alert(rowID)
  },
  _onPanResponderMove:function(e:Object,gestureState:Object,rowID){
  	
  	 // Animated.event([null,{x:gestureState.dx,y:0}]);
  	  //this.state.rightPan.x = gestureState.dx;
  	///this.state.rightPan.y = gestureState.dy;
  	//alert(33)
      this.distanceX = gestureState.dx
      let moveX = gestureState.dx
      this.arrayDistane.push(moveX)
      if(moveX <= -60){
      	moveX = -60
      }else if(moveX>=0){
      	//if(this.showRightPanel == false){
      		moveX  = 0
      	/*}else{
      		if(moveX > 0){
      			moveX = 0
      		}
      	}*/
      	//alert(moveX)
      	//moveX = 0
      }
      Animated.spring(this.state.rightPan,{toValue:{x:moveX,y:0}}
				      			).start()
      //if()
      //this.setState({rightPan:new Animated.ValueXY({x:gestureState.dx,y:0})})
    /*if(gestureState.moveX < (this.startX-10)){
      if(!this.state.showRighrPanel){
          //Animated.spring(this.state.pan,{toValue:{x:0,y:0}}).start()
         this.setState({showRighrPanel:true})
      }
    }
    if(gestureState.moveX > (this.startX+10)){
      if(this.state.showRighrPanel){
       // Animated.timing(this.state.fadeAnim,{toValue:0}).start()
       // alert(0)
      // Animated.event([null,{dx:this.state.rightPan.x,dy:this.state.rightPan.y}]);
        this.setState({showRighrPanel:false})
      }
    }*/
  },
	getInitialState:function(){		
		return {
			isRefreshing:false,
			isAdding:false,
			isEnding:false,
			showRighrPanel:false,
			rightPan:new Animated.ValueXY({x:0,y:0}),
			//page
		};
	},
	render(){
		let rowID = this.props.rowID
		let rowData = this.props.rowData
		let showYiliu = false;
		//let yiLiuText = "";
		let yiLiuTitle = "";
		let value3 = rowData.addScore;
		let name3 = "功勋加成";
		let colorName = "rgb(197,205,215)";
		let colorValue = "rgb(244,63,60)";
		let totalColor = "rgb(244,63,60)";
		if(rowData.targetType !== undefined && rowData.targetType !== null){
		   if(rowData.targetType === "目标遗留"){
				showYiliu = true;
				yiLiuTitle = "目标延期";
			}else{

			}
			
		}
		let watcher = PanResponder.create({
			      onStartShouldSetPanResponder:()=>true,
			      onMoveShouldSetResponder: (evt) => true,
			      onPanResponderGrant:(evt,gestureState)=>this._onPanResponderGrant(evt,gestureState,rowID),
			      onPanResponderMove:(evt,gestureState)=>this._onPanResponderMove(evt,gestureState,rowID),
			     // onPanResponderMove:Animated.event([null,{dx:this.state.rightPan.x}]),//dy:this.state.rightPan.y,
			      onPanResponderRelease:()=>{
			      	//alert(this.arrayDistane)
			      	this.arrayDistane = []
			      	if(this.distanceX <= -5){
			      		//this.showRighrPanel = true
			      		this.showRightPanel = true
				      	Animated.spring(
				      			this.state.rightPan,{toValue:{x:-60,y:0}}
				      			).start()
				      	 
				     }else{
				     	this.showRightPanel = false
				     	Animated.spring(
				      			this.state.rightPan,{toValue:{x:0,y:0}}
				      			).start()
				     }
				    // this.startX = 0
				    // this.rowID = -1
				    // this.distanceX = -1
			      }
			    });
		//{...watcher.panHandlers}
		/*<View style={{width:60,height:100,backgroundColor:"rgb(244,63,60)",justifyContent:"center",alignItems:"center"}}>
								<Text style={{fontSize:16,fontWeight:"700",color:"rgb(255,255,255)"}}>编辑</Text>
						</View>*/

		return(
			<Animated.View style={[{width:this.props.layoutStyle.width,flex:1,flexDirection:"row",backgroundColor:"rgb(255,255,255)",borderColor:"rgb(229,229,229)",borderWidth:1,height:100*changeRatio},
			this.state.rightPan.getLayout()]}
			>
				<View style={{width:this.props.layoutStyle.width,padding:10*changeRatio,flex:1,backgroundColor:"#ffffff"}}>
					<View style={{height:35*changeRatio,justifyContent:"center",flex:1,}}>
					{showYiliu && false && <View style={{backgroundColor:"rgb(243,175,43)",justifyContent:"center",height:20*changeRatio,padding:2*changeRatio,marginRight:10*changeRatio,}}><Text style={{fontSize:12*changeRatio,color:"#ffffff"}}>{yiLiuTitle}</Text></View>}
					<Text style={{fontSize:16*changeRatio,color:"rgb(30,44,60)",lineHeight:20}}>{rowData.content}</Text>
					{showYiliu &&  <View style={{position:"absolute",top:0,justifyContent:"center",right:0,height:35*changeRatio,width:22*changeRatio}}><Image style={{height:26*changeRatio,width:26*changeRatio,borderRadius:13*changeRatio}} source={ImageResource["icon-stamp@2x.png"]}></Image></View>}
				
					</View>
					<View style={{flexDirection:"row",marginTop:0}}>
						<View style={{flexDirection:"column",width:this.props.layoutStyle.width/3,flex:1,borderWidth:0,borderColor:"red"}}>
							<Text style={{fontSize:20*changeRatio,color:totalColor,position:"absolute",left:0}}>{parseFloat(rowData.totalProgress).toFixed(1)+'%'}</Text>
							<Text style={{fontSize:13*changeRatio,color:"rgb(197,205,215)",marginTop:26*changeRatio}}>总进度</Text>
							
						</View>
						<View style={{flexDirection:"column",width:this.props.layoutStyle.width/3,flex:1,}}>
							<View style={{flexDirection:"row",flex:1,position:"absolute",left:0,top:4*changeRatio}}>
									<Text style={{fontSize:13*changeRatio,color:"rgb(197,205,215)",marginTop:1}}>目标自测</Text>
									<Text style={{fontSize:13*changeRatio,marginLeft:5,color:"rgb(30,44,60)"}}>{parseFloat(rowData.selfProgress).toFixed(1)+'%'}</Text>
							</View>
							
							<View style={{flexDirection:"row",alignItems:"flex-start",flex:1,marginTop:25*changeRatio,borderWidth:0,borderColor:"red"}}>
								<Text style={{fontSize:13*changeRatio,color:"rgb(197,205,215)",marginTop:1}}>主管测评</Text>
								<Text style={{fontSize:13*changeRatio,marginLeft:5*changeRatio,color:"rgb(30,44,60)"}}>{parseFloat(rowData.superiorAdjustProgress).toFixed(1)+"%"}</Text>
							</View>
						</View>
						<View style={{flexDirection:"column",width:this.props.layoutStyle.width/3,paddingRight:0,borderWidth:0,borderColor:"red"}}>
							<Text style={{fontSize:20*changeRatio,position:"absolute",color:colorValue,right:0,textAlign:"right"}}>{value3}</Text>
							<Text style={{fontSize:13*changeRatio,color:colorName,marginTop:26*changeRatio,textAlign:"right"}}>{name3}</Text>
						</View>
					</View>
				</View>
				
			</Animated.View>
		)
	}
})
var UserTargetHistory = React.createClass({
  startX:0,//右滑
  rowID:-1,//行
  distanceX:0,
  //showRighrPanel:false,
  //showDirection:
  componentDidMount:function(){
      PageData = this.props.pageModel.PageData
      PageData.userYearTarget = []
		 let postDate = {
		 	token:PageData.token,
		 	userUniqueid:PageData.userUniqueid,
		 	orgUniqueid:PageData.orgUniqueid
		 }
  		 getUserYearTarget(this.props.dispatch,postDate)
  },
  _onPanResponderGrant:function(e:Object,gestureState:Object,rowID){
  	if(rowID !== undefined && rowID !== null){
  		 this.startX = gestureState.x0
   		 this.rowID = rowID
  	}   
    //alert(rowID)
  },
  _onPanResponderMove:function(e:Object,gestureState:Object,rowID){
  	//this.state.rightPan.x = gestureState.dx;
  	//this.state.rightPan.y = gestureState.dy;
  	  Animated.event([null,{dx:this.state.rightPan.x,dy:this.state.rightPan.y}]);
      this.distanceX = gestureState.moveX - this.startX
    /*if(gestureState.moveX < (this.startX-10)){
      if(!this.state.showRighrPanel){
          //Animated.spring(this.state.pan,{toValue:{x:0,y:0}}).start()
         this.setState({showRighrPanel:true})
      }
    }
    if(gestureState.moveX > (this.startX+10)){
      if(this.state.showRighrPanel){
       // Animated.timing(this.state.fadeAnim,{toValue:0}).start()
       // alert(0)
      // Animated.event([null,{dx:this.state.rightPan.x,dy:this.state.rightPan.y}]);
        this.setState({showRighrPanel:false})
      }
    }*/
  },
	getInitialState:function(){		
		return {
			dataSource:[],
			isRefreshing:true,
			isAdding:false,
			isEnding:false,
			showRighrPanel:false,
			rightPan:new Animated.ValueXY(),
			//page
		};
	},
	_renderRow:function(rowData:object,sectionID:number,rowID:number,hignlightRow:(sectionID:number,rowID:number)=>void){
	if(rowData.type == "month"){
			
			return (
					<RowItemContainer {...this.props} rowID={rowID} rowData={rowData}/>
				)
		}else if(rowData.type == "target"){
			return (<RowItem {...this.props} rowID={rowID} rowData={rowData}/>)
			/*let rightView = <View></View>;
			if(this.state.showRighrPanel==true && this.rowID === rowID){
				rightView = <View style={{position:"absolute",alignItems:"center",justifyContent:"center",top:0,right:0,width:60,height:100,backgroundColor:"rgba(244,63,60,1)",zIndex:500}}>
								<Text style={{fontSize:16,fontWeight:"700",color:"rgb(255,255,255)"}}>编辑</Text>
						</View>
			}*/
			/*alert(this.state.showRighrPanel  + ": " +this.rowID)
			if(this.showRighrPanel && this.rowID === rowID){
				return(
			

			}else{
			return(
			<Animated.View style={[{flexDirection:"row",backgroundColor:"rgb(255,255,255)",borderColor:"rgb(229,229,229)",borderWidth:0.5,height:100},this.state.rightPan.getLayout()]}
				{...watcher.panHandlers}
			>
				<View style={{width:this.props.layoutStyle.width,paddingLeft:10,paddingRight:10,paddingTop:5,paddingBottom:5,}}>
					<View style={{height:40,justifyContent:"center"}}>
					<Text style={{fontSize:16,color:"rgb(30,44,60)",lineHeight:20}}>{rowData.title}</Text>
					</View>
					<View style={{flexDirection:"row",marginTop:5}}>
						<View style={{flexDirection:"column",width:this.props.layoutStyle.width/3}}>
							<Text style={{fontSize:16,fontWeight:"500",color:"rgb(244,63,60)"}}>{rowData.manageRate+"%"}</Text>
							<Text style={{fontSize:13,color:"rgb(197,205,215)",marginTop:5}}>主管测评</Text>
						</View>
						<View style={{flexDirection:"column",width:this.props.layoutStyle.width/3}}>
							<Text style={{fontSize:16,fontWeight:"500"}}>{rowData.selfRate+'%'}</Text>
							<Text style={{fontSize:13,color:"rgb(197,205,215)",marginTop:5}}>目标自测</Text>
						</View>
						<View style={{flexDirection:"column",width:this.props.layoutStyle.width/3,paddingRight:30}}>
							<Text style={{fontSize:16,fontWeight:"500",textAlign:"right"}}>{rowData.addScore}</Text>
							<Text style={{fontSize:13,textAlign:"right",color:"rgb(197,205,215)",marginTop:5}}>功勋加成</Text>
						</View>
					</View>
				</View>
			</Animated.View>)}*/
		}else{
			return (<View></View>)
		}	
	},
	_renderFooter(){
		if(this.state.isEnding){
		     /* return (
		        <View style={{alignItems:"center",flexDirection:"row",justifyContent:"center",height:30,flex:1}}>
		          <Text style={{marginLeft:10,fontSize:14}}>没有更多数据了...</Text>
		        </View>
       		 )*/
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

	},
	_onRefresh(){
		this.setState({isRefreshing:true})
		 let PageData = this.props.pageModel.PageData
		 PageData.isRefreshing = true;
		  PageData.userYearTarget = []
		 let postDate = {
		 	token:PageData.token,
		 	userUniqueid:PageData.userUniqueid,
		 	orgUniqueid:PageData.orgUniqueid
		 }
  		 getUserYearTarget(this.props.dispatch,postDate,true)
	},
	_onAdding(){
		this.setState({isAdding:true,isEnding:true})
		/*setTimeout(()=>{
			var ds = new ListView.DataSource({rowHasChanged:(r1,r2)=>r1 !== r2});
			testYear--;
			let year = testYear + "年"
			let datas = [{type:"month",year:year,month:"09",manageRate:80,selfRate:80,addScore:-10,totalRete:80},{type:"month",year:year,month:"08",manageRate:80,selfRate:80,addScore:-10,totalRete:80},{type:"month",year:year,month:"07",manageRate:80,selfRate:80,addScore:-10,totalRete:80},{type:"month",year:year,month:"06",manageRate:80,selfRate:80,addScore:-10,totalRete:80},{type:"month",year:year,month:"05",manageRate:80,selfRate:80,addScore:-10,totalRete:80}]
			let newdatas = this.state.dataSource.concat(datas)			
			this.setState({
				isAdding:false,
				dataSource:newdatas,
			})
		},1000);*/
	},
	onEndReached:function(){
		//this.setState({isRefreshing:true})
		//alert(1)
		if(this.state.isAdding == false && this.state.isEnding == false){
			this._onAdding()
		}
	},
	_onScroll:function(a,b,c){
		//alert(a)

	},
	/**
	* 获取listview 数据源
	*/
	_getDataSource(){
		var ds = new ListView.DataSource({rowHasChanged:(r1,r2)=>r1 !== r2});
		let PageData = this.props.pageModel.PageData
		if(PageData.isRefreshing !== undefined && PageData.isRefreshing != null){
      		this.state.isRefreshing = PageData.isRefreshing
   		 }
   		// alert(JSON.stringify(PageData))
		if(PageData.userYearTarget !== undefined && PageData.userYearTarget !== null){
			this.state.dataSource = PageData.userYearTarget
		}
		return ds.cloneWithRows(this.state.dataSource)
	},
	toback(){
		this.props.navigator.pop();
	},
	render:function(){
		/*refreshControl={
				<RefreshControl
					refreshing={this.state.isRefreshing}
					onRefresh={this._onRefresh}
					tintColor="#ff0000"
					title="loading..."
					titleColor="#00ff00"
					colors={['rgb(0,171,243)','rgb(10,171,243)','#000fff']}
					progressBackgroundColor="#ffff00"
				/>
			}*/
		let PageData = this.props.pageModel.PageData;
		let realDataSource = this._getDataSource();
		let name = "";
		let loginUserInfo = PageData.loginUserInfo;
		 if(loginUserInfo !== undefined && loginUserInfo !== null){
        	name = loginUserInfo.name
        }
		return (
		<View style={{paddingTop:topHeight,backgroundColor:"rgb(248,248,248)",flex:1}}>
		 <TopBar toback={this.toback} layoutStyle={this.props.layoutStyle} topBarText={"目标历史"} topBarTextRight="" showRight={false} showLeft={true}></TopBar>
			<ListView
			dataSource={realDataSource}
			renderRow={this._renderRow}
			initialListSize={5}
			pageSize={6}
			enableEmptySections={true}
			renderFooter={this._renderFooter}
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
	)},
});
const styles = StyleSheet.create({
	 btnView:{
      flex:1,
      //height:70,
      flexDirection:'row',
      backgroundColor:'#ffffff',
      position:'absolute',
      bottom:0,
      left:0,
      paddingLeft:5,
      paddingRight:5,
     //width:500,
      height:60,
      zIndex:500,
    },
    addTask:{
      flex:1,
      borderRadius:8,
     // borderColor:'rgb(29,169,252)',
      backgroundColor:"rgb(29,169,252)",
     // borderWidth:1,
      //padding:10,
      height:40,
      margin:10,
      alignItems: 'center',
      justifyContent :'center',
      zIndex:500,
      //height:70,
      marginRight:5,
      marginLeft:5
    },
     addTaskText:{
      fontSize:15,
      color:"#ffffff"
    }
});
export default UserTargetHistory