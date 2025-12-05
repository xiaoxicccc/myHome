<template>
  <div id="shoes" class="shoes-container" @wheel.prevent="handleWheel">
    <!-- 动态背景蒙版 -->
    <div class="shoe-background">
      <img 
        :src="currentShoe" 
        alt="Background Shoe" 
        class="background-shoe-image"
      />
    </div>
    
    <!-- 返回按钮 -->
    <div class="back-btn" @click="goBack">
      <Icon size="24">
        <Left />
      </Icon>
      <span>返回首页</span>
    </div>
    
    <!-- 页面标题 -->
    <!-- <div class="page-title">AJ系列鞋子展示</div> -->
    
    <!-- 鞋子展示区 -->
    <div class="shoe-display">
      <!-- 左侧轮播按钮 -->
      <button class="side-control-btn left" @click="prevShoe" :disabled="currentIndex === 0">
        <Icon size="32">
          <Left />
        </Icon>
      </button>
      
      <!-- 右侧轮播按钮 -->
      <button class="side-control-btn right" @click="nextShoe" :disabled="currentIndex === ajShoes.length - 1">
        <Icon size="32">
          <Right />
        </Icon>
      </button>
      
      <!-- 主鞋子展示 -->
      <div 
        class="main-shoe" 
        ref="mainShoe"
      >
        <!-- 鞋子图片 -->
        <div 
          class="shoe-image-container"
          ref="shoeImageContainer"
          @mousemove="handleMouseMove" 
          @mouseleave="resetRotation"
        >
          <img 
            :src="currentShoe" 
            alt="AJ Shoe" 
            class="shoe-image"
            loading="lazy"
          />
          
          <!-- 鞋子名称和描述集成在卡片内下方 -->
          <div class="shoe-name-overlay">
            <div class="shoe-name">{{ currentShoeName }}</div>
            <div class="shoe-desc">Air Jordan系列运动鞋</div>
            <div class="shoe-description">{{ currentShoeDescription }}</div>
          </div>
        </div>
        
        <!-- 鞋子计数器 -->
        <div class="shoe-counter">{{ currentIndex + 1 }} / {{ ajShoes.length }}</div>
      </div>
    </div>
    
    <!-- 鞋子缩略图列表 -->
    <div class="shoe-thumbnails" ref="thumbnailsContainer">
      <div class="thumbnails-wrapper" ref="thumbnailsWrapper">
        <div 
          v-for="(shoe, index) in ajShoes" 
          :key="index"
          class="thumbnail-item"
          :class="{ active: currentIndex === index }"
          @click="selectShoe(index)"
        >
          <img :src="shoe.url" alt="Shoe" loading="lazy" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from "@vicons/utils";
import { Left, Right } from "@icon-park/vue-next";
import gsap from 'gsap';

const router = useRouter();
const mainShoe = ref(null);
const shoeImageContainer = ref(null);
const thumbnailsContainer = ref(null);
const thumbnailsWrapper = ref(null);
const currentIndex = ref(0);

// 所有鞋子列表（只保留Air Jordan系列）
const ajShoes = ref([
  {
    url: new URL('@/assets/icon/shoe/Aj.svg', import.meta.url).href,
    name: 'Air Jordan 1',
    description: 'Air Jordan 1是耐克与迈克尔·乔丹合作的首款签名鞋，于1985年发布，开创了篮球鞋的新纪元。'
  },
  {
    url: new URL('@/assets/icon/shoe/Aj-2.svg', import.meta.url).href,
    name: 'Air Jordan 2',
    description: 'Air Jordan 2于1986年发布，采用了意大利工艺设计，是首款在欧洲生产的AJ系列鞋款。'
  },
  {
    url: new URL('@/assets/icon/shoe/Aj-3.svg', import.meta.url).href,
    name: 'Air Jordan 3',
    description: 'Air Jordan 3于1988年发布，首次采用了可见式气垫和爆裂纹设计，是AJ系列的经典之作。'
  },
  {
    url: new URL('@/assets/icon/shoe/Aj-4.svg', import.meta.url).href,
    name: 'Air Jordan 4',
    description: 'Air Jordan 4于1989年发布，首次引入了网面设计，提高了透气性和轻量化。'
  },
  {
    url: new URL('@/assets/icon/shoe/Aj-5.svg', import.meta.url).href,
    name: 'Air Jordan 5',
    description: 'Air Jordan 5于1990年发布，设计灵感来自二战时期的战斗机，采用了锯齿状鞋舌和透明大底。'
  },
  {
    url: new URL('@/assets/icon/shoe/Aj-6.svg', import.meta.url).href,
    name: 'Air Jordan 6',
    description: 'Air Jordan 6于1991年发布，是迈克尔·乔丹首次获得NBA总冠军时穿着的战靴。'
  },
  {
    url: new URL('@/assets/icon/shoe/Air Jordan OG.svg', import.meta.url).href,
    name: 'Air Jordan OG',
    description: 'Air Jordan OG系列复刻了经典的初代设计，保留了原汁原味的复古风格。'
  },
  {
    url: new URL('@/assets/icon/shoe/NIKE AIR JORDAN 10.svg', import.meta.url).href,
    name: 'Air Jordan 10',
    description: 'Air Jordan 10于1994年发布，鞋底刻有乔丹职业生涯的重要数据，是一款充满纪念意义的鞋款。'
  },
  {
    url: new URL('@/assets/icon/shoe/Air Jordan 12 Retro.svg', import.meta.url).href,
    name: 'Air Jordan 12',
    description: 'Air Jordan 12于1996年发布，采用了碳纤维板和zoom air气垫，提供出色的支撑和缓震。'
  },
  {
    url: new URL('@/assets/icon/shoe/Air Jordan 13 Retro CNY.svg', import.meta.url).href,
    name: 'Air Jordan 13',
    description: 'Air Jordan 13于1997年发布，设计灵感来自黑豹，采用了全息猫眼和zoom air气垫。'
  },
  {
    url: new URL('@/assets/icon/shoe/AIR JORDAN 14 RETRO.svg', import.meta.url).href,
    name: 'Air Jordan 14',
    description: 'Air Jordan 14于1998年发布，设计灵感来自法拉利跑车，是乔丹最后一次夺冠时穿着的战靴。'
  },
  {
    url: new URL('@/assets/icon/shoe/Air Jordan 4 Retro.svg', import.meta.url).href,
    name: 'Air Jordan 4 Retro',
    description: 'Air Jordan 4 Retro复刻了1989年的经典设计，保留了网面和三角支撑设计。'
  },
  {
    url: new URL('@/assets/icon/shoe/Air Jordan XXXIII PF.svg', import.meta.url).href,
    name: 'Air Jordan 33',
    description: 'Air Jordan 33于2018年发布，采用了全新的FastFit系统，提供快速穿脱体验。'
  },
  {
    url: new URL('@/assets/icon/shoe/Air Jordan XXXIV PF.svg', import.meta.url).href,
    name: 'Air Jordan 34',
    description: 'Air Jordan 34于2019年发布，采用了轻量化设计和Eclipse Plate技术，提升了运动性能。'
  }
]);

