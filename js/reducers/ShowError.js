import * as ActionTypes from '../actions/ActionTypes'
function ShowError(state={ERROR:null},action={}){
 let nextState = {};
 switch (action.type) {
   case ActionTypes.SHOW_ERROR:
      nextState = Object.assign({},state,{ERROR:action.payload})
      return  nextState
   case ActionTypes.UPDATE_PAGE:
   		return {ERROR:null}
   default:
     return state
 }
}
export default ShowError
