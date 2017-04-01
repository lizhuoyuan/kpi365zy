/**
 * Created by Jeepeng on 2016/11/14.
 */

import React from 'react';
import {
  Platform,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';

const Wrap = TouchableComponent => ({ style, rootStyle, children, ...props }) =>
    // TODO ios TouchableHighlight\TouchableOpacity style 有问题
     (
       <TouchableComponent style={rootStyle} {...props}>
         <View style={style}>
           {children}
         </View>
       </TouchableComponent>
    );

export default Platform.OS === 'android' ? Wrap(TouchableNativeFeedback) : Wrap(TouchableOpacity);
