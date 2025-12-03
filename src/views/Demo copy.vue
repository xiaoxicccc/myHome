<template>
  <div class="demo-container">
    <!-- Custom Cursor -->
    <div id="cursor" class="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"></div>
    <div id="cursor-follower" class="fixed top-0 left-0 w-10 h-10 border border-white/50 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-out"></div>

    <!-- Loader -->
    <div id="loader" class="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center text-white">
      <div id="loader-content" class="text-center overflow-hidden">
        <h1 id="loader-text" class="text-[12vw] font-display font-bold leading-none tracking-tighter">0%</h1>
        <p class="text-sm uppercase tracking-widest text-neutral-500 mt-4">初始化环境</p>
      </div>
    </div>

    <!-- Navbar -->
    <nav class="fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-50 mix-blend-difference text-white">
      <div class="font-display font-bold text-xl tracking-wider cursor-pointer hover-trigger">AETHER®</div>
      <div class="hidden md:flex gap-10">
        <a href="#work" class="text-sm uppercase tracking-widest hover:text-neutral-400 transition-colors hover-trigger">作品</a>
        <a href="#agency" class="text-sm uppercase tracking-widest hover:text-neutral-400 transition-colors hover-trigger">机构</a>
        <a href="#news" class="text-sm uppercase tracking-widest hover:text-neutral-400 transition-colors hover-trigger">新闻</a>
        <a href="#contact" class="text-sm uppercase tracking-widest hover:text-neutral-400 transition-colors hover-trigger">联系</a>
      </div>
      <button class="md:hidden hover-trigger">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
      </button>
    </nav>

    <main class="relative z-10 flex flex-col w-full">
      
      <!-- Hero -->
      <section id="hero" class="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden pt-20">
        <div class="absolute inset-0 z-0">
          <img id="hero-img" src="https://picsum.photos/id/26/1920/1080" alt="Abstract architecture" class="w-full h-full object-cover opacity-60 scale-125" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90"></div>
        </div>
        <div class="relative z-10 text-center px-4 max-w-7xl mx-auto">
          <p id="hero-sub" class="text-sm md:text-base text-neutral-400 uppercase tracking-[0.5em] mb-6 opacity-0 translate-y-10">数字创新工作室</p>
          <h1 id="hero-title" class="text-[12vw] leading-[0.85] font-display font-bold uppercase mix-blend-screen opacity-0 translate-y-20 cursor-text-trigger">
            超越<br/>现实
          </h1>
        </div>
        <div class="absolute bottom-10 left-10 hidden md:block">
          <span class="block text-xs text-neutral-500 uppercase tracking-widest mb-1">滚动探索</span>
          <div class="w-px h-16 bg-neutral-700 mx-auto animate-pulse"></div>
        </div>
      </section>

      <!-- Marquee -->
      <div id="marquee" class="relative flex overflow-hidden whitespace-nowrap bg-neutral-900 py-10 md:py-20 -rotate-2 origin-left scale-110 z-20 border-y border-neutral-800">
        <div id="marquee-inner" class="relative flex whitespace-nowrap">
          <div class="marquee-part flex gap-10 items-center pr-10">
            <p class="text-[8vw] font-display font-bold stroke-text opacity-50 uppercase">
               设计 • 策略 • 开发 • 品牌 •
            </p>
          </div>
          <div class="marquee-part flex gap-10 items-center absolute left-full top-0 pl-10">
            <p class="text-[8vw] font-display font-bold stroke-text opacity-50 uppercase">
               设计 • 策略 • 开发 • 品牌 •
            </p>
          </div>
        </div>
      </div>

      <!-- About -->
      <section id="about" class="relative min-h-screen w-full flex items-center justify-center py-24 px-6 md:px-20 bg-[#050505]">
        <div class="max-w-5xl">
          <p class="text-sm text-indigo-500 uppercase tracking-widest mb-8 font-semibold">我们的理念</p>
          <p id="about-text" class="text-4xl md:text-6xl lg:text-7xl leading-tight font-medium text-white cursor-text-trigger">
            我们创造融合美学完美与技术卓越的数字体验。我们的使命是重新定义网络的边界，将静态像素转化为流畅、生动的情感，吸引全球观众。
          </p>
          <div class="mt-20 flex flex-col md:flex-row gap-10 md:gap-32">
            <div class="flex flex-col gap-4">
              <h3 class="text-2xl font-display uppercase text-neutral-400">服务</h3>
              <ul class="text-neutral-500 space-y-2 text-lg">
                <li>艺术指导</li>
                <li>WebGL开发</li>
                <li>创意策略</li>
                <li>动态设计</li>
              </ul>
            </div>
            <div class="flex flex-col gap-4">
              <h3 class="text-2xl font-display uppercase text-neutral-400">客户</h3>
              <ul class="text-neutral-500 space-y-2 text-lg">
                <li>谷歌</li>
                <li>耐克</li>
                <li>Spotify</li>
                <li>LVMH</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Horizontal Gallery -->
      <section class="overflow-hidden">
        <div id="gallery-trigger" class="h-screen">
          <div id="gallery-container" class="h-full w-[360vw] flex relative bg-neutral-900">
            <!-- Intro Panel -->
            <div class="w-[100vw] h-full flex flex-col justify-center px-20 border-r border-neutral-800">
              <h2 class="text-[10vw] leading-none font-display font-bold uppercase text-neutral-200">精选<br/>作品</h2>
              <div class="mt-10 flex items-center gap-4">
                <div class="w-20 h-[1px] bg-white"></div>
                <p class="text-xl uppercase tracking-widest">2023 — 2024</p>
              </div>
            </div>
            
            <!-- Project 1 -->
            <div class="project-item w-[60vw] h-full flex items-center justify-center relative border-r border-neutral-800 p-20">
              <div class="group relative w-full h-[70vh] overflow-hidden hover-trigger">
                <img src="https://picsum.photos/id/15/800/1000" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                  <span class="text-xs uppercase tracking-widest border border-white/30 rounded-full px-3 py-1 w-fit mb-4 backdrop-blur-sm">沉浸式网页</span>
                  <h3 class="text-4xl font-display font-bold uppercase">霓虹东京</h3>
                  <p class="text-neutral-300 mt-2">2023</p>
                </div>
              </div>
              <div class="absolute bottom-10 left-10 text-[10rem] font-display font-bold text-neutral-800 opacity-20 pointer-events-none select-none -z-10">01</div>
            </div>

            <!-- Project 2 -->
            <div class="project-item w-[60vw] h-full flex items-center justify-center relative border-r border-neutral-800 p-20">
              <div class="group relative w-full h-[70vh] overflow-hidden hover-trigger">
                <img src="https://picsum.photos/id/28/800/1000" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                  <span class="text-xs uppercase tracking-widest border border-white/30 rounded-full px-3 py-1 w-fit mb-4 backdrop-blur-sm">WebGL实验</span>
                  <h3 class="text-4xl font-display font-bold uppercase">抽象流动</h3>
                  <p class="text-neutral-300 mt-2">2023</p>
                </div>
              </div>
              <div class="absolute bottom-10 left-10 text-[10rem] font-display font-bold text-neutral-800 opacity-20 pointer-events-none select-none -z-10">02</div>
            </div>

            <!-- Project 3 -->
            <div class="project-item w-[60vw] h-full flex items-center justify-center relative border-r border-neutral-800 p-20">
              <div class="group relative w-full h-[70vh] overflow-hidden hover-trigger">
                <img src="https://picsum.photos/id/24/800/1000" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                  <span class="text-xs uppercase tracking-widest border border-white/30 rounded-full px-3 py-1 w-fit mb-4 backdrop-blur-sm">电子商务</span>
                  <h3 class="text-4xl font-display font-bold uppercase">赛博朋克</h3>
                  <p class="text-neutral-300 mt-2">2024</p>
                </div>
              </div>
              <div class="absolute bottom-10 left-10 text-[10rem] font-display font-bold text-neutral-800 opacity-20 pointer-events-none select-none -z-10">03</div>
            </div>

             <!-- Project 4 -->
             <div class="project-item w-[60vw] h-full flex items-center justify-center relative border-r border-neutral-800 p-20">
                <div class="group relative w-full h-[70vh] overflow-hidden hover-trigger">
                  <img src="https://picsum.photos/id/48/800/1000" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                    <span class="text-xs uppercase tracking-widest border border-white/30 rounded-full px-3 py-1 w-fit mb-4 backdrop-blur-sm">作品集</span>
                    <h3 class="text-4xl font-display font-bold uppercase">极简主义</h3>
                    <p class="text-neutral-300 mt-2">2024</p>
                  </div>
                </div>
                <div class="absolute bottom-10 left-10 text-[10rem] font-display font-bold text-neutral-800 opacity-20 pointer-events-none select-none -z-10">04</div>
              </div>

            <!-- End Panel -->
            <div class="w-[40vw] h-full flex items-center justify-center bg-indigo-600 text-white">
              <div class="text-center cursor-pointer hover-trigger">
                <h3 class="text-6xl font-display font-bold uppercase mb-4">查看全部</h3>
                <div class="w-20 h-20 rounded-full border border-white mx-auto flex items-center justify-center hover:bg-white hover:text-indigo-600 transition-colors duration-300">
                  <span class="text-2xl">→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <div id="footer-spacer" class="h-[80vh] w-full relative z-0" style="clip-path: polygon(0% 0, 100% 0%, 100% 100%, 0 100%);">
        <div class="fixed bottom-0 h-[80vh] w-full bg-[#050505] flex flex-col justify-between p-10 md:p-20 border-t border-neutral-800">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-[12vw] leading-[0.8] font-display font-bold uppercase tracking-tighter mix-blend-difference">让我们谈谈</h2>
            </div>
            <button class="hidden md:flex items-center justify-center w-32 h-32 rounded-full border border-neutral-700 hover:bg-white hover:text-black transition-all duration-300 group hover-trigger">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:rotate-45 transition-transform duration-300"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </button>
          </div>
          <div class="flex flex-col md:flex-row justify-between items-end gap-10">
            <div class="flex gap-8">
              <a href="#" class="text-lg uppercase text-neutral-400 hover:text-white transition-colors hover-trigger">Instagram</a>
              <a href="#" class="text-lg uppercase text-neutral-400 hover:text-white transition-colors hover-trigger">Twitter</a>
              <a href="#" class="text-lg uppercase text-neutral-400 hover:text-white transition-colors hover-trigger">LinkedIn</a>
              <a href="#" class="text-lg uppercase text-neutral-400 hover:text-white transition-colors hover-trigger">Awwwards</a>
            </div>
            <div class="text-right">
              <p class="text-neutral-500 text-sm">© 2024 Aether Studios</p>
              <p class="text-neutral-500 text-sm">保留所有权利</p>
            </div>
          </div>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-indigo-900/20 blur-[100px] rounded-full pointer-events-none -z-10"></div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// --- 1. Loader Logic ---
