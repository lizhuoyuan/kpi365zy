/**
 * Created by Jeepeng on 16/8/9.
 */

import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

class TabBar extends Component {

  constructor(props) {
    super(props);

    this.tabIcons = [];
  }

  static propTypes = {
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array,
  };

  componentDidMount() {
    this._listener = this.props.scrollValue.addListener(this.setAnimationValue);
  }

  setAnimationValue({ value }) {
    (this.tabIcons || []).forEach((icon, i) => {
      const progress = (value - i >= 0 && value - i <= 1) ? value - i : 1;
      icon.setNativeProps({
        style: {
          color: this.iconColor(progress),
        },
      });
    });
  }

  // color between rgb(59,89,152) and rgb(204,204,204)
  // 233,30,99
  iconColor(progress) {
    /* const red = 59 + (204 - 59) * progress;
     const green = 89 + (204 - 89) * progress;
     const blue = 152 + (204 - 152) * progress;*/
    const red = 233;
    const green = 30 + (233 - 30) * progress;
    const blue = 99 + (233 - 99) * progress;
    return `rgb(${red}, ${green}, ${blue})`;
  }

  render() {
    return (
      <View style={[styles.tabs, this.props.style]}>
        {this.props.tabs.map((tab, i) => {
          const color = this.props.activeTab === i ? 'rgb(233,30,99)' : 'rgb(153,153,153)';
          return (
            <TouchableOpacity
              key={tab.icon}
              activeOpacity={0.5}
              onPress={() => this.props.goToPage(i)}
              style={styles.tab}
            >
              <Icon
                name={tab.icon}
                size={28}
                color={color}
                ref={(icon) => {
                  this.tabIcons[i] = icon;
                }}
              />
              <Text style={[{ color }, styles.text]}>{tab.text}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tab: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderBottomColor: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopColor: '#ccc',
  },
  text: {
    fontSize: 14,
  },
});

export default TabBar;
