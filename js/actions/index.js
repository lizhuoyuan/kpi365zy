/**
 * @author yuanzhou
 * @date 2016/12
 */
import {
    Alert,
    AsyncStorage,
} from 'react-native'
import * as ActionTypes from './ActionTypes'
import {createAction, handleAction, handleActions} from 'redux-actions'
import http from '../utils/http'
import config from '../config'


/**
 * 不需要loading的action
 */
const ACTIONS_WITHOUT_LOADING = ['save'];

/**
 *Tab跳转
 */
export function tabManage(dispatch, tabManageInfo) {
    //let obj = {tabClickIndex:tabClickIndex,component:component,title:title,isShowTabBar:isShowTabBar}
    dispatch(createAction(ActionTypes.TAB_MANAGE, (model) => model)(tabManageInfo));
}
/**
 * 初始化加载:加载首页面
 */
export function initApp(dispatch, pagecode, initData) {
    //logger.debug('eventInit');
    //发起初始化,现在用splash页机制，初始化不需要loading显示
    //dispatch(createAction(ActionTypes.SHOW_LOADING)());
    //执行初始化访问
    //return doInitApp(dispatch, pagecode,initData);
    //let deviceInfo = utils.getDeviceInfo();
    return doAutoLogin(dispatch, null)
    //return doAutoLogin(dispatch, pagecode,initData, deviceInfo);
}
/**
 *登出
 */
export function logoutAction(dispatch) {
    AsyncStorage.setItem("password", "");
    dispatch(createAction(ActionTypes.LOGOUT, (model) => model)());

}
/**
 *进行服务器返回错误处理操作
 */
export function doErrorOperation(dispatch, status, msg) {
    if (status == "ERROR") {
        // dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
        //showMessage("提示",msg,dispatch)
        dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(msg));
        //dispatch(createAction(ActionTypes.LOGOUT, (model)=> model)({error:"SESSION_ERROR"}));
    } else if (status == "SESSION_ERROR") {
        //logoutAction(dispatch)SESSION_ERROR
        dispatch(createAction(ActionTypes.SESSION_ERROR, (model) => model)({ERROR: "SESSION_ERROR"}));
        Alert.alert("提示", msg)
    } else {
        // dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
        dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(msg));
        //showMessage("提示",msg,dispatch)
    }
}

/**清除页面信息**/
export function clearPageInfo(dispatch, type) {
    dispatch(createAction(ActionTypes.CLEAR_PAGE, (model) => model)({type: type}));
}
/**
 * 更新页面数据
 */
export function updatePage(dispatch, obj, actionType, actionTypeObjUpdate) {
    let action = "";
    if (actionType !== undefined && actionType !== null) {
        if (actionType === "toDailyReport") {
            action = ActionTypes.TO_DAILYREPORT;
        } else if (actionType === "monthCheckUpdate") {
            action = ActionTypes.TO_MONTHCHECK;
        } else if (actionType === "weekEvaluateUpdate") {
            action = ActionTypes.TO_WEEKEVALUATE;
        }
        if (action !== "") {
            dispatch(createAction(action, (model) => model)(Object.assign({}, actionTypeObjUpdate)));
        }
    }

    dispatch(createAction(ActionTypes.UPDATE_PAGE, (model) => model)(Object.assign({}, obj)));
}
/**
 * 第一次加载
 * @param dispatch
 */
function doInitApp(dispatch, pagecode, initData) {
    let postData = {};
    if (initData) {
        postData = initData;
    }
    // request init page
    //logger.debug('doInitApp:', loaderUrl, postData);
    http.post(loaderUrl, postData)
        .then((response) => {
            dispatch(createAction(ActionTypes.WEBAPI_LOGIN, (model) => model)(response));
        })
        .catch((err) => {
            const error = new TypeError(err);
            dispatch(createAction(ActionTypes.WEBAPI_LOGIN, (model) => model)(error));
        });
}

/**
 * 第一次加载
 * @param dispatch
 */
export function doAutoLogin(dispatch, route) {
    let keys = [config.localLoginIdKey, config.localLoginPassword];
    let userLoginData = {};
    AsyncStorage.multiGet(keys, (err, values) => {
        if (!err && values) {
            values.forEach((value) => {
                userLoginData[value[0]] = value[1];
            })
        }
        //userId:"",password:""
        dispatch(createAction(ActionTypes.UPDATE_PAGE, (model) => model)(Object.assign({}, userLoginData, {
            route: route,
            getLocalInfoSuccess: true
        })))
    })
}
/**
 * 显示消息
 * @param title
 * @param message
 * @private
 */
function showMessage(title = '提示', message = '', dispatch) {
    if (message !== undefined && message !== null && message !== "") {
        Alert.alert(title, message,
            [{text: '确认', onPress: () => hideLoading(dispatch)}]);
    } else {
        hideLoading(dispatch);
    }
}
function hideLoading(dispatch) {
    dispatch(createAction(ActionTypes.HIDE_LOADING, (model) => model)());
}
/**
 *去主界面
 */
