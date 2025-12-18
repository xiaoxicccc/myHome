<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import MusicPlayer from './MusicPlayer.vue'

// 定义组件属性
const props = defineProps({
  song: {
    type: Object,
    required: true
  },
  themeConfig: {
    type: Object,
    required: true
  }
})

// 定义组件事件
const emit = defineEmits(['update:song', 'update:isPlaying', 'update:currentTime', 'update:duration'])

// 组件状态
const isHovered = ref(false)
const isExpanded = ref(false)

// 从本地存储读取音量值，默认为0.8
const savedVolume = localStorage.getItem('player_volume')
const initialVolume = savedVolume ? parseFloat(savedVolume) : 0.8

// 音频相关状态
const currentSong = ref({
  id: '1',
  title: '爱错',
  artist: '王力宏',
  album: '爱错',
  coverUrl: '/src/assets/icon/jigsaw/咆哮怪.png',
  audioUrl: '/aicuo.mp3',
  duration: '03:43',
  lyrics: [
    { time: 0, text: '北风毫不留情 把叶子吹落' },
    { time: 15, text: '脆弱的它选择了逃脱' },
    { time: 22, text: '叶子失去消息 风才感觉寂寞' },
    { time: 30, text: '整个冬天 北风的痛没人能说' },
    { time: 45, text: '我从来没想过 我会这样做' },
    { time: 52, text: '从来没爱过 所以爱错' },
    { time: 59, text: '我从哪里起飞 从哪里降落' },
    { time: 67, text: '多少不能原谅的错 却不能重来过' },
    { time: 82, text: '翻开回忆角落 完美的生活' },
    { time: 89, text: '以为幸福都可以掌握' },
    { time: 97, text: '仔细回味当初 那个故事背后' },
    { time: 104, text: 'Oh 原来是我 爱错' },
    { time: 118, text: '我从来没想过 我会这样做' },
    { time: 126, text: '从来没爱过 所以爱错' },
    { time: 133, text: '我从哪里起飞 从哪里降落' },
    { time: 141, text: '多少不能原谅的错 却不能重来过' },
    { time: 156, text: '在这少了你的世界' },
    { time: 163, text: '找不回那些感觉' },
    { time: 170, text: '其实我不想道别' },
    { time: 177, text: '那些过去' },
    { time: 192, text: '我从来没想过 我会这样做' },
    { time: 199, text: '从来没爱过 所以爱错' },
    { time: 206, text: '我从哪里起飞 从哪里降落' },
    { time: 214, text: '多少不能原谅的错 却不能重来过' },
    { time: 228, text: '我从来没想过 我会这样做' },
    { time: 235, text: '从来没爱过 所以爱错' },
    { time: 242, text: '我从哪里起飞 从哪里降落' },
    { time: 250, text: '多少不能原谅的错 却不能重来过' },
    { time: 265, text: 'Oh 原来 是我 爱错' }
  ]
})
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const audioRef = ref(null)
const audioSrc = ref('/aicuo.mp3')

// 计算属性
const progressPercent = computed(() => {
  return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
})

// 监听歌曲变化
watch(() => props.song, (newSong) => {
  currentSong.value = newSong
  if (newSong?.audioUrl) {
    audioSrc.value = newSong.audioUrl
  }
})

// 监听播放状态变化
watch(isPlaying, (newIsPlaying) => {
  if (audioRef.value) {
    if (newIsPlaying) {
      audioRef.value.play().catch(e => {
        console.log('Playback failed:', e)
        isPlaying.value = false
      })
    } else {
      audioRef.value.pause()
    }
  }
  emit('update:isPlaying', newIsPlaying)
})

// 监听音频源变化
watch(audioSrc, (newSrc) => {
  if (audioRef.value && newSrc) {
    audioRef.value.src = newSrc
    if (isPlaying.value) {
      audioRef.value.play().catch(e => {
        console.log('Playback failed:', e)
        isPlaying.value = false
      })
    }
  }
})

// 音频事件处理
onMounted(() => {
  if (!audioRef.value) return

  const audio = audioRef.value
  
  // 应用从本地存储读取的音量值
  audio.volume = initialVolume

  const updateTime = () => {
    currentTime.value = audio.currentTime
    emit('update:currentTime', currentTime.value)
  }

  const updateDuration = () => {
    duration.value = audio.duration
    emit('update:duration', duration.value)
  }

  const handleEnded = () => {
    isPlaying.value = false
    emit('update:isPlaying', false)
  }

  audio.addEventListener('timeupdate', updateTime)
  audio.addEventListener('loadedmetadata', updateDuration)
  audio.addEventListener('ended', handleEnded)

  // 清理事件监听器
  onUnmounted(() => {
    audio.removeEventListener('timeupdate', updateTime)
    audio.removeEventListener('loadedmetadata', updateDuration)
    audio.removeEventListener('ended', handleEnded)
  })
})

