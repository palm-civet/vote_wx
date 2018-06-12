<template>
  <div class="banner-wrap" v-if="list.length">
    <mt-swipe :auto="4000">
      <mt-swipe-item  class="banner-item" v-for="item in list" v:key="item.img">
        <a :href="item.href ? item.href : 'javascript:void(0)'">
          <img class="banner" :src="`http://za.jupiter.xin/uploads/${item.img}`" alt="图片">
        </a>
      </mt-swipe-item>
    </mt-swipe>
  </div>
</template>
<script>
import Vue from 'vue'
import { Toast, Swipe, SwipeItem } from 'mint-ui'

Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)

export default {
  data () {
    return {
      list: []
    }
  },
  created () {
    let url = `/data/ads/${this.$route.params.activity_id}`
    this.axios.get(url).then((res) => {
      let status = res.status
      let data = res.data
      if (status >= 200 && status < 300 && data.success) {
        this.list = data.data
      } else {
        Toast({
          message: '广告数据加载失败',
          duration: 1500
        })
      }
    })
  }
}
</script>
<style lang="scss">
@import '~static_css/common/var';
@import '~static_css/common/mixin';
.banner-wrap {
  height: rem(332);
  background-color: #eee;
  overflow: hidden;
  position: relative;
  .banner,
  .banner-item {
    height: rem(332);
    width: 100%;
  }
  .mint-swipe-indicator {
    background: rgba(0,0,0,.3);
  }
  .mint-swipe-indicator.is-active {
    background: rgba(255,255,255,.7);
  }
}
</style>
