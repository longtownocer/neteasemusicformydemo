<template>
    <div>
        <!--歌曲底部固定栏-->
        <div class="fixed-songs-play" @click.self="showsongsplayinfo($event)">
            <div class="song-avatar-info">
                <div class="avatar">
                    <img :src="songinfo.pictrue_url" alt="">
                </div>
                <div class="songstitle">
                    {{songinfo.name}}
                </div>
            </div>
            <div class="songscontrols">
                <van-icon :name="setplayicon" @click.stop="switchicon($refs.audio)"/>
                <van-icon name="bars"></van-icon>
            </div>
        </div>
        <!--歌曲播放详情-->


        <div class="songsinfo-container" v-show="isplayer">
            <audio controls ref="audio" @timeupdate="updateTime" id="audio"
                   style="width: 100%;border-radius: none;margin-top: 350px;position: absolute;display: none">
                <source :src="songinfo.audiosrc"
                >
            </audio>
            <div class="top-fixed">
                <div class="left">
                    <div class="back" @click="back">
                        <van-icon name="arrow-left"></van-icon>
                    </div>
                    <div class="songstitle">
                        <span>{{songinfo.name}}</span>
                        <span>{{songinfo.artist}}  ></i></span>
                    </div>
                </div>
                <div class="right">
                    <van-icon name="share"></van-icon>
                </div>
            </div>
            <div class="center-info" @click="imgtolrc">

                <div class="center-animate" v-show="inturn">
                    <img :src="songinfo.pictrue_url" alt="">
                </div>

                <div class="center-songlrc" v-show="!inturn">


                    <div class="lyric" ref="lyricList">
                        <ul class="con-p" ref="lyricLine" v-if="currentLyric">
                            <li v-for="(item,i) in  currentLyric.lines"
                                :class="{'current':i==currentLineNum}">{{item.txt}}
                            </li>
                        </ul>
                        <ul v-else="currentLyric">
                            <li>暂无歌词</li>
                        </ul>
                    </div>


                </div>
            </div>


            <div class="bottom-info">
                <div class="operating">
                    <van-icon name="like-o"></van-icon>
                    <van-icon name="upgrade" style="transform: rotateZ(180deg)"></van-icon>
                    <van-icon name="award-o" info="10w+"/>
                    <van-icon name="chat-o" info="10w+"/>
                    <van-icon name="more-o"/>
                </div>
                <div class="slider-controls">
                    <div class="current-play-time" v-html="intime">
                    </div>
                    <van-slider v-model="value" @change="onChange(value,$refs.audio)" @drag-end="dragEnd"
                                @drag-start="dragStart"/>
                    <div class="total-alltiem">
                        {{338|formatsongtime}}
                    </div>
                </div>
                <div class="switchando-peratingsongs">
                    <van-icon name="replay"/>
                    <img src="../../img/上一首.png" alt="" style="width: 20px;height: 25px;color: #fff;">
                    <van-icon :name="setplayicon" @click="switchicon($refs.audio)"/>
                    <img src="../../img/下一首.png" alt="" style="width: 20px;height: 25px">
                    <van-icon name="bars"/>
                </div>
            </div>


            <div class="filter"
                 style="background-image: url(http://p1.music.126.net/L78IeLujO6GSmLpGvKWPxg==/109951163216574546.jpg);">
            </div>

        </div>

    </div>
