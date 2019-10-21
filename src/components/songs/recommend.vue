<template>
    <div class="root-songslist">
        <load v-if="loadflag"></load>
        <div class="content">
            <div class="top-bar" :class="{'white':songslist.length!==0}">
                <div class="back" @click="goback"> <!--  @click="goback"  -->
                    <van-icon name="arrow-left"/>
                    <div class="recom">
                        <span>歌单</span>
                    </div>
                </div>
                <div class="cavsongs">
                    <van-icon name="search" @click="search"></van-icon>
                    <i class="iconfont icongengduo"></i>
                </div>
                <img :src="coverImgUrl" alt="">
            </div>
            <div class="top-bgc">
                <img :src="coverImgUrl" alt="">
                <div class="cover-img">
                    <img src="" alt="">
                </div>
            </div>
            <div class="songslist-container">
                <div class="play-choice" v-show="songslist.length!==0">
                    <div class="left">
                        <span><van-icon name="play-circle-o"></van-icon></span>
                        <span class="crls">播放全部</span>
                        <span style="font-size: 14px;color: #a6a3ab">(共{{songslist.length}}首)</span>
                    </div>
                    <div class="right">
                        <van-button round type="danger" size="small"><b>+</b> 收藏({{subscribedCount|formatCount}})
                        </van-button>
                    </div>
                </div>
                <div class="songs-all-list">
                    <div class="songs-eachlist-current" v-for="(item,i) in songslist" :key="i"
                         @click="play(i,item.id)">
                        <div class="each-list">
                            <div class="songsInfo">
                                <span>{{i+1}}</span>
                                <img alt="">
                                <van-icon name="volume-o"
                                          v-if="item.id==$store.state.currentid">
                                </van-icon>
                            </div>
                            <div>
                                <span><van-icon name="tv-o" v-if="item.mv!==0"></van-icon></span>
                                <span><van-icon name="more-o"></van-icon></span>
                            </div>
                        </div>
                        <div class="aticle">
                            <b>{{item.name.trim()|omittitle}}</b>
                            <b>{{(item.artist+'-'+item.album)|omitname}}</b>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cover-img">
                <div class="center">
                    <div class="img">
                        <img :src="coverImgUrl" alt="">
                        <div class="play">
                            <van-icon name="play-circle-o"></van-icon>
                            {{playCount|formatCount}}
                        </div>
                    </div>

                    <div class="recomedinfo">
                        <div class="title">
                            {{title}}
                        </div>
                        <div class="description">
                            {{description|omit}}
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <div class="siric">
                        <span><i class="iconfont iconpinglun"></i></span>
                        <span>{{commentCount}}</span>
                    </div>
                    <div class="siric">
                        <span> <i class="iconfont icon552cc62440096"></i></span>
                        <span>{{shareCount}}</span>
                    </div>
                    <div class="siric">
                        <span> <i class="iconfont iconxiazai"></i></span>
                        <span>下载</span>
                    </div>
                    <div class="siric">
                        <span> <i class="iconfont iconduoxuan"></i></span>
                        <span>多选</span>
                    </div>


                </div>
            </div>
        </div>
        <transition name="searchs">
            <search @searchs="searched" class="search" v-if="tosearch"></search>
        </transition>
    </div>
</template>

