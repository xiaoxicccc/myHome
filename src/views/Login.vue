<template>
  <div class="login-container">
    <!-- Three.js 粒子背景 -->
    <div class="particle-background">
      <canvas ref="canvas"></canvas>
    </div>
    
    <!-- 白云背景 -->
    <div class="clouds-background">
      <div class="cloud cloud-1"></div>
      <div class="cloud cloud-2"></div>
      <div class="cloud cloud-3"></div>
      <!-- <div class="cloud cloud-4"></div>
      <div class="cloud cloud-5"></div> -->
    </div>
    
    <!-- 底部宠物装饰 -->
    <div class="bottom-pets">
      <div class="pet-item" @mouseenter="jumpPet($event)" @mouseleave="resetPet($event)">
        <img src="../assets/icon/pet/baimao.png" alt="白猫" class="pet-image">
      </div>
      <div class="pet-item" @mouseenter="jumpPet($event)" @mouseleave="resetPet($event)">
        <img src="../assets/icon/pet/hashiqi.png" alt="哈士奇" class="pet-image">
      </div>
      <div class="pet-item" @mouseenter="jumpPet($event)" @mouseleave="resetPet($event)">
        <img src="../assets/icon/pet/fadou.png" alt="法斗" class="pet-image">
      </div>
      <div class="pet-item" @mouseenter="jumpPet($event)" @mouseleave="resetPet($event)">
        <img src="../assets/icon/pet/buoumao.png" alt="布偶猫" class="pet-image">
      </div>
      <div class="pet-item" @mouseenter="jumpPet($event)" @mouseleave="resetPet($event)">
        <img src="../assets/icon/pet/keji.png" alt="柯基" class="pet-image">
      </div>
      <div class="pet-item" @mouseenter="jumpPet($event)" @mouseleave="resetPet($event)">
        <img src="../assets/icon/pet/jinmao.png" alt="金毛" class="pet-image">
      </div>
      <div class="pet-item" @mouseenter="jumpPet($event)" @mouseleave="resetPet($event)">
        <img src="../assets/icon/pet/lanmao.png" alt="蓝猫" class="pet-image">
      </div>
      <div class="pet-item" @mouseenter="jumpPet($event)" @mouseleave="resetPet($event)">
        <img src="../assets/icon/pet/chaiquan.png" alt="柴犬" class="pet-image">
      </div>
    </div>
    
    <!-- 登录模块容器 -->
    <div ref="loginModule" class="login-module">
      <!-- 左侧展示面板 -->
    <div class="left-panel">
      <div class="decorative-elements">
        <img src="../assets/icon/flowers/向日葵.png" alt="向日葵" class="decorative-flower flower-1">
        <img src="../assets/icon/flowers/山茶花.png" alt="山茶花" class="decorative-flower flower-2">
        <img src="../assets/icon/flowers/格桑花.png" alt="格桑花" class="decorative-flower flower-3">
      </div>
      <div class="visual-content">
        <div ref="lottieContainer" class="lottie-animation"></div>
      </div>
    </div>
      
      <!-- 右侧登录表单 -->
      <div class="right-panel">
        <div class="login-form-wrapper">
          <div ref="welcomeContainer" class="welcome-animation"></div>
          <p class="form-subtitle">登录以继续您的旅程</p>
          
          <form @submit.prevent="handleSubmit" class="login-form">
            <!-- 用户名/邮箱输入框 -->
            <div class="form-group">
              <input 
                type="text" 
                id="username" 
                v-model="formData.username" 
                @focus="handleFocus('username')" 
                @blur="handleBlur('username')" 
                ref="usernameInput"
                class="form-input"
              >
              <label for="username" ref="usernameLabel" class="form-label">用户名或邮箱</label>
            </div>
            
            <!-- 密码输入框 -->
            <div class="form-group">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                v-model="formData.password" 
                @focus="handleFocus('password')" 
                @blur="handleBlur('password')" 
                ref="passwordInput"
                class="form-input"
              >
              <label for="password" ref="passwordLabel" class="form-label">密码</label>
              <div 
                @click="togglePassword" 
                class="password-toggle"
                aria-label="切换密码可见性"
                role="button"
                tabindex="0"
                @keydown.enter="togglePassword"
              >
                <img 
                  :src="showPassword ? eyeIcon : eyeCloseIcon" 
                  alt="切换密码可见性"
                  class="password-icon"
                >
              </div>
            </div>
            
            <!-- 记住我和忘记密码 -->
            <div class="form-options">
              <label class="remember-me">
                <input type="checkbox" v-model="formData.rememberMe" class="remember-checkbox">
                <span class="remember-text">记住我</span>
              </label>
              <a href="#" class="forgot-password">忘记密码？</a>
            </div>
            
            <!-- 登录按钮 -->
            <button 
              type="submit" 
              class="login-button" 
              :disabled="isSubmitting"
            >
              <span v-if="!isSubmitting">登录</span>
              <div v-else class="loading-spinner"></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import * as THREE from 'three';
