/**
 *  更改密码
 *  create by yuanzhou 2017/0316
 *
 */

import React, {Component} from 'react'
import {
    Animated,
    Easing,
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
import {logoutAction, updateUserPassword} from '../actions'
import Login from './Login'

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
let topHeight = SizeController.getTopHeight();
const topBarRatio = SizeController.getTopBarRatio();
let tabBarHeight = SizeController.getTabBarHeight();
let changeRatio = SizeController.getChangeRatio();

class UpdatePassword2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            passwordText: "",
            keyBoardHeight: 0,
            hidePassword: true,
            showError: false,
            errorMsg: "原密码输入错误",
            changeSuccess: false,
            slideValue: new Animated.Value(0),
        };
        this.subscriptions = null;
        this.inputRef = null;
        this.toback = this.toback.bind(this);
        this.doSuccess = this.doSuccess.bind(this);
        this.toComplete = this.toComplete.bind(this);
        this.updateKeyboardSpace = this.updateKeyboardSpace.bind(this);
        this.resetKeyboardSpace = this.resetKeyboardSpace.bind(this);
    }

    toback() {
        this.inputRef && this.inputRef.blur();
        this.props.navigator.pop();
    }

    toComplete() {
        let {PageData} = this.props.pageModel;
        let {password} = PageData;
        if (password !== this.state.passwordText) {
            this.inputRef && this.inputRef.blur();
            this.props.dispatch(updateUserPassword(this.state.passwordText, {fetching_success: true}));
        } else {
            if (this.state.passwordText.length < 6) {
                this.setState({
                    showError: true,
                    errorMsg: "新密码长度应大于6位",
                });
            } else {
                this.setState({
                    showError: true,
                    errorMsg: "新旧密码一致，请修改",
                });
            }
        }
    }

    doSuccess() {
        let {dispatch, navigator} = this.props;
        this.setState({
            changeSuccess: true
        });
        Animated.timing(this.state.slideValue, {
            toValue: deviceHeight - topHeight - 250 * changeRatio,
            duration: 1000,
            easing: Easing.in(Easing.ease)
        }).start();
        setTimeout(() => {
            logoutAction(dispatch);
            let route = {
                name: 'Login',
                type: 'Login',
                path: 'none',
                component: Login,
                index: 0,
            };
            navigator.resetTo(route);
        }, 2000);
    }

    componentWillReceiveProps(nextProps) {
        let {fetching_success} = nextProps.pageModel.PageData;
        if (fetching_success) {
            this.doSuccess();
        }
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
            rightComponent = <View style={styles.rightBtn}>
                <Text style={styles.textBtnNotPress}>完成</Text>
            </View>
        } else {
            rightComponent = <TouchableOpacity style={styles.rightBtn} onPress={this.toComplete}>
                <Text style={styles.textBtnCanPress}>完成</Text>
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
                        showRight={!this.state.changeSuccess}
                        rightComponent={rightComponent}
                        showLeft={!this.state.changeSuccess}
                        leftComponent={leftComponent}

                />
                <View style={styles.container2}>
                    { !this.state.changeSuccess && <Text style={styles.fontH1}>请输入新密码</Text>}
                    {!this.state.changeSuccess && this.state.showError &&
                    < Text style={styles.fontH2Error}>{this.state.errorMsg}</Text>
                    }
                    {!this.state.changeSuccess && !this.state.showError &&
                    <Text style={styles.fontH2}>请输入6-20位密码，支持字母、数字和符号</Text>
                    }
                    <View style={styles.textInputView}>
                        <TextInput
                            style={styles.textInput}
                            onChangeText={(text)=>this._onChangeText(text)}
                            autoFocus={true}
                            maxLength={20}
                            secureTextEntry={this.state.hidePassword}
                            //returnKeyType={"done"}
                            placeholder={"请输入新密码"}
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
                    { this.state.changeSuccess &&
                    <Animated.View style={[styles.successView,{bottom:this.state.slideValue}]}>
                        <Text style={[styles.fontH1Success]}>设置密码成功</Text>
                    </Animated.View>}
                </View>
                <View style={{height:this.state.keyBoardHeight}}>
                </View>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(248,248,248)",
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
    successView: {
        flex: 1,
        position: "absolute",
        bottom: 0,
        width: deviceWidth,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    fontH1Success: {
        fontSize: 15 * changeRatio,
        color: "#1da9fc",
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

export default UpdatePassword2;