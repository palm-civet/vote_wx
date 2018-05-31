<template>
  <ul class="tab-list">
    <li :class="$route.path === item.link ? 'active' : ''" v-for="(item, index) in tabList" :key="item.id" @click="changeTab(index)">
      <router-link :to="item.link">
        <img :src="item.icon" alt="icon" class="icon" v-show="$route.path === item.link">
        <span>{{item.title}}</span>
      </router-link>
    </li>

  </ul>
</template>
<script>
import RankImg from 'static_img/rank.png'
import TalkImg from 'static_img/talk.png'
import FileImg from 'static_img/File.png'
export default {
  data () {
    return {
      curIndex: 0,
      tabList: [{
        title: '人气投票',
        icon: RankImg,
        link: `/v_vote/${this.$route.params.activity_id}`,
        id: 1
      },
      {
        title: '聊天互动',
        icon: TalkImg,
        link: `/v_chat/${this.$route.params.activity_id}`,
        id: 2
      },
      {
        title: '活动介绍',
        icon: FileImg,
        link: `/v_detail/${this.$route.params.activity_id}`,
        id: 3
      }]
    }
  },
  created () {

  },
  methods: {
    changeTab (index) {
      this.curIndex = index
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~static_css/common/var';
@import '~static_css/common/mixin';
.tab-list {
  height: rem(90);
  line-height: rem(90);
  background-color: #0D43A8;
  display: flex;
  width: 100%;
  z-index: 11;
  position: relative;
  li {
    flex: 1;
    text-align: center;
    font-size: rem(30);
    &.active {
      position: relative;
      &:before {
        content: '';
        display: inline-block;
        width: 100%;
        height: rem(9);
        position: absolute;
        top: rem(-9);
        left: 0;
        background: url(~static_img/tab_bar.jpg) no-repeat center;
        background-size: 100% 100%;
      }
    }
    &:not(.active) {
      background:-webkit-gradient(linear, 0 0, 0 bottom, from(#073793), to((#002C7E)));
    }
    span {
      color: #fff;
    }
  }
  .icon {
    height: rem(27);
    width: auto;
    vertical-align: middle;
  }
  span {
    vertical-align: middle;
  }
}
</style>
