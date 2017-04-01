/**
 * Created by Jeepeng on 2016/12/8.
 */

import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  StyleSheet,
  Image,
} from 'react-native';

import images from '../../config/images';

import DefaultContent from '../layout_content/Default';
import QuoteContent from '../layout_content/Quote';
import DailyContent from '../layout_content/Daily';
import TargetContent from '../layout_content/Target';

const layoutContents = new Map();
layoutContents.set('tweet', DefaultContent);
layoutContents.set('daily', DailyContent);
layoutContents.set('target', TargetContent);

export default (props) => {
  const hasLike = props.like.length > 0;
  const commentCount = props.comment.length;
  const hasComment = commentCount > 0;
  let latestComment = [];
  if (commentCount >= 3) {
    latestComment = props.comment.slice(-3).reverse();
  } else {
    latestComment = props.comment.slice(-commentCount).reverse();
  }

  const likeImage = props.isLiked ? images.moments_liked : images.moments_like;

  const type = props.type;
  const Content = layoutContents.get(type) || DefaultContent;
  // 显示目标的'查看全部'
  let targets = props.content.targets || [];
  const showMoreTarget = !props.showDetails && targets.length > 5;

  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.topContainer}>
        <View style={styles.avatarContainer}>
          <Image source={props.avatarSource} style={styles.avatar}/>
        </View>
        <View style={styles.topRightContainer}>
          <Text style={styles.name}>{props.username}</Text>
          <Text style={styles.title}>{props.subtitle}</Text>
        </View>
      </View>
      <Content
        text={props.text}
        textLines={props.textLines}
        content={props.content}
        dispatch={props.dispatch}
        tweet={props.tweet}
        showDetails={props.showDetails}
        dataIndex={props.dataIndex}
      />
      <View style={styles.bottomContainer}>
        <View style={styles.bottomLeftContainer}>
          <Text style={styles.time}>{props.time}</Text>
          { showMoreTarget ? <Text style={styles.revoke}>查看全部</Text> : null}
          {props.showRevokeButton ? <Text onPress={props.onDelete} style={styles.revoke}>{type === 'daily' ? '撤回' : '删除'}</Text> : null}
        </View>
        <View style={styles.bottomRightContainer}>
          { props.showLikeButton ?
            <TouchableOpacity onPress={props.onPressLike} style={styles.bottomTool}>
              <Image style={{width: 18, height: 18}} source={likeImage} />
            </TouchableOpacity> : null
          }
          { props.showCommentButton ?
            <TouchableOpacity onPress={props.onPressComment} style={styles.bottomTool}>
              <Image style={{width: 18, height: 18}} source={images.moments_comment} />
            </TouchableOpacity> : null
          }
        </View>
      </View>
      {
        hasLike || hasComment ?
          <View style={styles.commentContainer}>
            { hasLike ?
              <View style={styles.commentLikeContainer}>
                <Image style={{width: 18, height: 18}} source={likeImage} />
                <Text style={styles.likeText}> 共{props.like.length}人赞</Text>
              </View> : null
            }
            { hasComment ?
                <View style={styles.latestCommentContainer}>
                  {
                    latestComment.map((item) => {
                      if (item.parent === props.id) {
                        return <Text key={item.id} style={styles.commentText}><Text style={styles.commentUserText}>{item.user.name}</Text> : {item.content.text}</Text>;
                      }
                      return <Text key={item.id} style={styles.commentText}><Text style={styles.commentUserText}>{item.user.name}</Text> 回复 <Text style={styles.commentUserText}>{item.toUser.name}</Text>: {item.content.text}</Text>;
                    })
                  }
                  { commentCount > 3 ? <Text style={styles.moreText}>查看全部 ></Text> : null }
                </View> : null
            }
          </View> : null
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  topContainer: {
    flexDirection: 'row',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  avatar: {
    margin: 10,
    backgroundColor: '#ddd',
    width: 40,
    height: 40,
    borderRadius: 20,
    overlayColor: '#fff'
  },
  topRightContainer: {
    marginTop: 15,
  },

  contentContainer: {
    margin: 10,
    marginLeft: 15
  },
  content: {
    textAlign: 'left',
    color: '#002546',
    fontSize: 15
  },

  bottomContainer: {
    flexDirection: 'row',
    margin: 10,
    marginLeft: 15
  },
  bottomLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomRightContainer: {
    flexGrow: 1,
    flexBasis: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  time: {
    fontSize: 10,
    color: '#8999a5',
  },
  revoke: {
    marginLeft: 10,
    fontSize: 12,
    color: '#006ba1',
  },
  name: {
    color: '#000031',
    fontSize: 15
  },
  title: {
    color: '#929CA9',
    fontSize: 10,
    marginTop: 3
  },

  bottomTool: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  bottomToolText: {
    color: '#6D6D78',
    fontWeight: '500',
    alignItems: 'center'
  },

  commentContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eaeaea',
    marginHorizontal: 10,
    marginBottom: 15,
  },
  commentLikeContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center'
  },
  likeText: {
    fontSize: 12,
    color: '#8999a5',
  },
  latestCommentContainer: {
    marginTop: 10,
  },
  commentUserText: {
    fontSize: 12,
    color: '#00A1F8',
  },
  commentText: {
    marginTop: 2,
    fontSize: 12,
    color: '#8999a5',
  },
  moreText: {
    marginTop: 5,
    fontSize: 13,
    color: '#3D76A6',
  }
});
