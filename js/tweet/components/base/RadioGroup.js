/**
 * RadioGroup控件
 * Created by Jeepeng on 16/7/15.
 */

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

class RadioGroup extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    eventHandler: React.PropTypes.func,
  };

  static defaultProps = {
    eventHandler: () => {},
  };

    /**
     * 点击radio
     * @param value
     * @private
     */
  _onCheck(value) {
        // 如果value改变了就发起action重新渲染
    const isChange = this.props.value !== value;
    isChange && this.props.eventHandler(this.props.id, ActionTypes.REFRESH_UI_BY_LOCAL, { value });
  }

    /**
     * 渲染单个radio
     * @param title
     * @param value
     * @param isChecked 是否选中
     * @returns {XML}
     * @private
     */
  _renderRadio(title, value, isChecked = false) {
    const name = isChecked ? 'radio-button-checked' : 'radio-button-unchecked';
    return (
      <TouchableOpacity
        key={value}
        style={[styles.item, this._extraStyle.item]}
        activeOpacity={1}
        onPress={this._onCheck.bind(this, value)}
      >
        <Icon name={name} size={20} color={Theme.colorPrimary} style={this._extraStyle.icon} />
        <Text style={[styles.text, this._extraStyle.text]}>{title}</Text>
      </TouchableOpacity>
    );
  }

  render() {
        // 判断titles和values的合法性
    const titles = this.props.titles;
    const values = this.props.values;
    if (!titles || !values || titles.length !== values.length) {
      console.warn('radiogroup下发的titles和values不合法');
    }
    return (
      <View style={[styles.container, this._rootStyle]}>
        {values.map((value, index) => {
          const isChecked = this.props.value === value;
          return this._renderRadio(titles[index], value, isChecked);
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#EFEFEF',
    flexDirection: 'row',
    alignItems: 'center',
        // justifyContent: 'space-between',
    flexWrap: 'wrap',
    margin: 5,
    paddingVertical: 5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  text: {
    paddingHorizontal: 5,
    textAlign: 'center',
  },
});

export default RadioGroup;
