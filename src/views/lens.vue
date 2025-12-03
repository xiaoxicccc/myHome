<template>
  <Transition name="fade" mode="out-in">
    <div id="app" class="relative min-h-screen w-full h-screen overflow-hidden cursor-default">
      <!-- 加载组件 -->
      <Loading />
      <!-- 返回首页按钮 -->
      

      <!-- 液体拖尾效果的SVG遮罩 -->
      <svg class="absolute w-full h-full pointer-events-none top-0 left-0 z-0 opacity-0">
        <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            </filter>
          
          <mask id="liquid-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="black" />
            <g id="trail-group" filter="url(#goo)">
              <!-- 液体拖尾将通过JS动态生成 -->
            </g>
          </mask>
        </defs>
      </svg>

    <!-- ========================================== -->
    <!-- LAYER 1: DEFAULT WORLD (Warm Beige #F5F5EE) -->
    <!-- ========================================== -->
    <div id="layer-default" class="absolute inset-0 bg-[#F5F5EE] flex flex-col items-center justify-center perspective-1000">
      
      <!-- BACKGROUND ANIMATION -->
      <div class="absolute inset-0 opacity-100 pointer-events-none">
        <svg id="topo-default" class="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice"></svg>
      </div>

      <!-- HEADER -->
      <!-- 返回上一级按钮 -->
      <button @click="goBack" class="fixed top-6 left-6 z-60 flex items-center justify-center font-bold px-24 py-8 rounded-full uppercase tracking-wider text-lg bg-[#ccff00] hover:bg-[#b3e600] text-black transition-all duration-300 ease-out shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1 active:scale-95 opacity-100 visible block">
        <!-- <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5m14 0-4-4m4 4-4 4"/></svg> -->
        <span class="leading-none ml-2" style="padding: 8px;">返回首页</span>
      </button>
      <button @click="toggleContent" class="fixed top-6 right-6 z-60 flex items-center justify-center font-bold px-24 py-8 rounded-full uppercase tracking-wider text-lg bg-[#ccff00] hover:bg-[#b3e600] text-black transition-all duration-300 ease-out shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1 active:scale-95">
        <span class="leading-none" style="padding: 8px;">{{ isDefault ? '切换内容' : '切换回默认' }}</span>
      </button>
      
      <!-- 标题 - 第一层只显示殿堂部分 -->
      <div class="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto text-center">
        <template v-if="isDefault">
          <h1 class="text-4xl md:text-5xl font-bold tracking-tighter">殿堂卡沙</h1>
        </template>
        <template v-else>
          <h1 class="text-4xl md:text-5xl font-bold tracking-tighter">殿堂阿狸</h1>
        </template>
      </div>

      <!-- CONTENT -->
      <div class="relative z-10 flex flex-col items-center justify-center w-full h-full pointer-events-none">
        <div id="img-container-default" class="relative w-[1217px] h-[717px] mb-10 flex items-center justify-center preserve-3d will-change-transform">
            <div class="absolute inset-0 bg-gray-200 overflow-hidden shadow-2xl">
                <template v-if="isDefault">
                  <img src="/images/kasha1.jpg" class="w-full h-full object-contain grayscale-[0.1] sepia-[0.1]" alt="Lando Default">
                </template>
                <template v-else>
                  <img src="/images/ali1.jpg" class="w-full h-full object-contain grayscale-[0.1] sepia-[0.1]" alt="Lando Default">
                </template>
            </div>
        </div>

        <!-- Big Text Back -->
        <div id="text-back-default" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none select-none">
          <h1 class="text-[18vw] font-black leading-none tracking-tighter text-[#E0E0D5]/50">LN4</h1>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- LAYER 2: REVEALED WORLD (Off-White #FCFCF9) -->
    <!-- ========================================== -->
    <div id="layer-revealed" class="absolute inset-0 bg-[#FCFCF9] flex flex-col items-center justify-center z-50 pointer-events-none perspective-1000">
      
       <!-- BACKGROUND ANIMATION -->
       <div class="absolute inset-0 opacity-100 pointer-events-none">
          <svg id="topo-revealed" class="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice"></svg>
      </div>

      <!-- HEADER -->
      <!-- 标题 - 第二层显示传奇不朽部分，通过透视效果看到 -->
      <div class="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto text-center">
        <template v-if="isDefault">
          <h2 class="text-4xl md:text-5xl font-bold tracking-tighter">传奇不朽卡沙</h2>
        </template>
        <template v-else>
          <h2 class="text-4xl md:text-5xl font-bold tracking-tighter">传奇不朽阿狸</h2>
        </template>
      </div>

      <!-- CONTENT -->
      <div class="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <div id="img-container-revealed" class="relative w-[1217px] h-[717px] mb-10 flex items-center justify-center preserve-3d will-change-transform">
          <!-- Subject Only - Cutout Look -->
          <div class="absolute inset-0 flex items-center justify-center">
            <template v-if="isDefault">
              <video 
                src="/images/kasha2.webm" 
                class="w-full h-full object-contain filter contrast-110 brightness-105 reveal-image-mask"
                alt="Lando Subject"
                autoplay muted loop playsinline
              ></video>
            </template>
            <template v-else>
              <video 
                src="/images/ali2.webm" 
                class="w-full h-full object-contain filter contrast-110 brightness-105 reveal-image-mask"
                alt="Lando Subject"
                autoplay muted loop playsinline
              ></video>
            </template>
             <!-- Overlay Graphics -->
             <div class="absolute inset-0 flex items-center justify-center translate-z-10">
                <div class="w-[85%] h-[65%] border border-black/10 rounded-full opacity-60 scale-110"></div>
                <div class="absolute top-[25%] right-[15%] text-[9px] font-mono text-black bg-white/50 px-1 backdrop-blur-sm border border-black/5">
                    目标锁定
                </div>
             </div>
          </div>
        </div>

        <!-- Big Text Back -->
        <div id="text-back-revealed" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 select-none">
          <h1 class="text-[18vw] font-black leading-none tracking-tighter text-transparent text-stroke-reveal">LN4</h1>
        </div>

        <!-- 统计数据 -->
        <div class="absolute right-8 bottom-32 hidden md:block text-[10px] font-mono space-y-2 text-right translate-y-0 opacity-100">
          <div class="text-black">
            <p class="opacity-50">心率</p>
            <p class="text-lg font-bold">124 BPM</p>
          </div>
          <div class="text-black mt-4">
            <p class="opacity-50">重力加速度</p>
            <p class="text-lg font-bold">4.2 G</p>
          </div>
        </div>
      </div>
    </div>

  </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import Loading from '@/components/Loading.vue';
import { mainStore } from '@/stores';

// 初始化路由
const router = useRouter();

// 初始化store
const store = mainStore();

// 返回上一级
const goBack = () => {
  router.back();
};

// 切换状态
const isDefault = ref(true);

// 切换函数
const toggleContent = () => {
  isDefault.value = !isDefault.value;
};

// 状态管理
const state = ref({
  mouse: { x: -100, y: -100 },
  lastMouse: { x: -100, y: -100 },
  lastEmit: { x: -100, y: -100 },
  trail: [],
  lastMainPointId: null,
  idCounter: 0,
  window: { w: window.innerWidth, h: window.innerHeight }
});

// DOM元素引用
let trailGroup = null;
let imgDefault = null;
let imgRevealed = null;
let textDefault = null;
let textRevealed = null;
let topoDefault = null;
let topoRevealed = null;

// 背景拓扑图类
class TopographicSystem {
  constructor(svgId, color) {
    this.svg = document.getElementById(svgId);
    this.color = color;
    this.paths = [];
    this.lineData = [];
    this.init();
  }

  init() {
    const lineCount = 6;
    for (let i = 0; i < lineCount; i++) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', this.color);
      path.setAttribute('stroke-width', '1.5');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      this.svg.appendChild(path);
      this.paths.push(path);

      // 生成随机配置
      this.lineData.push({
        baseRadius: 250 + i * 140,
        speed: 0.002 + Math.random() * 0.004,
        amplitude: 30 + i * 5,
        phase1: Math.random() * Math.PI * 2,
        phase2: Math.random() * Math.PI * 2,
        freq1: 2 + Math.floor(Math.random() * 2),
        freq2: 3 + Math.floor(Math.random() * 3)
      });
    }
  }

  update(time) {
    const cx = 1920 / 2;
    const cy = 1080 / 2;
    const segments = 100;

    this.paths.forEach((path, i) => {
      const data = this.lineData[i];
      let d = "";

      for (let j = 0; j <= segments; j++) {
        const angle = (j / segments) * Math.PI * 2;
        const wave1 = Math.sin(angle * data.freq1 + time * data.speed + data.phase1);
        const wave2 = Math.cos(angle * data.freq2 - time * (data.speed * 0.8) + data.phase2);
        const normalizedNoise = (wave1 + wave2) / 2;
        const offset = normalizedNoise * data.amplitude;
        const breathe = Math.sin(time * 0.005) * 20;
        const r = data.baseRadius + offset + breathe;
        
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        d += `${j === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `;
      }
      d += "Z";
      path.setAttribute('d', d);
    });
  }
}

// 液体拖尾效果
const updateTrail = () => {
  // 计算移动距离
  const dx = state.value.mouse.x - state.value.lastMouse.x;
  const dy = state.value.mouse.y - state.value.lastMouse.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  // 调整发射阈值，增大值减少发射频率
  const emitThreshold = 10;
  const distFromLastEmit = Math.sqrt(
    Math.pow(state.value.mouse.x - state.value.lastEmit.x, 2) +
    Math.pow(state.value.mouse.y - state.value.lastEmit.y, 2)
  );

  // 增加衰减率，加快粒子消失
  const decayRate = 0.03;
  state.value.trail.forEach(p => p.life -= decayRate);

  // 发射逻辑
  const shouldEmit = distFromLastEmit > emitThreshold || (state.value.trail.length === 0 && dist > 5);

  if (shouldEmit) {
    // 发射新点
    let angle = 0;
    if (dist > 1) angle = Math.atan2(dy, dx) * (180 / Math.PI);

    const speed = Math.min(dist, 30); // 降低最大速度
    const stretch = 1 + (speed * 0.08); // 适度增加拉伸效果，调小透镜宽度
    const randomScale = 1.0 + Math.random() * 0.4; // 适度增大粒子大小，调小透镜宽度
    const angleJitter = (Math.random() - 0.5) * 10; // 减少角度抖动

    const mainPoint = {
      id: state.value.idCounter++,
      x: state.value.mouse.x,
      y: state.value.mouse.y,
      angle: angle + angleJitter,
      scaleX: stretch * 1.3, // 适度加宽透镜宽度
      scaleY: 1 / Math.sqrt(stretch),
      life: 0.9, // 保持初始生命值
      randomScale: randomScale,
      type: 'main'
    };

    state.value.trail.push(mainPoint);
    createSvgElement(mainPoint);
    state.value.lastMainPointId = mainPoint.id;

    // 减少子粒子数量，提高生成条件
    if (Math.random() > 0.8) {
      const offsetDist = 10 + Math.random() * 15; // 减少偏移距离
      const offsetAngle = Math.random() * Math.PI * 2;
      const subPoint = {
        id: state.value.idCounter++,
        x: state.value.mouse.x + Math.cos(offsetAngle) * offsetDist,
        y: state.value.mouse.y + Math.sin(offsetAngle) * offsetDist,
        angle: Math.random() * 360,
        scaleX: 1.2, scaleY: 1.2, // 增大子粒子，加宽透镜
        life: 0.5 + Math.random() * 0.2, // 减少子粒子生命值
        randomScale: 0.5 + Math.random() * 0.4, // 增大子粒子大小，加宽透镜
        type: 'sub'
      };
      state.value.trail.push(subPoint);
      createSvgElement(subPoint);
    }

    state.value.lastEmit.x = state.value.mouse.x;
    state.value.lastEmit.y = state.value.mouse.y;

  } else {
    // 拖动头部
    const lastPoint = state.value.trail.find(p => p.id === state.value.lastMainPointId);
    if (lastPoint && dist > 0.1) {
      lastPoint.x = state.value.mouse.x;
      lastPoint.y = state.value.mouse.y;
      lastPoint.life = 0.9; // 保持头部点生命值
      
      const speed = Math.min(dist, 30); // 降低最大速度
      const stretch = 1 + (speed * 0.08); // 适度增加拉伸效果，调小透镜宽度
      lastPoint.scaleX = stretch * 1.3; // 适度加宽透镜宽度
      lastPoint.scaleY = 1 / Math.sqrt(stretch);

      if (dist > 1) lastPoint.angle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      updateSvgElement(lastPoint);
    }
  }

  // 清理
  for (let i = state.value.trail.length - 1; i >= 0; i--) {
    const p = state.value.trail[i];
    if (p.life <= 0) {
      removeSvgElement(p.id);
      state.value.trail.splice(i, 1);
    } else {
      if (p.type !== 'main' || p.id !== state.value.lastMainPointId) {
        updateSvgElement(p);
      }
    }
  }

  // 更新最后鼠标位置
  state.value.lastMouse.x = state.value.mouse.x;
  state.value.lastMouse.y = state.value.mouse.y;
};

// SVG辅助函数
const createSvgElement = (p) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  el.setAttribute('id', `trail-${p.id}`);
  el.setAttribute('fill', 'white');
  updateSvgElementDom(el, p);
  trailGroup.appendChild(el);
};

