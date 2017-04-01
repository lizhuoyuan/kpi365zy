/**
 * Created by Jeepeng on 2017/1/13.
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import ParsedText from 'react-native-parsed-text';

class Editor extends Component {

  constructor(props) {
    super(props);
  }

  _onChangeText(text) {
    this.props.onChangeText(text);
  }

  focus() {
    this._editor.focus();
  }

  render() {
    let {style, parse, value, onChangeText, ...inputProps} = this.props;
    return (
      <TextInput
        style={[styles.input, style]}
        ref={input => this._editor = input}
        underlineColorAndroid="transparent"
        autoCorrect={false}
        multiline={true}
        numberOfLines={5}
        onChangeText={this._onChangeText.bind(this)}
        value={value}
        {...inputProps}  />
    );
  }
}

const styles = StyleSheet.create({
  input: {
    flexGrow: 1,
    padding: 0,
    textAlignVertical: 'top'
  }
});

export default Editor;
