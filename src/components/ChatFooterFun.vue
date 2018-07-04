<template>
  <div class="footer">
    <div class="footer-group">
      <div class="content-area">
        <input name="" id="" class="content-input" placeholder="写评论..." v-on:focus="hideEmoji" v-model="content" v-focus="isFocus && !emojiTag"></input>
        <span class="emoji-btn" @click="showEmoji" v-if="emojiTag">
          <img src="~static_img/emoji.png" alt="emoji">
        </span>
        <span class="emoji-btn" @click="hideEmoji" v-else>
          <img src="~static_img/keyboard.png" alt="emoji">
        </span>
      </div>
      <div class="send-btn" @click="postData">发送</div>
    </div>
    <div class="function-group" v-if="showEmojiList">
      <mt-swipe :auto="0">
        <mt-swipe-item v-for="n in Math.ceil(EXPS.length/24)" :key="n">
          <li v-for="item in getEmotionData(n,24)" :key="item.file" class="face-emoji">
            <img :src="item.file" :data="item.code" v-on:click="content+=item.title">
          </li>
        </mt-swipe-item>
      </mt-swipe>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { Toast, Swipe, SwipeItem } from 'mint-ui'

Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)

export default {
  props: ['EXPS'],
  data () {
    return {
      content: '',
      emojiTag: false,
      showEmojiList: false,
      isFocus: false
    }
  },
  created () {

  },
  methods: {
    postData () {
      if (!this.content.trim().length) return
      this.sendControl()
      let timeId = new Date().toLocaleTimeString()
      let postContent = this.content
      this.content = ''

      this.$emit('send-text', {
        timeId: timeId,
        comment_content: postContent
      })

      let url = `/data/comment/${this.$route.params.activity_id}`
      this.axios.get(url, {
        params: {
          content: postContent
        }
      }).then((res) => {
        let status = res.status
        let data = res.data

        if (status >= 200 && status < 300 && data.success) {
          this.$emit('send-text-success', timeId)
          this.detail = data.data[0] || {}
        } else {
          this.$emit('send-text-error', timeId)
          Toast({
            message: data.message || '数据发送失败',
            duration: 1500
          })
        }
      })
    },
    showEmoji () {
      this.emojiTag = false
      this.isFocus = false
      this.showEmojiList = true
    },
    hideEmoji () {
      this.emojiTag = true
      this.isFocus = true
      this.showEmojiList = false
    },
    sendControl () {
      this.emojiTag = true
      this.isFocus = true
      this.showEmojiList = false
    },
    getEmotionData (pageNow, pageSize) {
      return this.EXPS.slice((pageNow - 1) * pageSize, pageSize * pageNow)
    }
  },
  // 注册focus指令
  directives: {
    focus: {
      inserted (el, binding) {
        el.focus()
      }
    }
  }
}
</script>
<style lang="scss">
.mint-swipe-indicator.is-active {
  background: #333;
  opacity: .8;
}
</style>
<style lang="scss" scoped>
@import '~static_css/common/var';
@import '~static_css/common/mixin';
.footer {
  width: 100%;
  padding: rem(15) 0;
  background: rgba(255, 255, 255, .9);
  z-index: 1;
  .footer-group {
    display: flex;
    position: relative;
    height: rem(70);
  }
  .function-group {
    height: rem(400);
    width: 100%;
    box-sizing: border-box;
    padding: rem(20);
    padding-bottom: 0;
  }
  .content-area {
    flex: 1;
    background-color: #E8E8E8;
    height: rem(40);
    padding: rem(15) 0;
    margin-left: rem(15);
  }
  .content-input {
    display: inline-block;
    font-size: rem(28);
    padding: 0;
    height: 100%;
    text-indent: rem(15);
    box-sizing: border-box;
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
    img {
      height: rem(40);
      width: auto;
      vertical-align: middle;
    }
  }
}

.face-emoji {
  display: inline-block;
  width: 12.5%;
  text-align: center;
  float: left;
  padding: rem(20) 0;
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
.animated {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
</style>
