/**
 * Created by Jeepeng on 16/9/8.
 */

import { combineReducers } from 'redux';

import user from './user';
import routes from './routes';
import tweets from './tweets';
import draft from './draft';
import appState from './appState';

export default combineReducers({
  PageData: user,
  tweets,
  draft,
  appState,
  routes
});
