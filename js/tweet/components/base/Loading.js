/**
 * Created by Jeepeng on 2017/3/3.
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Dimensions,
  DeviceEventEmitter,
  AppRegistry,
  TouchableWithoutFeedback,
} from 'react-native';
//import TopView from 'rn-topview';

class Loading extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
    };
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  componentWillMount() {
    DeviceEventEmitter.addListener('showLoading', this.show);
    DeviceEventEmitter.addListener('hideLoading', this.hide);
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeAllListeners('showLoading');
    DeviceEventEmitter.removeAllListeners('hideLoading');
  }

  show() {
    this.setState({ visible: true });
  }

  hide() {
    this.setState({ visible: false });
  }

  toggle() {
    this.setState({ visible: !this.state.visible });
  }

  render() {
    if (!this.state.visible) {
      return null;
    }
    return (
      <TouchableWithoutFeedback onPress={this.hide}>
        <View style={styles.container}>
          <View style={styles.mask}>
            <ActivityIndicator
              animating
              size="small"
              color="#fff"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width,
    height,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0)',
  },

  mask: {
    width: 42,
    height: 42,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
});

const originRegisterComponent = AppRegistry.registerComponent;
AppRegistry.registerComponent = (appKey, getComponentFunc) => {
  const app = getComponentFunc();
  return originRegisterComponent(appKey, () => React.createClass({
      render () {
        return (
          <View style={{ flexGrow: 1 }}>
            {React.createElement(app, this.props)}
            <Loading />
          </View>
        );
      }
    })
  );
};

export default {
  show() {
    DeviceEventEmitter.emit('showLoading');
  },
  hide() {
    DeviceEventEmitter.emit('hideLoading');
  },
  dismiss() {
    DeviceEventEmitter.emit('hideLoading');
  },
};
