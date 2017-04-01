'use strict';
import {Platform} from 'react-native'
let outsideConfig = window.CONFIG || {}; // 在html文件中配置
let config = {
    apiRoot: 'https://www.kpi365.com/smartx/webapi',
    //apiRoot: outsideConfig.apiRoot || 'http://140.207.233.103:8080/smartx/webapi',
    // apiRoot: outsideConfig.apiRoot || 'https://www.okr365.com/smartx/webapi',
    // apiRoot2: outsideConfig.apiRoot || 'http://140.207.233.103:8080/smartx/webapi',
    //apiRoot: 'http://192.168.30.245:8080/smartx/webapi',
    apiRootzy: 'http://192.168.30.250:8080/smartx/webapi/service/aolc',
    //apiRootzy: 'https://www.kpi365.com:8443/smartx/webapi/service/aolc/',

    //'http://192.168.30.122:8080/smartx/webapi',
    //'http://140.207.233.103:8080/smartx/webapi',
    appCode: outsideConfig.app || 'aolc',//'kpi',
    localLoginIdKey: 'userId',//用于加载本地存储的用户名,需要服务器端配合设置save action并且命名一致
    localLoginPassword: 'password'//用于加载本地存储的登录密码,需要服务器端配合设置save action并且命名一致

};
//config.apiUploadRoot = 'http://140.207.233.103:8080/smartx/webapi/adapterx/';
//config.apiUploadRoot = 'https://www.okr365.com/smartx/webapi/adapterx/';
config.apiUploadRoot = 'https://www.kpi365.com:8443/smartx/webapi/adapterx/'
config.upload = config.apiUploadRoot + 'resource/upload';
config.webapi = {
    login: `${config.apiRoot}/service/${config.appCode}/clientLogin/`,
    //获取用户目标
    getUserTarget: `${config.apiRoot}/service/${config.appCode}/clientGetUserTarget/`,
    //增加、删除、用户目标
    clientUserTargetManage: `${config.apiRoot}/service/${config.appCode}/clientUserTargetManage/`,
    //遗留管理
    clientUserTargetDelayManage: `${config.apiRoot}/service/${config.appCode}/clientUserTargetDelayManage/`,
    //更新用户目标进度
    clientUpdateUserTargetProgress: `${config.apiRoot}/service/${config.appCode}/clientUpdateUserTargetProgress/`,
    //自我周评
    selfEvaluate: `${config.apiRoot}/service/${config.appCode}/clientSelfEvaluate/`,
    //目标提交审核
    clientSubmitToCheck: `${config.apiRoot}/service/${config.appCode}/clientSubmitToCheck/`,
    //获取自评
    clientGetSelfEvaluate: `${config.apiRoot}/service/${config.appCode}/clientGetSelfEvaluate/`,
    //获取用户组织关系
    clientGetPeopleRelationship: `${config.apiRoot}/service/${config.appCode}/clientGetPeopleRelationship/`,
    //获取用户年度目标
    clientGetUserYearTarget: `${config.apiRoot}/service/${config.appCode}/clientGetUserYearTarget/`,
    //获取下级待审核用户目标
    clientGetUserLowerLevelNeedCheckMonthTarget: `${config.apiRoot}/service/${config.appCode}/clientGetUserLowerLevelNeedCheckMonthTarget/`,
    //用户目标审核
    clientUserTargetCheck: `${config.apiRoot}/service/${config.appCode}/clientUserTargetCheck/`,
    //组织选择
    clientChooseOrg: `${config.apiRoot}/service/${config.appCode}/clientChooseOrg/`,
    //周评管理
    clientManageWeekEvaluate: `${config.apiRoot}/service/${config.appCode}/clientManageWeekEvaluate/`,
    //个人中心管理
    clientSelfCenter: `${config.apiRoot}/service/${config.appCode}/clientSelfCenter/`,
    //签到
    clientSign: `${config.apiRoot}/service/${config.appCode}/clientSign/`,
    //奖励管理
    clientRewardManage: `${config.apiRoot}/service/${config.appCode}/clientRewardManage/`,
    //更新密码
    clientUpdateUserPassword: `${config.apiRoot}/service/${config.appCode}/clientUpdateUserPassword/`,
    service: `${config.apiRoot}/service/${config.appCode}/`,

    GetApplicants: `${config.apiRootzy}/GetApplicants/`,
    getXiangQing: `${config.apiRootzy}/GetYingPinXiangQing/`,
    getPinggu: `${config.apiRootzy}/GetPinggu/`,
    updatePinggu: `${config.apiRootzy}/UpdatePinggu/`,
    getWenhua:`${config.apiRootzy}/GetWenhua/`,
};

module.exports = config;
//pushKey:qUb777upzQPP-S_KsordB6McmaRTVJX5cuxNG
///Users/aolc/.code-push.config