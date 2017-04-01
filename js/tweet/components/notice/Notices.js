/**
 * Created by Jeepeng on 2017/3/3.
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Button,
  Image,
  Text,
} from 'react-native';

import { getNoticeCount } from '../../actions/actionCreators';
import Touchable from '../base/Touchable';
import Badge from '../base/Badge';

const items = [
  {
    icon: require('./notice-company.png'),
    text: '公司动态',
    key: 'company',
  },
  {
    icon: require('./notice-mention.png'),
    text: '@我的',
    key: 'notice',
  },
  {
    icon: require('./notice-comment.png'),
    text: '评论',
    key: 'tweestar_comment',
  },
  {
    icon: require('./notice-like.png'),
    text: '赞',
    key: 'tweestar_support',
  },
  {
    icon: require('./notice-focus.png'),
    text: '目标动态',
    key: 'target_focus',
  },
  {
    icon: require('./notice-gift.png'),
    text: '收到礼物',
    key: 'gift',
  },
];

class Notices extends React.Component {

  static navigationOptions = {
    tabBar: {
      label: '互动消息',
    },
  };

  componentDidMount() {
    this.props.dispatch(getNoticeCount());
  }

  _onPressItem(item) {
    return;
    // TODO 暂时屏蔽
    const key = item.key;
    if(key === 'company' || key === 'notice' || key === 'tweestar_comment' || key === 'gift' || key === 'target_focus') {
      return;
    }
    const navigate = this.props.navigation.navigate;
    navigate('NoticeList', {
      title: item.text,
      key: item.key,
    });
  }

  _renderItem(item) {
    const noticeCount = this.props.notice[item.key];
    return (
      <Touchable onPress={this._onPressItem.bind(this, item)} key={item.key}>
        <View style={styles.item}>
          <View style={styles.itemWrapper}>
            <View style={styles.itemLeft}>
              <Image style={styles.icon} source={item.icon} />
              <Text style={styles.text}>{item.text}</Text>
            </View>
            <View style={styles.itemLeft}>
              { noticeCount > 0 ? <Badge backgroundColor="#fb503f" style={styles.badge} badge={noticeCount} /> : null }
              <Image style={styles.arrowRight} source={require('./arrows.png')} />
            </View>
          </View>
        </View>
      </Touchable>
    );
  }

  render() {
    const { goBack } = this.props.navigation;
    return (
      <View style={styles.container}>
        { items.map(item => this._renderItem(item)) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  item: {
    marginHorizontal: 15,
    height: 60,
  },
  itemWrapper: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 33,
    height: 33,
  },
  text: {
    marginLeft: 10,
    fontSize: 15,
    color: '#2b3d54',
  },
  badge: {
  },
  arrowRight: {
    width: 15,
    height: 15,
    marginLeft: 10,
  },
});

export default Notices;
