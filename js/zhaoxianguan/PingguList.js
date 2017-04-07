/**
 * Created by 卓原 on 2017/3/30.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';
import MyDimensions from './MyDimensions';
import moment from 'moment';

const myscale = MyDimensions.myscale;
export default class PingguList extends Component {


    render() {
        let {pinggu} = this.props;
        //let youshi = ['专业吻合', '价值观匹配'];
        //let lieshi = ['专业不符', '价值观不符', '经验欠缺'];
        let youshi = [];
        let lieshi = [];
        let ad = pinggu.advan;
        if (ad) {
            youshi = ad;
        }
        let disad = pinggu.disadvan;
        if (disad) {
            lieshi = disad;
        }
        let tests = [];
        for (let i = 0; i < youshi.length; i++) {
            if (youshi[i].length < 5) {
                let test =
                    <View key={i}
                          style={{marginLeft:25*myscale,alignItems:"center",flex:0,height:60*myscale,marginTop:30*myscale}}>
                        <Image source={require('./img/tag-evaluate.png')}>
                            <View style={{flex:1,
                        justifyContent:'center',marginLeft:40*myscale}}>
                                <Text
                                    style={{fontSize:28*myscale,color:'#1da9fc',}}>{youshi[i]}</Text></View>
                        </Image>
                    </View>
                tests.push(test);
            } else {
                let test =
                    <View key={i}
                          style={{marginLeft:25*myscale,alignItems:"center",flex:0,height:60*myscale,marginTop:30*myscale}}>
                        <Image source={require('./img/tag-evaluate-L.png')}>
                            <View style={{flex:1,
                        justifyContent:'center',alignItems:'center',marginLeft:25*myscale}}>
                                <Text
                                    style={{fontSize:28*myscale,color:'#1da9fc',}}>{youshi[i]}</Text></View>
                        </Image>
                    </View>
                tests.push(test);
            }
        }
        for (let i = 0; i < lieshi.length; i++) {
            if (lieshi[i].length < 5) {
                let test =
                    <View key={i+youshi.length}
                          style={{marginLeft:30*myscale,alignItems:"center",flex:0,height:60*myscale,marginTop:30*myscale}}>
                        <Image source={require('./img/tag-evaluate.png')}>
                            <View style={{flex:1,
                        justifyContent:'center',marginLeft:40*myscale}}>
                                <Text
                                    style={{fontSize:28*myscale,color:'#f43f3c',}}>{lieshi[i]}</Text></View>
                        </Image>
                    </View>
                tests.push(test);
            } else {
                let test =
                    <View key={i+youshi.length}
                          style={{marginLeft:30*myscale,alignItems:"center",flex:0,height:60*myscale,marginTop:30*myscale}}>
                        <Image source={require('./img/tag-evaluate-L.png')}>
                            <View style={{flex:1,
                        justifyContent:'center',alignItems:'center',marginLeft:25*myscale}}>
                                <Text
                                    style={{fontSize:28*myscale,color:'#f43f3c',}}>{lieshi[i]}</Text></View>
                        </Image>
                    </View>
                tests.push(test);
            }
        }
        let tt = null;
        if (pinggu.evaluateadvice && pinggu.evaluateadvice.length == 3) {

            tt = <Text
                style={{fontSize:36*myscale,color:'#f43f3c',
                        marginLeft:20*myscale,marginVertical:40*myscale}}>{pinggu.evaluateadvice}</Text>

        }
        {
            if (pinggu.evaluateadvice && pinggu.evaluateadvice.length == 3) {
                tt = <Text
                    style={{fontSize:36*myscale,color:'#f43f3c',
                        marginLeft:20*myscale,marginVertical:40*myscale}}>{pinggu.evaluateadvice}</Text>

            }
        }
        return (
            pinggu.evaluateadvice === "" || pinggu.evaluateadvice === null || pinggu.evaluateadvice === undefined ? null :
                <View style={{marginTop:20*myscale,}}>
                    <View
                        style={{flex:0,backgroundColor:'#fff',marginTop:10*myscale,paddingVertical:30*myscale}}>


                        <View style={{
                    flexDirection:'row',paddingHorizontal:30*myscale,alignItems:'flex-end'}}>
                            <View
                                style={{height:80*myscale,width:80*myscale,justifyContent:'center',
                    alignItems:'center', borderRadius:40*myscale,borderWidth:1*myscale,borderColor:'#838f9f'}}>
                                <Image
                                    style={{borderRadius:40*myscale,height:80*myscale,width:80*myscale}}
                                    source={{uri:pinggu.avatorurl}}/>
                            </View>
                            <View style={{paddingLeft:12*myscale}}>
                                <Text
                                    style={{fontSize:34*myscale,color:'#2b3d54'}}>{pinggu.name}</Text>
                                <Text
                                    style={{marginTop:10*myscale,fontSize:24*myscale,color:'#a2abb7'}}>{moment(pinggu.evaluatedonetime).format("M月DD日 HH: mm")}</Text>
                            </View>
                        </View>

                        <View style={{flexDirection:'row',paddingHorizontal:30*myscale,alignItems:'flex-end'}}>
                            <View style={{marginTop:48*myscale}}>
                            <Text
                                style={{fontSize:26*myscale,color:'#838f9f',}}>聘用建议</Text></View>

                            {pinggu.evaluateadvice != null && pinggu.evaluateadvice.length == 4 ?
                                <Text
                                    style={{fontSize:36*myscale,color:'#3fbb23',
                        marginLeft:20*myscale,}}>{pinggu.evaluateadvice}</Text> : null
                            }
                            {pinggu.evaluateadvice != null && pinggu.evaluateadvice.length == 3 ?
                                <Text
                                    style={{fontSize:36*myscale,color:'#f43f3c',
                        marginLeft:20*myscale}}>{pinggu.evaluateadvice}</Text> : null
                            }
                        </View>
                        <Text
                            style={{marginTop:40*myscale,fontSize:26*myscale,color:'#838f9f',paddingHorizontal:30*myscale,}}>评估标签</Text>
                        <View
                            style={{flex:0,flexWrap:"wrap",flexDirection:'row'}}>
                            {tests}
                        </View>
                    </View></View>
        );
    }
}