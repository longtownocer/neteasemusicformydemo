export default function SliderBound(selector, paramsobj) {
    var obj = null
    if (typeof selector == "string") {
        obj = document.querySelector(selector)
    } else {
        obj = selector
    }
    if (obj) {
        let startposition = null
        let endposition = null
        let Lateraldeficit = 0//横向逆差
        let Longitudinaldeficit = 0 //纵向逆差
        obj.addEventListener('touchstart', function (e) {
            startposition = {
                x: e.touches[0].pageX,
                y: e.touches[0].pageY
            }
            paramsobj.touchstart && paramsobj.touchstart(this, e)
        })
        obj.addEventListener('touchmove', function (e) {
            endposition = {
                x: e.touches[0].pageX,
                y: e.touches[0].pageY
            }
            Lateraldeficit = endposition.x - startposition.x
            Longitudinaldeficit = endposition.y - startposition.y
            paramsobj.touchmove && paramsobj.touchmove(this, e, {
                Lateraldeficit,
                Longitudinaldeficit
            })
        })
        obj.addEventListener('touchend', function (e) {
            paramsobj.touchend && paramsobj.touchend(this, e, {
                Lateraldeficit,
                Longitudinaldeficit
            })
            Lateraldeficit = 0
            Longitudinaldeficit = 0
        })
        if (paramsobj.transitionend) {
            obj.addEventListener('transitionend', function (e) {
                paramsobj.transitionend(this, e)
            })
        }
    }
}
