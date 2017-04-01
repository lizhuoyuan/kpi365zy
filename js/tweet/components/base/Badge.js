/**
 * Created by Jeepeng on 2016/11/18.
 */

import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
} from 'react-native';

class Badge extends Component {
  static propTypes = {
    badge: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    backgroundColor: PropTypes.string,
    height: PropTypes.number,
    color: PropTypes.string,
  };
  static defaultProps = {
    backgroundColor: 'red',
    height: 18,
    color: 'white',
  };
  render() {
    const { backgroundColor, height, color, badge, ...props } = this.props;
    const style = {
      backgroundColor,
      minWidth: height,
      height,
      borderRadius: height / 2,
      alignItems: 'center',
      justifyContent: 'center',
    };
    const fontStyle = {
      fontSize: 11,
      fontWeight: 'bold',
      color,
      backgroundColor: 'transparent',
      padding: 3,
    };
    return (
      <View style={[style, this.props.style]}>
        <Text style={fontStyle}>{badge}</Text>
      </View>
    );
  }
}

export default Badge;
