import * as ActionTypes from '../actions/ActionTypes'
const initialState = {tabClickIndex: 0, component: null, title: '首页', isShowTabBar: true}
function TabManage(state = {tabClickIndex: 0, component: null, title: '首页'}, action = {}) {
    let nextState = {};
    switch (action.type) {
        case ActionTypes.TAB_MANAGE:
            nextState = Object.assign({}, state, action.payload)
            return nextState
        case 'REACT_NATIVE_ROUTER_FLUX_PUSH':
            if (action.key === 'loading') {
                return state;
            } else {
                return {...state, isShowTabBar: false};
            }
        case 'REACT_NATIVE_ROUTER_FLUX_BACK_ACTION':
            if (action.isLoading === true) {
                return state;
            } else {
                return {...state, isShowTabBar: true};
            }
        case ActionTypes.LOGOUT:
            return initialState;
        case ActionTypes.UPDATE_PAGE:
            if (action.payload && (action.payload.isShowTabBar === true || action.payload.isShowTabBar === false)) {
                return {...state, isShowTabBar: action.payload.isShowTabBar};
            } else {
                return state;
            }
        default:
            return state;
    }
}
export default TabManage
