/**
 * Created by 卓原 on 2017/3/8.
 * 面试评估页面
 */

import React, {Component} from 'react';
import {
    View,
    Text,
    Button,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
} from 'react-native';
import Title from './TitleBar';
import MyDimensions from './MyDimensions';
import Yingpin from './YingpinXiangqing';
import config from '../config'
import {updatePinggu} from '../actions'
const myscale = MyDimensions.myscale;

export default class InterviewEvaluation extends Component {
    onSelect(index, value) {
        this.setState({
            text: `Selected index: ${index} , value: ${value}`
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            showRight: false,
            pingguadvice: 0,
            youshi: [],
            lieshi: [],
        };
        this.back = this.back.bind(this);
        this.onPressButton = this.onPressButton.bind(this);
        //      this.pressyoushi = this.pressyoushi.bind(this);
        //      this.presslieshi = this.presslieshi.bind(this);
    }

    onPressButton() {
        //还要提交建议
        const {navigator, person, score, job, titlename} = this.props;

        if (this.state.pingguadvice != 0) {
            this.updatePinggu();
        } else {
            alert('请选择评估建议')
        }
    }

    updatePinggu() {
        let {person} = this.props;
        youshis = this.state.youshi;
        lieshis = this.state.lieshi;
        let {pageModel} = this.props;
        let {PageData} = pageModel;
        let {loginUserInfo} = PageData;
        //还要上传招聘者的id
        let postData = {
            inviter: loginUserInfo.userUniqueid,
            HrRecruitinfoSid: this.props.person.HrRecruitinfoSid,
            advice: this.state.pingguadvice,
            youshi: youshis,
            lieshi: lieshis,
        };
        updatePinggu(this.props.dispatch, postData, {
            toBack: true, toBackIndex: 2,
        }, this.props.person);


    }

    onPresspingguadvice1() {
        this.setState({pingguadvice: 1})
    }

    onPresspingguadvice2() {
        this.setState({pingguadvice: 2})
    }

    onPresspingguadvice3() {
        this.setState({pingguadvice: 3})
    }

    onPresspingguadvice4() {
        this.setState({pingguadvice: 4})
    }

    back() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    selectAdvantages(text) {
        let youshi = [...this.state.youshi];
        if (youshi.indexOf(text) === -1) {
            youshi.push(text);
        }
        else if (youshi.indexOf(text) >= 0) {
            youshi.splice(youshi.indexOf(text), 1);
        }
        this.setState({
            youshi: youshi
        })
    }

    selectDisAdvantages(text) {
        let lieshi = [...this.state.lieshi];
        if (lieshi.indexOf(text) === -1) {
            lieshi.push(text);
        }
        else if (lieshi.indexOf(text) >= 0) {
            lieshi.splice(lieshi.indexOf(text), 1);
        }
        this.setState({
            lieshi: lieshi
        })
    }

    render() {
        const {person} = this.props;
        let advantages = ['专业吻合', '经验丰富', '可塑性强', '沟通力强', '逻辑性强', '适应力强',
            '价值观匹配', '性格阳光', '抗压力强', '领导力强', '学习力强', '创新力强', '执行力强', '其他'];
        let advantage_view = [];
        for (let i = 0; i < advantages.length; i++) {
            let isSelected = false;
            isSelected = this.state.youshi.indexOf(advantages[i]);
            let advantage = null;
            //if (isSelected === -1) {
            advantage = <Label3 selectPress={(text)=>this.selectAdvantages(text)}
                                isSelected={isSelected} key={i} text={advantages[i]}/>
            //} else {
            //advantage = <Label1 selectPress={(text)=>this.selectAdvantages(text)}
            //                   isSelected={isSelected} key={i} text={advantages[i]}/>
            //}
            advantage_view.push(advantage);
        }
        let disadvantages = ['专业不符', '经验欠缺', '可塑性欠缺', '表达欠缺', '逻辑性欠缺', '适应力欠缺',
            '价值观不符', '忠诚度欠缺', '自信心欠缺', '抗压力欠缺', '团队性欠缺', '学习力欠缺', '执行力欠缺', '其他'];
        let disadvantage_view = [];
        for (let i = 0; i < disadvantages.length; i++) {
            let isSelected = false;
            isSelected = this.state.lieshi.indexOf(disadvantages[i]);
            let disadvantage = null;
            disadvantage = <Label4 selectPress={(text)=>this.selectDisAdvantages(text)}
                                   isSelected={isSelected} key={i} text={disadvantages[i]}/>
            disadvantage_view.push(disadvantage);
        }
        return (
            <View style={{backgroundColor:'#fff',flex:1}}>
                <Title textStyle={{fontSize:30*myscale}} textStyleBottom={{fontSize:26*myscale}}
                       text='面试评估'
                       showRight={this.state.showRight }
                       textBottom={person.name}
                       leftclick={this.back}/>
                <ScrollView>
                    <View
                        style={{backgroundColor:'#e5e5e5',height:55*myscale,paddingLeft:30*myscale,
                    justifyContent:'flex-end'}}>
                        <Text
                            style={{fontSize:26*myscale,color:'#838f9f',marginBottom:10*myscale}}>评估建议</Text>
                    </View>

                    <View style={{height:160*myscale,paddingHorizontal:30*myscale,flexDirection:'row',
                alignItems:'center'}}>
                        <TouchableOpacity
                            onPress={this.onPresspingguadvice1.bind(this)}>
                            {this.state.pingguadvice == 1 ? <Label2 text="强烈推荐"/> :
                                <Label1 text="强烈推荐"/>}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.onPresspingguadvice2.bind(this)}>
                            {this.state.pingguadvice == 2 ? <Label2 text="一般推荐"/> :
                                <Label1 text="一般推荐"/>}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.onPresspingguadvice3.bind(this)}>
                            {this.state.pingguadvice == 3 ? <Label2 text="不推荐"/> :
                                <Label1 text="不推荐"/>}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.onPresspingguadvice4.bind(this)}>
                            {this.state.pingguadvice == 4 ? <Label2 text="不录用"/> :
                                <Label1 text="不录用"/>}
                        </TouchableOpacity>
                    </View>

