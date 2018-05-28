<template>
  <div class="footer">
    <div class="content-area">
      <input name="" id="" class="content-input" placeholder="写评论..." :value="comment"></input>
      <img src="~static_img/keyboard.png" alt="" class="emoji-btn">
    </div>
    <div class="send-btn" @click="postData">发送</div>
  </div>
</template>
<script>
import { Toast } from 'mint-ui'
export default {
  data () {
    return {
      comment: ''
    }
  },
  methods: {
    postData () {
      let url = `/data/comment/${this.$route.params.activity_id}`
      this.axios.get(url, {
        params: {
          comment: this.comment
        }
      }).then((res) => {
        let status = res.status
        let data = res.data

        if (status >= 200 && status < 300 && data.success) {
          this.detail = data.data[0] || {}
        } else {
          Toast({
            message: data.message || '数据发送失败',
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
.footer {
  position: absolute;
  width: 100%;
  padding: rem(15) 0;
  background: #fff;
  left: 0;
  bottom: 0;
  display: flex;
  height: rem(70);
  z-index: 1;
  .content-area {
    flex: 1;
    background-color: #E8E8E8;
    margin-left: rem(15);
  }
  .content-input {
    display: inline-block;
    height: rem(70);
    line-height: rem(70);
    padding: 0;
    text-indent: rem(15);
    box-sizing: border-box;
    height: 100%;
    width: rem(470);
    background-color: transparent;
    border: 0;
    outline: none;
  }
  .content-input::-webkit-input-placeholder{
      color:#999;
  }
  .content-input:-moz-placeholder{
      color:#999;
  }
  .content-input::-moz-placeholder{
      color:#999;
  }
  .content-input:-ms-input-placeholder{
      color:#999;
  }
  .send-btn {
    height: rem(70);
    line-height: rem(70);
    width: rem(160);
    margin-left: rem(15);
    margin-right: rem(15);
    background-color: $colorMain;
    color: #fff;
    text-align: center;
    &:active {
      opacity: .9;
    }
  }
  .emoji-btn {
    height: rem(40);
    width: auto;
    vertical-align: middle;
  }
}
</style>
