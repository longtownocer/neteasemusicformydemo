<template>
    <div class="root-songslist">
        <load v-show="loadflag"></load>
        <div class="content">
            <div class="top-bar">
                <div class="back" @click="goback">
                    <van-icon name="arrow-left"/>
                </div>
                <div class="cavsongs">
                    点歌
                </div>
            </div>
            <div class="top-bgc">
                <img src="http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg" alt="">
            </div>
            <div class="songslist-container">
                <div class="play-choice" v-show="!loadflag">
                    <div class="left">
                        <span><van-icon name="play-circle-o"></van-icon></span>
                        <span class="crls">播放全部</span>
                    </div>
                    <div class="right">
                        <span><van-icon name="bars"></van-icon></span>
                        <span class="ls">多选</span>
                    </div>
                </div>
                <div class="songs-all-list">
                    <div class="songs-eachlist-current" v-for="(item,i) in songslistInfo" :key="i"
                         @click="playsong(i,item.id)">
                        <div class="each-list">
                            <div class="songsInfo">
                                <img :src="item.album.blurPicUrl" alt="">
                                <van-icon name="volume-o" v-if="item.id==$store.state.currentid"></van-icon>
                            </div>
                            <div>
                                <span><van-icon name="tv-o" v-if="item.mvid!==0"></van-icon></span>
                                <span><van-icon name="more-o"></van-icon></span>
                            </div>
                        </div>
                        <div class="aticle">
                            <b>{{item.name}}</b>
                            <b>{{item.artists[0].name}}-{{item.album.name}}</b>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import load from '@/components/load/loaddata'
    import Asynchronous from '@/api/asyc/asyc'
    import {mapActions, mapState} from 'vuex'

    export default {
        data() {
            return {
                songslistInfo: [],
                loadflag: true,
                songarr: [],
            }
        },
        methods: {
            ...mapActions(['updatesongLIst']),
            getsongslistinfo() {
                Asynchronous({
                    type: 'get',
                    url: '/recommend/songs',
                    params: {
                        timestamp: Date.now()
                    }
                }).then((ret) => {
                    this.songslistInfo = ret.data.dailySongs
                    this.loadflag = false
                })
            },
            goback() {
                this.$router.go(-1)
            },
            scroll() {
                $('.root-songslist').scroll(function () {
                    if ($(this)[0].scrollTop >= 230) {
                        $('.play-choice').css({
                            'position': 'fixed',
                            'width': '100%',
                            'top': '40px',
                            'overflow': 'hidden',
                            'padding': '10px 15px',
                        })
                        $('.songs-all-list').css({'margin-top': '41px'})
                    } else {
                        $('.play-choice').css({'position': ''})
                        $('.songs-all-list').css({'margin-top': ''})
                    }
                })
            },
            playsong(i, id) {
                if (this.songarr.length == 0 || this.songslist.length < this.songslistInfo.length) {
                    let arr = []
                    this.songslistInfo.forEach((item, i) => {
                        arr.push({
                            name: item.name,
                            artist: item.artists[0].name,
                            id: item.id,
                            picUrl: item.album.blurPicUrl,
                            album: item.album.name
                        })
                    })
                    this.updatesongLIst(this.deepCopy(arr))
                    this.songarr.push('finished')
                }
                this.$parent.clearLyric()
                this.$parent.removecurrent()
                this.$parent.resetHeight()
                this.$parent.playsong(i, id)
            },
            deepCopy(obj) {
                return JSON.parse(JSON.stringify(obj))
            }
        },
        created() {
            if (!this.logininfo) {
                return this.$router.push({path: '/login'})
            }
            this.getsongslistinfo()
        },
        mounted() {
            this.scroll()
        },
        computed:{
            ...mapState(['songslist','logininfo']),
        },
        components: {
            load
        },
        filters: {
            'omit': function (str) {
                if (str.length > 25) {
                    return str.slice(0, 20) + '...'
                }
                return str
            }
        }
    }
</script>
<style scoped lang="less">
    .root-songslist {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        overflow: scroll;
        background-size: 100%;


        .top-bar {
            position: fixed;
            /*top: 20px;*/
            left: 0;
            color: #3d7fdf;
            width: 100%;
            display: flex;
            justify-content: space-between;
            background-color: #fff;
            flex-direction: row;
            align-items: center;
            height: 40px;
            z-index: 99;
            overflow: hidden;

            .back {
                font-size: 25px;
                margin-left: 10px;
                /*line-height: 100%;*/
                display: flex;
                justify-content: space-around;
            }

            .cavsongs {
                margin-right: 20px;
            }
        }

        .top-bgc {
            width: 100%;
            height: 270px;
            z-index: 99999;
            overflow: hidden;

            img {
                width: 100%;
                filter: brightness(1.5);
            }
        }

        .songslist-container {
            width: 100%;
            background-color: #faf4ff;
            border-radius: 10px 10px 0 0;
            /*height: 100%;*/

            .play-choice {
                display: flex;
                justify-content: space-between;
                flex-direction: row;
                align-items: center;
                padding: 10px 15px;
                background-color: #fff;
                z-index: 99;
                box-sizing: border-box;

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
                padding-bottom: 60px;

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
                        width: 70%;

                        b {
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
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
                            text-align: center;

                            i {
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                background-color: #fff;
                                color: red;
                                width: 100%;
                                height: 100%;
                                line-height: 40px;
                                font-size: 16px;
                                font-weight: 700;
                                background-color: #faf4ff;
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
</style>