                    < View style={{backgroundColor:'#e5e5e5',height:88*myscale,
                paddingLeft:30*myscale,justifyContent:'flex-end',paddingBottom:10*myscale}}>
                        <Text style={{fontSize:26*myscale,color:'#838f9f'}}>评估标签</Text>
                    </View>
                    <View style={{height :100*myscale,justifyContent:'center'}}>
                        <Text style={{fontSize:30*myscale,color:'#2b3d54',
                textAlign:'center',textAlignVertical:'center'}}>优势</Text></View>
                    <View
                        style={{flex:0,flexWrap:"wrap",paddingHorizontal:20*myscale,flexDirection:'row',}}>
                        {advantage_view}
                    </View>
                    <View style={{height :80*myscale,justifyContent:'center'}}>

                        <Text style={{fontSize:30*myscale,color:'#2b3d54',
                textAlign:'center',textAlignVertical:'center',}}>劣势</Text></View>
                    <View
                        style={{marginBottom:30*myscale,marginTop:20*myscale,flex:0,flexWrap:"wrap",paddingHorizontal:20*myscale,flexDirection:'row'}}>
                        {disadvantage_view}
                    </View>
                    <View
                        style={{backgroundColor:'#e5e5e5',paddingTop:40*myscale,alignItems:'center',flex:1}}>

                        <TouchableOpacity onPress={this.onPressButton} style={{borderRadius:8,alignItems:'center',justifyContent:'center',
                                backgroundColor:'#1da9fc',height:80*myscale,width:690*myscale,marginBottom:20}}>
                            <Text style={{color:'#fff',fontSize:36*myscale,}}>确定</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </View>
        )
    }
}
;

