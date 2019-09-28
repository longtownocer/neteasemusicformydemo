import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/root/Home'
import Login from '@/components/users/login'
import SongsListDetail from '@/components/songs/SongsListDetail'
import recommend from '@/components/songs/recommend'
import songsquare from '@/components/songs/songsquare'

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
            name: 'resource',
            path: '/resource/:id',
            component: recommend
        },
        {
            name: 'songsquare',
            path: '/songsquare',
            component: songsquare
        }
    ]
})
