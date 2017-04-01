import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';
import YingpinXiangqing from './YingpinXiangqing';
import MyDimensions from './MyDimensions';
import moment from 'moment';

const myscale = MyDimensions.myscale;

export default class PersonalInformation extends Component {


    _itemClick() {
        const {navigator, person} = this.props;
        if (navigator) {
            navigator.push({
                name: 'yingpinzhexiangqing',
                component: YingpinXiangqing,
                index: 3,
                params: {
                    person: person,
                    score: person.score,
                    department: '技术部',
                    job: person.job,
                    titlename: person.name,
                }

            })
        }
    }

    render() {
        let {person} = this.props;
        return (
            <TouchableOpacity onPress={this._itemClick.bind(this)}
                              style={{marginBottom:20*myscale,borderRadius:12*myscale,backgroundColor:'#fff',borderColor:'#e5e5e5',borderWidth:1}}
            >
                <View>
                    <View
                        style={{height:80*myscale,borderBottomWidth:1,borderBottomColor:'#ddd',paddingHorizontal:30*myscale,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <Text style={{color:'#2b3d54',fontSize:36*myscale}}>{person.job}</Text>
                        {person.type == '社招' ?
                            <Image
                                source={require('./img/tag-blue.png')}>
                                <View style={{flex:1,justifyContent:'center'}}>
                                    <Text
                                        style={{backgroundColor:"rgba(0,0,0,0)",color:'#fff',marginLeft:18}}>
                                        {person.type}
                                    </Text>
                                </View>
                            </Image>
                            :
                            < Image
                                source={require('./img/tag-green.png')}>
                                <View style={{flex:1,justifyContent:'center'}}>
                                    <Text
                                        style={{color:'#fff',backgroundColor:"rgba(0,0,0,0)",marginLeft:18}}>
                                        {person.type}
                                    </Text>
                                </View>
                            </Image>}
                    </View>
                    <View
                        style={{marginTop:20*myscale,justifyContent:'center',flexDirection:'row',alignItems:'flex-end'}}>
                        <View style={{marginRight:3 ,}}>
                            <Text
                                style={{fontSize:34*myscale,color:'#2d3b54',textAlignVertical:'bottom'}}>{person.name}
                            </Text></View>
                        <View style={{flexDirection:'row',alignItems:'flex-end',}}>
                            {person.sex == 0 ?
                                <Image source={require('./img/icon-female.png')}/> :
                                <Image source={require('./img/icon-male.png')}/>}
                        </View>
                    </View>
                    <View
                        style={{marginTop:20*myscale,justifyContent:'center',flexDirection:'row',alignItems:'center'}}>
                        <Text
                            style={styles.greyworld}>{person.type == '社招' ? person.before : person.school} </Text>
                        <View style={styles.lineVertical}></View>
                        <Text
                            style={styles.greyworld}>{person.type == '社招' ? person.post : person.profession} </Text>
                    </View>
                    <View
                        style={{marginTop:20*myscale,paddingHorizontal:30*myscale,justifyContent:'space-between',flexDirection:'row'}}>
                        <View style={{flex:1,alignItems:"flex-start"}}>
                            <Text style={styles.greyworld}>性格测试 : <Text
                                style={styles.blueworld}>{person.result ? person.result : '无'}</Text></Text></View>
                        <View style={{alignItems:"flex-end"}}>
                            <Text style={styles.greyworld}>专业技能 : <Text
                                style={styles.blueworld}>{person.score ? person.score + '分' : '无'}</Text></Text></View>
                    </View>

                    <View
                        style={{marginVertical:15*myscale,paddingHorizontal:30*myscale,justifyContent:'space-between',flexDirection:'row'}}>
                        <View style={{flex:1,alignItems:"flex-start"}}>
                            <Text
                                style={styles.smallWord}>笔试用时 :
                                <Text>{person.alltime ? person.alltime : '无'}</Text></Text>
                        </View>
                        <View style={{alignItems:"flex-end"}}>
                            <Text
                                style={styles.smallWord}>交卷时间 :
                                <Text>{person.paperendtime ? moment(person.paperendtime).format(' M-DD hh:mm') : '无'}</Text></Text>
                        </View></View>
                </View>
            </TouchableOpacity >)
    }
}


const styles = StyleSheet.create({
    lineVertical: {
        width: 1,
        height: 13,
        backgroundColor: '#838f9f',
        marginHorizontal: 10,
    },
    smallWord: {
        fontSize: 22 * myscale,
        color: '#a2abb7',
    },
    greyworld: {
        fontSize: 26 * myscale, color: '#838f9f'
    },
    blueworld: {
        fontSize: 26 * myscale, color: '#1da9fc'
    }
});
