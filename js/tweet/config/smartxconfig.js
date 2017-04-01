/**
 * 配置
 * Created by Jeepeng on 16/4/22.
 */

const server = 'https://www.kpi365.com:8443';  // 非80端口请配置在url后面
//const server = 'http://192.168.30.239:8080';  // 非80端口请配置在url后面
const appCode = 'aolc';

export default {
  webapi: {
    // 服务,纯接口
    service: `${server}/smartx/webapi/service/${appCode}/`
  },

  app: {
    js: {
      // js打包的版本
      version: '1'
    }
  }
};
