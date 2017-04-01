/**
 * Created by Jeepeng on 2017/2/15.
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  InteractionManager,
} from 'react-native';
import { fetch } from '../../actions/actionCreators';
import TweetList from './TweetList';

export default class TweetsWithCategory extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.fetch('init');
  }

  fetch(action = 'init') {
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch(fetch(action, this.props.category));
    });
  }

  render() {
    let dataIndex = this.props.category;
    return (
      <TweetList {...this.props} dataIndex={dataIndex} fetching={this.props.fetching} />
    );
  }
}
