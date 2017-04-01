/**
 * Created by Jeepeng on 2017/3/3.
 */

import React from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableHighlight,
} from 'react-native';

const Touchable = ({ onPress, children, ...props }) => {
  const child = React.Children.only(children);
  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback onPress={onPress} {...props}>
        {child}
      </TouchableNativeFeedback>
    );
  }
  return (
    <TouchableHighlight onPress={onPress} underlayColor="#ddd" {...props}>
      {child}
    </TouchableHighlight>
  );
};

export default Touchable;
