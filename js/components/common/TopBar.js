/**
 * 底部标签栏
 * Created by yuanzhou on 16/12.
 */
import React, {Component, PropTypes} from 'react'
import {
    Animated,
    PixelRatio,
    Platform,
    View,
    Slider,
    TouchableOpacity,
    TouchableHighlight,
    PanResponder,
    Text,
    TextInput,
    StyleSheet,
    Image,
    Dimensions
} from 'react-native'
import ImageResource from '../../utils/ImageResource'
import  * as SizeController from '../../SizeController'
let topHeight = SizeController.getTopHeight();
let statusBarHeight = SizeController.getStatusBarHeight();
let tabBarHeight = SizeController.getTabBarHeight();
//let changeRatio = SizeController.getChangeRatio();
let changeRatio = SizeController.getTopBarRatio();

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
let TopBar = React.createClass({
    getInitialState() {
        return {};
    },
    getDefaultProps() {
        return {
            topBarText: "",
            topBarTextRight: "",
            showRight: false,
            showLeft: false,
            showRightImage: false,
            topBarTextBottomShow: false,
            topBarTextBottom: "",
            rightComponent: null,
            leftComponent: null,
            style: {},
            useAnimated: false,
            AnimatedView: null,
            showMiddleComponent: false,
            leftWidth: {},
            middleWidth: {},
            rightWidth: {},
            layoutStyle: {
                width: deviceWidth,
                height: deviceHeight
            }
        };
    },
    //回退
    toback(e){
    },
    render(){
        const tab_top_initStyle = Platform.OS == 'ios' ? styles.tab_top_ios : styles.tab_top_android;
        let {topBarText, topBarTextBottom, toback, topBarTextBottomShow, topBarTextRight, showRight, showMiddleComponent,showLeft, showRightImage, leftComponent, rightComponent, middleComponent} = this.props;
        if (!this.props.useAnimated) {
            return (

                <View style={[tab_top_initStyle,{width:this.props.layoutStyle.width},this.props.style]}>

                    <View
                        style={[styles.alignItemsLeft,{width:this.props.layoutStyle.width/4,flex:0,},this.props.leftWidth]}
                    >
                        { showLeft && !leftComponent &&
                        <TouchableOpacity onPress={toback} style={styles.backBtn}>
                            <View style={[styles.backBtn,{justifyContent:'center',marginLeft:10}]}>
                                <Image style={styles.backImage} source={ImageResource['nav-back@2x.png']}/>
                            </View>
                        </TouchableOpacity>
                        }
                        { showLeft && leftComponent }
                    </View>

                    {!this.props.showMiddleComponent ? <View
                            style={[styles.alignItemsCenter,{width:this.props.layoutStyle.width/2,borderColor:"red",borderWidth:0},this.props.middleWidth]}>
                            <Text style={[{fontSize:17*changeRatio,color:"#ffffff"}]}>{topBarText}</Text>
                            {topBarTextBottomShow &&
                            <Text style={{fontSize:14*changeRatio,color:"#ffffff"}}>{topBarTextBottom}</Text>}
                        </View>
                        :
                        <View
                            style={[styles.alignItemsCenter,{width:this.props.layoutStyle.width/2,borderColor:"red",borderWidth:0,},this.props.middleWidth]}>
                            {middleComponent}
                        </View>
                    }
                    <View
                        style={[styles.alignItemsRight,{width:this.props.layoutStyle.width/4,},this.props.rightWidth]}>
                        { (showRight || showRightImage) && rightComponent }
                        { showRight && !rightComponent &&
                        <Text style={[{fontSize:17*changeRatio,color:"#ffffff"}]}>{topBarTextRight}</Text>
                        }
                    </View>

                </View>
            )
        } else {
            return (
                <this.props.AnimatedView
                    style={[tab_top_initStyle,{width:this.props.layoutStyle.width},this.props.style]}>

                    <View
                        style={[styles.alignItemsLeft,{width:this.props.layoutStyle.width/4,flex:0},this.props.leftWidth]}>
                        { showLeft && !leftComponent &&
                        <TouchableOpacity onPress={toback} style={styles.backBtn}>
                            <View style={[styles.backBtn,{justifyContent:'center',marginLeft:10}]}>
                                <Image style={styles.backImage} source={ImageResource['nav-back@2x.png']}/>
                            </View>
                        </TouchableOpacity>
                        }
                        { showLeft && leftComponent }
                    </View>

                    {!showMiddleComponent ? <View
                            style={[styles.alignItemsCenter,{width:this.props.layoutStyle.width/2,borderColor:"red",borderWidth:0,},this.props.middleWidth]}>
                            <Text style={[{fontSize:17*changeRatio,color:"#ffffff"}]}>{topBarText}</Text>
                            {topBarTextBottomShow &&
                            <Text style={{fontSize:14*changeRatio,color:"#ffffff"}}>{topBarTextBottom}</Text>}
                        </View>
                        :
                        <View
                            style={[styles.alignItemsCenter,{width:this.props.layoutStyle.width/2,borderColor:"red",borderWidth:0,},this.props.middleWidth]}>
                            {middleComponent}
                        </View>
                    }
                    <View
                        style={[styles.alignItemsRight,{width:this.props.layoutStyle.width/4,paddingRight:10},this.props.rightWidth]}>
                        { (showRight || showRightImage) && rightComponent }
                        { showRight && !rightComponent &&
                        <Text style={[{fontSize:17*changeRatio,color:"#ffffff"}]}>{topBarTextRight}</Text>
                        }
                    </View>

                </this.props.AnimatedView>)
        }
    }
});

