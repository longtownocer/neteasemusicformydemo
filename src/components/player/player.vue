<template>
    <div id="player">
        <!--歌曲底部固定栏-->
        <div class="fixed-songs-play" @click="showsongsplayinfo($event)">
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
                <van-icon name="bars" @click.stop="showlist"></van-icon>
            </div>
        </div>
        <!--歌曲列表-->
        <transition name="boxmask">
            <div v-show="show" class="bottombox-background" @click="hidebox($event)"></div>
        </transition>
        <transition name="boxcontainer">
            <div class="bottombox" @touchmove.self="" v-show="show" @transitionstart.self="transstart($event)">
                <div class="top">
                    <div class="left">
                        <van-icon name="exchange"></van-icon>
                        列表循环({{list.length}})
                    </div>
                    <div class="right">
                        <van-icon name="add-o"></van-icon>
                        收藏全部
                        <b>|</b>
                        <van-icon name="delete"></van-icon>
                    </div>
                </div>
                <div class="list">
                    <div class="eachlist" :class="{'listlight':item.id==$store.state.currentid}"
                         v-for="(item,i) in $store.getters.getsongslist"
                         :key="i" @click="playlist(i,item.id)">
                        <div class="play">
                            <van-icon name="volume-o" v-if="item.id==$store.state.currentid"></van-icon>
                            {{item.name}}-<b style="font-style: normal;font-size: 11px;font-weight: 400;">{{item.artist}}</b>
                        </div>
                        <div class="remove" @click.stop="removelist(i)">
                            <van-icon name="cross"></van-icon>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <!--歌曲播放详情-->
        <transition name="songcontainer">
            <div class="songsinfo-container" ref="songsinfo" v-show="showplay">
                <audio controls ref="audio" @timeupdate="updateTime" id="audio" @ended="end" @error="loadError"
                       style="width: 100%;border-radius: none;margin-top: 350px;position: absolute;display: none">
                    <source :src="songinfo.audiosrc">
                </audio>
                </audio>
                <!-- 顶部返回 -->
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
                <!-- 中间动画 歌词 -->
                <div class="center-info" v-basictop @click="imgtolrc">
                    <div class="center" v-show="inturn">
                        <div class="center-animate">
                            <img :src="songinfo.pictrue_url" alt="">
                        </div>
                    </div>
                    <div class="center-songlrc" :class="{'zeroheight':inturn}">
                        <div class="blurtop"></div>
                        <div class="lyric" ref="lyricList">
                            <ul class="con-p" ref="lyricLine" v-if="currentLyric">
                                <li v-for="(item,i) in  currentLyric.lines"
                                    :class="{'current':i==currentLineNum}">{{item.txt}}
                                </li>
                            </ul>
                            <ul v-else="!currentLyric">
                                <li>暂无歌词</li>
                            </ul>
                        </div>
                        <div class="blurbottom"></div>
                    </div>
                </div>
                <div class="bottom-info">
                    <div class="operating">
                        <van-icon name="like-o"></van-icon>
                        <i class="iconfont iconxiazai2" style="font-size: 21px;"></i>
                        <van-icon name="award-o"/>
                        <van-icon name="chat-o"/>
                        <van-icon name="more-o"/>
                    </div>

                    <div class="slider-controls" @touchmove.stop="">
                        <div class="current-play-time" v-html="timing">
                        </div>
                        <van-slider v-model="value" bar-height="2px" @click.capture=""
                                    @change="onChange(value,$refs.audio)"
                                    @drag-end="dragEnd"
                                    @drag-start="dragStart">
                        </van-slider>
                        <div class="total-alltiem">
                            {{duration|formatsongtime($store.state.currentduration)}}
                        </div>
                    </div>
                    <div class="switchando-peratingsongs"><!--iconliebiaoshunxu-->
                        <i class="iconfont"
                           :class="[{'iconliebiaoshunxu':($store.state.mode=='order')},{'iconsuiji':$store.state.mode=='random'},{'icondanquxunhuan':$store.state.mode=='loop'}]"
                           @click="switchmode($event)"></i>
                        <img src="../../img/上一首.png" alt="" style="width: 20px;height: 25px;color: #fff;" @click="prev">
                        <van-icon :name="setplayicon" @click="switchicon($refs.audio)"/>
                        <img src="../../img/下一首.png" alt="" style="width: 20px;height: 25px" @click="next">
                        <van-icon name="bars" @click="showlist"/>
                    </div>
                </div>
                <div class="filter" :style="'background: url('+songinfo.pictrue_url+') no-repeat center'">
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
    import Lyric from 'lyric-parser'
    import Swiper from 'swiper'
    import Asynchronous from '@/api/asyc/asyc'
    import SliderBound from '@/js/slider-rebound/slider-bound'

    export default {
        data() {
            return {
                value: 0,
                totaltime: 0,
                playflag: true,
                slideflg: false,
                inturn: true,
                currentLyric: null,
                currentLineNum: 0,
                duration: '00:00',
                songinfo: {},
                show: false,
                dragrecover: true,
                showplay: false,
                listposition: [],
                timing: '00:00',
                lyricShow: ''
            }
        },
        watch: {
            'currentLineNum': function (n, l) {
                if (!this.currentLyric) {
                    return
                }
                this.scrollTo(n)
            },
            '$store.state.currentindex': function (n, l) {
                if (n > 6) {
                    $('.van-action-sheet').scrollTop((n - 3) * 40)
                }
            },
            'duration': function (n, l) {
                this.$store.dispatch('updatecurrentduration', n)
            },
            'show': function (n, l) {
                if (!n) {
                    this.dragrecover = true
                }
            }
        },
        methods: {
            setLyricShow(n) {
                this.scrollTo(n)
            },
            scrollTo(n) {
                $('.lyric').scrollTop($('.lyric li:eq(' + n + ')')[0].offsetTop + $('.lyric li:eq(' + n + ')').height() / 2)
            },
            showsongsplayinfo(e) {
                this.showplay = true
            },
            onChange(value, el) {
                if (el.duration) {
                    el.currentTime = (value / 100) * el.duration
                    this.seek((value / 100) * el.duration)
                }
            },
            switchicon(el) {
                if (!el.duration) {
                    return
                }
                if (this.currentLyric) {
                    this.currentLyric.togglePlay()
                }
                if (el.paused) {
                    this.playflag = true
                    return el.play()
                } else {
                    this.playflag = false
                    el.pause()
                }
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
                this.formattingTime(e.target.currentTime)
                this.value = (e.target.currentTime / e.target.duration) * 100
                this.duration = e.target.duration
            },
            formattingTime(tiem) {
                if (isNaN(tiem)) {
                    this.timing = '00:00'
                }
                this.timing = this.getminuteTime(tiem) + ':' + this.getSecondTime(tiem)
            },
            getminuteTime(time) {
                if (parseInt(time / 60) < 10) {
                    return '0' + parseInt(time / 60)
                }
                return parseInt(time / 60)
            },
            getSecondTime(time) {
                if (parseInt(time % 60) < 10) {
                    return '0' + parseInt(time % 60)
                }
                return parseInt(time % 60)
            },
            seek(currentTime) {
                if (!this.currentLyric) {
                    return
                }
                this.currentLyric.seek(currentTime * 1000)
                if (this.$refs.audio.paused) {
                    this.currentLyric.stop()
                }
            },
            switchsong(newinfo, lyric) {
                this.playflag = true
                this.$refs.audio.pause()
                this.$store.dispatch('updateSongsInfo', newinfo)
                this.$store.dispatch('updatacurrentLyric', lyric)
                this.songinfo = newinfo
                this.$refs.audio.load()
                this.$refs.audio.play()
                this.resetLyricposition()
                if (!lyric) {
                    return this.currentLyric = null
                }
                this.setlyric(lyric)
            },
            setlyric(lyric) {
                if (this.currentLyric) {
                    this.currentLyric.stop()
                }
                this.currentLyric = new Lyric(lyric, this.handleLyric)
                if (!this.$refs.audio.paused) {
                    this.currentLyric.play()
                }
            },
            imgtolrc() {
                this.inturn = !this.inturn
                this.setLyricShow(this.currentLineNum)
            },
            handleLyric({lineNum, txt}) {
                this.currentLineNum = lineNum
            },
            back() {
                this.showplay = false
            },
            switchmode(e) {
                if (this.$store.state.mode == 'order') {
                    this.$store.commit('setPlayMode', 'random')
                } else if (this.$store.state.mode == 'random') {
                    this.$store.commit('setPlayMode', 'loop')
                } else if (this.$store.state.mode == 'loop') {
                    this.$store.commit('setPlayMode', 'order')
                }
            },
            showlist() {
                this.show = true
            },
            removelist(i) {
                this.$store.commit('RemoveSongsList', i)
                if (this.$store.state.songslist.length == 0) {
                    return this.$store.dispatch('updatecurrentindex', null)
                }
                let index = this.$store.state.currentindex
                if (i < index) {
                    this.$store.dispatch('updatecurrentindex', index - 1)
                } else if (i == index) {
                    if (this.$store.state.songslist.length == 0) {
                        this.$store.dispatch('updatecurrentindex', null)
                    } else if (i == this.$store.state.songslist.length) {
                        //判断是否时最后一列
                        this.$store.dispatch('updatecurrentindex', i - 1)
                        this.playsong(i - 1, this.$store.state.songslist[i - 1].id)
                    } else if (i < this.$store.state.songslist.length) {
                        //如果小于最后一列  调用后一列
                        this.playsong(i, this.$store.state.songslist[i].id)
                    }
                }
            },
            playlist(i, id) {
                this.playsong(i, id)
            },
            prev() {
                if (this.$store.state.songslist.length == 0) {
                    return window.confirm('歌曲列表为空')
                }
                this.removecurrent()
                this.clearLyric()
                if (this.$store.state.mode == 'order') {
                    let ntindex = this.$store.state.currentindex - 1
                    if (ntindex < 0) {
                        ntindex = this.$store.state.songslist.length - 1
                    }
                    this.playsong(ntindex, this.$store.state.songslist[ntindex].id)
                } else if (this.$store.state.mode == 'random') {
                    let randomlg = this.$store.state.songslist.length
                    let randomnum = parseInt(Math.random() * randomlg)
                    if (randomnum == this.$store.state.currentindex) {
                        randomnum += parseInt(Math.random() * 4)
                        if (randomnum >= randomlg) {
                            randomnum = randomnum % randomlg
                        }
                    }
                    this.playsong(randomnum, this.$store.state.songslist[randomnum].id)
                } else if (this.$store.state.mode == 'loop') {
                    this.$refs.audio.currentTime = 0
                    this.seek(0)
                    this.value = 0
                    this.resetLyricposition()
                    this.$refs.audio.play()
                    this.setlyric(this.$store.state.currentLyric)
                }

            },
            next() {
                if (this.$store.state.songslist.length == 0) {
                    return window.confirm('歌曲列表为空')
                }
                this.removecurrent()
                this.clearLyric()
                if (this.$store.state.mode == 'order') {
                    let ntindex = this.$store.state.currentindex + 1
                    if (ntindex >= this.$store.state.songslist.length) {
                        ntindex = 0
                    }
                    this.playsong(ntindex, this.$store.state.songslist[ntindex].id)
                } else if (this.$store.state.mode == 'random') {
                    let randomlg = this.$store.state.songslist.length
                    let randomnum = parseInt(Math.random() * randomlg)
                    if (randomnum == this.$store.state.currentindex) {
                        randomnum += parseInt(Math.random() * 4)
                        if (randomnum >= randomlg) {
                            randomnum = randomnum % randomlg
                        }
                    }
                    this.playsong(randomnum, this.$store.state.songslist[randomnum].id)
                } else if (this.$store.state.mode == 'loop') {
                    this.$refs.audio.currentTime = 0
                    this.seek(0)
                    this.value = 0
                    this.resetLyricposition()
                    this.$refs.audio.play()
                    this.setlyric(this.$store.state.currentLyric)
                }
            },
            end() {
                this.next()
            },
            playsong(i, id) {
                this.$store.dispatch('updatecurrentid', id)
                this.$store.dispatch('updatecurrentindex', i)
                //获取歌词
                let newsinfo = {}
                let lyric = ''
                Asynchronous({
                    type: 'get',
                    url: '/lyric',
                    params: {
                        id: this.$store.state.songslist[i].id
                    }
                }).then((ret) => {
                    if (ret.lrc) {
                        lyric = ret.lrc.lyric
                    } else {
                        lyric = null
                    }
                    return Asynchronous({
                        type: 'get',
                        url: '/check/music',
                        params: {
                            id: this.$store.state.songslist[i].id,
                        },
                    })
                }).then((ret) => {
                    if (!ret.success) {
                        this.next()
                    }
                    newsinfo = {
                        name: this.$store.state.songslist[i].name,
                        artist: this.$store.state.songslist[i].artist,
                        audiosrc: 'https://music.163.com/song/media/outer/url?id=' + this.$store.state.songslist[i].id + '.mp3',
                        pictrue_url: this.$store.state.songslist[i].picUrl
                    }
                    this.switchsong(newsinfo, lyric)
                }, ((err) => {
                    if (window.confirm('该歌曲暂无版权,是否切换下一首歌曲？')) {
                        return this.next()
                    }
                }))
            },
            hidebox() {
                this.show = false
            },
            listscroll(e) {
                if (e.target.scrollTop > 0) {
                    e.stopPropagation()
                }
            },
            transstart(e) {
                if (this.show && this.dragrecover) {
                    this.dragrecover = false
                    $('.list').scrollTop((this.$store.state.currentindex - 4) * 40)
                }
            },
            updateLyric() {
                if (this.currentLyric) {
                    SliderBound('.con-p', {
                        touchmove(el, event, defit) {
                            if (defit.Lateraldeficit <= 40) {
                                event.stopPropagation();
                            }
                        }
                    })
                }
            },
            resetLyricposition() {
                $('.lyric').scrollTop(0)
            },
            removecurrent() {
                $('.current').attr('class', '')
            },
            clearLyric() {
                if (this.currentLyric) {
                    this.currentLyric.stop()
                }
            },
            loadError() {
                this.next()
            },
            bottomboxSlide(that) {
                SliderBound('.bottombox', {
                    touchmove(el, event, defit) {
                        if (defit.Longitudinaldeficit > 0) {
                            el.style.transition = ''
                            el.style.transform = 'translateY(' + defit.Longitudinaldeficit * 1.1 + 'px)'
                        }
                    },
                    touchend(el, event, defit) {
                        if (defit.Longitudinaldeficit > 0) {
                            if (defit.Longitudinaldeficit >= el.offsetHeight / 3) {
                                el.style.transition = ''
                                el.style.transform = ''
                                that.show = false
                            } else {
                                el.style.transition = 'all 0.5s ease'
                                el.style.transform = 'translateY(0px)'
                            }
                        }
                    }
                })
            },
            listSlide() {
                SliderBound('.list', {
                    touchmove(el, event) {
                        if (el.scrollTop > 0) {
                            event.stopPropagation()
                        }
                    }
                })
            },
            RotateHide(that) {
                SliderBound($('.songsinfo-container')[0], {
                    touchmove(el, event, deficit) {
                        el.style.transition = ''
                        if (deficit.Lateraldeficit > 0) {
                            el.style.transform = 'rotateZ(' + Math.abs(deficit.Lateraldeficit) / 20 + 'deg)'
                        }
                        if (deficit.Lateraldeficit < 1) {
                            el.style.transform = 'rotateZ(0deg)'
                        }
                    },
                    touchend(el, event, deficit) {
                        if (deficit.Lateraldeficit > 0) {
                            if (Math.abs(deficit.Lateraldeficit) / 15 > 8) {
                                el.style.transition = ''
                                el.style.transform = ''
                                that.showplay = false
                            } else {
                                el.style.transition = 'transform 0.4s ease'
                                el.style.transform = 'rotateZ(0deg)'
                            }
                        }
                    }
                })
            }
        },
        created() {
            this.songinfo = this.$store.state.songinfo
            this.currentLyric = this.$store.state.currentLyric
            if (!this.currentLyric) {
                return
            }
            this.currentLyric = new Lyric(this.currentLyric, this.handleLyric)
        },
        mounted() {
            if (this.$refs.audio.paused) {
                this.playflag = false
            }
            this.totaltime = this.$refs.audio.duration
            let that = this
            this.RotateHide(this)
            this.updateLyric()
            this.bottomboxSlide(this)
            this.listSlide()
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
            lightrow() {
                // return this.$refs.audio.currentTime*1000==this.txt
            },
            list() {
                return this.$store.getters.getsongslist
            }

        },
        filters: {},
        components: {},
        directives: {
            'basictop': {
                bind(el) {
                    // el.style.height = (document.documentElement.clientHeight - 230) + 'px'
                }
            }
        }
    }
