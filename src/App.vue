<template>
  <router-view id="app"/>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
// 必须要用～才能找到
@import '~static_css/common/var';
@import '~static_css/common/reset';
@import '~static_css/common/mixin';
body,html {
  height: 100%;
  font-size: rem(28);
  color: #323232;
  background-color: #fff;
  font-family: PingFangSC;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  -webkit-overflow-scrolling: auto;
}
#app {
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-overflow-scrolling: auto;
  max-width: rem(750);
  margin: auto;
}
</style>
