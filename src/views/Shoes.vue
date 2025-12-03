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
          :style="{
            transform: `perspective(1200px) rotateX(${cardRotation.x}deg) rotateY(${cardRotation.y}deg)`,
            transformStyle: 'preserve-3d'
          }"
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

// 所有鞋子列表（包含Air Jordan、Nike和Jordan系列）
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
  },
  {
    url: new URL('@/assets/icon/shoe/Air Huarache Gripp QS.svg', import.meta.url).href,
    name: 'Air Huarache Gripp QS',
    description: 'Air Huarache Gripp QS融合了经典Huarache设计与现代抓地力技术，适合多种运动场景。'
  },
  {
    url: new URL('@/assets/icon/shoe/Jordan Aerospace 720.svg', import.meta.url).href,
    name: 'Jordan Aerospace 720',
    description: 'Jordan Aerospace 720采用720度全掌气垫，提供极致缓震体验，设计灵感来自太空科技。'
  },
  {
    url: new URL('@/assets/icon/shoe/Jordan Apex-React.svg', import.meta.url).href,
    name: 'Jordan Apex-React',
    description: 'Jordan Apex-React融合了React缓震技术与潮流设计，适合日常穿着和轻度运动。'
  },
  {
    url: new URL('@/assets/icon/shoe/Jordan Mars 270 Low.svg', import.meta.url).href,
    name: 'Jordan Mars 270 Low',
    description: 'Jordan Mars 270 Low采用270度气垫设计，结合多种经典AJ元素，时尚与性能兼具。'
  },
  {
    url: new URL('@/assets/icon/shoe/Jordan React Elevation PF.svg', import.meta.url).href,
    name: 'Jordan React Elevation PF',
    description: 'Jordan React Elevation PF专为篮球运动设计，提供出色的支撑性和反应性。'
  },
  {
    url: new URL('@/assets/icon/shoe/Jordan Westbrook One Take PF.svg', import.meta.url).href,
    name: 'Jordan Westbrook One Take PF',
    description: 'Jordan Westbrook One Take PF是威少签名鞋，设计注重快速突破和变向能力。'
  },
  {
    url: new URL('@/assets/icon/shoe/Jordan Why Not Zer0.3 PF.svg', import.meta.url).href,
    name: 'Jordan Why Not Zer0.3 PF',
    description: 'Jordan Why Not Zer0.3 PF是威少第三代签名鞋，采用Zoom Air气垫，提供出色缓震。'
  },
  {
    url: new URL('@/assets/icon/shoe/JORDAN ZOOM 92.svg', import.meta.url).href,
    name: 'Jordan Zoom \'92',
    description: 'Jordan Zoom \'92融合了90年代经典设计元素与现代Zoom Air缓震技术。'
  },
  {
    url: new URL('@/assets/icon/shoe/Jumpman Diamond Low PF.svg', import.meta.url).href,
    name: 'Jumpman Diamond Low PF',
    description: 'Jumpman Diamond Low PF采用钻石切割设计语言，结合React缓震技术，适合篮球运动。'
  },
  {
    url: new URL('@/assets/icon/shoe/KD Trey 5 VIII EP.svg', import.meta.url).href,
    name: 'KD Trey 5 VIII EP',
    description: 'KD Trey 5 VIII EP是杜兰特支线签名鞋，提供可靠的性能和舒适的穿着体验。'
  },
  {
    url: new URL('@/assets/icon/shoe/Kyrie 6 By You.svg', import.meta.url).href,
    name: 'Kyrie 6 By You',
    description: 'Kyrie 6 By You是可定制版本的欧文6代签名鞋，支持个性化设计。'
  },
  {
    url: new URL('@/assets/icon/shoe/Lebron Soldier Xill ByYou.svg', import.meta.url).href,
    name: 'LeBron Soldier XIII ByYou',
    description: 'LeBron Soldier XIII ByYou是可定制版本的詹姆斯士兵系列战靴，提供出色支撑。'
  },
  {
    url: new URL('@/assets/icon/shoe/LeBron XVII PRM EP.svg', import.meta.url).href,
    name: 'LeBron XVII PRM EP',
    description: 'LeBron XVII PRM EP是詹姆斯17代签名鞋的高级版本，采用Max Air气垫。'
  },

  {
    url: new URL('@/assets/icon/shoe/Nike Air Barrage Low EMB.svg', import.meta.url).href,
    name: 'Nike Air Barrage Low EMB',
    description: 'Nike Air Barrage Low EMB复刻了90年代经典篮球鞋，采用刺绣设计元素。'
  },
  {
    url: new URL('@/assets/icon/shoe/Nike Air Flight 89 EMB.svg', import.meta.url).href,
    name: 'Nike Air Flight 89 EMB',
    description: 'Nike Air Flight 89 EMB是经典Flight系列的复刻版本，采用刺绣细节设计。'
  },
  {
    url: new URL('@/assets/icon/shoe/Nike Air Max 200 SE.svg', import.meta.url).href,
    name: 'Nike Air Max 200 SE',
    description: 'Nike Air Max 200 SE采用200度Air Max气垫，提供舒适缓震和时尚外观。'
  },
  {
    url: new URL('@/assets/icon/shoe/Nike Air Max 2090.svg', import.meta.url).href,
    name: 'Nike Air Max 2090',
    description: 'Nike Air Max 2090融合了经典90设计与未来感元素，采用全掌Air Max气垫。'
  },
  {
    url: new URL('@/assets/icon/shoe/Nike Air Max 270 React.svg', import.meta.url).href,
    name: 'Nike Air Max 270 React',
    description: 'Nike Air Max 270 React结合了270度Air Max气垫和React缓震技术，提供双重舒适体验。'
  },
  {
    url: new URL('@/assets/icon/shoe/Nike Air Max 270 XX.svg', import.meta.url).href,
    name: 'Nike Air Max 270 XX',
    description: 'Nike Air Max 270 XX是270系列的特别版本，采用独特的配色和设计元素。'
  },
  {
    url: new URL('@/assets/icon/shoe/Nike Air Max Alpha Savage.svg', import.meta.url).href,
    name: 'Nike Air Max Alpha Savage',
    description: 'Nike Air Max Alpha Savage是一款多功能训练鞋，适合力量训练和有氧运动。'
  },
  {
    url: new URL('@/assets/icon/shoe/Nike Air Max Bella TR 3.svg', import.meta.url).href,
    name: 'Nike Air Max Bella TR 3',
    description: 'Nike Air Max Bella TR 3是专为女性设计的训练鞋，提供舒适支撑和时尚外观。'
  },
  {
    url: new URL('@/assets/icon/shoe/Nike Air Max Verona.svg', import.meta.url).href,
    name: 'Nike Air Max Verona',
    description: 'Nike Air Max Verona是一款时尚休闲鞋，采用Air Max气垫和潮流设计。'
  },
  {
    url: new URL('@/assets/icon/shoe/Nike Air Monarch IV.svg', import.meta.url).href,
    name: 'Nike Air Monarch IV',
    description: 'Nike Air Monarch IV是经典的老爹鞋设计，提供可靠的舒适性和支撑性。'
  },
  {
    url: new URL('@/assets/icon/shoe/nike dunk sb.svg', import.meta.url).href,
    name: 'Nike Dunk SB',
    description: 'Nike Dunk SB是专为滑板运动设计的经典鞋款，具有出色的耐磨性和抓地力。'
  },
  {
    url: new URL('@/assets/icon/shoe/Nike Free Trainer 3.0 x MMW.svg', import.meta.url).href,
    name: 'Nike Free Trainer 3.0 x MMW',
    description: 'Nike Free Trainer 3.0 x MMW是与Matthew M. Williams合作的限量版训练鞋。'
  },
  {
    url: new URL('@/assets/icon/shoe/Nike Huarache-Type.svg', import.meta.url).href,
    name: 'Nike Huarache-Type',
    description: 'Nike Huarache-Type重新诠释了经典Huarache设计，采用现代化的材质和工艺。'
  },
  {
    url: new URL('@/assets/icon/shoe/Nike Joyride Optik.svg', import.meta.url).href,
    name: 'Nike Joyride Optik',
    description: 'Nike Joyride Optik采用创新的Joyride缓震技术，提供个性化的舒适体验。'
  },
  {
    url: new URL('@/assets/icon/shoe/Nike Lebron 3 LBJ3.svg', import.meta.url).href,
    name: 'Nike LeBron 3',
    description: 'Nike LeBron 3是詹姆斯第三代签名鞋，采用Zoom Air气垫和经典设计。'
  },
  {
    url: new URL('@/assets/icon/shoe/Nike Lebron VII QS.svg', import.meta.url).href,
    name: 'Nike LeBron VII QS',
    description: 'Nike LeBron VII QS是詹姆斯7代签名鞋的限量复刻版本，保留了经典设计元素。'
  },
  {
    url: new URL('@/assets/icon/shoe/Nike SB Zoom Blazer Mid PRM.svg', import.meta.url).href,
    name: 'Nike SB Zoom Blazer Mid PRM',
    description: 'Nike SB Zoom Blazer Mid PRM是高级版本的SB Blazer，采用优质材质和Zoom Air气垫。'
  },
  {
    url: new URL('@/assets/icon/shoe/Nike Zoom 2K.svg', import.meta.url).href,
    name: 'Nike Zoom 2K',
    description: 'Nike Zoom 2K融合了90年代复古设计与现代Zoom Air缓震技术，时尚又舒适。'
  },
  {
    url: new URL('@/assets/icon/shoe/Nike Zoom Moc The 10th.svg', import.meta.url).href,
    name: 'Nike Zoom Moc The 10th',
    description: 'Nike Zoom Moc The 10th是纪念款设计，采用独特的无鞋带结构和Zoom Air气垫。'
  }
]);

