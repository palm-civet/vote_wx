<template>
  <div class="palyer-card">
    <img class="avantar" :src="`http://za.jupiter.xin/uploads/${cardData.img}`" alt="参赛选手照片">
    <div class="title">{{cardData.name}}</div>
    <div class="content">{{cardData.description}}</div>
    <VoteBtn :voted="voted"></VoteBtn>
    <a href="" class="btn-default">返回</a>
  </div>
</template>
<script>
import VoteBtn from '@/components/VoteBtn'
export default {
  components: {
    VoteBtn
  },
  props: ['cardData'],
  data () {
    return {
      voted: false
    }
  }
}
</script>
<style lang="scss">
  .btn {
    height: rem(70);
    width: rem(70);
  }
</style>
<style lang="scss" scoped>
@import '~static_css/common/var';
@import '~static_css/common/mixin';
.palyer-card {
  background-color: #FFFFFF;
  width: rem(350);
  float: left;
  padding: rem(15);
  box-sizing: border-box;
  margin-bottom: rem(10);
  text-align: center;
  &:nth-child(odd) {
    margin-right: rem(10);
  }
  .content {
    text-align: left;
    margin-bottom: rem(20);
    height: rem(68);
    overflow: hidden;
    @include line-clamp(2);
  }
  .avantar {
    width: rem(320);
    height: rem(320);
    margin-bottom: rem(20);
  }
  .title {
    padding-bottom: rem(20);
    border-bottom: 1px dashed #DCDCDC;
    margin-bottom: rem(20);
    font-size: rem(32);
  }
}
.btn-default {
  display: block;
  width: 100%;
  color: $colorMain;
  background-color: #fff;
  border: 1px solid $colorMain;
  border-radius: rem(6);
}
</style>
