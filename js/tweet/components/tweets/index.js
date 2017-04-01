/**
 * Created by Jeepeng on 2016/12/8.
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Image,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { TouchableView } from '../base';
import TopTabBar from '../TopTabBar';
import TweetsWithCategory from './TweetsWithCategory';
import images from '../../config/images';
import FocusList from '../../../components/tweetTarget/FocusList'

class Tweets extends Component {

  constructor(props) {
    super(props);
    this.state = {
      enterTab: 0,
    };
  }

  _renderNavLeft() {
    return (
      <TouchableView
        style={styles.navBarBtn}
        onPress={Actions.NoticeCenter} >
        <Image style={{ width: 22, height: 22 }} source={images.nav_bell} />
      </TouchableView>
    );
  }

  _renderNavRight() {
    return (
      <TouchableView
        style={styles.navBarBtn}
        onPress={Actions.tweet}>
        <Image style={{width: 22, height: 22}} source={images.nav_write} />
      </TouchableView>
    );
  }

  _renderTopTabBar() {
    return (
      <TopTabBar
        backgroundColor="#2BABF9"
        renderLeftComponent={this._renderNavLeft.bind(this)}
        renderRightComponent={this._renderNavRight.bind(this)}
      />
    );
  }

  _onChangeTab(obj) {
    this.setState({
      enterTab: obj.i,
    });
  }

  render() {
    let { focusTargets, tweets, PageData } = this.props.dataStore;
    const userid = PageData.userUniqueid;
    return (
      <View style={{flex: 1}}>
        <StatusBar backgroundColor="#2BABF9" barStyle="light-content" />
        <ScrollableTabView
          contentProps={{keyboardShouldPersistTaps: 'always'}}
          renderTabBar={this._renderTopTabBar.bind(this)}
          onChangeTab={this._onChangeTab.bind(this)}
        >
          <TweetsWithCategory
            tabLabel="全部"
            dispatch={this.props.dispatch}
            userid={userid}
            category="world"
            tweets={tweets.world} />
          <TweetsWithCategory
            tabLabel="国家"
            dispatch={this.props.dispatch}
            userid={userid}
            category="country"
            tweets={tweets.country} />
            <FocusList
                tabLabel='关注'
                enterTab={this.state.enterTab}
                dispatch={this.props.dispatch}
                pageModel={this.props.dataStore}
                category="follow"
                focusTargets={focusTargets}/>
        </ScrollableTabView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f2f2f2'
  },
  navBarBtn: {
    height: 44,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default Tweets;
