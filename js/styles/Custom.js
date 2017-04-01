/**
 * 项目自定义样式在这里写,即以前web版自定义的css如: doctorz.css
 * 列表(ListView)的Item的样式名为 {lisiew.id}_{item.name}
 * Created by Jeepeng on 16/4/24.
 */

import {Dimensions} from 'react-native';
var deviceHeight = Dimensions.get('window').height;
var deviceWidth = Dimensions.get('window').width;

//iconbutton

let navberRight = {
    flexDirection: 'row-reverse',
    extra: {
        icon: {
            paddingRight: 10,
            fontSize:16,
        },
        text: {
            paddingRight:3,
            fontSize:16,
        },
    }
};

let navberLeft = {
    paddingLeft: 10,
    extra: {
        icon: {
            fontSize:16,
        },
        text: {
            fontSize:16,
        },
    }
};

let iconbutton = {
    flexDirection: 'row-reverse',
    extra: {
        icon: {
            color: "#adb1b7",
            marginLeft: 10,
        },
        text: {
            color: "#adb1b7",

        },
    }
};

let iconcontainer = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 10,
};

//button
let buttoncss = {
    backgroundColor: '#00a8c6',
    borderRadius: 8,
    borderColor: '#ffffff',
    height: 44,
    marginBottom: 10,
};


//list
let listimage = {
    width: 50,
};

let listimagecss = {
    height: 40,
    width: 40,
    borderRadius: 20,
    // borderWidth: 1,
    // borderColor: '#efeff4',
};

let listtext = {
    width: deviceWidth - 50,
    paddingRight: 25,
};

let listtexttopcss = {
    fontSize: 16,
    marginBottom: 3,
};

let listtextdowncss = {
    color: "#c0c0c0",
    fontSize: 14,
};

//resourcelist
let resourcelistitem={
    flexDirection: 'row',
    justifyContent: 'center',
};

let resourcelistimage ={
    backgroundColor: '#ffffff',
    padding: 10,
};

let resourcelistimagecss ={
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#efeff4',
};

let resourcelistinformation = {
    padding: 10,
    backgroundColor: '#ffffff',
    width: deviceWidth - 86,
    paddingLeft: 0,
};

let resourcelistinformationtopcss ={
    fontSize: 16,
    marginBottom: 10,
};

let resourcelistinformationdowncss ={
    fontSize: 12,
    color: '#c0c0c0',
};

export default {

    /*
     * 统一navber样式
     * */

    "navberRight": navberRight,
    "navberLeft": navberLeft,
    /**
     * 统一字体
     **/
     "commonIOSFontFamily":{
        //fontFamily:"Hiragino Sans GB W3"
        
     },
    /**
     * 控件以行的方式排列
     **/
    rowView:{
      flexDirection:'row',
      flex:1,
    },
    /**
     * 控件居右排列
     **/
    rightView:{
        alignItems:'flex-end',
        flex:1,
    },
    /**
     * 控件居左排列
     **/
    leftView:{
      alignItems:'flex-start',
      flex:1,
    },
    /**
     * 控件居中排列
     **/
    centerView:{
        alignItems:"center",
        flex:1,
    }
}
