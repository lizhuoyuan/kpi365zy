/**
 * Created by Jeepeng on 2016/12/7.
 */

const initState = {
  fetching: false
};

export default (state = initState, action) => {
  let newState = {};
  switch (action.type) {
    case 'FETCHING':
      newState = {fetching: true};
      break;
    default:
      if (action.type.indexOf('REACT_NATIVE_ROUTER_FLUX') === -1) {
        newState = {fetching: false};
      }
  }
  return {...state, ...newState};
};
