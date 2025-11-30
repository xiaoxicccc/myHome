<template>
  <div id="shoes" class="shoes-container" @wheel.prevent="handleWheel">
    <!-- 返回按钮 -->
    <div class="back-btn" @click="goBack">
      <Icon size="24">
        <Left />
      </Icon>
      <span>返回首页</span>
    </div>
    
    <!-- 页面标题 -->
    <div class="page-title">AJ系列鞋子展示</div>
    
    <!-- 鞋子展示区 -->
    <div class="shoe-display">
      <!-- 主鞋子展示 -->
      <div class="main-shoe" ref="mainShoe">
        <img 
          :src="currentShoe" 
          alt="AJ Shoe" 
          class="shoe-image"
        />
        <div class="shoe-info">
          <div class="shoe-name">{{ currentShoeName }}</div>
          <div class="shoe-desc">Air Jordan系列运动鞋</div>
        </div>
      </div>
      
      <!-- 切换按钮 -->
      <div class="shoe-controls">
        <button class="control-btn left" @click="prevShoe" :disabled="currentIndex === 0">
          <Icon size="24">
            <Left />
          </Icon>
        </button>
        <div class="shoe-counter">{{ currentIndex + 1 }} / {{ ajShoes.length }}</div>
        <button class="control-btn right" @click="nextShoe" :disabled="currentIndex === ajShoes.length - 1">
          <Icon size="24">
            <Right />
          </Icon>
        </button>
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
          <img :src="shoe.url" alt="Shoe" />
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
const thumbnailsContainer = ref(null);
const thumbnailsWrapper = ref(null);
const currentIndex = ref(0);

// AJ系列鞋子列表
const ajShoes = ref([
  {
    url: new URL('@/assets/icon/shoe/Aj.svg', import.meta.url).href,
    name: 'Air Jordan 1'
  },
  {
    url: new URL('@/assets/icon/shoe/Aj-2.svg', import.meta.url).href,
    name: 'Air Jordan 2'
  },
  {
    url: new URL('@/assets/icon/shoe/Aj-3.svg', import.meta.url).href,
    name: 'Air Jordan 3'
  },
  {
    url: new URL('@/assets/icon/shoe/Aj-4.svg', import.meta.url).href,
    name: 'Air Jordan 4'
  },
  {
    url: new URL('@/assets/icon/shoe/Aj-5.svg', import.meta.url).href,
    name: 'Air Jordan 5'
  },
  {
    url: new URL('@/assets/icon/shoe/Aj-6.svg', import.meta.url).href,
    name: 'Air Jordan 6'
  },
  {
    url: new URL('@/assets/icon/shoe/Air Jordan OG.svg', import.meta.url).href,
    name: 'Air Jordan OG'
  },
  {
    url: new URL('@/assets/icon/shoe/NIKE AIR JORDAN 10.svg', import.meta.url).href,
    name: 'Air Jordan 10'
  },
  {
    url: new URL('@/assets/icon/shoe/Air Jordan 12 Retro.svg', import.meta.url).href,
    name: 'Air Jordan 12'
  },
  {
    url: new URL('@/assets/icon/shoe/Air Jordan 13 Retro CNY.svg', import.meta.url).href,
    name: 'Air Jordan 13'
  },
  {
    url: new URL('@/assets/icon/shoe/Air Jordan 4 Retro.svg', import.meta.url).href,
    name: 'Air Jordan 4 Retro'
  },
  {
    url: new URL('@/assets/icon/shoe/Air Jordan XXXIII PF.svg', import.meta.url).href,
    name: 'Air Jordan 33'
  },
  {
    url: new URL('@/assets/icon/shoe/Air Jordan XXXIV PF.svg', import.meta.url).href,
    name: 'Air Jordan 34'
  }
]);

// 当前显示的鞋子
const currentShoe = ref(ajShoes.value[0].url);
const currentShoeName = ref(ajShoes.value[0].name);

