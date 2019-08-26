import Vue from 'vue'
import Vuex from 'vuex'
import persistedState from 'vuex-persistedstate'


Vue.use(Vuex)
//数据存放
const state = {
    //设置初始的登录信息
    logininfo: null,
    songplayProgress: 0,
    songPlayTotal: 100,
    songslist: [],
    songInfo: {
        name: '老街',
        picUrl: "https://p1.music.126.net/fZFrplIVrHMx4lvgdqiIHQ==/42880953496261.jpg",
        src: "http://m7.music.126.net/20190826173135/a77106ab54be4bc61927e78a04e432a3/ymusic/9a73/f8e4/de87/b1a871efe9687010bc55678843ca4369.mp3",
        artist: '李荣浩',
        currentLyric: null
    }
}

//数据过滤实时获取
const getters = {
    //获取保存的登录信息
    getLoginInfo(state) {
        return state.logininfo
    },
    getsongslist(state) {
        return state.songslist
    },
    getsongsInfo(state) {
        return state.songInfo
    }

}
//数据修改
const mutations = {
    //登录信息赋值给logininfo
    saveLoginInfo(state, obj) {
        state.logininfo = obj
    },
    setsongplayProgress(state, newdata) {
        state.songplayProgress = newdata
    },
    setsongslist(state, newarr) {
        state.songslist = newarr
    },
    setsongsInfo(state, newarr) {
        state.songInfo = newarr
    }
}
//异步更新
const actions = {
    //更新登录信息
    updateLoginInfo(context, newLoginInfoObj) {
        //调用 this.$store.dispatch('updateLoginInfo'，paramsobj)
        context.commit('saveLoginInfo', newLoginInfoObj)
    }
}

const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    plugins: [persistedState()]
})


export default store
