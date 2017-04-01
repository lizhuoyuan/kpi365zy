/**
 * Created by 卓原 on 2017/3/6.
 */
import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import MyDimensions from './MyDimensions';
import {getWenhua} from '../actions';

const myscale = MyDimensions.myscale;

export default class CulturalIdentity extends Component {


    constructor(props) {
        super(props);
        this.state = {
            wenhua: {}
        }
    }

    componentDidMount() {
       // alert(this.props.person.result)
        if (this.props.person.result != null || this.props.person.result != undefined||this.props.person.result!="") {
            this.getDataFromFetch();
        }
    }

    componentWillReceiveProps(nextProps) {
        let {pageModel} = nextProps;
        let {zhaoxianguan} = pageModel;
        if (zhaoxianguan) {
            this.setState({
                wenhua: zhaoxianguan.wenhua,
                // p: zhaoxianguan.p,
            });
        }
    }

    getDataFromFetch() {
        let postData = {
            ClsExamanswerType: this.props.person.result,
        };
        getWenhua(this.props.dispatch, postData);
    }

    render() {
        let {wenhua} = this.state;
        return <ScrollView>
            {wenhua.result === null || wenhua.result === undefined || wenhua.result === '' ? null : <View>
                    <View
                        style={{backgroundColor:'#e5e5e5',height:148*myscale,alignItems:'center',justifyContent:'center'}}>
                        <Text
                            style={{color:'#1da9fc',fontSize:36*myscale,}}>{wenhua.result}</Text>
                    </View>
                    <View style={{margin:40*myscale}}>
                        <Text style={styles.resulttext}>{wenhua.content}</Text>
                    </View>
                    <View
                        style={{backgroundColor:'#e5e5e5',height:88*myscale,paddingTop:44*myscale,
            paddingLeft:40*myscale}}>
                        <Text style={{color:'#5d6d81',fontSize:26*myscale}}>潜在缺点</Text>
                    </View>
                    <Text style={[{margin:40*myscale},styles.resulttext]}>{wenhua.shortcoming}</Text>
                </View>}
        </ScrollView>
    }
}

const styles = StyleSheet.create({
    resulttext: {
        fontSize: 28 * myscale,
        color: '#2b3d54',
        lineHeight: parseInt(45 * myscale),
    },
})