</script>
<style scoped lang="less">
    @media screen and(max-height: 420px) {
        #player {
            display: none;
        }
    }

    .middle-r {

        .text {
            line-height: 40px;
        }

    }

    .zeroheight {
        height: 0 !important;
    }

    .boxcontainer-enter, .boxcontainer-leave-to {
        transform: translateY(100%);
    }

    .boxcontainer-enter-active, .boxcontainer-leave-active {
        transition: transform 0.3s ease;
    }


    .boxmask-enter, .boxmask-leave-to {
        opacity: 0;
    }

    .boxmask-enter-active, .boxmask-leave-active {
        transition: opacity 0.6s ease;
    }

    .songcontainer-enter, .songcontainer-leave-to {
        transform: rotateZ(45deg);
    }

    .songcontainer-enter-active, .songcontainer-leave-active {
        transition: transform 0.4s ease;
    }


    .bottombox-background {
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: 1000;
        background-color: rgba(0, 0, 0, .6)
    }


    #player .songs-eachlist-current:hover {
        background-color: #ff4060;
    }

    #player .listlight {
        color: red;

        .play {
            .van-icon-volume-o {
                display: block;
            }

            b {
                color: red;
            }
        }

    }

    .van-popup--bottom {
        border-radius: 10px 10px 0 0;
    }

    .van-action-sheet__content {
        height: 373px;
        transition: transform 0.4s ease;
    }

    .bottomhide {

        transform: translateY(100%) !important;
    }

    .bottombox {
        position: fixed;
        width: 100%;
        height: 450px;
        border-radius: 15px 15px 0 0;
        background-color: #fff;
        bottom: 0px;
        z-index: 1000;
        box-shadow: 0 0 2px #484848;
    }

    .boxtran {
        transition: transform 0.3s ease;
    }

    .top {
        position: fixed;
        width: 100%;
        height: 50px;
        line-height: 50px;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        border-radius: 15px 15px 0 0;
        border-bottom: 1px solid rgba(191, 191, 191, 0.27);
        z-index: 999;

        .left {
            margin-left: 10px;
            display: flex;
            flex-direction: row;
            align-items: center;

            i {
                font-size: 20px;
                margin-right: 8px;
            }
        }

        .right {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-right: 15px;

            i {
                font-size: 20px;
            }

            i:nth-of-type(1) {
                margin-right: 3px;
            }

            b {
                margin: 0 10px;
                font-weight: 400;
                color: rgba(118, 118, 118, 0.56);
            }
        }
    }

    .list {
        padding: 50px 3px 0 10px;
        max-height: 400px;
        overflow: scroll;

        .eachlist {
            height: 40px;
            text-align: left;
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            align-items: center;

            .play {
                display: flex;
                flex-direction: row;
                align-items: center;

                .name {
                    //   overflow: hidden;
                    //   text-overflow: ellipsis;
                    //   white-space: nowrap;
                    //   width: 300px;
                }

                i {
                    margin-right: 5px;

                }

                b {
                    color: rgba(165, 162, 169, 0.71);
                }


            }

            .remove {
                .van-icon-cross {
                    color: #888888;
                    border: 10px solid transparent;
                }
            }

            i {
                font-size: 16px;
            }
        }
    }

    .fixed-songs-play {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 60px;
        background-color: #ffffff;
        display: flex;
        justify-content: space-between;
        padding: 0 7px;
        border-top: 0.2px solid rgba(138, 138, 138, 0.42);
        z-index: 9;

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
                    min-width: 40px;
                }
            }

            .songstitle {
                margin: 0 0 0px 8px;
                letter-spacing: 1px;
                font-size: 12px;
                height: 40px;
                text-align: left;

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
                border: 10px solid transparent;
            }

            i:nth-of-type(1) {
                font-size: 28px;
            }

            i:nth-of-type(2) {
                font-size: 24px;
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
        background-color: rgb(66, 94, 175);
        transform-origin: 100% 400%;
        /*transform: rotateZ(45deg);*/
        overflow: hidden;
        display: flex;
        flex-direction: column;
        z-index: 999;

        div:nth-of-type(1), div:nth-of-type(2), div:nth-of-type(3) {
            z-index: 99;
        }

        .filter {
            position: absolute;
            top: 0;
            left: 0;
            filter: blur(15px) brightness(0.8);
            transform: scale(1.2);
            width: 100%;
            height: 100%;


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
                    margin-left: 5px;

                    span {
                        text-align: left;
                    }

                    span:nth-of-type(1) {
                        font-size: 16px;
                        letter-spacing: 2px;
                        color: #fff;
                        margin-bottom: 2px;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        overflow: hidden;
                        -webkit-box-orient: vertical;

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
                        width: 40px;
                        height: 40px;
                        line-height: 40px;
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
            overflow: hidden;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: space-around;
            flex-direction: column;
            align-items: center;

            .center {
                height: 100%;
                position: relative;
                display: flex;
                justify-content: space-around;
                flex-direction: column;
                min-height: 260px;
            }

            .center-animate {
                position: relative;
                transform: translateY(50%);
                width: 260px;
                height: 260px;
                /*height: 100%;*/
                box-sizing: border-box;
                border: 10px solid #bfbcc3;
                border-radius: 50%;
                animation: songtravel 20s linear infinite;
                margin: 0 auto;
                overflow: hidden;


                img {
                    height: 100%;
                    position: relative;
                    left: 50%;
                    transform: translateX(-50%);
                }
            }

            .center-songlrc {
                width: 100%;
                height: 100%;
                color: #eee;
                position: relative;

                .lyric {
                    width: 103%;
                    height: 100%;
                    overflow: scroll;
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                }

                ul {
                    padding-bottom: 170px;
                    display: inline-block;
                    max-width: 90%;
                    min-width: 80%;
                    position: relative;
                    top: 50%;
                }

                ul > li {
                    min-height: 30px;
                    font-size: 14px;
                    position: relative;
                    line-height: 32px;
                }

                p {
                    font-size: 14px;
                    letter-spacing: 1px;
                }
            }
        }

        .bottom-info {
            /*height: 140px;*/
            display: flex;
            flex-direction: column;
            bottom: 20px;
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
                padding: 0 50px;
                font-weight: 100;

                i {
                    border: 10px solid transparent;
                }
            }

            .slider-controls {


                padding: 5px 53px;
                width: 100%;
                box-sizing: border-box;


                .current-play-time {
                    float: left;
                    margin-left: -38px;
                    margin-top: 14px;
                }

                .total-alltiem, .current-play-time {
                    color: rgba(239, 239, 239, 0.97);
                    font-size: 11px;
                }

                .total-alltiem {
                    float: right;
                    margin-right: -39px;
                    margin-top: -27px;

                }
            }

            .switchando-peratingsongs {
                display: flex;
                justify-content: space-around;
                align-items: center;
                padding: 0 30px;
                padding-bottom: 10px;

                img {
                    border: 10px solid transparent;
                }

                i {
                    color: rgba(237, 237, 237, 0.94);
                    border: 10px solid transparent;
                }

                i:nth-of-type(1), i:nth-of-type(3) {
                    font-size: 20px;
                }

                i:nth-of-type(2) {
                    font-size: 40px;
                }
            }
        }
    }


    .current {
        color: #6c7cff;
        font-size: 16px;
    }

    .icon-current {
        color: #87bfff;
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

