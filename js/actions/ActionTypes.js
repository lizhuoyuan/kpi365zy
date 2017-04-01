/**
 * @author yuanzhou
 * @date 2016/11
 * 客户端交互用Action
 */
'use strict';
/** webapi 服务*/
export const WEBAPI_LOGIN = 'webapi_login'
export const SHOW_ERROR = 'show_error'
export const TAB_MANAGE = 'tab_manage'
export const LOGOUT = 'logout'
export const SESSION_ERROR = "session_error"


export const CLEAR_PAGE = 'clear_page'
/** 页面Action **/

/** 前往报告页面 **/
export const TO_DAILYREPORT = 'to_dailyReport';
/** 前往周评页面 **/
export const TO_WEEKEVALUATE = "to_weekEvaluate";
/** 前往周评历史页面 **/
export const TO_WEEKEVALUATEHISTORY = "to_weekEvaluateHistory";

/** 前往目标管理页面 **/
export const TO_TARGETMANAGE = "to_targetManage";
/** 前往月度考评页面 **/
export const TO_MONTHCHECK = "to_monthCheck";
/** 前往目标历史页面 **/
export const TO_TARGETHISTORY = "to_targetHistory";


/** 前往人员筛选页面 **/
export const TO_CHOOSEUSER = "to_chooseUser";
/** 前往延期目标审核页面 **/
export const TO_DELAYTARGETCHECK = "to_delayTargetCheck";
/** 前往目标审核页面 **/
export const TO_TARGETCHECK = "to_targetCheck";

/** 服务器下发的Action DO */
export const ACT_DO_SUBMIT = 'submit';
export const ACT_DO_READ = 'read';

/** 服务器下发的Action Type */
export const ACT_TYPE_CHANGE = 'change';
export const ACT_TYPE_CLICK = 'click';
export const ACT_TYPE_BLUR = 'blur';
export const ACT_TYPE_ONLOAD = 'onload';
/** 页面UI交互事件 */
// 获取数据阶段,显示loading
export const HIDE_LOADING = 'app.hide.loading'
export const SHOW_LOADING = 'app.loading';
// 得到数据阶段,更新替换整页
export const UPDATE_PAGE = 'app.page.update';
// 得到数据阶段,局部刷新某些控件
export const REFRESH_UI = 'app.page.ui.refresh';
// 通过本地操作,局部更新某些控件
export const REFRESH_UI_BY_LOCAL = 'app.page.ui.refresh.local';
///加载指定页面模型（用于从本地获取的页面模型更新页面）
export const CLIENT_BACK = 'app.page.ui.client.back';
///Tab页切换
export const TAB_PAGE_CHANGE_START = 'tab.page.change.start';
///Tab页切换更新页模型完毕
export const TAB_PAGE_CHANGE_LOAD_LOCAL = 'tab.page.load.local';
///重新重头开始App
export const APP_RESTART = 'app.restart';

export const FETCHING = 'FETCHING';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAIL = 'LOGOUT_FAIL';


/** 取消关注目标成功 */
export const RECALL_FOCUS_TARGET_SUCCESS = "RECALL_FOCUS_TARGET_SUCCESS";
/** 取消关注目标失败 */
export const RECALL_FOCUS_TARGET_FAIL = "RECALL_FOCUS_TARGET_FAIL";
/** 关注目标成功 */
export const FOCUS_TARGET_SUCCESS = "FOCUS_TARGET_SUCCESS";
/** 关注目标失败 */
export const FOCUS_TARGET_FAIL = "FOCUS_TARGET_FAIL";
/**
 * 关注列表系列
 */
/** 获取FOCUS_TARGET成功 **/
export const FETCH_FOCUS_TARGET_SUCCESS = "FETCH_FOCUS_TARGET_SUCCESS";
/** 获取FOCUS_TARGETS **/
export const FETCH_FOCUS_TARGETS = "FETCH_FOCUS_TARGETS";
/** 获取FOCUS_TARGETS失败 **/
export const FETCH_FOCUS_TARGETS_FAIL = "FETCH_FOCUS_TARGETS_FAIL";
/** 获取FOCUS_TARGETS成功 **/
export const FETCH_FOCUS_TARGETS_SUCCESS = "FETCH_FOCUS_TARGETS_SUCCESS";
/** 删除FOCUS_TARGET成功 **/
export const REVOKE_FOCUS_TARGET_SUCCESS = "REVOKE_FOCUS_TARGET_SUCCESS";
/** 下拉刷新成功 **/
export const PULL_DOWN_TO_REFRESH_FOCUS_TARGETS_SUCCESS = "PULL_DOWN_TO_REFRESH_FOCUS_TARGETS_SUCCESS";
/** 上拉刷新成功 **/
export const PULL_UP_TO_REFRESH_FOCUS_TARGETS_SUCCESS = "PULL_UP_TO_REFRESH_FOCUS_TARGETS_SUCCESS";


export const ZHAOXIANGUAN = "ZHAOXIANGUAN";