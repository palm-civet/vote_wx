<template>
  <div class="page-chat-container">
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
                    <img v-if="item.user_avatar" :src="item.user_avatar" class="avantar">
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
import { Loadmore, Spinner } from 'mint-ui'
import ChatFooterFun from '@/components/ChatFooterFun'
import Polling from 'static_js/polling'
import { EXPS } from 'static/emojiDB.json'

export default {
  components: {
    ChatFooterFun,
    Spinner,
    Loadmore
  },
  data () {
    return {
      EXPS: EXPS,
      userAvatar: '',
      userName: '',
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
    // 加载聊天内容
    this.loadIintData()
    // 加载用户数据
    this.loadUserData()
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
    loadUserData () {
      let USER_URL = '/data/userinfo/'

      this.axios.get(USER_URL).then((res) => {
        let status = res.status
        let data = res.data

        if (status >= 200 && status < 300 && data.success) {
          this.userName = data.data.user_name
          this.userAvatar = data.data.user_avatar
          console.log(this.userAvatar)
        } else {
          console.log('用户数据获取失败')
        }
      })
    },
    loadIintData () {
      let INIT_URL = `/data/comment/newest/${this.$route.params.activity_id}`

      this.axios.get(INIT_URL).then((res) => {
        let status = res.status
        let data = res.data

        if (status >= 200 && status < 300 && data.success) {
          let list = data.data
          if (list.length) {
            this.chatList.push(...list)
            this.lastQaId = list[list.length - 1].id
            this.firstQaId = this.chatList[0].id
          }
          this.polling = new Polling({
            pollFunc: this.loadNewData,
            interval: 5000
          })
          // 开始轮询
          this.polling.startPolling()
        } else {
          console.log('数据初始化失败')
        }
      })
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

        if (status >= 200 && status < 300 && data.success) {
          let list = data.data
          if (!list.length) {
            return
          }
          this.replaceSendingText()
          this.chatList.push(...list)
          this.lastQaId = list[list.length - 1].id
          this.firstQaId = this.chatList[0].id
        } else {
          console.log('数据加载失败')
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
          let list = data.data
          if (!list.length) {
            return
          }
          this.chatList.unshift(...list)
          this.firstQaId = this.chatList[0].id
          this.loadOld = true
        } else {
          console.log('数据加载失败')
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
        self: true,
        user_avatar: this.userAvatar
      })
    },
    replaceSendingText () {
      // 清除发送成功的预览数据
      this.chatList = this.chatList.filter(v => {
        return !v.is_preview || !this.sendSucList.includes(v.timeId)
      })
    },
    sendTextSuc (timeId) {
      this.isSending = false
      this.sendSucList.push(timeId)
    },
    sendTextErr (timeId) {
      this.sendErrList.push(timeId)
    },
    replaceFace (con) {
      if (!con) return
      if (con.toString().indexOf('[') > -1) {
        var exps = this.EXPS
        for (var i = 0; i < exps.length; i++) {
          let reg = new RegExp(`\\[${exps[i].title.replace(/(\[|\])/g, '')}\\]`, 'g')
          con = con.replace(reg, '<img src="' + exps[i].file + '"  alt="" />')
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
    },
    $route (res) {
      let container = this.$el.querySelector('#chatContainer')
      container.scrollTop = container.scrollHeight
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~static_css/common/var';
@import '~static_css/common/mixin';
.page-chat-container {
  position: relative;
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
    padding: rem(20);
  }
  .msg-wrap {
    margin-bottom: rem(30);
    display: flex;
  }
  .avantar {
    width: rem(100);
    height: rem(100);
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
    margin-bottom: rem(10);
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
    .content {
      text-align: left;
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
