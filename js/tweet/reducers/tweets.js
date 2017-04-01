/**
 * Created by Jeepeng on 2016/10/5.
 */

import {
  FETCH_TWEETS,
  FETCH_TWEETS_FAIL,
  FETCH_TWEETS_SUCCESS,
  REVOKE_TWEET_SUCCESS,
  PULL_DOWN_TO_REFRESH_SUCCESS,
  PULL_UP_TO_REFRESH_SUCCESS,
  GET_AT_USERS_SUCCESS,
  GET_TWEET_SUCCESS,
  CREATE_TWEET_SUCCESS,
  GET_NOTICE_SUCCESS,
} from '../actions/actionTypes';

const convert = (items = []) => {
  let entities = {};
  items.forEach(item => {
    entities[item.id] = item;
  });
  return entities;
};

const initState = {
  world: {
    fetching: false,
    index: {
      top: 0,
      bottom: 0,
    },
    entities: {},
  },
  extra: {
    categories: [{
      label: '全部可见',
      value: 'world',
    },{
      label: '国家可见',
      value: 'country',
    }],
    atUsers: [],
    notice: {
      _count: 0,
    }
  },
};

export default (state = initState, action) => {
  let newState = {};
  switch (action.type) {
    case 'logout':
      return initState;
    case FETCH_TWEETS:
      newState = {
        [action.payload.dataIndex]: {
          ...state[action.payload.dataIndex],
          fetching: true,
        },
      };
      break;
    // 获取Tweets成功
    case FETCH_TWEETS_SUCCESS:
      let entities = convert(action.payload.data.items || []);
      newState = {
        ...state,
        [action.payload.dataIndex]: {
          fetching: false,
          index: action.payload.data.index,
          entities
        }
      };
      break;
    // 下拉刷新
    case PULL_DOWN_TO_REFRESH_SUCCESS:
      const TopEntities = convert(action.payload.data.items || []);
      newState = {
        ...state,
        [action.payload.dataIndex]: {
          fetching: false,
          index: {
            ...state[action.payload.dataIndex].index,
            top: action.payload.data.index.top,
          },
          entities: {...TopEntities, ...state[action.payload.dataIndex].entities}
        }
      };
      break;
    // 上拉刷新
    case PULL_UP_TO_REFRESH_SUCCESS:
      let { dataIndex, data } = action.payload;
      let BottomEntities = convert(data.items || []);
      newState = {
        ...state,
        [dataIndex]: {
          fetching: false,
          index: {
            ...state[dataIndex].index,
            bottom: data.index.bottom,
          },
          entities: {...state[dataIndex].entities, ...BottomEntities}
        },
      };
      break;
    case FETCH_TWEETS_FAIL:
      newState = {
        [action.payload.dataIndex]: {
          ...state[action.payload.dataIndex],
          fetching: false,
        },
      };
      break;
    case GET_TWEET_SUCCESS:
      let tweet = action.payload.data;
      let tweetDataIndex = action.payload.dataIndex;
      let old = {...state[tweetDataIndex].entities};
      if (old[tweet.id]) {
        old[tweet.id] = tweet;
      }
      newState = {
        [tweetDataIndex]: {
          ...state[tweetDataIndex],
          entities: {...old}
        }
      };
      break;
    // 发Tweet成功
    case CREATE_TWEET_SUCCESS:
      const item = action.payload.tweet;
      newState = {
        [action.payload.dataIndex]: {
          ...state[action.payload.dataIndex],
          index: {
            ...state[action.payload.dataIndex].index,
            // 删除后index top要-1，否则导致新增的tweet无法加载
            top: state[action.payload.dataIndex].index.top + 1
          },
          entities: {[item.id]: item, ...state[action.payload.dataIndex].entities}
        }
      };
      break;
    case REVOKE_TWEET_SUCCESS:
      let copy = {...state[action.payload.dataIndex].entities};
      delete copy[action.payload.id];
      newState = {
        [action.payload.dataIndex]: {
          ...state[action.payload.dataIndex],
          index: {
            ...state[action.payload.dataIndex].index,
            // 删除后index top要-1，否则导致新增的tweet无法加载
            top: state[action.payload.dataIndex].index.top - 1
          },
          entities: {...copy}
        }
      };
      break;
    case GET_AT_USERS_SUCCESS:
      newState = {
        extra: {
          ...state.extra,
          atUsers: action.payload
        }
      };
      break;
    case GET_NOTICE_SUCCESS:
      // 计算未读通知数总和
      let counts = Object.values(action.payload) || [];
      const count = counts.reduce((acc, val) => {
        return acc + val;
      }, 0);
      newState = {
        extra: {
          ...state.extra,
          notice: {
            _count: count,
            ...action.payload,
          }
        }
      };
      break;
  }
  return {...state, ...newState};
};
