/**
 * Created by Jeepeng on 2016/10/5.
 */

import {
  PREPARE_TWEET_CONTENT,
  CREATE_TWEET_SUCCESS,
} from '../actions/actionTypes';

const initState = {
  content: {
    text: '',
  },
  notices: [],
  view: ['world'],
};

export default (state = initState, action) => {
  let newState = {};
  switch (action.type) {
    case 'logout':
      return initState;
    // 缓存正在编辑的Tweet
    case PREPARE_TWEET_CONTENT: {
      let view = action.payload.view || [];
      if (view.length <= 0) {
        view = state.view;
      }
      newState = {
        ...state,
        content: {
          ...state.content,
          ...action.payload.content,
        },
        // TODO notices移除
        notices: [...state.notices, ...action.payload.notices],
        view: [...view],
      };
      break;
    }
    case CREATE_TWEET_SUCCESS:
      return initState;
    default:
      break;
  }
  return { ...state, ...newState };
};
