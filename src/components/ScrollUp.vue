<template>
  <div class="scroll-up" @click="goBack">
    <img src="@/assets/icon/other/down.png" alt="up" class="up-icon" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// 返回上一级
const goBack = () => {
  router.back();
};
</script>

<style scoped>
/* 向上滚动引导动画样式 */
.scroll-up {
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: white;
  opacity: 0.8;
  transition: opacity 0.3s ease, transform 0.3s ease;
  z-index: 10;
  pointer-events: auto;
  transform-style: preserve-3d;
}

.scroll-up:hover {
  opacity: 1;
  transform: translateX(-50%) translateY(-5px);
}

/* up图标样式 */
.up-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  transform: rotate(180deg); /* 反转down图标 */
  animation: scrollUpIcon 1.5s ease-in-out infinite;
  transform-style: preserve-3d;
}

@keyframes scrollUpIcon {
  0%, 100% {
    transform: rotate(180deg) translateY(0);
    opacity: 0.8;
  }
  50% {
    transform: rotate(180deg) translateY(-10px);
    opacity: 1;
  }
}
</style>