</template>
<script>
    import Lyric from 'lyric-parser'
    import Swiper from 'swiper'
    import Scroll from '../../base/scroll/scroll.vue'
    import song from '../../api/song/song.js'

    import lyrics from '../../api/song/song.js'// js文件路径视情况而定

    export default {
        data() {
            return {
                currentRate: 0,
                rate: 100,
                speed: 0.3,
                src: '',
                iconflg: true,
                value: 0,
                totaltime: 0,
                playflag: true,
                slideflg: false,
                inturn: true,
                currentLyric: null,
                lyric: '',
                currentLineNum: 0,
                playlyric: 0,
                isplayer: false,
                songinfo: {
                    name: '老街',
                    artist: '李荣浩',
                    audiosrc: '/static/media/李荣浩 - 老街.d25d7f5.mp3',
                    pictrue_url: 'https://p1.music.126.net/fZFrplIVrHMx4lvgdqiIHQ==/42880953496261.jpg'
                }
            }
        },
        watch: {
            'currentLineNum': function (n, l) {
                //  console.log(document.querySelectorAll('li'))
                console.log()
                $('.lyric').scrollTop(n * 29.6)
            }
        },
        methods: {
            switchplayicon() {
                this.speed = 10
                this.iconflg = !this.iconflg
                if (this.$refs.stopsong) {
                    return this.rate = this.currentRate
                }
                this.rate = 100
            },
            showsongsplayinfo(e) {
                this.isplayer = true
            },
            onChange(value, el) {
                el.currentTime = (value / 100) * el.duration
                this.seek((value / 100) * el.duration)
            },
            switchicon(el) {
                this.playflag = !this.playflag
                if (this.currentLyric) {
                    this.currentLyric.togglePlay()
                }
                if (el.paused) {
                    return el.play()
                }
                //this.currentLyric.stop()
                el.pause()

            },
            dragStart() {
                this.slideflg = true
            },
            dragEnd() {
                this.slideflg = false
            },
            updateTime(e) {
                if (this.slideflg) {
                    return
                }
                this.value = (e.target.currentTime / e.target.duration) * 100
                if (this.value == 100) {
                    this.playflag = !this.playflag
                }

            },
            seek(currentTime) {
                if (!this.currentLyric) {
                    return
                }
                console.log(currentTime)
                this.currentLyric.seek(currentTime * 1000)
                if (this.$refs.audio.paused) {
                    return this.currentLyric.stop()
                }
                //  this.currentLyric.play()
            },


            switchsong(newinfo, lyric) {
                this.playflag = true
                this.$refs.audio.pause()
                this.$refs.audio.src = newinfo.audiosrc
                this.$refs.audio.play()
                this.setlyric(lyric)
            },

            setlyric(lyric) {
                if (this.currentLyric) {
                    this.currentLyric.stop()
                }
                this.currentLyric = new Lyric(lyric, this.handleLyric)
                this.currentLyric.play()
            },


            imgtolrc() {
                this.inturn = !this.inturn
            },
            completion(value) {
                if (value == 0) {
                    return false
                }
                let z = (value / 100) * this.$refs.audio.duration
                let m = parseInt(z / 60)
                let s = parseInt(z % 60)
                m = m < 10 ? '0' + m : m
                s = s < 10 ? '0' + s : s
                return m + ':' + s
            },

            handleLyric({lineNum, txt}) {

                this.currentLineNum = lineNum

            },
            back() {
                this.isplayer = false
            }
        },
        created() {


        },
        mounted() {
            if (this.$refs.audio.paused) {
                this.playflag = false
            }
            this.totaltime = this.$refs.audio.duration


        },
        updated() {

        },
        computed: {
            setplayicon() {
                if (this.playflag) {
                    return 'pause-circle-o'
                }
                return 'play-circle-o'
            },
            intime() {
                return this.completion(this.value) || '00:00'
            },
            lightrow() {
                // return this.$refs.audio.currentTime*1000==this.txt
            }

        },
        filters: {},
        components: {
            Scroll,

        }
    }
