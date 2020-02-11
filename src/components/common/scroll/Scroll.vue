<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: null
    };
  },
  mounted() {
    //创建BScroll
    this.scroll = new BScroll(this.$refs.wrapper, {
      click: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad
    });
    //监听滚动
    this.scroll.on("scroll", position => {
      this.$emit("scroll", position);
    });
    //监听滚动底部
    if (this.pullUpLoad) {
      this.scroll.on("pullingUp", () => {
        console.log("go bottom");
        this.$emit("pullingUp");
      });
    }
  },
  computed: {},
  methods: {
    scrollTo(x, y, time = 500) {
      //如果前面两个存在才执行,防止报错
      this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x, y, time);
    },
    refresh() {
      this.scroll && this.scroll.refresh();
      //有防抖动存在,所以这代码不会执行很多次
      console.log("can scroll");
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp();
    },
    getScrollY() {
      return this.scroll ? this.scroll.y : 0;
    }
  }
};
</script>

<style scoped>
</style>