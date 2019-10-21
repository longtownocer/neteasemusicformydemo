import Vue from 'vue'
import Vuex from 'vuex'
import persistedState from 'vuex-persistedstate'

Vue.use(Vuex)
//数据存放
const state = {
    //设置初始的登录信息
    logininfo: null,
    search: false,
    songplayProgress: 0,
    songPlayTotal: 100,
    songslist: [],
    songinfo: {
        name: '老街',
        artist: '李荣浩',
        audiosrc: './resource/mp3/李荣浩 - 老街.mp3',
        pictrue_url: 'https://p1.music.126.net/fZFrplIVrHMx4lvgdqiIHQ==/42880953496261.jpg'
    },
    currentLyric: '',
    currentid: null,
    songsdetails: [],
    songsid: [],
    currentindex: null,
    baseUrl: 'http://106.13.211.74:3000',
    currentduration: 0,
    mode: 'order'
}
//数据过滤实时获取
const getters = {
    //获取保存的登录信息
    getLoginInfo: state => state.logininfo,
    getsongslist:state => state.songslist,
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
        state.songinfo = newarr
    },
    setcurrentLyric(state, newInfo) {
        state.currentLyric = newInfo
    },
    setcurrentduration(state, newInfo) {
        state.currentduration = newInfo
    },
    setcurrentid(state, n) {
        state.currentid = n
    },
    setcurrentIndex(state, n) {
        state.currentindex = n
    },
    setPlayMode(state, n) {
        state.mode = n
    },
    //搜索添加歌曲到列表
    InsertSearchResult(state, n) {
        let result = true
        let index = null
        if (state.songslist.length == 0) {   //判断列表是否为0
            state.songslist.push(n)
            state.currentindex = 0
            state.currentid = n.id
            result = false
            index = 0
        } else {
            state.songslist.some((item, i) => {
                if (item.id == n.id) {
                    result = false
                    return index = i
                }
            })
        }
        if (result) {
            //判断是否添加第一首
            state.songslist.splice(state.currentindex + 1, 0, n)
        }
        n.call && n.call(result, index)
    },
    //移除列表中的某项歌曲
    RemoveSongsList(state, i) {
        state.songslist.splice(i, 1)
    }
}
//异步更新
const actions = {
    //更新登录信息
    updateLoginInfo(context, newLoginInfoObj) {
        context.commit('saveLoginInfo', newLoginInfoObj)
    },
    //更新歌曲列表
    updatesongLIst(context, newsongslist) {
        context.commit('setsongslist', newsongslist)
    },
    //更新歌曲信息
    updateSongsInfo(context, newinfo) {
        context.commit('setsongsInfo', newinfo)
    },
    //更新歌词
    updatacurrentLyric(context, newinfo) {
        context.commit('setcurrentLyric', newinfo)
    },
    //更新歌曲时间
    updatecurrentduration(context, newInfo) {
        context.commit('setcurrentduration', newInfo)
    },
    //更新当前播放的歌曲id
    updatecurrentid(context, n) {
        context.commit('setcurrentid', n)
    },
    //更新活动索引
    updatecurrentindex(context, n) {
        context.commit('setcurrentIndex', n)
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
