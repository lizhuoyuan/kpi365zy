/**
 * Created by Jeepeng on 2016/12/4.
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

class NumberInput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      number: props.number,
    };
  }

  static propTypes = {
    number: React.PropTypes.number,
    onNumberChange: React.PropTypes.func,
  };

  static defaultProps = {
    number: 0,
    onNumberChange: () => {},
  };

  componentWillReceiveProps(nextProps) {
    const number = nextProps.number;
    !isNaN(number) && this.setState({
      number: nextProps.number,
    });
  }

  _onChangeText(text) {
    this.setState({
      number: Number(text),
    }, () => this.props.onNumberChange(this.state.number));
  }

  _changeNumber(number) {
    const { min, max } = this.props;
    const newNumber = this.state.number + number;
    if ((!isNaN(min) && newNumber < min) || (!isNaN(max) && newNumber > max)) {
      return;
    }
    this.setState({
      number: newNumber,
    }, () => this.props.onNumberChange(this.state.number));
  }

  render() {
    const { style, ...inputProps } = this.props;
    const rawStyle = StyleSheet.flatten(style);
    const height = (rawStyle && rawStyle.height) || 35;
    const cStyle = {
      height,
    };
    const oStyle = {
      height,
      width: height,
    };
    return (
      <View style={[styles.container, cStyle, style]}>
        <TouchableOpacity style={[styles.operation, oStyle]} activeOpacity={0.8} onPress={this._changeNumber.bind(this, -1)}>
          <Text style={styles.operationText}>-</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          keyboardType="numeric"
          value={`${this.state.number}`}
          onChangeText={this._onChangeText.bind(this)}
          {...inputProps}
        />
        <TouchableOpacity style={[styles.operation, oStyle]} activeOpacity={0.8} onPress={this._changeNumber.bind(this, 1)} >
          <Text style={styles.operationText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  operation: {
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  operationText: {
    color: '#666',
    fontSize: 24,
  },
  input: {
    flexGrow: 1,
    borderLeftColor: '#ccc',
    borderLeftWidth: 1,
    borderRightColor: '#ccc',
    borderRightWidth: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 0,
  },
});

export default NumberInput;
