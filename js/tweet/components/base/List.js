/**
 * Created by Jeepeng on 2017/1/29.
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import TouchableView from './TouchableView';

class Item extends Component {
  render() {
    const { thumb, extra, onPress, children, _rightStyle } = this.props;
    return (
      <TouchableView onPress={onPress} style={styles.item}>
        {thumb}
        <View style={[styles.itemRight, _rightStyle]}>
          { typeof children === 'string' ?
            <Text style={styles.rightContentText}>{children}</Text>
            : <View style={styles.rightContent}>{children}</View>
          }
          <View style={styles.rightRight}>
            { typeof extra === 'string' ?
              <Text style={styles.rightExtraText}>{extra}</Text>
              : <View style={styles.rightExtra}>{extra}</View>
            }
            <Icon name="keyboard-arrow-right" style={styles.arrow} />
          </View>
        </View>
      </TouchableView>
    );
  }
}

class List extends Component {

  static Item = Item;

  render() {
    const { renderHeader, renderFooter, children, style } = this.props;
    return (
      <View style={[styles.list, style]}>
        {renderHeader && renderHeader()}
        <View style={styles.listWrapper}>
          {
            React.Children.map(children, (child, index) => {
              const extraRightStyle = children.length - 1 === index ? styles.itemRightWithoutBorder : {};
              return React.cloneElement(child, {
                _rightStyle: extraRightStyle,
              });
            })
          }
        </View>
        {renderFooter && renderFooter()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {

  },
  listWrapper: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  item: {
    paddingLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemRight: {
    paddingRight: 5,
    flex: 1,
    minHeight: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  itemRightWithoutBorder: {
    borderBottomWidth: 0,
  },
  rightContentText: {
    flex: 1,
    fontSize: 16,
  },
  rightContent: {
    flex: 1,
    alignItems: 'center',
  },
  rightRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  rightExtraText: {
    color: '#888',
    fontSize: 16,
  },
  rightExtra: {},
  arrow: {
    fontSize: 24,
    color: '#ccc',
  },

});

export default List;
