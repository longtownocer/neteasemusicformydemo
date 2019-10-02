<template>
        <div class="search-root">
            <div class="top">
                <div class="back" @click="hide">
                    <span class="iconfont icon-icon-return"></span>
                </div>
                <div class="searchbox">
                    <input type="serch" v-model="keywords" ref="searchs" :placeholder="defaultkeyword"
                           maxlength="20"
                           @keypress="searchsongs($event)">
                    <span class="iconfont iconguanbi" v-show="keywords.length!==0"
                          @click="clearwords($refs.searchs)"></span>
                </div>
                <div class="singer">
                    <span class="iconfont iconuser"></span>
                </div>
            </div>
            <div class="recommendedlist" v-show="searchflag">
                <div class="title">
                    <b>热搜榜</b>
                </div>
                <div class="list" v-for="(item,i) in searchlist" :class="{'last':i==searchlist.length-1}"
                     @click="keysearch(item.searchWord)">
                    <div class="rank" :class="{'red':i<=2}">{{i+1}}</div>
                    <div class="content">
                        <div class="up">
                            <b>{{item.searchWord}}</b>
                            <span>{{item.score}}</span>
                            <span>
                                    <img :src="item.iconUrl" alt="" v-if="item.iconUrl!==undefined"
                                         :class="{'speacial':item.iconType==5}">
                                </span>
                        </div>
                        <div class="down">
                            {{item.content}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="search-result">
                <div id="top" ref="tabbar" :class="{'hideleft':searchflag}">
                    <div class="swiper-container" id="nav">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide" v-for="(item,i)  in  searchtype" :key="i">
                                <span :class="{'first':i==0}">{{item.name}}</span> <!--:class="{'first':i==0}"-->
                            </div>
                            <div class="bar">
                                <div class="color"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="swiper-container" id="page">
                    <div class="swiper-wrapper">
                        <!--综合-->
                        <div class="swiper-slide slidepage songs comprehensive" v-cliheight>
                            <div class="list-container">
                                <div class="hole">
                                    <div class="title" v-show="commonlist[0].length!==0">
                                        <b>单曲</b>
                                        <div class="playall">
                                            <van-icon name="play-circle-o"></van-icon>
                                            播放全部
                                        </div>
                                    </div>
                                    <div class="list" v-for="(item,i) in commonlist[0]" :key="i"
                                         @click="pushPlay(item.id,item.name,item.artists,item.picUrl)">
                                        <div class="left">
                                    <span>
                                        <b>{{item.name}}</b>
                                        <span v-if="item.alianame!==undefined">
                                            ({{item.alianame}})
                                        </span>
                                    </span>
                                            <span v-if="item.artists"> {{item.artists|formatatists}} - {{item.alname}}</span>
                                        </div>
                                        <div class="right">
                                            <span class="iconfont icongengduo1"></span>
                                        </div>
                                    </div>
                                    <div class="more-text">
                                        <span>{{moreText}}</span>
                                        <van-icon name="arrow"></van-icon>
                                    </div>
                                </div>
                                <div class="nofind" v-show="maxlength[0]==-1&&commonlist[0].length==0">
                                    未找到与"{{lastkeywords}}"相关的内容
                                </div>
                                <div class="load" v-show="commonlist[0].length==0&&maxlength[0]!==-1"
                                     style="top: 0;background: #fff;">
                                    <van-loading color="#ff3f46"/>
                                </div>
                            </div>
                        </div>
                        <!--单曲-->
                        <div class="swiper-slide slidepage songs" v-cliheight>

                            <div class="list-container" v-cliheight>
                                <div class="hole">
                                    <div class="play-choice" v-show="commonlist[1].length!==0">
                                        <div class="left">
                                            <span><van-icon name="play-circle-o"></van-icon></span>
                                            <span class="crls">播放全部</span>
                                        </div>
                                        <div class="right">
                                            <span><van-icon name="bars"></van-icon></span>
                                            <span class="ls">多选</span>
                                        </div>
                                    </div>
                                    <div class="list" @click="Single(item.id,item.name,item.artists)"
                                         v-for="(item,i) in commonlist[1]" :key="i"
                                         v-if="commonlist[1].length!==0"
                                         :class="[{'last':i+1==commonlist[1].length},{'first-list':i==0}]">
                                        <div class="left">
                                    <span>
                                        <b>{{item.name}}</b>
                                    </span>
                                            <span v-if="item.artists">{{item.artists|formatatists}} - {{item.albumname}}</span>
                                            <span v-if="item.alias.length!==0">{{item.alias[0]}}</span>
                                        </div>
                                        <div class="right">
                                            <span class="iconfont iconmv" v-if="item.mvid!==0"></span> <!---->
                                            <span class="iconfont icongengduo1"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="nofind" v-show="maxlength[1]==-1&&commonlist[1]==0">
                                    未找到与"{{lastkeywords}}"相关的内容
                                </div>
                                <div class="load"
                                     :class="[{'bottomhide': commonlist[1]!==0||maxlength[1]==-1 },{'topshow':commonlist[1]==0&&maxlength[1]!==-1}]">
                                    <van-loading color="#ff3f46"/>
                                </div>
                            </div>

                        </div>
                        <!--视频-->
                        <div class="swiper-slide slidepage video" v-cliheight>
                            <div class="list-container" v-cliheight>
                                <div class="hole">
                                    <div class="video-list" v-for="(item,i) in commonlist[2]" :key="i"
                                         :class="[{'list-end':i==commonlist[2].length-1},{'first-list':i==0}]">
                                        <!--first-list-->
                                        <div class="avatar">
                                            <img :src="item.coverUrl" alt="">
                                            <div class="playcount">
                                                <span class="iconfont iconbofang2"></span>
                                                <span>{{item.playTime|formatCount}}</span>
                                            </div>
                                        </div>
                                        <div class="videoinfo">
                                            <div class="title">
                                                <div class="mv" v-if="item.type==0">MV</div>
                                                <div class="des">{{item.title}}</div>
                                            </div>
                                            <div class="bottom">
                                                <div class="duration">
                                                    {{item.durationms/1000|formatsongtime}}<!--formatsongtime-->
                                                </div>
                                                <div class="artists" v-if="item.creator">
                                                    {{item.creator|formatatists}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="load"
                                     :class="[
                                     {'bottomhide': commonlist[2]!==0||maxlength[2]==-1 },
                                     {'topshow':commonlist[2]==0&&maxlength[2]!==-1}]">
                                    <!--  -->
                                    <van-loading color="#ff3f46"/>
                                </div>
                                <div class="nofind" v-show="maxlength[2]==-1&&commonlist[2]==0">
                                    未找到与"{{lastkeywords}}"相关的内容
                                </div>
                            </div>

                        </div>
                        <!--歌手-->
                        <div class="swiper-slide slidepage singer" v-cliheight>
                            <div class="list-container" v-cliheight>
                                <div class="hole">
                                    <div class="singerlist" v-for="(item,i) in commonlist[3]" :key="i"
                                         :class="{'list-end':i==commonlist[3].length-1}">
                                        <div class="avatar">
                                            <div class="img">
                                                <img :src="item.img1v1Url" alt="">
                                            </div>
                                            <div class="artist">
                                                {{item.name}}
                                            </div>
                                        </div>
                                        <div class="right">
                                            <div class="singericon">
                                                <span class="iconfont iconuser"></span>
                                            </div>
                                            <div class="status">
                                                已入驻
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="load" :class="[
                                {'bottomhide': commonlist[3]!==0||maxlength[3]==-1 },
                                {'topshow':commonlist[3]==0&&maxlength[3]!==-1}]"> <!--  -->
                                    <van-loading color="#ff3f46"/>
                                </div>
                                <div class="nofind" v-show="maxlength[3]==-1&&commonlist[3]==0">
                                    未找到与"{{lastkeywords}}"相关的内容
                                </div>
                            </div>

                        </div>
                        <!--专辑-->
                        <div class="swiper-slide slidepage album" v-cliheight>
                            <div class="list-container" v-cliheight>
                                <div class="hole">
                                    <div class="albumlist" v-for="(item,i) in commonlist[4]"
                                         :class="{'list-end':i==commonlist[4].length-1}">
                                        <div class="avatar">
                                            <img :src="item.blurPicUrl" alt="">
                                        </div>
                                        <div class="title">
                                            <div class="name">{{item.name}}</div>
                                            <div class="artist">
                                                <div class="art">{{item.artist}}</div>
                                                <div class="date">{{item.publishTime|dateformat}}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="load" :class="[
                                {'bottomhide': commonlist[4]!==0||maxlength[4]==-1 },
                                {'topshow':commonlist[4]==0&&maxlength[4]!==-1}]"> <!--  -->
                                    <van-loading color="#ff3f46"/>
                                </div>
                                <div class="nofind" v-show="maxlength[4]==-1&&commonlist[4]==0">
                                    未找到与"{{lastkeywords}}"相关的内容
                                </div>
                            </div>
                        </div>
                        <!--歌单-->
                        <div class="swiper-slide slidepage recommend" v-cliheight>
                            <div class="list-container" v-cliheight>
                                <div class="hole">
                                    <div class="recommendlist" v-for="(item,i) in commonlist[5]"
                                         :class="{'list-end':i==commonlist[5].length-1}">
                                        <div class="avatar">
                                            <img :src="item.coverImgUrl" alt="">
                                        </div>
                                        <div class="title">
                                            <div class="name">{{item.name}}</div>
                                            <div class="numinfo">
                                                <div class="length">{{item.trackCount}}首</div>
                                                <div class="by">by</div>
                                                <div class="art">{{item.artist}}，播放{{item.playCount}}次</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="load" :class="[
                                {'bottomhide': commonlist[5]!==0||maxlength[5]==-1 },
                                {'topshow':commonlist[5]==0&&maxlength[5]!==-1}]"> <!--  -->
                                    <van-loading color="#ff3f46"/>
                                </div>
                                <div class="nofind" v-show="maxlength[5]==-1&&commonlist[5]==0">
                                    未找到与"{{lastkeywords}}"相关的内容
                                </div>
                            </div>
                        </div>
                        <!--电台-->
                        <div class="swiper-slide slidepage radio" v-cliheight>
                            <div class="list-container" v-cliheight>
                                <div class="hole">
                                    <div class="title" v-show="commonlist[6].length!==0">
                                        <b>电台</b>
                                    </div>
                                    <div class="radiolist" v-for="(item,i) in commonlist[6]" :key="i"
                                         :class="{'list-end':i==commonlist[6].length-1}">
                                        <div class="avatar">
                                            <img :src="item.picUrl" alt="">
                                        </div>
                                        <div class="title">
                                            <div class="name">{{item.name}}</div>
                                            <div class="artist">
                                                {{item.artist}}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="load" :class="[
                                {'bottomhide': commonlist[6]!==0||maxlength[6]==-1 },
                                {'topshow':commonlist[6]==0&&maxlength[6]!==-1}]"> <!--  -->
                                    <van-loading color="#ff3f46"/>
                                </div>
                                <div class="nofind" v-show="maxlength[6]==-1&&commonlist[6]==0">
                                    未找到与"{{lastkeywords}}"相关的内容
                                </div>
                            </div>
                        </div>
                        <!--用户-->
                        <div class="swiper-slide slidepage user" v-cliheight>
                            <div class="list-container" v-cliheight>
                                <div class="hole">
                                    <div class="userlist" v-for="(item,i) in commonlist[7]" :key="i"
                                         :class="{'list-end':i==commonlist[7].length-1}">
                                        <div class="left">
                                            <div class="avatar">
                                                <img :src="item.avatarUrl" alt="">
                                            </div>
                                            <div class="userinfo">
                                                <div class="nickname">
                                                    <div class="name">{{item.nickname}}</div>
                                                    <div class="gender">
                                                    <span class="iconfont iconnv"
                                                          :class="[{'user-blue':item.gender==1},{'user-pink':item.gender==2}]"
                                                          v-if="item.gender!==0"></span>
                                                    </div>
                                                </div>
                                                <div class="signature" v-adaptation
                                                     v-if="item.signature.trim().length!==0">
                                                    {{item.signature}}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="attention">
                                            + 关注
                                        </div>
                                    </div>
                                </div>
                                <div class="load" :class="[
                                {'bottomhide': commonlist[7]!==0||maxlength[7]==-1 },
                                {'topshow':commonlist[7]==0&&maxlength[7]!==-1}]"> <!--  -->
                                    <van-loading color="#ff3f46"/>
                                </div>
                                <div class="nofind" v-show="maxlength[7]==-1&&commonlist[7]==0">
                                    未找到与"{{lastkeywords}}"相关的内容
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>
<script>
    import SliderBound from '@/js/slider-rebound/slider-bound'
    import Asynchronous from '@/api/asyc/asyc'
    import slider from '@/js/sliderplugin/slider-plugin'
    export default {
        name: 'search',
        data() {
            return {
                keywords: '',
                searchlist: [],
                defaultkeyword: '',
                realkeyword: '',
                searchflag: true,
                tests: false,
                searchtype: [
                    {name: '综合', type: 1018, defaultlimit: 5, offset: 0, isloadmore: false},
                    {name: '单曲', type: 1, defaultlimit: 20, offset: 0, isloadmore: false},
                    {name: '视频', type: 1014, defaultlimit: 20, offset: 0, isloadmore: false},
                    {name: '歌手', type: 100, defaultlimit: 20, offset: 0, isloadmore: false},
                    {name: '专辑', type: 10, defaultlimit: 25, offset: 0, isloadmore: false},
                    {name: '歌单', type: 1000, defaultlimit: 20, offset: 0, isloadmore: false},
                    {name: '电台', type: 1009, defaultlimit: 10, offset: 0, isloadmore: false},
                    {name: '用户', type: 1002, defaultlimit: 20, offset: 0, isloadmore: false}
                ],
                commonlist: [[], [], [], [], [], [], [], []],
                maxlength: [0, 0, 0, 0, 0, 0, 0, 0],
                songs: [],
                currentindex: 0,
                moreText: '',
                lastkeywords: '',
                isloadmore: false,
            }
        },
        methods: {
            clearwords(el) {
                el.focus()
                this.keywords = ''
            },
            keysearch(word) {
                this.keywords = word
                this.searchTo()
            },
            getsearchlist() {
                return Asynchronous({
                    type: 'get',
                    url: '/search/hot/detail'
                })
            },
            getsearchkeywords() {
                return Asynchronous({
                    type: 'get',
                    url: '/search/default'
                })
            },
            searchsongs(e) {
                if (e.keyCode == 13) {
                    this.searchTo()
                }
            },
            searchTo() {
                this.$refs.searchs.blur()
                if (this.searchflag) {
                    slider.slidespeed = 0
                    slider.sli(slider.swipers.navSwiper, 0, (() => {
                        slider.slidespeed = 300
                    }))
                    this.searchflag = !this.searchflag
                }
                //综合搜索
                if (this.keywords.trim().length == 0) {
                    this.keywords = this.realkeyword
                }
                if (this.lastkeywords !== this.keywords) {
                    this.commonlist = [[], [], [], [], [], [], [], []]
                    this.maxlength = [0, 0, 0, 0, 0, 0, 0, 0]
                    this.searchtype.some((item, i) => {
                        if (item.offset !== 0) {
                            item.offset = 0
                        }
                    })
                    this.searchcurrent(this.currentindex)
                    this.againsearch()
                } else {
                    this.$refs.searchs.blur()
                }
                this.lastkeywords = this.keywords
            },
            searchs(n) {
                return Asynchronous({
                    type: 'get',
                    url: '/search',
                    params: {
                        keywords: this.keywords,
                        type: this.searchtype[n].type,
                        limit: this.searchtype[n].defaultlimit,
                        offset: this.searchtype[n].offset * this.searchtype[n].defaultlimit
                    }
                })
            },
            pushPlay(id, name, artist, picUrl) {
                let c = artist
                if (c.length >= 2) {
                    c = c.join('/')
                } else if (c.length == 1) {
                    c = c[0]
                }
                let that = this
                this.$store.commit('InsertSearchResult', {
                    id, name, artist: c, picUrl,
                    call(flag, index) {
                        that.$parent.resetSong()
                        if (flag) {
                            that.$parent.searchToPlay(that.$store.state.currentindex + 1, id)
                        } else {
                            that.$parent.searchToPlay(index, id)
                        }
                    }
                })
            },
            Single(id, name, artists) {
                Asynchronous({
                    type: 'get',
                    url: '/song/detail',
                    params: {
                        ids: id
                    }
                }).then((ret) => {
                    let picUrl = ret.songs[0].al.picUrl
                    this.pushPlay(id, name, artists, picUrl)
                })
            },
            //综合
            comprehensive(n) {
                this.searchs(0).then((ret) => {
                    if (!ret.result.song) {
                        return this.$set(this.maxlength, n, -1)
                    }
                    ret.result.song.songs.forEach((item, i) => {
                        this.commonlist[0].push({   //把push改成赋值
                            id: item.id,
                            name: item.name,
                            picUrl: item.al.picUrl,
                            alname: item.al.name
                        })
                        if (item.alia.length > 0) {
                            this.commonlist[0][i].alianame = item.alia[0]
                        }
                        this.commonlist[0][i].artists = []
                        if (item.ar.length == 1) {
                            this.commonlist[0][i].artists.push(item.ar[0].name)
                        }
                        if (item.ar.length >= 2) {
                            item.ar.forEach((el, index) => {
                                this.commonlist[0][i].artists.push(el.name)
                            })
                        }
                    })
                    this.moreText = ret.result.song.moreText
                })
            },
            songsresults(n, call) {
                this.searchs(n).then((ret) => {
                    if (!ret.result.songs) {
                        return this.$set(this.maxlength, n, -1)
                    }
                    this.maxlength[n] = ret.result.songCount
                    ret.result.songs.forEach((item, i) => {
                        this.commonlist[1].push({
                            id: item.id,
                            name: item.name,
                            mvid: item.mvid,
                            albumname: item.album.name,
                            alias: item.alias
                        })
                        this.commonlist[1][i + this.getoffset(n)].artists = []
                        if (item.artists.length == 1) {
                            this.commonlist[1][i + this.getoffset(n)].artists.push(item.artists[0].name)
                        }
                        if (item.artists.length >= 2) {
                            item.artists.forEach((em, index) => {
                                this.commonlist[1][i + this.getoffset(n)].artists.push(em.name)
                            })
                        }
                    })
                    if (this.maxlength[n] !== 0 && this.commonlist[n].length >= this.maxlength[n]) {
                        return this.nomore()
                    }
                    call && call()
                    this.searchtype[n].offset += 1
                })
            },
            videoresults(n, call) {
                this.searchs(n).then((ret) => {
                    if (!ret.result) {
                        return this.$set(this.maxlength, n, -1)
                    }
                    this.maxlength[n] = ret.result.videoCount
                    ret.result.videos.forEach((item, i) => {
                        this.commonlist[n].push({
                            coverUrl: item.coverUrl,
                            vid: item.vid,
                            title: item.title,
                            playTime: item.playTime,
                            durationms: item.durationms,
                            type: item.type
                        })
                        this.commonlist[n][i + this.getoffset(n)].creator = []
                        if (item.creator.length == 1) {
                            this.commonlist[n][i + this.getoffset(n)].creator.push(item.creator[0].userName)
                        } else if (item.creator.length >= 2) {
                            item.creator.forEach((em, index) => {
                                this.commonlist[n][i + this.getoffset(n)].creator.push(em.userName)
                            })
                        }
                    })
                    if (this.maxlength[n] !== 0 && this.commonlist[n].length >= this.maxlength[n]) {
                        return this.nomore()
                    }
                    call && call()
                    this.searchtype[n].offset += 1
                })
            },
            singerresults(n, call) {
                this.searchs(n).then((ret) => {
                    if (ret.result.artistCount === 0) {
                        return this.$set(this.maxlength, n, -1)
                    }
                    this.maxlength[n] = ret.result.artistCount
                    ret.result.artists.forEach((item, i) => {
                        this.commonlist[n].push({
                            id: item.id,
                            img1v1Url: item.img1v1Url,
                            name: item.name
                        })
                    })
                    if (this.maxlength[n] !== 0 && this.commonlist[n].length >= this.maxlength[n]) {
                        return this.nomore()
                    }
                    call && call()
                    this.searchtype[n].offset += 1
                })
            },
            albumresults(n, call) {
                this.searchs(n).then((ret) => {

                    if (ret.result.albumCount === 0) {

                        return this.$set(this.maxlength, n, -1)
                    }
                    if (!ret.result.albums) {
                        return this.nomore()
                    }
                    this.maxlength[n] = ret.result.albumCount
                    ret.result.albums.forEach((item, i) => {
                        this.commonlist[n].push({
                            name: item.name,
                            id: item.id,
                            blurPicUrl: item.blurPicUrl,
                            artist: item.artist.name,
                            publishTime: item.publishTime
                        })
                    })
                    if (this.maxlength[n] !== 0 && this.commonlist[n].length >= this.maxlength[n]) {
                        return this.nomore()
                    }
                    call && call()
                    this.searchtype[n].offset += 1
                })
            },
            recommendresults(n, call) {
                this.searchs(n).then((ret) => {
                    if (ret.result.playlistCount === 0) {
                        return this.$set(this.maxlength, n, -1)
                    }
                    this.maxlength[n] = ret.result.playlistCount
                    ret.result.playlists.forEach((item, i) => {
                        this.commonlist[n].push({
                            name: item.name,
                            coverImgUrl: item.coverImgUrl,
                            id: item.id,
                            trackCount: item.trackCount,
                            playCount: item.playCount,
                            artist: item.creator.nickname
                        })
                    })
                    if (this.maxlength[n] !== 0 && this.commonlist[n].length >= this.maxlength[n]) {
                        return this.nomore()
                    }
                    call && call()
                    this.searchtype[n].offset += 1
                })
            },
            radioresults(n, call) {
                this.searchs(n).then((ret) => {
                    if (!ret.result.djRadios) {
                        return this.$set(this.maxlength, n, -1)
                    }
                    ret.result.djRadios.forEach((item, i) => {
                        this.commonlist[n].push({
                            name: item.name,
                            id: item.id,
                            artist: item.dj.nickname,
                            picUrl: item.picUrl
                        })
                    })
                    if (this.maxlength[n] !== 0 && this.commonlist[n].length >= this.maxlength[n]) {
                        return this.nomore()
                    }
                    call && call()
                    this.searchtype[n].offset += 1
                })
            },
            userresults(n, call) {
                this.searchs(n).then((ret) => {
                    if (ret.result.userprofileCount === 0) {
                        return this.$set(this.maxlength, n, -1)
                    }
                    this.maxlength[n] = ret.result.userprofileCount
                    ret.result.userprofiles.forEach((item, i) => {
                        this.commonlist[n].push({
                            userId: item.userId,
                            avatarUrl: item.avatarUrl,
                            gender: item.gender,
                            nickname: item.nickname,
                            signature: item.signature
                        })
                    })
                    if (this.maxlength[n] !== 0 && this.commonlist[n].length >= this.maxlength[n]) {
                        return this.nomore()
                    }
                    call && call()
                    this.searchtype[n].offset += 1
                })
            },
            SlideTo() {
                let active = $('.swiper-slide-active .list-container')[0]
                let hole = $('.swiper-slide-active .hole')
                let that = this
                let loadmore = $('.swiper-slide-active .load')
                SliderBound(active, {
                    touchmove(el, event, deficit) {
                        if (Math.abs(el.scrollTop + el.offsetHeight - hole.height()) <= 1 && that.currentindex !== 0) {
                            if (that.commonlist[that.currentindex].length >= that.maxlength[that.currentindex]) {
                                return
                            }
                            if (that.searchtype[that.currentindex].isloadmore) {
                                return
                            }
                            if (deficit.Longitudinaldeficit < 0) {
                                if (Math.abs(deficit.Longitudinaldeficit) >= 80) {
                                    loadmore.css({
                                        'transform': `translateY(-80px)`
                                    })
                                } else {
                                    loadmore.css({
                                        'transform': `translateY(${deficit.Longitudinaldeficit}px)`
                                    })
                                }

                            }


                        }
                    },
                    touchend(el, event, deficit) {
                        if (Math.abs(el.scrollTop + el.offsetHeight - hole.height()) <= 1 && that.currentindex !== 0) {
                            if (that.commonlist[that.currentindex].length >= that.maxlength[that.currentindex]) {
                                return
                            }
                            if (that.searchtype[that.currentindex].isloadmore) {
                                return
                            }
                            if (Math.abs(deficit.Longitudinaldeficit) >= 80) {
                                if (!that.searchtype[that.currentindex].isloadmore) {
                                    that.searchtype[that.currentindex].isloadmore = true
                                    that.searchcurrent(that.currentindex, (() => {
                                        that.searchtype[that.currentindex].isloadmore = false
                                        loadmore.css({
                                            'transform': ``
                                        })
                                    }))
                                }
                            } else {
                                loadmore.css({
                                    'transform': ``
                                })
                            }

                        }

                    }
                })
            },
            getoffset(n) {
                return this.searchtype[n].defaultlimit * this.searchtype[n].offset
            },
            hide() {
                if (!this.searchflag) {
                    this.keywords = ''
                    return this.searchflag = !this.searchflag
                }
                this.lastkeywords = ''
                this.commonlist = [[], [], [], [], [], [], [], []]
                this.$store.state.search = !this.$store.state.search
            },
            loading(n) {
                if (this.searchtype[n].offset >= 1) {
                    this.isloadmore = false
                }
            },
            searchcurrent(n, call) {
                switch (n) {
                    case 0:
                        this.comprehensive(n, call);
                        break;
                    case 1:
                        this.songsresults(n, call);
                        break;
                    case 2:
                        this.videoresults(n, call);
                        break;
                    case  3:
                        this.singerresults(n, call);
                        break;
                    case 4:
                        this.albumresults(n, call);
                        break;
                    case 5:
                        this.recommendresults(n, call);
                        break;
                    case 6:
                        this.radioresults(n, call);
                        break;
                    case 7:
                        this.userresults(n, call);
                        break;
                }
            },
            againsearch(n) {
                $('.swiper-slide-active .load').css({
                    'display': 'block'
                })
            },
            nomore() {
                $('.swiper-slide-active .load').css({
                    'display': 'none'
                })
            },
        },
        watch: {
            currentindex(n, l) {
                if (this.commonlist[n].length == 0) {
                    this.searchcurrent(n)
                }
            },
        },
        computed: {},
        created() {
            //排行榜
            this.getsearchlist().then((ret) => {
                ret.data.forEach((item, i) => {
                    this.searchlist.push({
                        searchWord: item.searchWord,
                        score: item.score,
                        content: item.content,
                        iconType: item.iconType
                    })
                    if (item.iconType >= 1) {
                        this.searchlist[i].iconUrl = item.iconUrl
                    }
                })
            })
            //获取关键字
            this.getsearchkeywords().then((ret) => {
                this.defaultkeyword = ret.data.showKeyword
                this.realkeyword = ret.data.realkeyword

            })
        },
        mounted() {
            slider.setSlider((id, el) => {
                this.currentindex = id
            })
            this.$refs.searchs.focus()
        },
        updated() {
            this.SlideTo()
        },
        components: {},
        filters: {
            'formatatists': function (arr) {
                if (arr.length == 1) {
                    return arr[0]
                } else if (arr.length >= 2) {
                    return arr.join('/')
                }
            }
        },
        directives: {
            'adaptation': {
                bind: function (el, binding) {

                },
                inserted: function (el, binding) {
                    el.style.width = document.documentElement.offsetWidth * 0.57 + 'px'
                }
            },
            'nofind': {
                inserted: function (el, binding) {

                }
            },
            'cliheight': {
                bind(el, bingding) {
                    el.style.height = (document.documentElement.clientHeight - 88) + 'px'
                }
            }
        }
    }
