<template>

    <div class="root-songslist">
        <load v-if="loadflag"></load>
        <div class="content" v-else="loadflag">
            <div class="top-bar">
                <div class="back" @click="goback">
                    <van-icon name="arrow-left"/>
                </div>
                <div class="cavsongs">
                    点歌
                </div>
            </div>
            <div class="top-bgc">
            </div>
            <div class="songslist-container">
                <div class="play-choice">
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
                    <div class="songs-eachlist-current" v-for="(item,i) in songslistInfo" :key="i" @click="playsong(i)">
                        <div class="each-list">
                            <div class="songsInfo">
                                <img :src="item.album.blurPicUrl" alt="">
                            </div>
                            <div>
                                <span><van-icon name="tv-o"></van-icon></span>
                                <span><van-icon name="more-o"></van-icon></span>
                            </div>
                        </div>
                        <div class="aticle">
                            <b>{{item.name}}</b>
                            <b>{{item.artists[0].name}}-{{item.album.name|omit}}</b>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
    import load from '../load/loaddata.vue'
    import song from "@/api/song/song";

    export default {
        data() {
            return {
                baseUrl: 'http://localhost:3000',
                songslistInfo: [],
                loadflag: true,
                songarr: []
            }
        },
        methods: {
            // /recommend/songs

            getsongslistinfo() {
                this.Asynchronous({
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

            Asynchronous(objparams) {
                return new Promise((reject) => {
                    $.ajax({
                        type: objparams.type,
                        url: this.baseUrl + objparams.url,
                        data: objparams.params,
                        xhrFields: {withCredentials: true}
                    }).then((ret) => {
                        reject(ret)
                    }).catch((err) => {
                        console.log(err)
                    })
                })
            },
            goback() {
                this.$router.go(-1)
            },
            playsong(i) {
                if (this.songarr.length == 0) {
                    this.songslistInfo.forEach((item, i) => {
                        this.songarr.push(item.id)
                    })
                }
                //获取歌词
                let newsinfo = {}
                let lyric = ''
                this.Asynchronous({
                    type: 'get',
                    url: '/lyric',
                    params: {
                        id: this.songslistInfo[i].id
                    }
                }).then((ret) => {
                    lyric = ret.lrc.lyric
                    return this.Asynchronous({
                        type: 'get',
                        url: '/song/url',
                        params: {
                            id: this.songarr[i],
                            timestamp: Date.now()
                        }
                    })
                }).then((ret) => {      //  //获取歌曲url
                    newsinfo = {
                        name: this.songslistInfo[i].name,
                        artist: this.songslistInfo[i].artists[0].name,
                        audiosrc: ret.data[0].url,
                        pictrue_url: this.songslistInfo[i].album.blurPicUrl
                    }
                    this.$emit('switch',newsinfo, lyric)

                })
            }
        },
        created() {
            this.getsongslistinfo()
            let now = Date.now()
            //console.log(now)
        },
        mounted() {


        },
        updated() {
            $('.root-songslist').scroll(function () {
                if ($(this)[0].scrollTop >= 160) {
                    $('.play-choice').css({
                        'position': 'fixed',
                        'width': '100%',
                        'top': '40px',
                        'overflow': 'hidden',
                        'padding': '10px 0',
                    }).find('.left').css({
                        'margin-left': '15px'
                    }).siblings('.right').css({
                        'margin-right': '15px'
                    })
                } else {
                    $('.play-choice').css({'position': 'static'})
                }
            })
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
        background: url("../../img/u=481794964,3146825451&fm=26&gp=0.jpg") 0 40px no-repeat;
        background-size: 100%;

        .top-bar {
            position: fixed;
            /*top: 20px;*/
            left: 0;
            color: #3d7fdf;
            width: 100%;
            display: flex;
            justify-content: space-between;
            background-color: rgba(255, 255, 255, 0.97);
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
            height: 200px;
            z-index: 99999;
            overflow: hidden;
            /*transform: translateZ(10px);*/
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
                background-color: #faffff;
                z-index: 99;
                border-radius: 10px 10px 0 0;

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