const initLoader = (onComplete) => {
  const loaderText = document.getElementById("loader-text");
  const loaderContainer = document.getElementById("loader");
  const loaderContent = document.getElementById("loader-content");
  
  if (!loaderText || !loaderContainer || !loaderContent) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 10) + 1;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      loaderText.innerText = "100%";
      
      // Loader Exit Animation
      const tl = gsap.timeline({
        onComplete: onComplete
      });
      
      tl.to(loaderContent, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power4.inOut",
        delay: 0.5
      })
      .to(loaderContainer, {
        yPercent: -100,
        duration: 1.2,
        ease: "power4.inOut"
      });
    } else {
      loaderText.innerText = `${progress}%`;
    }
  }, 50);
};

// --- 2. Custom Cursor Logic ---
const initCursor = () => {
  const cursor = document.getElementById("cursor");
  const follower = document.getElementById("cursor-follower");
  if (!cursor || !follower) return;

  // Move logic
  const handleMouseMove = (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power2.out" });
    gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.5, ease: "power2.out" });
  };
  window.addEventListener("mousemove", handleMouseMove);

  // Hover States
  const hoverElements = document.querySelectorAll(".hover-trigger");
  hoverElements.forEach(el => {
    el.addEventListener("mouseenter", () => {
      gsap.to(cursor, { scale: 0.5, opacity: 0, duration: 0.3 });
      gsap.to(follower, { scale: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'transparent', duration: 0.3 });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 });
      gsap.to(follower, { scale: 1, backgroundColor: 'transparent', borderColor: 'rgba(255, 255, 255, 0.5)', duration: 0.3 });
    });
  });

  // Text Selection State
  const textTriggers = document.querySelectorAll(".cursor-text-trigger");
  textTriggers.forEach(el => {
    el.addEventListener("mouseenter", () => {
      gsap.to(cursor, { height: 30, width: 2, borderRadius: 0, duration: 0.3 });
      gsap.to(follower, { scale: 0, duration: 0.3 });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(cursor, { height: 8, width: 8, borderRadius: '50%', duration: 0.3 });
      gsap.to(follower, { scale: 1, duration: 0.3 });
    });
  });

  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
  };
};

