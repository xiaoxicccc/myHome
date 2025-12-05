<template>
  <div class="ipad-air-demo">
    <!-- 加载组件 -->
    <Loading />
    <!-- 向上滚动引导动画 -->
    <ScrollUp />
    <div class="wrapper">
      <!-- 动态生成所有花卉页面 -->
      <div class="pages" v-for="(flower, index) in flowers" :key="index">
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

// 按需引入所需的花卉图片
import sunflower from '@/assets/icon/flowers/向日葵.png'
import camellia from '@/assets/icon/flowers/山茶花.png'
import magnolia from '@/assets/icon/flowers/木兰花.png'
import narcissus from '@/assets/icon/flowers/水仙.png'
import lily from '@/assets/icon/flowers/百合花.png'
import jasmine from '@/assets/icon/flowers/茉莉.png'
import chrysanthemum from '@/assets/icon/flowers/菊花.png'

// 定义花卉数据结构，只保留指定的7种花卉
const flowerData = [
  {
    name: '向日葵',
    description: '向日葵是一种充满活力的花卉，总是面向太阳生长，象征着积极向上的生活态度。',
    language: '花语：沉默的爱、忠诚、爱慕',
    image: sunflower
  },
  {
    name: '山茶花',
    description: '山茶花是一种优雅的花卉，花瓣层层叠叠，如同高贵的公主，在微风中轻轻摇曳。',
    language: '花语：理想的爱、谦让、美德',
    image: camellia
  },
  {
    name: '木兰花',
    description: '木兰花是一种高雅的花卉，花瓣洁白如玉，香气清幽，象征着纯洁和高尚。',
    language: '花语：高尚、纯洁、优雅',
    image: magnolia
  },
  {
    name: '水仙',
    description: '水仙花是一种清新脱俗的花卉，花朵洁白如雪，香气浓郁，象征着纯洁和吉祥。',
    language: '花语：纯洁、吉祥、团圆',
    image: narcissus
  },
  {
    name: '百合花',
    description: '百合花是一种洁白无瑕的花卉，如同天使的翅膀，给人们带来和平和安宁。',
    language: '花语：纯洁、神圣、高雅',
    image: lily
  },
  {
    name: '茉莉',
    description: '茉莉花是一种香气浓郁的花卉，花朵小巧洁白，象征着纯洁和美好。',
    language: '花语：纯洁、质朴、忠贞',
    image: jasmine
  },
  {
    name: '菊花',
    description: '菊花是一种坚韧不拔的花卉，深秋开放，象征着高洁和长寿。',
    language: '花语：高洁、长寿、吉祥',
    image: chrysanthemum
  }
]

// 使用花卉数据
const flowers = ref(flowerData)

// 移除宠物图片相关逻辑

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
})

onUnmounted(() => {
  // 清理资源
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




</script>

<style scoped>

/* 包装容器 */
.wrapper {
  position: relative;
  width: 100%;
  height: 700vh; /* 7个页面，每个页面100vh */
}

/* 页面容器 - 每个页面占满整个视口 */
.pages {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
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
  position: relative;
  z-index: 1;
}



/* 移除宠物图片样式 */

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
