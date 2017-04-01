/**
 * Created by yuanzhou on 2017/02.
 */
import * as ActionTypes from '../actions/ActionTypes'
const initialState = {
    weekStarEvaluation: [],
    evaluations: [],
    fetching_success: false,
};
function weekEvaluateInfo(state = initialState, action = {}) {
    let nextState = {};
    switch (action.type) {
        case ActionTypes.TO_WEEKEVALUATE:
            nextState = {...state, fetching_success: false, ...action.payload}
            return nextState
        case ActionTypes.CLEAR_PAGE:
            if (action.payload.type === "clearWeekEvaluate") {
                return initialState;
            } else {
                return {state, fetching_success: false};
            }
        case ActionTypes.LOGOUT:
            return initialState;
        default:
            return {...state, fetching_success: false}
    }
}
export default weekEvaluateInfo
