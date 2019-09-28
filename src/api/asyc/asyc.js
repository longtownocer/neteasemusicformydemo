export default function Asynchronous(objparams) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: objparams.type,
            url: 'http://47.106.129.158:3000' + objparams.url,  //    http://47.106.129.158:3000    http://106.13.211.74:3000
            data: objparams.params,
            xhrFields: {withCredentials: true}
        }).then((ret) => {
            resolve(ret)
        }).catch((err) => {
            reject(err)
            console.log(err)
        })
    })
}
