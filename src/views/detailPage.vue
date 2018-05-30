<template>
  <div class="page-detail-container">
    <div class="title" v-html="detail.title"></div>
    <div class="content" v-html="detail.detail"></div>
  </div>
</template>
<script>
import { Toast } from 'mint-ui'

export default {
  data () {
    return {
      detail: {}
    }
  },
  created () {
    let url = `/data/activity/${this.$route.params.activity_id}`
    this.axios.get(url).then((res) => {
      let status = res.status
      let data = res.data

      if (status >= 200 && status < 300 && data.success) {
        this.detail = data.data[0] || {}
      } else {
        Toast({
          message: '数据加载失败',
          duration: 1500
        })
      }
    })
  }
}
</script>
<style lang="scss" scoped>
@import '~static_css/common/var';
@import '~static_css/common/mixin';
.page-detail-container {
  background: #E8E8E8;
  padding: rem(30);
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  .title {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    margin: rem(10) 0 rem(30);
    @include line-clamp(2);
  }
  .content {
    font-size: 14px;
  }
}
</style>
