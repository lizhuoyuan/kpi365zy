import * as ActionTypes from '../actions/ActionTypes'
const initialState = {
    fetching: false,
    showLoading: true,
    back: false,
    restart: false
};
function PageState(state = {}, action = {}) {
    let nextState = {};
    switch (action.type) {
        case ActionTypes.SHOW_LOADING:
            nextState = Object.assign({}, state, initialState, {fetching: true, showLoading: true}, action.payload)
            return nextState
        case ActionTypes.Hide_LOADING:
            nextState = Object.assign({}, initialState)
            return nextState
        case ActionTypes.CLIENT_BACK:
            return Object.assign({}, state, initialState, {back: true})
        case ActionTypes.UPDATE_PAGE: {
            return {...state, ...initialState}
        }

        case ActionTypes.LOGOUT: {
            return {...state, ...initialState}
        }
        case ActionTypes.LOGIN_FAIL: {
            return {...state, ...initialState}
        }
        case ActionTypes.LOGIN_SUCCESS: {
            return {...state, ...initialState}
        }
        case ActionTypes.TO_DAILYREPORT: {
            return {...state, ...initialState}
        }
        case ActionTypes.TO_CHOOSEUSER: {
            return {...state, ...initialState}
        }
        case ActionTypes.TO_MONTHCHECK: {
            return {...state, ...initialState}
        }
        case ActionTypes.TAB_MANAGE: {
            return {...state, ...initialState}
        }
        case ActionTypes.TO_DELAYTARGETCHECK: {
            return {...state, ...initialState}
        }
        case ActionTypes.TO_WEEKEVALUATEHISTORY: {
            return {...state, ...initialState}
        }
        case ActionTypes.TO_WEEKEVALUATE: {
            return {...state, ...initialState}
        }
        /* case ActionTypes.RECALL_FOCUS_TARGET_SUCCESS: {
         return {...state, ...initialState}
         }*/
        /*case ActionTypes.FETCH_FOCUS_TARGETS: {
         return {...state, fetching: true}
         }*/
        case ActionTypes.FETCH_FOCUS_TARGETS_FAIL: {
            return {...state, ...initialState}
        }
        case ActionTypes.FETCH_FOCUS_TARGETS_SUCCESS: {
            return {...state, ...initialState}
        }
        default:
            return {...state, ...initialState}
    }
}
export default PageState
