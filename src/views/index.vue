<template>
  <div id="index">
      <!-- 加载 -->
  <Loading />
  <!-- 壁纸 -->
  <Background @loadComplete="loadComplete" />
  <!-- 主界面 -->
  <Transition name="fade" mode="out-in">
    <main id="main" v-if="store.imgLoadStatus">
      <div class="container" v-show="!store.backgroundShow">
        <section class="all" v-show="!store.setOpenState">
          <MainLeft />
          <MainRight v-show="!store.boxOpenState" />
          <Box v-show="store.boxOpenState" />
        </section>
        <section class="more" v-show="store.setOpenState" @click="store.setOpenState = false">
          <MoreSet />
        </section>
      </div>
      <!-- 背景切换按钮 -->
      <div
        class="bg-switch"
        v-show="!store.backgroundShow"
        @click="toggleBackground"
      >
        <Icon size="20">
          <Switch />
        </Icon>
        <span class="bg-switch-text">{{ store.coverType == '4' ? '粒子背景' : '默认壁纸' }}</span>
      </div>
      <!-- 左右切换背景按钮 -->
      <div
        class="bg-nav left"
        v-show="!store.backgroundShow && store.coverType == '0' && showLeftBtn"
        @click="prevBg"
      >
        <Icon size="32">
          <Left />
        </Icon>
      </div>
      <div
        class="bg-nav right"
        v-show="!store.backgroundShow && store.coverType == '0' && showRightBtn"
        @click="nextBg"
      >
        <Icon size="32">
          <Right />
        </Icon>
      </div>
      <!-- 移动端菜单按钮 -->
      <Icon
        class="menu"
        size="24"
        v-show="!store.backgroundShow"
        @click="store.mobileOpenState = !store.mobileOpenState"
      >
        <component :is="store.mobileOpenState ? CloseSmall : HamburgerButton" />
      </Icon>
      <!-- 页脚 -->
      <Transition name="fade" mode="out-in">
        <Footer class="f-ter" v-show="!store.backgroundShow && !store.setOpenState" />
      </Transition>
    </main>
  </Transition>
  </div>

</template>

