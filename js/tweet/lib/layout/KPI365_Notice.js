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
import Notice_Comment from '../layout_content/Notice_Comment';
import Notice_Like from '../layout_content/Notice_Like';

const layoutContents = new Map();
layoutContents.set('notice', DefaultContent);
layoutContents.set('tweestar_support', Notice_Like);
layoutContents.set('tweestar_comment', Notice_Comment);
layoutContents.set('target_focus', TargetContent);

export default (props) => {
  const type = props.type;
  const Content = layoutContents.get(type) || DefaultContent;

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
        <Text style={styles.time}>{props.time}</Text>
      </View>
      <Content
        text={props.text}
        textLines={props.textLines}
        content={props.content}
        dispatch={props.dispatch}
        tweet={props.tweet}
        dataIndex={type}
      />
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
    position: 'absolute',
    top: 15,
    right: 10,
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
  moreText: {
    marginTop: 5,
    fontSize: 13,
    color: '#3D76A6',
  }
});
