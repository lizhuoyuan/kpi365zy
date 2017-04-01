/**
 * Created by Jeepeng on 16/9/17.
 */

import { createAction } from 'redux-actions';

import http from '../utils/http';
import * as actionTypes from './actionTypes';

export const fetch = (action = 'init', dataIndex = 'world') => (dispatch, getState) => {
  let { tweets, PageData } = getState();
  let index = {};
  action === 'down' && ( index = {top: tweets[dataIndex].index.top} );
  action === 'up' && ( index = {bottom: tweets[dataIndex].index.bottom} );
  if (Object.keys((tweets[dataIndex] || {}).entities || {}).length <= 0) {
    index = {};
  }
  let postParams = {
    'user': PageData.userUniqueid,
    'type': dataIndex,
    'num': 20,
    'index': index
  };
  dispatch(createAction(actionTypes.FETCH_TWEETS)({dataIndex}));
  http.requestService('fetch', postParams)
    .then(data => {
      switch (action) {
        case 'down':
          dispatch(createAction(actionTypes.PULL_DOWN_TO_REFRESH_SUCCESS)({
            dataIndex,
            data
          }));
          break;
        case 'up':
          dispatch(createAction(actionTypes.PULL_UP_TO_REFRESH_SUCCESS)({
            dataIndex,
            data
          }));
          break;
        default:
          dispatch(createAction(actionTypes.FETCH_TWEETS_SUCCESS)({
            dataIndex,
            data
          }));
      }
    })
    .catch(err => {
      dispatch(createAction(actionTypes.FETCH_TWEETS_FAIL)({
        dataIndex,
        err
      }));
    });
};

export const createTweet = (newTweet, dataIndex) => (dispatch, getState) => {
  const { PageData } = getState();
  let postParams = {
    type: 'tweet',
    user: PageData.userUniqueid,
    content: '',
    view: [],
    notices: [],
    receivers: [],
    custom: {},
    parent: '',
    ...newTweet
  };
  dispatch(createAction(actionTypes.FETCHING)());
  return http.requestService('create', postParams).then(json => {
      dispatch(createAction(actionTypes.CREATE_TWEET_SUCCESS)({
        dataIndex,
        tweet: json
      }));
      //setTimeout(() => dispatch(fetch('down', dataIndex)), 20);
    })
    .catch(err => {
      dispatch(createAction(actionTypes.CREATE_TWEET_FAIL)(err));
    });
};

/**
 * 撤回Tweet
 * @param tweetid
 * @param dataIndex
 */
export const revokeTweet = (tweetid = '', dataIndex = 'world') => (dispatch, getState) => {
  const { PageData } = getState();
  let postParams = {
    'user': PageData.userUniqueid,
    'type': 'tweet',
    'id': tweetid,
    'root': tweetid
  };
  dispatch(createAction(actionTypes.FETCHING)());
  return http.requestService('recall', postParams).then(json => {
    dispatch(createAction(actionTypes.REVOKE_TWEET_SUCCESS)({
      dataIndex,
      id: tweetid
    }));
  })
    .catch(err => {
      dispatch(createAction(actionTypes.REVOKE_TWEET_FAIL)(err));
    });
};

/**
 * 评论
 * @param comment
 * @param tweetid
 * @param parentid
 * @param dataIndex
 */
export const createComment = (comment = '', tweetid = '', parentid, dataIndex) => (dispatch, getState) => {
  const { PageData } = getState();
  let postParams = {
    'type': 'tweestar_comment',
    'user': PageData.userUniqueid,
    'content': {
      text: comment
    },
    'view': [],
    'notices': [],
    'receivers': [],
    'custom': {},
    'parent': parentid
  };
  dispatch(createAction(actionTypes.FETCHING)());
  return http.requestService('create', postParams).then(json => {
    dispatch(createAction(actionTypes.CREATE_COMMENT_SUCCESS)(json));
    dispatch(getTweet(tweetid, dataIndex));
  })
    .catch(err => {
      dispatch(createAction(actionTypes.CREATE_COMMENT_SUCCESS)(err));
    });
};

/**
 * 删除评论
 * @param commentid
 * @param tweetid
 */
export const revokeComment = (commentid = '', tweetid = '') => (dispatch, getState) => {
  const { PageData } = getState();
  let postParams = {
    'user': PageData.userUniqueid,
    'type': 'tweestar_comment',
    'id': commentid,
    'root': tweetid
  };
  dispatch(createAction(actionTypes.FETCHING)());
  return http.requestService('recall', postParams).then(json => {
    dispatch(createAction(actionTypes.REVOKE_COMMENT_SUCCESS)(json));
    dispatch(getTweet(tweetid));
  })
    .catch(err => {
      dispatch(createAction(actionTypes.REVOKE_COMMENT_FAIL)(err));
    });
};

/**
 * 点赞
 * @param tweet
 * @param dataIndex
 */
