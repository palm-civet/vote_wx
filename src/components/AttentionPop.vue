<template>
  <div class="pop-wrap">
    <div class="overlay"></div>
    <div class="pop-container">
      <div class="title">长按二维码关注{{pageData.public_name || '本次活动'}}</div>
      <div class="qr-code-wrap">
        <img class="qr-code" :src="`http://za.jupiter.xin/uploads/${pageData.public_img}`" alt="二维码">
      </div>
      <div class="close-btn" @click="closePop">关闭</div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['pageData'],
  methods: {
    closePop () {
      this.$emit('pop-hide')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~static_css/common/var';
@import '~static_css/common/mixin';
.pop-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1111;
}
.overlay {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .7);
}
.pop-container {
  width: rem(455);
  background: #fff;
  position: absolute;
  left: 50%;
  top: rem(230);
  transform: translateX(-50%);
  overflow: hidden;
  .title {
    height: rem(78);
    line-height: rem(78);
    background-color: $colorMain;
    color: #fff;
    text-align: center;
    font-size: rem(30);
  }
  .qr-code-wrap {
    position: relative;
    margin: rem(30) rem(30) rem(20);
    width: rem(388);
    height: rem(388);
    img {
      width: 100%;
      height: 100%;
    }
  }
  .close-btn {
    padding: rem(10) 0 rem(30);
    text-align: center;
  }
}
</style>