import gsap from 'gsap';
import lottie from 'lottie-web';
import animationData from '../assets/36.json';
import welcomeAnimationData from '../assets/35.json';
import eyeIcon from '../assets/icon/other/眼睛.png';
import eyeCloseIcon from '../assets/icon/other/闭眼.png';

// 初始化路由
const router = useRouter();

// 表单数据
const formData = ref({
  username: '',
  password: '',
  rememberMe: false
});

// 表单状态
const showPassword = ref(false);
const isSubmitting = ref(false);
const inputFocused = ref('');

// 引用
const canvas = ref(null);
const loginModule = ref(null);
const usernameInput = ref(null);
const usernameLabel = ref(null);
const passwordInput = ref(null);
const passwordLabel = ref(null);
const lottieContainer = ref(null);
const welcomeContainer = ref(null);
let lottieAnimation = null;
let welcomeAnimation = null;

// Three.js 相关变量
let scene, camera, renderer, particles, particleCount, mouse;
let animationId = null;
let loginBoxRect = null; // 登录框的位置和大小信息
let collided = []; // 碰撞标记数组，记录每个雪花是否已经碰撞过登录框

// 表单交互处理
const handleFocus = (field) => {
  inputFocused.value = field;
  
  // 使用 GSAP 实现标签上浮动画
  gsap.to(field === 'username' ? usernameLabel.value : passwordLabel.value, {
    y: -28,
    fontSize: '0.9rem',
    color: '#3b82f6',
    duration: 0.3,
    ease: 'power2.out'
  });
  
  // 输入框边框高亮效果
  gsap.to(field === 'username' ? usernameInput.value : passwordInput.value, {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.3)',
    duration: 0.3,
    ease: 'power2.out'
  });
};

const handleBlur = (field) => {
  const input = field === 'username' ? usernameInput.value : passwordInput.value;
  const label = field === 'username' ? usernameLabel.value : passwordLabel.value;
  const value = formData.value[field];
  
  // 如果输入内容有效则保持标签上浮状态，否则回落
  if (value.trim() === '') {
    gsap.to(label, {
      y: 0,
      fontSize: '1.1rem',
      color: '#6b7280',
      duration: 0.3,
      ease: 'power2.out'
    });
  }
  
  // 输入框边框恢复默认状态
  gsap.to(input, {
    borderColor: '#e5e7eb',
    boxShadow: 'none',
    duration: 0.3,
    ease: 'power2.out'
  });
};

// 切换密码显示/隐藏
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// 表单提交处理
const handleSubmit = () => {
  isSubmitting.value = true;
  
  // 模拟登录请求
  setTimeout(() => {
    isSubmitting.value = false;
    // 登录成功后，将登录状态保存到localStorage中
    localStorage.setItem('isLoggedIn', 'true');
    // 跳转到home页面
    router.push('/home');
  }, 1500);
};

// 宠物跳动动画
const jumpPet = (event) => {
  const petItem = event.currentTarget;
  gsap.to(petItem, {
    y: -30,
    duration: 0.3,
    ease: "power2.out"
  });
};

