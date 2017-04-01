/**
 * 按钮
 * Created by Jeepeng on 16/7/19.
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  View,
  Text,
} from 'react-native';
import TouchableView from './TouchableView';

class Button extends Component {

  static propTypes = {
    style: React.PropTypes.any,
    onPress: React.PropTypes.func,
  };

  static defaultProps = {
    style: {},
    onPress: () => {
    },
  };

  render() {
    const { title, style, titleStyle, disabled, onPress, ...props } = this.props;
    return (
      <TouchableView
        style={[styles.button, style]}
        onPress={disabled ? null : onPress}
        {...props}
      >
        <Text style={titleStyle}>{ title }</Text>
      </TouchableView>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#00A0E8',
    borderRadius: 4,
  },
});

export default Button;
