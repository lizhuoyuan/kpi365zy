/**
 * Created by Administrator on 2016-05-04.
 */

'use strict';

import { Dimensions } from 'react-native';
import CustomStyle from '../styles';
import DeviceInfo from 'react-native-device-info';

let _Msgs = {
    MSG_REQUIRED: '是必填项'
};

let utils = {
    composeMsgRequired(widgetTitle) {
        return `${widgetTitle}:${_Msgs.MSG_REQUIRED}`;
    },
    validateByEL(expr, value) {
        let el = new RegExp(expr);
        if(!value){
            //null, undefine return true;(use required to validate)
            return true;
        }

        if(typeof value === 'string'){
            return el.test(value);
        }

        return el.test(value.toString());
    },

    validateRequired(value) {
        if(!value){
            return false;
        }

        if(typeof value === 'string' || value.constructor === Array){
            return value.length > 0;
        }

        return true;
    },

    /**
     * 根据服务器下发的class获取自定义的style
     * @param classNames className,多个以空格分开
     * @returns {{root: Array, extra: {}}}
     */
    getCustomStyle(classNames = '') {
        let custom = {
            root: [],
            extra: {}
        };
        if(!classNames) {
            return custom;
        }
        classNames = classNames.replace(/(^\s*)|(\s*$)/g,''); // 去掉前后空格
        if(classNames.length > 0) {
            let styleNames = classNames.split(' ');
            for(let name of styleNames) {
                //name = name.replace('-', '_'); // `-`转成下划线`_`
                let customStyleObject = Object.assign({}, CustomStyle[name]);
                if(CustomStyle[name]) {
                    let extra = customStyleObject.extra;
                    if(extra) {
                        for(let key of Object.keys(extra)) {
                            // 可能传入多个classNames,需要合并extra
                            if(typeof extra[key] !== 'object') {
                                // 一些不是object的extra(如placeholderTextColor),以最后一个为准(覆盖)
                                custom['extra'][key] = extra[key];
                            } else {
                                custom['extra'][key] = Object.assign({}, custom['extra'][key] || {}, extra[key]);
                            }
                        }
                        delete customStyleObject.extra;
                    }
                    custom['root'].push(customStyleObject);
                }
            }
        }
        return custom;
    },
    /**
     * 实现对象深度复制（主要用于复制服务器下发的各种页面数据）
     * 复制对象应该没有function，date等类型
     * 详细参考 http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-an-object
     */
    deepCopy(srcObject){
      if(srcObject){
        return JSON.parse(JSON.stringify(srcObject));
      }

      return null;
    },

    /**
     * 获取屏幕大小
     * @returns {{height, width}}
     */
    getScreenSize() {
        let {height, width} = Dimensions.get('window');
        return { height, width };
    },

    /**
    *获取设备信息
    */
    getDeviceInfo(){
      return {
        UniqueID:this.getDeviceInfoItem('UniqueID'),
        Manufacturer:this.getDeviceInfoItem('Manufacturer'),
        Model:this.getDeviceInfoItem('Model'),
        DeviceId:this.getDeviceInfoItem('DeviceId'),
        SystemName:this.getDeviceInfoItem('SystemName'),
        SystemVersion:this.getDeviceInfoItem('SystemVersion'),
        BundleId:this.getDeviceInfoItem('BundleId'),
        BuildNumber:this.getDeviceInfoItem('BuildNumber'),
        Version:this.getDeviceInfoItem('Version'),
        ReadableVersion:this.getDeviceInfoItem('ReadableVersion'),
        DeviceName:this.getDeviceInfoItem('DeviceName'),
        UserAgent:this.getDeviceInfoItem('UserAgent'),
        DeviceLocale:this.getDeviceInfoItem('DeviceLocale'),
        DeviceCountry:this.getDeviceInfoItem('DeviceCountry'),
        InstanceID:this.getDeviceInfoItem('InstanceID')
      }
    },

    getDeviceInfoItem(key){
      try{
        //invoke DeviceInfo.getUniqueID()
        return DeviceInfo['get' + key]();
      }catch(e){
        return "";
      }
    }
};

export default utils;
