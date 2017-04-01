/**
 * Created by Jeepeng on 2017/2/8.
 */

import React, { Component, PropTypes  } from 'react';
import {
  StyleSheet,
  Platform,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated
} from 'react-native';
import TouchableView from './base/TouchableView';

const DefaultTabBar = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
    backgroundColor: React.PropTypes.string,
    activeTextColor: React.PropTypes.string,
    inactiveTextColor: React.PropTypes.string,
    textStyle: Text.propTypes.style,
    tabStyle: View.propTypes.style,
    renderTab: React.PropTypes.func,
    underlineStyle: View.propTypes.style,
  },

  getDefaultProps() {
    return {
      activeTextColor: 'white',
      inactiveTextColor: '#B5D4F6',
      backgroundColor: null,
      renderLeftComponent: () => null,
      renderRightComponent: () => null
    };
  },

  renderTabOption(name, page) {
  },

  renderTab(name, page, isTabActive, onPressHandler) {
    const { activeTextColor, inactiveTextColor, textStyle, } = this.props;
    const textColor = isTabActive ? activeTextColor : inactiveTextColor;
    const textSize = isTabActive ? 17 : 16;
    const fontWeight = isTabActive ? 'normal' : 'normal';

    return <TouchableOpacity
      style={{flexGrow: 1, }}
      key={name}
      accessible={true}
      accessibilityLabel={name}
      accessibilityTraits="button"
      onPress={() => onPressHandler(page)} >
      <View style={[styles.tab, this.props.tabStyle, ]}>
        <Text style={[{color: textColor, fontWeight, fontSize: textSize }, textStyle, ]}>
          {name}
        </Text>
      </View>
    </TouchableOpacity>;
  },

  render() {
    let { renderLeftComponent, renderRightComponent } = this.props;
    return (
      <View style={[styles.tabs, {backgroundColor: this.props.backgroundColor, }, this.props.style, ]}>
        { renderLeftComponent() }
        {this.props.tabs.map((name, page) => {
          const isTabActive = this.props.activeTab === page;
          const renderTab = this.props.renderTab || this.renderTab;
          return renderTab(name, page, isTabActive, this.props.goToPage);
        })}
        {renderRightComponent() }
      </View>
    );
  },
});

const styles = StyleSheet.create({
  tab: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    ...Platform.select({
      ios: {
        paddingTop: 20,
        height: 64,
      },
      android: {
        height: 44,
      },
    }),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc',
  },
});

export default DefaultTabBar;
