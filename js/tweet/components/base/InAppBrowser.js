/**
 * Created by Jeepeng on 2017/3/9.
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  WebView,
  Platform,
  ProgressViewIOS,
} from 'react-native';

class InAppBrowser extends Component {
  constructor() {
    super();
    this.state = {
      progress: 0,
      hideProgress: false,
      web: {},
    };
    this._renderLoading = this._renderLoading.bind(this);
    this._onLoadEnd = this._onLoadEnd.bind(this);
    this._onLoadStart = this._onLoadStart.bind(this);
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
  }

  updateProgress() {
    const progress = this.state.progress + 0.01;
    if (progress >= 0.75) {
      this._slowProgress();
      return;
    }
    this.setState({ progress });
    requestAnimationFrame(() => this.updateProgress());
  }

  _slowProgress() {
    const progress = this.state.progress + 0.005;
    if (progress >= 0.998) {
      return;
    }
    this.setState({ progress });
    setTimeout(() => this._slowProgress(), 250);
  }

  _onLoadStart() {
    this.updateProgress();
  }

  _onLoadEnd(event) {
    setTimeout(() => this.setState({ progress: 1 }), 0);
    setTimeout(() => this.setState({ hideProgress: true }), 250);
  }

  _renderLoading() {
    return null;
  }

  _renderError(errorDomain, errorCode, errorDesc) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTextTitle}>
          Error loading page
        </Text>
        <Text style={styles.errorText}>
          {`Domain: ${errorDomain}`}
        </Text>
        <Text style={styles.errorText}>
          {`Error Code: ${errorCode}`}
        </Text>
        <Text style={styles.errorText}>
          {`Description: ${errorDesc}`}
        </Text>
      </View>
    );
  }

  render() {
    const source = { uri: 'https://blog.jeepeng.com' };
    return (
      <View style={styles.container}>
        <View style={[styles.navbar]}>
          <View style={styles.navBarLeft} />
          <Text style={{}}>{'请登录'}</Text>
          <View style={styles.navBarRight} />
        </View>
        {
          this.state.hideProgress ? null :
          <View style={styles.progressView}>
            <ProgressViewIOS
              style={{ height: 2 }}
              progressTintColor="#04b00f"
              trackTintColor="transparent"
              progress={this.state.progress}
            />
          </View>
        }
        <WebView
          style={styles.webView}
          source={source}
          scalesPageToFit
          startInLoadingState
          domStorageEnabled
          javaScriptEnabled
          onLoadEnd={this._onLoadEnd}
          onLoadStart={this._onLoadStart}
          renderLoading={this._renderLoading}
          renderError={this._renderError}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  navbar: {
    ...Platform.select({
      ios: {
        paddingTop: 20,
        height: 64,
      },
      android: {
        height: 44,
      },
    }),
    backgroundColor: '#5f4ab3',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navBarLeft: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  navBarBtn: {
    height: 44,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBarRight: {
    flex: 1,
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
  },
  webView: {
    flex: 1,
  },
  errorContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 2,
  },
  errorTextTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 10,
  },
  progressView: {
    zIndex: 999,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        paddingTop: 64,
      },
      android: {
        height: 44,
      },
    }),
  },
});

export default InAppBrowser;
