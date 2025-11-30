<template>
  <div class="ipad-air-demo">
    <!-- 加载组件 -->
    <Loading />
    <!-- 向上滚动引导动画 -->
    <ScrollUp />
    <div class="wrapper">
      <!-- 动态生成所有花卉页面 -->
      <div class="pages" v-for="(flower, index) in flowers" :key="index">
        <!-- 四个角落宠物图片 -->
        <div class="pet-image top-left">
          <img :src="cornerPetImages[index].topLeft" alt="宠物" />
        </div>
        <div class="pet-image top-right">
          <img :src="cornerPetImages[index].topRight" alt="宠物" />
        </div>
        <div class="pet-image bottom-left">
          <img :src="cornerPetImages[index].bottomLeft" alt="宠物" />
        </div>
        <div class="pet-image bottom-right">
          <img :src="cornerPetImages[index].bottomRight" alt="宠物" />
        </div>
        <div class="product" :class="`item-${index + 1}`">
          <!-- 背景装饰元素 -->
          <div class="bg-decoration">
            <div class="decoration-circle circle-1"></div>
            <div class="decoration-circle circle-2"></div>
            <div class="decoration-circle circle-3"></div>
          </div>
          <div class="flower-content" :class="index % 2 === 0 ? 'left' : 'right'">
            <h1>{{ flower.name }}</h1>
            <p class="description">
              <span class="char" v-for="(char, charIndex) in flower.description" :key="charIndex">{{ char }}</span>
            </p>
            <p class="flower-language">
              <span class="char" v-for="(char, charIndex) in flower.language" :key="charIndex">{{ char }}</span>
            </p>
          </div>
          <div class="image-wrapper">
            <img :src="flower.image" :alt="flower.name" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Loading from '@/components/Loading.vue'
import ScrollUp from '@/components/ScrollUp.vue'
import { mainStore } from '@/stores'

// 注册ScrollTrigger插件
gsap.registerPlugin(ScrollTrigger)

// 初始化store
const store = mainStore()

// 使用 Vite 的 import.meta.glob 预加载所有花卉图片
const flowerImageModules = import.meta.glob('@/assets/icon/flowers/*.png', { eager: true })

// 提取花卉图片路径数组
const flowerImagePaths = ref(Object.values(flowerImageModules).map(module => module.default))

// 定义花卉数据结构
const flowerData = [
  {
    name: '向日葵',
    description: '向日葵是一种充满活力的花卉，总是面向太阳生长，象征着积极向上的生活态度。',
    language: '花语：沉默的爱、忠诚、爱慕'
  },
  {
    name: '山茶花',
    description: '山茶花是一种优雅的花卉，花瓣层层叠叠，如同高贵的公主，在微风中轻轻摇曳。',
    language: '花语：理想的爱、谦让、美德'
  },
  {
    name: '木兰花',
    description: '木兰花是一种高雅的花卉，花瓣洁白如玉，香气清幽，象征着纯洁和高尚。',
    language: '花语：高尚、纯洁、优雅'
  },
  {
    name: '格桑花',
    description: '格桑花是一种色彩斑斓的花卉，如同彩虹落在了大地上，给人们带来快乐和希望。',
    language: '花语：幸福、吉祥、美好时光'
  },
  {
    name: '水仙',
    description: '水仙花是一种清新脱俗的花卉，花朵洁白如雪，香气浓郁，象征着纯洁和吉祥。',
    language: '花语：纯洁、吉祥、团圆'
  },
  {
    name: '洋甘菊',
    description: '洋甘菊是一种小巧可爱的花卉，花朵金黄，香气宜人，象征着温暖和安慰。',
    language: '花语：温暖、安慰、治愈'
  },
  {
    name: '牵牛花',
    description: '牵牛花是一种生命力顽强的花卉，清晨开放，傍晚闭合，象征着勤劳和坚韧。',
    language: '花语：勤劳、坚韧、爱情永固'
  },
  {
    name: '百合花',
    description: '百合花是一种洁白无瑕的花卉，如同天使的翅膀，给人们带来和平和安宁。',
    language: '花语：纯洁、神圣、高雅'
  },
  {
    name: '茉莉',
    description: '茉莉花是一种香气浓郁的花卉，花朵小巧洁白，象征着纯洁和美好。',
    language: '花语：纯洁、质朴、忠贞'
  },
  {
    name: '菊花',
    description: '菊花是一种坚韧不拔的花卉，深秋开放，象征着高洁和长寿。',
    language: '花语：高洁、长寿、吉祥'
  },
  {
    name: '葱兰',
    description: '葱兰是一种清新雅致的花卉，花朵洁白，叶片葱绿，象征着纯洁和优雅。',
    language: '花语：纯洁、优雅、期待'
  },
  {
    name: '郁金香',
    description: '郁金香是一种亭亭玉立的花卉，如同热恋中的情侣，相互依偎，传递着爱的力量。',
    language: '花语：爱的表白、荣誉、永恒'
  },
  {
    name: '鸡蛋花',
    description: '鸡蛋花是一种优雅的花卉，花朵呈鸡蛋黄和白色，香气浓郁，象征着纯洁和希望。',
    language: '花语：纯洁、希望、新生'
  },
  {
    name: '鸢尾',
    description: '鸢尾花是一种高贵典雅的花卉，花瓣形如蝴蝶，色彩斑斓，象征着爱情和友谊。',
    language: '花语：爱情、友谊、信任'
  },
  {
    name: '鹤望兰',
    description: '鹤望兰是一种独特的花卉，花朵形如仙鹤，象征着自由和幸福。',
    language: '花语：自由、幸福、吉祥'
  }
]