export function toHome(dispatch, postData, route) {
    let loaderUrl = config.webapi.clientChooseOrg;
    // dispatch(createAction(ActionTypes.UPDATE_PAGE, (model)=> model)(Object.assign({},{route:route})));
    // dispatch(createAction(ActionTypes.SHOW_LOADING, (model)=> model)());
    //dispatch(createAction(ActionTypes.UPDATE_PAGE, (model)=> model)(Object.assign({},{},{route:route})));
    http.post(loaderUrl, postData)
        .then((response) => {
            if (response.code == 'OK') {
                let dataTemp = response.datas.data
                if (dataTemp.status == 'OK') {
                    dispatch(createAction(ActionTypes.UPDATE_PAGE, (model) => model)(Object.assign({}, dataTemp, {route: route})));
                } else {
                    //dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(dataTemp.msg));
                    //showMessage("提示",dataTemp.msg)
                    doErrorOperation(dispatch, dataTemp.status, dataTemp.msg)
                }
            } else {
                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                }
            }
        })
        .catch((err) => {
            // dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
            const error = new TypeError(err);
            //  dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(error+""));
            showMessage("提示", "网络出错啦～请检查网络哟", dispatch)
        });
}

/**
 * 获取主页面信息
 */
export function getHomeInfo(dispatch, postData, route, isNotShowLoading) {
    let loaderUrl = config.webapi.clientChooseOrg;
    if (!isNotShowLoading) {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)());
    } else {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)({showLoading: false}));
    }
    // dispatch(createAction(ActionTypes.SHOW_LOADING, (model)=> model)());
    // dispatch(createAction(ActionTypes.SHOW_LOADING, (model)=> model)());
    //dispatch(createAction(ActionTypes.UPDATE_PAGE, (model)=> model)(Object.assign({},{},{route:route})));
    http.post(loaderUrl, postData)
        .then((response) => {
            if (response.code == 'OK') {
                let dataTemp = response.datas.data
                if (dataTemp.status == 'OK') {
                    dispatch(createAction(ActionTypes.UPDATE_PAGE, (model) => model)(Object.assign({}, dataTemp, {
                        route: route,
                        isRefreshing: false
                    })));
                } else {
                    //dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(dataTemp.msg));
                    //showMessage("提示",dataTemp.msg)
                    doErrorOperation(dispatch, dataTemp.status, dataTemp.msg)
                }
            } else {
                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                }
            }
        })
        .catch((err) => {
            // dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
            const error = new TypeError(err);
            //  dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(error+""));
            //  dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
            showMessage("提示", "网络出错啦～请检查网络哟", dispatch)
        });
}
/**
 * 登录操作
 */
export function login(dispatch, postData, route, isNotShowLoading) {
    let loaderUrl = config.webapi.login;
    if (!isNotShowLoading) {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)());
    } else {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)({showLoading: false}));
    }
    http.post(loaderUrl, postData)
        .then((response) => {
            if (response.code == 'OK') {
                let dataTemp = response.datas.data
                if (dataTemp.status == 'OK') {
                    dispatch(createAction(ActionTypes.UPDATE_PAGE, (model) => model)(Object.assign({}, dataTemp, {
                        route: route,
                        userId: postData.userId,
                        password: postData.password
                    })));
                    AsyncStorage.setItem("userId", postData.userId);
                    AsyncStorage.setItem("password", postData.password);
                } else {
                    //dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(dataTemp.msg));
                    //showMessage("提示",dataTemp.msg)
                    doErrorOperation(dispatch, dataTemp.status, dataTemp.msg)
                }
            } else {
                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                    //showMessage("提示","网络出错啦～请检查网络哟",dispatch)
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                    //showMessage("提示",response.msg,dispatch)
                }
            }
        })
        .catch((err) => {
            const error = new TypeError(err);
            alert(error)
            let errorMessage = err.message
            if (err.message == "Network request failed") {
                errorMessage = "网络出错啦～请检查网络哟"
            }
            dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(errorMessage));
            //alert(err.type)
            //  dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
            //  dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)("网络出错啦～请检查网络哟"));
            //showMessage("提示","网络出错啦～请检查网络哟",dispatch)
            // dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
        });
}
/**
 *清楚错误
 */
export function clearError(dispatch) {
    dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(""));
}
/**
 *进行页面跳转
 */
export function transfer(dispatch, type) {
    switch (type) {
        case ActionTypes.toLoginPage:
            doAutoLogin(dispatch);
            break;
        default :
    }
}
/**
 *获取用户目标
 */
export function getUserTarget(dispatch, postData, obj, isNotShowLoading, actionType) {
    let loaderUrl = config.webapi.getUserTarget;
    if (!isNotShowLoading) {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)());
    } else {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)({showLoading: false}));
    }
    let action = ActionTypes.UPDATE_PAGE;
    if (actionType !== undefined && actionType !== null) {
        if (actionType === "toDailyReport") {
            action = ActionTypes.TO_DAILYREPORT;
        } else if (actionType === "monthCheckUpdate") {
            action = ActionTypes.TO_MONTHCHECK;
        }
    }
    http.post(loaderUrl, postData)
        .then((response) => {
            if (response.code == 'OK') {
                let dataTemp = response.datas.data
                if (dataTemp.status == 'OK') {
                    dispatch(createAction(action, (model) => model)(Object.assign({}, dataTemp, {route: null}, obj)));
                } else {
                    doErrorOperation(dispatch, dataTemp.status, dataTemp.msg)
                }
            } else {
                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                }
            }
        })
        .catch((err) => {
            // dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
            showMessage("提示", err + "", dispatch)
        });
}
/**
 *用户目标管理
 */
