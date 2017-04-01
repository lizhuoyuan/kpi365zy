/**
 * Created by 卓原 on 2017/2/21.
 */
import React, {Component} from 'react';
import {Text,} from 'react-native';

export default class MyText extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Text style={{color:'#868686',fontSize:12,paddingHorizontal:5,
                        height: 45,width:68,textAlign:'center', borderColor: '#D7D7D7',
                        borderWidth: 1,textAlignVertical :'center'}}>
                {this.props.text || "标题头"}
            </Text>)

    }
}