/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Button,
    TouchableOpacity,
    ListView,
    RefreshControl,
} from 'react-native';
import TitleBar from './TitleBar';
import PersonalInformation from './PersonalInformation';

import TestQrcode from './TestQrcode';
import MyDimension from './MyDimensions';
import LinearGradient from 'react-native-linear-gradient';
import {getPersons} from '../actions'
const myscale = MyDimension.myscale;
const pi = MyDimension.pi;

var titlename = "招贤馆";

let persons = [];
/*for (var i = 0; i < 7; i++) {
 let person = {
 sid: 111,
 job: "程序员",
 name: "李卓原" + i,
 sex: 1,
 before: "上海缔安科技股份有限公司",
 school: '浙江大学',
 profession: "网络工程",
 result: "IFNS专业型",
 score: "100",
 alltime: '13分55秒',
 paperendtime: '2-21 14:05',
 starttime: '2015-07',
 endtime: '2017-04',
 type: '校招', //校招和社招
 department: '技术部',
 nativeplace: '吉林',
 matrimonial_res: '单身狗',
 idcard: '220303199301211234',
 tel: '13500967727',
 highest_education: '本科',
 linguistic_capacity: '英语4级',
 post: '项目经理',
 hobby: ['兴趣1', '兴趣2'],
 email: 'zhuoyuan93@gmail.com',
 evaluateadvice: '强烈推荐',
 };
 persons[i] = person;
 }*/


export default class Zhao extends Component {

    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows([]),
            shesize: 0,
            xiaosize: 0,
            isRefreshing: false,
        };
    }

    componentDidMount() {
        this.getDataFromFetch();
    }

    componentWillReceiveProps(nextProps) {
        let {pageModel} = nextProps;
        let {zhaoxianguan} = pageModel;
        this.setState({isRefreshing: true});
        if (zhaoxianguan) {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(zhaoxianguan.persons),
                shesize: zhaoxianguan.shesize,
                xiaosize: zhaoxianguan.xiaosize,
                isRefreshing: false,
            });
        }
    }

    getDataFromFetch() {
        let {pageModel} = this.props;
        let {PageData} = pageModel;
        let {orgUniqueid} = PageData;
        let postData = {
            orgid: orgUniqueid
        };
        getPersons(this.props.dispatch, postData);
    }

    back() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _pressButtonRight() {
        const {navigator} = this.props;
        //为什么这里可以取得 props.navigator?请看上文:
        //<Component {...route.params} navigator={navigator} />
        //这里传递了navigator作为props
        if (navigator) {
            navigator.push({
                name: 'TestQrcode',
                component: TestQrcode,
                index: 3,
                params: {
                    name: "李卓原",
                    zhiwei: '程序员',
                }
            })
        }
    }

    render() {
        return (
            <View style={styles.flex}>
                <TitleBar rightclick={this._pressButtonRight.bind(this)}
                          leftclick={this.back.bind(this)}
                          text={titlename}/>

                <View style={{flex:1,marginTop:20*myscale,marginHorizontal:30*myscale}}>

                    <View
                        style={{flex:0,alignItems:'center',height:280*myscale,}}>
                        <LinearGradient
                            colors={['#39bcf7', '#1c89ef']}
                            style={{height:280*myscale,width:685*myscale,borderRadius:12*myscale}}>
                            <View
                            >
                                <View
                                    style={{marginTop:40*myscale,justifyContent: 'center',flexDirection: 'row',alignItems:'center'}}>
                                    <Text
                                        style={{backgroundColor:'rgba(0,0,0,0)',color:'#fff',fontSize:30*myscale}}>本月招聘统计</Text>
                                </View>
                                <View
                                    style={{marginTop:50*myscale,flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                                    <View style={{alignItems:'center'}}>
                                        <Text
                                            style={{backgroundColor:'rgba(0,0,0,0)',color:'#fff',fontSize:48*myscale}}>{this.state.xiaosize ?
                                            this.state.xiaosize : 0}</Text>
                                        <View style={{marginTop:30*myscale,}}>
                                            <Text
                                                style={{backgroundColor:'rgba(0,0,0,0)',color:'#fff',fontSize:30*myscale}}>校招笔试</Text></View>
                                    </View>
                                    <View style={{alignItems:'center'}}>
                                        <Text
                                            style={{backgroundColor:'rgba(0,0,0,0)',color:'#fff',fontSize:48*myscale}}>{
                                            this.state.shesize ? this.state.shesize : 0
                                        }</Text>
                                        <View style={{marginTop:30*myscale,}}>
                                            <Text
                                                style={{backgroundColor:'rgba(0,0,0,0)',color:'#fff',fontSize:30*myscale}}>社招笔试</Text>
                                        </View></View>
                                </View></View></LinearGradient>
                    </View>

                    <View style={{flex:1,marginTop:20*myscale}}>
                        <ListView dataSource={this.state.dataSource}
                                  enableEmptySections={true}
                                  showsVerticalScrollIndicator={false}
                                  refreshControl={
                                      <RefreshControl
                                          refreshing = {this.state.isRefreshing}
                                          onRefresh={this.getDataFromFetch.bind(this)}
                                           tintColor="#000"

                                            colors={['#000000']}
                                            progressBackgroundColor="#ffff00"
                                      />
                                  }
                                  renderRow={(rowData) => <PersonalInformation {...this.props}
                                  person={rowData}/>}/>
                    </View>
                </View></View>
        );
    }
}


const styles = StyleSheet.create({
    flex: {
        flex: 1,
        backgroundColor: '#f2f2f2'
    },
});