// 当前显示的鞋子
const currentShoe = ref(ajShoes.value[0].url);
const currentShoeName = ref(ajShoes.value[0].name);
const currentShoeDescription = ref(ajShoes.value[0].description);

// 鼠标滚轮处理函数
const handleWheel = (event) => {
  // 阻止默认滚动行为
  event.preventDefault();
  
  // 直接根据滚动方向切换鞋子
  if (event.deltaY > 0) {
    // 向下滚动，切换到下一个鞋子
    nextShoe();
  } else {
    // 向上滚动，切换到上一个鞋子
    prevShoe();
  }
};

// 选择鞋子
const selectShoe = (index) => {
  currentIndex.value = index;
  const shoe = ajShoes.value[index];
  
  // 使用GSAP实现平滑过渡效果，作用于shoe-image-container
  gsap.to(shoeImageContainer.value, {
    opacity: 0,
    scale: 0.95,
    duration: 0.3,
    ease: "power2.inOut",
    onComplete: () => {
      // 更新鞋子图片、名称和描述
      currentShoe.value = shoe.url;
      currentShoeName.value = shoe.name;
      currentShoeDescription.value = shoe.description;
      
      // 淡入显示新鞋子
      gsap.to(shoeImageContainer.value, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "power2.inOut"
      });
    }
  });
  
  // 同步滚动缩略图列表到对应位置
  syncThumbnailsScroll(index);
};

// 同步缩略图列表滚动位置
const syncThumbnailsScroll = (index) => {
  if (!thumbnailsWrapper.value || !thumbnailsContainer.value) return;
  
  // 计算每个缩略图项的宽度（包括间距）
  const itemWidth = 70 + 12; // 缩略图宽度 + 间距
  
  // 计算目标滚动位置
  const targetScroll = index * itemWidth - (thumbnailsContainer.value.clientWidth - itemWidth) / 2;
  
  // 使用GSAP实现平滑滚动
  gsap.to(thumbnailsWrapper.value, {
    scrollLeft: targetScroll,
    duration: 0.6,
    ease: "power2.inOut"
  });
};

// 上一个鞋子
const prevShoe = () => {
  if (currentIndex.value > 0) {
    selectShoe(currentIndex.value - 1);
  }
};

// 下一个鞋子
const nextShoe = () => {
  if (currentIndex.value < ajShoes.value.length - 1) {
    selectShoe(currentIndex.value + 1);
  }
};

// 返回首页
const goBack = () => {
  router.push('/index');
};

// 鼠标移动事件处理，使用GSAP实现3D摇摆效果
const handleMouseMove = (event) => {
  const container = event.currentTarget;
  const rect = container.getBoundingClientRect();
  
  // 计算鼠标在容器内的相对位置 (-1 到 1)
  const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
  const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  
  // 计算目标旋转角度，范围在 -10 到 10 度之间
  const targetRotateX = y * -10;
  const targetRotateY = x * 10;
  
  // 使用GSAP实现平滑的3D旋转效果，添加overwrite选项解决动画冲突
  gsap.to(container, {
    rotationX: targetRotateX,
    rotationY: targetRotateY,
    duration: 0.3,
    ease: "power2.out",
    transformPerspective: 1200,
    overwrite: "auto" // 自动覆盖冲突的动画
  });
};

