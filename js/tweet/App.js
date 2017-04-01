/**
 * Created by Jeepeng on 2016/12/6.
 */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';

import loadingMiddleware from './middleware/loadingMiddleware';
import MainRouter from './components/MainRouter';

const middlewares = [thunkMiddleware, loadingMiddleware];
if (__DEV__) {
  const loggerMiddleware = require('redux-logger')();
  middlewares.push(loggerMiddleware);
}

const store = createStore(
  rootReducer,
  applyMiddleware(...middlewares)
);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MainRouter />
      </Provider>
    );
  }
}

export default App;
