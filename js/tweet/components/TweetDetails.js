/**
 * Created by Jeepeng on 2016/12/20.
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  Image,
  Button,
  ListView,
  Modal,
  TouchableOpacity,
  InteractionManager
} from 'react-native';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';

import TweetView from '../lib/TweetView';
import { NavBar, TouchableView, Dialog } from './base';
import { getTweet, createLike, revokeLike, createComment, revokeComment } from '../actions/actionCreators';

import CommentList from './CommentList';
import LikeList from './LikeList';
import CommentEditor from '../lib/CommentEditor';
import images from '../config/images';

moment.locale('zh-cn');

class TweetDetails extends Component {

  constructor(props) {
    super(props);
    let tweets = props.dataStore.tweets;
    let { entities } = tweets[props.dataIndex];
    let tweet = entities[props.id];
    let refs = tweet && tweet.refs || {};
    let commentCount = (refs.comment || []).length;
    let likeCount = (refs.support || []).length;
    this.state = {
      showCommentMenuDialog: false,  // 按下评论显示的Dialog
      showCommentEditor: false,
      comment: '',
      commentParent: props.id,
      commentPlaceholder: '简单说两句',
      pressedComment: '',   // 被按下的那条评论
      commentMenuDialogFooter: [],
      navigationState: {
        index: 0,
        routes: [
          { key: 'comment', title: `评论 ${commentCount}` },
          { key: 'like', title: `赞 ${likeCount}` },
        ],
      }
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.dispatch(getTweet(this.props.id, this.props.dataIndex, false));
    });
  }

  _renderLeft() {
    return (
      <TouchableView
        style={styles.navBarBtn}
        onPress={Actions.pop}>
        <Image style={{width: 22, height: 22}} source={images.nav_back} />
      </TouchableView>
    );
  }

  _renderTitle() {
    return <Text style={{color: '#fff', fontSize: 16}}>动态正文</Text>;
  }

  renderText(matchingString, matches) {
    let pattern = /@[^@^\s]+\s/i;
    let match = matchingString.match(pattern);
    return `${match[0]}`;
  }

  _onChangeComment(text) {
    this.setState({
      comment: text
    });
  }

  _sendComment() {
    let { dispatch, id } = this.props;
    const comment = this.state.comment;
    if (!comment) {
      return;
    }
    InteractionManager.runAfterInteractions(() => {
      dispatch(createComment(comment, id, this.state.commentParent, this.props.dataIndex));
    });
    this._handleChangeTab(0);
    this.setState({
      showCommentEditor: false,
      comment: ''
    });
  }

  /**
   * 按下底部评论按钮
   * @private
   */
  _onPressCommentButton() {
    let { id } = this.props;
    this.setState({
      showCommentEditor: true,
      commentParent: id,
      commentPlaceholder: '简单说两句'
    });
  }

  /**
   * 按某条评论
   * @private
   */
  _onPressComment(comment) {
    let { id, userid } = this.props;
    let footer = [];
    if (comment.user.id === userid) {
      footer = [
        {text: '删除', textStyle: {color: 'red'}, onPress: () => this._deleteComment(comment)},
      ];
    } else {
      /*footer = [
        {text: '回复', onPress: () => this._onPressReplyButton(comment)},
      ];*/
      this.setState({
        showCommentEditor: true,
        commentParent: comment.id,
        commentPlaceholder: `回复${comment.user.name}：`
      });
      return;
    }
    const content = `${comment.content.text || comment.content.main}`;
    const pressedCommentText = comment.parent === id ? `${comment.user.name}: ${content}` : `${comment.user.name} 回复 ${comment.toUser.name}: ${content}`;
    this.setState({
      showCommentMenuDialog: true,
      commentMenuDialogFooter: footer,
      commentParent: comment.id,
      pressedComment: pressedCommentText,
      commentPlaceholder: `回复${comment.user.name}：`
    });
  }

  _toggleCommentMenuDialog() {
    this.setState({
      showCommentMenuDialog: !this.state.showCommentMenuDialog,
    });
  }

  /**
   * 按下dialog的回复按钮
   * @private
   */
  _onPressReplyButton() {
    this.setState({
      showCommentMenuDialog: false,
      showCommentEditor: true,
    });
  }

  /**
   * 按下dialog的删除按钮
   * @param comment
   * @private
   */
  _deleteComment(comment) {
    this.setState({
      showCommentMenuDialog: false,
    });
    this.props.dispatch(revokeComment(comment.id, this.props.id));
  }

  /**
   * 隐藏评论输入框Dialog
   * @private
   */
  _hideCommentDialog() {
    this.setState({
      showCommentEditor: false,
    });
  }

  _onPressLike(likeid = '') {
    let { dispatch, id, dataIndex } = this.props;
    let tweets = this.props.dataStore.tweets;
    let { entities } = tweets[this.props.dataIndex];
    let tweet = entities[id];
    InteractionManager.runAfterInteractions(() => {
      likeid ? dispatch(revokeLike(likeid, id, dataIndex)) : dispatch(createLike(tweet, dataIndex));
    });
    this._handleChangeTab(1);
  }

  _handleChangeTab(index) {
    let oldNavigationState = this.state.navigationState;
    this.setState({
      navigationState: {
        ...oldNavigationState,
        index
      }
    });
  }

  _renderHeader = (props) => {
    let tweets = this.props.dataStore.tweets;
    let { entities } = tweets[this.props.dataIndex];
    let tweet = entities[this.props.id];
    let refs = tweet && tweet.refs || {};
    let commentCount = (refs.comment || []).length;
    let likeCount = (refs.support || []).length;

    const getLabelText = (scene) => {
      return scene.route.key === 'comment' ? `评论 ${commentCount}` : `赞 ${likeCount}`;
    };
    return (
      <TabBar
        {...props}
        getLabelText={getLabelText}
        tabStyle={styles.tab}
        labelStyle={styles.label}
        indicatorStyle={styles.indicator}
        style={styles.tabbar}
      />
    );
  };

  _renderScene = ({ route }) => {
    let { id, dataIndex } = this.props;
    let tweets = this.props.dataStore.tweets;
    let { entities } = tweets[dataIndex];
    let tweet = entities[id];
    let comments = [...(tweet.refs.comment || [])].reverse();
    let likes = [...(tweet.refs.support || [])].reverse();
    switch (route.key) {
      case 'comment':
        return (
          <CommentList
            contentContainerStyle={{paddingBottom: 35}}
            data={comments}
            onPress={this._onPressComment.bind(this)}
            onLongPress={this._onPressComment.bind(this)}
            tweet={tweet}
          />
        );
      case 'like':
        return (
          <LikeList
            contentContainerStyle={{paddingBottom: 35}}
            data={likes}
            tweet={tweet}
          />
        );
      default:
        return null;
    }
  };

  render() {
    let { id, userid, dataIndex } = this.props;
    let { tweets } = this.props.dataStore;
    let { entities } = tweets[dataIndex];
    let tweet = entities[id];
    let parse = [
      {type: 'url', style: {color: 'blue'}, onPress: url=>alert('这是一个url: ' + url)},
      {
        pattern: /@[^@^\s]+\s/i, style: {color: '#00A1F8'}, onPress: msg => alert(msg), renderText: this.renderText
      },
    ];

    let likes = tweet.refs.support || [];
    let myLike = likes.filter(like => like.user.id === userid);
    let isLiked = myLike.length > 0;
    let likeid = isLiked ? myLike[0].id : undefined;

    let avatarSource = tweet.user.sex === '1' ? images.avatar_girl : images.avatar_boy;
    if (tweet.user.header && tweet.user.header.indexOf('http') !== -1) {
      avatarSource = { uri: tweet.user.header};
    }

    const subtitle = [tweet.user.country, tweet.user.department];

    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#37aaf1"
          barStyle="light-content"
        />
        <NavBar
          style={{backgroundColor: '#37aaf1'}}
          renderLeftComponent={this._renderLeft.bind(this)}
          renderTitle={this._renderTitle}/>
        <TweetView
          style={styles.tweet}
          type={tweet.type}
          avatarSource={avatarSource}
          username={tweet.user.name}
          subtitle={subtitle.join(' | ')}
          parse={parse}
          like={[]}
          comment={[]}
          time={moment(tweet.date).fromNow()}
          content={tweet.content}
          dispatch={this.props.dispatch}
          tweet={tweet}
          showDetails
          dataIndex={this.props.dataIndex}
        />
        <TabViewAnimated
          style={styles.container}
          navigationState={this.state.navigationState}
          renderScene={this._renderScene.bind(this)}
          renderHeader={this._renderHeader.bind(this)}
          onRequestChangeTab={this._handleChangeTab.bind(this)}
        />
        <View style={styles.bottomContainer}>
          <TouchableView rootStyle={{flexGrow: 1,}} style={styles.bottomBtn} onPress={this._onPressCommentButton.bind(this)} >
            <Image style={{width: 18, height: 18}} source={images.moments_comment} />
            <Text style={{fontSize: 14, color: '#39495D'}}> 评论</Text>
          </TouchableView>
          <TouchableView rootStyle={{flexGrow: 1,}} style={styles.bottomBtn} onPress={this._onPressLike.bind(this, likeid)} >
            <Image style={{width: 18, height: 18}} source={isLiked ? images.moments_liked : images.moments_like} />
            <Text style={{fontSize: 14, color: isLiked ? '#00A3F8' : '#39495D'}}> {isLiked ? '取消赞' : '赞'}</Text>
          </TouchableView>
        </View>
        <Dialog
          visible={this.state.showCommentMenuDialog}
          onClose={this._toggleCommentMenuDialog.bind(this)}
          footer={this.state.commentMenuDialogFooter}>
          <View style={{padding: 18, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: '#999', fontSize: 12, textAlign: 'center'}}>{`${this.state.pressedComment}`}</Text>
          </View>
        </Dialog>
        <Modal
          animationType={'fade'}
          transparent={true}
          onRequestClose={this._hideCommentDialog.bind(this)}
          visible={this.state.showCommentEditor}>
          <TouchableOpacity
            onPress={this._hideCommentDialog.bind(this)}
            style={{flexGrow: 1,justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)'}}
          >
            <KeyboardAvoidingView
              style={styles.editor}
              behavior={Platform.select({android: 'height', ios: 'padding'})}>
              <CommentEditor
                value={this.state.comment}
                textInputProps={{autoFocus: true}}
                placeholder={this.state.commentPlaceholder}
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
    backgroundColor: '#fff'
  },
  navBarBtn: {
    height: 44,
    paddingLeft: 10,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tweet: {
  },

  indicator: {
    backgroundColor: '#00A3F8',
  },
  label: {
    color: '#000',
    fontWeight: '400',
  },
  tabbar: {
    height: 35,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#dfdfdf',
    backgroundColor: '#fff',
  },
  tab: {
    flexGrow: 1,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 35,
    backgroundColor: 'rgba(255,255,255,0.85)',
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#dfdfdf',
  },
  bottomBtn: {
    flexGrow: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#dfdfdf',
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

export default TweetDetails;