<script setup>
import { ref, nextTick, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { helloInit, checkDays } from "@/utils/getTime.js";
import { HamburgerButton, CloseSmall, Switch, Left, Right } from "@icon-park/vue-next";
import { mainStore } from "@/stores";
import { Icon } from "@vicons/utils";
import Loading from "@/components/Loading.vue";
import MainLeft from "@/views/index/Main/Left.vue";
import MainRight from "@/views/index/Main/Right.vue";
import Background from "@/components/Background.vue";
import Footer from "@/components/Footer.vue";
import Box from "@/views/index/Box/index.vue";
import MoreSet from "@/views/index/MoreSet/index.vue";
import config from "@/../package.json";

const store = mainStore();
const router = useRouter();

// 左右切换按钮显示状态
const showLeftBtn = ref(false);
const showRightBtn = ref(false);

// 背景图片数组
const bgImages = [
  new URL('@/assets/image/background.jpg', import.meta.url).href,
  new URL('@/assets/image/background1.png', import.meta.url).href,
  new URL('@/assets/image/background2.jpg', import.meta.url).href
];

// 页面宽度
const getWidth = () => {
  store.setInnerWidth(window.innerWidth);
};



// 鼠标中键事件处理函数
const handleMouseDown = (event) => {
  if (event.button == 1) {
    store.backgroundShow = !store.backgroundShow;
    ElMessage({
      message: `已${store.backgroundShow ? "开启" : "退出"}壁纸展示状态`,
      grouping: true,
    });
  }
};

// 鼠标移动事件处理函数，控制左右切换按钮的显示
const handleMouseMove = (event) => {
  // 只有在默认壁纸模式下才显示按钮
  if (store.coverType != '0' || store.backgroundShow) {
    showLeftBtn.value = false;
    showRightBtn.value = false;
    return;
  }
  
  const windowWidth = window.innerWidth;
  const mouseX = event.clientX;
  
  // 鼠标移入左侧10%区域时显示左按钮
  if (mouseX < windowWidth * 0.1) {
    showLeftBtn.value = true;
  } else {
    showLeftBtn.value = false;
  }
  
  // 鼠标移入右侧10%区域时显示右按钮
  if (mouseX > windowWidth * 0.9) {
    showRightBtn.value = true;
  } else {
    showRightBtn.value = false;
  }
};

// 加载完成事件
const loadComplete = () => {
  nextTick(() => {
    // 欢迎提示
    helloInit();
    // 默哀模式
    checkDays();
  });
};

// 背景切换
const toggleBackground = () => {
  store.coverType = store.coverType == '4' ? '0' : '4';
  ElMessage({
    message: store.coverType == '4' ? '已切换到粒子背景' : '已切换到默认壁纸',
    grouping: true,
  });
};

// 上一张背景图
const prevBg = () => {
  store.bgIndex = (store.bgIndex - 1 + bgImages.length) % bgImages.length;
  ElMessage({
    message: '已切换到上一张背景图',
    grouping: true,
  });
};

// 下一张背景图
const nextBg = () => {
  store.bgIndex = (store.bgIndex + 1) % bgImages.length;
  ElMessage({
    message: '已切换到下一张背景图',
    grouping: true,
  });
};

// 监听宽度变化
watch(
  () => store.innerWidth,
  (value) => {
    if (value < 721) {
      store.boxOpenState = false;
      store.setOpenState = false;
    }
  },
);

onMounted(() => {
  // 屏蔽右键
  document.oncontextmenu = () => {
    ElMessage({
      message: "为了浏览体验，本站禁用右键",
      grouping: true,
      duration: 2000,
    });
    return false;
  };

  // 添加鼠标中键事件监听
  window.addEventListener("mousedown", handleMouseDown);
  
  // 添加鼠标移动事件监听，控制左右切换按钮的显示
  window.addEventListener("mousemove", handleMouseMove);

  // 监听当前页面宽度
  getWidth();
  window.addEventListener("resize", getWidth);

});

onBeforeUnmount(() => {
  window.removeEventListener("resize", getWidth);
  // 移除鼠标中键事件监听
  window.removeEventListener("mousedown", handleMouseDown);
  // 移除鼠标移动事件监听
  window.removeEventListener("mousemove", handleMouseMove);
});
</script>

<style lang="scss" scoped>
#index {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
#main {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  color: #fff;
  height: 100%;
  transform: scale(1.2);
  transition: transform 0.3s;
  animation: fade-blur-main-in 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: 0.5s;
  .container {
    width: 75%;
    height: 100vh;
    margin: 0 auto;
    padding: 0 0.5vw;
    .all {
      width: 100%;
      height: 100%;
      padding: 0 0.75rem;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .more {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #00000080;
      backdrop-filter: blur(20px);
      z-index: 2;
      animation: fade 0.5s;
    }
    @media (max-width: 1200px) {
      padding: 0 2vw;
    }
  }
  .bg-switch {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 20px;
      right: 20px;
      padding: 8px 16px;
      background: rgb(0 0 0 / 20%);
      backdrop-filter: blur(10px);
      border-radius: 6px;
      transition: all 0.3s;
      animation: fade 0.5s;
      cursor: pointer;
      font-size: 14px;
      gap: 8px;
      &:hover {
        transform: scale(1.05);
        background: rgb(0 0 0 / 30%);
      }
      &:active {
        transform: scale(0.95);
      }
      .i-icon {
        transform: translateY(1px);
      }
      .bg-switch-text {
        white-space: nowrap;
      }
    }
    
    .bg-nav {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 50%;
      transform: translateY(-50%);
      width: 50px;
      height: 50px;
      background: rgb(0 0 0 / 20%);
      backdrop-filter: blur(10px);
      border-radius: 50%;
      transition: all 0.3s;
      animation: fade 0.3s;
      cursor: pointer;
      opacity: 0.8;
      
      &:hover {
        transform: translateY(-50%) scale(1.1);
        background: rgb(0 0 0 / 30%);
        opacity: 1;
      }
      
      &:active {
        transform: translateY(-50%) scale(0.95);
      }
      
      &.left {
        left: 20px;
      }
      
      &.right {
        right: 20px;
      }
      
      .i-icon {
        transform: translateY(2px);
      }
    }
    .menu {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 84%;
      left: calc(50% - 28px);
      width: 56px;
      height: 34px;
      background: rgb(0 0 0 / 20%);
      backdrop-filter: blur(10px);
      border-radius: 6px;
      transition: transform 0.3s;
      animation: fade 0.5s;
      &:active {
        transform: scale(0.95);
      }
      .i-icon {
        transform: translateY(2px);
      }
      @media (min-width: 721px) {
        display: none;
      }
    }
  @media (max-height: 720px) {
    overflow-y: auto;
    overflow-x: hidden;
    .container {
      height: 721px;
      .more {
        height: 721px;
        width: calc(100% + 6px);
      }
      @media (min-width: 391px) {
        // w 1201px ~ max
        padding-left: 0.7vw;
        padding-right: 0.25vw;
        @media (max-width: 1200px) { // w 1101px ~ 1280px
          padding-left: 2.3vw;
          padding-right: 1.75vw;
        }
        @media (max-width: 1100px) { // w 993px ~ 1100px
          padding-left: 2vw;
          padding-right: calc(2vw - 6px);
        }
        @media (max-width: 992px) { // w 901px ~ 992px
          padding-left: 2.3vw;
          padding-right: 1.7vw;
        }
        @media (max-width: 900px) { // w 391px ~ 900px
          padding-left: 2vw;
          padding-right: calc(2vw - 6px);
        }
      }
    }
    .menu {
      top: 605.64px; // 721px * 0.84
      left: 170.5px; // 391 * 0.5 - 25px
      @media (min-width: 391px) {
        left: calc(50% - 25px);
      }
    }
    .f-ter {
      top: 675px; // 721px - 46px
      @media (min-width: 391px) {
        padding-left: 6px;
      }
    }
  }
  @media (max-width: 390px) {
    overflow-x: auto;
    .container {
      width: 391px;
    }
    .menu {
      left: 167.5px; // 391px * 0.5 - 28px
    }
    .f-ter {
      width: 391px;
    }
    @media (min-height: 721px) {
      overflow-y: hidden;
    }
  }
}

// 向上滚动引导动画样式
.scroll-up {
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: white;
  opacity: 0.8;
  transition: opacity 0.3s ease, transform 0.3s ease;
  z-index: 10;
  pointer-events: auto;
  transform-style: preserve-3d;
}

.scroll-up:hover {
  opacity: 1;
  transform: translateX(-50%) translateY(-5px);
}

// up图标样式
.up-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  transform: rotate(180deg); // 反转down图标
  animation: scrollUpIcon 1.5s ease-in-out infinite;
  transform-style: preserve-3d;
}

@keyframes scrollUpIcon {
  0%, 100% {
    transform: rotate(180deg) translateY(0);
    opacity: 0.8;
  }
  50% {
    transform: rotate(180deg) translateY(-10px);
    opacity: 1;
  }
}
</style>