// 宠物恢复动画
const resetPet = (event) => {
  const petItem = event.currentTarget;
  gsap.to(petItem, {
    y: 0,
    duration: 0.3,
    ease: "power2.in"
  });
};

// 初始化 Three.js 粒子系统
const initParticles = () => {
  // 创建场景
  scene = new THREE.Scene();
  scene.background = null; // 透明背景，显示页面原有渐变
  
  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 100;
  
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({
    canvas: canvas.value,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // 计算粒子数量（根据屏幕尺寸自适应，减少数量使效果更细腻）
  const screenArea = window.innerWidth * window.innerHeight;
  particleCount = Math.floor(screenArea / 2000);
  
  // 创建粒子几何体
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  
  // 初始化粒子位置、颜色和大小
  for (let i = 0; i < particleCount * 3; i += 3) {
    // 位置 - 顶部随机位置开始下落
    positions[i] = (Math.random() - 0.5) * 400; // x 随机
    positions[i + 1] = Math.random() * 200 + 200; // y 顶部开始
    positions[i + 2] = (Math.random() - 0.5) * 400; // z 随机
    
    // 颜色 - 白色雪花
    const color = new THREE.Color();
    color.setHSL(0.6, 0.2, 0.8 + Math.random() * 0.2); // 白色系，带点浅蓝色调
    colors[i] = color.r;
    colors[i + 1] = color.g;
    colors[i + 2] = color.b;
    
    // 大小 - 雪花大小
    sizes[i / 3] = Math.random() * 2 + 1;
  }
  
  // 初始化碰撞标记数组，记录每个雪花是否已经碰撞过登录框
  collided = new Array(particleCount).fill(false);
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  // 创建粒子材质 - 更透明更柔和
  const material = new THREE.PointsMaterial({
    size: 1,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  
  // 创建粒子系统
  particles = new THREE.Points(geometry, material);
  scene.add(particles);
  
  // 鼠标位置追踪
  mouse = new THREE.Vector2(0, 0);
  window.addEventListener('mousemove', handleMouseMove);
  
  // 开始动画循环
  animate();
};

// 鼠标移动处理
const handleMouseMove = (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
};

// 动画循环
const animate = () => {
  animationId = requestAnimationFrame(animate);
  
  const positions = particles.geometry.attributes.position.array;
  
  for (let i = 0; i < positions.length; i += 3) {
    // 雪花下落速度 - 降低速度
    const fallSpeed = 0.2 + Math.random() * 0.3;
    
    // 保存当前位置用于碰撞检测
    const prevX = positions[i];
    const prevY = positions[i + 1];
    
    // 雪花下落
    positions[i + 1] -= fallSpeed;
    
    // 雪花左右摇摆 - 模拟真实雪花飘落轨迹
    positions[i] += Math.sin(Date.now() * 0.001 + i) * 0.1;
    
    // 雪花循环 - 落到底部后重新从顶部开始
    if (positions[i + 1] < -200) {
      const particleIndex = i / 3;
      // 重置碰撞标记，允许再次碰撞
      collided[particleIndex] = false;
      // 重新设置位置
      positions[i] = (Math.random() - 0.5) * 400; // 随机x位置
      positions[i + 1] = 200 + Math.random() * 100; // 顶部随机位置
      positions[i + 2] = (Math.random() - 0.5) * 400; // 随机z位置
      continue;
    }
    
    // 登录框碰撞检测和反弹 - 只向两边弹开一次
    if (loginBoxRect) {
      // 只处理未碰撞过的雪花
      const particleIndex = i / 3;
      if (!collided[particleIndex]) {
        // 将Three.js坐标系转换为屏幕坐标系
        const screenX = (positions[i] / 200) * (window.innerWidth / 2) + window.innerWidth / 2;
        const screenY = (positions[i + 1] / 200) * (window.innerHeight / 2) + window.innerHeight / 2;
        
        // 检测碰撞
        if (screenX >= loginBoxRect.left && screenX <= loginBoxRect.right &&
            screenY >= loginBoxRect.top && screenY <= loginBoxRect.bottom) {
          
          // 标记为已碰撞
          collided[particleIndex] = true;
          
          // 只向两边弹开 - 计算弹开方向
          const loginCenterX = (loginBoxRect.left + loginBoxRect.right) / 2;
          
          // 向左侧弹开
          if (screenX < loginCenterX) {
            positions[i] -= 50 + Math.random() * 30; // 向左弹开
          } 
          // 向右侧弹开
          else {
            positions[i] += 50 + Math.random() * 30; // 向右弹开
          }
          
          // 轻微向上弹起，避免立即再次碰撞
          positions[i + 1] += 20 + Math.random() * 10;
        }
      }
    }
    
    // 鼠标排斥效果
    const mouseX = mouse.x * 200;
    const mouseY = mouse.y * -200;
    const dx = positions[i] - mouseX;
    const dy = positions[i + 1] - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 排斥半径
    const repelRadius = 100;
    
    if (distance < repelRadius) {
      // 计算排斥力
      const force = (repelRadius - distance) / repelRadius;
      const angle = Math.atan2(dy, dx);
      
      // 应用排斥力
      positions[i] += Math.cos(angle) * force * 2;
      positions[i + 1] += Math.sin(angle) * force * 2;
    }
    
    // 缓慢的Z轴漂移 - 增加深度感
    positions[i + 2] += (Math.random() - 0.5) * 0.02;
  }
  
  particles.geometry.attributes.position.needsUpdate = true;
  
  renderer.render(scene, camera);
};

// 窗口大小调整处理
const handleResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  // 更新登录框位置和大小信息
  updateLoginBoxRect();
};

// 初始化动画
const initAnimations = () => {
  // 表单元素入场动画
  gsap.from('.login-form-wrapper', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power2.out'
  });
  
  gsap.from('.form-group', {
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.6,
    ease: 'power2.out',
    delay: 0.3
  });
  
  gsap.from('.form-options', {
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out',
    delay: 0.5
  });
  
  gsap.from('.login-button', {
    opacity: 0,
    scale: 0.95,
    duration: 0.6,
    ease: 'power2.out',
    delay: 0.6
  });
};

// 生命周期钩子
onMounted(() => {
  initAnimations();
  
  // 获取登录框位置和大小信息
  updateLoginBoxRect();
  
  // 初始化Three.js粒子系统
  initParticles();
  window.addEventListener('resize', handleResize);
  
  // 初始化左侧Lottie动画
  if (lottieContainer.value) {
    lottieAnimation = lottie.loadAnimation({
      container: lottieContainer.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationData
    });
  }
  
  // 初始化欢迎Lottie动画
  if (welcomeContainer.value) {
    welcomeAnimation = lottie.loadAnimation({
      container: welcomeContainer.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: welcomeAnimationData
    });
  }
});

// 更新登录框位置和大小信息
const updateLoginBoxRect = () => {
  if (loginModule.value) {
    const rect = loginModule.value.getBoundingClientRect();
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const loginWidth = rect.width;
    const loginHeight = rect.height;
    
    // 计算登录框在Three.js坐标系中的位置和大小
    loginBoxRect = {
      left: centerX - loginWidth / 2 - 20, // 左侧边界，预留一些边距
      right: centerX + loginWidth / 2 + 20, // 右侧边界，预留一些边距
      top: centerY - loginHeight / 2 - 20, // 顶部边界，预留一些边距
      bottom: centerY + loginHeight / 2 + 20 // 底部边界，预留一些边距
    };
  }
};

onUnmounted(() => {
  // 清理Three.js资源
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('mousemove', handleMouseMove);
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  if (renderer) {
    renderer.dispose();
  }
  
  // 清理Lottie动画
  if (lottieAnimation) {
    lottieAnimation.destroy();
  }
  if (welcomeAnimation) {
    welcomeAnimation.destroy();
  }
});
</script>

<style scoped>
.login-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #3b82f6 0%, #93c5fd 100%);
  font-family: 'AlimamaDaoLiTi', system-ui, Avenir, Helvetica, Arial, sans-serif;
  overflow: hidden;
}

/* Three.js 粒子背景 */
.particle-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.particle-background canvas {
  display: block;
}

/* 白云背景 */
.clouds-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

/* 白云样式 */
.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 100px;
  filter: blur(5px); /* 减少模糊效果，让白云更清晰 */
  animation: floatCloud 20s linear infinite;
  opacity: 0.7;
}

