/**
 * 数字信息：类似于微信朋友圈的红标，显示数字
 * Created by yuanzhou on 16/12.
 */
import React  from 'react'
import {View, Text} from 'react-native'
import  * as SizeController from '../../SizeController'
let topHeight = SizeController.getTopHeight();
let statusBarHeight = SizeController.getStatusBarHeight();
let tabBarHeight = SizeController.getTabBarHeight();
let changeRatio = SizeController.getChangeRatio();
let MessageNumber = React.createClass({
    getDefaultProps: function () {
        return {
            number: 0
        }
    },
    render(){
        let viewStyle = {
            position: "absolute",
            flex: 1,
            width: 20 * changeRatio,
            height: 16 * changeRatio,
            borderRadius: 8 * changeRatio,
            borderWidth: 0,
            borderColor: "red",
            right: -6 * changeRatio,
            top: -2 * changeRatio,
            zIndex: 1000,
            backgroundColor: "red",
            alignItems: "center",
            justifyContent: "center"
        };
        let numberStyle = {
            fontSize: 8 * changeRatio,
            color: "#ffffff",
            marginLeft: -4,
            fontWeight: "700",
            backgroundColor: "rgba(0,0,0,0)"
        };
        let plusStyle = {
            position: "absolute",
            top: 1,
            right: 1,
            fontSize: 8,
            color: "#ffffff",
            fontWeight: "800",
            backgroundColor: "rgba(0,0,0,0)"
        };
        let showPlus = false
        let number = 200//this.props.number
        if (number < 10) {
            viewStyle = {
                position: "absolute",
                flex: 1,
                width: 16 * changeRatio,
                height: 16 * changeRatio,
                borderRadius: 8 * changeRatio,
                borderWidth: 0,
                borderColor: "red",
                right: -6 * changeRatio,
                top: -2 * changeRatio,
                zIndex: 1000,
                backgroundColor: "red",
                alignItems: "center",
                justifyContent: "center"
            };
            numberStyle = {
                fontSize: 8 * changeRatio,
                color: "#ffffff",
                fontWeight: "700",
                backgroundColor: "rgba(0,0,0,0)"
            };
        } else if (number >= 10 && number < 100) {
            viewStyle = {
                position: "absolute",
                flex: 1,
                width: 16 * changeRatio,
                height: 16 * changeRatio,
                borderRadius: 8 * changeRatio,
                borderWidth: 0,
                borderColor: "red",
                right: -6 * changeRatio,
                top: -2 * changeRatio,
                zIndex: 1000,
                backgroundColor: "red",
                alignItems: "center",
                justifyContent: "center"
            };
            numberStyle = {
                fontSize: 8 * changeRatio,
                color: "#ffffff",
                fontWeight: "700",
                backgroundColor: "rgba(0,0,0,0)"
            };
        } else {
            viewStyle = {
                position: "absolute",
                width: 22 * changeRatio,
                flex: 1,
                height: 16 * changeRatio,
                borderRadius: 8 * changeRatio,
                borderWidth: 0,
                borderColor: "red",
                zIndex: 1000,
                backgroundColor: "red",
                alignItems: "center",
                justifyContent: "center"
            };
            numberStyle = {
                fontSize: 8 * changeRatio,
                color: "#ffffff",
                marginLeft: 0,
                fontWeight: "700",
                backgroundColor: "rgba(0,0,0,0)"
            };
            plusStyle = {
                fontSize: 6 * changeRatio,
                marginLeft: 0,
                marginTop: -4,
                color: "#ffffff",
                fontWeight: "700",
                backgroundColor: "rgba(0,0,0,0)"
            };
            showPlus = true;
            number = 99;
        }
        return (
            <View style={[viewStyle,this.props.style]}>
                <View style={{flex:1,alignItems:"center",flexDirection:"row"}}>
                    <Text style={numberStyle}>{number}</Text>
                    {showPlus && <Text style={plusStyle}>+</Text>}
                </View>
            </View>
        )
    }
})

export default MessageNumber