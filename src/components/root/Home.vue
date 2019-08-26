<template>
    <keep-alive>

        <div class="root-home" ref="roothome">


            <div class="hello">
                <!--滑动组件-->
<!--                <slider  v-if="sliderflag" :params="slideParams"></slider>-->
                <!--        <router-link to="/login">登录</router-link>-->
                <!--顶部固定栏-->
                <div class="fixtop-navbar">
                    <div class="fixed-topbar">
                        <div class="personnal-center">
                            <van-icon name="wap-nav"/>
                        </div>
                        <div class="top-title">
                            <span v-for="(item,i) in homechannel" :key="i"
                                  :class="{'highlighting':i==homesliderobj.activeIndex+1}" @click="switchHomeslider(i)">{{item}}</span>
                        </div>
                        <div class="search-top">
                            <van-icon name="search"/>
                        </div>
                    </div>
                </div>
                <van-pull-refresh v-model="isLoading" id="fresh" @refresh="onRefresh" pulling-text="正在加载中"
                                  loosing-text="正在加载中">
                    <div class="swiper-container" id="homeInfo">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide">

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
                                            <!-- <div class="swiper-slide">Slide 2</div>
                                             <div class="swiper-slide">Slide 3</div>-->
                                        </div>
                                        <!-- 如果需要分页器 -->
                                        <div class="swiper-pagination" id="carsouel-pagination"></div>
                                    </div>
                                </div>
                                <!--图标导航-->
                                <div class="each-channel-home">
                                    <router-link tag="div" to="/songslistdetail" @click="tosongslist">
                                        <van-icon name="todo-list-o"/>
                                        <br>
                                        <span>每日推荐</span>
                                    </router-link>
                                    <div>
                                        <van-icon name="service-o"/>
                                        <br>
                                        <span>歌单</span>
                                    </div>
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
                                        <div class="each-recommendedsonglist" v-for="(item,i) in songslistdetails"
                                             :key="i">
                                            <div class="recommend-title">{{item.name}}</div>
                                            <div class="play-times">
                                                <van-icon name="play-circle-o"/>
                                                {{item.playCount}}
                                            </div>
                                            <img :src="item.picUrl" alt="">
                                        </div>

                                    </div>
                                </div>
                                <!--新碟专辑-->
                                <div class="album">
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
                                </div>

                            </div>
                            <div class="swiper-slide">
                                <img style="width: 100%;"
                                     src="http://p1.music.126.net/nc1OrpVFlWO2Z-5klBmHiA==/109951164306742829.jpg"
                                     alt="">
                            </div>
                            <div class="swiper-slide">
                                <img style="width: 100%;"
                                     src="http://p1.music.126.net/nc1OrpVFlWO2Z-5klBmHiA==/109951164306742829.jpg"
                                     alt="">
                            </div>
                        </div>
                    </div>
                </van-pull-refresh>
            </div>
        </div>

    </keep-alive>
    <!-- activeIndex -->
</template>

