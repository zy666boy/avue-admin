/**
 * 全站路由配置
 *
 * meta参数说明
 * keepAlive是否缓冲页面
 * isTab是否加入到tag导航
 * isAuth是否需要授权
 */
import VueRouter from 'vue-router';
import PageRouter from './page/'
import ViewsRouter from './views/'
import AvueRouter from './avue-router';
import Store from '../store/';
let Router = new VueRouter({
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            if (from.meta.keepAlive) {
                from.meta.savedPosition = document.body.scrollTop;
            }
            return {
                x: 0,
                y: to.meta.savedPosition || 0
            }
        }
    },
    routes: []
});
AvueRouter.install(Router, Store);  //模仿vue.use会调用相应插件的install方法，这里直接调用插件的install方法，然后对相应组件
Router.$avueRouter.formatRoutes(Store.state.user.menu, true);                 //另一处加载动态路由在@page/index/siderbar/siderbarItem
Router.addRoutes([...PageRouter, ...ViewsRouter]);
export default Router;