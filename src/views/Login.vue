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
    </div>

    <!-- 底部宠物装饰 -->
    <div class="bottom-pets">
      <div
        v-for="pet in pets"
        :key="pet.name"
        class="pet-item"
        @mouseenter="jumpPet($event)"
        @mouseleave="resetPet($event)"
      >
        <img :src="pet.icon" :alt="pet.name" class="pet-image" />
      </div>
    </div>

    <!-- 登录模块容器 -->
    <div ref="loginModule" class="login-module">
      <!-- 左侧展示面板 -->
      <div class="left-panel">
        <div class="decorative-elements">
          <img src="../assets/icon/flowers/向日葵.png" alt="向日葵" class="decorative-flower flower-1" />
          <img src="../assets/icon/flowers/山茶花.png" alt="山茶花" class="decorative-flower flower-2" />
          <img src="../assets/icon/flowers/格桑花.png" alt="格桑花" class="decorative-flower flower-3" />
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
                v-model="formData.username"
                type="text"
                id="username"
                class="form-input"
                placeholder=" "
              />
              <label for="username" class="form-label">用户名或邮箱</label>
            </div>

            <!-- 密码输入框 -->
            <div class="form-group">
              <input
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                class="form-input"
                placeholder=" "
              />
              <label for="password" class="form-label">密码</label>
              <div
                class="password-toggle"
                role="button"
                tabindex="0"
                aria-label="切换密码可见性"
                @click="togglePassword"
                @keydown.enter="togglePassword"
              >
                <img
                  :src="showPassword ? eyeIcon : eyeCloseIcon"
                  alt="切换密码可见性"
                  class="password-icon"
                />
              </div>
            </div>

            <!-- 记住我和忘记密码 -->
            <div class="form-options">
              <label class="remember-me">
                <input type="checkbox" v-model="formData.rememberMe" class="remember-checkbox" />
                <span class="remember-text">记住我</span>
              </label>
              <a href="#" class="forgot-password">忘记密码？</a>
            </div>

            <!-- 登录按钮 -->
            <button type="submit" class="login-button" :disabled="isSubmitting">
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

// 底部宠物列表
const pets = [
  { name: '白猫', icon: new URL('../assets/icon/pet/baimao.png', import.meta.url).href },
  { name: '哈士奇', icon: new URL('../assets/icon/pet/hashiqi.png', import.meta.url).href },
  { name: '法斗', icon: new URL('../assets/icon/pet/fadou.png', import.meta.url).href },
  { name: '布偶猫', icon: new URL('../assets/icon/pet/buoumao.png', import.meta.url).href },
  { name: '柯基', icon: new URL('../assets/icon/pet/keji.png', import.meta.url).href },
  { name: '金毛', icon: new URL('../assets/icon/pet/jinmao.png', import.meta.url).href },
  { name: '蓝猫', icon: new URL('../assets/icon/pet/lanmao.png', import.meta.url).href },
  { name: '柴犬', icon: new URL('../assets/icon/pet/chaiquan.png', import.meta.url).href },
];

// 路由
const router = useRouter();

// 表单数据
const formData = ref({
  username: '',
  password: '',
  rememberMe: false,
});

// 表单状态
const showPassword = ref(false);
const isSubmitting = ref(false);

// DOM 引用
const canvas = ref(null);
const loginModule = ref(null);
const lottieContainer = ref(null);
const welcomeContainer = ref(null);

// Lottie 实例
let lottieAnimation = null;
let welcomeAnimation = null;

// Three.js 相关变量
let scene, camera, renderer, particles, particleCount, mouse;
let animationId = null;
let loginBoxRect = null; // 登录框的位置和大小信息
let collided = []; // 碰撞标记数组，记录每个雪花是否已经碰撞过登录框

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
    localStorage.setItem('isLoggedIn', 'true');
    router.push('/home');
  }, 1500);
};

// 宠物跳动动画
const jumpPet = (event) => {
  gsap.to(event.currentTarget, {
    y: -30,
    duration: 0.3,
    ease: 'power2.out',
  });
};

// 宠物恢复动画
const resetPet = (event) => {
  gsap.to(event.currentTarget, {
    y: 0,
    duration: 0.3,
    ease: 'power2.in',
  });
};

