import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
}from'react-native';
import ModalDropdown from 'react-native-modal-dropdown';

import TitleBar from './TitleBar';
import MyText from './MyText';
import MyTextinput from './MyTextinput';

export default class WrittenTest extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    back() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    render() {
        return (
            <View>
                <TitleBar leftclick={this.back.bind(this)} text="笔试邀请"/>
                <View
                    style={{flexDirection:'row',marginTop:30,marginBottom:10,marginHorizontal:10}}>
                    <MyText text="姓名"/>
                    <MyTextinput/>
                </View>

                <View style={{flexDirection:'row',margin:10}}>
                    <MyText text="应聘部门"/>
                    <MyTextinput/>
                </View>

                <View style={{flexDirection:'row',margin:10}}>
                    <MyText text="评聘职位"/>
                    <MyTextinput/>
                </View>

                <View style={{flexDirection:'row',margin:10}}>
                    <MyText text="招聘类型"/>
                    <MyTextinput/>
                </View>

                <View style={{flexDirection:'row',margin:10}}>
                    <MyText text="招聘类型"/>
                    <ModalDropdown style={styles.dropdown_my}
                                   textStyle={styles.dropdown_text}
                                   options={['option 1', 'option 2']}/>

                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    dropdown_3: {
        width: 150,
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 1,
    },
    dropdown_my: {
        height: 45, borderColor: '#D7D7D7',
        borderLeftWidth: 0, borderWidth: 1, flex: 1,
        paddingLeft: 20,
        justifyContent: 'center',
    },

})

