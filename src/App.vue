<template>
    <div id="app">
        <keep-alive include="home,Songssquare">
            <router-view @switch="switchsong" ref="musicCmp"/>
        </keep-alive>
        <player ref="player"></player>
    </div>
</template>

<script>
    import load from './components/load/loaddata.vue'
    import player from './components/player/player.vue'
    //pause
    export default {
        name: 'App',
        data() {
            return {}
        },
        methods: {
            switchsong(newinfo, lyric) {
                console.log('switch')
                this.$refs.player.switchsong(newinfo, lyric)
            },
            playlist(i) {
                this.$refs.musicCmp.playsong(i)
            },
            next(index) {
                this.$refs.musicCmp.playsong(index)
            },
            playsong(i, id) {
                this.$refs.player.playsong(i, id)
            },
            clearLyric() {
                this.$refs.player.clearLyric()
            },
            removecurrent() {
                this.$refs.player.removecurrent()
            },
            resetHeight(){
                this.$refs.player.resetLyricposition()
            }
        },
        created() {
        },
        mounted() {

        },
        updated() {

        },
        computed: {},
        watch: {}
        ,
        components: {
            load,
            player
        }
        ,
        filters: {}
    }
</script>

<style scoped lang="less">
    .custom-button {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background-color: #ffffff;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        padding-bottom: 45px;
        overflow: hidden;
        /*height: 1rem;*/
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;


    }
</style>
