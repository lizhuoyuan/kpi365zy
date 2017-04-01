/**
 * Created by Jeepeng on 2016/11/20.
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Platform,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
} from 'react-native';

class Bubble extends Component {
  render() {
    const { style, contentStyle } = this.props;
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        style={{ flexGrow: 1 }}
      >
        <View style={[styles.container, style]}>
          <View style={{ width: 16, height: 16, marginLeft: 0, marginTop: 10, zIndex: 9999 }}>
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: -1,
                width: 0,
                height: 0,
                borderLeftWidth: 8,
                borderRightWidth: 8,
                borderTopWidth: 8,
                borderBottomWidth: 8,
                borderColor: 'transparent',
                zIndex: 1,
                borderRightColor: '#fff' }}
            />
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 0,
                height: 0,
                borderLeftWidth: 8,
                borderRightWidth: 8,
                borderTopWidth: 8,
                borderBottomWidth: 8,
                borderColor: 'transparent',
                zIndex: 0,
                borderRightColor: '#333' }}
            />
          </View>
          <View style={[styles.content, contentStyle]}>
            {this.props.children}
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: 'row',
    margin: 0,
  },
  content: {
    flexGrow: 1,
    minHeight: 40,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#333',
  },
  left: {

  },
});

export default Bubble;
