import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import common from './modules/common'
import tags from './modules/tags'
import logs from './modules/logs'
import getters from './getters'

Vue.use(Vuex)//即使在这调用use,也是在创建vue实例之前调用
const store = new Vuex.Store({
    modules: {
        user,
        common,
        logs,
        tags
    },
    getters,                                                    //为什么getters和modules分开写？
})

export default store