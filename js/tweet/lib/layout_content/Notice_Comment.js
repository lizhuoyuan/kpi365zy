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

export default function ({content, ...props}) {
  return (
    <View style={styles.contentContainer}>
      <MoreText style={styles.content} numberOfLines={props.textLines}>{props.text}</MoreText>
      <TouchableOpacity
        onPress={Actions.InAppBrowser}
        style={styles.quoteContainer}>
        <Image source={props.avatarSource} style={{width: 74, height: 74}}/>
        <View style={styles.quoteRight}>
          <Text style={styles.title}>{content.parent.text}</Text>
          <Text style={styles.desc}>{content.parent.text}</Text>
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
    marginVertical: 3,
    marginHorizontal: 8,
  },
  title: {
    fontSize: 17,
    color: '#012345'
  },
  desc: {
    fontSize: 15,
    color: '#555'
  },
});
