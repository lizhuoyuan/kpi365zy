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
  KeyboardAvoidingView,
} from 'react-native';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Actions } from 'react-native-router-flux';

import { ListView, TouchableView } from '../base';
import images from '../../config/images';
import TweetView from '../../lib/TweetView';
import CommentEditor from '../../lib/CommentEditor';
import { fetch, createLike, revokeLike, createComment, revokeTweet } from '../../actions/actionCreators';

moment.locale('zh-cn');

const PAGE_SIZE = 20;

class TweetList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      comment: '',
      pressedTweet: {},
      showCommentEditor: false
    };
  }

  static defaultProps = {
    category: 'world',
    tweets: {
      index: {},
      entities: {}
    }
  };

  fetch(action = 'init') {
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch(fetch(action, this.props.dataIndex));
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
    Actions.tweetDetails({
      id: rowData.id,
      userid: this.props.userid,
      dataIndex: this.props.dataIndex
    });
  }

  _onRefresh() {
    this.fetch('down');
  }

  _onEndReached() {
    let { tweets } = this.props;
    if (Object.keys(tweets.entities).length >= PAGE_SIZE) {
      !tweets.fetching && this.fetch('up');
    }
  }

  _onPressLike(like, tweet, isLiked = true) {
    if (isLiked) {
      this.props.dispatch(revokeLike(like.id, tweet.id, this.props.dataIndex));
    } else {
      this.props.dispatch(createLike(tweet, this.props.dataIndex));
    }
  }

  _onPressCommentButton(tweet) {
    this.setState({
      showCommentEditor: true,
      pressedTweet: tweet
    });
  }

  _hideCommentEditor() {
    this.setState({
      showCommentEditor: false
    });
  }

  _sendComment() {
    const comment = this.state.comment;
    const tweet = this.state.pressedTweet;
    if (!comment) {
      return;
    }
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch(createComment(comment, tweet.id, tweet.id, this.props.dataIndex));
    });
    this.setState({
      showCommentEditor: false,
      comment: ''
    });
  }

  _onDelete(tweetid) {
    // TODO 非自己动态不能删除
    Alert.alert(
      '警告',
      '确定要删除吗？',
      [
        {text: '取消', onPress: () => {}},
        {text: '确定', onPress: () => this.props.dispatch(revokeTweet(tweetid, this.props.dataIndex))},
      ]
    );
  }

  _renderRow({user, ...rowData}) {
    const { userid } = this.props;
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

    let likes = rowData.refs.support || [];
    let myLike = likes.filter(like => like.user.id === userid);
    let isLiked = myLike.length > 0;

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
        isLiked={isLiked}
        onPressLike={this._onPressLike.bind(this, myLike[0] || {}, {user, ...rowData}, isLiked)}
        onPressComment={this._onPressCommentButton.bind(this, rowData)}
        onDelete={this._onDelete.bind(this, rowData.id)}
        comment={rowData.refs.comment || []}
        images={rowData.content.images}
        time={time}
        content={rowData.content}
        onPress={this._onPressItem.bind(this, rowData)}
        dispatch={this.props.dispatch}
        tweet={{user, ...rowData}}
        dataIndex={this.props.dataIndex}
      />
    );
  }

  _onChangeComment(text) {
    this.setState({
      comment: text
    });
  }

  render() {
    let { tweets } = this.props;
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
        <Modal
          animationType={'fade'}
          transparent={true}
          onRequestClose={this._hideCommentEditor.bind(this)}
          visible={this.state.showCommentEditor}>
          <TouchableOpacity
            onPress={this._hideCommentEditor.bind(this)}
            style={{flexGrow: 1,justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.08)'}}
          >
            <KeyboardAvoidingView
              style={styles.editor}
              behavior={Platform.select({android: 'height', ios: 'padding'})}>
              <CommentEditor
                value={this.state.comment}
                textInputProps={{autoFocus: true}}
                onChangeText={this._onChangeComment.bind(this)}
              />
              <TouchableView onPress={this._sendComment.bind(this)} style={styles.btnSend}>
                <Image style={styles.send} source={images.moments_send} />
              </TouchableView>
            </KeyboardAvoidingView>
          </TouchableOpacity>
        </Modal>
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
  editor: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#dfdfdf',
  },
  btnSend: {
    flexGrow: 1,
    paddingBottom: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  send: {
    height: 21,
    width: 21,
  }
});

export default TweetList;
