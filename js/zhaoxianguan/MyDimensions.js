import React, {Component} from 'react';
import {
    PixelRatio,
    View,
    Text
} from 'react-native';
import {getChangeRatio} from '../SizeController'
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
const pi = PixelRatio.get();

/*const apple6_width = 375;
 const myscale = width / apple6_width / 2;*/

//获取屏幕尺寸
export default {
    myscale: getChangeRatio() / 2,
    pi: pi,
}