// 事件处理函数
const handleIslandClick = (e) => {
  // 检查点击目标是否是按钮或按钮内的元素
  if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return
  if (e.target.tagName === 'IMG' || e.target.closest('img')) return
  if (!isExpanded.value) {
    isExpanded.value = true
    isHovered.value = false
  }
}

const togglePlay = (e) => {
  e.stopPropagation()
  isPlaying.value = !isPlaying.value
}

const handleSongSelect = (newSong) => {
  currentSong.value = newSong
  emit('update:song', newSong)
  // 在实际应用中，这里会设置音频源
  isPlaying.value = true
  emit('update:isPlaying', true)
}

const onFileUpload = (url, name) => {
  audioSrc.value = url
  currentSong.value = { ...currentSong.value, title: name }
  emit('update:song', currentSong.value)
  isPlaying.value = true
  emit('update:isPlaying', true)
}
</script>

<template>
  <div class="dynamic-island-container">
    <!-- Hidden Global Audio Element -->
    <audio ref="audioRef" :src="audioSrc" />

    <!-- Background Overlay when Expanded -->
    <transition name="fade">
      <div 
        v-if="isExpanded" 
        class="background-overlay"
        @click="isExpanded = false"
      ></div>
    </transition>

    <!-- Dynamic Island Main Element -->
    <div 
      class="dynamic-island"
      :class="{
        'is-expanded': isExpanded,
        'is-collapsed': !isExpanded
      }"
      :style="{
        top: isExpanded ? '50%' : '1rem',
        left: '50%',
        transform: `translate(-50%, ${isExpanded ? '-50%' : '0%'})`,
        width: isExpanded ? 'min(94vw, 1024px)' : (isHovered ? '360px' : '180px'),
        height: isExpanded ? 'min(85vh, 640px)' : (isHovered ? '110px' : '36px'),
        borderRadius: isExpanded ? '56px' : (isHovered ? '32px' : '24px')
      }"
      @mouseenter="!isExpanded && (isHovered = true)"
      @mouseleave="!isExpanded && (isHovered = false)"
      @click="handleIslandClick"
    >
      <div class="island-content">
        <!-- Idle State -->
        <transition name="fade">
          <div 
            v-if="!isHovered && !isExpanded"
            class="idle-state"
          >
            <div class="idle-left">
              <div class="gradient-icon">
                <svg class="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 18V5l12-2v13"></path>
                  <circle cx="6" cy="18" r="3"></circle>
                  <circle cx="18" cy="16" r="3"></circle>
                </svg>
              </div>
            </div>
            <!-- Waveform Animation -->
            <div v-if="isPlaying" class="waveform-active">
              <div class="wave-bar wave-bar-1"></div>
              <div class="wave-bar wave-bar-2"></div>
              <div class="wave-bar wave-bar-3"></div>
              <div class="wave-bar wave-bar-4"></div>
            </div>
            <div v-else class="waveform-inactive">
              <div class="wave-dot"></div>
              <div class="wave-dot"></div>
              <div class="wave-dot"></div>
              <div class="wave-dot"></div>
            </div>
          </div>
        </transition>

        <!-- Hover State (Mini Player) -->
        <transition name="fade" duration="250">
          <div 
            v-if="isHovered && !isExpanded"
            class="hover-state"
          >
            <div class="hover-top">
              <img 
                :src="currentSong.coverUrl" 
                alt="cover" 
                class="cover-image" 
              />
              <div class="song-info">
                <h3 class="song-title">{{ currentSong.title }}</h3>
                <p class="song-artist">{{ currentSong.artist }}</p>
              </div>
              <div class="player-controls">
                <button class="control-button prev-button" @click.stop>
                  <img src="/src/assets/icon/play/上一集.svg" alt="Previous" />
                </button>
                <button @click="togglePlay" class="control-button play-button">
                  <img v-if="!isPlaying" src="/src/assets/icon/play/播放.svg" alt="Play" />
                  <img v-else src="/src/assets/icon/play/暂停.svg" alt="Pause" />
                </button>
                <button class="control-button next-button" @click.stop>
                  <img src="/src/assets/icon/play/下一集.svg" alt="Next" />
                </button>
              </div>
            </div>
            <div class="progress-section">
              <span class="time-display current-time">
                {{ Math.floor(currentTime / 60) }}:{{ Math.floor(currentTime % 60).toString().padStart(2, '0') }}
              </span>
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: `${progressPercent}%` }"
                ></div>
              </div>
              <span class="time-display duration">
                {{ duration ? `${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')}` : '-:-' }}
              </span>
            </div>
          </div>
        </transition>

        <!-- Expanded State (Full Music Player) -->
        <transition name="fade" duration="300">
          <MusicPlayer 
            v-if="isExpanded"
            :theme-config="themeConfig"
            :on-close="() => isExpanded = false"
            :current-song="currentSong"
            :is-playing="isPlaying"
            :current-time="currentTime"
            :duration="duration"
            :audio-ref="audioRef"
            :on-play-pause="togglePlay"
            :on-song-select="handleSongSelect"
            :on-file-upload="onFileUpload"
          />
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dynamic-island-container {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Background Overlay */
.background-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  z-index: 80;
}

