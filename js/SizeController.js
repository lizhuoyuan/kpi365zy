/**
 * 高度定义
 * Created by yuanzhou.xu on 17/2/18.
 */
import {PixelRatio, Dimensions, Platform} from 'react-native';
let initialDeviceHeight = 667;
let initialDeviceWidth = 375;
let initialPixelRatio = 2;
let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;
let pixelRatio = PixelRatio.get();
let statusBarHeight = 20;  //初始状态栏高度
let topBarHeight = 44;	  //初始导航栏高度
let tabBarHeight = 49;  //初始标签栏高度
let changeRatio = deviceHeight / initialDeviceHeight;//pixelRatio/initialPixelRatio;
if (deviceWidth > 375 && deviceWidth <= 1125 / 2) {
    statusBarHeight = 27;
    topBarHeight = 66;
    tabBarHeight = 60;
} else if (deviceWidth > 1125 / 2) {
    statusBarHeight = 30;
    topBarHeight = 66;
    tabBarHeight = 60;
}
/**
 * 返回状态栏高度
 */
export function getStatusBarHeight() {
    return statusBarHeight;
}
/**
 * 返回导航栏高度
 */
export function getTopBarHeight() {
    return topBarHeight;
}
/**
 * 返回标签栏高度
 */
export function getTabBarHeight() {
    return tabBarHeight;
}
/**
 *
 */
export function getTopHeight() {
    if (Platform.OS === "ios") {
        return topBarHeight + statusBarHeight;
    } else {
        return topBarHeight;
    }
}
/**
 * 返回变更比例
 */
export function getChangeRatio() {
    return changeRatio;
}
/** 获取tabBar比例**/
export function getTabBarRatio() {
    return tabBarHeight / 49;
}

/**
 * 获取TopBar比例
 */
export function getTopBarRatio() {
    return changeRatio;

}











