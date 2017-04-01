/**
 * url处理，解决android不支持https
 * create by yuanzhou 2017/03/21
 */
import {Platform} from 'react-native'

/**
 * 进行url处理
 * @param url
 * @returns {*}
 */
export function handleUrl(url) {
    if (url) {
        if (url.indexOf('http') === 0) {
            return url;
        }
    }
    return null;
}