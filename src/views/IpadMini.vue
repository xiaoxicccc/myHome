<template>
  <div class="ipad-mini-container">
    <!-- 加载组件 -->
    <Loading />
    <!-- 向上滚动引导动画 -->
    <ScrollUp />
    
    <main ref="mainRef">
      <div class="sticky">
        <div class="content" ref="contentRef">
          <section>
            <h2 class="title-1">
              <strong class="headline-gradient">iPad Mini.</strong>
              <span>小巧便携，功能强大。</span>
            </h2>
          </section>
          <section>
            <h2 class="title-2">
              探索 <strong>无限可能</strong>
              <br />
              尽在手中。
            </h2>
          </section>
          <section>
            <h2 class="title-3">
              拥有 <strong>强劲性能</strong>
              <br />
              释放创造力。
            </h2>
          </section>
        </div>
        <div class="media-wrapper">
          <canvas ref="canvasRef" width="1600" height="1176"></canvas>
        </div>
      </div>
      <div class="timeline-wrapper">
        <div class="timeline timeline-1"></div>
        <div class="timeline timeline-2"></div>
        <div class="timeline timeline-3"></div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Loading from '@/components/Loading.vue';
import ScrollUp from '@/components/ScrollUp.vue';
import { mainStore } from '@/stores';

// DOM引用
const canvasRef = ref(null);
const contentRef = ref(null);
const mainRef = ref(null);

// 初始化store
const store = mainStore();

// 视频帧数据
let frames = [];
const fps = 30;
// 使用相对路径引用assets目录下的视频资源
const source = [
  {
    url: new URL('../assets/large_a.webm', import.meta.url).href,
    frameCount: 230,
  },
  {
    url: new URL('../assets/large_b.webm', import.meta.url).href,
    frameCount: 230,
  },
];

// 创建视频元素
const createVideo = (videoUrl) => {
  const video = document.createElement('video');
  video.src = videoUrl;
  video.muted = true;
  video.playbackRate = 1;
  video.currentTime = 0;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('type', 'video/webm');
  video.setAttribute('preload', 'none');
  video.classList.add('video');
  video.style.display = 'none';
  window.document.body.appendChild(video);
  return video;
};

// 创建帧
const createFrame = (video, videoWidth, videoHeight) => {
  const canvas = window.OffscreenCanvas
    ? new OffscreenCanvas(videoWidth, videoHeight)
    : document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = videoWidth;
  canvas.height = videoHeight;
  context.drawImage(video, 0, 0, videoWidth, videoHeight);
  return canvas;
};

// 缓存视频帧
const cacheFrame = (videoMetaData) => {
  return new Promise((resolve, reject) => {
    const { url, frameCount } = videoMetaData;
    const video = createVideo(url);
    const framesStore = new Array(frameCount).fill(false);
    let videoWidth = 0;
    let videoHeight = 0;
    let setIn = 0;
    let framesNumber = 0;

    video.play();
    video.addEventListener('loadedmetadata', () => {
      videoWidth = video.videoWidth;
      videoHeight = video.videoHeight;
    });

    video.addEventListener('ended', () => {
      resolve(framesStore);
      // 清理视频元素
      video.remove();
    });

    video.addEventListener('waiting', () => {
      clearInterval(setIn);
    });

    video.addEventListener('error', () => {
      reject([]);
      // 清理视频元素
      video.remove();
    });

    video.addEventListener('canplaythrough', () => {
      clearInterval(setIn);

      setIn = setInterval(() => {
        if (framesNumber >= frameCount) {
          clearInterval(setIn);
          return;
        }

        framesStore[framesNumber] = createFrame(video, videoWidth, videoHeight);
        framesNumber++;
      }, 1000 / fps);
    });
  });
};

// 渲染帧
const renderFrame = (ctx, frame) => {
  if (!ctx || !frame) return;
  ctx.clearRect(0, 0, 1600, 1176);
  ctx.drawImage(frame, 0, 0);
};

// 滚动事件处理
const handleScroll = () => {
  // 调试信息
  console.log('滚动事件触发！');
  
  // 确保mainRef存在
  if (!mainRef.value) {
    console.log('mainRef不存在');
    return;
  }
  
  // 更新内容区域位置
  if (contentRef.value) {
    const scrollTop = mainRef.value.scrollTop;
    contentRef.value.style.transform = `matrix(1, 0, 0, 1, 0, -${scrollTop})`;
    console.log('内容区域位置更新:', scrollTop);
  }
  
  // 如果canvas不存在，直接返回
  if (!canvasRef.value) {
    console.log('Canvas不存在，跳过帧渲染');
    return;
  }
  
  const ctx = canvasRef.value.getContext('2d');
  const scrollTop = mainRef.value.scrollTop;
  const scrollHeight = mainRef.value.scrollHeight;
  const clientHeight = mainRef.value.clientHeight;
  
  // 调试信息
  console.log('滚动参数:', {
    scrollTop,
    scrollHeight,
    clientHeight,
    framesLength: frames.length
  });
  
  // 计算滚动比例，处理除以0的情况
  const scrollableHeight = scrollHeight - clientHeight;
  let scrolled = 0;
  if (scrollableHeight > 0) {
    scrolled = scrollTop / scrollableHeight;
  } else {
    console.log('滚动区域高度为0，设置滚动比例为0');
    scrolled = 0;
  }
  console.log('滚动比例:', scrolled);
  
  // 过滤无效帧
  const validFrames = frames.filter((item) => item !== false);
  console.log('有效帧数量:', validFrames.length);
  
  // 计算当前帧索引，确保不会是NaN
  let frameIndex = 0;
  if (validFrames.length > 0) {
    frameIndex = Math.min(
      validFrames.length - 1, 
      Math.max(0, Math.floor(validFrames.length * scrolled))
    );
  }
  console.log('当前帧索引:', frameIndex);
  
  // 绘制当前帧
  if (validFrames[frameIndex] !== undefined) {
    renderFrame(ctx, validFrames[frameIndex]);
    console.log('帧渲染成功');
  } else {
    console.log('当前帧索引无效:', frameIndex);
  }
};

