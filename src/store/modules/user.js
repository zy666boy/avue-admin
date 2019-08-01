import { setToken, removeToken } from '@/util/auth'
import { setStore, getStore } from '@/util/store'
import { isURL } from '@/util/validate'
import { encryption, deepClone } from '@/util/util'
import webiste from '@/const/website'
import { loginByUsername, getUserInfo, logout, RefeshToken } from '@/api/user'
import {getMenu} from '@/api/menu'
//将各个菜单所对应的路由路径补充完整，方便到时候点击菜单，直接获取菜单路径，然后调用router.push()
function addPath(ele, first) {
    const propsConfig = webiste.menu.props;
    const propsDefault = {
        label: propsConfig.label || 'label',
        path: propsConfig.path || 'path',
        icon: propsConfig.icon || 'icon',
        children: propsConfig.children || 'children'
    }
    const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0;
    if (!isChild && first) {
        ele[propsDefault.path] = ele[propsDefault.path] + '/index'
        return
    }
    ele[propsDefault.children].forEach(child => {
        if (!isURL(child[propsDefault.path])) {
            child[propsDefault.path] = `${ele[propsDefault.path]}/${child[propsDefault.path]?child[propsDefault.path]:'index'}`
        }
        addPath(child);
    })
}
const user = {
    state: {
        userInfo: {},
        permission: {},
        roles: [],
        menu: getStore({ name: 'menu' }) || [],
        token: getStore({ name: 'token' }) || '',
    },
    actions: {
        //根据用户名登录
        LoginByUsername({ commit }, userInfo) {
            //因为后端原因，暂时不对密码加密，但这样会导致在请求体的参数中暴露密码
            /*const user = encryption({
                data: userInfo,
                type: 'Aes',
                key: 'avue',
                param: ['useranme', 'password']
            });*/
            return new Promise((resolve) => {
                loginByUsername(userInfo.username, userInfo.password, userInfo.code, userInfo.redomStr).then(res => {
                    const data = res.data.data;
                    commit('SET_TOKEN', data);
                    commit('DEL_ALL_TAG');
                    commit('CLEAR_LOCK');
                    setToken(data);
                    resolve();
                })
            })
        },
        //根据手机号登录
        LoginByPhone({ commit }, userInfo) {
            return new Promise((resolve) => {
                loginByUsername(userInfo.phone, userInfo.code).then(res => {
                    const data = res.data.data;
                    commit('SET_TOKEN', data);
                    commit('DEL_ALL_TAG');
                    commit('CLEAR_LOCK');
                    setToken(data);
                    resolve();
                })
            })
        },
        GetUserInfo({ commit }) {
            return new Promise((resolve, reject) => {
                getUserInfo().then((res) => {
                    const data = res.data.data;
                    commit('SET_USERIFNO', data.userInfo);
                    commit('SET_ROLES', data.roles);
                    commit('SET_PERMISSION', data.permission)
                    resolve(data);
                }).catch(err => {
                    reject(err);
                })
            })
        },
        //刷新token
        RefeshToken({ commit }) {
            return new Promise((resolve, reject) => {
                RefeshToken().then(res => {
                    const data = res.data.data;
                    commit('SET_TOKEN', data);
                    setToken(data);
                    resolve(data);
                }).catch(error => {
                    reject(error)
                })
            })
        },
        LogOut({ commit }) {
            return new Promise((resolve, reject) => {
                logout().then(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_MENU', [])
                    commit('SET_ROLES', [])
                    commit('DEL_ALL_TAG');
                    commit('CLEAR_LOCK');
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        //前端登出，因为后端是基于jwt的无状态登录认证，所以暂时在前端清除掉token,但是这样该token在有效期内仍然可认证通过，网上有很多借助数据库或缓存来实现但这是有状态的，
        // 和session没什么区别，违背了jwt无状态的规则，所以一直没有很好的处理方案，可去helpsource里看详情
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                commit('SET_MENU', [])
                commit('SET_ROLES', [])
                commit('DEL_ALL_TAG');
                commit('CLEAR_LOCK');
                removeToken()
                resolve()
            })
        },
        //获取菜单
        GetMenu({ commit }, parentId) {
            return new Promise(resolve => {
                getMenu(parentId).then((res) => {
                    const data = res.data.data
                    let menu = deepClone(data);
                    menu.forEach(ele => {
                        addPath(ele, true);
                    })
                    commit('SET_MENU', menu)
                    resolve(menu)
                })
            })
        }
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
            setStore({ name: 'token', content: state.token, type: 'session' })
        },
        SET_USERIFNO: (state, userInfo) => {
            state.userInfo = userInfo;
        },
        SET_MENU: (state, menu) => {
            state.menu = menu
            setStore({ name: 'menu', content: state.menu, type: 'session' })
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        },
        SET_PERMISSION: (state, permission) => {
            state.permission = {};
            permission.forEach(ele => {
                state.permission[ele] = true;
            });
        }
    }

}
export default user