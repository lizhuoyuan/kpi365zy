/**
 * Created by 卓原 on 2017/3/6.
 * 个人资料页面
 */
import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, ListView} from 'react-native';
import MyDimensions from './MyDimensions';
import {getXiangQing} from '../actions';


const myscale = MyDimensions.myscale;

export default class PersonalProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            person: {},
        };
    }

    componentDidMount() {
        this.getDataFromFetch();
    }

    //更新页面信息
    componentWillReceiveProps(nextProps) {
        let {pageModel} = nextProps;
        let {zhaoxianguan} = pageModel;
        if (zhaoxianguan) {
            this.setState({
                person: zhaoxianguan.person,
            });
        }
    }

    //获取个人信息数据
    getDataFromFetch() {
        let postData = {
            ApplicantSid: this.props.person.ApplicantSid,
            HrWorkSid: this.props.person.HrWorkSid,
            ClsExamanswerType: this.props.person.result,
            HrRecruitinfoSid: this.props.person.HrRecruitinfoSid,
        };
        getXiangQing(this.props.dispatch, postData);
    }

    /*
     before: dataTemp.Company,
     post: dataTemp.Job,
     starttime: dataTemp.Startdate,
     endtime: dataTemp.Enddate,
     * */
    render() {
        let {person} = this.state;


        if (!person) {
            person = {};
        }
        let birth = "";

        if (person.idcard) {
            if (person.idcard.length == 18) {
                birth = '****** ' + person.idcard.substring(6, 10) + ' ' + person.idcard.substring(10, 12)
                    + ' ' + person.idcard.substring(12, 14) + ' ****';
            } else if (person.idcard.length === 15) {
                birth = '***** ' + person.idcard.substring(6, 8) + ' ' + person.idcard.substring(8, 10)
                    + ' ' + person.idcard.substring(10, 12) + ' **';
            }
        }
        let tel = '';
        if (person.tel) {
            if (person.tel.length === 11) {
                tel = person.tel.replace(/\B(?=(?:\d{4})+$)/g, ' ')
            }
        }

        let HobbyComponent = [];
        if (person != null && person != undefined && person.hobby) {
            HobbyComponent = person.hobby.map((obj, index) => {
                return <View key={index} style={styles.t2View}><Text style={styles.t2}>{obj}</Text></View>
            });
        }
        let work = [];
        let alb = [1,2,3,4,5];
        let zw = ['一','二','三','四','五'];
        if (person != null && person != undefined && person.works) {
            work = person.works.map((obj, index) => {
                return <View key={index}><SmallTitle text={"工作经历"+ zw[alb.indexOf(parseInt(index)+1)]}/>
                    <BasicText textleft='单位名称' textright={obj.Company}/>
                    <BasicText textleft='职务名称' textright={obj.Job}/>
                    <BasicText textleft='开始时间' textright={obj.Startdate}/>
                    <BasicText textleft='结束时间' textright={obj.Enddate}/></View>
            });
        }


        return <ScrollView >
            <SmallTitle text="基本信息"/>
            <BasicText textleft='姓名' textright={person.name}/>
            <BasicText textleft='性别' textright={person.sex==1?'男':'女'}/>
            <BasicText textleft='籍贯' textright={person.nativeplace}/>
            <BasicText textleft='婚育状况' textright={person.matrimonial_res}/>
            <BasicText textleft='身份证号码' textright={birth}/>
            <BasicText textleft='手机' textright={tel}/>
            <BasicText textleft='邮箱' textright={person.email}/>

            <SmallTitle text="教育经历"/>
            <BasicText textleft='最高学历' textright={person.highest_education}/>
            <BasicText textleft='语言能力' textright={person.linguistic_capacity}/>
            <BasicText textleft='学校' textright={person.school}/>
            <BasicText textleft='专业' textright={person.profession}/>

            {work}

            <SmallTitle text="兴趣爱好"/>
            <View style={{height:140*myscale,flexDirection:'row',alignItems:'center',paddingVertical:40*myscale
            ,paddingLeft:30*myscale}}>
                {HobbyComponent}
            </View>
            <View style={{height:100*myscale,backgroundColor:'#f2f2f2',borderBottomWidth:1*myscale,
            borderTopWidth:1*myscale,borderColor:'#e5e5e5'}}/>
        </ScrollView >
    }
}

class SmallTitle extends Component {
    render() {
        return <View
            style={{backgroundColor:'#e5e5e5',height:88*myscale,paddingTop:44*myscale,
            paddingLeft:40*myscale,paddingBottom:10*myscale }}>
            <Text style={{color:'#838f9f',fontSize:26*myscale}}>{this.props.text}</Text>
        </View>
    }
}

class BasicText extends Component {
    render() {

        return <View
            style={{height:80*myscale,alignItems:'center',marginHorizontal:40*myscale,
            flexDirection:'row',justifyContent:'space-around',borderColor:'#E5E5E5',borderBottomWidth:1*myscale}}>
            <View style={{flex:1,alignItems:"flex-start"}}>
                <Text style={styles.tt}>{this.props.textleft}</Text>
            </View>
            <View style={{alignItems:"flex-end"}}>
                <Text style={styles.rightt}>{this.props.textright}</Text>
            </View>

        </View>
    }
}

const styles = StyleSheet.create({
    tt: {
        fontSize: 30 * myscale,
        color: '#5d6d81',
    },

    t2: {
        fontSize: 30 * myscale,
        color: '#5d6d81',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    t2View: {
        height: 60 * myscale,
        width: 140 * myscale,
        borderWidth: 1 * myscale,
        borderColor: '#c7cfd8',
        borderRadius: 5 * myscale,
        flex: 0,
        marginRight: 40 * myscale,
        alignItems: 'center',
        justifyContent: 'center'
    },
    rightt:{
        fontSize: 30 * myscale,
        color: '#2b3d54',
    }
})