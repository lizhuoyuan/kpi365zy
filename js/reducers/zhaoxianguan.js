import * as ActionTypes from '../actions/ActionTypes'
const initialState = {
    persons: [],
    shesize: 0,
    xiaosize: 0,
    wenhua: {},
    persons: {},
    pinggus: [],
};
function zhaoxianguan(state = initialState, action = {}) {
    let nextState = {};
    switch (action.type) {
        case ActionTypes.ZHAOXIANGUAN:
            nextState = {...state, ...action.payload,}
            return nextState
        case ActionTypes.LOGOUT:
            return initialState
        default:
            return state
    }
}
export default zhaoxianguan
