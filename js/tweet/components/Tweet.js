/**
 * Created by Jeepeng on 2016/12/6.
 */

import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  StatusBar,
  View,
  InteractionManager,
  KeyboardAvoidingView,
  Image,
  Text,
  TextInput,
  Modal,
  TouchableHighlight,
  TouchableNativeFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';
import {createAction} from 'redux-actions';
import { NavBar, TouchableView, Dialog } from './base';
import { PREPARE_TWEET_CONTENT } from '../actions/actionTypes';
import {createTweet, fetch} from '../actions/actionCreators';

import Editor from '../lib/Editor';
import AtList from './AtList';
import images from '../config/images';

class Tweet extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showDialog: false,
      autoTrigger: true,
      showCategoryDialog: false,
      category: {
        label: '全部可见',
        value: 'world',
      }
    };
  }

  _renderLeft() {
    return (
      <TouchableView
        style={styles.navBarBtn}
        onPress={Actions.pop}>
        <Image style={{width: 22, height: 22}} source={images.nav_back} />
      </TouchableView>
    );
  }

  _renderTitle() {
    return <Text style={styles.title}>发动态</Text>;
  }

  _renderRight() {
    return (
      <TouchableView
        style={styles.navBarBtn}
        onPress={this._send.bind(this)}>
        <Image style={{width: 22, height: 22}} source={images.nav_send} />
      </TouchableView>
    );
  }

  _send() {
    let draft = this.props.dataStore.draft;
    if (draft.content.text) {
      InteractionManager.runAfterInteractions(() => {
        this.props.dispatch(createTweet(draft, this.state.category.value));
      });
      Actions.pop();
    }
  }

  _onChangeText(text) {
    this.props.dispatch(createAction(PREPARE_TWEET_CONTENT)({
      content: { text },
      notices: [],
      view: []
    }));
    if (text && text.charAt(text.length - 1) === '@') {
      this.setState({
        autoTrigger: true,
        showDialog: true
      });
    }
  }

  _onPressAt() {
    this.setState({
      autoTrigger: false,
      showDialog: true
    });
  }

  _toggleAtList() {
    this.setState({
      showDialog: !this.state.showDialog
    });
  }

  _toggleCategoryDialog() {
    this.setState({
      showCategoryDialog: !this.state.showCategoryDialog
    });
  }

  _onSelectUser(data) {
    let prefix = this.state.autoTrigger ? '' : '@';
    let atText = `${prefix}${data.name}`;
    let { draft } = this.props.dataStore;
    let newTweet = {
      notices: [data.id],
      content: {
        text: `${draft.content.text}${atText} `
      },
      view: []
    };
    this.props.dispatch(createAction(PREPARE_TWEET_CONTENT)(newTweet));
    this._editor.focus();
    this._toggleAtList();
  }

  _onSelectCategory(category) {
    let { draft } = this.props.dataStore;
    let newTweet = {
      ...draft,
      notices: [],
      view: [category.value]
    };
    this.setState({
      category: category,
      showCategoryDialog: false
    });
    this.props.dispatch(createAction(PREPARE_TWEET_CONTENT)(newTweet));
  }

  renderText(matchingString, matches) {
    let pattern = /@[^@^\s]+\s/i;
    let match = matchingString.match(pattern);
    return `${match[0]}`;
  }

  render() {
    let { draft, tweets } = this.props.dataStore;
    let parse = [
      {type: 'url', style: {color: 'blue'}, renderText: url => `${url} `},
      {
        pattern: /@[^@^\s]+\s/i, style: {color: 'blue'}, renderText: this.renderText
      },
      {
        pattern: /#\S+#/g, style: {color: 'blue'}
      },
    ];
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#37aaf1"
          barStyle="light-content"
        />
        <NavBar
          style={{backgroundColor: '#37aaf1'}}
          renderLeftComponent={this._renderLeft.bind(this)}
          renderTitle={this._renderTitle}
          renderRightComponent={this._renderRight.bind(this)}/>
        <KeyboardAvoidingView behavior="padding" style={styles.wrapper}>
          <Editor
            style={styles.input}
            autoFocus={true}
            ref={editor => this._editor = editor}
            numberOfLines={15}
            placeholder="说点什么"
            parse={parse}
            autoCapitalize="none"
            autoCorrect={false}
            dataDetectorTypes="none"
            value={draft.content.text}
            onChangeText={this._onChangeText.bind(this)} />
          <View style={styles.tool}>
            <TouchableView style={styles.atButton} onPress={this._onPressAt.bind(this)}>
              <Icon size={18} color={'#888'} name="ios-at-outline"/>
              <Text style={{marginLeft: 3, fontSize: 16, color: '#888'}}>提醒</Text>
            </TouchableView>
            <TouchableView onPress={this._toggleCategoryDialog.bind(this)}>
              <View style={styles.group}>
                <Image style={{width: 16, height: 16}} source={this.state.category.value === 'world' ? images.range_all : images.range_country} />
                <Text style={{marginLeft: 3, fontSize: 16, color: '#1da9fc'}}>{this.state.category.label}</Text>
              </View>
            </TouchableView>
          </View>
          <Modal
            animationType={'slide'}
            onRequestClose={this._toggleAtList.bind(this)}
            visible={this.state.showDialog}>
            <NavBar
              leftTitle="取消"
              style={{backgroundColor: '#37aaf1'}}
              onLeft={this._toggleAtList.bind(this)}
              titleStyle={{color: '#fff'}}
              title="选择要@的人" />
            <AtList {...this.props} onPress={this._onSelectUser.bind(this)} />
          </Modal>
          <Dialog onClose={this._toggleCategoryDialog.bind(this)} visible={this.state.showCategoryDialog}>
            {
              tweets.extra.categories.map((category) => {
                const checked = this.state.category.value === category.value;
                return (
                  <TouchableView onPress={this._onSelectCategory.bind(this, category)} key={category.value} style={{borderRadius: 5, alignItems: 'center', borderBottomWidth: 1, borderColor: '#efefef', padding: 10,}}>
                    <Text>{category.label} {checked ? '*' : null}</Text>
                  </TouchableView>
                );
              })
            }
          </Dialog>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  navBarBtn: {
    height: 44,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: '#fff',
    fontSize: 16
  },
  wrapper: {
    flexGrow: 1,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlignVertical: 'top'
  },
  tool: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f2f2f2'
  },
  atButton: {
    marginLeft: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  group: {
    marginRight: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  }
});

export default Tweet;
