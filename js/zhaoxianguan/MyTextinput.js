/**
 * Created by 卓原 on 2017/2/21.
 */
import React, {Component} from 'react';
import {TextInput} from 'react-native';


export default class MyTextinput extends Component {
    constructor(props) {
        super(props);
        this.state = {text: ''};
    }

    render() {
        return (
            <TextInput
                placeholder={'请输入应聘者的真实姓名'} placeholderTextColor={'#d7d7d7'}
                underlineColorAndroid={'transparent'}
                style={{fontSize:11,height: 45, borderColor: '#D7D7D7',
borderWidth: 1,flex:1,color:'#c9c9c9',}}
                onChangeText={(text) => this.setState({text})}
                value={this.state.text}
            />)
    }
}