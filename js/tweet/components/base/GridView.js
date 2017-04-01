/**
 * Created by Jeepeng on 2016/11/14.
 */

import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  ListView
} from 'react-native';

class GridView extends Component {

  static propTypes = {
    data: PropTypes.array,
    cellsPerRow: PropTypes.number,
    renderCell: PropTypes.func
  };

  static defaultProps = {
    data: [],
    renderCell: () => null,
    cellsPerRow: 1
  };

  _renderRow(rowData) {
    let { renderCell } = this.props;
    return (
      <View style={{flexDirection: 'row'}}>
        { rowData.map((item, index) => renderCell(item, index)) }
      </View>
    );
  }

  ducData(data = [], cellsPerRow = 1) {
    let result = [];
    let rowData = [];
    data.forEach((item, index) => {
      rowData.push(item);
      if (rowData.length >= cellsPerRow || index === data.length - 1) {
        result.push(rowData);
        rowData = [];
      }
    });
    return result;
  }

  render() {
    let { style, data, cellsPerRow  } = this.props;
    let items = this.ducData(data, cellsPerRow);
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let dataSource = ds.cloneWithRows(items);
    return (
      <ListView
        style={style}
        dataSource={dataSource}
        renderRow={this._renderRow.bind(this)}
        initialListSize={1}
        pageSize={1}
        enableEmptySections={true}
      />
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row'
  }
});

export default GridView;