export const createLike = (tweet = {}, dataIndex) => (dispatch, getState) => {
  const { PageData } = getState();
  let postParams = {
    'type': 'tweestar_support',
    'user': PageData.userUniqueid,
    content: {
      _parent: {
        content: tweet.content,
        user: tweet.user
      }
    },
    'parent': tweet.id
  };
  dispatch(createAction(actionTypes.FETCHING)());
  return http.requestService('create', postParams).then(json => {
    dispatch(createAction(actionTypes.CREATE_LIKE_SUCCESS)(json));
    dispatch(getTweet(tweet.id, dataIndex));
  })
    .catch(err => {
      dispatch(createAction(actionTypes.CREATE_LIKE_FAIL)(err));
    });
};

/**
 * 取消点赞
 * @param likeid
 * @param tweetid
 * @param dataIndex
 */
export const revokeLike = (likeid = '', tweetid = '', dataIndex) => (dispatch, getState) => {
  const { PageData } = getState();
  let postParams = {
    'user': PageData.userUniqueid,
    'type': 'tweestar_support',
    'id': likeid,
    'root': tweetid
  };
  dispatch(createAction(actionTypes.FETCHING)());
  return http.requestService('recall', postParams).then(json => {
    dispatch(createAction(actionTypes.REVOKE_LIKE_SUCCESS)(json));
    dispatch(getTweet(tweetid, dataIndex));
  })
    .catch(err => {
      dispatch(createAction(actionTypes.REVOKE_LIKE_FAIL)(err));
    });
};

export const getTweet = (tweetid = '', dataIndex = 'world', loading = true) => (dispatch, getState) => {
  const { PageData } = getState();
  let postParams = {
    'user': PageData.userUniqueid,
    id: tweetid
  };
  loading && dispatch(createAction(actionTypes.FETCHING)());
  return http.requestService('item', postParams).then(data => {
    dispatch(createAction(actionTypes.GET_TWEET_SUCCESS)({
      dataIndex,
      data
    }));
  })
    .catch(err => {
      dispatch(createAction(actionTypes.GET_TWEET_FAIL)(err));
    });
};

export const getAtUsers = (tweetid = '') => (dispatch, getState) => {
  const { PageData } = getState();
  let postParams = {
    'user': PageData.userUniqueid,
  };
  dispatch(createAction(actionTypes.FETCHING)());
  return http.requestService('orgUser', postParams).then(json => {
    dispatch(createAction(actionTypes.GET_AT_USERS_SUCCESS)(json));
  })
    .catch(err => {
      dispatch(createAction(actionTypes.GET_AT_USERS_FAIL)(err));
    });
};

/**
 * 获取未读消息数量
 * @param category 通知类型
 */
export const getNoticeCount = (category = '') => (dispatch, getState) => {
  const { PageData } = getState();
  let postParams = {
    'user': PageData.userUniqueid,
    'type': category,
  };
  return http.requestService('newestCount', postParams).then(json => {
      dispatch(createAction(actionTypes.GET_NOTICE_SUCCESS)(json));
    })
    .catch(err => {
      dispatch(createAction(actionTypes.GET_NOTICE_FAIL)(err));
    });
};


/**
 * 目标关注
 * @param  tweetid
 * @param  uniqueid
 * @param  userUniqueid
 * @return
 */
export const targetFocus = (tweetid = '', uniqueid, userUniqueid, dataIndex) => (dispatch, getState) => {
  let { PageData } = getState();
  let postParams = {
    type: 'target_focus',
    content: {},
    notice: [],
    parent: tweetid,
    view: [],
    custom: {
      target: uniqueid  //目标id 多个目标的话用,隔开 例如："1,2"；
    },
    targetUniqueid: uniqueid,//目标id 多个目标的话用,隔开 例如："1,2"
    targetUserUniqueid: userUniqueid,//目标的用户
    'user': PageData.userUniqueid,
    'x_token': PageData.token
  };
  dispatch(createAction(actionTypes.FETCHING)());
  return http.requestService(`create`, postParams).then(json => {
    dispatch(createAction(actionTypes.FOCUS_TARGET_SUCCESS)(json));
    dispatch(getTweet(tweetid, dataIndex));
  })
    .catch(err => {
      dispatch(createAction(actionTypes.FOCUS_TARGET_FAIL)(err));
    });
};

/**
 * 目标取消关注
 * @param  tweetid
 * @param  focusKey
 * @param  userUniqueid
 * @return
 */
export const targetRecallFocus = (tweetid = '', focusKey, targetId, userUniqueid, dataIndex) => (dispatch, getState) => {
  let { PageData } = getState();
  let postParams = {
    type: 'target_focus',
    id: focusKey, //refs => target_focus 的key值
    root: tweetid,  //tweetId
    targetUniqueid: targetId, //目标id 多个目标的话用,隔开 例如："1,2"
    targetUserUniqueid: userUniqueid, //目标的用户
    'user': PageData.userUniqueid,
    'x_token': PageData.token
  };
  dispatch(createAction(actionTypes.FETCHING)());
  return http.requestService(`recall`, postParams).then(json => {
    dispatch(createAction(actionTypes.REVOKE_FOCUS_TARGET_SUCCESS)(json));
    dispatch(getTweet(tweetid, dataIndex));
  })
    .catch(err => {
      dispatch(createAction(actionTypes.REVOKE_FOCUS_TARGET_FAIL)(err));
    });
};