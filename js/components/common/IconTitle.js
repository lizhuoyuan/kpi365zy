/**
 * 文字图标
 * Created by yuanzhou on 16/11.
 */
import React, {Component} from 'react'
import {View, StyleSheet, TouchableOpacity, Text, TextInput, Image} from 'react-native';
import MessageNumber from './MessageNumber'
let IconTitle = React.createClass({
    getInitialState: function () {
        return {}
    },
    getDefaultProps: function () {
        return {
            isShowText: true,
            number: 0,
            showMessageNumber: false,
            activeOpacity: 0.5
        }
    },
    render(){
        return (
            <TouchableOpacity activeOpacity={this.props.activeOpacity} style={{flex:1}} onPress={this.props.onPress}>
                <View style={[styles.container,this.props.style]}>
                    {this.props.showMessageNumber &&
                    <MessageNumber style={{left:this.props.style.width/2}} number={this.props.number}/>
                    }
                    <View style={[{flex:0,alignItems:"center",justifyContent:"center"}]}>

                        <Image style={[styles.image,this.props.imageStyle]} resizeMode="stretch"
                               source={this.props.source}>
                        </Image>

                    </View>
                    {this.props.isShowText &&
                    <View style={{flex:0,justifyContent:"center"}}>
                        <Text style={[styles.text,this.props.fontStyle]}>{this.props.describe}</Text>
                    </View>
                    }

                </View>
            </TouchableOpacity>
        )
    }
})
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 25,
        height: 25,
        borderRadius: 12.5,
    },
    text: {
        marginTop: 5,
    }
});
export default  IconTitle
