<template>
  <div class="waveform-container">
    <div
      v-for="i in 8"
      :key="i"
      class="waveform-bar"
      :style="{
        animation: `wave 0.8s ease-in-out infinite reverse`,
        animationDelay: `${i * 0.1}s`
      }"
    />
  </div>
</template>

<style scoped>
/* Waveform Container */
.waveform-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  height: 100%;
  width: 100%;
}

/* Waveform Bar */
.waveform-bar {
  width: 4px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 9999px;
}

/* Wave Animation */
@keyframes wave {
  0% {
    height: 8px;
  }
  25% {
    height: 16px;
  }
  50% {
    height: 8px;
  }
  75% {
    height: 24px;
  }
  100% {
    height: 10px;
  }
}
</style>
