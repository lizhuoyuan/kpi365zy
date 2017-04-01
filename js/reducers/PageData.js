import * as ActionTypes from '../actions/ActionTypes'
const initialState = {
    route: null,
    toBack: false,//是否返回
    isRefreshing: false,
    token: null,
    orgUniqueid: null,
    userUniqueid: null,
    loginUserInfo: null,
    identitys: null,
    autoLogin: true,//是否允许自动登录
    canUseBack: null,//是否允许返回　
    fetching_success: false,//获取数据成功
    getLocalInfoSuccess: false, //获取本地帐号密码
};
function PageData(state = initialState, action = {}) {
    let nextState = {};
    switch (action.type) {
        case ActionTypes.UPDATE_PAGE:
            nextState = Object.assign({}, state, {
                toBack: false,
                canUseBack: null,
                isRefreshing: false,
                autoLogin: true,
                fetching_success: false,
                getLocalInfoSuccess: false,
                needInitUpdate: null,
                route: null,
            }, action.payload);
            return nextState;
        case ActionTypes.LOGOUT:
            return {...initialState, canUseBack: null, userId: state.userId, password: ""};
        case ActionTypes.SESSION_ERROR:
            return {
                route: null,
                canUseBack: null,
                userId: state.userId,
                password: state.password,
                toBack: false,
                fetching_success: false,
                getLocalInfoSuccess: false,
                needInitUpdate: null,
                ERROR: "SESSION_ERROR"
            };
        case ActionTypes.TAB_MANAGE:
            return Object.assign({}, state, {
                toBack: false,
                canUseBack: null,
                isRefreshing: false,
                autoLogin: true,
                route: null,
                fetching_success: false,
                getLocalInfoSuccess: false,
                needInitUpdate: 0
            });
        case ActionTypes.SHOW_ERROR:
            return Object.assign({}, state, {
                needInitUpdate: null,
                isRefreshing: false,
                fetching_success: false,
                getLocalInfoSuccess: false,
            });
        default:
            return {...state, fetching_success: false, needInitUpdate: null, getLocalInfoSuccess: false};
    }
}
export default PageData
