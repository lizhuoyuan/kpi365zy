/**
 * Created by Jeepeng on 2016/12/8.
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  Alert,
  Image,
  Platform,
  Modal,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  InteractionManager,
} from 'react-native';
import moment from 'moment';
import 'moment/locale/zh-cn';

import { ListView, TouchableView } from '../base';
import images from '../../config/images';
import TweetView from '../../lib/TweetView';
import { fetch } from '../../actions/actionCreators';

moment.locale('zh-cn');

const PAGE_SIZE = 20;

class NoticeList extends Component {

  static navigationOptions = {
    title: ({ state }) => `${state.params.title}`,
    header: ({ goBack }) => ({
      style: {
        backgroundColor: '#1da9fc',
      },
      titleStyle: {
        color: '#fff',
      },
      left: (
        <TouchableView
          style={{ height: 44, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
          onPress={() => goBack()} >
          <Image style={{ width: 22, height: 22 }} source={images.nav_back} />
        </TouchableView>
      ),
    }),
  };

  constructor(props) {
    super(props);
    this.fetch = this.fetch.bind(this);
  }

  componentDidMount() {
    this.fetch('init');
  }

  fetch(action = 'init') {
    const params = this.props.navigation.state.params;
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch(fetch(action, params.key));
    });
  }

  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View key={rowID} style={styles.separator} />
    );
  }

  renderText(matchingString, matches) {
    let pattern = /@[^@^\s]+\s/i;
    let match = matchingString.match(pattern);
    return `${match[0]}`;
  }

  _onPressItem (rowData) {
  }

  _onRefresh() {
    this.fetch('down');
  }

  _onEndReached() {
    const params = this.props.navigation.state.params;
    let { tweets } = this.props.dataStore;
    tweets = tweets[params.key] || {};
    if (Object.keys(tweets.entities).length >= PAGE_SIZE) {
      !tweets.fetching && this.fetch('up');
    }
  }

  _renderRow({user, ...rowData}) {
    let { PageData } = this.props.dataStore;
    const userid = PageData.userUniqueid;
    let parse = [
      {type: 'url', style: {color: 'blue'}, onPress: url=>alert('这是一个url: ' + url)},
      {
        pattern: /@[^@^\s]+\s/i, style: {color: '#00A1F8'}, onPress: msg => alert(msg), renderText: this.renderText
      },
    ];
    let mDate = moment(rowData.date);
    let diff = moment().diff(mDate, 'days');
    let format = moment().year() !== mDate.year() ? 'YYYY-MM-DD HH:mm' : 'MM-DD HH:mm';
    let time = diff > 7 ? mDate.format(format) : mDate.fromNow();

    let isMine = user.id === userid;

    let avatarSource = user.sex === '1' ? images.avatar_girl : images.avatar_boy;
    if (user.header && user.header.indexOf('http') !== -1) {
      avatarSource = { uri: user.header};
    }

    const subtitle = [user.country, user.department];

    return (
      <TweetView
        style={styles.tweet}
        id={rowData.id}
        type={rowData.type}
        avatarSource={avatarSource}
        username={user.name}
        subtitle={subtitle.join(' | ')}
        parse={parse}
        textLines={4}
        showRevokeButton={isMine}
        showLikeButton
        showCommentButton
        like={rowData.refs.support || []}
        comment={rowData.refs.comment || []}
        images={rowData.content.images}
        time={time}
        content={rowData.content}
        onPress={this._onPressItem.bind(this, rowData)}
        dispatch={this.props.dispatch}
        tweet={{user, ...rowData}}
      />
    );
  }

  render() {
    const params = this.props.navigation.state.params;
    let { tweets } = this.props.dataStore;
    tweets = tweets[params.key] || {};
    let items = tweets.entities ? Object.values(tweets.entities) : [];
    return (
      <View style={{flexGrow: 1}}>
        <ListView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          data={items}
          initialListSize={1}
          pageSize={5}
          refreshing={tweets.fetching}
          onRefresh={this._onRefresh.bind(this)}
          alwaysBounceVertical={false}
          onEndReachedThreshold={60}
          onEndReached={this._onEndReached.bind(this)}
          enableEmptySections={true}
          renderRow={this._renderRow.bind(this)}
          renderSeparator={this._renderSeparator}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexBasis: 1,
    backgroundColor: '#f2f2f2'
  },
  navBarBtn: {
    height: 44,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentContainer: {
    backgroundColor: '#fff',
  },
  tweet: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EAEAEA'
  },
  separator: {
    height: 9,
    backgroundColor: '#f2f2f2'
  },
  footer: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default NoticeList;
