import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router'
import store from './store/index'
import '../public/style/style.css'
import * as utils from './utils/index'//公用方法
import md5 from 'js-md5'//md5加密
import FileSaver from 'file-saver';//下载
import * as uploadFile from './utils/uploadFile'; //文件md5
import Vue2Editor from "vue2-editor";
import lodash from 'lodash'
import pagination from '@/components/pagination'
import moment from 'moment'
import math from  './utils/math.js'
/**图片,视频，音频预览 */
import viewImage from "./components/viewImage/ViewImage";
import './utils/filters.js'
import { initIm } from './utils/tim'

require('echarts/theme/macarons');

//全局过滤
Object.keys(utils).forEach(key => {
  Vue.filter(key, utils[key])
})



Vue.use(ElementUI);
Vue.use(Vue2Editor);
Vue.component('pagination', pagination);
Vue.config.productionTip = false
Vue.prototype.$utils = utils
Vue.prototype.$md5 = md5
Vue.prototype.$downLoad = FileSaver
Vue.prototype.$uploadFile = uploadFile
Vue.prototype.$math = math
Vue.prototype._= lodash
Vue.prototype.$moment = moment
Vue.prototype.$viewImage = viewImage;


Vue.prototype.$store = store;
window.store = store;
initIm()

window.$vm=new Vue({
  router,

  render: h => h(App)
}).$mount('#app')