// 为每个花卉对象分配对应的图片路径
const flowers = ref(flowerData.map((flower, index) => {
  return {
    ...flower,
    image: flowerImagePaths.value[index] || ''
  }
}))

// 使用 Vite 的 import.meta.glob 预加载所有宠物图片
const petImageModules = import.meta.glob('@/assets/icon/pet/*.png', { eager: true })

// 提取图片路径数组
const petImagePaths = ref(Object.values(petImageModules).map(module => module.default))

// 随机获取宠物图片
const getRandomPetImage = () => {
  const randomIndex = Math.floor(Math.random() * petImagePaths.value.length)
  return petImagePaths.value[randomIndex]
}

// 为每个页面的4个角落生成随机宠物图片
const cornerPetImages = ref(Array(flowers.value.length).fill(null).map(() => {
  return {
    topLeft: getRandomPetImage(),
    topRight: getRandomPetImage(),
    bottomLeft: getRandomPetImage(),
    bottomRight: getRandomPetImage()
  }
}))

onMounted(() => {
  // 先将imgLoadStatus设置为false，显示Loading组件
  store.imgLoadStatus = false
  
  // 1秒后隐藏Loading组件
  setTimeout(() => {
    store.imgLoadStatus = true
  }, 500)
  
  // 使用GSAP的ScrollTrigger实现滚动过渡效果
  initGSAPAnimations()
  // 实现逐字飞入动画 - 第一页上来就展示，其他页面滚动到对应位置才开始
  initCharacterFlyIn()
  // 实现图片3D鼠标跟随效果
  initImage3DAnimation()
})

onUnmounted(() => {
  // 移除所有图片的事件监听器
  const images = document.querySelectorAll('.image-wrapper img')
  images.forEach(image => {
    image.removeEventListener('mousemove', () => {})
    image.removeEventListener('mouseleave', () => {})
  })
})

const initGSAPAnimations = () => {
  // 获取所有页面
  const pages = document.querySelectorAll('.pages')
  const totalPages = pages.length
  
  // 为每个页面添加动画（从第二个页面开始）
  pages.forEach((page, index) => {
    // 跳过第一个页面，从第二个页面开始添加动画
    if (index > 0) {
      // 计算动画的开始和结束位置，动态计算每个页面的百分比
      const percentagePerPage = 100 / totalPages
      const start = `${(index - 1) * percentagePerPage}% top`
      const end = `${index * percentagePerPage}% top`
      
      // 使用GSAP实现clipPath动画，添加performance优化
      gsap.to(page, {
        clipPath: 'inset(0% 0px 0px 0px)',
        ease: 'none',
        scrollTrigger: {
          trigger: '.wrapper',
          start: start,
          end: end,
          scrub: true,
          // 添加performance优化
          markers: false,
          anticipatePin: 1,
          // 减少不必要的重排重绘
          invalidateOnRefresh: true
        }
      })
    }
  })
}

