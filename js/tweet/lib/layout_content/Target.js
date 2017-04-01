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

import { targetFocus, targetRecallFocus } from '../../actions/actionCreators';

const Target = ({ target, isFocused, onPressFocus }) => {
  return (
    <View activeOpacity={0.6} style={styles.item}>
      <Text style={styles.itemText} numberOfLines={1}>{target.text}</Text>
      <TouchableOpacity style={styles.btnFocus} onPress={onPressFocus}>
        <Image source={isFocused ? require('./target-focused.png') : require('./target-focus.png')} style={styles.imgFocus} />
      </TouchableOpacity>
    </View>
  );
};

export default function ({content, tweet, showDetails, dataIndex, dispatch, ...props}) {
  // 格式转换，保存已关注target的id
  // [{ key1: value1 }, { key2: value2 }] => {key1: value1, key2: value2}
  let focusedId = {};
  let focusedIds = []; // [value1 , value2]
  const focuses = tweet.refs.target_focus || [];
  for (let item of focuses) {
    focusedId = { ...focusedId, ...item };
    focusedIds = [
      ...focusedIds,
      ...Object.values(item),
    ];
  }

  const isFocusedFn = (targetid) => {
    return focusedIds.indexOf(targetid) !== -1;
  };

  const toggleFocus = (item, isFocused) => {
    const focusKey = Object.keys(focusedId).find(key => focusedId[key] === item.uniqueid);
    if (isFocused) {
      dispatch(targetRecallFocus(tweet.id, focusKey, item.uniqueid, tweet.user.id, dataIndex));
    } else {
      dispatch(targetFocus(tweet.id, item.uniqueid, tweet.user.id, dataIndex));
    }
  };

  // 详情页才全部显示
  let targets = content.targets || [];
  if (!showDetails && targets.length > 5 ) {
    targets = targets.slice(0, 5);
  }

  return (
    <View style={styles.contentContainer}>
      { targets.map(item => {
          const isFocused = isFocusedFn(item.uniqueid);
          return <Target isFocused={isFocused} onPressFocus={() => toggleFocus(item, isFocused)} key={item.uniqueid} target={item} />
        })
      }
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    margin: 8,
    marginLeft: 15
  },
  content: {
    textAlign: 'left',
    color: '#002546',
    fontSize: 15
  },
  item: {
    height: 44,
    borderRadius: 5,
    marginVertical: 3,
    paddingLeft: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f4f7f9',
  },
  itemText: {
    fontSize: 14,
    color: '#2b3d54'
  },
  btnFocus: {
    padding: 13,
  },
  imgFocus: {
    width: 18,
    height: 18,
  },
});