export function clientUserTargetManage(dispatch, postData, obj, isNotShowLoading, actionType) {
    if (!isNotShowLoading) {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)());
    } else {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)({showLoading: false}));
    }
    let action = ActionTypes.UPDATE_PAGE;
    if (actionType !== undefined && actionType !== null) {
        if (actionType === "toDailyReport") {
            action = ActionTypes.TO_DAILYREPORT;
        } else if (actionType === "monthCheckUpdate") {
            action = ActionTypes.TO_MONTHCHECK;
        }
    }
    let loaderUrl = config.webapi.clientUserTargetManage;
    http.post(loaderUrl, postData)
        .then((response) => {

            if (response.code == 'OK') {
                let dataTemp = response.datas.data
                if (dataTemp.status == 'OK') {
                    dispatch(createAction(action, (model) => model)(Object.assign({}, dataTemp, obj)));
                } else {
                    doErrorOperation(dispatch, dataTemp.status, dataTemp.msg)
                }
            } else {
                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                }
            }
        })
        .catch((err) => {
            //  dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
            showMessage("提示", err + "", dispatch)
        });
}
/**
 *延期目标管理
 */
export function clientUserTargetDelayManage(dispatch, postData, obj, isNotShowLoading, actionType) {
    if (!isNotShowLoading) {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)());
    } else {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)({showLoading: false}));
    }
    let action = ActionTypes.UPDATE_PAGE;
    if (actionType !== undefined && actionType !== null) {
        if (actionType === "toDailyReport") {
            action = ActionTypes.TO_DAILYREPORT;
        } else if (actionType === "monthCheckUpdate") {
            action = ActionTypes.TO_MONTHCHECK;
        }
    }
    let loaderUrl = config.webapi.clientUserTargetDelayManage;
    http.post(loaderUrl, postData)
        .then((response) => {

            if (response.code == 'OK') {
                let dataTemp = response.datas.data
                if (dataTemp.status == 'OK') {
                    dispatch(createAction(action, (model) => model)(Object.assign({}, dataTemp, obj)));
                } else {
                    doErrorOperation(dispatch, dataTemp.status, dataTemp.msg)
                }
            } else {
                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                }
            }
        })
        .catch((err) => {
            //  dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
            showMessage("提示", err + "", dispatch)
        });
}
export function changeUserTargetProgress(dispatch, postData, route, obj) {
    //tabManage(dispatch,tabClickIndex,component,title,isShowTabBar)
    dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)());
    let loaderUrl = config.webapi.clientUpdateUserTargetProgress;
    http.post(loaderUrl, postData)
        .then((response) => {
            if (response.code == 'OK') {
                let dataTemp = response.datas.data
                if (dataTemp.status == 'OK') {
                    dispatch(createAction(ActionTypes.UPDATE_PAGE, (model) => model)(Object.assign({}, dataTemp, {route: route}, obj)));
                } else {
                    //  dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(dataTemp.msg));
                    doErrorOperation(dispatch, dataTemp.status, dataTemp.msg)
                    //showMessage("提示",dataTemp.msg)
                }
            } else {
                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                }
            }
        })
        .catch((err) => {
            // dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
            showMessage("提示", err + "", dispatch)
            //  dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(error+""));
        });
}
//每日自评
export function selfEvaluate(dispatch, postData, isShowTabBar, obj) {
    //tabManage(dispatch,tabClickIndex,component,title,isShowTabBar)
    dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)());
    let loaderUrl = config.webapi.selfEvaluate;
    http.post(loaderUrl, postData)
        .then((response) => {
            if (response.code == 'OK') {
                let dataTemp = response.datas.data
                if (dataTemp.status == 'OK') {
                    dispatch(createAction(ActionTypes.UPDATE_PAGE, (model) => model)(Object.assign({}, dataTemp, obj)));
                } else {
                    //  dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(dataTemp.msg));
                    doErrorOperation(dispatch, dataTemp.status, dataTemp.msg)
                    //showMessage("提示",dataTemp.msg)
                }
            } else {
                //dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(response.msg));
                // dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
                //showMessage("提示",response.msg,dispatch)
                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                }
            }
        })
        .catch((err) => {
            // dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
            showMessage("提示", err + "", dispatch)
        });
}
//提交审核
export function targetsSubmitToCheck(dispatch, postData) {
    let loaderUrl = config.webapi.clientSubmitToCheck;
    dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)());
    http.post(loaderUrl, postData)
        .then((response) => {
            if (response.code == 'OK') {
                let dataTemp = response.datas.data
                if (dataTemp.status == 'OK') {
                    // dispatch(createAction(ActionTypes.UPDATE_PAGE, (model)=> model)(Object.assign({},dataTemp,{route:null})));
                    getUserTarget(dispatch, postData)
                } else {
                    //  dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(dataTemp.msg));
                    doErrorOperation(dispatch, dataTemp.status, dataTemp.msg)
                    //showMessage("提示",dataTemp.msg)
                }
            } else {
                //dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(response.msg));
                //  dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                }
            }
        })
        .catch((err) => {
            //dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
            showMessage("提示", err + "", dispatch)
        });
}

