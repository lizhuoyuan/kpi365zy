/**
 * Created by Jeepeng on 16/5/11.
 */

'use strict';

import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    ActivityIndicator,
    Dimensions
} from 'react-native'


class Loader extends Component {
    constructor() {
        super()
    }

    render() {
        return (
            <ActivityIndicator
                animating={true}
                color={"rgb(0,171,243)"}
                size="large"
                style={[styles.loading]}
            />
        );
    }
}
const height = Dimensions.get('window').height;
const width= Dimensions.get('window').width;


const styles = StyleSheet.create({
    loading: {
        width: width,
        height: height,
        position: 'absolute',
        top: 0,
        left: 0,
        //zIndex:9999,
        backgroundColor: 'transparent'
    }
});

export default Loader