// 当前显示的鞋子
const currentShoe = ref(ajShoes.value[0].url);
const currentShoeName = ref(ajShoes.value[0].name);
const currentShoeDescription = ref(ajShoes.value[0].description);

// 卡片旋转状态
const cardRotation = ref({ x: 0, y: 0 });

// 动画控制变量
let animationFrameId = null;
let lastX = 0;
let lastY = 0;

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

// 统一的旋转动画函数
const animateRotation = (targetX, targetY, easeFactor = 0.15) => {
  // 取消之前的动画帧
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  
  const animate = () => {
    // 计算当前旋转值与目标值的差值
    const diffX = targetX - cardRotation.value.x;
    const diffY = targetY - cardRotation.value.y;
    
    // 如果差值很小，直接设置为目标值并结束动画
    if (Math.abs(diffX) < 0.05 && Math.abs(diffY) < 0.05) {
      cardRotation.value.x = targetX;
      cardRotation.value.y = targetY;
      animationFrameId = null;
      return;
    }
    
    // 更新旋转值，使用缓动效果
    cardRotation.value.x += diffX * easeFactor;
    cardRotation.value.y += diffY * easeFactor;
    
    // 继续下一帧动画
    animationFrameId = requestAnimationFrame(animate);
  };
  
  animate();
};

// 节流函数
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 鼠标移动事件处理，实现3D摆动效果
const handleMouseMove = throttle((event) => {
  const container = event.currentTarget;
  const rect = container.getBoundingClientRect();
  
  // 计算鼠标在容器内的相对位置 (-1 到 1)
  const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
  const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  
  // 计算目标旋转角度，范围在 -10 到 10 度之间，适当减小旋转范围提升性能
  const targetRotateX = y * -10;
  const targetRotateY = x * 10;
  
  // 如果目标值与当前值相差很小，跳过动画，提升性能
  if (Math.abs(targetRotateX - cardRotation.value.x) < 0.5 && 
      Math.abs(targetRotateY - cardRotation.value.y) < 0.5) {
    return;
  }
  
  // 执行动画
  animateRotation(targetRotateX, targetRotateY, 0.15);
}, 16); // 约60fps，限制调用频率

// 鼠标离开时重置旋转角度
const resetRotation = () => {
  // 使用稍小的缓动系数，实现更平滑的复位效果
  animateRotation(0, 0, 0.12);
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