const styles = StyleSheet.create({
    tab: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: deviceWidth,
        height: 45 * changeRatio,
        zIndex: 500,
        backgroundColor: '#cccccc'
    },
    backBtn: {
        flex: 0,
        width: 50 * changeRatio,
        height: 20 * changeRatio,
        justifyContent: "center",
    },
    panView: {
        flex: 1,
        marginTop: 45 * changeRatio,
        width: deviceWidth,
        height: deviceHeight,
        zIndex: 1,
        borderColor: '#ffffff',
        borderWidth: 1
    },
    tab_top_ios: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: deviceWidth,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: statusBarHeight,
        height: topHeight,
        backgroundColor: "rgb(48,173,245)",
        zIndex: 500,
        flexDirection: 'row'
    },
    tab_top_android: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: deviceWidth,
        justifyContent: 'center',
        alignItems: 'center',
        height: topHeight,
        backgroundColor: "rgb(48,173,245)",
        zIndex: 500,
        flexDirection: 'row'
    },
    textColorWhite: {
        color: '#ffffff'
    },
    image: {
        borderRadius: 12.5 * changeRatio,
        width: 25 * changeRatio,
        height: 25 * changeRatio,
    },
    backImage: {
        width: 17 * changeRatio,
        height: 17 * changeRatio,
    },
    alignItemsLeft: {
        justifyContent: "center",
    },
    alignItemsLeft_IOS: {
        position: "absolute",
        left: 10,
        marginTop: 20 - 8.5,
        zIndex: 501,
    },
    alignItemsLeft_ANDROID: {
        position: "absolute",
        left: 10,
        marginTop: 27.5 - 8.5,
        zIndex: 501,
    },
    alignItemsCenter: {
        alignItems: 'center',
        flex: 1,
    },
    alignItemsRight: {
        alignItems: 'flex-end',
        flex: 0,
    },
    alignItemsRight_IOS: {
        alignItems: 'flex-end',
        right: 10,

    },
    alignItemsRight_ANDROID: {
        alignItems: 'flex-end',
        right: 10,
        flex: 1
    },
    text: {
        fontWeight: '200',
        fontSize: 10
    }
});
export default TopBar
