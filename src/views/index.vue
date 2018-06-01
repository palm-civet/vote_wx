<template>
<div class="container">
  <AttentionPop v-if="popShowTag && pageData.public_img" :pageData="pageData" @pop-hide="popHide"></AttentionPop>
  <div class="top">
    <Banner class="banner"></Banner>
    <Tab class="tab"></Tab>
  </div>
  <div class="content-wrap">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</div>
</template>
<script>
import Banner from '@/components/Banner'
import Tab from '@/components/Tab'
import AttentionPop from '@/components/AttentionPop'
import { Toast } from 'mint-ui'

export default {
  components: {
    Banner,
    Tab,
    AttentionPop
  },
  data () {
    return {
      popShowTag: true,
      pageData: {}
    }
  },
  created () {
    this.getInitData()
  },
  methods: {
    popHide () {
      this.popShowTag = false
    },
    getInitData () {
      let url = `/data/activity/${this.$route.params.activity_id}`

      this.axios.get(url).then((res) => {
        let status = res.status
        let data = res.data

        if (status >= 200 && status < 300 && data.success) {
          this.pageData = data.data[0] || {}
          document.title = this.pageData.title
          this.setShare()
        } else {
          Toast({
            message: '列表加载失败，稍后重试',
            duration: 1500
          })
        }
      })
    },
    setShare () {
      this.wxHelper.wxShare({
        img: `http://za.jupiter.xin/uploads/${this.pageData.cover}`,
        title: this.pageData.title,
        desc: this.pageData.abstract,
        link: window.location.href
      })
    }
  },
  watch: {
    $route (res) {
      this.setShare()
    }
  }
}
</script>
<style lang='scss'>
@import '~static_css/common/mixin';
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.content-wrap {
  position: relative;
  flex: auto;
  height: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}
</style>
