/**
 * Created by 卓原 on 2017/3/6.
 * 通用标题栏
 * */

import React, {Component,} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
} from 'react-native';
import MyDimensions from './MyDimensions';
import {getStatusBarHeight, getTopBarHeight} from '../SizeController';
import LinearGradient from 'react-native-linear-gradient';

const myscale = MyDimensions.myscale;
export  default class TitleBar extends Component {
    static defaultProps = {
        showLeft: true,
        showRight: true,
    }

    leftclick() {
        this.props.leftclick() && this.props.leftclick;
    }

    rightclick() {
        this.props.rightclick && this.props.rightclick();
        //alert("笔试邀请入口，开放给HR及主管。");
    }

    render() {
        return (  <LinearGradient
                start={{x: 0, y: 1}} end={{x: 1, y: 1}}
                locations={[0.5,1]}
                colors={['#39bcf7', '#1c89ef']}>
                <View style={Platform.OS==='android'?styles.containerAndroid:styles.containeriOS}>
                    <View style={{flex:1}}>
                        {this.props.showLeft &&
                        <TouchableOpacity onPress={this.leftclick.bind(this)}>
                            <Image source={require('./img/nav-forward.png')}></Image>
                        </TouchableOpacity>}
                    </View>
                    <View style={styles.textview}>
                        <Text
                            style={[styles.textstyle,this.props.textStyle]}>{this.props.text || "标题头"}</Text>
                        {this.props.textBottom &&
                        <Text
                            style={[styles.textstyle,this.props.textStyleBottom]}>{this.props.textBottom}</Text>
                        }
                    </View>
                    <View style={{flex:1,alignItems:'flex-end'}}>
                        {this.props.showRight &&
                        <TouchableOpacity onPress={this.rightclick.bind(this)}>
                            <Image
                                source={require('./img/nav-QRcode2.png')}></Image></TouchableOpacity>
                        }
                    </View>
                </View>
            </LinearGradient>

        );
    }
}

const styles = StyleSheet.create({
    containerAndroid: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 92 * myscale,
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        paddingHorizontal: 30 * myscale
    },
    containeriOS: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: getStatusBarHeight(),
        height: 92 * myscale,
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        paddingHorizontal: 30 * myscale
    },
    textstyle: {
        fontSize: 34 * myscale,
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0)',
        textAlign: 'center',
    },
    textview: {
        flex: 0,
        alignSelf: 'center',
    },
});