// --- 3. Hero Animations ---
const initHero = () => {
  const title = document.getElementById("hero-title");
  const sub = document.getElementById("hero-sub");
  const img = document.getElementById("hero-img");
  const heroSection = document.getElementById("hero");

  if (title && sub && img && heroSection) {
    const tl = gsap.timeline();
    
    tl.to(title, { y: 0, opacity: 1, duration: 1.5, ease: "power4.out" })
      .to(sub, { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, "-=1")
      .to(img, { scale: 1, opacity: 0.6, duration: 2, ease: "expo.out" }, "-=1.5");

    // Parallax
    gsap.to(img, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }
};

// --- 4. Marquee Animation ---
const initMarquee = () => {
  const slider = document.getElementById("marquee-inner");
  const parts = document.querySelectorAll(".marquee-part");
  if (!slider || parts.length < 2) return;

  let xPercent = 0;
  let direction = -1;
  let animationFrameId;

  // Change direction based on scroll
  gsap.to(slider, {
    scrollTrigger: {
      trigger: document.documentElement,
      start: 0,
      end: window.innerHeight,
      scrub: 0.25,
      onUpdate: (e) => (direction = e.direction * -1)
    },
    x: "-=300px",
  });

  const animate = () => {
    if (xPercent <= -100) xPercent = 0;
    if (xPercent > 0) xPercent = -100;
    
    gsap.set(parts, { xPercent: xPercent });
    xPercent += 0.05 * direction;
    animationFrameId = requestAnimationFrame(animate);
  };
  animate();

  return () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };
};

// --- 5. About Text Reveal ---
const initAbout = () => {
  const textElement = document.getElementById("about-text");
  const section = document.getElementById("about");
  
  if (textElement && section) {
    // Split text
    const text = textElement.innerText;
    textElement.innerHTML = '';
    text.split(' ').forEach(word => {
      const span = document.createElement('span');
      span.innerText = word + ' ';
      span.style.opacity = '0.2';
      span.style.transition = 'opacity 0.2s';
      textElement.appendChild(span);
    });

    const spans = Array.from(textElement.children);
    gsap.to(spans, {
      opacity: 1,
      stagger: 0.1,
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        end: "bottom 70%",
        scrub: true,
      }
    });
  }
};