const updateSvgElement = (p) => {
  const el = document.getElementById(`trail-${p.id}`);
  if (el) updateSvgElementDom(el, p);
};

const updateSvgElementDom = (el, p) => {
  el.setAttribute('cx', p.x);
  el.setAttribute('cy', p.y);
  el.setAttribute('rx', 50 * p.scaleX * p.randomScale);
  el.setAttribute('ry', 50 * p.scaleY * p.randomScale);
  el.setAttribute('transform', `rotate(${p.angle}, ${p.x}, ${p.y})`);
  el.style.opacity = p.life;
};

const removeSvgElement = (id) => {
  const el = document.getElementById(`trail-${id}`);
  if (el) el.remove();
};

// 场景和视差效果
const updateScene = () => {
  // 归一化 -1 到 1
  const nx = (state.value.mouse.x / state.value.window.w) * 2 - 1;
  const ny = (state.value.mouse.y / state.value.window.h) * 2 - 1;

  // 视差设置
  const pFactorDefault = 15;
  const pFactorRevealed = 25;

  // 变换
  const tDefault = `translate3d(${nx * pFactorDefault}px, ${ny * pFactorDefault}px, 0) rotateX(${-ny * 5}deg) rotateY(${nx * 5}deg)`;
  const tRevealed = `translate3d(${nx * pFactorRevealed}px, ${ny * pFactorRevealed}px, 0) rotateX(${-ny * 5}deg) rotateY(${nx * 5}deg)`;

  imgDefault.style.transform = tDefault;
  imgRevealed.style.transform = tRevealed;

  // 文字视差（相反/更慢）
  const tText = `translate(-50%, -50%) translate3d(${nx * 7.5}px, ${ny * 7.5}px, -50px)`;
  textDefault.style.transform = tText;
  textRevealed.style.transform = tText;
};

