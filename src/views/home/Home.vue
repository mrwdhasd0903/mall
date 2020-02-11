<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control
      class="tab-control"
      @tabClick="tabClick"
      :titles="['流行','新款','精选']"
      ref="tabControlTop"
      v-show="isTabFixed"
    ></tab-control>
    <scroll
      class="content"
      ref="scroll"
      :pull-up-load="true"
      :probe-type="3"
      @scroll="contentScroll"
      @pullingUp="loadMore"
    >
      <home-swiper @swiperImageload="swiperImageload" :banners="banners"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control @tabClick="tabClick" :titles="['流行','新款','精选']" ref="tabControl"></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <back-top v-show="isShowBackTop" @click.native="backClick"></back-top>
  </div>
</template>

<script>
// 私有组件
import HomeSwiper from "./childCommps/HomeSwiper";
import RecommendView from "./childCommps/RecommendView";
import FeatureView from "./childCommps/FeatureView";
// 公共组件
import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backTop/BackTop";
// 网络组件
import { getHomeMultidata, getHomeGoods } from "network/home";
// 工具
import { debounce } from "common/utils";
//模块
// import BScroll from "better-scroll";
export default {
  name: "Home",
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    GoodsList,
    Scroll,
    BackTop,
    TabControl
  },
  data() {
    return {
      recommends: [],
      banners: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: "pop",
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY, 1);
    this.$refs.scroll.refresh();
  },
  deactivated() {
    this.saveY = this.$refs.scroll.getScrollY();
    console.log("保存:" + this.saveY);
  },
  created() {
    // 1请求多个数据
    //轮播图数据
    this.getHomeMultidata();
    //商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  mounted() {
    // 监听item中图片加载完成
    const refresh = debounce(this.$refs.scroll.refresh, 200);
    this.$bus.$on("itemImageLoad", () => {
      refresh();
    });
  },
  methods: {
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      // 同步状态
      this.$refs.tabControlTop.currentIndex = index;
      this.$refs.tabControl.currentIndex = index;
    },
    loadMore() {
      this.getHomeGoods(this.currentType);
    },
    backClick() {
      // console.log(this.$refs.scroll.scroll);

      this.$refs.scroll.scrollTo(0, 0, 500);
    },
    //轮播图数据获取函数
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    //指定商品数据获取函数
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;

      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        this.$refs.scroll.finishPullUp();
      });
    },
    contentScroll(position) {
      // 让BackTop显示
      this.isShowBackTop = -position.y > 1000;
      // 让tabControl吸顶
      this.isTabFixed = -position.y > this.tabOffsetTop;
    },
    swiperImageload() {
      this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop;
    }
  }
};
</script>

<style scoped>
#home {
  position: relative;
  height: 100vh;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;*/
}
/* .tab-control-top {
  position: fixed;
  top: 44px;
} */
.content {
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
  overflow: hidden;
}
.tab-control {
  position: relative;
  z-index: 9;
}
</style>