// 鼠标滚轮处理函数
const handleWheel = (event) => {
  if (!thumbnailsWrapper.value || !thumbnailsContainer.value) return;
  
  // 阻止默认滚动行为
  event.preventDefault();
  
  // 获取滚动容器的宽度和内容宽度
  const containerWidth = thumbnailsContainer.value.clientWidth;
  const contentWidth = thumbnailsWrapper.value.scrollWidth;
  
  // 计算最大滚动距离
  const maxScroll = contentWidth - containerWidth;
  
  // 获取当前滚动位置
  const currentScroll = thumbnailsWrapper.value.scrollLeft;
  
  // 降低滚动灵敏度，将放大系数从2改为0.5
  const scrollAmount = event.deltaY * 0.5;
  
  // 计算新的滚动位置
  let newScroll = currentScroll + scrollAmount;
  
  // 限制滚动范围
  newScroll = Math.max(0, Math.min(newScroll, maxScroll));
  
  // 使用GSAP实现平滑滚动动画，缩短动画时间
  gsap.to(thumbnailsWrapper.value, {
    scrollLeft: newScroll,
    duration: 0.3,
    ease: "power2.inOut"
  });
  
  // 根据滚动位置更新当前选中的鞋子
  updateCurrentShoeFromScroll(newScroll, maxScroll);
};

// 根据滚动位置更新当前选中的鞋子
const updateCurrentShoeFromScroll = (scrollPosition, maxScroll) => {
  if (maxScroll === 0) return;
  
  // 计算每个缩略图项的宽度（包括间距）
  const itemWidth = 70 + 12; // 缩略图宽度 + 间距
  
  // 计算当前可见区域的中心位置
  const containerCenter = scrollPosition + thumbnailsContainer.value.clientWidth / 2;
  
  // 计算每个缩略图的中心位置，找到最接近容器中心的那个
  let targetIndex = 0;
  let minDistance = Infinity;
  
  for (let i = 0; i < ajShoes.value.length; i++) {
    // 计算第i个缩略图的中心位置
    const itemCenter = i * itemWidth + itemWidth / 2;
    // 计算与容器中心的距离
    const distance = Math.abs(itemCenter - containerCenter);
    
    if (distance < minDistance) {
      minDistance = distance;
      targetIndex = i;
    }
  }
  
  // 限制索引范围
  const clampedIndex = Math.max(0, Math.min(targetIndex, ajShoes.value.length - 1));
  
  // 如果索引变化，切换鞋子
  if (clampedIndex !== currentIndex.value) {
    selectShoe(clampedIndex);
  }
};

// 选择鞋子
const selectShoe = (index) => {
  currentIndex.value = index;
  const shoe = ajShoes.value[index];
  
  // 使用GSAP实现平滑过渡效果
  gsap.to(mainShoe.value, {
    opacity: 0,
    scale: 0.95,
    duration: 0.3,
    ease: "power2.inOut",
    onComplete: () => {
      // 更新鞋子图片和名称
      currentShoe.value = shoe.url;
      currentShoeName.value = shoe.name;
      
      // 淡入显示新鞋子
      gsap.to(mainShoe.value, {
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
</script>

<style lang="scss" scoped>
.shoes-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.back-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 100;
  font-size: 16px;
  
  &:hover {
    transform: scale(1.05);
    background: rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.page-title {
  font-size: 2.5rem;
  color: white;
  text-align: center;
  margin: 80px 0 40px;
  font-weight: bold;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
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
  gap: 20px;
  width: 100%;
  margin-bottom: 30px;
}

.shoe-image {
  width: 300px;
  height: 300px;
  object-fit: contain;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 30px;
  transition: all 0.3s ease;
}

.shoe-info {
  text-align: center;
  color: white;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(15px);
  padding: 15px 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.shoe-name {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 8px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.shoe-desc {
  font-size: 1rem;
  opacity: 0.9;
}

/* 切换按钮 */
.shoe-controls {
  display: flex;
  align-items: center;
  gap: 30px;
  margin: 20px 0;
}

.control-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  
  &:hover:not(:disabled) {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.3);
  }
  
  &:active:not(:disabled) {
    transform: scale(0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.left {
    transform: rotate(180deg);
  }
}

.shoe-counter {
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  padding: 8px 20px;
  border-radius: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* 鞋子缩略图列表 */
.shoe-thumbnails {
  position: relative;
  width: 100%;
  max-width: 800px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(15px);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  margin-top: auto;
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