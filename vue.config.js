// 基础路径 注意发布之前要先修改这里
let baseUrl = './'
module.exports = {
    baseUrl: baseUrl, // 根据你的实际情况更改这里
    lintOnSave: true,
    devServer: {
        publicPath: baseUrl // 和 baseUrl 保持一致
    },
    productionSourceMap: false,
    chainWebpack: (config) => {
        //忽略的打包文件
        config.externals({
            'vue': 'Vue',
            'vue-router': 'VueRouter',
            'vuex': 'Vuex',
            'axios': 'axios',
            'element-ui': 'ELEMENT',
        })
        const entry = config.entry('app')
        entry
            .add('babel-polyfill')
            .end()
        entry
            .add('classlist-polyfill')
            .end()
        entry
            .add('@/mock')
            .end()
    },
    transpileDependencies: ['avue-plugin-transfer', 'avue-plugin-ueditor'],
    //配置转发代理(想一下，如果我们请求的时候还是用前端的域名，这个时候就不存在跨域了，符合浏览器的同源政策，然后有个东西帮我们把这个请求转发到真正的后端域名上，不就避免跨域了吗？)
    devServer: {
       /*  proxy: {
             '/api': {
                 target: 'http://127.0.0.1:3000',
                 ws: true,
                 pathRewrite: {
                     '^/api': '/api'
                 }
             },
         }*/
    }
}