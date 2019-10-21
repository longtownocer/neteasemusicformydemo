<template>
    <div id="songsquare">
        <div class="top-fixed" style="position: fixed">
            <van-icon name="arrow-left" @click="back"></van-icon>
            歌单广场
        </div>
        <div id="top">
            <div class="swiper-container" id="nav">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(item,i)  in  info.title" :key="i">
                        <span :class="{'first':i==0}">{{item}}</span>
                    </div>
                    <div class="bar">
                        <div class="color"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="swiper-container" id="page">
            <div class="swiper-wrapper">
                <div class="swiper-slide slidepage" v-for="(item,index) in info.title" :key="index">
                    <div class="swiper-container scroll">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide slidescroll index" v-cliheight>
                                <div class="all-recommendedsonglist">
                                    <router-link :to="'/resource/'+item.id" tag="div"
                                                 class="each-recommendedsonglist"
                                                 v-for="(item,i) in initialdata[index]"
                                                 :key="i">
                                        <div class="c"></div>
                                        <div class="recommend-title">{{item.name}}</div>
                                        <div class="play-times">
                                            <van-icon name="play-circle-o"/>
                                            {{item.playCount|formatCount}}
                                        </div>
                                        <img :src="item.picUrl" v-minheight alt="">
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="load"
                         :class="[(initialdata[index].length==0)?'top':'bottom',{'nomore':loadstatus[index].nomore}]">
                        <van-loading color="#ff3f46"/>
                    </div>
                    <div class="noreminfo" v-if="loadstatus[index].nomore">
                        没有更多关于此歌单的推荐
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

    import slider from '@/js/sliderplugin/slider-plugin'
    import Asynchronous from '@/api/asyc/asyc'
    import SliderBound from '@/js/slider-rebound/slider-bound'

    export default {
        data() {
            return {
                info: {
                    title: [
                        '华语',
                        '经典',
                        '流行',
                        '摇滚',
                        '民谣',
                        '电子',
                        '轻音乐',
                        '影视原声',
                        '怀旧',
                        '治愈'
                    ],
                },
                loadstatus: [
                    {state: false, nomore: false},
                    {state: false, nomore: false},
                    {state: false, nomore: false},
                    {state: false, nomore: false},
                    {state: false, nomore: false},
                    {state: false, nomore: false},
                    {state: false, nomore: false},
                    {state: false, nomore: false},
                    {state: false, nomore: false},
                    {state: false, nomore: false},
                ],
                activeIndex: 0,
                initialdata: [[], [], [], [], [], [], [], [], [], []],
                offsets: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            }
        },
        watch: {
            //监听activeIndex 确认活动页slide的索引  并加载数据
            'activeIndex': function (id, oldid) {
                if (id !== 0 && this.initialdata[id].length === 0) {
                    this.gettypesmusic(id).then((ret) => {
                        if (ret.playlists.length == 0) {
                            return this.$set(this.loadstatus[id], 'nomore', true)
                        }
                        let poparr = []
                        ret.playlists.forEach((item, i) => {
                            poparr.push({
                                name: item.name,
                                id: item.id,
                                playCount: item.playCount,
                                picUrl: item.coverImgUrl
                            })
                        })
                        this.initialdata[id] = poparr
                        this.$forceUpdate()
                    })
                }
            }
        },
        methods: {
            gettypesmusic(id) {
                //请求歌单数据
                return Asynchronous({
                    type: 'get',
                    url: '/top/playlist',
                    params: {
                        limit: 30,
                        order: 'hot',
                        cat: this.info.title[id],
                        offset: this.offsets[id]
                    }
                })
            },
            back() {
                this.$router.back()
            },
            loadmore(id, callback) {
                //加载更多
                this.offsets[id] += 1
                //数据请求
                Asynchronous({
                    type: 'get',
                    url: '/top/playlist',
                    params: {
                        limit: 30,
                        order: 'hot',
                        cat: this.info.title[id],
                        offset: this.offsets[id] * 30
                    }
                }).then((ret) => {
                    let poparr = []
                    ret.playlists.forEach((item, i) => {
                        poparr.push({
                            name: item.name,
                            id: item.id,
                            playCount: item.playCount,
                            picUrl: item.coverImgUrl
                        })
                    })
                    this.initialdata[id].push(...poparr)
                    //添加数据后回调
                    callback && callback()
                    this.$forceUpdate()
                })
            },
            hideload(index) {
                //加载图标过渡隐藏
                document.querySelectorAll('.load')[index].style.bottom = '0px'
            },
            slider(that) {
                //绑定touch事件
                SliderBound(this.getactiveEle(this.activeIndex), {
                    touchmove(el, event, defit) {
                        if (Math.abs(el.parentElement.scrollTop + document.documentElement.clientHeight - el.offsetHeight) < 1) {
                            if (defit.Longitudinaldeficit < 0) {
                                if (Math.abs(defit.Longitudinaldeficit) < 90) {
                                    document.querySelectorAll('.load')[that.activeIndex].style.bottom = Math.abs(defit.Longitudinaldeficit) + 'px'
                                } else if (Math.abs(defit.Longitudinaldeficit) >= 90) {
                                    document.querySelectorAll('.load')[that.activeIndex].style.bottom = '90px'
                                }
                            }
                        }
                    },
                    touchend(el, event, defit) {
                        if (Math.abs(el.parentElement.scrollTop + document.documentElement.clientHeight - el.offsetHeight) < 1) {
                            if (defit.Longitudinaldeficit < 0) {
                                if (Math.abs(defit.Longitudinaldeficit) < 90) {
                                    that.hideload(that.activeIndex)
                                } else if (Math.abs(defit.Longitudinaldeficit) >= 90) {
                                    if (!that.loadstatus[that.activeIndex].state) {
                                        that.loadstatus[that.activeIndex].state = true
                                        that.loadmore(that.activeIndex, (() => {
                                            that.loadstatus[that.activeIndex].state = false
                                            that.hideload(that.activeIndex)
                                        }))
                                    }

                                }
                            }

                        }
                    },
                })
            },
            getactiveEle(id) {
                //返回活动的active slider界面元素
                return document.querySelectorAll('.all-recommendedsonglist')[id]
            },
        },
        created() {
            //添加第一页默认华语  的数据
            this.gettypesmusic(0).then((ret) => {
                let poparr = []
                ret.playlists.forEach((item, i) => {
                    poparr.push({
                        name: item.name,
                        id: item.id,
                        playCount: item.playCount,
                        picUrl: item.coverImgUrl
                    })
                })
                this.initialdata[0] = poparr
                this.$forceUpdate()
            })
        },
        mounted() {
            slider.setSlider((id) => {
                //把活动页的索引第一时间赋给activeIndex
                this.activeIndex = id
            })
        },
        updated() {
            this.slider(this)
        },
        directives: {
            //让元素的高为可视区域的高
            'cliheight': {
                bind(el, budding) {
                    el.style.height = document.documentElement.clientHeight + 'px'
                }
            },
            'minheight': {
                bind(el, budding) {
                    el.style.minHeight = document.querySelector('.all-recommendedsonglist').clientWidth * 0.3 + 'px'
                }
            }
        }
    }
