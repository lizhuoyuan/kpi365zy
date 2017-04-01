/**
 * Created by Jeepeng on 2016/12/27.
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  Image,
  ListView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import moment from 'moment';

import { TouchableView } from './base';
import images from '../config/images';

class CommentList extends Component {

  constructor(props) {
    super(props);
  }

  static defaultProps = {
    onLongPress: () => {},
  };

  componentDidMount() {
    //this.fetch()
  }

  shouldComponentUpdate(nextProps) {
    return JSON.stringify(nextProps) !== JSON.stringify(this.props);
  }

  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View key={`${sectionID}-${rowID}`} style={styles.separator} />
    );
  }

  _onPressItem (comment) {
    this.props.onPress(comment);
  }

  _renderRow(comment) {
    let { tweet } = this.props;
    const format = moment().year() !== moment(comment.date).year() ? 'YYYY-MM-DD HH:mm' : 'MM-DD HH:mm';
    const commentDate = moment(comment.date).format(format);

    let avatarSource = comment.user.sex === '1' ? images.avatar_girl : images.avatar_boy;
    if (comment.user.header && comment.user.header.indexOf('http') !== -1) {
      avatarSource = { uri: comment.user.header};
    }
    return (
      <TouchableView
        style={styles.row}
        activeOpacity={0.8}
        onPress={this._onPressItem.bind(this, comment)}
        onLongPress={() => this.props.onLongPress(comment)}>
        <Image source={avatarSource} style={styles.avatar}/>
        <View style={styles.rowRightContainer}>
          <View style={styles.rowTopContainer}>
            <Text style={styles.username}>{comment.user.name}</Text>
            <Text style={styles.created_at}>{commentDate}</Text>
          </View>
          <View style={styles.rowContentContainer}>
            {comment.parent === tweet.id ?
              <Text style={styles.comment}>{comment.content.text}</Text>
              :
              <Text style={styles.comment}>回复 <Text style={{color: '#2babf9'}}>{comment.toUser.name}</Text>: {comment.content.text}</Text>
            }
          </View>
        </View>
      </TouchableView>
    );
  }

  _renderHeader() {
    return this.props.data.length > 0 ? null :
      <View style={styles.header}>
        <Text style={{color: '#ccc'}}>{this.props.emptyMessage || '快来抢沙发'}</Text>
      </View>;
  }

  render() {
    let { tweet, data, contentContainerStyle} = this.props;
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let dataSource = ds.cloneWithRows(data);
    return (
      <ListView
        style={styles.commentList}
        contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
        dataSource={dataSource}
        initialListSize={10}
        pageSize={10}
        enableEmptySections={true}
        renderHeader={this._renderHeader.bind(this)}
        renderRow={this._renderRow.bind(this)}
      />
    );
  }
}

const styles = StyleSheet.create({
  commentList: {
    backgroundColor: '#f2f2f2'
  },
  contentContainer: {
    backgroundColor: '#f2f2f2'
  },
  separator: {
    height: 1,
    backgroundColor: '#efefef'
  },
  header: {
    backgroundColor: '#f2f2f2',
    flexGrow: 1,
    paddingVertical: 20,
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff'
  },
  avatar: {
    marginLeft: 10,
    marginTop: 10,
    backgroundColor: '#ddd',
    width: 32,
    height: 32,
    borderRadius: 16,
    overlayColor: '#fff'
  },
  rowRightContainer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 1,
    margin: 10,
    marginBottom: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5'
  },
  rowTopContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  username: {
    marginTop: 3,
    fontSize: 14,
    color: '#2babf9'
  },
  created_at: {
    color: '#a5a5a5',
    fontSize: 12
  },
  rowContentContainer: {
    marginTop: 10,
    marginBottom: 15
  },
  comment: {
    color: '#606060'
  }
});

export default CommentList;
