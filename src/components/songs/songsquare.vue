<template>
    <div class="square-root">
        <div>
            <squareslider class="squareslider" v-if="showsquare"></squareslider>
        </div>
    </div>
</template>
<script>
    import squareslider from '@/components/template/songsquare-template'
    export default {
        name: 'Songssquare',
        data() {
            return {
                squarePosition: [],
                showsquare: true,
                firstEnter: true
            }
        },
        methods: {
            back() {
                this.$router.back()
            }
        },
        created() {

        },
        components: {
            squareslider
        },
        beforeRouteLeave(to, from, next) {
            this.firstEnter = false
            if (to.path == '/') {
                this.showsquare = false
            } else {
                this.squarePosition = []
                $('.index').each((index, item) => {
                    this.squarePosition.push({scrolltop: item.scrollTop})
                })
            }
            next()
        },
        activated() {
            if (!this.showsquare) {
                return this.showsquare = true
            }
            if (!this.firstEnter) {
                $('.index').each((index, item) => {
                    $(item).scrollTop(this.squarePosition[index].scrolltop)
                })
            }


        },
    }
</script>
<style scoped lang="less">
</style>
