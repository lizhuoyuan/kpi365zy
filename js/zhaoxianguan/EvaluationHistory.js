/**
 * Created by 卓原 on 2017/3/6.
 * 评估历史页面
 */
import React, {Component} from 'react';
import {View, Text, Image, ListView} from 'react-native';
import MyDimensions from './MyDimensions';
import {getPinggu} from '../actions';
const myscale = MyDimensions.myscale;
import PingguList from './PingguList';

export default class EvaluationHistory extends Component {

    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            pinggus: [],
            dataSource: ds.cloneWithRows([]),
        };
        /** **/

    }

    componentDidMount() {
        this.getDataFromFetch();
    }

    //网络请求，获得评估历史
    getDataFromFetch() {
        let postData = {HrRecruitinfoSid: this.props.person.HrRecruitinfoSid}
        getPinggu(this.props.dispatch, postData);
    }

    componentWillReceiveProps(nextProps) {

        let {pageModel} = nextProps;
        let {zhaoxianguan} = pageModel;
        if (zhaoxianguan) {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(zhaoxianguan.pinggus),
            });
        }

    }

    render() {
        let {pinggus} = this.state;
        return (<View style={{backgroundColor:'#f2f2f2',flex:1}}>
                <ListView
                    enableEmptySections={true}
                    showsVerticalScrollIndicator={false}
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => <PingguList {...this.props} pinggu={rowData}/>}
                />
            </View>

        )

    }
}