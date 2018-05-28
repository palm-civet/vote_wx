<template>
    <div class="load-more" v-show="isShow">
        <Spinner :type="type" :size="size" :color="color">
        </Spinner>
        <span :style="{ color: color }">{{ loadText }}</span>
    </div>
</template>
<script>
import {
  Spinner
} from 'mint-ui'

export default {
  name: 'spinner',
  data () {
    return {
      loadText: ''
    }
  },
  components: {
    Spinner
  },
  props: {
    isShow: {
      type: Boolean,
      default: true
    },
    type: {
      type: [String, Number],
      default: 'snake'
    },
    color: {
      type: String,
      default: '#ccc'
    },
    size: {
      type: Number,
      default: 28
    }
  }
}
</script>
<style lang="scss" scoped>
.load-more {
    text-align: center;
    span {
        display: inline-block;
        vertical-align: middle;
    }
}
</style>