</script>
<style scoped lang="less">
    #songsquare {
        position: fixed;
        width: 100%;
        height: 100%;
        opacity: 0.999;
    }

    .nomore {
        display: none;
    }

    .van-loading__spinner--circular {
        border-radius: 50%;
        /*background: rgba(255, 255, 255, 0.9);*/
        background: transparent;
        box-sizing: border-box;
        padding: 3px;
    }

    .noreminfo {
        position: fixed;
        top: 140px;
        width: 100%;
        height: 40px;
        letter-spacing: 1px;
        color: #6f6f6f;
    }

    .load {
        position: fixed;
        width: 100%;
        height: 20px;
        z-index: 9999;
        transition: bottom 0.4s ease;

        span {
            background: rgba(255, 255, 255);
            box-shadow: 0 0 1px #4763ad;
        }
    }

    .bottom {
        bottom: 0;
    }

    .top {
        top: 125px;
    }


    .slidescroll {
        width: 100%;
        height: 650px;
        overflow: scroll;
    }

    .load-more {

        height: 10px;
        width: 100%;
        bottom: -20px;
        /*display: none;*/

        .van-loading {
            background: transparent;
        }
    }

    .first {
        color: rgb(255, 28, 75);
    }

    .top-fixed {
        position: fixed;
        width: 100%;
        top: 0;
        height: 60px;
        text-align: left;
        display: flex;
        justify-content: left;
        line-height: 60px;
        padding: 0 12px;
        font-size: 17px;
        background: #fff;
        z-index: 999;
        margin-bottom: 60px;

        i {
            line-height: 60px;
            font-size: 25px;

            width: 40px;
        }
    }

    .all-recommendedsonglist {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding-top: 110px;
        position: relative;
        padding-bottom: 60px;


        .each-recommendedsonglist {
            width: 30%;
            margin-bottom: 60px;
            position: relative;
            border-radius: 5px;
            min-height: 30%;
            -webkit-overflow-scrolling: touch;

            img {
                width: 100%;
                height: 100%;
                min-height: 100%;
                z-index: 9;
                border-radius: 8px;
            }

            .play-times {
                display: flex;
                flex-direction: row;
                align-items: center;
                position: absolute;
                right: 5px;
                top: 3px;
                z-index: 9;
                color: #fff;

                i {
                    margin-right: 2px;
                }
            }

            .recommend-title {
                text-overflow: ellipsis;
                font-size: 12px;
                text-align: left;
                position: absolute;
                bottom: -8px;
                transform: translateY(100%);
                left: 0;
                width: 100%;
                height: auto;
            }
        }


        /*

        */
    }

    #top {
        top: 55px;
    }


    #page .slidescroll {
        padding: 0 10px;
        box-sizing: border-box;
    }
</style>