//获取自我评价信息
export function getSelfEvaluate(dispatch, postData, isNotShowLoading, actionType, reducerInfo) {
    if (!isNotShowLoading) {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)());
    } else {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)({showLoading: false}));
    }
    let action = ActionTypes.UPDATE_PAGE;

    if (actionType !== undefined && actionType !== null) {
        if (actionType === "toDailyReport") {
            action = ActionTypes.TO_DAILYREPORT;
        } else if (actionType === "weekEvaluateUpdate") {
            action = ActionTypes.TO_WEEKEVALUATE;
        }
    }
    //  dispatch(createAction(ActionTypes.SHOW_LOADING, (model)=> model)());
    let loaderUrl = config.webapi.clientGetSelfEvaluate;
    http.post(loaderUrl, postData)
        .then((response) => {
            if (response.code == 'OK') {
                let dataTemp = response.datas.data
                if (dataTemp.status == 'OK') {
                    dispatch(createAction(action, (model) => model)({
                        ...dataTemp,
                        route: null, ...reducerInfo
                    }));
                } else {
                    //  dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(dataTemp.msg));

                    doErrorOperation(dispatch, dataTemp.status, dataTemp.msg)
                    //showMessage("提示",dataTemp.msg)
                }
            } else {
                //dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(response.msg));
                //  dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                }
            }
        })
        .catch((err) => {
            //dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
            showMessage("提示", err + "", dispatch)
        });
}

//获取用户关系
export function getPeopleRelationship(dispatch, postData, isNotShowLoading, obj, actionType) {
    if (!isNotShowLoading) {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)());
    } else {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)({showLoading: false}));
    }
    let action = ActionTypes.UPDATE_PAGE;
    if (actionType !== undefined && actionType !== null) {
        if (actionType === "toDailyReport") {
            action = ActionTypes.TO_DAILYREPORT;
        } else if (actionType === "monthCheckUpdate") {
            action = ActionTypes.TO_MONTHCHECK;
        } else if (actionType === "weekEvaluateUpdate") {
            action = ActionTypes.TO_WEEKEVALUATE;
        }
    }

    let loaderUrl = config.webapi.clientGetPeopleRelationship;
    http.post(loaderUrl, postData)
        .then((response) => {
            if (response.code == 'OK') {
                let dataTemp = response.datas.data
                if (dataTemp.status == 'OK') {
                    dispatch(createAction(action, (model) => model)(Object.assign({}, dataTemp, {isRefreshing: false}, obj)));
                } else {
                    //  dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(dataTemp.msg));
                    doErrorOperation(dispatch, dataTemp.status, dataTemp.msg)
                    //showMessage("提示",dataTemp.msg)
                }
            } else {
                //dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(response.msg));
                // dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                }
            }
        })
        .catch((err) => {
            // dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
            showMessage("提示", err + "", dispatch)
        });
}

//获取年度用户目标情况
export function getUserYearTarget(dispatch, postData, isNotShowLoading) {
    if (!isNotShowLoading) {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)());
    } else {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)({showLoading: false}));
    }
    let loaderUrl = config.webapi.clientGetUserYearTarget;
    http.post(loaderUrl, postData)
        .then((response) => {
            if (response.code == 'OK') {
                let dataTemp = response.datas.data
                if (dataTemp.status == 'OK') {
                    dispatch(createAction(ActionTypes.UPDATE_PAGE, (model) => model)(Object.assign({}, dataTemp, {
                        route: null,
                        isRefreshing: false
                    })));
                } else {
                    //  dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(dataTemp.msg));
                    doErrorOperation(dispatch, dataTemp.status, dataTemp.msg)
                    //showMessage("提示",dataTemp.msg)
                }
            } else {
                //dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(response.msg));
                // dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                }
            }
        })
        .catch((err) => {
            // dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
            showMessage("提示", err + "", dispatch)
        });
}
//获取下属待审核目标
export function getUserLowerLevelNeedCheckMonthTarget(dispatch, postData, isNotShowLoading) {
    if (!isNotShowLoading) {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)());
    } else {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)({showLoading: false}));
    }
    let loaderUrl = config.webapi.clientGetUserLowerLevelNeedCheckMonthTarget;
    http.post(loaderUrl, postData)
        .then((response) => {
            if (response.code == 'OK') {
                let dataTemp = response.datas.data
                if (dataTemp.status == 'OK') {
                    dispatch(createAction(ActionTypes.UPDATE_PAGE, (model) => model)(Object.assign({}, dataTemp, {
                        route: null,
                        isRefreshing: false
                    })));
                } else {
                    //  dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(dataTemp.msg));
                    doErrorOperation(dispatch, dataTemp.status, dataTemp.msg)
                    //showMessage("提示",dataTemp.msg)
                }
            } else {
                //dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(response.msg));
                //dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                }
            }
        })
        .catch((err) => {
            //dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
            showMessage("提示", err + "", dispatch)
        });
}
//审核用户目标
export function userTargetCheck(dispatch, postData, tabClickIndex, component, title, isShowTabBar, route, isNotShowLoading) {
    if (!isNotShowLoading) {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)());
    } else {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)({showLoading: false}));
    }
    let loaderUrl = config.webapi.clientUserTargetCheck;
    http.post(loaderUrl, postData)
        .then((response) => {
            if (response.code == 'OK') {
                let dataTemp = response.datas.data
                if (dataTemp.status == 'OK') {
                    //getUserLowerLevelNeedCheckMonthTarget(dispatch,postData)
                    dispatch(createAction(ActionTypes.UPDATE_PAGE, (model) => model)(Object.assign({}, dataTemp, {
                        route: route,
                        isRefreshing: false
                    })));
                    //if(route === null || route === undefined){
                    //  tabManage(dispatch,tabClickIndex,component,title,isShowTabBar)
                    //}
                } else {
                    //  dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(dataTemp.msg));
                    doErrorOperation(dispatch, dataTemp.status, dataTemp.msg)
                    //showMessage("提示",dataTemp.msg)
                }
            } else {
                //dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(response.msg));
                // dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                }
            }
        })
        .catch((err) => {
            const error = new TypeError(err);
            // dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
            showMessage("提示", error + "", dispatch)
        });
}
/**
 * 进行post请求
 * dispatcher func
 * postData obj 发送给服务器的数据
 * loaderUrl string  服务器url
 * tabManageInfo  obj  tab切换信息
 * isNotShowLoading boolean 是否不显示loading
 **/
