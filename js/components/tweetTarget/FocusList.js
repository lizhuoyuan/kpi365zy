/**
 * Created by yuanzhou on 2017/03/09.
 * copy from Jeepeng TweetList
 */

import React, {Component} from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    InteractionManager
}    from 'react-native'
import ListView from '../base/ListView'
import ImageResource from '../../utils/ImageResource'
import {fetchFocus, focusTargetRecall, updatePage} from '../../actions'
import moment from 'moment'
import FocusTargetDetail from './FocusTargetDetail'
import 'moment/locale/zh-cn'
import KPIFocus from './KPIFocus'

moment.locale('zh-cn');

const PAGE_SIZE = 20;

class FocusList extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    static defaultProps = {
        focus: []
    };

    componentDidMount() {
        this.fetch("init");
    }

    componentWillReceiveProps(nextProps, nextState) {
        let {pageModel} = nextProps;
        let {PageData} = pageModel;
        if (this.props.enterTab !== nextProps.enterTab) {
            this.fetch("init");
        }
        this.setState({});
        if (PageData.needInitUpdate === 0 || PageData.needInitUpdate === 1) {
            //this.fetch("init");
            this.setState({});
        }
    }

    /**
     * 获取数据
     * @param action
     */
    fetch(action = 'init') {
        InteractionManager.runAfterInteractions(() => {
            this.props.dispatch(fetchFocus(action));
        });
    }

    _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        return (
            <View key={rowID} style={styles.separator}/>
        )
    }

    _onRefresh() {
        this.fetch("init");
        //this.fetch('down')
    }

    _onEndReached() {
        let {focusTargets} = this.props;
        if (Object.keys(focusTargets.entities).length >= PAGE_SIZE) {
            !focusTargets.fetching && this.fetch('up')
        }
    }


    /**
     * 前往详情页面
     * @param obj
     * @private
     */
    _toDetailPage(obj) {
        let {dispatch} = this.props;
        let route = {
            name: 'FocusTargetDetail',
            type: 'FocusTargetDetail',
            path: 'none',
            component: FocusTargetDetail,
            index: 2,//routeInfo.index + 1,
            params: {
                focusTargetInfo: obj
            }
        };
        updatePage(dispatch, {
            route: route
        });
    }

    _renderRow({user, ...rowData}) {
        const {userid} = this.props;
        let avatarSource = user.sex === '女' ? ImageResource["header-girl@2x.png"] : ImageResource["header-boy@2x.png"];
        if (user.avatar && user.avatar.indexOf('http') !== -1) {
            avatarSource = {uri: user.avatar};
        }
        const subtitle = [user.country, user.deptName];
        let obj = {
            userid: userid,
            avatarSource: avatarSource,
            username: user.name,
            subtitle: subtitle.join(' | '),
            content: rowData.contents,
            time: rowData.date,
            userUniqueid: user.userUniqueid,
        }
        return (
            <KPIFocus
                style={styles.tweet}
                id={rowData.id}
                {...obj}
                toDetailPage={()=>this._toDetailPage(obj)}
            />
        )
    }

    render() {
        let {focusTargets} = this.props;
        let items = focusTargets.entities ? Object.values(focusTargets.entities) : [];
        return (
            <View style={{flexGrow: 1}}>
                <ListView
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}
                    data={items}
                    initialListSize={1}
                    pageSize={5}
                    {...this.props}
                    refreshing={focusTargets.fetching}
                    onRefresh={this._onRefresh.bind(this)}
                    alwaysBounceVertical={false}
                    onEndReachedThreshold={60}
                    onEndReached={this._onEndReached.bind(this)}
                    enableEmptySections={true}
                    renderRow={this._renderRow.bind(this)}
                    renderSeparator={this._renderSeparator}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        flexBasis: 1,
        backgroundColor: '#f2f2f2'
    },
    navBarBtn: {
        height: 44,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    contentContainer: {
        backgroundColor: '#fff',
    },
    separator: {
        height: 9,
        backgroundColor: '#f2f2f2'
    },
    footer: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default FocusList