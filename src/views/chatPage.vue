<template>
  <div class="page-container">
      <div class="chat-win">
        <Loadmore :top-method="loadTop" :auto-fill="false" ref="loadmore" @top-status-change="handleTopChange">
          <div slot="top" class="mint-loadmore-top">
            <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">加载历史记录</span>
            <span v-show="topStatus === 'loading'">
              <Spinner type="snake"></Spinner>
            </span>
          </div>
          <ul class="chat-list">
            <template  v-for="item in chatList">
              <!--other-->
              <li class="msg-wrap" v-if="!item.userid" :id="item.id">
                  <div class="avantar-wrap">
                    <img :src="item.user_avatar" alt="用户头像" class="avantar">
                  </div>
                  <div class="detail-wrap">
                    <div class="name">{{item.user_name}}</div>
                    <div class="content">{{item.comment_content}}</div>
                  </div>
              </li>
              <!--user-->
              <li class="msg-wrap user-msg" :id="item.id" v-else>
                  <div class="detail-wrap right-detail-wrap">
                    <div class="content">{{item.comment_content}}</div>
                  </div>
                  <div class="avantar-wrap">
                    <img :src="item.user_avatar" alt="用户头像" class="avantar">
                  </div>
              </li>
            </template>
          </ul>
        </Loadmore>
      </div>
      <ChatFooterFun></ChatFooterFun>
  </div>
</template>
<script>
import { Toast, Loadmore, Spinner } from 'mint-ui'
import ChatFooterFun from '@/components/ChatFooterFun'

export default {
  components: {
    ChatFooterFun,
    Spinner,
    Loadmore
  },
  data () {
    return {
      timer: null,
      chatList: [],
      topStatus: '',
      lastQaId: 0 || 3,
      firstQaId: null,
      allLoaded: false // 是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
      // scrollMode: 'auto' // 移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
    }
  },
  created () {
    this.loadNewData()
  },
  methods: {
    handleTopChange () {
      this.topStatus = status
      console.log(status)
    },
    // 上拉加载
    loadTop () {
      this.loadOldData() // 上拉触发的分页查询
      this.$refs.loadmore.onBottomLoaded() // 固定方法，查询完要调用一次，用于重新定位
    },
    loadNewData () {
      let NEW_URL = `/data/comment/down/${this.$route.params.activity_id}`

      this.axios.get(NEW_URL, {
        params: {
          id: this.lastQaId
        }
      }).then((res) => {
        let status = res.status
        let data = res.data
        console.log(res.data)

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
      let OLD_URL = `/data//comment/up/${this.$route.params.activity_id}`

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
          //this.firstQaId = this.chatList[0].id
          this.$nextTick(function () {
            this.isHaveMore()
          })
        } else {
          Toast({
            message: '列表加载失败，稍后重试',
            duration: 1500
          })
        }
      })
    },
    isHaveMore () {
      // 是否还有下一页，如果没有就禁止上拉刷新
      // this.allLoaded = false; //true是禁止上拉加载
      if (this.pageNo === this.totalpage) {
        // this.allLoaded = true
      }
    },
    polling () {
      this.timer = setInterval(() => {
        this.loadNewData()
      }, 500)
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
  overflow: scroll;
  .chat-list {
    margin-bottom: rem(150);
    -webkit-overflow-scrolling: touch;
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
