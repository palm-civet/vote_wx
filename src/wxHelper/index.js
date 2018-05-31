import axios from 'axios'
import wx from 'weixin-js-sdk'

export default class WxHelper {
  constructor() {
    this.config = {}
  }
  getConfig(url) {
    axios.get(url).then((res) => {
      let status = res.status
      let data = res.data

      if (status >= 200 && status < 300) {
        this.config = {
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.appId, // 必填，公众号的唯一标识
          timestamp: data.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.nonceStr, // 必填，生成签名的随机串
          signature: data.signature, // 必填，签名
          jsApiList: data.jsApiList // 必填，需要使用的JS接口列表
        }
        wx.config(this.config)
      } else {
        console.log('weixin分享接口获取失败')
      }
    })
  }
  weixinShareParamsSet (opt) {

    var img = opt.img
    var link = opt.link
    var desc = opt.desc
    var title = opt.title

    //分享到朋友圈
    wx.onMenuShareTimeline({
      title: title, // 分享标题
      link: link, // 分享链接
      imgUrl: img // 分享图标
    })

    //分享给好友
    wx.onMenuShareAppMessage({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: img, // 分享图标
      type: 'link', // 分享类型,music、video或link，不填默认为link
      dataUrl: '' // 如果type是music或video，则要提供数据链接，默认为空
    })

    //分享到QQ
    wx.onMenuShareQQ({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: img // 分享图标
    })

    //分享到微博
    wx.onMenuShareWeibo({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: img // 分享图标
    })

    //分享到QQ空间
    wx.onMenuShareQZone({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: img // 分享图标
    })
  }
  wxShare (opt) {
    let URL = '/data/jssdk/?url=' + encodeURIComponent(window.location.href.split('#')[0])

    opt = opt || {}
    opt = Object.assign({}, opt)
    this.getConfig(URL)

    wx.ready(() => {
      this.weixinShareParamsSet(opt)
    })
  }
}
