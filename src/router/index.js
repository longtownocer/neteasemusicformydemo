import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/root/Home'
import Login from '@/components/users/login'
import SongsListDetail from '@/components/songs/SongsListDetail'

import slider from '@/components/slidecomponents/slider'
// import load from '@/components/load/loaddata'

Vue.use(Router)
//components 补齐经常 出错 请手敲！!
export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/songslistdetail',
            name: 'songslistdetail',
            component: SongsListDetail
        },
        {
            path: '/slider',
            name: 'slider',
            component: slider
        },
    ]
})
