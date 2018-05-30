<template>
<div class="container">
  <AttentionPop v-if="popShowTag" @pop-hide="popHide"></AttentionPop>
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
      list: []
    }
  },
  created () {
    let url = `/data/ads/${this.$route.params.activity_id}`
    this.axios.get(url).then((res) => {
      let status = res.status
      let data = res.data
      if (status >= 200 && status < 300) {
        this.list = data.data.data
      } else {
        Toast({
          message: '列表加载失败，稍后重试',
          duration: 1500
        })
      }
    })
  },
  methods: {
    popHide () {
      this.popShowTag = false
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
  flex: 1;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}
</style>
