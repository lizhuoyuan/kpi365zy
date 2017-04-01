/**
 * Created by Jeepeng on 2017/3/1.
 */

import React from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
} from 'react-native';

export default class Composer extends React.Component {

  constructor() {
    super();
    this.state = {
      height: Platform.select({
        ios: 33,
        android: 41,
      }),
    };
  }

  onChange(e) {
    const contentSize = e.nativeEvent.contentSize;
    if (!this.contentSize) {
      this.contentSize = contentSize;
      this.props.onInputSizeChanged(this.contentSize);
      contentSize.height < 100 && this.setState({
        height: contentSize.height,
      });
    } else if (this.contentSize.width !== contentSize.width || this.contentSize.height !== contentSize.height) {
      this.contentSize = contentSize;
      this.props.onInputSizeChanged(this.contentSize);
      contentSize.height < 100 && this.setState({
        height: contentSize.height,
      });
    }
  }

  onChangeText(text) {
    this.props.onChangeText(text);
  }

  render() {
    return (
      <TextInput
        placeholder={this.props.placeholder}
        placeholderTextColor={this.props.placeholderTextColor}
        multiline={this.props.multiline}

        onChange={(e) => this.onChange(e)}
        onChangeText={text => this.onChangeText(text)}

        style={[styles.textInput, this.props.textInputStyle, {height: this.state.height}]}
        numberOfLines={4}
        value={this.props.value}
        accessibilityLabel={this.props.text || this.props.placeholder}
        enablesReturnKeyAutomatically={true}
        underlineColorAndroid="transparent"
        {...this.props.textInputProps}
      />
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    flexGrow: 1,
    marginLeft: 10,
    fontSize: 16,
    lineHeight: 16,
    marginTop: Platform.select({
      ios: 6,
      android: 0,
    }),
    marginBottom: Platform.select({
      ios: 5,
      android: 3,
    }),
    minHeight: Platform.select({
      ios: 33,
      android: 41,
    }),
  },
});

Composer.defaultProps = {
  onChange: () => {
  },
  value: '',
  placeholder: '简单说两句',
  placeholderTextColor: '#b2b2b2',
  textInputProps: null,
  multiline: true,
  textInputStyle: {},
  onChangeText: () => {
  },
  onInputSizeChanged: () => {
  },
};

Composer.propTypes = {
  onChange: React.PropTypes.func,
  value: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  placeholderTextColor: React.PropTypes.string,
  textInputProps: React.PropTypes.object,
  onChangeText: React.PropTypes.func,
  onInputSizeChanged: React.PropTypes.func,
  multiline: React.PropTypes.bool,
  textInputStyle: TextInput.propTypes.style,
};
