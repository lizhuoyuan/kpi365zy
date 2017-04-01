/**
 * Created by Jeepeng on 16/8/25.
 */

import * as ActionTypes from '../actions/actionTypes';
import Loading from '../components/base/Loading';

/**
 * loading
 * @param dispatch
 * @param getState
 */
const loadingMiddleware = ({dispatch, getState}) => next => action => {
  let result = next(action);
  let fetching = getState().appState.fetching;
  if (action.type === ActionTypes.FETCHING) {
    Loading.show();
  } else if (!fetching) {
    Loading.hide();
  }
  return result;
};

export default loadingMiddleware;