/* 白云形状 */
.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 100px;
  filter: blur(5px); /* 减少伪元素的模糊效果，让白云更清晰 */
}

/* 第一个白云 */
.cloud-1 {
  width: 100px;
  height: 40px;
  top: 10%;
  left: -100px;
  animation-delay: 0s;
}

.cloud-1::before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 15px;
}

.cloud-1::after {
  width: 70px;
  height: 70px;
  top: -35px;
  right: 15px;
}

/* 第二个白云 */
.cloud-2 {
  width: 120px;
  height: 50px;
  top: 25%;
  left: -120px;
  animation-delay: 5s;
  opacity: 0.7;
}

.cloud-2::before {
  width: 60px;
  height: 60px;
  top: -30px;
  left: 20px;
}

.cloud-2::after {
  width: 80px;
  height: 80px;
  top: -40px;
  right: 20px;
}

/* 第三个白云 */
.cloud-3 {
  width: 90px;
  height: 35px;
  top: 40%;
  left: -90px;
  animation-delay: 10s;
  opacity: 0.5;
}

.cloud-3::before {
  width: 45px;
  height: 45px;
  top: -22px;
  left: 15px;
}

.cloud-3::after {
  width: 60px;
  height: 60px;
  top: -30px;
  right: 15px;
}

/* 第四个白云 */
.cloud-4 {
  width: 110px;
  height: 45px;
  top: 60%;
  left: -110px;
  animation-delay: 15s;
  opacity: 0.8;
}

