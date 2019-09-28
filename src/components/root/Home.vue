<template>
    <div class="root-home" ref="roothome">
        <div class="hello" style="position: fixed;overflow: scroll;width: 100%;height: 100%;">
            <div class="fixtop-navbar">
                <div class="fixed-topbar">
                    <div class="personnal-center">
                        <van-icon name="wap-nav"/>
                    </div>
                    <div class="top-title">
                            <span v-for="(item,i) in homechannel" :key="i"
                                  :class="{'highlighting':i==homesliderobj.activeIndex+1}" @click="switchHomeslider(i)">{{item}}</span>
                    </div>
                    <div class="search-top" @click="search">
                        <van-icon name="search"/>
                    </div>
                </div>
            </div>
            <div class="swiper-container" id="homeInfo">
                <div class="swiper-wrapper">
                    <div class="swiper-slide index">
                        <!--刷新组件-->
                        <!--顶部轮播图-->
                        <div class="carsouel-top">
                            <div class="swiper-container" id=carsouel-top>
                                <div class="swiper-wrapper">
                                    <div class="swiper-slide" v-for="(item,i) in swipercarsouel">
                                        <a :href="item.url">
                                            <img :src="item.pic"
                                                 alt="">
                                        </a>
                                        <div class="typeTitle" :class="item.titleColor">
                                            {{item.typeTitle}}
                                        </div>
                                    </div>
                                </div>
                                <!-- 如果需要分页器 -->
                                <div class="swiper-pagination" id="carsouel-pagination"></div>
                            </div>
                        </div>
                        <!--图标导航-->
                        <div class="each-channel-home">
                            <router-link tag="div" to="/songslistdetail">
                                <van-icon name="todo-list-o"/>
                                <br>
                                <span>每日推荐</span>
                            </router-link>
                            <router-link to="/songsquare" tag="div">
                                <van-icon name="service-o"/>
                                <br>
                                <span>歌单</span>
                            </router-link>
                            <div>
                                <van-icon name="bar-chart-o"/>
                                <br>
                                <span>排行榜</span>
                            </div>
                            <div>
                                <van-icon name="volume-o"/>
                                <br>
                                <span>电台</span>
                            </div>
                            <div>
                                <van-icon name="video-o"/>
                                <br>
                                <span>直播</span>
                            </div>
                        </div>
                        <!--推荐歌单-->
                        <div class="recommendedsonglist">
                            <h3>推荐歌单</h3>
                            <div class="all-recommendedsonglist">
                                <router-link :to="'/resource/'+item.id" tag="div"
                                             class="each-recommendedsonglist"
                                             v-for="(item,i) in songslistdetails"
                                             :key="i">
                                    <div class="recommend-title">{{item.name}}</div>
                                    <div class="play-times">
                                        <van-icon name="play-circle-o"/>
                                        {{item.playCount|formatCount}}
                                    </div>
                                    <img :src="item.picUrl" alt="">
                                </router-link>
                            </div>
                        </div>
                        <!--新碟专辑-->
                        <!-- <div class="album">
                             <div class="album-title">
                                 <span>新碟</span><b>|</b><span>新歌</span>
                             </div>
                             <div class="album-list">
                                 <div class="each-album-list" v-for="(item,i) in 3">
                                     <div class="current-album-list-title">
                                         梅梅新专辑
                                     </div>
                                 </div>
                             </div>
                         </div>-->
                    </div>

                    <div class="swiper-slide index">
                        更新中....
                    </div>

                    <div class="swiper-slide index">
                        更新中....
                    </div>
                </div>
            </div>
        </div>
        <transition name="search">
            <search v-if="$store.state.search" class="searchbox"></search>
        </transition>
    </div>
</template>
<script>
    import Swiper from 'swiper'
    import Asynchronous from '@/api/asyc/asyc.js'
    import search from '@/components/search/search'
    export default {
        name: 'home',
        data() {
            return {
                sliderflag: this.$route.path == '/1',
                baseUrl: this.$store.state.baseUrl,
                songslistdetails: [],
                swipercarsouel: [],
                homechannel: ['我的', '发现', '视频', '更多'],
                homesliderobj: {},
                isLoading: false,
                SlidePosition: []
            }
        },
        methods: {
            //获取歌单详情
            getSonglistdetails() {
                Asynchronous({
                    type: 'get',
                    url: '/personalized',
                    params: {
                        limit: 15
                    }
                }).then((ret) => {
                    this.songslistdetails = ret.result
                })
            },
            getSwipercarsouel() {
                Asynchronous({
                    type: 'get',
                    url: '/banner',
                    params: {
                        type: 1,
                        timestamp: Date.now
                    }
                }).then((ret) => {
                    this.swipercarsouel = ret.banners
                })
            },
            onRefresh() {
                setTimeout(() => {
                    this.$toast('加载成功');
                    this.isLoading = false;
                    this.count++;
                }, 10000);
            },
            switchHomeslider(i) {
                if (i == 0) {
                    return
                }
                this.homesliderobj.slideTo(i - 1, 500, false)
            },
            search() {
                this.$store.state.search = !this.$store.state.search
            },
            searchToPlay(i, id) {
                this.$parent.playsong(i, id)
            },
            SlideSwiper() {
                if ($('#carsouel-top .swiper-slide').length == 9) {
                    new Swiper('#carsouel-top', {
                        autoplay: true,
                        speed: 300,
                        loop: true,
                        scrollbar: {
                            el: '.swiper-wrapper'
                        },
                        pagination: {
                            el: '#carsouel-pagination'
                        },
                    })
                }
            },
            SlideChannel() {
                this.homesliderobj = new Swiper('#homeInfo', {
                    paginationClickable: true,
                    watchOverflow: true
                })
            },
            resetSong() {
                this.$parent.clearLyric()
                this.$parent.removecurrent()
                this.$parent.resetHeight()
            }
        },
        created() {
            this.getSonglistdetails()
            this.getSwipercarsouel()
            this.$store.state.search = false
        },
        mounted() {
            this.SlideChannel()
        },
        updated() {
            this.SlideSwiper()
        },
        beforeRouteLeave(to, from, next) {
            this.SlidePosition = []
            $('.index').each((index, item) => {
                this.SlidePosition.push({scrolltop: item.scrollTop})
            })
            this.SlidePosition.push()
            next()
        },
        beforeRouteEnter(to, from, next) {
            next()
        },
        activated() {
            if (this.SlidePosition.length == 0) {
                return
            }
            $('.index').each((index, item) => {
                $(item).scrollTop(this.SlidePosition[index].scrolltop)
            })
        },
        components: {
            search
        }
    }
