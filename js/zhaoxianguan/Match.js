/**
 * Created by 卓原 on 2017/2/23.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
} from 'react-native';

import ModalDropdown from 'react-native-modal-dropdown';
import Title from './TitleBar';

const gangwei = ['销售经理', '项目总监', '项目经理', '随便一个'];
const bumen = ['杭研院', '产品部', '项目部', '小吃部'];

export default class Match extends Component {

    static defaultProps = {

        yname: "李卓原",    //应聘人姓名
        qiwang: '销售经理' //期望岗位

    };

    constructor(props) {
        super(props);
        this.state = {
            showRight: false,
            showLeft: false,
        }

    }

    render() {
        return (
            <View>
                <Title text="匹配试卷"/>
                <View style={styles.rowview}>
                    <Image style={{width:50,height:50,marginLeft:20}}
                           source={require('./img/tab-user@2x.png')}></Image>
                    <Text
                        style={styles.text}>{this.props.yname}</Text>
                </View>
                <View style={styles.line_row}></View>
                <View style={styles.rowview}>
                    <Text style={styles.text}>期望岗位</Text>
                    <Text style={styles.text}>{this.props.qiwang}</Text>
                </View>
                <View style={styles.line_row}></View>

                <View style={[styles.line_row,{marginTop:30}]}></View>
                <View style={styles.rowview}>
                    <Text style={styles.text}>期望岗位</Text>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <ModalDropdown style={styles.dropdown_my}
                                       textStyle={styles.dropdown_text}
                                       options={bumen}
                                       defaultValue={'请选择'}/>
                        <Image
                            source={require('./img/tab-user@2x.png')}></Image>
                    </View></View>
                <View style={styles.line_row}></View>
                <View style={styles.rowview}>
                    <Text style={styles.text}>期望岗位</Text>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <ModalDropdown style={styles.dropdown_my}
                                       textStyle={styles.dropdown_text}
                                       options={gangwei} defaultValue={'请选择'}/>
                        <Image
                            source={require('./img/tab-user@2x.png')}></Image>
                    </View></View>
                <View style={styles.line_row}></View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: 14,
        textAlign: 'right',
        marginHorizontal: 20,
        color: '#666',
    },
    rowview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        height: 30
    },
    line_row: {
        height: 1,
        backgroundColor: '#ddd',
        marginTop: 10
    },
    dropdown_text: {
        fontSize: 14,
    },
})