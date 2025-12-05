<template>
  <div id="index">
      <!-- 加载 -->
  <Loading />
  <!-- 壁纸 -->
  <Background @loadComplete="loadComplete" />
  <!-- 主界面 -->
  <Transition name="fade" mode="out-in">
    <main id="main" v-if="store.imgLoadStatus">
      <!-- 退出按钮 -->
      <div class="logout-btn" @click="handleLogout">
        <img src="@/assets/icon/other/logout.svg" alt="退出" class="logout-icon" />
      </div>
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
      <!-- 移除背景切换按钮，改为根据播放器状态自动切换背景 -->
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
    <!-- 向上滚动引导动画 -->
    <div class="scroll-up" @click="scrollUp">
      <img src="@/assets/icon/other/down.png" alt="up" class="up-icon" />
    </div>
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

// 向上滚动距离累积器
const scrollUpDistance = ref(0);
const scrollTimer = ref(null);

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

// 标志位：是否已经显示过欢迎提示
const hasShownWelcome = ref(false);

// 加载完成事件
const loadComplete = () => {
  nextTick(() => {
    // 只在首次加载时显示欢迎提示
    if (!hasShownWelcome.value) {
      helloInit();
      hasShownWelcome.value = true;
      console.log('显示欢迎提示');
    }
    // 默哀模式每次都检查
    checkDays();
  });
};

// 移除背景切换功能，改为根据播放器状态自动切换背景
// const toggleBackground = () => {
//   // 循环切换：默认壁纸 -> 粒子背景
//   if (store.coverType == '0' || store.coverType == '5') {
//     store.coverType = '4';
//     ElMessage({
//       message: '已切换到粒子背景',
//       grouping: true,
//     });
//   } else {
//     store.coverType = '0';
//     ElMessage({
//       message: '已切换到默认壁纸',
//       grouping: true,
//     });
//   }
// };

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

// 退出登录功能
const handleLogout = () => {
  // 清空localStorage和sessionStorage
  localStorage.clear();
  sessionStorage.clear();
  
  // 重置store状态
  store.$reset();
  
  // 跳转到登录页
  router.push('/login');
  
  // 显示退出成功提示
  ElMessage({
    message: '已退出登录',
    grouping: true,
  });
};

// 向上滚动回到home页
const scrollUp = () => {
  router.push('/');
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

// 鼠标滚轮事件处理函数
const handleWheel = (event) => {
  if (event.deltaY < 0) {
    // 向上滚动，累积滚动距离
    scrollUpDistance.value += Math.abs(event.deltaY);
    
    // 清除之前的定时器
    if (scrollTimer.value) {
      clearTimeout(scrollTimer.value);
    }
    
    // 设置新的定时器，300ms内没有新的滚动事件则检查累积距离
    scrollTimer.value = setTimeout(() => {
      if (scrollUpDistance.value > 200) { // 滚动两格以上（每格约100ms，两格约200ms）
        scrollUp();
      }
      // 重置累积距离
      scrollUpDistance.value = 0;
    }, 300);
  }
};

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
  
  // 添加鼠标滚轮事件监听，实现向上滚动回到home页
  window.addEventListener("wheel", handleWheel, { passive: false });

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
  // 移除鼠标滚轮事件监听
  window.removeEventListener("wheel", handleWheel);
  // 清除定时器，避免内存泄漏
  if (scrollTimer.value) {
    clearTimeout(scrollTimer.value);
  }
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
    
    .logout-btn {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 20px;
      right: 20px;
      width: 36px;
      height: 36px;
      background: rgb(0 0 0 / 20%);
      backdrop-filter: blur(10px);
      border-radius: 50%;
      transition: all 0.3s;
      animation: fade 0.5s;
      cursor: pointer;
      &:hover {
        transform: scale(1.1);
        background: rgb(0 0 0 / 30%);
      }
      &:active {
        transform: scale(0.9);
      }
      .logout-icon {
        width: 20px;
        height: 20px;
        object-fit: contain;
        filter: brightness(1.3);
        transition: filter 0.3s;
      }
      &:hover .logout-icon {
        filter: brightness(1.4);
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