export function doPost(dispatch, postData, loaderUrl, tabManageInfo, route, isNotShowLoading) {
    if (!isNotShowLoading) {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)());
    } else {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)({showLoading: false}));
    }
    http.post(loaderUrl, postData)
        .then((response) => {
            if (response.code == 'OK') {
                let dataTemp = response.datas.data
                if (dataTemp.status == 'OK') {
                    dispatch(createAction(ActionTypes.UPDATE_PAGE, (model) => model)(Object.assign({}, dataTemp, {
                        route: route,
                        isRefreshing: false
                    })));
                    //if(route === null || route === undefined){
                    //  tabManage(dispatch,tabManageInfo)
                    // }
                } else {
                    //dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(response.msg));

                    doErrorOperation(dispatch, dataTemp.status, dataTemp.msg)
                }
            } else {
                //dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(response.msg));
                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                }
            }
        })
        .catch((err) => {
            const error = new TypeError(err);

            dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(error));
            // dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
            //showMessage("提示","网络出错啦～请检查网络哟",dispatch)
        });
}
/**
 * 进行post请求
 * dispatcher func
 * postData obj 发送给服务器的数据
 * loaderUrl string  服务器url
 * tabManageInfo  obj  tab切换信息
 * isNotShowLoading boolean 是否不显示loading
 **/
export function doPostSimple(dispatch, postData, loaderUrl, obj, isNotShowLoading) {
    if (!isNotShowLoading) {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)());
    } else {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)({showLoading: false}));
    }
    http.post(config.webapi.service + loaderUrl, postData)
        .then((response) => {
            if (response.code == 'OK') {
                let dataTemp = response.datas.data
                if (dataTemp.status == 'OK') {
                    dispatch(createAction(ActionTypes.UPDATE_PAGE, (model) => model)(Object.assign({}, dataTemp, {
                        route: null,
                        isRefreshing: false
                    }, obj)));
                    //if(route === null || route === undefined){
                    //  tabManage(dispatch,tabManageInfo)
                    // }
                } else {
                    //dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(response.msg));
                    doErrorOperation(dispatch, dataTemp.status, dataTemp.msg)
                }
            } else {

                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                }
            }
        })
        .catch((err) => {
            const error = new TypeError(err);

            dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(error));
            // dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
            //showMessage("提示","网络出错啦～请检查网络哟",dispatch)
        });
}
/**
 * 周评答复
 */
export function doPostWeekEvaluateAnswer(dispatch, postData, isNotShowLoading, reducerInfo, postDataToUpdateAll, actionType) {
    if (!isNotShowLoading) {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)());
    } else {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)({showLoading: false}));
    }
    http.post(config.webapi.clientManageWeekEvaluate, postData)
        .then((response) => {
            if (response.code == 'OK') {
                let dataTemp = response.datas.data
                if (dataTemp.status == 'OK') {
                    getSelfEvaluate(dispatch, postDataToUpdateAll, isNotShowLoading, actionType, reducerInfo);
                    // dispatch(createAction(ActionTypes.TO_WEEKEVALUATE, (model) => model)(Object.assign({}, obj)));
                } else {
                    // dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(dataTemp.msg));
                    doErrorOperation(dispatch, dataTemp.status, dataTemp.msg)
                }
            } else {
                //dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(response.msg));
                //showMessage("提示",response.msg,dispatch)
                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                }
            }
        })
        .catch((err) => {
            const error = new TypeError(err);

            dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(err + ""));
            // dispatch(createAction(ActionTypes.HIDE_LOADING, (model)=> model)());
            //showMessage("提示","网络出错啦～请检查网络哟",dispatch)
        });
}
/**
 *获取周评信息
 */