</script>
<style scoped lang="less">
    .comprehensive {
        .load {
            line-height: 70px;
        }
    }

    .list-container {
        .load {
            vertical-align: middle;
            position: fixed;
            width: 100%;
            max-height: 30px;
            transition: transform 0.5s ease;

            span {
                background: rgba(255, 255, 255);
                box-shadow: 0 0 1px #4763ad;
                border-radius: 50%;
                box-sizing: border-box;
                padding: 2px;
            }

            /*background-color: #fff;*/
        }

        .nofind {
            position: absolute;
            width: 100%;
            height: 100px;
            line-height: 100px;
            font-size: 13px;
            color: #767676;
            top: 0;
            background-color: #fff;
        }
    }

    #app #page .bottomhide {
        bottom: 0;
        text-align: center;
    }

    .topshow {
        background-color: #fff;
        top: 30px;
    }

    .play-choice {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        align-items: center;
        padding: 10px 15px;
        z-index: 99;
        border-radius: 10px 10px 0 0;

        div {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            span {
                display: inline-block;
                line-height: 100%;
                height: 100%;

                i {
                    font-size: 20px;
                }
            }

            .crls {
                font-size: 14px;
                margin-left: 6px;
                font-weight: '黑体';
            }

            .ls {
                margin-left: 2px;
                font-size: 13px;
            }

        }
    }

    .user-blue {
        color: #3b76d4;
    }

    .user-pink {
        color: #ff0e67;
    }

    .list-end {
        padding-bottom: 80px !important;
    }

    #page .user {
        .userlist {
            display: flex;
            justify-content: space-between;
            padding: 10px 15px;
            align-items: center;
            text-align: left;

            .left {
                display: flex;
                align-items: center;
            }

            .avatar {
                width: 50px;
                height: 50px;

                img {
                    height: 100%;
                    width: 100%;
                    border-radius: 50%;
                }
            }

            .userinfo {
                padding-left: 10px;

                .nickname {
                    display: flex;
                    align-items: center;

                    .name {
                        color: #3b76d4;
                        font-size: 13px;
                        letter-spacing: 1px;
                    }

                    .gender {
                        padding-left: 5px;

                        span {
                            font-size: 12px;
                        }
                    }

                }

                .signature {
                    padding-top: 5px;
                    font-size: 11px;
                    color: #7c7c7c;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    max-height: 15px;
                }
            }

            .attention {
                width: 60px;
                height: 20px;
                border: 1px solid #fc2b5b;
                text-align: center;
                line-height: 20px;
                border-radius: 10px;
                color: #fc2b5b;
                font-size: 12px;
                /*margin-left:5px;*/

            }

        }
    }

    #page .radio {
        .title {
            text-align: left;
            font-size: 13px;
            padding: 10px 15px;
        }

        .radiolist {
            display: flex;
            align-items: center;
            padding: 5px 15px;
            text-align: left;

            .avatar {
                width: 50px;
                height: 50px;

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 5px;
                }
            }

            .title {
                padding-left: 15px;

                .name {
                    color: #3b76d4;
                    font-size: 13px;
                }

                .artist {
                    font-size: 11px;
                    padding-top: 5px;
                    color: #777777;
                }
            }
        }
    }

    #page .recommend {
        .recommendlist {
            display: flex;
            align-items: center;
            text-align: left;
            padding: 5px 15px;

            .avatar {
                width: 50px;
                height: 50px;

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 5px;
                }
            }

            .title {
                padding-left: 15px;

                .name {
                    color: #3b76d4;
                    font-size: 13px;
                }

                .numinfo {
                    display: flex;
                    font-size: 11px;
                    padding-top: 3px;
                    align-items: center;
                    color: #7b7b7b;

                    .art, .by {
                        margin-left: 5px;
                    }
                }
            }
        }
    }

    #page .album {
        .albumlist {
            display: flex;
            align-items: center;
            padding: 5px 15px;

            .avatar {
                width: 50px;
                height: 50px;

                img {
                    border-radius: 5px;
                    width: 100%;
                    height: 100%;
                }
            }

            .title {
                padding-left: 20px;
                text-align: left;

                .name {
                    color: #4a7dcc;
                    font-size: 13px;
                }

                .artist {
                    padding-top: 3px;
                    display: flex;
                    font-size: 11px;
                    color: #919191;
                    display: flex;
                    align-items: center;

                    .art {
                        margin-right: 5px;
                    }
                }
            }
        }
    }

    #page .singer {
        .singerlist {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 15px;

            .avatar {
                display: flex;
                align-items: center;
                padding: 10px 0;

                .img {
                    width: 50px;
                    height: 50px;

                    img {
                        border-radius: 50%;
                        width: 100%;
                        height: 100%;
                    }
                }

                .artist {
                    margin-left: 10px;
                    font-size: 13px;
                }
            }

            .right {
                display: flex;

                .singericon {
                    border-radius: 50%;
                    background-color: #ff1f51;
                    color: #fff;
                    height: 18px;
                    width: 18px;
                    margin-right: 7px;

                    span {
                        font-size: 13px;
                        line-height: 18px;
                    }
                }
            }
        }
    }

    #app .hideleft {
        transform: translateX(-100%) !important;
        transition: transform 0.1s ease;
    }

    #app #top {
        top: 45px;
    }

    .first {
        color: rgb(255, 21, 76);
    }

    .first-list {
        padding-top: 10px !important;
    }

    #page {
        .swiper-wrapper {
            margin-top: 38px;
        }
    }

    #app #page .slidepage {
        /*height: 535px;*/


        .list-container {
            overflow: scroll;
            height: 100%;
            position: fixed;
            width: 100%;
        }
    }

    .last {
        padding-bottom: 70px !important;
    }


    #app .lastvideo {
        padding-bottom: 75px !important;
    }

    #page .video {
        .video-list {
            display: flex;
            padding-left: 15px;
            padding-right: 15px;
            padding-bottom: 12px;

            .avatar {
                position: relative;

                .playcount {
                    position: absolute;
                    right: 5px;
                    top: 5px;
                    color: #fff;
                    display: flex;
                    align-items: center;

                    span {
                        font-size: 11px;
                        height: 15px;
                        line-height: 15px;
                    }

                    span::before {
                        font-size: 13px;
                    }
                }

                img {
                    width: 120px;
                    border-radius: 5px;
                }
            }

            .videoinfo {
                margin-left: 15px;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                box-sizing: border-box;
                /*padding: 13px 0;*/

                .bottom {
                    display: flex;
                    align-items: center;
                }

                .title {
                    text-align: left;

                    .mv {
                        border: 1px solid #ff723f;
                        color: #ff3665;
                        border-radius: 2px;
                        box-sizing: border-box;
                        /*padding: 0 12px;*/
                        padding: 2px 3px 1px 3px;

                        font-size: 10px;
                        max-height: 16px;
                        max-width: 23px;
                        display: inline;
                    }

                    .des {
                        display: inline;
                        line-height: 18px;
                    }

                }

                .bottom {
                    color: #818181;

                    .duration {
                        font-size: 12px;
                        margin-right: 5px;
                    }
                }
            }
        }

    }

    .songs {
        .title {
            display: flex;
            justify-content: space-between;
            padding: 0 20px;
            margin: 20px 0;

            b {
                font-size: 14px;
            }

            .playall {
                display: flex;
                align-items: center;
                justify-content: space-around;
                border: 1px solid #ccc;
                width: 75px;
                padding: 0 5px;
                box-sizing: border-box;
                border-radius: 9px;
            }
        }

        .list {
            display: flex;
            justify-content: space-between;
            padding: 0 20px;
            padding-bottom: 20px;

            .left {
                display: flex;
                flex-wrap: wrap;
                flex-direction: column;
                text-align: left;
                width: 80%;

                b {
                    color: #436ab4;
                    font-size: 13px;
                    font-weight: 500;
                }

                span {
                    color: #999999;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    width: 100%;
                }

                span:nth-of-type(1) {
                    font-size: 13px;
                }

                span:nth-of-type(3) {
                    font-size: 10px;
                }
            }

            .right {
                display: flex;
                align-items: center;

                span {
                    font-size: 20px;
                    font-weight: 400;
                    color: #8e8e8e;
                }

                span:nth-of-type(2) {
                    margin-left: 10px;
                }
            }
        }

        .more-text {
            color: #9c9c9c;
            display: flex;
            align-items: center;
            justify-content: center;
            padding-bottom: 120px;
        }
    }

    .search-root {

        position: fixed;
        overflow: hidden;

        .top {
            display: flex;
            justify-content: space-around;
            height: 40px;
            align-items: center;
            margin-top: 10px;
            z-index: 999;

            .searchbox {
                border-bottom: 1px solid #6d6d6d;
                position: relative;

                input {
                    border: none;
                    border-color: transparent;
                    width: 260px;
                    font-size: 13px;
                    padding-right: 25px;
                    padding-bottom: 5px;
                    padding-top: 5px;
                }

                input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
                    color: #9c9c9c;
                    font-size: 13px;
                    letter-spacing: 1px;
                }

                span {
                    position: absolute;
                    bottom: -2px;
                    right: 0;
                    color: #595959;
                    border: 10px solid transparent;
                }

            }

            .back {

            }

            .back, .singer {
                span {
                    border: 10px solid transparent;
                    display: inline-block;
                    font-size: 22px;
                }

            }

            .singer {
                span {
                    margin-bottom: 6px;
                }
            }
        }

        .speacial {
            width: 15px !important;
        }

        .red {
            color: red;
        }

        .recommendedlist {
            padding: 0 15px;
            overflow: scroll;
            height: 573px;

            .title {
                text-align: left;
                padding: 15px 0;
                margin-left: 5px;
            }

            .list {
                display: flex;
                justify-content: start;
                margin-bottom: 15px;


                .content {
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: column;


                    .up {
                        display: flex;
                        justify-content: start;

                        span {
                            color: #ababab;
                            margin-left: 8px;

                            img {
                                width: 30px;
                            }
                        }
                    }

                    .down {
                        color: #a8a8a8;
                        font-size: 11px;
                    }
                }

                .rank {
                    width: 40px;
                    height: 40px;
                    text-align: center;
                    line-height: 32px;
                    font-size: 15px;
                }
            }
        }
    }
</style>
