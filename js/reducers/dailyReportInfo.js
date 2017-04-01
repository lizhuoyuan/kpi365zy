/**
 * Created by yuanzhou on 2017/02.
 */
import * as ActionTypes from '../actions/ActionTypes'
const initialState = {
    weekStarEvaluation: [],
    evaluations: [],
};
function dailyReportInfo(state = initialState, action = {}) {
    let nextState = {};
    switch (action.type) {
        case ActionTypes.TO_DAILYREPORT:
            nextState = {...state, isRefreshing: false, ...action.payload}
            return nextState
        case ActionTypes.CLEAR_PAGE:
            if (action.payload.type === "clearDailyReport") {
                return initialState;
            } else {
                return state;
            }
        case ActionTypes.LOGOUT:
            return initialState;
        default:
            return state
    }
}
export default dailyReportInfo