export function getWeekStarEvaluation(dispatch, postData, isNotShowLoading, obj) {
    if (!isNotShowLoading) {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)());
    } else {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)({showLoading: false}));
    }
    http.post(config.webapi.clientManageWeekEvaluate, postData)
        .then((response) => {
            if (response.code == 'OK') {
                let dataTemp = response.datas.data
                if (dataTemp.status == 'OK') {

                    dispatch(createAction(ActionTypes.UPDATE_PAGE, (model) => model)(Object.assign({}, dataTemp, {
                        route: null,
                        isRefreshing: false
                    }, obj)));
                } else {
                    // dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(dataTemp.msg));
                    doErrorOperation(dispatch, dataTemp.status, dataTemp.msg)
                }
            } else {
                //dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(response.msg));
                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                }
            }
        })
        .catch((err) => {
            const error = new TypeError(err);
            dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(err + ""));
        });
}
/**
 * 周评
 */
export function weekStarEvaluate(dispatch, postData, isNotShowLoading, obj) {
    if (!isNotShowLoading) {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)());
    } else {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)({showLoading: false}));
    }
    http.post(config.webapi.clientManageWeekEvaluate, postData)
        .then((response) => {
            if (response.code == 'OK') {
                let dataTemp = response.datas.data
                if (dataTemp.status == 'OK') {

                    dispatch(createAction(ActionTypes.UPDATE_PAGE, (model) => model)(Object.assign({}, dataTemp, {
                        route: null,
                        isRefreshing: false
                    }, obj)));
                } else {
                    //dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(dataTemp.msg));
                    doErrorOperation(dispatch, dataTemp.status, dataTemp.msg)
                }
            } else {
                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                }
                //dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(response.msg));
            }
        })
        .catch((err) => {
            const error = new TypeError(err);
            dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(err + ""));
        });
}
/**
 *更新用户头像
 */
export function updatePersonalizedSignature(dispatch, postData, obj) {
    dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)());
    http.post(config.webapi.clientSelfCenter, postData)
        .then((response) => {
            if (response.code === 'OK') {
                let dataTemp = response.datas.data
                if (dataTemp.status === 'OK') {
                    dispatch(createAction(ActionTypes.UPDATE_PAGE, (model) => model)(Object.assign({}, dataTemp, {
                        route: null,
                        isRefreshing: false
                    }, obj)));
                } else {
                    doErrorOperation(dispatch, dataTemp.status, dataTemp.msg)
                }
            } else {
                //dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(response.msg));
                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                }
            }
        })
        .catch((err) => {
            const error = new TypeError(err);
            dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(err + ""));
        });
}

/**
 *
 *签到
 */
export function sign(dispatch, postData, obj) {
    dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)());
    http.post(config.webapi.clientSign, postData)
        .then((response) => {
            if (response.code == 'OK') {
                let dataTemp = response.datas.data
                if (dataTemp.status == 'OK') {

                    dispatch(createAction(ActionTypes.UPDATE_PAGE, (model) => model)(Object.assign({}, dataTemp, {
                        route: null,
                        isRefreshing: false
                    }, obj)));
                } else {
                    doErrorOperation(dispatch, dataTemp.status, dataTemp.msg)
                }
            } else {
                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                }
            }
        })
        .catch((err) => {
            const error = new TypeError(err);
            dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(err + ""));
        });
}

/**
 *
 *奖励
 */
export function rewardManage(dispatch, postData, obj, isNotShowLoading, actionType) {
    if (!isNotShowLoading) {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)());
    } else {
        dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)({showLoading: false}));
    }
    let action = ActionTypes.UPDATE_PAGE;

    if (actionType !== undefined && actionType !== null) {
        if (actionType === "toDailyReport") {
            action = ActionTypes.TO_DAILYREPORT;
        } else if (actionType === "weekEvaluateUpdate") {
            action = ActionTypes.TO_WEEKEVALUATE;
        }
    }
    http.post(config.webapi.clientRewardManage, postData)
        .then((response) => {
            if (response.code == 'OK') {
                let dataTemp = response.datas.data
                if (dataTemp.status == 'OK') {
                    dispatch(createAction(action, (model) => model)(Object.assign({}, dataTemp, {
                        route: null,
                        isRefreshing: false
                    }, obj)));
                } else {
                    doErrorOperation(dispatch, dataTemp.status, dataTemp.msg)
                }
            } else {
                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                }
                //dispatch(createAction(ActionTypes.SHOW_ERROR, (model)=> model)(response.msg));
            }
        })
        .catch((err) => {
            const error = new TypeError(err);
            dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(err + ""));
        });
}

