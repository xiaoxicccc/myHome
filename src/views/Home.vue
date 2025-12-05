<template>
  <div class="home" ref="homeRef">
    <!-- WebGL Fluid Canvas -->
    <WebGLFluid ref="fluidRef" />
    <!-- 页面内容 -->
    <div class="content" ref="contentRef">
      <h1 class="title" ref="titleRef">
        <span class="char" v-for="(char, index) in titleChars" :key="index" :data-index="index">
          {{ char }}
        </span>
      </h1>
      <p class="subtitle" ref="subtitleRef">
        <span class="char" v-for="(char, index) in subtitleChars" :key="index" :data-index="index">
          {{ char }}
        </span>
      </p>

    </div>
    <!-- 向下滚动引导动画 -->
    <div class="scroll-down" @click="scrollDown">
      <img src="@/assets/icon/other/down.png" alt="down" class="down-icon" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import gsap from 'gsap';
import { useRouter } from 'vue-router';
import WebGLFluid from '@/components/WebGLFluid.vue';

// Refs
const homeRef = ref(null);
const fluidRef = ref(null);
const contentRef = ref(null);
const titleRef = ref(null);
const subtitleRef = ref(null);

// Data
const title = '欢迎来到西瓜的精彩空间';
const subtitle = '鼠标点击拖动试一下~';

// Computed
const titleChars = computed(() => title.split(''));
const subtitleChars = computed(() => subtitle.split(''));

// State
const router = useRouter();

// 逐字飞入动画
const animateText = () => {
  const titleChars = titleRef.value.querySelectorAll('.char');
  const subtitleChars = subtitleRef.value.querySelectorAll('.char');
  
  // 标题逐字飞入
  gsap.fromTo(titleChars, 
    { 
      opacity: 0, 
      y: -50, 
      rotateX: -90, 
      transformOrigin: 'center bottom',
      z: -100
    }, 
    { 
      opacity: 1, 
      y: 0, 
      rotateX: 0, 
      z: 0,
      stagger: 0.05,
      duration: 0.8,
      ease: 'back.out(1.7)',
      delay: 0.3
    }
  );
  
  // 副标题逐字飞入
  gsap.fromTo(subtitleChars, 
    { 
      opacity: 0, 
      y: 30, 
      rotateX: 90, 
      transformOrigin: 'center top',
      z: -50
    }, 
    { 
      opacity: 1, 
      y: 0, 
      rotateX: 0, 
      z: 0,
      stagger: 0.03,
      duration: 0.6,
      ease: 'back.out(1.5)',
      delay: 0.8
    }
  );
  

};

// 进入副屏动画
const enterSecondaryScreen = () => {
  // 1. 主屏背景色/图片超平滑 hue 旋转 + blur 过渡
  gsap.to('.webgl-fluid-canvas', {
    filter: 'hue-rotate(180deg) blur(10px)',
    duration: 1.5,
    ease: 'power3.inOut'
  });
  
  // 2. 内容3D翻转并淡出
  gsap.to(contentRef.value, {
    rotateY: 90,
    opacity: 0,
    z: -500,
    duration: 1,
    ease: 'power3.inOut',
    delay: 0.2
  });
  
  // 3. 滚动引导动画淡出
  gsap.to('.scroll-down', {
    opacity: 0,
    y: 20,
    duration: 0.5,
    ease: 'power2.inOut'
  });
  
  // 延迟导航到index页
  setTimeout(() => {
    router.push('/index');
  }, 1200);
};

// 滚动向下
const scrollDown = () => {
  enterSecondaryScreen();
};

// 鼠标滚轮事件处理
const handleWheel = (event) => {
  if (event.deltaY > 0) {
    // 向下滚动，进入副屏
    event.preventDefault();
    enterSecondaryScreen();
  }
};

onMounted(() => {
  // 添加鼠标滚轮事件监听
  window.addEventListener('wheel', handleWheel, { passive: false });
  
  // 阻止右键菜单
  document.oncontextmenu = () => {
    return false;
  };
  
  // 启动文字动画
  animateText();
});

onUnmounted(() => {
  // 移除事件监听
  window.removeEventListener('wheel', handleWheel);
  
  // 移除右键菜单阻止
  document.oncontextmenu = null;
});
</script>

<style scoped>
.home {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: transparent;
  font-family: 'AlimamaDaoLiTi', system-ui, Avenir, Helvetica, Arial, sans-serif;
  perspective: 1000px;
  transform-style: preserve-3d;
}

/* WebGL Canvas样式 */
#webgl-fluid-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: auto;
  transition: filter 1.5s ease;
}

.content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  z-index: 1;
  padding: 20px;
  pointer-events: none;
  transform-style: preserve-3d;
}

/* 确保内容元素可以被选择，但不阻止点击事件穿透 */
.content * {
  pointer-events: auto;
  user-select: none; /* 防止文本被选中 */
  transform-style: preserve-3d;
}

.title {
  font-size: 5rem;
  margin-bottom: 1rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  line-height: 1.2;
}

.subtitle {
  font-size: 2.5rem;
  margin-bottom: 3rem;
  opacity: 0.8;
  line-height: 1.4;
}

/* 字符样式 */
.char {
  display: inline-block;
  transform-style: preserve-3d;
  backface-visibility: hidden;
}



@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1.5rem;
  }
  
  .features {
    flex-direction: column;
    align-items: center;
  }
  
  .feature-card {
    width: 100%;
    max-width: 300px;
  }
}

/* 向下滚动引导动画样式 */
.scroll-down {
  position: absolute;
  bottom: 3rem;
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

.scroll-down:hover {
  opacity: 1;
  transform: translateX(-50%) translateY(-5px);
}

/* down图标样式 */
.down-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  animation: scrollDownIcon 1.5s ease-in-out infinite;
  transform-style: preserve-3d;
}

@keyframes scrollDownIcon {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.8;
  }
  50% {
    transform: translateY(10px);
    opacity: 1;
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .scroll-down {
    bottom: 2rem;
  }
  
  .down-icon {
    width: 30px;
    height: 30px;
  }
}
</style>
