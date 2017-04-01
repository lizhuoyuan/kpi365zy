/**
 * Created by Jeepeng on 2017/3/3.
 */

import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';

class SystemMessage extends Component {
  static navigationOptions = {
    tabBar: {
      label: '系统消息',
    },
  };
  render() {
    // const { navigate } = this.props.navigation;
    return (
      <View style={{alignItems: 'center', marginTop: 20}}>
        <Text>敬请期待</Text>
      </View>
    );
  }
}

export default SystemMessage;
