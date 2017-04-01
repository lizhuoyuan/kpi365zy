/**
 * Created by Jeepeng on 2016/10/1.
 */

export const FETCHING = 'FETCHING';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAIL = 'LOGOUT_FAIL';

/** 获取Tweets */
export const FETCH_TWEETS = 'FETCH_TWEETS';
/** 获取Tweets成功 */
export const FETCH_TWEETS_SUCCESS = 'FETCH_TWEETS_SUCCESS';
/** 获取Tweets失败 */
export const FETCH_TWEETS_FAIL = 'FETCH_TWEETS_FAIL';
/** 下拉刷新 */
export const PULL_DOWN_TO_REFRESH_SUCCESS = 'PULL_DOWN_TO_REFRESH_SUCCESS';
/** 上拉刷新 */
export const PULL_UP_TO_REFRESH_SUCCESS = 'PULL_UP_TO_REFRESH_SUCCESS';
/** 保存新Tweet内容 */
export const PREPARE_TWEET_CONTENT = 'PREPARE_TWEET_CONTENT';

/** 发Tweet */
export const CREATE_TWEET = 'CREATE_TWEET';
/** 发Tweet成功 */
export const CREATE_TWEET_SUCCESS = 'CREATE_TWEET_SUCCESS';
/** 发Tweet成功 */
export const CREATE_TWEET_FAIL = 'CREATE_TWEET_FAIL';
/** 等成功 */
export const REVOKE_TWEET_SUCCESS = 'REVOKE_TWEET_SUCCESS';
/** 点赞失败 */
export const REVOKE_TWEET_FAIL = 'REVOKE_TWEET_FAIL';

/** 点赞成功 */
export const CREATE_LIKE_SUCCESS = 'CREATE_LIKE_SUCCESS';
/** 点赞失败 */
export const CREATE_LIKE_FAIL = 'CREATE_LIKE_FAIL';
/** 点赞成功 */
export const REVOKE_LIKE_SUCCESS = 'REVOKE_LIKE_SUCCESS';
/** 点赞失败 */
export const REVOKE_LIKE_FAIL = 'REVOKE_LIKE_FAIL';

/** 评论成功 */
export const CREATE_COMMENT_SUCCESS = 'CREATE_COMMENT_SUCCESS';
/** 评论失败 */
export const CREATE_COMMENT_FAIL = 'CREATE_COMMENT_FAIL';
/** 删除评论成功 */
export const REVOKE_COMMENT_SUCCESS = 'REVOKE_COMMENT_SUCCESS';
/** 删除评论失败 */
export const REVOKE_COMMENT_FAIL = 'REVOKE_COMMENT_FAIL';

/** 获取@用户列表成功 */
export const GET_AT_USERS_SUCCESS = 'GET_AT_USERS_SUCCESS';
/** 获取@用户列表失败 */
export const GET_AT_USERS_FAIL = 'GET_AT_USERS_FAIL';

/** 获取某条Tweet成功 */
export const GET_TWEET_SUCCESS = 'GET_TWEET_SUCCESS';
/** 获取某条Tweet失败 */
export const GET_TWEET_FAIL = 'GET_TWEET_FAIL';

export const FOCUS_TARGET_SUCCESS = '_FOCUS_TARGET_SUCCESS';
export const FOCUS_TARGET_FAIL = '_FOCUS_TARGET_FAIL';

export const REVOKE_FOCUS_TARGET_SUCCESS = '_REVOKE_FOCUS_TARGET_SUCCESS';
export const REVOKE_FOCUS_TARGET_FAIL = '_REVOKE_FOCUS_TARGET_FAIL';


/** 通知中心 */
export const GET_NOTICE_SUCCESS = 'GET_NOTICE_SUCCESS'; // 未读消息数成功
export const GET_NOTICE_FAIL = 'GET_NOTICE_FAIL'; // 未读消息数失败
