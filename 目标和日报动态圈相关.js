//目标数据
let item = {
    "content":{
        "targets":[
            {
                "createTime":"2017-03-06 17:41:36",
                "text":"5555",
                "uniqueid":"3f61d471187848aab79733c257d0b3d3"
            },
            {
                "createTime":"2017-03-06 17:44:59",
                "text":"6666",
                "uniqueid":"40cfa19349be4621a2cb8b70523a9790"
            }
        ]
    },
   "refs":{
    "target_focus":[
        {
            "839662827009474560":"3f61d471187848aab79733c257d0b3d3"  //目标id
        },
        {
            "839667041374830592":"40cfa19349be4621a2cb8b70523a9790"
        }
    ]

}
    /**
     * 目标关注
     * @param  tweetid
     * @param  dataIndex
     * @param  postData
     * @return
     */
    let postData = { //接口  'create'
        type: "target_focus",
        content: {},
        notice: [],
        parent: id,
        view: [],
        custom: {
            target: uniqueid  //目标id 多个目标的话用,隔开 例如："1,2"；
        },
        targetUniqueid: uniqueid,//目标id 多个目标的话用,隔开 例如："1,2"
        targetUserUniqueid: userUniqueid,//目标的用户
    };
    export const targetFocus = (tweetid = '', dataIndex, postData) => (dispatch, getState) => {
        let {PageData } = getState();
        let postParams = {
            ...postData,
            "user": PageData.userUniqueid,
            "x_token": PageData.token
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
 * @param  dataIndex
 * @param  postData
 * @return
 */
let postData = { //接口 'recall'
    type: "target_focus",
    id: focusKey, //refs => target_focus 的key值
    root: id,  //tweetId
    targetUniqueid: uniqueid, //目标id 多个目标的话用,隔开 例如："1,2"
    targetUserUniqueid: userUniqueid, //目标的用户
}
export const targetRecallFocus = (tweetid = '', dataIndex, postData) => (dispatch, getState) => {
    let {PageData } = getState();
    let postParams = {
        ...postData,
        "user": PageData.userUniqueid,
        "x_token": PageData.token
    };
    dispatch(createAction(actionTypes.FETCHING)());
    return http.requestService(`recall`, postParams).then(json => {
        dispatch(createAction(actionTypes.RECALL_FOCUS_TARGET_SUCCESS)(json));
        dispatch(getTweet(tweetid, dataIndex));
    })
        .catch(err => {
            dispatch(createAction(actionTypes.RECALL_FOCUS_TARGET_FAIL)(err));
        });
};


//日报数据
let ribao = {
    "content":{
        "date":"2017-03-10",
        "totalStar":"9",
        "questionOrSummary":"日报测试：@test 快来看看呀 😄😄😄😄😄😄 第一天吃🐟 第二天吃🍎",
        "text":"新鲜日白出炉，快来看看吧！"
    }
}
