/**
 * Created by Jeepeng on 2017/3/3.
 */

import React from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableHighlight,
} from 'react-native';

const Touchable = ({ onPress, children }) => {
  const child = React.Children.only(children);
  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback onPress={onPress}>
        {child}
      </TouchableNativeFeedback>
    );
  }
  return (
    <TouchableHighlight onPress={onPress} underlayColor="#ddd">
      {child}
    </TouchableHighlight>
  );
};

export default Touchable;
