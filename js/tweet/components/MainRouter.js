/**
 * Created by Jeepeng on 2016/11/6.
 */

import React from 'react';
import { Platform } from 'react-native';
import {
  Scene,
  Reducer,
  Router,
  Switch,
  Modal,
  Actions,
  ActionConst,
} from 'react-native-router-flux';
import { connect } from 'react-redux';

//import Login from './Login'
import Tweet from './Tweet';
import Tweets from './tweets';
import TweetDetails from './TweetDetails';
import NoticeCenter from './notice/NoticeCenter';
import InAppBrowser from '../components/base/InAppBrowser';

const mapStateProps = (state) => {
  return {dataStore: state};
};
const RouterWithRedux = connect()(Router);

const scenes = Actions.create(
  <Scene key="modal" component={Modal} >
    <Scene key="root" titleStyle={{color: '#fff'}} backButtonTextStyle={{color: '#fff'}}>
      <Scene key="tweets" component={connect(mapStateProps)(Tweets)} title="动态圈" />
      <Scene key="tweet" component={connect(mapStateProps)(Tweet)}/>
      <Scene key="tweetDetails" component={connect(mapStateProps)(TweetDetails)} title="动态详情" />
      <Scene key="NoticeCenter" component={NoticeCenter} />
      <Scene key="InAppBrowser" component={InAppBrowser} />
    </Scene>
  </Scene>
);

const sceneStyle = (NavigationSceneRendererProps,{hideNavBar,hideTabBar,isActive}) => {
  if (hideNavBar) {
    return {};
  }
  return Platform.select({
    ios: {
      paddingTop: 64,
    },
    android: {
      paddingTop: 54
    }
  });
};

const MainRouter = () => {
  return (
    <RouterWithRedux hideNavBar={true} scenes={scenes} navigationBarStyle={{backgroundColor: '#fff'}} getSceneStyle={sceneStyle} />
  );
};

export default MainRouter;
