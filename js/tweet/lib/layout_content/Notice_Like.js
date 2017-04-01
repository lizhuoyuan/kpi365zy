/**
 * Created by Jeepeng on 2017/3/17.
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  StyleSheet,
  Image,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

import MoreText from '../../components/base/MoreText';

export default function ({content, tweet, ...props}) {
  const _parent = content._parent || {};
  if (!_parent.content) return null;

  const onPressItem = () => {
    Actions.tweetDetails({
      id: tweet.parent,
      userid: props.userid,
      dataIndex: props.dataIndex
    });
  };

  return (
    <View style={styles.contentContainer}>
      <MoreText style={styles.content} numberOfLines={props.textLines}>赞了这条动态</MoreText>
      <TouchableOpacity
        onPress={onPressItem}
        style={styles.quoteContainer}>
        <Image source={{uri: _parent.user.header}} style={{width: 74, height: 74}}/>
        <View style={styles.quoteRight}>
          <Text style={styles.title}>@{_parent.user.name}</Text>
          <Text style={styles.desc} numberOfLines={2}>{_parent.content.text}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    margin: 10,
    marginLeft: 15
  },
  content: {
    textAlign: 'left',
    color: '#002546',
    fontSize: 15
  },
  // quote
  quoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 3,
    marginTop: 10,
    height: 74,
    backgroundColor: '#f4f7f9',
    overflow: 'hidden',
  },
  quoteRight: {
    flex: 1,
    marginVertical: 3,
    marginHorizontal: 8,
  },
  title: {
    fontSize: 16,
    color: '#1e2e3c'
  },
  desc: {
    marginTop: 3,
    fontSize: 14,
    color: '#5d6d81'
  },
});
