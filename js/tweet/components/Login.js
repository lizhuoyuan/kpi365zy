/**
 * Created by Jeepeng on 16/9/8.
 */

'use strict';

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  Text,
  TouchableHighlight,
} from 'react-native';
import { BlurView, VibrancyView } from 'react-native-blur';
import { Actions } from 'react-native-router-flux';

import { Button, Input } from '../components/base';
import { login } from '../actions/actionCreators';
import utils from '../utils/utils';

const background = require('../../assets/background.jpg');

class Login extends Component {

  constructor() {
    super();

    this.state = {
      username: 'dian_user_5',
      password: 'password'
    };
  }

  _onPress() {
    Actions.tweets();
    //this.props.dispatch(login('121','121'));
  }

  render() {
    return (
      <Image source={background} style={styles.container}>
        <BlurView
          style={styles.blur}
          blurRadius={0.1}
          downsampleFactor={1}
          blurType="light" >
          <View style={styles.contentContainer}>
            <Input
              style={styles.input}
              inputStyle={styles.inputStyle}
              icon="ios-person"
              iconStyle={styles.iconStyle}
              onChangeText={(username) => this.setState({username})}
              value={this.state.username}
              placeholder="请输入账号"
              placeholderTextColor="rgba(255,255,255,0.35)"
            />
            <Input
              style={styles.input}
              inputStyle={styles.inputStyle}
              icon="md-lock"
              iconStyle={styles.iconStyle}
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
              secureTextEntry={true}
              placeholder="请输入密码"
              placeholderTextColor="rgba(255,255,255,0.35)"
            />
            <Button
              style={styles.btnLogin}
              activeOpacity={0.5}
              title="登录"
              titleStyle={styles.txtLogin}
              onPress={this._onPress.bind(this)} />
          </View>
        </BlurView>
      </Image>
    );
  }
}

const { height, width } = utils.getScreen();

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    height: height,
    width: width
  },
  contentContainer: {
    flex: 1,
    margin: 20,
    justifyContent: 'center',
  },
  blur: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  input: {
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 0,
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  inputStyle: {
    color: 'rgba(255,255,255,0.9)',
  },
  iconStyle: {
    color: 'rgba(255,255,255,0.6)',
  },
  btnLogin: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255, 0.6)',
    borderRadius: 18
  },
  txtLogin: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: 'bold',
  }
});

export default Login;