// ============ Three.js 粒子系统 ============
const initParticles = () => {
  // 创建场景
  scene = new THREE.Scene();
  scene.background = null;

  // 创建相机
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 100;

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({
    canvas: canvas.value,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 根据屏幕尺寸自适应粒子数量
  const screenArea = window.innerWidth * window.innerHeight;
  particleCount = Math.floor(screenArea / 2000);

  // 创建粒子几何体
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  // 初始化粒子位置、颜色和大小
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 400; // x 随机
    positions[i + 1] = Math.random() * 200 + 200; // y 顶部开始
    positions[i + 2] = (Math.random() - 0.5) * 400; // z 随机

    // 颜色 - 白色雪花带点浅蓝色调
    const color = new THREE.Color();
    color.setHSL(0.6, 0.2, 0.8 + Math.random() * 0.2);
    colors[i] = color.r;
    colors[i + 1] = color.g;
    colors[i + 2] = color.b;

    sizes[i / 3] = Math.random() * 2 + 1;
  }

  collided = new Array(particleCount).fill(false);

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // 粒子材质 - 更透明更柔和
  const material = new THREE.PointsMaterial({
    size: 1,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // 鼠标位置追踪
  mouse = new THREE.Vector2(0, 0);
  window.addEventListener('mousemove', handleMouseMove);

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
    const fallSpeed = 0.2 + Math.random() * 0.3;

    // 雪花下落
    positions[i + 1] -= fallSpeed;
    // 雪花左右摇摆
    positions[i] += Math.sin(Date.now() * 0.001 + i) * 0.1;

    // 雪花循环 - 落到底部后重新从顶部开始
    if (positions[i + 1] < -200) {
      const particleIndex = i / 3;
      collided[particleIndex] = false;
      positions[i] = (Math.random() - 0.5) * 400;
      positions[i + 1] = 200 + Math.random() * 100;
      positions[i + 2] = (Math.random() - 0.5) * 400;
      continue;
    }

    // 登录框碰撞检测 - 只向两边弹开一次
    if (loginBoxRect) {
      const particleIndex = i / 3;
      if (!collided[particleIndex]) {
        // 将 Three.js 坐标系转换为屏幕坐标系
        const screenX = (positions[i] / 200) * (window.innerWidth / 2) + window.innerWidth / 2;
        const screenY = (positions[i + 1] / 200) * (window.innerHeight / 2) + window.innerHeight / 2;

        if (
          screenX >= loginBoxRect.left &&
          screenX <= loginBoxRect.right &&
          screenY >= loginBoxRect.top &&
          screenY <= loginBoxRect.bottom
        ) {
          collided[particleIndex] = true;
          const loginCenterX = (loginBoxRect.left + loginBoxRect.right) / 2;
          // 向两侧弹开
          positions[i] += screenX < loginCenterX ? -(50 + Math.random() * 30) : 50 + Math.random() * 30;
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
    const repelRadius = 100;

    if (distance < repelRadius) {
      const force = (repelRadius - distance) / repelRadius;
      const angle = Math.atan2(dy, dx);
      positions[i] += Math.cos(angle) * force * 2;
      positions[i + 1] += Math.sin(angle) * force * 2;
    }

    // 缓慢的 Z 轴漂移 - 增加深度感
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
  updateLoginBoxRect();
};

// 更新登录框位置和大小信息（用于粒子碰撞检测）
const updateLoginBoxRect = () => {
  if (!loginModule.value) return;
  const rect = loginModule.value.getBoundingClientRect();
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  // 预留 20px 边距
  loginBoxRect = {
    left: centerX - rect.width / 2 - 20,
    right: centerX + rect.width / 2 + 20,
    top: centerY - rect.height / 2 - 20,
    bottom: centerY + rect.height / 2 + 20,
  };
};

// 初始化入场动画
const initAnimations = () => {
  gsap.from('.login-form-wrapper', { opacity: 0, y: 30, duration: 0.8, ease: 'power2.out' });
  gsap.from('.form-group', {
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.6,
    ease: 'power2.out',
    delay: 0.3,
  });
  gsap.from('.form-options', { opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.5 });
  gsap.from('.login-button', {
    opacity: 0,
    scale: 0.95,
    duration: 0.6,
    ease: 'power2.out',
    delay: 0.6,
  });
};

// 生命周期
onMounted(() => {
  initAnimations();
  updateLoginBoxRect();
  initParticles();
  window.addEventListener('resize', handleResize);

  // 初始化左侧 Lottie 动画
  if (lottieContainer.value) {
    lottieAnimation = lottie.loadAnimation({
      container: lottieContainer.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData,
    });
  }

  // 初始化欢迎 Lottie 动画
  if (welcomeContainer.value) {
    welcomeAnimation = lottie.loadAnimation({
      container: welcomeContainer.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: welcomeAnimationData,
    });
  }
});

onUnmounted(() => {
  // 清理 Three.js 资源
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('mousemove', handleMouseMove);
  if (animationId) cancelAnimationFrame(animationId);
  if (renderer) renderer.dispose();

  // 清理 Lottie 动画
  lottieAnimation?.destroy();
  welcomeAnimation?.destroy();
});
</script>

<style scoped lang="scss">
// 颜色变量
$primary: #3b82f6;
$primary-dark: #2563eb;
$primary-light: #93c5fd;
$text-main: #1f2937;
$text-muted: #6b7280;
$border-color: #e5e7eb;

/* ============ 容器 & 背景 ============ */
.login-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #{$primary} 0%, #{$primary-light} 100%);
  font-family: 'AlimamaDaoLiTi', system-ui, Avenir, Helvetica, Arial, sans-serif;
  overflow: hidden;
}

/* Three.js 粒子背景 */
.particle-background {
  position: absolute;
  inset: 0;
  z-index: 0;

  canvas {
    display: block;
  }
}

/* ============ 白云背景 ============ */
.clouds-background {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 100px;
  filter: blur(5px);
  animation: floatCloud 20s linear infinite;
  opacity: 0.7;

  &::before,
  &::after {
    content: '';
    position: absolute;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 100px;
    filter: blur(5px);
  }
}

.cloud-1 {
  width: 100px;
  height: 40px;
  top: 10%;
  left: -100px;
  &::before { width: 50px; height: 50px; top: -25px; left: 15px; }
  &::after { width: 70px; height: 70px; top: -35px; right: 15px; }
}

.cloud-2 {
  width: 120px;
  height: 50px;
  top: 25%;
  left: -120px;
  opacity: 0.7;
  animation-delay: 5s;
  &::before { width: 60px; height: 60px; top: -30px; left: 20px; }
  &::after { width: 80px; height: 80px; top: -40px; right: 20px; }
}

.cloud-3 {
  width: 90px;
  height: 35px;
  top: 40%;
  left: -90px;
  opacity: 0.5;
  animation-delay: 10s;
  &::before { width: 45px; height: 45px; top: -22px; left: 15px; }
  &::after { width: 60px; height: 60px; top: -30px; right: 15px; }
}

@keyframes floatCloud {
  0% { transform: translate(0, 0); }
  50% { transform: translate(20px, -10px); }
  100% { transform: translate(calc(100vw + 200px), 0); }
}

/* ============ 底部宠物装饰 ============ */
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

/* ============ 登录模块 ============ */
.login-module {
  position: relative;
  width: 900px;
  height: 600px;
  max-width: 90%;
  max-height: 90vh;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(20px);
  display: flex;
  overflow: hidden;
  z-index: 1;
  animation: pageLoad 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes pageLoad {
  to { opacity: 1; transform: translateY(0); }
}

/* 左侧展示面板 */
.left-panel {
  position: relative;
  width: 50%;
  height: 100%;
  background: linear-gradient(135deg, #{$primary-light} 0%, #60a5fa 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  z-index: 1;
  overflow: hidden;
}

.decorative-elements {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.decorative-flower {
  position: absolute;
  opacity: 0.6;
  animation: float 6s ease-in-out infinite;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.flower-1 { width: 60px; height: 60px; top: 15%; left: 15%; animation-delay: 0s; }
.flower-2 { width: 50px; height: 50px; top: 15%; right: 20%; animation-delay: 2s; }
.flower-3 { width: 70px; height: 70px; bottom: 20%; left: 25%; animation-delay: 4s; }

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
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

/* ============ 右侧登录表单 ============ */
.right-panel {
  position: relative;
  width: 50%;
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
  animation: formLoad 0.8s ease-out 0.3s forwards;
  opacity: 0;
  transform: translateY(10px);
}

@keyframes formLoad {
  to { opacity: 1; transform: translateY(0); }
}

.welcome-animation {
  width: 100%;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;

  svg { max-width: 100%; max-height: 100%; }
}

.form-subtitle {
  font-size: 1rem;
  color: $text-muted;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
  text-align: center;
}

/* 表单 */
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
  width: 100%;
  padding: 0.8rem 1rem;
  border: 2px solid $border-color;
  border-radius: 10px;
  font-size: 1rem;
  color: $text-main;
  background: white;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: $primary;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }
}

/* floating label：默认在输入框中间，聚焦/有值时上浮到输入框上方 */
.form-label {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: $text-muted;
  font-size: 1rem;
  font-weight: 500;
  pointer-events: none;
  background: transparent;
  transition: top 0.3s ease, transform 0.3s ease, font-size 0.3s ease, color 0.3s ease;
}

/* 上浮状态：聚焦或有值时，label 上移到输入框上方，背景透明无白色色块 */
.form-input:focus + .form-label,
.form-input:not(:placeholder-shown) + .form-label {
  top: 0;
  transform: translateY(-100%);
  font-size: 0.85rem;
  color: $primary;
}

/* 密码切换按钮 */
.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid $border-color;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(59, 130, 246, 0.1);
    border-color: $primary;
    transform: translateY(-50%) scale(1.1);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  .password-icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
    transition: all 0.3s ease;
  }

  &:hover .password-icon {
    transform: scale(1.1);
  }
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
  accent-color: $primary;
}

.remember-text {
  font-size: 1rem;
  color: $text-muted;
  font-weight: 500;
}

.forgot-password {
  font-size: 1rem;
  color: $primary;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: $primary-dark;
    text-decoration: underline;
  }
}

/* 登录按钮 */
.login-button {
  width: 100%;
  padding: 1.2rem;
  background: linear-gradient(135deg, #{$primary} 0%, #{$primary-dark} 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: buttonLoad 0.8s ease-out 0.6s forwards;
  opacity: 0;
  transform: translateY(5px);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.5);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
}

@keyframes buttonLoad {
  to { opacity: 1; transform: translateY(0); }
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  margin: 0 auto;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ============ 响应式设计 ============ */
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

  .visual-content {
    width: 200px;
    height: 200px;
  }

  .right-panel {
    padding: 2rem 1rem;
  }
}
</style>
