/**
 * Created by Jeepeng on 2017/2/20.
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

class MoreText extends Component {

  constructor() {
    super();
    this.state = {
      afterGetHeight: false,
      collapse: true,
      shouldShowMore: false,
    };

    this._toggleCollapse = this._toggleCollapse.bind(this);
    this._onLayout = this._onLayout.bind(this);
  }

  static defaultProps = {
    numberOfLines: 4,
  };

  _toggleCollapse() {
    this.setState({
      collapse: !this.state.collapse,
    });
  }

  _onLayout(event) {
    const { x, y, width, height } = event.nativeEvent.layout;
    if (height === 0) {
      return false;
    }
    if (this.height > height) {
      this.setState({
        shouldShowMore: true,
      });
    }
    this.height = height;
    this.setState({
      afterGetHeight: true,
    });
  }

  componentWillReceiveProps() {
    // TODO 优化性能
    this.height = 0;
    this.setState({
      shouldShowMore: false,
      afterGetHeight: false,
    });
  }

  render() {
    const { numberOfLines, children, ...props } = this.props;
    const { afterGetHeight, collapse, shouldShowMore } = this.state;
    return (
      <View>
        <Text onLayout={this._onLayout} numberOfLines={afterGetHeight && collapse ? numberOfLines : 0} {...props}>
          { children }
        </Text>
        { shouldShowMore ?
          <Text style={{ marginTop: 8, color: '#006ba1' }} onPress={this._toggleCollapse}>
            {this.state.collapse ? '查看全部' : '收起'}
          </Text> : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({

});

export default MoreText;
