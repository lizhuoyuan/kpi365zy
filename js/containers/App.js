import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import styles from '../styles/style'
import { addTodo, completeTodo, setVisibilityFilter, VisibilityFilters } from '../action/actions'
import {View,TouchableHighlight,Text,TextInput} from 'react-native'
import Login from '../components/Login'
import Home from '../components/Home'
class App extends Component {
  render(){
      let  token = this.props.loginMsg.token
      let isSuccessLogin  = false
      if(token !== undefined && token != null && token != ""){
        isSuccessLogin = true
      }
    return (
      <View style={{flex:1}}>
        {!isSuccessLogin &&
        <Login {...this.props}></Login>
        }
        {isSuccessLogin &&
          <Home {...this.props}/>
        }
      </View>
      )
  }
}

function select(state) {
  return state
}
export default connect(select)(App)
