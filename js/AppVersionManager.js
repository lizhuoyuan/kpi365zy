/**
 * App版本管理器
 * Created by Jeepeng on 16/7/11.
 */

import {
        Platform , 
        Linking ,
        Alert ,
} from 'react-native'
import codePush from 'react-native-code-push'

import http from './utils/http'
import config from './config'

export default {

    api: {
        upgrade: 'http://'
    },

    /**
     * 检查bundle更新
     */
    update() {
        codePush && codePush.sync({
            updateDialog: {
                appendReleaseDescription: true,
                descriptionPrefix: "\n\n更新日志:\n",
                optionalIgnoreButtonLabel: '忽略',
                optionalInstallButtonLabel: '安装',
                optionalUpdateMessage: '发现增量更新包,是否更新?',
                title: '增量更新'
            },
            installMode: codePush.InstallMode.IMMEDIATE
        });
    },

    /**
     * 检查App是否有更新
     */
    /*upgrade() {
        let platform = Platform.OS;
        http.post(config.webapi.service.upgrade, {platform: platform})
            .then(json => {
                if(json.code === 'OK') {
                    let result = json.datas.results[0][platform];
                    // 判断是否需要更新
                    if(result.versionCode > config.app[platform].versionCode) {
                        let changelog = (result.changelog || '').replace('\\n','\n');
                        Linking.canOpenURL(result.url).then(supported => {
                            if(supported) {
                                Alert.alert(
                                    '版本更新',
                                    changelog,
                                    [
                                        {text: '稍后再说', onPress: () => {}, style: 'cancel'},
                                        {text: '去下载', onPress: () => Linking.openURL(result.url)},
                                    ]
                                );
                            }
                        });
                    }
                }
            })
            .catch(err => {
                //console.log(err);
            });
    }*/
};