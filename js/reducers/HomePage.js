import * as ActionTypes from '../actions/ActionTypes'
const initialState = {}
function HomePage(state={},action={}){
 let nextState = {};
 switch (action.type) {
   case ActionTypes.WEBAPI_HOMEPAGE:
      nextState = Object.assign({}, state,action.payload)     
      return  nextState
   case ActionTypes.LOGOUT:
   	  return initialState
   default:
     return state
 }
}
export default HomePage
