<template>
    <div>
        <div id="top">
            <div class="swiper-container" id="nav">
                <div class="swiper-wrapper">
                    <div class="swiper-slide">
                        <span style="color:rgba(255,72,145,1);">热卖</span></div>
                    <div class="swiper-slide">
                        <span>水果</span></div>
                    <div class="swiper-slide">
                        <span>乳品</span></div>
                    <div class="swiper-slide">
                        <span>零食</span></div>
                    <div class="swiper-slide">
                        <span>肉蛋</span></div>
                    <div class="swiper-slide">
                        <span>蔬菜</span></div>
                    <div class="swiper-slide">
                        <span>酒饮</span></div>
                    <div class="swiper-slide">
                        <span>速食</span></div>
                    <div class="swiper-slide">
                        <span>熟食</span></div>
                    <div class="swiper-slide">
                        <span>水产</span></div>
                    <div class="swiper-slide">
                        <span>粮油</span></div>
                    <div class="swiper-slide">
                        <span>轻食</span></div>
                    <div class="swiper-slide">
                        <span>火锅</span></div>
                    <div class="swiper-slide">
                        <span>日百</span></div>
                    <div class="bar">
                        <div class="color"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="swiper-container" id="page">
            <div class="swiper-wrapper">
                <div class="swiper-slide slidepage" v-for="(item,i) in 14" :key="i">
                    <div class="swiper-container scroll">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide slidescroll">
                                <ul>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

    import slider from '../../js/sliderplugin/slider-plugin'
    export default {
        data() {
            return {}
        },
        methods: {
        },
        created() {

        },
        mounted() {
            slider.setSlider()
        },
        updated() {

        },
        props: ['params']
    }
</script>
<style></style>
