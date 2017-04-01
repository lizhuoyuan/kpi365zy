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

import MoreText from '../../components/base/MoreText';

export default function ({content, ...props}) {
  return (
    <View style={styles.contentContainer}>
      <MoreText style={styles.content} numberOfLines={props.textLines}>{props.text}</MoreText>
      { (content.images || []).length > 0 ?
        <GridView
          style={styles.imageGird}
          cellsPerRow={3}
          data={content.images}
          renderCell={(url, index) => <Image key={index} style={styles.image} source={{uri: url}} />}
        /> : null
      }
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
  imageGird: {
    marginTop: 12,
    flexDirection: 'row',
  },
  image: {
    height: 180,
    width: 180 * 0.618,
    backgroundColor: '#efefef'
  },
});
