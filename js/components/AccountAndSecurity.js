/**
 * 帐号与安全页面
 * create by yuanzhou 2017/03/16
 *
 */

import React, {Component} from 'react'
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    Image
} from 'react-native'
import TopBar from './common/TopBar'
import  * as SizeController from '../SizeController'
import ImageResource from '../utils/ImageResource'
import UpdatePassword1 from './UpdatePassword1'

let topHeight = SizeController.getTopHeight();
let tabBarHeight = SizeController.getTabBarHeight();
let changeRatio = SizeController.getChangeRatio();

class AccountAndSecurity extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.toback = this.toback.bind(this);
        this.toUpdatePassword = this.toUpdatePassword.bind(this);
    }

    toback() {
        this.props.navigator.pop();
    }

    toUpdatePassword() {
        let {routeInfo, navigator}  = this.props;
        let route = {
            name: "UpdatePassword1",
            path: "none",
            component: UpdatePassword1,
            type: "UpdatePassword1",
            index: routeInfo.index + 1,
        };
        navigator.push(route);
    }

    render() {
        return (
            <View style={styles.container}>
                <TopBar toback={this.toback}
                        topBarText={"帐号与安全"}
                        topBarTextBottomShow={false}
                        topBarTextRight=""
                        showRight={false}
                        showLeft={true}
                />
                {false &&
                <TouchableOpacity style={styles.viewStyleTop}>
                    <View style={styles.viewLeft}><Text
                        style={styles.leftText}>账户保护</Text></View>
                    <View style={styles.viewRight}>
                        <View style={{flexDirection:"row",flex:1}}>
                            <View style={styles.viewCenter}>
                                <Image style={styles.imageStyle} source={ImageResource["login-pswd@2x.png"]}>
                                </Image>
                            </View>
                            <View style={styles.viewCenterWithRight}>
                                <Text style={styles.rightRightText}>已保护</Text>
                            </View>
                            <View style={styles.viewCenter}>
                                <Image style={styles.imageStyle} source={ImageResource["arrows@2x.png"]}>
                                </Image>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                }
                <TouchableOpacity onPress={this.toUpdatePassword} style={styles.viewStyleTop}>
                    <View style={styles.viewLeft}><Text
                        style={styles.leftText}>更改密码</Text></View>
                    <View style={styles.viewRight}>
                        <Image style={styles.imageStyle} source={ImageResource["arrows@2x.png"]}>
                        </Image>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(248,248,248)"
    },
    viewStyleTop: {
        flex: 0,
        height: 50 * changeRatio,
        flexDirection: "row",
        paddingLeft: 17 * changeRatio,
        paddingRight: 15 * changeRatio,
        marginTop: topHeight + 15 * changeRatio,
        backgroundColor: "#ffffff",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "rgb(197,205,215)",
    },
    viewStyleBottom: {
        flex: 0,
        marginTop: 10 * changeRatio,
        height: 50 * changeRatio,
        paddingLeft: 17 * changeRatio,
        paddingRight: 15 * changeRatio,
        flexDirection: "row",
        backgroundColor: "#ffffff",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "rgb(197,205,215)",
    },
    viewCenter: {
        justifyContent: "center"
    },
    viewCenterWithRight: {
        justifyContent: "center",
        marginRight: 10 * changeRatio,
    },
    viewLeft: {
        alignItems: "flex-start",
        width: 100 * changeRatio,
        flex: 0,
        justifyContent: "center"
    },
    leftText: {
        color: "#2b3d54",
        fontSize: 16 * changeRatio,
    },
    viewRight: {
        alignItems: "flex-end",
        justifyContent: "center",
        flex: 1,
    },
    rightText: {
        fontSize: 15 * changeRatio,
        color: "#838f9f",
    },
    rightRightText: {
        fontSize: 15 * changeRatio,
        color: "#838f9f",
        marginLeft: 5 * changeRatio,
    },
    imageStyle: {
        height: 20 * changeRatio,
        width: 20 * changeRatio,
    },
    hrView: {
        flex: 0,
        height: 1,
        backgroundColor: "rgb(197,205,215)",
        marginLeft: 10 * changeRatio,
        marginRight: 10 * changeRatio,
    },

});
export default AccountAndSecurity