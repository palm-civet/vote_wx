<template>
  <div class="palyer-card" :class="smallCard ? 'small-card' : '' ">
    <img class="avantar" :src="`http://za.jupiter.xin/uploads/${cardData.img}`" alt="参赛选手照片" @click="showDetail">
    <div class="title">{{cardData.name}}</div>
    <div class="content">{{cardData.description}}</div>
    <VoteBtn :voted="voted" :smallSize="smallCard" :playerId="cardData.id"></VoteBtn>
    <div class="btn-default" v-if="!smallCard"  @click="hideDetail">返回</div>
  </div>
</template>
<script>
import VoteBtn from '@/components/VoteBtn'
export default {
  components: {
    VoteBtn
  },
  props: ['cardData', 'smallCard'],
  data () {
    return {
      voted: false
    }
  },
  methods: {
    showDetail () {
      this.$emit('show-card', this.cardData)
    },
    hideDetail () {
      this.$emit('hide-card')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~static_css/common/var';
@import '~static_css/common/mixin';
.palyer-card {
  background-color: #FFFFFF;
  width: 100%;
  padding: rem(15);
  box-sizing: border-box;
  margin-bottom: rem(10);
  text-align: center;
  .content {
    text-align: left;
    margin-bottom: rem(20);
  }
  .avantar {
    width: rem(660);
    height: rem(660);
    margin-bottom: rem(20);
  }
  .title {
    text-align: left;
    color: $colorMain;
    padding-bottom: rem(20);
    border-bottom: 1px dashed #DCDCDC;
    margin-bottom: rem(20);
    font-size: rem(32);
  }
  .btn-default {
    display: inline-block;
    width: 100%;
    height: rem(80);
    line-height: rem(80);
    border: 1px solid $colorMain;
    color: $colorMain;
    margin-top: rem(20);
    border-radius: rem(6);
  }
}
.small-card {
  width: rem(350);
  float: left;
  &:nth-child(odd) {
    margin-right: rem(10);
  }
  .content {
    height: rem(68);
    overflow: hidden;
    @include line-clamp(2);
  }
  .avantar {
    width: rem(320);
    height: rem(320);
  }
  .title {
    text-align: center;
    color: #323232;
  }
}
</style>
