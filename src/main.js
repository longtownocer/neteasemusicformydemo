// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from '@/router/index'
//导入swiper
import '@/lib/swiper/css/style.css'
import '@/lib/swiper/css/swiper.min.css'

//导入vant UI
import {Button, NavBar, Icon, Toast, PullRefresh, Loading, Circle, Slider, ActionSheet, Dialog} from 'vant'
Vue.use(Button);
Vue.use(NavBar);
Vue.use(Icon);
Vue.use(Toast);
Vue.use(PullRefresh);
Vue.use(Loading);
Vue.use(Circle);
Vue.use(Slider);
Vue.use(ActionSheet);
Vue.use(Dialog);

//导入jquery
import $ from 'jquery'

//导入Vuex的store中index.js文件
import store from '@/store/index'

//导入iconfont字体图标
import '@/lib/fonts/iconfont/iconfont.css'

//导入时间格式化插件
import moment from 'moment'

//导入index.css
import '@/css/index.css'

//格式时间过滤
Vue.filter('dateformat', function (dataStr, pattern = 'YYYY.MM.DD') {
    return moment(dataStr).format(pattern)
})
//歌曲时长
Vue.filter('formatsongtime', function (time, curduration) {
    if (time == '00:00') {
        time = curduration
    } else if (isNaN(time)) {
        return '00:00'
    }
    if (curduration == 0) {
        return '00:00'
    }

    let t = time
    let m = parseInt(t / 60)
    let s = parseInt(t % 60)
    m = m < 10 ? '0' + m : m
    s = s < 10 ? '0' + s : s
    return m + ':' + s
})
//点击次数
Vue.filter('formatCount', function (num) {
    if (num >= 10000 * 10000) {
        return parseFloat(num / (10000 * 10000)).toFixed(1) + '亿'
    } else if (num >= 10000) {
        return parseInt(num / 10000) + '万'
    }
    return num
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: {App},
    template: '<App/>',
    store
})
