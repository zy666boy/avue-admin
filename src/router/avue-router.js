let RouterPlugin = function() {                         //js通过函数创建对象(详情见js创建函数的几种方式)
    this.$router = null;
    this.$store = null;
};
RouterPlugin.install = function(router, store) {
    this.$router = router;
    this.$store = store;

    function objToform(obj) {                   //把对象转成&连接的键值对字符串
        let result = [];
        Object.keys(obj).forEach(ele => {
            result.push(`${ele}=${obj[ele]}`);             //obj["str"]能取出obj对象键str所对应的值,${}能融入字符串
        })
        return result.join('&');                            //数组转字符串,各元素用'&'隔开
    }
    this.$router.$avueRouter = {                            //给router添加属性$avueRouter
        //全局配置
        $website: this.$store.getters.website,              //最终这段代码会在vue实例中因此可以做这样使用(因为router会在vue实例中)
        routerList: [],
        group: '',
        safe: this,
        // 设置标题
        setTitle: function(title) {
            title = title ? `${title}——Avue 通用管理 系统快速开发框架` : 'Avue 通用管理 系统快速开发框架';     //${}能融入字符串
            document.title = title;
        },
        closeTag: (value) => {
            const tag = value || this.$store.getters.tag;
            this.$store.commit('DEL_TAG', tag)
        },
                                                                                    //处理路由,对于指向第三方网站的路由，使其在iframe中打开
        getPath: function(params) {
            let { src } = params;
            let result = src || '/';
            if (src.includes("http") || src.includes("https")) {
                result = `/myiframe/urlPath?${objToform(params)}`;
            }
            return result;
        },
        //正则处理路由
        vaildPath: function(list, path) {
            let result = false;
            list.forEach(ele => {
                if (new RegExp("^" + ele + ".*", "g").test(path)) {
                    result = true
                }

            })
            return result;
        },
        //设置路由值
        getValue: function(route) {
            let value = "";
            if (route.query.src) {
                value = route.query.src;
            } else {
                value = route.path;
            }
            return value;
        },
        //动态路由(根据获取的菜单加载动态路由)
        //加载动态路由的调用有两处，一处是@page/index/siderbar/siderbarItem
        // 另一处是在router.js
        formatRoutes: function(aMenu = [], first) {                                      //first为是否为一级路由，即是否为第一次调用formatRoutes而不是在递归调用！
            const aRouter = []
            const propsConfig = this.$website.menu.props;                                //获取此网站规定的菜单格式
            const propsDefault = {
                label: propsConfig.label || 'label',
                path: propsConfig.path || 'path',
                icon: propsConfig.icon || 'icon',
                children: propsConfig.children || 'children',
                meta: propsConfig.meta || 'meta',
            }
            if (aMenu.length === 0) return;
            for (let i = 0; i < aMenu.length; i++) {
                const oMenu = aMenu[i];
                if (this.routerList.includes(oMenu[propsDefault.path])) return;
                const path = (() => {
                        if (first) {
                            return oMenu[propsDefault.path].replace('/index', '')   //如果映射路径上还有'/index'则去除,因为在store/user.js内进行了addPath处理，
                                                                                    // 此时菜单路径(path)已对应路由路径
                        } else {
                            return oMenu[propsDefault.path]
                        }
                    })(),                                                           //（function fn1(){}）(),中的函数会被立即调用
                    component = oMenu.component,
                    name = oMenu[propsDefault.label],
                    icon = oMenu[propsDefault.icon],
                    children = oMenu[propsDefault.children],
                    meta = oMenu[propsDefault.meta];

                const isChild = children.length !== 0;                               //是否还有子菜单
                const oRouter = {                                                   //每个菜单选项对应的路由都是嵌套路由，直接映射的组件是主页框架(@/page/index)
                                                                                    // 嵌套映射的才是菜单选项对象属性component所对应的组件。(详情见avue-route.js举的例子)
                    path: path,
                    component(resolve) {                                 //路由懒加载
                        // 判断是否为首路由
                        if (first) {
                            require(['../page/index'], resolve)                    //该组件是主页框架(@/page/index)
                            return
                            // 判断是否为多层路由
                        } else if (isChild && !first) {
                            require(['../page/index/layout'], resolve)
                            return
                            // 判断是否为最终的页面视图
                        } else {
                            require([`../${component}.vue`], resolve)
                        }
                    },
                    name: name,
                    icon: icon,
                    meta: meta,
                    redirect: (() => {
                        if (!isChild && first) return `${path}/index`
                        else return '';
                    })(),
                    // 处理是否为一级路由
                    children: !isChild ? (() => {
                        if (first) {
                            oMenu[propsDefault.path] = `${path}/index`;
                            return [{
                                component(resolve) { require([`../${component}.vue`], resolve) },
                                icon: icon,
                                name: name,
                                meta: meta,
                                path: 'index'
                            }]
                        }
                        return [];
                    })() : (() => {
                        return this.formatRoutes(children, false)                               //看清此处为false!!!
                    })()
                }
                aRouter.push(oRouter)
            }
            if (first) {
                if (!this.routerList.includes(aRouter[0][propsDefault.path])) {
                    this.safe.$router.addRoutes(aRouter)                                              //把生成的路由表动态添加进路由内
                    this.routerList.push(aRouter[0][propsDefault.path])
                }
            } else {
                return aRouter
            }

        }
    }
}
export default RouterPlugin;