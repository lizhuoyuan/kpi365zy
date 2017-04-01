/**
 * Created by Jeepeng on 2017/2/17.
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Platform,
  Picker,
  TouchableHighlight,
  View,
  Text,
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class XPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showingOption: false,  // 标记是否显示option(ios)
      selectingValue: props.value      // 临时选择的值(ios)
    };
  }

  static propTypes = {
    title: React.PropTypes.string,
    options: React.PropTypes.array,
    onPickerChange: React.PropTypes.func,
    onValueChange: React.PropTypes.func,
  };

  static defaultProps = {
    enabled: true
  };

  /**
   * 判断是否要更新
   * @param nextProps
   * @param nextState
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  _onValueChange(value) {
    // TODO bug https://github.com/facebook/react-native/issues/9220
    let isChange = this.props.value !== value;
    isChange && this.props.onValueChange(value);
  }

  _onSelectingChange(value) {
    this.setState({
      selectingValue: value
    });
  }

  _onSelectOk() {
    this.setState({
      showingOption: false
    }, () => {
      // 选中值没有改变则不触发action
      let isChange = this.props.value !== this.state.selectingValue;
      isChange && this.props.onValueChange(this.state.selectingValue);
    });
  }

  /**
   * 显示或隐藏Picker (ios)
   * @private
   */
  _toggleOptionIOS() {
    this.setState({
      showingOption: !this.state.showingOption
    });
  }

  /**
   * 渲染Picker (ios)
   * @param options
   * @returns {XML}
   * @private
   */
  _renderPickerIOS(options) {
    return (
      <Modal animationType="none" onRequestClose={this._toggleOptionIOS.bind(this)} transparent={true} >
        <View style={{flex: 1,justifyContent: 'flex-end',backgroundColor: '#00000033'}}>
          <View style={[styles.buttonView]}>
            <TouchableHighlight
              style={[styles.button]}
              activeOpacity={0.5}
              onPress={this._toggleOptionIOS.bind(this)}
              underlayColor={'#FFF'}>
              <View >
                <Text style={[styles.buttonText]}>
                  取消
                </Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              style={[styles.button]}
              activeOpacity={0.5}
              onPress={this._onSelectOk.bind(this)}
              underlayColor={'#FFF'}>
              <View >
                <Text style={[styles.buttonText]}>
                  确定
                </Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={{backgroundColor: '#FFF'}}>
            <Picker
              style={[styles.base, this._rootStyle]}
              selectedValue={this.state.selectingValue || ''}
              onValueChange={this._onSelectingChange.bind(this)}>
              { options }
            </Picker>
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    let options = [];
    let label = '请选择...'; // 显示用的label
    if (!this.props.value){
      options.push(<Picker.Item label={label} value="" key="not-selected" />);
    }
    this.props.option.forEach((item) => {
      options.push(
        <Picker.Item label={item.value} value={item.key}  key={item.key} />
      );
    });
    return (
      Platform.OS === 'ios' ?
        <TouchableOpacity
          style={[styles.ios, this._rootStyle]}
          activeOpacity={0.5}
          onPress={this._toggleOptionIOS.bind(this)} >
          <View style={{flex: 1,flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={[styles.textIOS]}>{label}</Text>
            <Icon name="caret-down" color="#666"/>
            { this.state.showingOption ? this._renderPickerIOS(options) : null }
          </View>
        </TouchableOpacity>
        :
        <Picker
          style={[styles.base, this._rootStyle]}
          selectedValue={this.props.value || ''}
          enabled={this.props.enabled}  // Android only
          mode="dialog" // enum('dialog', 'dropdown'). Android only
          prompt={this.props.title} // dialog title. Android only
          onValueChange={this._onValueChange.bind(this)}>
          { options }
        </Picker>
    );
  }
}

const styles = StyleSheet.create({
  base: {
  },
  ios: {
    borderWidth: 1,
    borderColor: '#CCC',
    paddingHorizontal: 10,
    paddingVertical: 8

  },
  textIOS: {
    color: '#333'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },

  buttonText: {
    color: '#0061FF'
  },

  buttonView: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: '#DDD',
    borderBottomWidth: 0.5,
    borderBottomColor: '#DDD'
  },
});

export default XPicker;