.cloud-4::before {
  width: 55px;
  height: 55px;
  top: -27px;
  left: 18px;
}

.cloud-4::after {
  width: 75px;
  height: 75px;
  top: -37px;
  right: 18px;
}

/* 第五个白云 */
.cloud-5 {
  width: 80px;
  height: 30px;
  top: 80%;
  left: -80px;
  animation-delay: 20s;
  opacity: 0.6;
}

.cloud-5::before {
  width: 40px;
  height: 40px;
  top: -20px;
  left: 12px;
}

.cloud-5::after {
  width: 55px;
  height: 55px;
  top: -27px;
  right: 12px;
}

/* 白云飘动动画 */
@keyframes floatCloud {
  0% {
    transform: translateX(0) translateY(0);
  }
  50% {
    transform: translateX(20px) translateY(-10px);
  }
  100% {
    transform: translateX(calc(100vw + 200px)) translateY(0);
  }
}

/* 底部宠物装饰 */
.bottom-pets {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 2rem;
  padding: 1rem 0;
  pointer-events: auto;
  z-index: 1;
}

.pet-item {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  transform-origin: bottom center;
}

.pet-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  transition: all 0.3s ease;
}

/* 登录模块容器 */
.login-module {
  position: relative;
  width: 900px;
  height: 600px;
  background: rgba(255, 255, 255, 0.3); /* 更透明的背景 */
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(20px); /* 更强的模糊效果 */
  display: flex;
  overflow: hidden;
  z-index: 1;
  max-width: 90%;
  max-height: 90vh;
  animation: pageLoad 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
  border: 1px solid rgba(255, 255, 255, 0.5); /* 添加边框增强毛玻璃效果 */
}

/* 页面加载动画 */
@keyframes pageLoad {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 左侧展示面板 */
.left-panel {
  position: relative;
  width: 50%;
  height: 100%;
  background: linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  z-index: 1;
  overflow: hidden;
}

/* 装饰性元素 */
.decorative-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 0;
}

