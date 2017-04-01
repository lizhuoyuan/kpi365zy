/**
 * Created by Jeepeng on 2016/10/5.
 */


import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

class Input extends Component {
  render() {
    const { icon, iconStyle, style, inputStyle, ...inputProps } = this.props;
    return (
      <View style={[styles.container, style]}>
        {icon ? <Icon name={icon} style={[styles.icon, iconStyle]} /> : null}
        <TextInput
          style={[styles.input, inputStyle]}
          underlineColorAndroid="transparent"
          {...inputProps}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    color: '#666',
    fontSize: 20,
    paddingHorizontal: 8,
  },
  input: {
    flexGrow: 1,
  },
});

export default Input;
