/**
 * Created by Jeepeng on 2017/1/10.
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  ListView,
  Image,
  ActivityIndicator,
  RefreshControl
} from 'react-native';

import images from '../config/images';
import { getAtUsers } from '../actions/actionCreators';

class LikeList extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //this.fetch()
  }

  shouldComponentUpdate(nextProps) {
    return JSON.stringify(nextProps) !== JSON.stringify(this.props);
  }

  fetch() {
    this.props.dispatch(getAtUsers());
  }

  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View key={`${sectionID}-${rowID}`} style={styles.separator} />
    );
  }

  _onPressItem (rowData) {
    this.props.onPress(rowData);
  }

  _renderRow(like) {
    let avatarSource = like.user.sex === '1' ? images.avatar_girl : images.avatar_boy;
    if (like.user.header && like.user.header.indexOf('http') !== -1) {
      avatarSource = { uri: like.user.header};
    }

    return (
      <View style={styles.row}>
        <Image source={avatarSource} style={styles.avatar}/>
        <View style={styles.rowRightContainer}>
          <Text style={styles.username}>{like.user.name}</Text>
        </View>
      </View>
    );
  }

  _renderHeader() {
    return this.props.data.length > 0 ? null :
      <View style={styles.header}>
        <Text style={{color: '#ccc'}}>{this.props.emptyMessage || '还没有人点赞过'}</Text>
      </View>;
  }

  render() {
    let { tweet, data, contentContainerStyle } = this.props;
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let dataSource = ds.cloneWithRows(data);
    return (
      <ListView
        style={styles.likeList}
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
  likeList: {
    backgroundColor: '#f2f2f2'
  },
  contentContainer: {
    backgroundColor: '#f2f2f2'
  },
  separator: {
    height: 1,
    backgroundColor: '#efefef',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  header: {
    backgroundColor: '#f2f2f2',
    flexGrow: 1,
    paddingVertical: 20,
    alignItems: 'center'
  },
  rowRightContainer: {
    paddingVertical: 18,
    paddingLeft: 0,
    flexGrow: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
    //backgroundColor: 'red',
  },
  avatar: {
    backgroundColor: '#ddd',
    width: 32,
    height: 32,
    borderRadius: 16,
    overlayColor: '#fff',
    margin: 8,
  },
  username: {
    marginLeft: 10,
    color: '#333'
  },

  sectionHeader: {
    height: 25,
    paddingHorizontal: 10,
    justifyContent: 'center',
    backgroundColor: 'rgba(233,233,233,0.75)'
  },
  footer: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default LikeList;
