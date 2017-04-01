/**
 * Created by Jeepeng on 2016/10/5.
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Text,
} from 'react-native';

import TouchableView from '../base/TouchableView';

class NavBar extends Component {

  static propTypes = {
    renderLeftComponent: React.PropTypes.func,
    renderTitle: React.PropTypes.func,
    renderRightComponent: React.PropTypes.func,
    leftTitle: React.PropTypes.string,
    onLeft: React.PropTypes.func,
  };

  static defaultProps = {
    renderLeftComponent: () => null,
    onLeft: () => null,
    renderTitle: () => null,
    renderRightComponent: () => null,
  };

  render() {
    const { style, renderLeftComponent, leftTitle, onLeft, renderTitle, title, titleStyle } = this.props;

    return (
      <View style={[styles.container, style]}>
        <View style={styles.navBarLeft}>
          {renderLeftComponent() || (
            leftTitle ?
              onLeft ?
                <TouchableView underlayColor="#f5f5f5" style={styles.navBarBtn} onPress={onLeft}><Text style={titleStyle}>{leftTitle}</Text></TouchableView>
                : <Text style={titleStyle}>{leftTitle}</Text>
              : null
          )}
        </View>
        {renderTitle() || <Text style={titleStyle}>{title}</Text>}
        <View style={styles.navBarRight}>
          {this.props.renderRightComponent()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        paddingTop: 20,
        height: 64,
      },
      android: {
        height: 44,
      },
    }),
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#999',
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
});

export default NavBar;
