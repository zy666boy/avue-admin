<template>
  <div class="menu-wrapper">
    <template v-for="item in menu">                                                       <!--item[*Key]就是item对象所对应的*属性值-->
      <el-menu-item v-if="validatenull(item[childrenKey]) && vaildRoles(item)"
                    :index="item[pathKey]"
                    @click="open(item)"
                    :key="item[labelKey]"
                    :class="{'is-active':vaildAvtive(item)}">
        <i :class="item[iconKey]"></i>
        <span slot="title">{{item[labelKey]}}</span>
      </el-menu-item>                                                                     <!--上面的el-menu-item是对没有嵌套子菜单的菜单的生成策略-->
                                                                                          <!--下面的el-submenu是对有嵌套子菜单的菜单的生成策略-->
      <el-submenu v-else-if="!validatenull(item[childrenKey])&&vaildRoles(item)"
                  :index="item[pathKey]"
                  :key="item[labelKey]">
        <template slot="title">
          <i :class="item[iconKey]"></i>
          <span slot="title"
                :class="{'el-menu--display':collapse&&first}">{{item[labelKey]}}</span>     <!--class是菜单项打开时箭头的朝上或朝下-->
        </template>
        <template v-for="(child,cindex) in item[childrenKey]">
          <el-menu-item :index="child[pathKey],cindex"
                        @click="open(child)"
                        :class="{'is-active':vaildAvtive(child)}"
                        v-if="validatenull(child[childrenKey])"
                        :key="child[labelKey]">
            <i :class="child[iconKey]"></i>
            <span slot="title">{{child[labelKey]}}</span>
          </el-menu-item>
          <sidebar-item v-else
                        :menu="[child]"
                        :key="cindex"
                        :props="props"
                        :screen="screen"
                        :collapse="collapse"></sidebar-item>                               <!--针对子菜单还有子菜单的子菜单递归调用sidebar-item-->
        </template>
      </el-submenu>
    </template>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { validatenull } from '@/util/validate';
import config from './config.js'
export default {
  name: 'sidebarItem',
  data () {
    return {
      config: config
    }
  },
  props: {
    menu: {
      type: Array
    },
    screen: {
      type: Number
    },
    first: {
      type: Boolean,
      default: false
    },
    props: {
      type: Object,
      default: () => { return {} }
    },
    collapse: {
      type: Boolean
    }
  },
  created () {
  },
  mounted () { },
  computed: {
    ...mapGetters(['roles']),
    labelKey () { return this.props.label || this.config.propsDefault.label },
    pathKey () { return this.props.path || this.config.propsDefault.path },
    iconKey () { return this.props.icon || this.config.propsDefault.icon },
    childrenKey () { return this.props.children || this.config.propsDefault.children },
    nowTagValue () { return this.$router.$avueRouter.getValue(this.$route) }
  },
  methods: {
    vaildAvtive (item) {
      const groupFlag = (item['group'] || []).some(ele => this.$route.path.includes(ele));
      return this.nowTagValue === item[this.pathKey] || groupFlag
    },
    vaildRoles (item) {                                                                 //验证用户是否拥有该菜单选型所需要的角色
      item.meta = item.meta || {};
      return item.meta.roles ? item.meta.roles.includes(this.roles) : true
    },
    validatenull (val) {
      return validatenull(val);
    },
    open (item) {
      if (this.screen <= 1) this.$store.commit("SET_COLLAPSE");
      this.$router.$avueRouter.group = item.group;
      this.$router.push({
        path: this.$router.$avueRouter.getPath({                                        //处理路由,对于指向第三方网站的路由，使其在iframe中打开
          name: item[this.labelKey],
          src: item[this.pathKey]
        }),
        query: item.query
      })
    }
  }
}
</script>

