'use strict';
import React, { Component } from 'react';
import { createStore,applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createLogger from 'redux-logger'
import MainNavigator from './MainNavigator'
import KpiPage from './reducers'
import thunkMiddleware from 'redux-thunk'
import Config from './config';
import loadingMiddleware from './tweet/middleware/loadingMiddleware'
const loggerMiddleware = createLogger();
const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware,
    loggerMiddleware,
    loadingMiddleware,
)(createStore);

let store = createStoreWithMiddleware(KpiPage);

class KpiNative extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Provider store={store}>
                <MainNavigator />
            </Provider>
        );
    }
}

export default KpiNative;
