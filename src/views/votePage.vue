<template>
<div class="page-vote-container">
  <ul class="tab-wrap">
    <li class="tab" :class="active == 0 ? 'active' : ''" @click="changeTab(0)">全部选手</li>
    <li class="tab" :class="active == 1 ? 'active' : ''" @click="changeTab(1)">人气排行</li>
  </ul>

  <!--参赛选手列表-->
  <template v-if="active == 0">
    <PlayerCard v-if="showPlayerDetail" :cardData="playerDetailData" @hide-card="hideCard"></PlayerCard>
    <div v-else>
      <div
        class="player-list"
        v-infinite-scroll="getList"
        infinite-scroll-distance="10"
        infinite-scroll-disabled="hasNoPage">
        <PlayerCard :cardData="item" v-for="item in list"  :smallCard="true" @show-card="showCard"></PlayerCard>
        <Spinner type="fading-circle" color="#1c91e0" :isShow="isLoading"></Spinner>
      </div>
      <div class="cyui-loadmore cyui-loadmore_line" v-show="hasNoPage">
        <span class="cyui-loadmore__tips">&diams; 到底了 &diams;</span>
      </div>
    </div>
  </template>
  <!--投票排名列表-->
  <RankList v-else-if="active == 1"></RankList>

</div>
</template>
<script>
import Vue from 'vue'
import Tab from '@/components/Tab'
import PlayerCard from '@/components/PlayerCard'
import RankList from '@/components/RankList'
import { Toast, InfiniteScroll } from 'mint-ui'
import Spinner from '@/components/base/Spinner'

Vue.use(InfiniteScroll)

export default {
  components: {
    PlayerCard,
    RankList,
    Tab,
    Spinner
  },
  data () {
    return {
      playerData: null,
      active: 0,
      playerDetailData: null,
      showPlayerDetail: null,
      list: [],
      page: 1,
      isLoading: false,
      hasNoPage: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    changeTab (index) {
      this.active = index
    },
    showCard (cardData) {
      this.playerDetailData = cardData
      this.showPlayerDetail = true
    },
    hideCard () {
      this.showPlayerDetail = false
    },
    getList () {
      let url = `/data/votes/${this.$route.params.activity_id}`
      if (this.isLoading) return
      this.isLoading = true

      this.axios.get(url, {
        params: {
          page: this.page
        }
      }).then((res) => {
        this.isLoading = false
        ++this.page
        let status = res.status
        let data = res.data

        if (status >= 200 && status < 300) {
          let list = data.data.data
          let length = list.length

          if (!length || length < 20) {
            this.hasNoPage = true
          }
          this.list.push(...list)
        } else {
          Toast({
            message: '列表加载失败，稍后重试',
            duration: 1500
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
@import '~static_css/common/var';
@import '~static_css/common/mixin';
  .page-vote-container {
    background: #0D43A8 url(~static_img/bg.jpg) repeat-y center;
    background-size: 100% auto;
    height: 100%;
    overflow-y: auto;
    padding: rem(34) rem(20);
    box-sizing: border-box;
  }
  .player-list {
    overflow: hidden;
  }
  .cyui-loadmore {
    width: rem(250);
    margin: .24rem auto;
    line-height: 1.6;
    font-size: rem(28);
    text-align: center;
    .cyui-loadmore__tips {
      position: relative;
      top: rem(-24);
      padding: 0 rem(16);
      background-color: $colorMain;
      display: inline-block;
      color: #fff;
      vertical-align: middle;
    }
  }
  .cyui-loadmore_line {
    border-top: 1px solid #fff;
    margin-top: rem(76);
  }
  .tab-wrap {
    margin-bottom: rem(34);
  }
  .tab {
    display: inline-block;
    width: rem(350);
    height: rem(70);
    line-height: rem(70);
    font-size: rem(32);
    font-weight: bold;
    text-align: center;
    color: #0D43A8;
    background-color: #fff;
    border-radius: 2px;
    &:nth-child(odd) {
      margin-right: rem(2);
    }
    &.active {
      color: #fff;
      background: url(~static_img/btn_red.jpg) no-repeat center;
      background-size: 100% 100%;
    }
  }
</style>
