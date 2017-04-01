/**
 * radioGroup
 * Created by yuanzhou on 16/12.
 */
import React from 'react'
import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native'
import ImageResource from '../../utils/ImageResource'
import  * as SizeController from '../../SizeController'
let topHeight = SizeController.getTopHeight();
let tabBarHeight = SizeController.getTabBarHeight();
let changeRatio = SizeController.getChangeRatio();

let RadioGroup = React.createClass({
    getDefaultProps: function () {
        return {
            options: [],
            radioStyle: {
                flexDirection: 'row',
                flex: 1,
                width: 100 * changeRatio,
                marginTop: 10 * changeRatio,
            },
            imageStyle: {width: 22 * changeRatio, height: 22 * changeRatio, borderRadius: 11 * changeRatio},
            textStyle: {}
        }
    },
    getInitialState: function () {
        return {
            selectedKey: 0,
            isFirstInit: false
        }
    },
    selected(index){
        //alert(index)
        this.setState({selectedKey: index})
    },
    render(){
        let radios = []
        /*if(this.state.isFirstInit == false){
         for(let i = 0; i < this.props.options.length;i++){
         let obj = this.props.options[i]
         //alert(JSON.stringify(obj))
         if(obj.selected !== undefined && obj.selected !== null && obj.selected == true){
         this.state.selectedKey = obj.sid
         }
         }
         this.state.isFirstInit = true
         }*/
        let onSelect = this.props.onSelect
        const that = this
        //<View style={[styles.blueCircleView,selectedColor]}></View>
        let size = this.props.options.length
        /*for(let i=0; i < this.props.options.length; i++){
         if(size )
         }*/
        radios = this.props.options.map(function (obj, index) {
            //alert(text)
            let selectedColor = {}
            let imageUrl = ImageResource["choose@3x.png"]
            if (obj.sid == that.props.selectedKey) {

                imageUrl = ImageResource["choose2@3x.png"]
                //selectedColor = {backgroundColor:'rgb(29,169,252)'}
            }
            return (
                <TouchableOpacity style={{flex:1}} key={index} onPress={onSelect.bind(this,obj.sid)}>
                    <View style={[{flexDirection:'row'},styles.centerView,that.props.radioStyle]}>
                        <Image source={imageUrl} style={[{margin:4*changeRatio},that.props.imageStyle]}></Image>
                        <View style={{flex:1}}>
                            <Text
                                style={[{color:"#000000",fontSize:14*changeRatio},that.props.textStyle]}>{obj.text}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        })
        return (
            <View style={{flex:1, flexDirection:'row',flexWrap:"wrap",alignItems:"center"}}>
                {radios}
            </View>
        )
    }
})
const styles = StyleSheet.create({
    blueCircleView: {
        width: 26 * changeRatio,
        height: 26 * changeRatio,
        borderRadius: 13 * changeRatio,
        borderColor: 'rgb(29,169,252)',
        //backgroundColor:'rgb(29,169,252)',
        borderWidth: 2,
        //marginLeft:10,
        marginRight: 8,
        //marginLeft:10,
        // zIndex:10,
    },
    rowView: {
        flexDirection: 'row',
        flex: 1,
        width: 100 * changeRatio,
        marginTop: 10 * changeRatio,
        //flexWrap:"wrap",
        // borderColor:'rgb(29,169,252)',
        //backgroundColor:'rgb(29,169,252)',
        //borderWidth:1,

    },
    centerView: {
        alignItems: "center",
        //marginRight:20,
    }
})
export default  RadioGroup