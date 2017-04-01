/**
 * 星评
 * Created by yuanzhou on 16/12.
 */
import React, {Component} from 'react'
import {
    View,
    TouchableHighlight,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native'
import ImageResource from '../../utils/ImageResource'
let StarRating = React.createClass({
    getDefaultProps: function () {
        return {
            starStyle: {width: 20, height: 20},
            containerStyle: {flex: 1}
        }
    },
    render(){
        let keyIndex = this.props.rating
        let stars = [];
        let pressRetentOffset = {top: 5, left: 5, right: 5, bottom: 5}
        for (let i = 0; i < 5; i++) {
            if (i <= keyIndex - 1) {
                if (keyIndex <= 2) {
                    stars[i] = <TouchableWithoutFeedback
                        hitSlop={pressRetentOffset}
                        style={{flex:1}} key={i+1}
                        onPressIn={this.props.selectedStar&&this.props.selectedStar.bind(this,i+1)}
                    >
                        <View style={{flex:1}}>
                            <Image
                                style={[{width:20,height:20},this.props.starStyle]}
                                resizeMode="cover"
                                source={ImageResource['icon-star3@2x.png']}
                            >
                            </Image>
                        </View>
                    </TouchableWithoutFeedback>
                } else {
                    stars[i] = <TouchableWithoutFeedback
                        hitSlop={pressRetentOffset}
                        style={{flex:1}}
                        key={i+1}
                        onPressIn={this.props.selectedStar&&this.props.selectedStar.bind(this,i+1)}
                    >
                        <View style={{flex:1,}}>
                            <Image style={[{width:20,height:20},this.props.starStyle]}
                                   resizeMode="cover"
                                   source={ImageResource['icon-star2@2x.png']}>
                            </Image>
                        </View>
                    </TouchableWithoutFeedback>
                }
            } else {
                stars[i] = <TouchableWithoutFeedback
                    hitSlop={pressRetentOffset}
                    style={{flex:1}} key={i+1}
                    onPressIn={this.props.selectedStar&&this.props.selectedStar.bind(this,i+1)}
                >
                    <View style={{flex:1}}>
                        <Image style={[{width:20,height:20},this.props.starStyle]}
                               resizeMode="cover"
                               source={ImageResource['icon-star@2x.png']}>
                        </Image>
                    </View>
                </TouchableWithoutFeedback>
            }

        }
        return (
            <View style={[{
          flexDirection: 'row'},this.props.containerStyle]}>
                {stars}
            </View>
        )
    }
})
export default StarRating
