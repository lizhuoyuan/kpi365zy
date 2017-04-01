/**
 * Created by Jeepeng on 2017/2/8.
 */

import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Dimensions,
  Platform,
  View,
  Modal,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
} from 'react-native';

const TouchableView = Platform.select({
  ios: TouchableOpacity,
  android: TouchableNativeFeedback,
});

class Dialog extends Component {

  constructor() {
    super();
  }

  static propTypes = {
    title: PropTypes.string,
    footer: PropTypes.array,
  };

  static defaultProps = {
    animationType: 'none',
    transparent: true,
    onRequestClose: () => {},
    onClose: () => {},
    footer: [],
  };

  _onPressFooterButton({ text, onPress }) {
    onPress && onPress();
  }

  render() {
    const { style, rootStyle, title, footer, onClose, ...props } = this.props;
    return (
      <Modal {...props} >
        <TouchableOpacity activeOpacity={1} style={[styles.container, rootStyle]} onPress={onClose}>
          <View style={[styles.content, style]}>
            { title ?
              <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
              </View> : null
            }
            {this.props.children}
            { footer.length > 0 ?
              footer.map((item, index) => (
                <TouchableView onPress={() => this._onPressFooterButton(item)} key={index} style={styles.footer}>
                  <Text style={[styles.footerText, item.textStyle]}>{item.text}</Text>
                </TouchableView>
                ))
              : null
            }
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    width: width * 0.75,
    minWidth: width * 0.6,
    maxWidth: width,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  header: {
    padding: 15,
  },
  title: {
    color: '#000',
    fontSize: 18,
    textAlign: 'center',
  },
  footer: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e5e5',
  },
  footerText: {
    fontSize: 16,
  },
});

export default Dialog;