// 实现逐字飞入动画 - 第一页上来就展示，其他页面滚动到对应位置才开始
const initCharacterFlyIn = () => {
  // 获取所有页面
  const pages = document.querySelectorAll('.pages')
  const totalPages = pages.length
  
  // 为每个页面的文字添加动画
  pages.forEach((page, pageIndex) => {
    // 获取当前页面的所有字符
    const chars = page.querySelectorAll('.char')
    
    // 如果是第一页，页面加载完成后立即开始动画
    if (pageIndex === 0) {
      gsap.from(chars, {
        opacity: 0,
        x: 100,
        scale: 1.2,
        duration: 0.8,
        ease: 'power4.out',
        stagger: 0.05,
        delay: 0.5
      })
    } else {
      // 其他页面，滚动到对应位置才开始动画
      const percentagePerPage = 100 / totalPages
      gsap.from(chars, {
        opacity: 0,
        x: 100,
        scale: 1.2,
        duration: 0.8,
        ease: 'power4.out',
        stagger: 0.05,
        scrollTrigger: {
          trigger: '.wrapper',
          start: `${pageIndex * percentagePerPage}% top`,
          end: `${(pageIndex + 1) * percentagePerPage}% top`,
          once: true
        }
      })
    }
  })
}

// 实现图片3D鼠标跟随效果
const initImage3DAnimation = () => {
  // 获取所有图片包装容器
  const imageWrappers = document.querySelectorAll('.image-wrapper')
  
  // 为每个图片包装容器添加效果
  imageWrappers.forEach(wrapper => {
    const image = wrapper.querySelector('img')
    
    // 设置图片的3D变换样式
    image.style.transformStyle = 'preserve-3d'
    image.style.transformOrigin = 'center center'
    image.style.willChange = 'transform'
    
    // 防抖函数，减少事件处理频率
    let mouseMoveTimeout = null
    
    // 添加鼠标移动事件监听，直接绑定到图片上
    image.addEventListener('mousemove', (e) => {
      // 清除之前的定时器
      if (mouseMoveTimeout) {
        clearTimeout(mouseMoveTimeout)
      }
      
      // 设置新的定时器，延迟处理事件
      mouseMoveTimeout = setTimeout(() => {
        // 计算鼠标位置
        const mouseX = e.clientX
        const mouseY = e.clientY
        
        // 获取窗口尺寸
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight
        
        // 计算旋转角度（范围：-30到30度，反转Y轴方向，增加幅度，让效果感觉向下）
        const rotateX = (mouseY / windowHeight - 0.5) * -60
        const rotateY = (mouseX / windowWidth - 0.5) * 60
        
        // 使用GSAP实现平滑的3D旋转效果，减少持续时间
        gsap.to(image, {
          rotationX: rotateX,
          rotationY: rotateY,
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        })
      }, 50) // 50ms延迟，减少事件处理频率
    })
    
    // 添加鼠标离开事件监听，直接绑定到图片上
    image.addEventListener('mouseleave', () => {
      // 清除定时器
      if (mouseMoveTimeout) {
        clearTimeout(mouseMoveTimeout)
      }
      
      // 重置图片状态，减少持续时间
      gsap.to(image, {
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      })
    })
  })
}


</script>

<style scoped>

/* 包装容器 */
.wrapper {
  position: relative;
  width: 100%;
  height: 1500vh; /* 15个页面，每个页面100vh */
}

/* 页面容器 - 每个页面占满整个视口 */
.pages {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  transition: all 0.3s ease;
  will-change: clip-path;
  backface-visibility: hidden;
  transform: translateZ(0);
}

/* 为所有页面（除了第一个）设置初始的clipPath状态 */
.pages:nth-child(n+2) {
  clip-path: inset(100% 0px 0px 0px);
}

/* 产品容器 */
.product {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5%;
  background-color: white;
  font-family: inherit;
}

