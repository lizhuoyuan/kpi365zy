/**
 * Created by Jeepeng on 2017/2/3.
 */

import React, {Component, PropTypes} from 'react'
import {
    StyleSheet,
    View,
    StatusBar,
    Text,
    ListView,
    ActivityIndicator,
    RefreshControl
} from 'react-native'

const DEFAULT_PAGE_SIZE = 20;

class XListView extends Component {

    constructor(props) {
        super(props);
        this.scrollRef = null;
    }

    static propTypes = {
        refreshing: PropTypes.bool,
        hasSection: PropTypes.bool,
        data: PropTypes.array.isRequired,
        renderFooter: PropTypes.func,
    };

    static defaultProps = {
        refreshing: false,
        hasSection: false,
        pageSize: DEFAULT_PAGE_SIZE,
        renderFooter: () => null,
        onEndReached: () => {
        }
    };

    shouldComponentUpdate(nextProps, nextState) {
        return true;
        // return JSON.stringify(nextProps) !== JSON.stringify(this.props)
    }

    componentDidUpdate() {
        let {PageData} = this.props.pageModel;
        if (PageData && PageData.needInitUpdate === 0 || PageData.needInitUpdate === 1) {
            this.scrollRef && this.scrollRef.scrollTo({y: 1}, false);
            this.scrollRef && this.scrollRef.scrollTo({y: 0}, false);
        }
    }

    _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        return (
            <View key={`${sectionID}-${rowID}`} style={styles.separator}/>
        )
    }

    _onEndReached() {
        let {data, hasSection, refreshing, pageSize, onEndReached} = this.props;
        if (!hasSection && !refreshing && data.length >= pageSize) {
            onEndReached();
        } else if (hasSection) { // TODO onEndReached可能会连续调用多次
            onEndReached();
        }
    }

    _renderFooter() {
        let {data, refreshing, pageSize, renderFooter} = this.props;
        return (
            <View>
                { renderFooter() }
                {
                    refreshing && data.length >= pageSize ?
                        <View style={styles.footer}>
                            <ActivityIndicator
                                animating={true}
                                color='#ddd'
                                size='small'
                            />
                            <Text style={{marginLeft: 8, color: '#ccc'}}>正在加载...</Text>
                        </View> : null
                }
            </View>
        )
    }

    render() {
        let {
            style,
            contentContainerStyle,
            data,
            hasSection,
            refreshing,
            pageSize,
            initialListSize,
            renderRow,
            renderHeader,
            renderSeparator,
            renderSectionHeader,
            onRefresh
        } = this.props;
        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (r1, r2) => r1 !== r2,
        });
        let dataSource = ds.cloneWithRowsAndSections(hasSection ? data : [data]);
        return (
            <ListView
                style={style || styles.container}
                contentContainerStyle={contentContainerStyle || styles.contentContainer}
                dataSource={dataSource}
                initialListSize={initialListSize}
                pageSize={pageSize}
                renderSectionHeader={renderSectionHeader}
                renderRow={renderRow}
                renderSeparator={renderSeparator || this._renderSeparator.bind(this)}
                refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
                ref={(e)=>this.scrollRef=e}
                alwaysBounceVertical={true}
                onEndReachedThreshold={60}
                onEndReached={this._onEndReached.bind(this)}
                enableEmptySections={true}
                renderHeader={renderHeader}
                renderFooter={this._renderFooter.bind(this)}
            />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#ebebf1'
    },
    contentContainer: {
        backgroundColor: '#fff'
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#ddd'
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

export default XListView