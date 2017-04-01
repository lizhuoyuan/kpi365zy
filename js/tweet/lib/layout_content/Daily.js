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
import moment from 'moment';
import { Actions } from 'react-native-router-flux';

import MoreText from '../../components/base/MoreText';

export default function ({content, showDetails, ...props}) {
  const date = moment(content.date).format('M月D日 ddd');
  return (
    <View style={styles.contentContainer}>
      <MoreText style={styles.content} numberOfLines={props.textLines}>{props.text}</MoreText>
      <View
        style={styles.quoteContainer}>
        <View style={styles.quoteLeft}>
          <Image style={styles.image} source={require('./daily-stars.png')} resizeMode="stretch" />
          <Text style={styles.starCount}>{content.totalStar}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <View style={styles.quoteRight}>
          <Text style={styles.desc} numberOfLines={showDetails ? 0 : 3}>{content.questionOrSummary}</Text>
        </View>
      </View>
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
    minHeight: 74,
    backgroundColor: '#f4f7f9',
    overflow: 'hidden',
  },
  quoteLeft: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    width: 74,
    marginTop: 12,
  },
  image: {
    width: 57,
    height: 33,
    marginBottom: 6,
  },
  starCount: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    position: 'absolute',
    marginTop: 12,
    backgroundColor: 'transparent',
  },
  date: {
    color: '#838f9f',
    fontSize: 9,
  },
  quoteRight: {
    flex: 1,
    overflow: 'hidden',
  },
  desc: {
    margin: 10,
    lineHeight: 18,
    fontSize: 13,
    color: '#5e6d80',
  },
});