/* 花卉内容 */
.flower-content {
  flex: 1;
  max-width: 40%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: 'AlimamaDaoLiTi', Arial, sans-serif;
  position: relative;
  user-select: none; /* 防止文本被选中 */
}

/* 字符样式 */
.char {
  display: inline-block;
  transform-origin: center center;
  backface-visibility: hidden;
  perspective: 1000px;
}

/* 左对齐内容 */
.flower-content.left {
  align-items: flex-start;
  text-align: left;
}

/* 右对齐内容 */
.flower-content.right {
  align-items: flex-end;
  text-align: right;
}

/* 产品标题 */
.flower-content h1 {
  font-size: 5rem;
  margin: 0 0 20px 0;
  font-weight: 600;
  color: inherit;
  letter-spacing: -0.02em;
  transition: all 0.3s ease;
}

/* 描述段落 */
.flower-content .description {
  font-size: 1.8rem;
  line-height: 1.6;
  color: inherit;
  margin: 0 0 20px 0;
  opacity: 0.9;
}

/* 花语段落 */
.flower-content .flower-language {
  font-size: 1.6rem;
  line-height: 1.5;
  color: inherit;
  margin: 0;
  opacity: 0.95;
  font-style: italic;
  border-left: 3px solid currentColor;
  padding-left: 15px;
}

/* 右对齐时的花语样式 */
.flower-content.right .flower-language {
  border-left: none;
  border-right: 3px solid currentColor;
  padding-left: 0;
  padding-right: 15px;
}

/* 背景装饰元素 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

/* 装饰圆圈 */
.decoration-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  background-color: currentColor;
}

/* 装饰圆圈位置和大小 */
.decoration-circle.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -100px;
}

.decoration-circle.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  left: -50px;
}

.decoration-circle.circle-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 图片包装容器 */
.image-wrapper {
  flex: 1;
  max-width: 50%;
  max-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border-radius: 20px;
}

/* 产品图片 */
.image-wrapper img {
  max-width: 100%;
  max-height: 80vh;
  width: auto;
  height: auto;
  object-fit: contain;
  transition: all 0.3s ease;
  transform-style: preserve-3d;
  transform-origin: center center;
  backface-visibility: hidden;
  perspective: 1000px;
  position: relative;
  z-index: 1;
}



/* 宠物图片样式 */
.pet-image {
  position: absolute;
  z-index: 3;
  transition: all 0.3s ease;
  width: 60px;
  height: 60px;
}

/* 左上角宠物图片 */
.pet-image.top-left {
  top: 20px;
  left: 20px;
}

/* 右上角宠物图片 */
.pet-image.top-right {
  top: 20px;
  right: 20px;
}

/* 左下角宠物图片 */
.pet-image.bottom-left {
  bottom: 20px;
  left: 20px;
}

/* 右下角宠物图片 */
.pet-image.bottom-right {
  bottom: 20px;
  right: 20px;
}

/* 宠物图片 */
.pet-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: all 0.3s ease;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

/* 宠物图片悬停效果 */
.pet-image img:hover {
  transform: scale(1.2);
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3));
}

/* 主题色 - 动态生成，支持任意数量的页面 */
.product {
  background-color: #ffffff;
  color: #333333;
  transition: all 0.3s ease;
}

/* 为不同页面添加交替的柔和背景色 */
.item-1, .item-6, .item-11 {
  background-color: #fff3cd;
  color: #856404;
}

.item-2, .item-7, .item-12 {
  background-color: #f8d7da;
  color: #721c24;
}

.item-3, .item-8, .item-13 {
  background-color: #e2d9f3;
  color: #4517a0;
}

.item-4, .item-9, .item-14 {
  background-color: #d4edda;
  color: #155724;
}

.item-5, .item-10, .item-15 {
  background-color: #e3f2fd;
  color: #0d47a1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .product h1 {
    font-size: 2rem;
    bottom: 15%;
  }
  
  .product img {
    max-height: 70vh;
  }
}

@media (max-width: 480px) {
  .product h1 {
    font-size: 1.5rem;
    bottom: 20%;
  }
  
  .product img {
    max-height: 60vh;
  }
}
</style>
