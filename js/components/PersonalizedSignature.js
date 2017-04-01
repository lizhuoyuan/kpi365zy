/**
 * 个性签名页
 * Created by yuanzhou on 17/01.
 */
import React from 'react'
import {View, StyleSheet, TextInput, Text, TouchableOpacity} from 'react-native'
import TopBar from './common/TopBar'
import {updatePersonalizedSignature} from '../actions'
import * as SizeController from '../SizeController'
let topHeight = SizeController.getTopHeight();
let tabBarHeight = SizeController.getTabBarHeight();
let changeRatio = SizeController.getChangeRatio();
const PersonalizedSignature = React.createClass({
    getInitialState(){
        return {
            signature: "",
            isFirstInit: true
        }
    },
    onChangeText(text){
        this.setState({signature: text})
    },
    toComplete(){
        let {dispatch, pageModel} = this.props;
        let PageData = pageModel.PageData;
        let postData = {
            token: PageData.token,
            userUniqueid: PageData.userUniqueid,
            orgUniqueid: PageData.orgUniqueid,
            type: "updateSignature",
            signature: this.state.signature
        }
        let obj = {
            route: null,
            toBack: true
        }
        updatePersonalizedSignature(dispatch, postData, obj);
    },
    toback(){
        this.props.navigator.pop();
    },
    render(){
        let PageData = this.props.pageModel.PageData;
        let loginUserInfo = PageData.loginUserInfo;
        if (loginUserInfo) {
            if (loginUserInfo.description && this.state.isFirstInit) {
                this.state.signature = loginUserInfo.description;
                this.state.isFirstInit = false;
            }
        }
        let rightComponent = <TouchableOpacity
            onPress={this.toComplete}
            style={{justifyContent: "center",marginRight: 5}}
        >
            <Text style={{color: "#ffffff",fontSize: 17}}>完成</Text>
        </TouchableOpacity>;
        return (
            <View style={styles.container}>
                <TopBar
                    toback={this.toback}
                    layoutStyle={this.props.layoutStyle}
                    topBarText="个性签名"
                    topBarTextRight=""
                    showRight={false}
                    showLeft={true}
                    showRightImage={true}
                    rightComponent={rightComponent}
                />
                <View style={styles.textAreaView}>
                    <TextInput returnKeyType="default"
                               maxLength={32}
                               onKeyPress={this._onKeyPress}
                               underlineColorAndroid={'transparent'}
                               placeholder={'请填写个性签名'}
                               defaultValue={this.state.signature}
                               onChangeText={this.onChangeText}
                               style={styles.textArea}
                               multiline={true}>
                    </TextInput>
                    <Text style={{position: "absolute",right: 10,bottom: 10}}>{32 - this.state.signature.length}</Text>
                </View>
            </View>
        )
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(248,248,248)"
    },
    textAreaView: {
        marginTop: topHeight + 5,
        height: 80,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        flex: 0
    },
    textArea: {
        flex: 1,
        fontSize: 16,
        padding: 10,
        marginBottom: 0
    }
});
export default PersonalizedSignature;