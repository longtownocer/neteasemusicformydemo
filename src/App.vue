<template>
    <div id="app">
        <navigation>
            <keep-alive include="home">
                <router-view @switch="switchsong"/>
            </keep-alive>
        </navigation>

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
                this.$refs.player.switchsong(newinfo, lyric)
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


    }
</style>