<script>
    import Asynchronous from '@/api/asyc/asyc.js'
    import load from '@/components/load/loaddata'
    import search from '@/components/search/searchrecommedresult'
    import {mapActions} from 'vuex'

    export default {
        data() {
            return {
                id: this.$route.params.id,
                coverImgUrl: '',
                description: '',
                title: '',
                signature: '',
                playCount: 0,
                loadflag: true,
                commentCount: 0,
                shareCount: 0,
                subscribedCount: 0,
                songslist: [],
                switchlist: true,
                tosearch: false,
                recommedSongsList: []
            }
        },
        methods: {
            ...mapActions(['updatesongLIst']),
            getrecommend(id) {
                return Asynchronous({
                    type: 'get',
                    url: '/playlist/detail',
                    params: {
                        id
                    }
                })
            },
            play(i, id) {
                if (this.switchlist || this.$store.state.songslist.length < this.songslist.length) {  //第一次播放
                    this.updatesongLIst(this.DeepCopy(this.songslist)) //深拷贝
                    this.switchlist = false
                }
                this.$parent.clearLyric()
                this.$parent.removecurrent()
                this.$parent.resetHeight()
                this.$parent.playsong(i, id)
            },
            goback() {
                this.$router.back()
            },
            search() {
                if (this.songslist.length === 0) {
                    return
                }
                this.tosearch = true
            },
            scroll() {
                $('.root-songslist').scroll(function () {
                    if ($(this).scrollTop() >= 190) {
                        $('.top-bar img').css({'display': 'block'})
                        $('.play-choice').css({
                            'position': 'fixed',
                            'top': '50px',
                            'width': '100%',
                            'padding': '0 15px',
                            'height': '50px',
                            'transition': 'all 0.2s ease'
                        })
                        $('.songs-all-list').css({'margin-top': '50px',})
                    } else {
                        $('.top-bar img').css({'display': ''})
                        $('.play-choice').css({'position': '', 'top': '', 'width': '', 'padding': '',})
                        $('.songs-all-list').css({'margin-top': ''})
                    }
                })
            },
            searched(n, call) {
                if (n.length == 0) {
                    return call && call(null)
                }
                let indexs = []
                let result = this.songslist.filter((item, i) => {
                    if (item.name.replace(/\s/g, '').includes(n)) {
                        indexs.push(i)
                    }
                    return item.name.replace(/\s/g, '').includes(n)
                })
                call && call(result, indexs)
            },
            hideSearch() {
                this.tosearch = false
            },
            DeepCopy(obj) {
                return JSON.parse(JSON.stringify(obj))
            }
        },
        created() {
            this.getrecommend(this.id).then((ret) => {
                let arr = []
                this.coverImgUrl = ret.playlist.coverImgUrl
                this.description = ret.playlist.description
                this.title = ret.playlist.name
                this.signature = ret.playlist.creator.signature
                this.playCount = ret.playlist.playCount
                this.loadflag = false
                this.commentCount = ret.playlist.commentCount
                this.shareCount = ret.playlist.shareCount
                this.subscribedCount = ret.playlist.subscribedCount
                ret.playlist.tracks.forEach((item, i) => {
                    this.songslist.push({
                        name: item.name,
                        id: item.id,
                        artist: item.ar[0].name,
                        picUrl: item.al.picUrl,
                        album: item.al.name,
                        mv: item.mv
                    })
                })
                // this.recommedSongsList =arr
                // this.songslist = arr
            })
        },
        filters: {
            'omit': function (str) {
                if (str.length >= 85) {
                    return str.slice(0, 78) + '...'
                }
                return str
            },
            'omitname': function (str) {
                if (str.length >= 35) {
                    return str.slice(0, 30) + '...'
                }
                return str
            },
            'omittitle': function (str) {
                if (str.length >= 23) {
                    return str.slice(0, 23) + '...'
                }
                return str
            }
        },
        mounted() {
            this.scroll()
        },
        components: {
            load,
            search
        }
    }