<script>
    import slider from '../slidecomponents/slider.vue'
    import Swiper from 'swiper'

    export default {
        name: 'home',
        data() {
            return {
                msg: 'Welcome to Your Vue.js App',
                sliderflag: this.$route.path == '/1',
                baseUrl: 'http://localhost:3000',
                songslistdetails: [],
                swipercarsouel: [],
                homechannel: ['我的', '发现', '云村', '视频'],
                homesliderobj: {},
                isLoading: false,
                slideParams: {
                    title:[
                        {name:'我的'},
                        {name:'发现'},
                        {name:'云村'},
                        {name:'视频'},
                    ]
                }
            }
        },
        methods: {
            //获取歌单详情
            getSonglistdetails() {
                this.Asynchronous({
                    type: 'get',
                    url: '/personalized',
                    params: {
                        limit: 9
                    }
                }).then((ret) => {
                    this.songslistdetails = ret.result
                    //console.log(this.songslistdetails)
                })
            },
            getSwipercarsouel() {
                this.Asynchronous({
                    type: 'get',
                    url: '/banner',
                    params: {
                        type: 1,
                        timestamp: Date.now
                    }
                }).then((ret) => {
                    this.swipercarsouel = ret.banners
                    // console.log(this.swipercarsouel)
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
            tosongslist() {

            },
            onRefresh() {
                setTimeout(() => {
                    this.$toast('加载成功');
                    this.isLoading = false;
                    this.count++;
                }, 1000);
            },
            switchHomeslider(i) {
                //slideTo(0, 1000, false);
                if (i == 0) {
                    return
                }
                this.homesliderobj.slideTo(i - 1, 500, false)
            }
        },
        created() {
            this.getSonglistdetails()
            this.getSwipercarsouel()
        },
        mounted() {
            this.homesliderobj = new Swiper('#homeInfo', {
                paginationClickable: true,
                watchOverflow: true
            })
        },
        updated() {
            if ($('#carsouel-top .swiper-slide').length == 9) {
                new Swiper('#carsouel-top', {
                    // autoplay: true,
                    speed: 300,
                    loop: true,
                    scrollbar: {
                        el: '.swiper-wrapper'
                    },
                    // 如果需要分页器
                    pagination: {
                        el: '#carsouel-pagination'
                    },
                })
            }

        },
        components: {
            slider
        }
    }
</script>
<!--
当你创建一个Swiper实例时是否立即初始化。
如果禁止了，可以稍后使用mySwiper.init()来初始化。

<script language="javascript">
var mySwiper = new Swiper('.swiper-container',{
  init: false,
})
mySwiper.init();//现在才初始化
</script>

-->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    #fresh .van-pull-refresh__head {
        top: 0px;
        background-color: #ff868b;

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

    .homeInfo {
        width: 100%;
        height: 100%;
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
        /*padding-bottom: 100px;*/
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
                height: 110px;
                width: 110px;
                margin-bottom: 60px;
                background-color: #4e484c;
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
            margin-top: 20px;
            margin-bottom: 15px;
            width: 70%;
            display: flex;
            justify-content: space-around;

            span {
                font-size: 13px;
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

        /* div {
             font-size: 25px;
             height: 40px;
             width: 40px;
             background-color: #ff2e6d;
             border-radius: 50%;

             i {
                 height: 100%;
                 line-height: 40px;
                 color: #fff;
             }
         }*/
    }

    .carsouel-top {
        margin-top: 52px;
        padding: 10px 20px;

        .swiper-container {
            border-radius: 5px;
            width: 100%;
            height: 120px;
            background-color: #79ffc0;
        }
    }

    .my-bullet {
        span {
            width: 6px;
            height: 6px;
        }

        /*background-color: #ffc9aa;*/
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
<!--

  let navWidthof = 0
            let barwidth = 36 //导航粉色条的长度px
            let tSpeed = 300 //切换速度300ms
            var navSwiper = new Swiper('#nav', {
                slidesPerView: 6,
                freeMode: true,
                on: {
                    init: function () {
                        let navSlideWidth = this.slides.eq(0).css('width'); //导航字数需要统一,每个导航宽度一致
                        let bar = this.$el.find('.bar')
                        bar.css('width', navSlideWidth)
                        bar.transition(tSpeed)
                        let navSum = this.slides[this.slides.length - 1].offsetLeft //最后一个slide的位置

                        let clientWidth = parseInt(this.$wrapperEl.css('width')) //Nav的可视宽度
                        let navWidth = 0
                        for (let i = 0; i < this.slides.length; i++) {
                            navWidth += parseInt(this.slides.eq(i).css('width'))
                        }
                        navWidthof = navWidthof
                        let topBar = this.$el.parents('body').find('#top') //页头

                    },

                },
            });

            var pageSwiper = new Swiper('#page', {
                watchSlidesProgress: true,
                resistanceRatio: 0,
                on: {
                    touchMove: function () {
                        let progress
                        let bar = this.$el.find('.bar')
                        let navSum = this.slides[this.slides.length - 1].offsetLeft

                        progress = this.progress
                        bar.transition(0)
                        bar.transform('translateX(' + navSum * progress + 'px)')
                        //粉色255,72,145灰色51,51,51
                        for (let i = 0; i < this.slides.length; i++) {
                            let slideProgress = this.slides[i].progress
                            if (Math.abs(slideProgress) < 1) {
                                let r = Math.floor((255 - 51) * (1 - Math.pow(Math.abs(slideProgress), 2)) + 51)
                                let g = Math.floor((72 - 51) * (1 - Math.pow(Math.abs(slideProgress), 2)) + 51)
                                let b = Math.floor((145 - 51) * (1 - Math.pow(Math.abs(slideProgress), 2)) + 51)
                                navSwiper.slides.eq(i).find('span').css('color', 'rgba(' + r + ',' + g + ',' + b + ',1)')
                            }
                        }
                    },
                    transitionStart: function () {
                        let navWidth = navWidthof
                        let bar = this.$el.find('.bar')
                        let activeIndex = this.activeIndex
                        let activeSlidePosition = navSwiper.slides[activeIndex].offsetLeft
                        let clientWidth = parseInt(this.$wrapperEl.css('width'))
                        let navSlideWidth = this.slides.eq(0).css('width');
                        //释放时导航粉色条移动过渡
                        bar.transition(tSpeed)
                        bar.transform('translateX(' + activeSlidePosition + 'px)')
                        //释放时文字变色过渡
                        navSwiper.slides.eq(activeIndex).find('span').transition(tSpeed)
                        navSwiper.slides.eq(activeIndex).find('span').css('color', 'rgba(255,72,145,1)')
                        if (activeIndex > 0) {
                            navSwiper.slides.eq(activeIndex - 1).find('span').transition(tSpeed)
                            navSwiper.slides.eq(activeIndex - 1).find('span').css('color', 'rgba(51,51,51,1)')
                        }
                        if (activeIndex < this.slides.length) {
                            navSwiper.slides.eq(activeIndex + 1).find('span').transition(tSpeed)
                            navSwiper.slides.eq(activeIndex + 1).find('span').css('color', 'rgba(51,51,51,1)')
                        }
                        //导航居中
                        let navActiveSlideLeft = navSwiper.slides[activeIndex].offsetLeft //activeSlide距左边的距离

                        navSwiper.setTransition(tSpeed)
                        if (navActiveSlideLeft < (clientWidth - parseInt(navSlideWidth)) / 2) {
                            navSwiper.setTranslate(0)
                        } else if (navActiveSlideLeft > navWidth - (parseInt(navSlideWidth) + clientWidth) / 2) {
                            navSwiper.setTranslate(clientWidth - navWidth)
                        } else {
                            navSwiper.setTranslate((clientWidth - parseInt(navSlideWidth)) / 2 - navActiveSlideLeft)
                        }

                    },
                }
            });
            navSwiper.$el.on('touchstart', function (e) {
                e.preventDefault() //去掉按压阴影
            })
            navSwiper.on('tap', function (e) {

                clickIndex = this.clickedIndex
                clickSlide = this.slides.eq(clickIndex)
                pageSwiper.slideTo(clickIndex, 0);
                this.slides.find('span').css('color', 'rgba(51,51,51,1)');
                clickSlide.find('span').css('color', 'rgba(255,72,145,1)');
            })

            //内容滚动
            var scrollSwiper = new Swiper('.scroll', {
                //65是头部的高
                //36是top地址和搜索的高

                slidesOffsetBefore: 72,
                direction: 'vertical',
                freeMode: true,
                slidesPerView: 'auto',

                mousewheel: {
                    releaseOnEdges: true,
                },
                on: {
                    touchMove: function () {
                        let topBar = this.$el.parents('body').find('#top') //页头

                        if (this.translate > 72 - 36 && this.translate < 72) {
                            topBar.transform('translateY(' + (this.translate - 72) + 'px)');
                        }

                    },
                    touchStart: function () {
                        let startPosition = this.translate
                    },
                    touchEnd: function () {
                        let topBar = this.$el.parents('body').find('#top') //页头
                        topBar.transition(tSpeed)
                        if (this.translate > 36 && this.translate < 72 && this.translate < startPosition) {
                            topBar.transform('translateY(-36px)');
                            for (sc = 0; sc < scrollSwiper.length; sc++) {
                                if (scrollSwiper[sc].translate > 36) {
                                    scrollSwiper[sc].setTransition(tSpeed);
                                    scrollSwiper[sc].setTranslate(36)
                                }
                            }
                        }
                        if (this.translate > 36 && this.translate < 72 && this.translate > startPosition) {
                            topBar.transform('translateY(0px)');
                            for (sc = 0; sc < scrollSwiper.length; sc++) {
                                if (scrollSwiper[sc].translate < 72 && scrollSwiper[sc].translate > 0) {
                                    scrollSwiper[sc].setTransition(tSpeed);
                                    scrollSwiper[sc].setTranslate(72)
                                }
                            }
                        }
                    },

                    transitionStart: function () {
                        let topBar = this.$el.parents('body').find('#top') //页头
                        topBar.transition(tSpeed)
                        if (this.translate < 72 - 36) {
                            topBar.transform('translateY(-36px)');
                            if (scrollSwiper) {
                                for (sc = 0; sc < scrollSwiper.length; sc++) {
                                    if (scrollSwiper[sc].translate > 36) {
                                        scrollSwiper[sc].setTransition(tSpeed);
                                        scrollSwiper[sc].setTranslate(36)
                                    }
                                }
                            }

                        } else {
                            topBar.transform('translateY(0px)');

                            if (scrollSwiper) {
                                for (sc = 0; sc < scrollSwiper.length; sc++) {
                                    if (scrollSwiper[sc].translate < 72 && scrollSwiper[sc].translate > 0) {
                                        scrollSwiper[sc].setTransition(tSpeed);
                                        scrollSwiper[sc].setTranslate(72)
                                    }
                                }
                            }
                        }
                    },
                }

            })
          /*  //热卖
            var bannerSwiper = new Swiper('.banner', {
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                    type: 'fraction',
                    renderFraction: function (currentClass, totalClass) {
                        return '<span class="' + currentClass + '"></span>' + '/' + '<span class="' + totalClass + '"></span>';
                    },
                },
            });*/

-->
