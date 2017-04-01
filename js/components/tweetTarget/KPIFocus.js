/**
 * Created by yuanzhou on 2017/03/09.
 * copy from Jeepeng KPI
 */

import React, {Component} from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    StyleSheet,
    Image,
} from 'react-native';

import _ from 'underscore'
class TargetItem extends Component {


    /**
     * 点击
     */
    _onClick() {
        this.props.toDetailPage && this.props.toDetailPage();
    }

//<Image style={styles.targetImage} source={images.moments_focused}></Image>
    render() {
        let {data} = this.props;
        let {text} = data;
        let rightText = (
            <View style={styles.rightViewAbsolute}>
                <Text style={styles.rightText}>{data.progress}%</Text>
            </View>);
        return (
            <TouchableOpacity onPress={()=>this._onClick()} style={styles.targetContainer}>
                <View style={styles.targetTextView}>
                    <Text numberOfLines={1}
                          style={styles.targetText}>{text}</Text>
                </View>
                { rightText }
            </TouchableOpacity>
        )
    }
}

/**
 * 根据数据获取目标数组
 * @param  props
 * @return []
 */
function getTargets(props) {
    let {content, id, userUniqueid, toDetailPage, onRecallFocus} = props;
    let targets = [];
    if (content) {
        let keyIndex = 0;
        _.each(content, (value) => {
            keyIndex++;
            let ItemView = <TargetItem
                id={id}
                data={value}
                key={keyIndex}
                toDetailPage={toDetailPage}
                userUniqueid={userUniqueid}
                onRecallFocus={onRecallFocus}
            />
            if (keyIndex <= 5) {
                targets.push(ItemView);
            }
        });

        return targets;
    }
}

class KPIFocus extends Component {
    render() {
        let props = this.props;
        let targets = getTargets(props);
        return (
            <View style={[styles.container, props.style]}>
                <View style={styles.topContainer}>
                    <View style={styles.avatarContainer}>
                        <Image source={props.avatarSource} style={styles.avatar}/>
                    </View>
                    <View style={styles.topRightContainer}>
                        <Text style={styles.name}>{props.username}</Text>
                        <Text style={styles.title}>{props.subtitle}</Text>
                    </View>
                </View>
                <View style={styles.contentContainer}>
                    { targets }
                </View>
                <View style={styles.bottomContainer}>
                    <View style={styles.bottomLeftContainer}>
                        <Text style={styles.time}>{props.time}</Text>
                        <TouchableOpacity onPress={props.toDetailPage}>
                            <Text style={styles.revoke}>查看全部</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 0
    },
    topContainer: {
        flexDirection: 'row',
    },
    avatarContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    avatar: {
        margin: 10,
        backgroundColor: '#ddd',
        width: 40,
        height: 40,
        borderRadius: 20,
        overlayColor: "#fff"
    },
    topRightContainer: {
        marginTop: 15,
    },

    contentContainer: {
        margin: 10,
        marginLeft: 15
    },
    content: {
        textAlign: 'left',
        color: '#002546',
        fontSize: 15
    },

    bottomContainer: {
        flexDirection: 'row',
        margin: 10,
        marginLeft: 15
    },
    bottomLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottomRightContainer: {
        flexGrow: 1,
        flexBasis: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },

    time: {
        fontSize: 10,
        color: '#8999a5',
    },
    revoke: {
        marginLeft: 10,
        fontSize: 12,
        color: '#006ba1',
    },
    name: {
        color: '#000031',
        fontSize: 15
    },
    title: {
        color: '#929CA9',
        fontSize: 10,
        marginTop: 3
    },

    bottomTool: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    bottomToolText: {
        color: '#6D6D78',
        fontWeight: '500',
        alignItems: 'center'
    },

    imageGird: {
        marginTop: 12,
        flexDirection: 'row',
    },
    image: {
        height: 180,
        width: 180 * 0.618,
        backgroundColor: '#efefef'
    },

    commentContainer: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#eaeaea',
        marginHorizontal: 10,
        marginBottom: 15,
    },
    commentLikeContainer: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center'
    },
    likeText: {
        fontSize: 12,
        color: '#8999a5',
    },
    latestCommentContainer: {
        marginTop: 10,
    },
    commentUserText: {
        fontSize: 12,
        color: '#00A1F8',
    },
    commentText: {
        marginTop: 2,
        fontSize: 12,
        color: '#8999a5',
    },
    moreText: {
        marginTop: 5,
        fontSize: 13,
        color: '#3D76A6',
    },
    targetContainer: {
        paddingLeft: 10,
        height: 44,
        borderRadius: 10,
        marginBottom: 5,
        paddingRight: 60,
        flexDirection: "row",
        backgroundColor: "rgb(228,236,240)"
    },
    targetTextView: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "center"
    },
    targetText: {
        fontSize: 14,
        color: "#2b3d54"
    },
    targetFocusTouchableView: {
        flex: 0,
        paddingLeft: 10,
        alignItems: "flex-end"
    },
    targetImageView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    targetImage: {
        width: 15,
        height: 15
    },
    rightViewAbsolute: {
        position: "absolute",
        right: 0,
        top: 0,
        width: 60,
        height: 44,
        justifyContent: "center",
        alignItems: "center"

    },
    rightText: {
        fontSize: 14,
        textAlign:"right",
        color: "#1da9fc"
    },
    lookAllBtn: {}
});

export default KPIFocus;