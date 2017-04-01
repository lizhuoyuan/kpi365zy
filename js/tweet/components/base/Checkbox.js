/**
 * CheckBoxGroup
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

class CheckBoxGroup extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    eventHandler: React.PropTypes.func,
  };

  static defaultProps = {
    eventHandler: () => {},
  };

  componentDidMount() {

  }

  /**
   * 点击checkbox
   * @param value
   * @param isChecked
   * @private
   */
  _onCheck(value, isChecked) {
    // 更改selected的值并发起action重新渲染
    const selected = [].concat(this.props.selected || []);
    const index = selected.indexOf(value);
    if (isChecked && index === -1) {
      // 选中且不存在则添加到已选列表中
      selected.push(value);
    } else if (!isChecked && index !== -1) {
      // 取消选中且存在则从已选列表中移除
      selected.splice(index, 1);
    }
    this.props.eventHandler(this.props.id, ActionTypes.REFRESH_UI_BY_LOCAL, { selected, value: selected });
  }

  /**
   * 渲染单个checkbox
   * @param title
   * @param value
   * @param isChecked 是否选中
   * @returns {XML}
   * @private
   */
  _renderCheckbox(title, value, isChecked = false) {
    const name = isChecked ? 'check-box' : 'check-box-outline-blank';
    return (
      <TouchableOpacity
        key={value}
        style={[styles.item, this._extraStyle.item]}
        activeOpacity={1}
        onPress={this._onCheck.bind(this, value, !isChecked)}
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
    const selected = this.props.selected || [];
    if (!titles || !values || titles.length !== values.length) {
      console.warn('checkboxgroup下发的titles和values不合法');
    }
    return (
      <View style={[styles.container, this._rootStyle]}>
        {values.map((value, index) => {
          const isChecked = selected.indexOf(value) !== -1;
          return this._renderCheckbox(titles[index], value, isChecked);
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

export default CheckBoxGroup;
