/**
 * 授权信息
 * Created by Jeepeng on 16/9/9.
 */

'use strict';

import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from '../actions/actionTypes';

const initState = {
  userUniqueid: 'db9cac23c6de4586bd63393a49e91fa9',
  token: ''
};

export default (state = initState, action) => {
  let newState = {};
  switch (action.type) {
    case LOGIN_SUCCESS:
      newState = {...action.payload};
      break;
    case LOGOUT_SUCCESS:
      newState = {token: ''};
      break;
  }
  return {...state, ...newState};
};
