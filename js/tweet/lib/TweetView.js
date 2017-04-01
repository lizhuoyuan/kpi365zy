/**
 * Created by Jeepeng on 2016/9/26.
 */

import React, { Component } from 'react';
import {
  View,
  TouchableHighlight,
  Text,
  Dimensions,
  StyleSheet,
  Image,
} from 'react-native';
import ImageSourcePropType from 'react-native/Libraries/Image/ImageSourcePropType';
import ParsedText from 'react-native-parsed-text';

import KPI365 from './layout/KPI365';
import KPI365_Notice from './layout/KPI365_Notice';
import Touchable from './Touchable';

const layouts = new Map();
layouts.set('tweet', KPI365);
layouts.set('daily', KPI365);
layouts.set('target', KPI365);
// 通知
layouts.set('notice', KPI365_Notice); // @我的
layouts.set('tweestar_support', KPI365_Notice); // 点赞
layouts.set('tweestar_comment', KPI365_Notice); // 评论
layouts.set('target_focus', KPI365_Notice);

class TweetView extends Component {

  static propTypes = {
    avatarSource: ImageSourcePropType,
    onPressItem: React.PropTypes.func,
    onPressImage: React.PropTypes.func,
  };

  static defaultProps = {
    onPressImage() {},
  };

  shouldComponentUpdate(nextProps) {
    return JSON.stringify(nextProps) !== JSON.stringify(this.props);
  }

  _renderContent(text, parse) {
    return (
      <ParsedText parse={parse} childrenProps={{allowFontScaling: false}}>{text}</ParsedText>
    );
  }

  render() {
    const { content, parse, revoke, onPress, layout, ...props } = this.props;
    const LayoutComponent = layouts.get(props.type);
    return (
      <Touchable onPress={onPress} underlayColor="#fbfbfb" >
        <View>
          <LayoutComponent
            {...props}
            content={content}
            text={this._renderContent(content.text, parse)}
          />
        </View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
});

export default TweetView;
