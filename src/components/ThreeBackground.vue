<template>
  <div class="three-background">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import gsap from 'gsap';

const canvasRef = ref(null);
let scene, camera, renderer, particles, mouse, raycaster;
let animationId = null;

// 初始化Three.js场景
const initThree = () => {
  // 获取canvas元素
  const canvas = canvasRef.value;
  if (!canvas) return;

  // 创建场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 创建粒子系统
  createParticles();

  // 初始化鼠标位置
  mouse = new THREE.Vector2();
  raycaster = new THREE.Raycaster();

  // 添加事件监听
  window.addEventListener('resize', handleResize);
  window.addEventListener('mousemove', handleMouseMove);

  // 开始动画循环
  animate();
};

// 创建粒子系统
const createParticles = () => {
  const particleCount = 1000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  // 初始化粒子位置和颜色
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    // 随机位置
    positions[i3] = (Math.random() - 0.5) * 10;
    positions[i3 + 1] = (Math.random() - 0.5) * 10;
    positions[i3 + 2] = (Math.random() - 0.5) * 10;

    // 随机颜色（蓝色系）
    colors[i3] = 0.3 + Math.random() * 0.7;
    colors[i3 + 1] = 0.5 + Math.random() * 0.5;
    colors[i3 + 2] = 1.0;

    // 随机大小
    sizes[i] = 0.01 + Math.random() * 0.03;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // 创建材质
  const material = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  // 创建粒子系统
  particles = new THREE.Points(geometry, material);
  scene.add(particles);
};

// 处理窗口大小变化
const handleResize = () => {
  if (!camera || !renderer) return;
  
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

// 处理鼠标移动
const handleMouseMove = (event) => {
  // 将鼠标位置归一化到[-1, 1]范围
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
};

// 动画循环
const animate = () => {
  animationId = requestAnimationFrame(animate);

  if (!particles) return;

  // 更新粒子位置
  const positions = particles.geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    // 轻微浮动效果
    positions[i + 1] += Math.sin(Date.now() * 0.001 + i) * 0.001;
  }
  particles.geometry.attributes.position.needsUpdate = true;

  // 使用GSAP实现鼠标交互
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(particles);

  if (intersects.length > 0) {
    // 鼠标附近的粒子放大效果
    const sizes = particles.geometry.attributes.size.array;
    for (let i = 0; i < intersects.length; i++) {
      const index = intersects[i].index;
      gsap.to(sizes, {
        duration: 0.5,
        ease: 'power2.out',
        [index]: 0.1
      });
    }
  }

  // 旋转粒子系统
  particles.rotation.y += 0.001;

  renderer.render(scene, camera);
};

// 清理资源
const cleanup = () => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('mousemove', handleMouseMove);
  
  if (renderer) {
    renderer.dispose();
  }
  
  if (particles) {
    particles.geometry.dispose();
    particles.material.dispose();
  }
};

onMounted(() => {
  initThree();
});

onBeforeUnmount(() => {
  cleanup();
});
</script>

<style scoped>
.three-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  
  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>