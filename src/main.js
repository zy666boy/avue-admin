import Vue from 'vue';
import axios from './router/axios';
import VueAxios from 'vue-axios';
import App from './App';
import router from './router/router';
import './permission'; // 权限
import './error'; // 日志
import 'avue-plugin-transfer/packages' //引入avue-plugin-transfer插件
// import 'avue-plugin-ueditor/packages' //引入avue-plugin-ueditor插件(如果要兼容ie自行换掉富文本编辑器，此款插件不兼容ie)
import store from './store';
import { loadStyle } from './util/util'
import * as urls from '@/config/env';
import {
    iconfontUrl,
    iconfontVersion
} from '@/config/env';
import * as filters from './filters' // 全局filter
import './styles/common.scss';
// 引入avue的包
import Avue from '@smallwei/avue';
// 引入avue的样式文件
import '@smallwei/avue/lib/theme-chalk/index.css';

// //源文件包
// import './packages/index.js';
// import './packages/theme-chalk/src/index.scss';

import basicContainer from './components/basic-container/main'
import VueClipboard from 'vue-clipboard2'
// 插件 json 展示
import vueJsonTreeView from 'vue-json-tree-view'


Vue.use(router)                                     //转变以前错误的思维(调用use之后，一些模块使用时不再引入！)，vue.use()，仅仅就是调用相应插件的install方法，
                                                    // install中会给vue全局注册一些组件，选项，以及原型属性，在vue实例之外使用这些模块还需要另外引入！
Vue.use(VueClipboard)

Vue.use(vueJsonTreeView)

Vue.use(Avue);

Vue.use(VueAxios, axios)
//注册全局容器
Vue.component('basicContainer', basicContainer)
    // 加载相关url地址
Object.keys(urls).forEach(key => {
    Vue.prototype[key] = urls[key];
})

// 加载过滤器
Object.keys(filters).forEach(key => {
        Vue.filter(key, filters[key])
    })
    // 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
    loadStyle(iconfontUrl.replace('$key', ele));
})

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)                                     //为什么这个地方用的时候没有进行组件注册
}).$mount('#app')