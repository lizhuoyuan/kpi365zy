/**
 *  更改密码
 *  create by yuanzhou 2017/0316
 *
 */

import React, {Component} from 'react'
import {
    StyleSheet,
    TouchableOpacity,
    View,
    TextInput,
    Text,
    Dimensions,
    Platform,
    Keyboard,
    Image,
    Alert,
} from 'react-native'
import TopBar from './common/TopBar'
import  * as SizeController from '../SizeController'
import ImageResource from '../utils/ImageResource'
import UpdatePassword2 from './UpdatePassword2'
import {updatePage} from '../actions'

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const topBarRatio = SizeController.getTopBarRatio();
let topHeight = SizeController.getTopHeight();
let tabBarHeight = SizeController.getTabBarHeight();
let changeRatio = SizeController.getChangeRatio();

class UpdatePassword1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passwordText: "",
            keyBoardHeight: 0,
            hidePassword: true,
            showError: false,
            errorMsg: "原密码输入错误",
        };
        this.subscriptions = null;
        this.inputRef = null;
        this.toback = this.toback.bind(this);
        this.toNext = this.toNext.bind(this);
        this.updateKeyboardSpace = this.updateKeyboardSpace.bind(this);
        this.resetKeyboardSpace = this.resetKeyboardSpace.bind(this);
    }

    toback() {
        this.inputRef && this.inputRef.blur();
        this.props.navigator.pop();
    }

    toNext() {
        let {routeInfo, navigator, pageModel,dispatch} = this.props;
        let {PageData} = pageModel;
        let {password} = PageData;
        if (password === this.state.passwordText) {
            this.inputRef && this.inputRef.blur();
            let route = {
                name: "UpdatePassword2",
                path: "none",
                component: UpdatePassword2,
                type: "UpdatePassword2",
                index: routeInfo.index,
            };

            updatePage(dispatch,{route:route});
        } else {
            if (this.state.passwordText.length < 6) {
                this.setSate({
                    showError: true,
                    errorMsg: "原密码长度应大于6位",
                });
            } else {
                this.setState({
                    showError: true,
                    errorMsg: "原密码输入错误",
                });
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        // this.inputRef && this.inputRef.focus()
    }

    componentWillMount() {
        // Keyboard events监听
        if (Platform.OS === 'ios') {
            this.subscriptions = [
                Keyboard.addListener('keyboardWillShow', this.updateKeyboardSpace),
                Keyboard.addListener('keyboardWillHide', this.resetKeyboardSpace)]
        } else {
            this.subscriptions = [
                Keyboard.addListener('keyboardDidShow', this.updateKeyboardSpace),
                Keyboard.addListener('keyboardDidHide', this.resetKeyboardSpace)]
        }
    }

    componentWillUnmount() {
        this.subscriptions.forEach((sub) => sub.remove())
    }

    componentDidMount() {
    }

    updateKeyboardSpace(frames) {
        const keyboardSpace = frames.endCoordinates.height//获取键盘高度
        this.setState({keyBoardHeight: keyboardSpace});
    }

    resetKeyboardSpace() {
        this.setState({keyBoardHeight: 0})
    }

    _onChangeText(text) {
        this.setState({
            passwordText: text,
            showError: false,
        });
    }

    _changeShowPassword() {
        this.setState({
            hidePassword: !this.state.hidePassword
        })
    }

    render() {
        let leftComponent = <TouchableOpacity style={styles.leftBtn} onPress={this.toback}>
            <Text style={styles.textBtnCanPress}>取消</Text>
        </TouchableOpacity>;
        let rightComponent = null;
        if (this.state.passwordText.length < 6) {
            rightComponent = <View style={styles.rightBtn} onPress={this.toNext}>
                <Text style={styles.textBtnNotPress}>下一步</Text>
            </View>
        } else {
            rightComponent = <TouchableOpacity style={styles.rightBtn} onPress={this.toNext}>
                <Text style={styles.textBtnCanPress}>下一步</Text>
            </TouchableOpacity>
        }
        let imageSource = ImageResource["icon-display.png"];
        if (this.state.hidePassword) {
            imageSource = ImageResource["icon-hiden.png"];
        }
        return (
            <View style={styles.container}>
                <TopBar toback={this.toback}
                        topBarText={"更改密码"}
                        topBarTextBottomShow={false}
                        topBarTextRight=""
                        showRight={true}
                        rightComponent={rightComponent}
                        showLeft={true}
                        leftComponent={leftComponent}

                />
                <View style={styles.container2}>
                    <Text style={styles.fontH1}>请输入原密码</Text>
                    {
                        this.state.showError ?
                            <Text style={styles.fontH2Error}>{this.state.errorMsg}</Text>
                            :
                            <Text style={styles.fontH2}>为保障你的数据安全，修改前请填写原密码</Text>
                    }
                    <View style={styles.textInputView}>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={(text)=>this._onChangeText(text)}
                            autoFocus={true}
                            secureTextEntry={this.state.hidePassword}
                            //returnKeyType={"done"}
                            placeholder={"请输入原密码"}
                            placeholderTextColor={"#838f9f"}
                            underlineColorAndroid={"transparent"}
                            //onSubmitEditing={this.toNext}
                            ref={(ref)=>this.inputRef=ref}
                        >
                        </TextInput>
                        <TouchableOpacity onPress={()=>this._changeShowPassword()} style={styles.imageBtn}>
                            <Image style={styles.imageStyle} source={imageSource}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{height:this.state.keyBoardHeight}}>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(248,248,248)",
        alignItems: "center",
    },
    container2: {
        flex: 1,
        paddingTop: topHeight + 100 * changeRatio,
        backgroundColor: "rgb(248,248,248)",
        alignItems: "center",
    },
    hiddenStyle: {
        flex: 0,
        width: deviceWidth,
        backgroundColor: "rgb(248,248,248)",
    },
    textBtnCanPress: {
        fontSize: 17 * topBarRatio,
        color: "#ffffff",
    },
    textBtnNotPress: {
        fontSize: 17 * topBarRatio,
        color: "rgba(255,255,255,0.3)",
    },
    leftBtn: {
        paddingLeft: 10 * topBarRatio
    },
    rightBtn: {
        paddingRight: 10 * topBarRatio
    },
    fontH1: {
        fontSize: 18 * changeRatio,
        color: "#2b3d54",
    },
    fontH2: {
        marginTop: 10 * changeRatio,
        marginBottom: 40 * changeRatio,
        fontSize: 12 * changeRatio,
        color: "#838f9f",
    },
    fontH2Error: {
        marginTop: 10 * changeRatio,
        marginBottom: 40 * changeRatio,
        fontSize: 12 * changeRatio,
        color: "#f43f3c",
    },
    textInput: {
        flex: 1
    },
    textInputView: {
        height: 50 * changeRatio,
        paddingLeft: 20 * changeRatio,
        paddingRight: 48 * changeRatio,
        width: deviceWidth,
        flex: 0,
        backgroundColor: "#ffffff",
    },
    imageBtn: {
        position: "absolute",
        flex: 1,
        width: 48 * changeRatio,
        height: 50,
        right: 0,
        justifyContent: "center",
        alignItems: "center"
    },
    imageStyle: {
        width: 18,
        height: 18
    }
});

export default UpdatePassword1;