.decorative-flower {
  position: absolute;
  opacity: 0.6;
  animation: float 6s ease-in-out infinite;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.flower-1 {
  width: 60px;
  height: 60px;
  top: 15%;
  left: 15%;
  animation-delay: 0s;
}

.flower-2 {
  width: 50px;
  height: 50px;
  top: 15%;
  right: 20%;
  animation-delay: 2s;
}

.flower-3 {
  width: 70px;
  height: 70px;
  bottom: 20%;
  left: 25%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

.brand {
  text-align: center;
  margin-bottom: 4rem;
}

.brand-name {
  font-size: 3rem;
  font-weight: 800;
  color: white;
  margin: 0 0 1rem 0;
}

.brand-slogan {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.visual-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.lottie-animation {
  width: 100%;
  height: 100%;
  max-width: 400px;
  max-height: 400px;
}

/* 右侧登录表单 */
.right-panel {
  position: relative;
  width: 50%;
  /* height: 100%; */
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  padding-top: 0;
  z-index: 1;
}

.login-form-wrapper {
  width: 100%;
  max-width: 350px;
  padding: 0;
  background: white;
  border-radius: 0;
  box-shadow: none;
  animation: formLoad 0.8s ease-out 0.3s forwards;
  opacity: 0;
  transform: translateY(10px);
}

/* 表单加载动画 */
@keyframes formLoad {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 欢迎动画样式 */
.welcome-animation {
  width: 100%;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
}

.welcome-animation svg {
  max-width: 100%;
  max-height: 100%;
}

.form-subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
  text-align: center;
}

/* 表单样式 */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  position: relative;
  margin-bottom: 0.5rem;
}

.form-input {
  width: calc(100% - 2rem);
  padding: 0.8rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  color: #1f2937;
  background: white;
  transition: all 0.3s ease;
  outline: none;
  margin: 0 auto;
  display: block;
}

.form-input:focus {
  border-color: #3b82f6;
}

.form-label {
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 1rem;
  pointer-events: none;
  transition: all 0.3s ease;
  background: white;
  padding: 0 0.5rem;
  font-weight: 500;
}

/* 密码切换按钮 */
.password-toggle {
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  transition: all 0.3s ease;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #e5e7eb;
}

.password-toggle:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
  transform: translateY(-50%) scale(1.1);
}

.password-toggle:active {
  transform: translateY(-50%) scale(0.95);
}

/* 密码图标样式 */
.password-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  transition: all 0.3s ease;
}

.password-toggle:hover .password-icon {
  transform: scale(1.1);
}

/* 表单选项 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  padding: 0 1rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.remember-checkbox {
  width: 1.1rem;
  height: 1.1rem;
  accent-color: #3b82f6;
}

.remember-text {
  font-size: 1rem;
  color: #6b7280;
  font-weight: 500;
}

.forgot-password {
  font-size: 1rem;
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.3s ease;
  font-weight: 500;
}

.forgot-password:hover {
  color: #2563eb;
  text-decoration: underline;
}

/* 登录按钮 */
.login-button {
  width: calc(100% - 2rem);
  padding: 1.2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
  margin: 0 auto;
  display: block;
  animation: buttonLoad 0.8s ease-out 0.6s forwards;
  opacity: 0;
  transform: translateY(5px);
}

/* 按钮加载动画 */
@keyframes buttonLoad {
  0% {
    opacity: 0;
    transform: translateY(5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.5);
}

.login-button:active {
  transform: translateY(0);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 加载动画 */
.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-module {
    flex-direction: column;
    height: auto;
    max-height: 95vh;
  }
  
  .left-panel,
  .right-panel {
    width: 100%;
    height: auto;
  }
  
  .left-panel {
    padding: 2rem 1rem;
    min-height: 300px;
  }
  
  .brand-name {
    font-size: 2rem;
  }
  
  .visual-content {
    width: 200px;
    height: 200px;
  }
  
  .right-panel {
    padding: 2rem 1rem;
  }
  
  .form-title {
    font-size: 1.8rem;
  }
}
</style>