</script>
<style scoped lang="less">
    .search-enter, .search-leave-to {
        opacity: 0;
        transform: translateY(100%);
    }

    .search-enter-active, .search-leave-active {
        transition: all 0.5s ease;
    }

    #fresh .van-pull-refresh__head {
        top: 0px;
        background-color: #ff868b;

    }

    .van-pull-refresh__track {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .searchbox {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: #fff;
        top: 0;
        left: 0;
        z-index: 9;
    }


    .highlighting {
        font-weight: 800;
    }

    .root-home {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: scroll;
    }

    #homeInfo {
        height: 100%;

        .swiper-wrapper {
            height: 100%;

            .swiper-slide {
                height: 100%;
                overflow: scroll;
            }
        }
    }

    #carsouel-top {
        .swiper-wrapper {
            .swiper-slide {
                position: relative;

                img {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }

                .typeTitle {
                    position: absolute;
                    bottom: 0px;
                    right: 0px;
                    color: #fff;
                    padding: 5px;
                }
            }
        }
    }

    .album {
        padding: 0 20px 90px;

        .album-title {
            text-align: left;
            /*padding-left: 20px;*/
            letter-spacing: 1px;
            /*font-size: 16px;*/
            font-weight: 700;
            margin: 10px;


            b {
                color: rgba(143, 143, 143, 0.73);
                font-weight: 300;
                margin: 0 5px;
            }
        }

        .album-list {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;

            .each-album-list {
                width: 110px;
                height: 110px;
                background-color: #ffce7d;
                position: relative;

                .current-album-list-title {
                    position: absolute;
                    bottom: -8px;
                    transform: translateY(100%);
                    width: 100%;
                    text-align: left;
                }
            }
        }
    }

    .recommendedsonglist {
        padding: 0 20px;
        padding-bottom: 70px;
        border-top: 0.3px solid rgba(44, 44, 52, 0.58);


        h3 {
            text-align: left;
            margin: 20px 0;
        }

        .all-recommendedsonglist {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            overflow: scroll;

            .each-recommendedsonglist {
                width: 30%;
                margin-bottom: 60px;
                position: relative;
                border-radius: 5px;

                img {
                    width: 100%;
                    height: 100%;
                    /* vertical-align: center;
                     position: absolute;
                     top: 0;
                     left: 0;*/
                    z-index: 999;
                    border-radius: 8px;
                }

                .play-times {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    position: absolute;
                    right: 5px;
                    top: 3px;
                    z-index: 999;
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
        }
    }


    .fixed-topbar {
        display: flex;
        justify-content: space-around;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9;
        width: 100%;
        background-color: #fff;
        /*padding: 0 15px;*/

        .top-title {
            padding: 12px 0;
            width: 70%;
            display: flex;
            justify-content: space-around;

            span {
                font-size: 13px;
                border: 10px solid transparent;
            }
        }

        .search-top, .personnal-center {

            i {
                margin-top: 20px;
                font-size: 20px;
            }
        }

        .search-top {
            margin-right: 13px;
        }

        .personnal-center {
            margin-left: 8px;
        }

    }


    .each-channel-home {
        height: 60px;
        display: flex;
        justify-content: space-around;
        padding: 0 5px;
        margin: 20px 0;

        div {
            i {
                font-size: 22px;
                height: 40px;
                width: 40px;
                background-color: #ff1a3a;
                line-height: 40px;
                border-radius: 50%;
            }

            i::before {
                color: #fff;
            }

            span {
                font-size: 10px;
                margin-top: 10px;
                display: inline-block;
            }
        }
    }

    .carsouel-top {
        margin-top: 52px;
        padding: 10px 20px;

        .swiper-container {
            border-radius: 5px;
            width: 100%;
            height: 120px;
        }
    }

    .my-bullet {
        span {
            width: 6px;
            height: 6px;
        }
    }

    .blue {
        background-color: #5674d5;
        border-radius: 5px 0 5px 0;
    }

    .red {
        background-color: #ee3851;
        border-radius: 5px 0 5px 0;
    }

</style>