export const updateUserPassword = (newPassword = "", obj = {}) => (dispatch, getState) => {
    let {PageData} = getState();
    let postParams = {
        userId: PageData.userId,
        password: PageData.password,
        newPassword: newPassword,
        x_token: PageData.token,
    };
    http.post(config.webapi.clientUpdateUserPassword, postParams)
        .then((response) => {
            if (response.code == 'OK') {
                let dataTemp = response.datas.data;
                if (dataTemp.status == 'OK') {

                    dispatch(createAction(ActionTypes.UPDATE_PAGE, (model) => model)(Object.assign({}, dataTemp, obj)));
                } else {
                    doErrorOperation(dispatch, dataTemp.status, dataTemp.msg)
                }
            } else {
                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                }
            }
        })
        .catch((err) => {
            dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(err + ""));
        });
}

export const fetch = (action = 'init') => (dispatch, getState) => {
    let {PageData} = getState();
    let index = {};
    let postParams = {
        "user": PageData.userUniqueid,
        "type": "world",
        "num": 20,
        "index": index
    };

    //dispatch(createAction(ActionTypes.FETCH_TWEETS)());
    http.requestService(`fetch`, postParams)
        .then(json => {
            dispatch(createAction(ActionTypes.UPDATE_PAGE, (model) => model)(json));
        })
        .catch(err => {
            const error = new TypeError(err);
            dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(err + ""));
        });
};

export const create = (postData) => (dispatch, getState) => {
    let {PageData} = getState();
    let postParams = {
        ...postData,
        "user": PageData.userUniqueid,
    };
    //dispatch(createAction(ActionTypes.FETCHING)());
    dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)());
    return http.requestService(`create`, postParams)
        .then(json => {
            dispatch(createAction(ActionTypes.UPDATE_PAGE, (model) => model)(json));
        })
        .catch(err => {
            const error = new TypeError(err);
            dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(err + ""));
        });
};
export const recall = (postData) => (dispatch, getState) => {
    let {PageData} = getState();
    let postParams = {
        ...postData,
        "user": PageData.userUniqueid,
    };
    //dispatch(createAction(ActionTypes.FETCHING)());
    dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)());
    return http.requestService(`recall`, postParams)
        .then(json => {
            dispatch(createAction(ActionTypes.UPDATE_PAGE, (model) => model)(json));
        })
        .catch(err => {
            const error = new TypeError(err);
            dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(err + ""));
        });
};


/**
 * 关注列表目标取消关注
 * @param  postData
 * @return
 */
export const focusTargetRecall = (postData) => (dispatch, getState) => {
    let {PageData} = getState();
    let postParams = {
        ...postData,
        "user": PageData.userUniqueid,
        "x_token": PageData.token
    };
    dispatch(createAction(ActionTypes.SHOW_LOADING, (model) => model)());
    return http.requestService(`recallFocusTarget`, postParams).then(json => {
        dispatch(createAction(ActionTypes.RECALL_FOCUS_TARGET_SUCCESS)(json));
        dispatch(fetchFocus("init"));
    })
        .catch(err => {
            dispatch(createAction(ActionTypes.RECALL_FOCUS_TARGET_FAIL)(err));
        });
};

/**
 * 获取关注列表
 * @param action
 */
export const fetchFocus = (action = 'init') => (dispatch, getState) => {
    let {focusTargets, PageData} = getState();
    let index = {};
    action === 'down' && ( index = {top: focusTargets.index.top} );
    action === 'up' && ( index = {bottom: focusTargets.index.bottom} );
    if (Object.keys((focusTargets || {}).entities || {}).length <= 0) {
        index = {}
    }
    let postParams = {
        "user": PageData.userUniqueid,
        "num": 20,
        "index": index,
        "x_token": PageData.token
    };
    dispatch(createAction(ActionTypes.FETCH_FOCUS_TARGETS)());
    http.requestService(`fetchFocusTargets`, postParams)
        .then(data => {
            switch (action) {
                case 'down':
                    dispatch(createAction(ActionTypes.PULL_DOWN_TO_REFRESH_FOCUS_TARGETS_SUCCESS)({
                        data
                    }));
                    break;
                case 'up':
                    dispatch(createAction(ActionTypes.PULL_UP_TO_REFRESH_FOCUS_TARGETS_SUCCESS)({
                        data
                    }));
                    break;
                default:
                    dispatch(createAction(ActionTypes.FETCH_FOCUS_TARGETS_SUCCESS)({
                        data
                    }));
            }
        })
        .catch(err => {
            dispatch(createAction(ActionTypes.FETCH_FOCUS_TARGETS_FAIL)({
                err
            }));
        });
};

