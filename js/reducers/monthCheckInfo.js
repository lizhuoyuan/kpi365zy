/**
 * Created by yuanzhou on 2017/02.
 */
import * as ActionTypes from '../actions/ActionTypes'
const initialState = {
  passTargets:[],
  lastMonthTargets:[],
};
function monthCheckInfo(state=initialState,action={}){
 let nextState = {};
 switch (action.type) {
   case ActionTypes.TO_MONTHCHECK:	   	  
      nextState = {...state,...action.payload}
      return  nextState
    case ActionTypes.CLEAR_PAGE:
    	if(action.payload.type === "clearMonthCheck"){
    		return initialState;
    	}else{
    		return state;
    	}
     case ActionTypes.LOGOUT:
         return initialState;
   default:
     return state
 }
}
export default monthCheckInfo