// 鼠标离开时重置旋转角度
const resetRotation = () => {
  // 使用GSAP重置旋转角度，添加overwrite选项解决动画冲突
  gsap.to(shoeImageContainer.value, {
    rotationX: 0,
    rotationY: 0,
    duration: 0.5,
    ease: "power2.out",
    transformPerspective: 1200,
    overwrite: "auto" // 自动覆盖冲突的动画
  });
};
</script>

<style lang="scss" scoped>
.shoes-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #fef9e7 0%, #fdebd0 30%, #fad7a0 60%, #f8c471 100%);
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 动态背景蒙版 */
.shoe-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.15;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  filter: blur(8px);
}

.background-shoe-image {
  width: 120%;
  height: 120%;
  object-fit: contain;
  transform: scale(1.2);
  opacity: 0.7;
  transition: all 0.6s ease;
}

.back-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 100;
  font-size: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  
  &:hover {
    transform: scale(1.05);
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.page-title {
  font-size: 2.5rem;
  color: #333;
  text-align: center;
  margin: 80px 0 40px;
  font-weight: bold;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  letter-spacing: 2px;
}

.shoe-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 100%;
  max-width: 800px;
  padding: 20px;
}

.main-shoe {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  width: 100%;
  margin-bottom: 0;
  position: relative;
  z-index: 10;
  cursor: default;
}

.shoe-image-container {
  width: 480px;
  height: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.18);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.98);
  position: relative;
  z-index: 10;
  overflow: hidden;
  transform-style: preserve-3d;
  perspective: 1200px;
  transform: translateZ(0);
}

.shoe-image {
  width: 100%;
  height: 75%;
  object-fit: contain;
  border-radius: 0;
  background: transparent;
  padding: 40px 30px 0;
  margin: 0;
  transform-style: preserve-3d;
  transform: translateZ(30px);
}

/* 鞋子名称叠加层样式 */
.shoe-name-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.98) 60%, transparent);
  padding: 60px 35px 35px;
  border-radius: 0 0 24px 24px;
  text-align: center;
  z-index: 20;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.05);
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transform-style: preserve-3d;
  transform: translateZ(20px);
}

.shoe-name {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 8px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  line-height: 1.2;
  color: #333;
  backface-visibility: hidden;
}

.shoe-desc {
  font-size: 1rem;
  opacity: 0.85;
  font-weight: 500;
  color: #555;
  margin-bottom: 10px;
  backface-visibility: hidden;
}

.shoe-description {
  font-size: 0.9rem;
  opacity: 0.8;
  color: #666;
  line-height: 1.5;
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
  font-weight: 400;
  backface-visibility: hidden;
}

/* 侧边轮播按钮 */
.side-control-btn {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(15px);
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  opacity: 0.6;
  z-index: 100;
  
  &:hover:not(:disabled) {
    opacity: 1;
    transform: translateY(-50%) scale(1.1);
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
  }
  
  &:active:not(:disabled) {
    transform: translateY(-50%) scale(0.95);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  &.left {
    left: 20px;
  }
  
  &.right {
    right: 20px;
  }
}

/* 鞋子计数器 */
.shoe-counter {
  color: #333;
  font-size: 1.2rem;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(15px);
  padding: 8px 20px;
  border-radius: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-top: 50px;
  margin-bottom: 15px;
  transform-style: preserve-3d;
  transform: translateZ(10px);
  backface-visibility: hidden;
}

/* 鞋子缩略图列表 */
.shoe-thumbnails {
  position: relative;
  width: 100%;
  max-width: 800px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(15px);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-top: 0;
  margin-bottom: 20px;
  overflow: hidden;
}

.thumbnails-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
  width: fit-content;
  padding-bottom: 6px; /* 为滚动条留出空间 */
  overflow-x: auto;
  overflow-y: hidden;
  
  /* 隐藏滚动条，但保留滚动功能 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
}

.thumbnail-item {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid transparent;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
  
  &.active {
    border-color: #ffffff;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
    transform: scale(1.15);
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 8px;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
    margin: 70px 0 20px;
  }
  
  .shoe-image {
    width: 250px;
    height: 250px;
    padding: 25px;
  }
  
  .shoe-name {
    font-size: 1.5rem;
  }
  
  .thumbnail-item {
    width: 60px;
    height: 60px;
  }
  
  .control-btn {
    width: 45px;
    height: 45px;
  }
  
  .shoe-controls {
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.6rem;
    margin: 60px 0 15px;
  }
  
  .shoe-image {
    width: 200px;
    height: 200px;
    padding: 20px;
  }
  
  .shoe-name {
    font-size: 1.3rem;
  }
  
  .thumbnail-item {
    width: 50px;
    height: 50px;
  }
  
  .control-btn {
    width: 40px;
    height: 40px;
  }
  
  .shoe-controls {
    gap: 15px;
  }
  
  .shoe-counter {
    font-size: 1rem;
    padding: 6px 15px;
  }
}
</style>