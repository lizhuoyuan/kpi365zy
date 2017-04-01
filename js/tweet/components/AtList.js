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
  ActivityIndicator,
  RefreshControl
} from 'react-native';

import { NavBar, TouchableView } from './base';
import { getAtUsers } from '../actions/actionCreators';

class AtList extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let { tweets } = this.props.dataStore;
    (Object.keys(tweets.extra.atUsers || {}) || []).length === 0 && this.fetch();
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

  _renderSectionHeader(sectionData, sectionID) {
    return (
      <View style={styles.sectionHeader} key={sectionID}>
        <Text>{sectionID}</Text>
      </View>
    );
  }

  _renderRow(rowData, sectionID) {
    return (
      <TouchableView onPress={this._onPressItem.bind(this, rowData)} style={styles.row} key={rowData.id}>
        <Text>{rowData.name}</Text>
      </TouchableView>
    );
  }

  render() {
    let { tweets } = this.props.dataStore;
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
    });
    let dataSource = ds.cloneWithRowsAndSections(tweets.extra.atUsers || {});
    return (
      <ListView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        dataSource={dataSource}
        initialListSize={10}
        pageSize={10}
        renderSectionHeader={this._renderSectionHeader.bind(this)}
        renderRow={this._renderRow.bind(this)}
        renderSeparator={this._renderSeparator}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#dfdfdf'
  },
  contentContainer: {
    backgroundColor: '#fff'
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd'
  },
  sectionHeader: {
    height: 25,
    paddingHorizontal: 10,
    justifyContent: 'center',
    backgroundColor: 'rgba(233,233,233,0.75)'
  },
  row: {
    height: 40,
    paddingHorizontal: 10,
    justifyContent: 'center'
  },
  footer: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default AtList;
