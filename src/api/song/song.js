export default {
    Asynchronous(obj) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: obj.type,
                url: 'http://localhost:3000' + obj.url,
                data: obj.params
            }).then((ret) => {
                resolve(ret)
            }).catch((err) => {
                console.log(err)
            })
        })
    },
    getsonglyric(callback) {
        this.Asynchronous({
            type: 'get',
            url: '/lyric',
            params: {
                id: 133998
            }
        }).then((ret) => {
            this.lyric = ret.lrc.lyric
            callback(ret.lrc.lyric)
        })

    },
}
