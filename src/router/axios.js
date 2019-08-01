/**
 * 全站http配置
 *
 * header参数说明
 * serialize是否开启form表单提交
 * isToken是否需要token
 */
import axios from 'axios'
import store from '@/store/';
import router from '@/router/router'
import { serialize } from '@/util/util'
import { getToken } from '@/util/auth'
import { Message } from 'element-ui'
import website from '@/const/website';
import {baseUrl} from '@/config/env'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
axios.defaults.timeout = 10000;
//返回其他状态码
axios.defaults.validateStatus = function(status) {
    return status >= 200 && status <= 500; // 默认的
};
//设置基地址
axios.defaults.baseURL =baseUrl;
//跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
//jquery在执行post请求时，会设置Content-Type为application/x-www-form-urlencoded，所以服务器能够正确解析，
// 而使用原生ajax、axios请求时，如果不显示的设置Content-Type，那么默认是text/plain，这时服务器就不知道怎么解析数据了
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';//经测试，此行并没有起作用，可以在具体的api中设置如：header:{'Content-Type':'application/x-www-form-urlencoded'}
// NProgress Configuration
NProgress.configure({
    showSpinner: false
});
//HTTPrequest拦截
axios.interceptors.request.use(config => {
    NProgress.start() // start progress bar
    const isToken = (config.data || {}).isToken === false
    if (getToken() && !isToken) {
        config.headers['Authorization'] = getToken()                                // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
    }
    //在具体api的headers中配置serialize为true如：headers: {'serialize':true}，则通过下面if代码块可以开启序列化
    //Content-Type也会被设置成application/x-www-form-urlencoded
    if (config.method==='post'||config.method==='put') {
        config.data = serialize(config.data);
        delete config.data.serialize;
    }
    return config
}, error => {
    return Promise.reject(error)
});
//HTTPresponse拦截
axios.interceptors.response.use(res => {
    NProgress.done();
    const status = Number(res.status) || 200;
    const statusWhiteList = website.statusWhiteList || [];
    const message = res.data.msg|| '未知错误';
    //如果请求为200则放过，否者默认统一处理,或者在website中配置statusWhiteList白名单自行处理
    if (status !== 200 && !statusWhiteList.includes(status)) {
        Message({
            message: message,
            type: 'error'
        })
        //return Promise.reject(new Error(message))
    }
    //如果是401则跳转到登录页面
    if (status === 401) store.dispatch('FedLogOut').then(() => router.push({ path: '/login' }));
    // 如果是白名单类型放入catch自行处理
    if (status !== 200) return Promise.reject(res);
    return res;
}, error => {
    console.log(error);
    NProgress.done();
    return Promise.reject(new Error(error));
})

export default axios;