import Swiper from 'swiper'

export default {
    activeIndex: 0,
    swipers: {},
    slidespeed: 300,
    init() {
        this.setSlider()
    },
    setSlider(callback) {
        const that = this
        let ReferenceError
        let navSlideWidth
        let bar
        let navSum
        let clientWidth
        let navWidth
        let topBar
        let startPosition
        let slideProgress
        let activeIndex
        let activeSlidePosition
        let navActiveSlideLeft
        let clickIndex
        let clickSlide
        //暂时设计每个slide大小需要一致
        let barwidth = 36 //导航粉色条的长度px
        let tSpeed = 300 //切换速度300ms
        let sliSpeed = 0
        var navSwiper = new Swiper('#nav', {
            slidesPerView: 6,
            freeMode: true,
            initialSlide: 0,
            on: {
                init: function () {
                    navSlideWidth = this.slides.eq(0).css('width'); //导航字数需要统一,每个导航宽度一致
                    bar = this.$el.find('.bar')
                    bar.css('width', navSlideWidth)

                    // that.transpeed(bar, 300)
                    bar.transition(tSpeed)

                    navSum = this.slides[this.slides.length - 1].offsetLeft //最后一个slide的位置
                    clientWidth = parseInt(this.$wrapperEl.css('width')) //Nav的可视宽度
                    navWidth = 0
                    for (let i = 0; i < this.slides.length; i++) {
                        navWidth += parseInt(this.slides.eq(i).css('width'))
                    }
                    topBar = this.$el.parents('body').find('#top') //页头

                },

            },
        });
        var pageSwiper = new Swiper('#page', {
            watchSlidesProgress: true,
            resistanceRatio: 0,
            initialSlide: 0,
            on: {
                touchMove: function () {
                    let progress
                    progress = this.progress
                    bar.transition(0)
                    bar.transform('translateX(' + navSum * progress + 'px)')
                    //粉色255,72,145灰色51,51,51
                    for (let i = 0; i < this.slides.length; i++) {
                        slideProgress = this.slides[i].progress
                        if (Math.abs(slideProgress) < 1) {
                            let r = Math.floor((255 - 51) * (1 - Math.pow(Math.abs(slideProgress), 2)) + 51)
                            let g = Math.floor((72 - 51) * (1 - Math.pow(Math.abs(slideProgress), 2)) + 51)
                            let b = Math.floor((145 - 51) * (1 - Math.pow(Math.abs(slideProgress), 2)) + 51)
                            navSwiper.slides.eq(i).find('span').css('color', 'rgba(' + r + ',' + g + ',' + b + ',1)')
                        }
                    }
                },
                transitionStart: function () {
                    activeIndex = this.activeIndex
                    activeSlidePosition = navSwiper.slides[activeIndex].offsetLeft
                    //释放时导航粉色条移动过渡
                    that.transpeed()
                    bar.transition(that.slidespeed)

                    //  that.transpeed(bar, tSpeed)

                    bar.transform('translateX(' + activeSlidePosition + 'px)')
                    //释放时文字变色过渡
                    if (that.slidespeed !== 0) {
                        navSwiper.slides.eq(activeIndex).find('span').transition(tSpeed)
                        navSwiper.slides.eq(activeIndex).find('span').css('color', 'rgb(255,40,78)')
                        if (activeIndex > 0) {
                            navSwiper.slides.eq(activeIndex - 1).find('span').transition(tSpeed)
                            navSwiper.slides.eq(activeIndex - 1).find('span').css('color', 'rgba(51,51,51,1)')
                        }
                        if (activeIndex < this.slides.length) {
                            navSwiper.slides.eq(activeIndex + 1).find('span').transition(tSpeed)
                            navSwiper.slides.eq(activeIndex + 1).find('span').css('color', 'rgba(51,51,51,1)')
                        }
                    }
                    //导航居中
                    navActiveSlideLeft = navSwiper.slides[activeIndex].offsetLeft //activeSlide距左边的距离

                    navSwiper.setTransition(tSpeed)
                    if (navActiveSlideLeft < (clientWidth - parseInt(navSlideWidth)) / 2) {
                        navSwiper.setTranslate(0)
                    } else if (navActiveSlideLeft > navWidth - (parseInt(navSlideWidth) + clientWidth) / 2) {
                        navSwiper.setTranslate(clientWidth - navWidth)
                    } else {
                        navSwiper.setTranslate((clientWidth - parseInt(navSlideWidth)) / 2 - navActiveSlideLeft)
                    }

                },
                slideChangeTransitionEnd: function () {

                    callback && callback(this.activeIndex)
                }
            }
        });

        // export pageSwiper
        // pageSwiper.slideTo(slideTo.index, slideTo.speed, false)
        navSwiper.$el.on('touchstart', function (e) {
            e.preventDefault() //去掉按压阴影
        })
        navSwiper.on('tap', function (e) {
            clickIndex = this.clickedIndex
            clickSlide = this.slides.eq(clickIndex)
            pageSwiper.slideTo(clickIndex, 300);
            this.slides.find('span').css('color', 'rgba(51,51,51,1)');
            clickSlide.find('span').css('color', 'rgb(255,21,76)');
            // that.sli(this, 300, pageSwiper.previousIndex)
        })
        //内容滚动
        that.swipers.navSwiper = navSwiper
        that.swipers.pageSwiper = pageSwiper

    },
    sli(nav, speed, call) {
        this.swipers.pageSwiper.slideTo(0, speed);
        let lastindex = this.swipers.pageSwiper.previousIndex
        $('#top .swiper-slide span:eq(' + lastindex + ')').css({
            'color': 'rgba(51,51,51,1)',
            'transition': 'none'
        })
        $('#top .swiper-slide span:eq(0)').css({'color': 'rgb(255,40,78)'})
        let clickSlide = nav.slides.eq(0)
        call && call()
    },
    transpeed(speed) {
        if (!speed) {
            return 300
        }
        return speed
    }

}
