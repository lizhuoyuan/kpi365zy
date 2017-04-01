/**
 * 顶部标签栏
 * Created by yuanzhou on 16/12.
 */

import React, {Component} from 'react'
import {View, Dimensions, StyleSheet, PixelRatio, TouchableOpacity, Text, TextInput, Image} from 'react-native';
import IconTitle from './IconTitle'


import {tabManage} from '../../actions'

import  * as SizeController from '../../SizeController'
let topHeight = SizeController.getTopHeight();
let tabBarHeight = SizeController.getTabBarHeight();
let changeRatio = SizeController.getChangeRatio();
let tabBarRatio = SizeController.getTabBarRatio();
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
import ImageResource from '../../utils/ImageResource'
let tabsNameInitial = ['首页', '动态圈', '榜单', '我']
let iconsInitial = [ImageResource['tab-home@2x.png'],
    ImageResource['tab-moment@2x.png'],
    ImageResource['tab-list@2x.png'],
    ImageResource['tab-user@2x.png'],
]
let iconClickInitial = [ImageResource['tab-home2@2x.png'],
    ImageResource['tab-moment2@2x.png'],
    ImageResource['tab-list2@2x.png'],
    ImageResource['tab-user2@2x.png'],
]
let TestView = React.createClass({
    render(){
        return (<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Image style={{flex:0}} source={ImageResource["404-2@3x.png"]}></Image>
        </View>)
    }
})


let TabBar = React.createClass({
    getInitialState: function () {
        return {}
    },
    getDefaultProps: function () {
        return {
            number: 1,
            showMessageNumber: false,
            showMessageNumberIndex: -1,
            imageStyle: {width: 24 * tabBarRatio, height: 24 * tabBarRatio, borderRadius: 0},
            imageStyleNoText: {width: 45, height: 45},
            icons: iconsInitial,
            tabsName: tabsNameInitial,
            iconClickInitial: 0,
            fontStyle: {color: "rgb(171,181,196)", fontSize: 11 * tabBarRatio, marginTop: 4 * tabBarRatio},
            fontSelectedStyle: {color: "rgb(29,169,252)", fontSize: 11 * tabBarRatio, marginTop: 4 * tabBarRatio},

        }
    },
    weixinOnPress(){

    },
    tabClick(index){
        if (this.props.tabClick) {
            this.props.tabClick(index);
        } else {
            let tabManageInfo = {
                tabClickIndex: index,
                isShowTabBar: true
            };
            tabManage(this.props.dispatch, tabManageInfo)
        }
    },
    render(){
        let tabClickIndex = this.props.tabClickIndex
        let {icons, tabsName, styleIcon, fontSelectedStyle, fontStyle, iconClick, imageStyle, imageStyleNoText, showMessageNumberIndex, number} = this.props;
        let showMessageNumberReal = this.props.showMessageNumber
        let that = this;
        let fontColor = "rgb(171,181,196)";
        let tabs = tabsName.map(function (text, index) {
            let showMessageNumber = false;
            if (showMessageNumberReal && showMessageNumberIndex === index) {
                showMessageNumber = true
            } else {
                showMessageNumber = false
            }
            if (tabClickIndex == index) {
                fontColor = "rgb(29,169,252)";
                return (<View key={index} style={[styles.base]}>
                    <IconTitle
                        isShowText={true}
                        number={number}
                        activeOpacity={1}
                        imageStyle={imageStyle}
                        showMessageNumber={showMessageNumber}
                        fontStyle={fontSelectedStyle}
                        describe={text}
                        style={styleIcon}
                        source={iconClick[index]}
                        onPress={()=>{that.tabClick(index)}}
                    />
                </View>)
            } else {
                return (
                    <View key={index} activeOpacity={1} style={[styles.base]}>
                        <IconTitle imageStyle={imageStyle}
                                   number={number}
                                   fontStyle={fontStyle}
                                   showMessageNumber={showMessageNumber}
                                   isShowText={true}
                                   style={styleIcon}
                                   describe={text}
                                   source={icons[index]}
                                   onPress={()=>{that.tabClick(index)}}
                        />
                    </View>)
            }

        });
        return (
            <View style={styles.container}>
                {tabs}
            </View>
        )
    }
})
const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "absolute",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderTopColor: "#cccccc",
        borderTopWidth: 1,
        height: tabBarHeight,
        width: deviceWidth,
        left: 0,
        bottom: 0
    },
    image: {
        borderRadius: 12.5,
        width: 25,
        height: 25
    },
    base: {
        flex: 1,
        //paddingBottom:5,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#ffffff',

    },
    tabClick: {
        flex: 1,
        borderTopWidth: 2,
        borderTopColor: '#007a87',
        backgroundColor: '#cccccc'
    },
    text: {
        fontWeight: '200',
        fontSize: 10
    }
});
export default  TabBar
