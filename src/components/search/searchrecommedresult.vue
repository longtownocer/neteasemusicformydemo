<template>
    <div class="search" id="sear">
        <div class="conut">
            <div class="back">
                <span class="iconfont icon-icon-return" @click="back"></span>
            </div>
            <div class="searchobx">
                <input type="search" v-focus v-model="keywords" placeholder="搜索歌单内歌曲">
            </div>
        </div>
        <div class="searchList" v-top>
            <div class="eachList" v-if="searchresult" v-for="(item,i) in searchresult"
                 :class="[{'red':item.id==$store.state.currentid},{'last':i==searchresult.length-1}]"
                 @click="playsong(indexs[i],item.id)">
                <div class="name">{{item.name}}</div>
                -
                <div class="artist">{{item.artist}}</div>
            </div>
        </div>
        <div class="nofound" v-show="searchresult!==null&&searchresult.length==0">
            未找到与"{{keywords}}"相关的内容
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                keywords: '',
                searchresult: null,
                indexs: []
            }
        },
        watch: {
            keywords(n, l) {
                this.$emit('searchs', n, ((ret, indexs) => {
                    console.log(ret)
                    this.$set(this, 'searchresult', ret)
                    this.$set(this, 'indexs', indexs)
                }))
            }
        },
        methods: {
            back() {
                this.$parent.hideSearch()
            },
            playsong(i, id) {
                this.$parent.play(i, id)
            }
        },
        directives: {
            'top': {
                inserted(el, bind) {
                    el.style.height = (document.documentElement.clientHeight - 75) + 'px'
                    el.style.overflow = 'scroll'
                }
            },
            'focus': {
                inserted(el, bind) {
                    el.focus()
                }
            }
        }
    }
</script>
<style lang="less" scoped>


    input::-webkit-input-placeholder {
        /* placeholder颜色  */
        color: rgba(143, 143, 143, 0.91);
        /* placeholder字体大小  */
        letter-spacing: 2px;
        font-size: 14px;
    }

    #sear .last {
        margin-bottom: 90px;
    }

    #sear .red {
        color: red;
        font-weight: 14px;
        box-shadow: 0 0 3px #f00;
        border: 1px solid #f00;

        .artist {
            color: red;
        }

    }

    .search {
        z-index: 888;

        .conut {
            display: flex;
            align-items: center;
            height: 75px;
            box-sizing: border-box;
            padding-left: 5px;

            .back {
                margin-top: 2px;

                span {
                    font-size: 25px;
                    border: 10px solid transparent;
                }
            }

            .searchobx {
                width: 80%;
                text-align: left;
                border-bottom: 1px solid #5c5c5c;
                margin-left: 5px;

                input {
                    font-size: 14px;
                    width: 100%;
                    border: none;
                    padding-bottom: 5px;
                    padding-right: 5px;
                    letter-spacing: 1px;
                }
            }
        }

        .nofound {
            letter-spacing: 1px;
            font-size: 13px;
            color: #6b6b6b;
            position: fixed;
            top: 80px;
            width: 100%;
        }

        .searchList {
            padding: 10px 15px;

            .eachList {
                text-align: left;
                overflow: scroll;
                display: flex;
                padding-left: 20px;
                align-items: center;
                letter-spacing: 2px;
                height: 35px;
                margin-bottom: 7px;
                border-radius: 5px;
                border: 0.5px solid rgba(77, 130, 116, 0.86);
                box-shadow: 0 0 10px rgba(27, 87, 142, 0.93);

                .name {
                    width: 60%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    font-size: 14px;
                }

                .artist {
                    white-space: nowrap;
                    color: #929292;
                }
            }
        }

    }
</style>