</script>
<style scoped lang="less">
    .middle-r {

        .text {
            line-height: 40px;
        }

    }


    .fixed-songs-play {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 50px;
        background-color: #ffffff;
        display: flex;
        justify-content: space-between;
        padding: 0 7px;
        border-top: 0.5px solid rgba(138, 138, 138, 0.42);

        .song-avatar-info {
            display: flex;
            flex-direction: row;
            align-items: center;

            .avatar {
                width: 40px;
                height: 40px;

                img {
                    height: 100%;
                    width: 100%;
                    border-radius: 50%;
                }
            }

            .songstitle {
                margin: 0 0 0px 8px;
                letter-spacing: 1px;
                font-size: 12px;
                height: 40px;
            }
        }

        .songscontrols {
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            align-items: center;
            margin-right: 20px;
            width: 20%;

            i {
                font-size: 28px;
            }

            .stop-play {
                /*text-align: center;*/
                height: 27px;
                position: relative;
                width: 27px;

                i {
                    position: absolute;
                    top: 3px;
                    left: 4px;
                    font-size: 28px;
                    font-weight: 100;
                }
            }

            .chooice-list {
                font-size: 25px;
                height: 25px;
                padding: 0 10px;
            }
        }
    }

    .songsinfo-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #8786b9;
        /* display: flex;
         justify-content: space-between;
         flex-direction: column;
 */

        div:nth-of-type(1), div:nth-of-type(2), div:nth-of-type(3) {
            z-index: 99999999;
        }

        .filter {
            position: absolute;
            top: 0;
            left: 0;
            filter: blur(20px);
        }

        .top-fixed {
            display: flex;
            justify-content: space-between;
            height: 50px;
            padding: 10px 10px;

            .left {
                display: flex;
                justify-content: space-between;
                flex-direction: row;
                align-items: center;

                .songstitle {
                    display: flex;
                    justify-content: space-between;
                    flex-direction: column;
                    margin-left: 10px;

                    span {
                        text-align: left;
                    }

                    span:nth-of-type(1) {
                        font-size: 16px;
                        letter-spacing: 2px;
                        color: #fff;
                        margin-bottom: 2px;
                    }

                    span:nth-of-type(2) {
                        font-size: 12px;
                        color: rgba(234, 234, 234, 0.44);
                    }
                }

                .back {
                    i {
                        font-size: 25px;
                        color: #fff;
                    }
                }
            }

            .right {
                line-height: 50px;
                font-size: 25px;
                color: rgba(241, 241, 241, 0.85);
                margin-right: 5px;
            }
        }

        .center-info {
            height: 60%;
            /*position: absolute;*/
            margin-top: 20px;
            width: 100%;
            display: flex;
            justify-content: space-around;
            flex-direction: column;
            align-items: center;

            .center-animate {
                width: 280px;
                height: 280px;
                margin-top: 30px;
                box-sizing: border-box;
                border: 10px solid #bfbcc3;
                border-radius: 50%;
                animation: songtravel 20s linear infinite;
                outline: 20px solid transparent;

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
            }

            .center-songlrc {
                width: 100%;
                height: 100%;
                color: #eee;
                /*overflow: scroll;*/

                .lyric {
                    width: 100%;
                    height: 102%;
                    overflow: scroll;
                }

                ul {
                    padding-top: 125px;
                    padding-bottom: 5px;
                }

                ul > li {
                    line-height: 30px;
                    font-size: 14px;
                    position: relative;

                }

                p {
                    font-size: 14px;
                    letter-spacing: 1px;
                }
            }
        }

        .bottom-info {
            height: 140px;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;

            .operating {
                height: 40px;
                display: flex;
                justify-content: space-between;
                flex-direction: row;
                align-items: center;
                font-size: 22px;
                color: #fff;
                padding: 0 70px;
                font-weight: 100;
                /*margin-bottom: 40px;*/
            }

            .slider-controls {
                padding: 0 53px;
                margin: 15px 0;
                /*height: 30px;*/
                width: 270px;
                /*padding-bottom: 40px;*/

                .current-play-time {
                    float: left;
                    margin-left: -38px;
                    margin-top: -5px;
                }

                .total-alltiem, .current-play-time {
                    color: rgba(239, 239, 239, 0.97);
                    font-size: 11px;
                }

                .total-alltiem {
                    float: right;
                    margin-right: -38px;
                    margin-top: -6px;

                }
            }

            .switchando-peratingsongs {
                display: flex;
                justify-content: space-around;
                flex-direction: row;
                align-items: center;
                padding: 0 30px;

                i {
                    color: rgba(237, 237, 237, 0.94);
                }

                i:nth-of-type(1), i:nth-of-type(3) {
                    font-size: 20px;
                }

                i:nth-of-type(2) {
                    font-size: 35px;
                }
            }
        }
    }

    .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .current {
        color: #6c7cff;
        font-size: 16px;
    }

    @keyframes songtravel {
        from {
            transform: rotateZ(0deg);
        }
        to {
            transform: rotateZ(360deg);
        }
    }
</style>
<!--
 /* this.currentLineNum = lineNum
                 /!*
                                 if (!this.$refs.audio.paused) {

                                 }*!/
                 console.log(lineNum, txt)
                 console.log(document.querySelector('.current').clientHeight)
                 if (lineNum > 5) {

                     //v-for循环，所以this.$refs.lyricLine是一个数组，从而获取相应DOM
                     let lyricEl = this.$refs.lyricLine[lineNum - 5]
                     //调用scroll组件API
                     this.$refs.lyricList.style.transform = `translateY(${-lineNum * 40}px)`
                     console.log(lyricEl)
                 } else {
                     //如果小于5，则滚动制顶部
                    // this.$refs.lyricList.scrollTo(0, 0, 1000)
                 }
                 // this.playingLyric = txt*/
-->
