<template>
  <div >
    <dl class="rank-list">
      <dt class="header">
        <span>排名</span>
        <span>姓名</span>
        <span>点赞数</span>
      </dt>
      <dd class="line" v-for="(item, index) in list" :key="index">
          <span :class="index < 3 ? 'rank rank' + index : ''">{{index + 1}}</span>
          <span>{{item.name}}</span>
          <span>{{item.count}}</span>
      </dd>
    </dl>
  </div>
</template>
<script>
import { Toast } from 'mint-ui'

export default {
  data () {
    return {
      list: []
    }
  },
  created () {
    let url = `/data/rank/${this.$route.params.activity_id}`
    this.axios.get(url).then((res) => {
      let status = res.status
      let data = res.data

      if (status >= 200 && status < 300 && data.success) {
        this.list = data.data
      } else {
        Toast({
          message: '列表加载失败，稍后重试',
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
.rank-list {
  width: rem(710);
  height: rem(765);
  background: #fff;
  border-radius: 6px;
  span {
    flex: 1;
    text-align: center;
  }
  .rank {
    color: transparent;
  }
  .rank0 {
    background: url(~static_img/rank1.png) no-repeat center;
    background-size: rem(70) auto;
  }
  .rank1 {
    background: url(~static_img/rank2.png) no-repeat center;
    background-size: rem(70) auto;
  }
  .rank2 {
    background: url(~static_img/rank3.png) no-repeat center;
    background-size: rem(70) auto;
  }
}
.header {
  height: rem(93);
  line-height: rem(93);
  color: $colorMain;
  background-color: #E8F0FF;
  display: flex;
}
.line {
  height: rem(81);
  line-height: rem(81);
  display: flex;
  border-bottom: 1px solid #E8F0FF;
  overflow: hidden;
}
</style>
