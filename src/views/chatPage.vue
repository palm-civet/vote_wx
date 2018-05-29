<template>
  <div class="page-container">
      <div class="chat-win" id="chatContainer">
        <Loadmore :top-method="loadTop" :auto-fill="false" ref="loadmore" @top-status-change="handleTopChange">
          <ul class="chat-list">
            <template  v-for="item in chatList">
              <!--other-->
              <li class="msg-wrap" v-if="!item.userid && !item.self" :id="item.id">
                  <div class="avantar-wrap">
                    <img :src="item.user_avatar" alt="用户头像" class="avantar">
                  </div>
                  <div class="detail-wrap">
                    <div class="name">{{item.user_name}}</div>
                    <div class="content" v-html="replaceFace(item.comment_content)"></div>
                  </div>
              </li>
              <!--user-->
              <li class="msg-wrap user-msg" :id="item.id" v-else>
                  <div class="detail-wrap right-detail-wrap">
                    <div class="content" v-html="replaceFace(item.comment_content)"></div>
                  </div>
                  <div class="avantar-wrap">
                    <img v-if="item.user_avatar" :src="item.user_avatar" alt="用户头像" class="avantar">
                  </div>
              </li>
            </template>
          </ul>
          <div slot="top" class="mint-loadmore-top">
            <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">加载历史记录</span>
            <span v-show="topStatus === 'loading'">
              <Spinner type="snake"></Spinner>
            </span>
          </div>
        </Loadmore>
      </div>
      <ChatFooterFun
        @send-text="sendText"
        @send-text-error="sendTextErr"
        @send-text-success="sendTextSuc"
        :EXPS="EXPS"></ChatFooterFun>
  </div>
</template>
<script>
import { Toast, Loadmore, Spinner } from 'mint-ui'
import ChatFooterFun from '@/components/ChatFooterFun'
import Polling from 'static_js/polling'

export default {
  components: {
    ChatFooterFun,
    Spinner,
    Loadmore
  },
  data () {
    return {
      EXPS: [],
      polling: {},
      loadOld: false,
      isSending: false,
      sendSucList: [], // 发送成功消息id，用时间戳记录
      sendErrList: [], // 发送失败消息id，用时间戳记录
      chatList: [],
      topStatus: '',
      lastQaId: 0,
      firstQaId: null,
      allLoaded: false // 是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
      // scrollMode: 'auto' // 移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
    }
  },
  created () {
    // 加载emoji文件
    this.loadEmojiData()
    this.loadNewData()
    this.polling = new Polling({
      pollFunc: this.loadNewData.bind(this),
      interval: 5000
    })
  },
  methods: {
    handleTopChange () {
      this.topStatus = status
    },
    // 上拉加载
    loadTop () {
      this.loadOldData() // 上拉触发的分页查询
      this.$refs.loadmore.onTopLoaded() // 固定方法，查询完要调用一次，用于重新定位
    },
    loadNewData () {
      if (this.polling.isPolling) return
      this.polling.isPolling = true

      let NEW_URL = `/data/comment/down/${this.$route.params.activity_id}`

      this.axios.get(NEW_URL, {
        params: {
          id: this.lastQaId
        }
      }).then((res) => {
        let status = res.status
        let data = res.data

        // 继续轮询
        this.polling.isPolling = false
        this.polling.startPolling()
        this.replaceSendingText()

        if (status >= 200 && status < 300 && data.success) {
          let list = data.data
          if (!list.length) {
            return
          }
          this.chatList.push(...list)
          this.lastQaId = list[list.length - 1].id
          this.firstQaId = this.chatList[0].id
        } else {
          Toast({
            message: '列表加载失败，稍后重试',
            duration: 1500
          })
        }
      })
    },
    loadOldData () {
      let OLD_URL = `/data/comment/up/${this.$route.params.activity_id}`

      this.axios.get(OLD_URL, {
        params: {
          id: this.firstQaId
        }
      }).then((res) => {
        let status = res.status
        let data = res.data

        if (status >= 200 && status < 300 && data.success) {
          let list = data.data.data
          if (!list.length) {
            return
          }
          this.chatList.unshift(...list)
          this.firstQaId = this.chatList[0].id
          this.loadOld = true
        } else {
          Toast({
            message: '列表加载失败，稍后重试',
            duration: 1500
          })
        }
      })
    },
    sendText (data) {
      this.isSending = true
      this.polling.stopPolling()
      // 继续轮询
      this.polling.startPolling()

      this.chatList.push({
        is_preview: true,
        timeId: data.timeId,
        comment_content: data.comment_content,
        self: true
      })
    },
    replaceSendingText () {
      // 清除发送成功的预览数据
      let newList = [...this.chatList]

      this.chatList.forEach((v, i) => {
        if (v.is_preview && this.sendSucList.length && this.sendSucList.indexOf(v.timeId > -1)) {
          newList.splice(i, 1)
        } else if (v.is_preview) {
          console.log(i)
          newList.splice(i, 1)
        }
      })
      this.chatList = newList
    },
    sendTextSuc (timeId) {
      this.isSending = false
      this.sendSucList.push(timeId)
    },
    sendTextErr (timeId) {
      this.sendErrList.push(timeId)
    },
    loadEmojiData () {
      this.axios.get('/static/emojiDB.json').then((res) => {
        res = res.data
        var json = eval('(' + res + ')')
        this.EXPS = json.EXPS.slice(0)
      })
    },
    replaceFace (con) {
      if (!con) return
      if (con.toString().indexOf('[') > -1) {
        var exps = this.EXPS
        for (var i = 0; i < exps.length; i++) {
          con = con.replace(exps[i].title, '<img src="' + exps[i].file + '"  alt="" />')
        }
      }
      return con
    }
  },
  watch: {
    chatList () {
      if (this.loadOld) return
      this.$nextTick(() => {
        let container = this.$el.querySelector('#chatContainer')
        container.scrollTop = container.scrollHeight
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~static_css/common/var';
@import '~static_css/common/mixin';
.page-container {
  height: 100%;
  overflow: hidden;
  background-color: #E8E8E8;
}
.chat-win {
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  .chat-list {
    margin-bottom: rem(100);
    padding: rem(36);
  }
  .msg-wrap {
    margin-bottom: rem(30);
    display: flex;
  }
  .avantar {
    width: rem(120);
    height: rem(120);
    border-radius: 6px;
  }
  .detail-wrap {
    display: flex;
    flex-direction: column;
    justify-content:  flex-start;
    margin-left: rem(26);
  }
  .name {
    color: #666;
    font-size: rem(24);

  }
  .content {
    display: inline-block;
    padding: rem(20) rem(26);
    min-height: rem(20);
    font-size: rem(28);
    position: relative;
    background-color: #fff;
    color: #333;
    border-radius: 6px;
    margin-top: rem(15);
    word-break: break-all;
    &:before {
      content: '';
      border: rem(8) solid transparent;
      border-right: rem(14) solid #fff;
      position: absolute;
      left: rem(-18);
      top: rem(30);
    }
  }
  .user-msg {
    text-align: right;
    justify-content: flex-end;
    .detail-wrap {
      margin-left: 0;
      margin-right: rem(26);
    }
    .content:before {
      content: '';
      border: rem(8) solid transparent;
      border-left: rem(14) solid #fff;
      position: absolute;
      left: auto;
      right: rem(-18);
      top: rem(30);
    }
  }
  .mint-spinner-snake {
    display: inline-block;
  }
}
</style>
