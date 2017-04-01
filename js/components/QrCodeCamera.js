/**
 * 二维码扫描页
 * Created by yuanzhou on 17/01.
 */
'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import Camera from 'react-native-camera';
import QrCodeShow from './QrCodeShow'
import {updatePage} from '../actions'
import TopBar from './common/TopBar'
class QrCodeCamera extends Component {
  render() {
    return (
      <View style={styles.container}>
       <TopBar toback={this.toback.bind(this)} 
         layoutStyle={this.props.layoutStyle} 
         topBarText={"二维码扫描🔎"} 
         topBarTextBottomShow={false} 
         topBarTextRight="" 
         showRight={false} 
         showLeft={true}
         />
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          onBarCodeRead={this.getQRCode.bind(this)}
         // type={Camera.constants.Type.front}
         // barCodeTypes={["qr"]}
          >
         
        </Camera>
      </View>
    );
  }
  toback(){
    this.props.navigator.pop();
  }
  getQRCode(result,bounds){

    let that = this;
   // alert(JSON.stringify(result))
    if(result !== undefined && result !== null){
      if(result.type === "QR_CODE" || result.type === "org.iso.QRCode"){
          let route = {
            name:"QrCodeShow",
            index:2,
            component:QrCodeShow,
            path:null,
            type:"QrCodeShow"
          }
          let obj = {
            route:route,
            toBack:false,
            needInitUpdate:-1,
            qrResult:result.data
          }
          updatePage(that.props.dispatch,obj);
      }
    }

  }

  takePicture() {
    console.log(this.camera.onBarCodeRead)
    this.camera.capture()
      .then((data) => console.log(data))
      .catch(err => console.error(err));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop:70,
    //height: Dimensions.get('window').height - 70 - 55,
    //width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});
/*
import React, { Component, PropTypes } from 'react'
import {ART,View,Text,Slider,TouchableHighlight,TextInput,StyleSheet,Image,Dimensions} from 'react-native'
var RNFS = require('react-native-fs');

//const {Surface,Text,Path,Shape} = ART

const Tab_Second = React.createClass({
  getInitialState(){
    return {
      filePaths:[]
    }
  },
  makeDir(){
    var path = RNFS.MainBundlePath + '/bundle/download/images';
   
    RNFS.mkdir(path)
      .then((success)=>{
        console.log("success");
      }).catch((err)=>{
         console.log(err.message);
      });
  },
  exists(){
    this.makeDir();
    var path = RNFS.MainBundlePath + '/bundle/download/images/';
    let  url = "http://192.168.30.160:8080/smartx/document/static/F1481605819758vAxr/N1481777067220zDAta9N2.JPG";
    let  urls = url.split("\/");
    let that = this;
    if(urls.length > 0){
      path += urls[urls.length-1];
      RNFS.exists(path)
        .then((success)=>{
            if(success){

            }else{
              that.download(url,path);
            }
        }).catch((err)=>{
           console.log("err:"+err.message);
        })
    }
  },
  downLoad(fromUrl,toFile){
   // var path = RNFS.MainBundlePath + '/bundle/download/images/';
    let  DownloadFileOptions = {
         fromUrl: fromUrl,
          toFile: toFile,         // Local filesystem path to save the file to
    };
    RNFS.downloadFile(DownloadFileOptions).promise.then((response) => {
                  if (response.statusCode == 200) {
                    console.log('FILES UPLOADED!'); // response.statusCode, response.headers, response.body
                  } else {
                    console.log('SERVER ERROR');
                  }
                })
                .catch((err) => {
                  if(err.description === "cancelled") {
                    // cancelled by user
                  }
                  console.log(err);
                });

  },
  createDir(){
    // create a path you want to write to
    this.makeDir();
    var path = RNFS.MainBundlePath + '/bundle/download/images/test.txt';
    // write the file
    RNFS.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8')
      .then((success) => {
        console.log('FILE WRITTEN!');
      })
      .catch((err) => {
        console.log(err.message);
      });
  },
  
  readDir(){
    // get a list of files and directories in the main bundle
    console.log(RNFS.MainBundlePath)
  RNFS.readDir(RNFS.MainBundlePath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    .then((result) => {
      console.log('GOT RESULT', result);

      // stat the first file
      return Promise.all([RNFS.stat(result[0].path), result[0].path]);
    })
    .then((statResult) => {
      if (statResult[0].isFile()) {
        // if we have a file, read it
        return RNFS.readFile(statResult[1], 'utf8');
      }

      return 'no file';
    })
    .then((contents) => {
      // log the file contents
      console.log(contents);
    })
    .catch((err) => {
      console.log(err.message, err.code);
    });
  },
  render(){
    return (
        <View>
          <TouchableHighlight style={{marginTop:50,flex:1,height:50,width:300}} onPress={this.readDir}>
            <Text>显示文件</Text>
          </TouchableHighlight>
           <TouchableHighlight style={{marginTop:50,flex:1,height:50,width:300}} onPress={this.createDir}>
            <Text>创建并写入文件</Text>
          </TouchableHighlight>
          <TouchableHighlight style={{marginTop:50,flex:1,height:50,width:300}} onPress={this.makeDir}>
            <Text>创建文件夹</Text>
          </TouchableHighlight>
           <TouchableHighlight style={{marginTop:50,flex:1,height:50,width:300}} onPress={this.downLoad}>
            <Text>下载</Text>
          </TouchableHighlight>
          <TouchableHighlight style={{marginTop:50,flex:1,height:50,width:300}} onPress={this.exists}>
            <Text>是否存在</Text>
          </TouchableHighlight>
          
        </View>
      )
  }
});*/


/*class Tab_Second extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starCount: 0,
      starCount: 2,
      starCount: 3,
      starCount: 4,
      sliderValue:0
    };
  }
    render(){
          //<Image><Text stroke="#000" strokeWidth={1} font="bold 20px Heiti SC" path={new Path().moveTo(250,250).lineTo(150,250)}>{'1.assaafas发发发发说'}</Text>      
    
          const path = ART.Path()
          path.moveTo(100,100).arc(0,99,25).arc(0,-99,25).close()
          //.lineTo(0,120)
        //  let x = 100
         // let y = 100
          for(let i = 0; i < 360; i = i + 20){
            let y = 0
            //if(i >= 180){
               y =  150+50*Math.sin(i * 3.14 / 180) + 40
           // }else{
             //  y =  150+50*Math.sin(i * 3.14 / 180) -40
        //
           // }
              path.moveTo(100 + 50*Math.cos(i * 3.14 / 180),150+50*Math.sin(i * 3.14 / 180)).lineTo(100 + 50*Math.cos(i * 3.14 / 180)+40,y)
          }
          const path2 = ART.Path()
          path.moveTo(10,400);
          path.lineTo(200,400);
          path.moveTo(10,400);
          path.lineTo(10,200);

          path2.moveTo(42,360).arc(50,16,25).arc(34,16,25).close();
          //path2.lineTo(20,380)

         return(
        <View style={styles.container}>
          <Surface width={800} height={800}>
          <Shape d={path} stroke="blue" strokeWidth={1}>
          </Shape>
          <Shape d={path2} stroke="black" strokeWidth={1}>
          </Shape>
            </Surface>
        </View>
      )
    }
}*/
/*const styles = StyleSheet.create({
  tab:{
    position:'absolute',
    bottom:0,
    height:45
  },
  container:{
    flex:1,
    //alignItems:'center',
    //justifyContent:'center'
  },
  image:{
    borderRadius:55,
    width:25,
    height:25
  },
  text:{
    fontWeight:'700',
    fontSize:30
  }
});*/
export default QrCodeCamera
