/**
 * Created by yuanzhou on 2017/03/09.
 */

import {
    FETCH_FOCUS_TARGET_SUCCESS,
    FETCH_FOCUS_TARGETS,
    FETCH_FOCUS_TARGETS_FAIL,
    FETCH_FOCUS_TARGETS_SUCCESS,
    PULL_DOWN_TO_REFRESH_FOCUS_TARGETS_SUCCESS,
    PULL_UP_TO_REFRESH_FOCUS_TARGETS_SUCCESS,
    REVOKE_FOCUS_TARGET_SUCCESS
} from '../actions/ActionTypes';

const convert = (items = []) => {
    let entities = {};
    items.forEach(item => {
        entities[item.id] = item
    });
    return entities;
};

const initState = {
    fetching: false,
    index: {
        top: 0,
        bottom: 0,
    },
    entities: {},
};
export default (state = initState, action) => {
    let newState = {};
    switch (action.type) {
        case 'logout':
            return initState;
        case FETCH_FOCUS_TARGETS:
            newState = {
                ...state,
                fetching: true,
            };
            break;
        // 获取Focus_targets成功
        case FETCH_FOCUS_TARGETS_SUCCESS:
            let entities = action.payload.data;//convert(action.payload.items || []);
            if (!entities) {
                entities = {};
            }
            newState = {
                ...state,
                fetching: false,
                //index: action.payload.index,
                entities: entities
            };
            break;
        // 下拉刷新
        case PULL_DOWN_TO_REFRESH_FOCUS_TARGETS_SUCCESS:
            const TopEntities = action.payload.data//convert(action.payload.items || []);
            newState = {
                ...state,
                fetching: false,
                index: {
                    ...state.index,
                    top: action.payload.index.top,
                },
                entities: {...TopEntities, ...state.entities}
            };
            break;
        // 上拉刷新
        case PULL_UP_TO_REFRESH_FOCUS_TARGETS_SUCCESS:
            let {items} = action.payload;
            let BottomEntities = action.payload.data//convert(items || []);
            newState = {
                ...state,
                fetching: false,
                index: {
                    ...state.index,
                    bottom: index.bottom,
                },
                entities: {...state.entities, ...BottomEntities}
            };
            break;
        case FETCH_FOCUS_TARGETS_FAIL:
            newState = {
                ...state,
                fetching: false,
            };
            break;
        case FETCH_FOCUS_TARGET_SUCCESS:
            let focus_target = action.payload.data;
            let old = {...state.entities};
            if (old[focus_target.id]) {
                old[focus_target.id] = focus_target;
            }
            newState = {
                ...state,
                entities: {...old}
            };
            break;
        case REVOKE_FOCUS_TARGET_SUCCESS:
            let copy = {...state.entities};
            delete copy[action.payload.id];
            newState = {
                ...state,
                index: {
                    ...state.index,
                    // 删除后index top要-1，否则导致新增的tweet无法加载
                    top: state.index.top - 1
                },
                entities: {...copy}
            };
            break;
    }
    return {...state, ...newState};
}