class Label1 extends Component {
    //建议 未选中 ；优势选中
    render() {
        return (
            <View style={[{flex:0,justifyContent:"center",height:68*myscale},styles.radio1]}>
                <Text style={[{textAlign:'center',color:'#1da9fc',fontSize:30*myscale,
                textAlignVertical:'center'}]}>
                    {this.props.text}
                </Text>
            </View>
        )
    }
}

class Label2 extends Component {
    //建议 选中
    render() {
        return (
            <TouchableOpacity
                style={{margin:10*myscale,width:156*myscale,borderRadius:5,flex:0,justifyContent:"center", backgroundColor:'#1da9fc',height:68*myscale}}>
                <Text style={{
        textAlign:'center',textAlignVertical:'center',color:'#fff',
        fontSize:30*myscale}}>
                    {this.props.text}
                </Text>
            </TouchableOpacity>
        )
    }
}

class Label3 extends Component {

    pressyoushi() {
        this.props.selectPress && this.props.selectPress(this.props.text)
    }

    render() {
        isSelected = this.props.isSelected;
        if (isSelected === -1) {
            //没选中
            return (
                <TouchableOpacity onPress={this.pressyoushi.bind(this)}
                                  style={{width:156*myscale,height:60*myscale,marginHorizontal:10*myscale,justifyContent:'center'
                ,borderRadius:10*myscale, borderColor:'#5d6d81',marginBottom:10*myscale,borderWidth:1*myscale,
                backgroundColor:'#fff',alignItems:'center'}}>
                    <Text style={{color:'#838f9f',fontSize:28*myscale }}>
                        {this.props.text}
                    </Text>
                </TouchableOpacity>)
        }
        else {
            //选中的样式
            return (
                <TouchableOpacity onPress={this.pressyoushi.bind(this)}
                                  style={{width:156*myscale,height:60*myscale,marginHorizontal:10*myscale,justifyContent:'center'
                ,borderRadius:10*myscale, borderColor: '#1da9fc',marginBottom:10*myscale,borderWidth:1*myscale,
                backgroundColor:'#fff',alignItems:'center'}}>
                    <Text style={{color:'#1da9fc',fontSize:28*myscale}}>
                        {this.props.text}
                    </Text>
                </TouchableOpacity>)
        }

    }
}

class Label4 extends Component {
    //劣势
    presslieshi() {
        this.props.selectPress && this.props.selectPress(this.props.text)
    }

    render() {
        isSelected = this.props.isSelected;
        if (isSelected === -1) {
            //没选中
            return (
                <TouchableOpacity onPress={this.presslieshi.bind(this)}
                                  style={{width:156*myscale,height:60*myscale,marginHorizontal:10*myscale,justifyContent:'center'
                ,borderRadius:10*myscale, borderColor:'#5d6d81',marginBottom:10*myscale,borderWidth:1*myscale,
                backgroundColor:'#fff',alignItems:'center'}}>
                    <Text style={{color:'#838f9f',fontSize:28*myscale }}>
                        {this.props.text}
                    </Text>
                </TouchableOpacity>)
        }
        else {
            //选中的样式
            return (
                <TouchableOpacity onPress={this.presslieshi.bind(this)}
                                  style={{width:156*myscale,height:60*myscale,marginHorizontal:10*myscale,justifyContent:'center'
                ,borderRadius:10*myscale, borderColor: '#f43f3c',marginBottom:10*myscale,borderWidth:1*myscale,
                backgroundColor:'#fff',alignItems:'center'}}>
                    <Text style={{color:'#f43f3c',fontSize:28*myscale}}>
                        {this.props.text}
                    </Text>
                </TouchableOpacity>)
        }

    }
}

const styles = StyleSheet.create({
    radio1: {
        //建议 未选中 ；优势选中
        width: 156 * myscale,
        height: 68 * myscale,
        borderColor: '#1da9fc',
        borderWidth: 1 * myscale,
        borderRadius: 5,
        margin: 10 * myscale,
        justifyContent: 'center'
    }
})