</script>
<style scoped lang="less">
    .searchs-enter, .searchs-leave-to {
        opacity: 0;
        transform: translateY(100%);
    }

    .searchs-enter-active, .searchs-leave-active {
        transition: transform 0.4s ease;
    }

    .search {
        position: fixed;
        width: 100%;
        height: 100%;
        background: #fff;
        top: 0;
    }

    .van-loading__spinner {
        border-radius: 50%;
        box-sizing: border-box;
        padding: 3px;
        box-shadow: 0px 0px 1px #1e1c4f;
    }

    .white {
        color: #ffffff;
    }

    .root-songslist {
        position: fixed;
        opacity: 0.999;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        overflow: scroll;
        background-size: 100%;

        .top-bar {
            position: fixed;
            left: 0;
            width: 100%;
            display: flex;
            justify-content: space-between;
            background-color: transparent;
            flex-direction: row;
            align-items: center;
            height: 50px;
            z-index: 99;
            overflow: hidden;


            img {
                position: absolute;
                width: 100%;
                height: auto;
                filter: blur(5px) brightness(0.8);
                top: -50px;
                display: none;
            }

            i {
                font-size: 20px;
            }

            .back {

                margin-left: 10px;
                display: flex;
                justify-content: space-around;
                flex-direction: row;
                align-items: center;
                font-size: 16px;
                z-index: 99;

                .recom {
                    display: flex;
                    flex-wrap: wrap;
                    text-align: left;

                    span {
                        width: 100%;
                    }

                    span:nth-of-type(2) {
                        font-size: 10px;
                        color: rgba(225, 220, 230, 0.88);
                        margin-top: 2px;
                    }
                }

                i {
                    margin: 1px 8px 0 0;
                    border: 10px solid transparent;
                    font-size: 22px;
                }
            }

            .cavsongs {
                margin-right: 10px;
                display: flex;
                flex-direction: row;
                align-items: center;
                z-index: 99;

                i {
                    font-size: 23px;
                    border: 10px solid transparent;
                }

                i:nth-of-type(1) {
                    margin-right: 10px;
                }
            }
        }

        .top-bgc {
            width: 100%;
            height: 240px;
            z-index: 99999;
            overflow: hidden;
            /*transform: translateZ(10px);*/


            img {
                width: 100%;
                filter: blur(20px) brightness(0.7);
                transform: scale(1.15);
            }
        }

        .songslist-container {
            width: 100%;
            background-color: #fff;
            border-radius: 10px 10px 0 0;
            /*height: 100%;*/

            .play-choice {
                display: flex;
                justify-content: space-between;
                flex-direction: row;
                align-items: center;
                padding: 10px 15px;
                background-color: #ffffff;
                z-index: 99;
                border-radius: 10px 10px 0 0;
                box-sizing: border-box;
                transition: all 0.4s ease;
                border-bottom: 0.5px solid #ede9ff;

                div {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;

                    span {
                        display: inline-block;
                        line-height: 100%;
                        height: 100%;

                        i {
                            font-size: 20px;
                        }
                    }

                    .crls {
                        font-size: 14px;
                        margin-left: 6px;
                        font-weight: '黑体';
                    }

                    .ls {
                        margin-left: 2px;
                        font-size: 13px;
                    }

                }
            }

            .songs-all-list {

                padding: 15px;
                padding-bottom: 50px;
                overflow-x: hidden;


                .songs-eachlist-current {
                    margin-bottom: 20px;
                    position: relative;

                    .aticle {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        position: absolute;
                        top: 3px;
                        left: 48px;
                        width: 100%;

                        b {
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            width: 70%;
                        }


                        b:nth-of-type(1) {
                            font-weight: normal;
                            font-size: 14px;
                            letter-spacing: 2px;
                        }

                        b:nth-of-type(2) {
                            font-weight: normal;
                            font-size: 11px;
                            color: rgba(97, 97, 97, 0.86);
                            letter-spacing: 1px;
                            margin-top: 1px;
                        }

                        b {
                            text-align: left;
                        }
                    }

                    .each-list {
                        /*background-color: #fff;*/
                        width: 100%;
                        text-align: left;
                        display: flex;
                        justify-content: space-between;

                        div {
                            line-height: 40px;
                            height: 40px;
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            /*background-color: #424fff;*/

                            span {
                                line-height: 40px;
                                font-size: 22px;
                                color: rgba(123, 123, 123, 0.8);
                                display: flex;

                                i {
                                    line-height: 100%;
                                    /*display: block;*/
                                }
                            }

                            span:nth-of-type(2) {
                                margin-left: 15px;
                            }
                        }

                        .songsInfo {
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            position: relative;

                            span {
                                position: absolute;
                                width: 100%;
                                height: 100%;
                                font-size: 13px;
                                display: inline-block;
                                text-align: center;
                            }

                            i {
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                color: red;
                                width: 100%;
                                height: 100%;
                                line-height: 40px;
                                font-size: 16px;
                                font-weight: 700;
                                background-color: #fff;
                            }

                            img {
                                width: 40px;
                                border-radius: 5px;
                            }
                        }

                    }
                }

            }
        }
    }

    .content {
        position: relative;

        .cover-img {
            position: absolute;
            width: 100%;
            height: 180px;
            /*background-color: #ffb576;*/
            top: 60px;

            .center {
                margin: 0 15px;

                height: 120px;
                display: flex;
                justify-content: space-between;

                .recomedinfo {
                    box-sizing: border-box;
                    text-align: left;
                    margin-left: 10px;
                    width: 240px;
                    /*background-color: #98ff9b;*/

                    .title {
                        font-size: 18px;
                        color: #ffffff;
                        letter-spacing: 1px;
                    }

                    .description {
                        /*padding-right: 36px;*/
                        font-size: 11px;
                        margin-top: 5px;
                        width: 210px;
                        color: rgba(244, 236, 237, 0.94);
                        margin-right: 0;
                    }

                }

                .img {
                    width: 120px;
                    height: 120px;
                    position: relative;

                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 10px;

                    }

                    .play {
                        position: absolute;
                        right: 12px;
                        top: 10px;
                        z-index: 99;
                        color: #fff;
                        display: flex;
                        align-items: center;

                        i {
                            margin-right: 2px;
                        }
                    }
                }
            }

            .bottom {
                height: 60px;
                display: flex;
                justify-content: space-around;
                align-items: center;

                .siric {
                    display: flex;
                    flex-direction: column;
                    flex-wrap: wrap;

                    span:nth-of-type(2) {
                        margin-top: 1px;
                        color: #eeeeee;
                    }
                }

                i {
                    font-size: 20px;
                    color: #fff;
                }
            }
        }
    }
</style>