// 主循环
let time = 0;
const loop = () => {
  time += 1;

  updateTrail();
  updateScene();
  
  topoDefault.update(time);
  topoRevealed.update(time);

  requestAnimationFrame(loop);
};

// 初始化
onMounted(() => {
  // 先将imgLoadStatus设置为false，显示Loading组件
  store.imgLoadStatus = false;
  
  // 获取DOM元素
  trailGroup = document.getElementById('trail-group');
  imgDefault = document.getElementById('img-container-default');
  imgRevealed = document.getElementById('img-container-revealed');
  textDefault = document.getElementById('text-back-default');
  textRevealed = document.getElementById('text-back-revealed');

  // 初始化背景拓扑图
  topoDefault = new TopographicSystem('topo-default', '#E7E7D9');
  topoRevealed = new TopographicSystem('topo-revealed', '#E7E7D9');

  // 鼠标事件监听
  window.addEventListener('mousemove', (e) => {
    state.value.mouse.x = e.clientX;
    state.value.mouse.y = e.clientY;
  });

  // 窗口大小变化
  window.addEventListener('resize', () => {
    state.value.window.w = window.innerWidth;
    state.value.window.h = window.innerHeight;
  });
  
  // 0.5秒后隐藏Loading组件，然后再启动动画循环
  setTimeout(() => {
    store.imgLoadStatus = true;
    // 延迟100ms启动动画，确保Loading组件完全隐藏，避免资源竞争
    setTimeout(() => {
      // 开始主循环
      loop();
    }, 500);
  }, 500);
});

// 清理
onUnmounted(() => {
  // 移除事件监听
  window.removeEventListener('mousemove', () => {});
  window.removeEventListener('resize', () => {});
});
</script>

<style scoped>
/* 基础样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: 'Space Grotesk', sans-serif;
  margin: 0;
  overflow: hidden;
  background-color: #F5F5EE;
}

.perspective-1000 {
  perspective: 1000px;
}

.preserve-3d {
  transform-style: preserve-3d;
}

/* 隐藏滚动条 */
::-webkit-scrollbar {
  display: none;
}

/* 揭示遮罩样式 */
#layer-revealed {
  mask-image: url(#liquid-mask);
  -webkit-mask-image: url(#liquid-mask);
}

.reveal-image-mask {
  mask-image: radial-gradient(circle at center, black 40%, transparent 70%);
  -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 70%);
}

.text-stroke-reveal {
  -webkit-text-stroke: 1px rgba(0,0,0,0.1);
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  /* 针对大文本的响应式调整 */
  #text-back-default h1,
  #text-back-revealed h1 {
    font-size: 24vw;
  }
  
  /* 针对图片容器的响应式调整 */
  #img-container-default,
  #img-container-revealed {
    width: 280px !important;
  }
}
</style>
