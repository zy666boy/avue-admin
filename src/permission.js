/**
 * 全站权限配置
 * 
 */
import router from './router/router'
import store from './store'
import { validatenull } from '@/util/validate'
import { getToken } from '@/util/auth'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({ showSpinner: false });
const lockPage = store.getters.website.lockPage; //锁屏页
router.beforeEach((to, from, next) => {//非常关键每次路由切换时都会触发此守卫！每次刷新页面，也会根据当前页面所在路由再次走一遍此流程(刷新页面时，程序中的数据会全部清空，
                                             // 但存在浏览器的cookie,storage等不会被清空)。

    //缓冲设置
    if (to.meta.keepAlive === true && store.state.tags.tagList.some(ele => {
            return ele.value === to.fullPath;
        })) {
        to.meta.$keepAlive = true;
    } else {
        NProgress.start()
        if (to.meta.keepAlive === true && validatenull(to.meta.$keepAlive)) {
            to.meta.$keepAlive = true;
        } else {
            to.meta.$keepAlive = false;
        }
    }
    const meta = to.meta || {};
    console.log("token:"+getToken());
    if (getToken()) {
        if (store.getters.isLock && to.path != lockPage) { //如果系统激活锁屏，全部跳转到锁屏页
            next({ path: lockPage })
        } else if (to.path === '/login') { //如果登录成功访问登录页跳转到主页
            next({ path: '/' })//会再从头走一遍钩子
        } else {
            //如果用户信息为空则获取用户信息，获取用户信息失败，跳转到登录页
            if (store.getters.roles.length === 0) {
                store.dispatch('GetUserInfo').then(() => {
                    next({...to, replace: true })
                }).catch(() => {
                    store.dispatch('FedLogOut').then(() => {
                        next({ path: '/login' })
                    })
                })
            } else {
                const value = to.query.src || to.fullPath;                      //$route.query会获得查询参数的集合（查询参数以键值对形式存在）
                const label = to.query.name || to.name;
                if (meta.isTab !== false && !validatenull(value) && !validatenull(label)) {                          //将路由添加到标签栏
                    store.commit('ADD_TAG', {
                        label: label,
                        value: value,
                        params: to.params,
                        query: to.query,
                        group: router.$avueRouter.group || []
                    });
                }
                next()//通过本钩子，执行下一个钩子
            }
        }
    } else {
        //判断是否需要认证，没有登录访问去登录页
        if (meta.isAuth === false) {
            next()
        } else {
            next('/login')
        }
    }
})

router.afterEach(() => {
    NProgress.done();
    const title = store.getters.tag.label;
    //根据当前的标签也获取label的值动态设置浏览器标题
    router.$avueRouter.setTitle(title);
});