/**
 * Created by 卓原 on 2017/2/27.
 * 应聘者详情页面，包含个人信息，评估历史和文化认同3个页面的总页面
 */

import React, {Component} from 'react';
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet
} from 'react-native';
import Title from './TitleBar';
import MyDimensions from './MyDimensions';
import ScrollableTabView, {DefaultTabBar,} from 'react-native-scrollable-tab-view';
import PersonalProfile from './PersonalProfile';
import CulturalIdentity from './CulturalIdentity'
import EvaluationHistory from './EvaluationHistory';
import InterviewEvaluation from './InterviewEvaluation';
import {getXiangQing} from '../actions';
import LinearGradient from 'react-native-linear-gradient';


const myscale = MyDimensions.myscale;

export default class YingpinXiangqing extends Component {


    constructor(props) {
        super(props);

        this.state = {
            showRight: false,
            person: {},
        };
        this.back = this.back.bind(this);

    }

    componentDidMount() {
        this.getDataFromFetch();
    }

    componentWillReceiveProps(nextProps) {
        let {pageModel} = nextProps;
        let {zhaoxianguan} = pageModel;
        if (zhaoxianguan) {
            this.setState({
                person: zhaoxianguan.person,
                // p: zhaoxianguan.p,
            });
        }
    }

    getDataFromFetch() {

        let postData = {
            ApplicantSid: this.props.person.ApplicantSid,
            HrRecruitinfoSid: this.props.person.HrRecruitinfoSid,
        };
        getXiangQing(this.props.dispatch, postData);
    }

    back() {
        const {navigator, person} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    toEvaluation() {
        const {navigator, person, score, job, titlename} = this.props;
        if (navigator) {
            navigator.push({
                name: 'interviewEvaluation',
                component: InterviewEvaluation,
                index: 4,
                params: {
                    person: person,
                    score: score,
                    job: job,
                    titlename: titlename
                }
            })
        }
    }

    render() {
        let {person} = this.state;
        let {score, job, titlename} = this.props;
        let {pageModel} = this.props;
        let {PageData} = pageModel;
        let {loginUserInfo} = PageData;
        if(!person){
            person = {};
        }
        let s = -1;
        if(person.inviter){
            s = person.inviter.indexOf(loginUserInfo.userUniqueid);
        }
       // alert(person.inviter+',')
        //面试评估显示逻辑：返回的list列表包含该userUniqueid则为以评估
        return (
            <View style={{backgroundColor:'#f2f2f2',flex:1}}>
                <Title leftclick={this.back} showRight={this.state.showRight} text={titlename}/>
                <LinearGradient
                    start={{x: 0, y: 1}} end={{x: 1, y: 1}}
                    locations={[0.5,1]}
                    colors={['#39bcf7', '#1c89ef']}>
                    <View
                        style={{alignItems:'center',
                    height:280*myscale,paddingTop:30*myscale}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            {/* <Text
                             style={{fontSize:34*myscale,color:'#fff'}}>{department}</Text>
                             <View
                             style={{width:1,height:48*myscale,backgroundColor:'#fff',marginHorizontal:5}}></View>*/}
                            <Text
                                style={{backgroundColor:'rgba(0,0,0,0)',fontSize:34*myscale,color:'#fff'}}>{job}</Text>
                        </View>
                        <Text
                            style={{backgroundColor:'rgba(0,0,0,0)',fontSize:26*myscale,color:'#fff',marginVertical:30*myscale}}>专业技能 {score ? score + '分' : '无'}</Text>

                        {s>-1?
                            //person.inviter ?
                            <View
                                style={{backgroundColor:'#f2f2f2',borderRadius:25,justifyContent:'center',alignItems:'center',
                    width:240*myscale,height:80*myscale}}>
                                <Text
                                    style={{color:'#a2abb7',fontSize:34*myscale,textAlign:'center',textAlignVertical:'center'}}
                                >已面试</Text>
                            </View> :
                            <TouchableOpacity onPress={this.toEvaluation.bind(this)}
                                              style={{backgroundColor:'#fff',borderRadius:25,justifyContent:'center',alignItems:'center',
                    width:240*myscale,height:80*myscale}}>
                                <Text
                                    style={{color:'#4a9df8',fontSize:34*myscale,textAlign:'center',textAlignVertical:'center'}}
                                >面试评估</Text>
                            </TouchableOpacity>
                        }

                    </View></LinearGradient>

                <ScrollableTabView
                    style={{alignItems:'center',backgroundColor:'#fff'}}
                    locked={false} //表示手指是否能拖动视图，默认为false（表示可以拖动）。设为true的话，我们只能“点击”Tab来切换视图。
                    renderTabBar={() => <DefaultTabBar tabBarUnderlineColor="red" />}
                    tabBarUnderlineStyle={{backgroundColor:"#1da9fc",height:4*myscale}}
                    tabBarActiveTextColor="#1da9fc"
                    tabBarInactiveTextColor="#5d6d81"
                    tabBarTextStyle={{fontSize: 30*myscale,fontWeight:'normal'}}>
                    <PersonalProfile {...this.props} tabLabel='个人资料'/>
                    <CulturalIdentity {...this.props} tabLabel='文化认同'/>
                    <EvaluationHistory {...this.props}
                        tabLabel='评估历史'/>
                </ScrollableTabView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tabtext: {
        color: '#5d6d81',
        fontSize: 30 * myscale,

    },
})
