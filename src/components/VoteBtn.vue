<template>
  <button class="btn" :class="smallSize ? 'small' : ''" @click="vote"><i class="vote-icon"></i>为Ta点赞</button>
</template>
<script>
import { Toast } from 'mint-ui'

export default {
  props: ['voted', 'smallSize', 'playerId'],
  data () {
    return {
    }
  },
  methods: {
    vote () {
      let url = `/data/dovotes/${this.playerId}`
      Axios({
        url: url
      }).then((res) => {
        let status = res.status
        if (status >= 200 && status < 300 && res.data.success) {
          this.voted = true
          Toast({
            message: '投票成功',
            duration: 1500
          })
        } else {
          Toast({
            message: res.data.message || '投票失败',
            duration: 1500
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~static_css/common/var';
@import '~static_css/common/mixin';
.btn {
  width: 100%;
  height: rem(80);
  line-height: rem(80);
  background: -webkit-gradient(linear, 0 0, 0 bottom, from(#2F69D4), to((#0D43A8)));
  color: #fff;
  border-radius: rem(6);
  border: 0;
  outline: none;
  &.small {
    height: rem(70);
    line-height: rem(70);
  }
  &:active {
    background: #2F69D4;
  }
  &.disabled {
    background: -webkit-gradient(linear, 0 0, 0 bottom, from(#DDDDDD), to((#A6A6A6)));
  }
  .vote-icon {
    display: inline-block;
    height: rem(28);
    width: rem(28);
    background: url(~static_img/vote.png) no-repeat center;
    background-size: 100% auto;
    margin-right: rem(10);
    vertical-align: rem(-2);
  }
}
</style>