/* Dynamic Island */
.dynamic-island {
  position: fixed;
  z-index: 90;
  overflow: hidden;
  box-shadow: 0 30px 80px -15px rgba(0, 0, 0, 0.6);
  cursor: default;
  user-select: none;
  transition: all 0.3s ease-out;
}

.dynamic-island.is-expanded {
  background-color: #1c1c1c;
}

.dynamic-island.is-collapsed {
  background-color: black;
}

/* Island Content */
.island-content {
  position: relative;
  width: 100%;
  height: 100%;
  color: white;
}

/* Idle State */
.idle-state {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.idle-left {
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.8;
}

.gradient-icon {
  width: 20px;
  height: 20px;
  background: linear-gradient(to top right, #facc15, #ef4444);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-small {
  width: 10px;
  height: 10px;
  color: white;
}

/* Waveform */
.waveform-active,
.waveform-inactive {
  display: flex;
  gap: 3px;
  align-items: flex-end;
  height: 12px;
}

.waveform-inactive {
  opacity: 0.7;
}

.wave-bar {
  width: 4px;
  background-color: #22c55e;
  border-radius: 9999px;
  transition: height 0.3s ease;
}

.wave-dot {
  width: 4px;
  height: 4px;
  background-color: white;
  border-radius: 50%;
}

/* Hover State */
.hover-state {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 16px;
  justify-content: space-between;
  z-index: 20;
}

.hover-top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cover-image {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.song-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.song-title {
  color: white;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.2;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.song-artist {
  color: #9ca3af;
  font-size: 12px;
  line-height: 1.2;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.player-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-right: 4px;
  pointer-events: auto;
}

.control-button {
  width: 40px;
  height: 40px;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.05);
}

.prev-button,
.next-button {
  color: rgba(255, 255, 255, 0.8);
}

.prev-button:hover,
.next-button:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.15);
}

.prev-button img,
.next-button img {
  width: 20px;
  height: 20px;
}

.play-button {
  color: white;
  width: 44px;
  height: 44px;
  background-color: rgba(255, 255, 255, 0.1);
}

.play-button:hover {
  transform: scale(1.1);
  background-color: rgba(255, 255, 255, 0.15);
}

.play-button:active {
  transform: scale(0.95);
}

.play-button img {
  width: 24px;
  height: 24px;
}

/* Progress Section */
.progress-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.time-display {
  font-size: 10px;
  color: #6b7280;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background-color: #1f2937;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: white;
  border-radius: 9999px;
  transition: width 0.1s linear;
}

/* Animations */
@keyframes wave {
  0%, 100% {
    height: 4px;
  }
  25% {
    height: 12px;
  }
  50% {
    height: 6px;
  }
  75% {
    height: 10px;
  }
}

/* Wave Bars */
.wave-bar-1 {
  animation: wave 1.2s infinite ease-in-out;
}

.wave-bar-2 {
  animation: wave 1.5s infinite ease-in-out 0.1s;
}

.wave-bar-3 {
  animation: wave 1.1s infinite ease-in-out 0.2s;
}

.wave-bar-4 {
  animation: wave 1.3s infinite ease-in-out 0.3s;
}

/* Transition Effects */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>