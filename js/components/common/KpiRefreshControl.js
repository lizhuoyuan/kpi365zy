/**
 * 刷新控件
 * Created by yuanzhou on 16/1.
 */
import React from 'react' 
import {View,RefreshControl} from 'react-native'


let KpiRefreshControl = React.createClass({
	getDefaultProps:function(){
		isRefreshing:false
	},
	render(){
		return (
			<RefreshControl
              refreshing={this.props.isRefreshing}
              onRefresh={this.props.onRefresh}
              tintColor="rgb(0,171,243)"
              colors={['rgb(0,171,243)']}
              progressBackgroundColor="#ffffff"
            />

			)
	}
})

export default KpiRefreshControl