// 生命周期钩子
onMounted(async () => {
  if (!canvasRef.value) return;
  
  // 先将imgLoadStatus设置为false，显示Loading组件
  store.imgLoadStatus = false;
  
  try {
    // 缓存视频帧
    const values = await Promise.all(source.map((item) => cacheFrame(item)));
    frames = values.flat();
    
    // 3秒后隐藏Loading组件
    setTimeout(() => {
      store.imgLoadStatus = true;
    }, 100);
    
    // 初始渲染第一帧
    const ctx = canvasRef.value.getContext('2d');
    renderFrame(ctx, frames[0]);
    
    // 添加滚动事件监听
    if (mainRef.value) {
      mainRef.value.addEventListener('scroll', handleScroll);
      console.log('滚动事件监听已添加到mainRef');
    } else {
      console.error('mainRef不存在，无法添加滚动事件监听');
    }
    
    // 初始触发一次滚动事件
    handleScroll();
  } catch (error) {
    console.error('Failed to load video frames:', error);
    
    // 3秒后隐藏Loading组件
    setTimeout(() => {
      store.imgLoadStatus = true;
    }, 2000);
    
    // 显示错误信息
    const ctx = canvasRef.value.getContext('2d');
    ctx.fillStyle = '#f5f5f7';
    ctx.fillRect(0, 0, 1600, 1176);
    ctx.fillStyle = '#ff0000';
    ctx.font = '48px Arial';
    ctx.fillText('Failed to load video frames', 400, 588);
    ctx.fillText('Please check the video files in public directory', 200, 650);
  }
});

onUnmounted(() => {
  // 移除滚动事件监听
  if (mainRef.value) {
    mainRef.value.removeEventListener('scroll', handleScroll);
    console.log('滚动事件监听已从mainRef移除');
  }
});
</script>

<style scoped>
.ipad-mini-container {
  background-color: #f5f5f7;
}

h2 {
  font-family: Arial, sans-serif;
  color: #1d1d1f;
  font-size: 48px;
  line-height: 1.0834933333;
  font-weight: 600;
}

strong {
  color: transparent;
  -webkit-text-fill-color: transparent;
  box-decoration-break: clone;
}

main {
  position: relative;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.sticky {
  position: sticky;
  top: 0px;
  height: 100vh;
  overflow: hidden;
}

.content {
  position: absolute;
  width: 100%;
  z-index: -1;
  top: 110vh;
}

section {
  margin-left: auto;
  margin-right: auto;
  width: 980px;
}

section:nth-child(1),
.timeline-1 {
  height: 100vh;
}

section:nth-child(2),
.timeline-2 {
  height: 90vh;
}

section:nth-child(3),
.timeline-3 {
  height: 270vh;
}

section .title-1 {
  width: 470px;
}

section .title-1 strong {
  background: linear-gradient(
    90deg,
    rgb(112, 43, 252) 0%,
    rgb(242, 59, 255) 100%,
    rgb(255, 112, 118) 200%,
    rgb(29, 29, 31) 300%
  );
  background-clip: text;
  -webkit-background-clip: text;
}

section .title-1 span {
  display: inline-block;
  width: 320px;
}

section .title-2 strong {
  background-image: linear-gradient(
    90deg,
    rgb(237, 24, 106) 0%,
    rgb(255, 103, 0) 100%,
    rgb(255, 203, 57) 200%,
    rgb(29, 29, 31) 300%
  );
  background-clip: text;
  -webkit-background-clip: text;
}

section .title-3 strong {
  background-image: linear-gradient(
    90deg,
    rgb(0, 158, 119) 0%,
    rgb(0, 153, 192) 100%,
    rgb(2, 127, 255) 200%,
    rgb(88, 86, 214) 300%,
    rgb(29, 29, 31) 400%
  );
  background-clip: text;
  -webkit-background-clip: text;
}

.media-wrapper {
  display: flex;
  height: 100vh;
  width: 50%;
  left: 50%;
  align-items: flex-end;
  justify-content: center;
}

.media-wrapper canvas {
  display: block;
  position: absolute;
  width: auto;
  height: auto;
  bottom: 0;
  left: 50%;
  transform: translateX(-23%);
  max-height: 100vh;
}

.timeline-wrapper {
  position: relative;
  z-index: 1;
  margin-top: -100vh;
}

.loading {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 3;
  width: 100vw;
  height: 50vh;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 20px;
  text-align: center;
  padding-top: 50vh;
}
</style>