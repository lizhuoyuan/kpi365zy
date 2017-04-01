/**
 * Created by Jeepeng on 2017/3/3.
 */

import React from 'react';
import { View, Image } from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  DrawerNavigator,
} from 'react-navigation';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import images from '../../config/images';
import SystemMessage from './SystemNotice';
import Messages from './Notices';
import NoticeList from './NoticeList';
import TouchableView from '../base/TouchableView';

const mapStateToProps = (state) => {
  return {
    dataStore: state,
  };
};

const MessageCenter = TabNavigator({
  SystemMessage: { screen: connect(mapStateToProps)(SystemMessage) },
  Messages: { screen: connect(state => ({notice: state.tweets.extra.notice}))(Messages) },
}, {
  ...TabNavigator.Presets.AndroidTopTabs,
  tabBarOptions: {
    activeTintColor: '#1da9fc',
    inactiveTintColor: '#5d6d81',
    inactiveBackgroundColor: '#fff',
    activeBackgroundColor: '#fff',
    showIcon: false,
    indicatorStyle: {
      borderBottomColor: '#1da9fc',
      borderBottomWidth: 2,
    },
    labelStyle: {
      fontSize: 15,
    },
    style: {
      height: 45,
      backgroundColor: '#fff',
    },
    tabStyle: {},
  },
  navigationOptions: {
    header: {
      backTitle: 'back',
    },
  },
});

/**
 * 嵌套路由
 */
const BasicNavigator = StackNavigator({
  Main: { screen: MessageCenter },
  NoticeList: { screen: connect(mapStateToProps)(NoticeList) },
}, {
  navigationOptions: {
    title: '消息中心',
    header: () => ({
      style: {
        backgroundColor: '#1da9fc',
      },
      titleStyle: {
        color: '#fff',
      },
      left: (
        <TouchableView
          style={{ height: 44, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
          onPress={Actions.pop} >
          <Image style={{ width: 22, height: 22 }} source={images.nav_back} />
        </TouchableView>
      ),
    }),
  },
});

export default BasicNavigator;