// --- 6. Horizontal Gallery ---
const initGallery = () => {
  const container = document.getElementById("gallery-container");
  const trigger = document.getElementById("gallery-trigger");

  if (container && trigger) {
    // 计算精确的移动距离：100vw（介绍面板） + 4 * 60vw（项目卡片） + 40vw（查看全部） - 100vw（视口）= 280vw
    // 这样移动后"查看全部"面板正好完全显示在视口中
    
    // 动态计算end值：使用1.8倍视口高度，确保在不同设备上都有良好的滚动体验
    const viewportHeight = window.innerHeight;
    const endValue = viewportHeight * 1.8; // 1.8倍视口高度，提供足够的滚动空间
    
    gsap.to(container, {
      x: "-260vw", // 精确移动距离，确保滚动结束时正好显示"查看全部"面板
      ease: "none",
      willChange: "transform", // 启用硬件加速，减少闪烁
      scrollTrigger: {
        trigger: trigger,
        start: "top top", // 明确动画开始位置：触发器顶部与视口顶部对齐
        pin: true,
        anticipatePin: 1, // 优化固定元素的表现，减少闪烁
        scrub: 0.8, // 调整scrub值，减少动画滞后，提高流畅度
        end: `+=${endValue}`, // 使用动态计算的值，与视口高度相关
        invalidateOnRefresh: true, // 窗口大小变化时重新计算，确保响应式表现
      }
    });
  }
};

// --- Main Initialization ---
let cleanupFunctions = [];

onMounted(() => {
  // 1. Start Loader
  initLoader(() => {
    // 2. Init all animations after loader finishes
    cleanupFunctions.push(initCursor());
    initHero();
    cleanupFunctions.push(initMarquee());
    initAbout();
    initGallery();
  });
});

onUnmounted(() => {
  // Cleanup all event listeners and animations
  cleanupFunctions.forEach(fn => fn && fn());
  cleanupFunctions = [];
  
  // Kill all ScrollTriggers
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
});
</script>

<style scoped>
/* Import fonts */
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Syncopate:wght@400;700&display=swap');

.demo-container {
  font-family: 'Manrope', sans-serif;
  background-color: #050505;
  color: #f5f5f5;
  overflow-x: hidden;
  cursor: none;
}

.font-display {
  font-family: 'Syncopate', sans-serif;
}

.stroke-text {
  -webkit-text-stroke: 1px #555;
  color: transparent;
}

/* Utilities */
.opacity-0 {
  opacity: 0;
}

.translate-y-100 {
  transform: translateY(100px);
}

/* Hide default scrollbar */
::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}
</style>
