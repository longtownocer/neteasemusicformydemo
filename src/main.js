// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//导入swiper
import './lib/swiper/css/style.css'
import './lib/swiper/css/swiper.min.css'
//导入vue-cookie
import VueCookies from 'vue-cookies'

Vue.use(VueCookies)
//导入vant UI
import {Button, NavBar, Icon, Toast, PullRefresh, Loading, Circle, Slider} from 'vant';

Vue.use(Button);
Vue.use(NavBar);
Vue.use(Icon);
Vue.use(Toast);
Vue.use(PullRefresh);
Vue.use(Loading);
Vue.use(Circle);
Vue.use(Slider);
//导入axios  已禁用
/*
import axios from 'axios'
Vue.prototype.axios = axios
axios.defaults.baseURL = 'http://127.0.0.1:3000'
axios.defaults.withCredentials = true
*/
//导入mouse ui

//导入jquery
import $ from 'jquery'

//导入Vuex的store中index.js文件
import store from './store/index'

//使用Vue-navigation缓存数据
import Navigation from 'vue-navigation'

//导入icomoon
import './lib/icomoon/style.css'

//导入iview 的字体图标

Vue.filter('formatsongtime', function (time) {
    let t = time
    let m = parseInt(t / 60)
    let s = t % 60
    m = m < 10 ? '0' + m : m
    s = s < 10 ? '0' + s : s
    return m + ':' + s
})

Vue.use(Navigation, {router, store, moduleName: 'navigation', keyName: 'VNK'})

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: {App},
    template: '<App/>',
    store
})
