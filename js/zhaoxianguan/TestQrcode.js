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
import TitleBar from './TitleBar';
import MyDimension from './MyDimensions';
import {handleUrl} from "../utils/UrlHandle";
const myscale = MyDimension.myscale;

export default class TestQrcode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showRight: false,
        };
    }

    static defaultProps = {
        name: "aaa"
    };

    back() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    render() {
        let {pageModel} = this.props;
        let {PageData} = pageModel;
        let {orgName,loginUserInfo} = PageData;
        let name = "";
        let avatarSource = "";
        let zhiwei = "";
        if (loginUserInfo !== undefined && loginUserInfo !== null) {
            let url = handleUrl(loginUserInfo.qrCodeUrl);
            if (url) {
                avatarSource = {uri: url};
            } else {
               avatarSource = null;
            }
            name = loginUserInfo.name;
            zhiwei = loginUserInfo.technicalTitle;

        }

        return (
            <View style={{flex:1,backgroundColor:'#f2f2f2'}}>
                <TitleBar showRight={this.state.showRight} style={{flex:1}}
                          leftclick={this.back.bind(this)} text="笔试邀请二维码"/>
                <View style={styles.container}>
                    <Text style={{fontSize:36*myscale,color:'#2b3d54'}}>{orgName}</Text>
                    <Image style={{marginTop:20,width:300*myscale,height:300*myscale}}
                           source={avatarSource}></Image>
                    <View style={{width:280*myscale,}}>
                        <View
                            style={{flexDirection:'row',marginVertical:15*myscale}}>
                            <Text style={{color:'#838f9f',fontSize:30*myscale,flex:1}}>邀请人</Text>
                            <Text
                                style={{fontSize:30*myscale,color:'#2b3d54'}}>
                                {name}</Text>
                        </View>
                        <View style={{flexDirection:'row',}}>
                            <Text style={{color:'#838f9f',fontSize:30*myscale,flex:1}}>职位</Text>
                            <Text
                                style={{fontSize:30*myscale,
                                color:'#2b3d54'}}>
                                {zhiwei}</Text>
                        </View>
                    </View></View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})