export function getPersons(dispatch, postData) {
    http.post(config.webapi.GetApplicants, postData)
        .then((response) => {
            if (response.code == 'OK') {
                let dataTemp = response.datas.data;
                let persons = [];
                let shesize = dataTemp.shesize;
                let xiaosize = dataTemp.xiaosize;
                for (var i = 0; i < dataTemp.user.length; i++) {
                    let p = dataTemp.user[i];
                    let person = {
                        alltime: p.alltime,
                        ApplicantSid: p.HrApplicantSid,
                        ClsExamanswerSid: p.ClsExamanswerSid,
                        HrRecruitinfoSid: p.HrRecruitinfoSid,
                        HrWorkSid: p.workSid,
                        name: p.HrApplicantName,
                        type: p.HrRecruitinfoType,
                        sex: p.HrApplicantSex,
                        school: p.HrApplicantSchool,
                        profession: p.HrApplicantProfession,
                        score: p.ClsExamanswerScore,
                        result: p.ClsExamanswerDescription,
                        before: p.workCompany,
                        post: p.workJob,
                        job: p.HrRecruitinfoJob,
                        paperendtime: p.ClsExamanswerEndtime,
                    }
                    persons[i] = person;
                }
                dispatch(createAction(ActionTypes.ZHAOXIANGUAN, (model) => model)(
                    {persons: persons, shesize: shesize, xiaosize: xiaosize}));
            } else {
                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                }
            }
        })
        .catch((err) => {
            const error = new TypeError(err);
            dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(err + ""));
        });
}

export function getXiangQing(dispatch, postData) {
    http.post(config.webapi.getXiangQing, postData)
        .then((response) => {
            if (response.code == 'OK') {
                let dataTemp = response.datas.data;
                let person = {
                    name: dataTemp.Name,
                    sex: dataTemp.Gender,
                    school: dataTemp.School,
                    profession: dataTemp.Professional,
                    tel: dataTemp.Telephone,
                    works:dataTemp.works,
                    hobby: dataTemp.HrFavorite,
                    linguistic_capacity: dataTemp.Language,
                    highest_education: dataTemp.Bestrecord,
                    nativeplace: dataTemp.Origin,
                    matrimonial_res: dataTemp.Marry,
                    email: dataTemp.Email,
                    idcard: dataTemp.Idcard,
                    inviter: dataTemp.inviter,
                }
                dispatch(createAction(ActionTypes.ZHAOXIANGUAN, (model) => model)(
                    {person: person}));
            } else {
                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                }
            }
        })
        .catch((err) => {
            const error = new TypeError(err);
            dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(err + ""));
        });
}


export function getPinggu(dispatch, postData) {
    http.post(config.webapi.getPinggu, postData)
        .then((response) => {
            if (response.code == 'OK') {
                let dataTemp = response.datas.data;
                let pinggus = [];
                if (dataTemp != null) {
                    for (var i = 0; i < dataTemp.length; i++) {
                        let dataTem = dataTemp[i];
                        let pinggu = {
                            // code: dataTemp.pingguCode,  //1是已评估，0是没评估
                            evaluateadvice: dataTem.evaluateadvice,
                            evaluatedonetime: dataTem.evaluatedonetime,
                            name: dataTem.name,
                            disadvan: dataTem.disadvan,
                            advan: dataTem.advan,
                            avatorurl: dataTem.avatorurl,
                            inviter: dataTem.inviter,
                        }
                        pinggus[i] = pinggu;
                    }
                }
                dispatch(createAction(ActionTypes.ZHAOXIANGUAN, (model) => model)(
                    {pinggus: pinggus}));
            } else {
                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                }
            }
        })
        .catch((err) => {
            const error = new TypeError(err);
            dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(err + ""));
        });
}

export function updatePinggu(dispatch, postData, backInfo, p) {
    http.post(config.webapi.updatePinggu, postData)
        .then((response) => {
            if (response.code == 'OK') {
                let dataTemp = response.datas.data;
                let person = {
                    evaluateadvice: dataTemp.evaluateadvice,
                }

                //还要获取招聘者的头像和姓名
                let pinggu = {
                    evaluateadvice: dataTemp.evaluateadvice,
                    evaluatedonetime: dataTemp.evaluatedonetime,
                    disadvan: dataTemp.lieshi,
                    advan: dataTemp.youshi,
                }
                dispatch(createAction(ActionTypes.ZHAOXIANGUAN, (model) => model)(
                    {person, pinggu}));
                getXiangQing(dispatch, p);
                updatePage(dispatch, backInfo);
                getPinggu(dispatch, p);

            } else {
                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                }
            }
        })
        .catch((err) => {
            const error = new TypeError(err);
            dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(err + ""));
        });
}


export function getWenhua(dispatch, postData) {
    http.post(config.webapi.getWenhua, postData)
        .then((response) => {
            if (response.code == 'OK') {
                let dataTemp = response.datas.data;
                let wenhua = {};
                if (dataTemp != null) {
                    wenhua = {

                        result: dataTemp.HrCultureAnswers.type,
                        content: dataTemp.HrCultureAnswers.content,
                        shortcoming: dataTemp.HrCultureAnswers.shortcoming,


                    }
                }
                dispatch(createAction(ActionTypes.ZHAOXIANGUAN, (model) => model)(
                    {wenhua: wenhua}));
            } else {
                if (response.code === undefined || response.code === null) {
                    doErrorOperation(dispatch, null, "网络出错啦～请检查网络哟")
                } else {
                    doErrorOperation(dispatch, null, response.msg)
                }
            }
        })
        .catch((err) => {
            const error = new TypeError(err);
            dispatch(createAction(ActionTypes.SHOW_ERROR, (model) => model)(err + ""));
        });
}
