<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

// 定义组件属性
const props = defineProps({
  currentSong: {
    type: Object,
    default: () => ({
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
  },
  themeConfig: {
    type: Object,
    default: () => ({})
  },
  onClose: {
    type: Function,
    default: () => {}
  },
  isPlaying: {
    type: Boolean,
    default: false
  },
  currentTime: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0
  },
  audioRef: {
    type: Object,
    default: null
  },
  onPlayPause: {
    type: Function,
    default: () => {}
  },
  onSongSelect: {
    type: Function,
    default: () => {}
  },
  onFileUpload: {
    type: Function,
    default: () => {}
  }
})

// 从本地存储读取音量值，默认为0.8
const savedVolume = localStorage.getItem('player_volume')
const initialVolume = savedVolume ? parseFloat(savedVolume) : 0.8

// 本地UI状态
const volume = ref(initialVolume)
const isMuted = ref(false)
const isDraggingProgress = ref(false)
const isDraggingVolume = ref(false)
const dragProgressTime = ref(0)
const dragVolumeValue = ref(initialVolume)
const previousVolume = ref(initialVolume)
const lyricsContainerRef = ref(null)
const lyricsScrollRef = ref(null)
const placeholderRef = ref(null)
const isUserScrolling = ref(false)
const lastScrollTime = ref(Date.now())
let autoScrollTimer = null

// 鼠标拖动滚动相关状态
const isDraggingLyrics = ref(false)
const startY = ref(0)
const startScrollTop = ref(0)

// 计算属性：当前激活的歌词索引
const activeLyricIndex = computed(() => {
  const currentTime = displayTime.value
  const lyrics = props.currentSong.lyrics
  
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (currentTime >= lyrics[i].time) {
      return i
    }
  }
  return 0
})

// Refs
const fileInputRef = ref(null)
const progressContainerRef = ref(null)
const volumeContainerRef = ref(null)

// 计算属性
const displayTime = computed(() => {
  return isDraggingProgress.value ? dragProgressTime.value : props.currentTime
})

const displayVolume = computed(() => {
  return isDraggingVolume.value ? dragVolumeValue.value : volume.value
})

const volumePercent = computed(() => {
  return displayVolume.value * 100
})

const progressPercent = computed(() => {
  return props.duration > 0 ? (displayTime.value / props.duration) * 100 : 0
})

// 设置占位符高度，用于歌词垂直居中
const setupPlaceholder = () => {
  if (lyricsContainerRef.value && placeholderRef.value) {
    // 设置占位符高度为容器高度的一半，使第一行歌词居中显示
    const containerHeight = lyricsContainerRef.value.clientHeight
    placeholderRef.value.style.height = `${containerHeight / 2}px`
  }
}

// 自动滚动到当前歌词
const autoScrollToActiveLyric = () => {
  if (!lyricsScrollRef.value || isUserScrolling.value) return
  
  const lyricElements = lyricsScrollRef.value.querySelectorAll('.lyric-line')
  const activeElement = lyricElements[activeLyricIndex.value]
  
  if (activeElement) {
    const containerHeight = lyricsScrollRef.value.clientHeight
    const elementRect = activeElement.getBoundingClientRect()
    const containerRect = lyricsScrollRef.value.getBoundingClientRect()
    
    // 计算滚动位置，使当前歌词居中
    const scrollPosition = activeElement.offsetTop - containerHeight / 2 + activeElement.clientHeight / 2
    
    lyricsScrollRef.value.scrollTo({
      top: scrollPosition,
      behavior: 'smooth'
    })
  }
}

// 处理手动滚动
const handleScroll = () => {
  if (!lyricsScrollRef.value) return
  
  // 更新滚动状态
  isUserScrolling.value = true
  lastScrollTime.value = Date.now()
  
  // 清除之前的定时器
  if (autoScrollTimer) {
    clearTimeout(autoScrollTimer)
  }
  
  // 设置新的定时器，2秒后自动恢复滚动
  autoScrollTimer = setTimeout(() => {
    const now = Date.now()
    if (now - lastScrollTime.value >= 2000) {
      isUserScrolling.value = false
      autoScrollToActiveLyric()
    }
  }, 2000)
}

// 监听当前歌词变化，自动滚动
watch(activeLyricIndex, (newIndex) => {
  autoScrollToActiveLyric()
})

// 监听播放状态变化
watch(() => props.isPlaying, (isPlaying) => {
  if (isPlaying) {
    autoScrollToActiveLyric()
  }
})

// 监听播放时间变化
watch(displayTime, () => {
  // 只有在非用户滚动状态下才自动滚动
  if (!isUserScrolling.value) {
    autoScrollToActiveLyric()
  }
})

// 格式化时间
const formatTime = (time) => {
  if (isNaN(time)) return "0:00"
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

// 播放/暂停切换
const togglePlay = () => {
  props.onPlayPause()
}

// 进度条拖动处理
const handleProgressPointerDown = (e) => {
  isDraggingProgress.value = true
  updateProgressFromPointer(e)
  window.addEventListener('pointermove', handleProgressPointerMove)
  window.addEventListener('pointerup', handleProgressPointerUp)
  window.addEventListener('pointercancel', handleProgressPointerUp)
}

const handleProgressPointerMove = (e) => {
  if (isDraggingProgress.value) {
    updateProgressFromPointer(e)
  }
}

const handleProgressPointerUp = () => {
  if (isDraggingProgress.value) {
    isDraggingProgress.value = false
    window.removeEventListener('pointermove', handleProgressPointerMove)
    window.removeEventListener('pointerup', handleProgressPointerUp)
    window.removeEventListener('pointercancel', handleProgressPointerUp)
    // 提交更改到音频元素
    if (props.audioRef) {
      props.audioRef.currentTime = dragProgressTime.value
    }
  }
}

const updateProgressFromPointer = (e) => {
  if (!progressContainerRef.value) return
  const rect = progressContainerRef.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
  const percentage = x / rect.width
  const newTime = percentage * (props.duration || 1)
  dragProgressTime.value = newTime
}

// 音量条拖动处理
const handleVolumePointerDown = (e) => {
  isDraggingVolume.value = true
  updateVolumeFromPointer(e)
  window.addEventListener('pointermove', handleVolumePointerMove)
  window.addEventListener('pointerup', handleVolumePointerUp)
  window.addEventListener('pointercancel', handleVolumePointerUp)
}

const handleVolumePointerMove = (e) => {
  if (isDraggingVolume.value) {
    updateVolumeFromPointer(e)
  }
}

// 保存音量到本地存储
const saveVolumeToLocal = (value) => {
  localStorage.setItem('player_volume', value.toString())
}

const handleVolumePointerUp = () => {
  if (isDraggingVolume.value) {
    isDraggingVolume.value = false
    volume.value = dragVolumeValue.value
    saveVolumeToLocal(dragVolumeValue.value)
    window.removeEventListener('pointermove', handleVolumePointerMove)
    window.removeEventListener('pointerup', handleVolumePointerUp)
    window.removeEventListener('pointercancel', handleVolumePointerUp)
  }
}

const updateVolumeFromPointer = (e) => {
  if (!volumeContainerRef.value) return
  const rect = volumeContainerRef.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
  const newVol = x / rect.width
  dragVolumeValue.value = newVol
  if (props.audioRef) {
    props.audioRef.volume = newVol
  }
  // 实时保存音量到本地存储
  saveVolumeToLocal(newVol)
}

// 文件上传处理
const handleFileChange = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    const url = URL.createObjectURL(file)
    const name = file.name.replace(/\.[^/.]+$/, "")
    props.onFileUpload(url, name)
  }
}

// 打开文件选择
const openFileInput = () => {
  fileInputRef.value?.click()
}

// 切换静音状态
const toggleMute = () => {
  if (props.audioRef) {
    if (isMuted.value) {
      // 恢复之前的音量
      volume.value = previousVolume.value
      dragVolumeValue.value = previousVolume.value
      props.audioRef.volume = previousVolume.value
      isMuted.value = false
      // 保存恢复后的音量到本地存储
      saveVolumeToLocal(previousVolume.value)
    } else {
      // 保存当前音量并静音
      previousVolume.value = volume.value
      volume.value = 0
      dragVolumeValue.value = 0
      props.audioRef.volume = 0
      isMuted.value = true
      // 保存当前音量到本地存储（静音时仍保存原音量）
      saveVolumeToLocal(previousVolume.value)
    }
  }
}

// 鼠标拖动滚动事件处理
const handlePointerDown = (e) => {
  if (!lyricsScrollRef.value) return
  
  isDraggingLyrics.value = true
  startY.value = e.clientY
  startScrollTop.value = lyricsScrollRef.value.scrollTop
  
  // 添加鼠标移动和释放事件监听器
  document.addEventListener('pointermove', handlePointerMove)
  document.addEventListener('pointerup', handlePointerUp)
  document.addEventListener('pointercancel', handlePointerUp)
  
  // 更新滚动状态
  isUserScrolling.value = true
  lastScrollTime.value = Date.now()
  
  if (autoScrollTimer) {
    clearTimeout(autoScrollTimer)
  }
}

const handlePointerMove = (e) => {
  if (!isDraggingLyrics.value || !lyricsScrollRef.value) return
  
  const deltaY = e.clientY - startY.value
  lyricsScrollRef.value.scrollTop = startScrollTop.value - deltaY
  
  // 更新滚动时间
  lastScrollTime.value = Date.now()
}

const handlePointerUp = () => {
  isDraggingLyrics.value = false
  
  // 移除鼠标移动和释放事件监听器
  document.removeEventListener('pointermove', handlePointerMove)
  document.removeEventListener('pointerup', handlePointerUp)
  document.removeEventListener('pointercancel', handlePointerUp)
  
  // 设置自动滚动定时器
  autoScrollTimer = setTimeout(() => {
    const now = Date.now()
    if (now - lastScrollTime.value >= 2000) {
      isUserScrolling.value = false
      autoScrollToActiveLyric()
    }
  }, 2000)
}

// 组件挂载时初始化
onMounted(() => {
  setupPlaceholder()
  
  // 监听窗口大小变化，重新设置占位符高度
  window.addEventListener('resize', setupPlaceholder)
})

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('resize', setupPlaceholder)
  if (autoScrollTimer) {
    clearTimeout(autoScrollTimer)
  }
  
  // 确保移除所有事件监听器
  document.removeEventListener('pointermove', handlePointerMove)
  document.removeEventListener('pointerup', handlePointerUp)
  document.removeEventListener('pointercancel', handlePointerUp)
})


</script>

<template>
  <div class="music-player">
    <!-- Hidden File Input -->
    <input 
      type="file" 
      ref="fileInputRef" 
      @change="handleFileChange" 
      accept="audio/*" 
      class="file-input" 
    />

    <!-- Top iOS Handle (Close Trigger) -->
    <button 
      class="close-button"
      @click.stop="props.onClose"
    >
      <div class="close-handle-container">
        <div class="close-handle" />
      </div>
    </button>

    <!-- Main Content Area -->
    <div class="main-content">
      
      <!-- Left Column: Vinyl Record -->
      <div class="vinyl-column">
        <!-- The Vinyl -->
        <div class="vinyl-container">
          <!-- Outer glow -->
          <div class="vinyl-glow" />
          
          <!-- Tonearm (唱针) -->
          <div class="tonearm"
               :class="{ 'tonearm-playing': props.isPlaying, 'tonearm-paused': !props.isPlaying }">
            <img 
              src="/src/assets/icon/play/changzhen.svg" 
              alt="唱针" 
              class="tonearm-image"
            />
          </div>
          
          <!-- Spinning Disc Wrapper -->
          <div 
            class="vinyl-disc"
            :class="{ 'vinyl-spinning': props.isPlaying }"
          >
            <!-- Texture Rings -->
            <div class="vinyl-texture-ring-1" />
            <div class="vinyl-texture-ring-2" />
            
            <!-- Record Label - Dynamic Image -->
            <div class="vinyl-label">
              <img src="@/assets/icon/jigsaw/咆哮怪.png" alt="Label" class="label-image" />
              <div class="label-center">
                <div class="label-center-dot" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Content (Lyrics or Playlist) -->
      <div class="lyrics-column">
        
        <!-- Song Title Display -->
        <div class="song-title-section">
          <h2 class="song-title">{{ currentSong.title }}</h2>
          <p class="song-artist">{{ currentSong.artist }} - {{ currentSong.album }}</p>
        </div>

        <!-- Lyrics Display -->
        <div 
          class="lyrics-container" 
          ref="lyricsContainerRef"
        >
          <!-- Lyric Content Wrapper -->
          <div 
            class="lyrics-scroll"
            ref="lyricsScrollRef"
            @scroll="handleScroll"
            @pointerdown="handlePointerDown"
          >
            <!-- Lyric Content -->
            <div class="lyrics-content">
              <!-- Placeholder for vertical centering -->
              <div class="lyrics-placeholder" ref="placeholderRef"></div>
              
              <!-- Lyrics List -->
              <div 
                v-for="(lyric, idx) in currentSong.lyrics" 
                :key="idx"
                class="lyric-line"
                :class="{ active: idx === activeLyricIndex }"
                :style="{ 
                  opacity: Math.abs(idx - activeLyricIndex) <= 2 ? (1 - Math.abs(idx - activeLyricIndex) * 0.2) : 0.6,
                  transform: idx === activeLyricIndex ? 'scale(1.1)' : 'scale(1)',
                  color: idx === activeLyricIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                  lineHeight: '1.8' 
                }"
              >
                <p>{{ lyric.text || "..." }}</p>
              </div>
              
              <!-- Placeholder for vertical centering -->
              <div class="lyrics-placeholder" ref="placeholderRef"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Control Bar Container -->
    <div class="control-bar">
      
      <!-- Interactive Progress Bar -->
        <div class="progress-section">
          <span class="time-display current-time">
            {{ formatTime(displayTime) }}
          </span>
          
          <div class="progress-container">
            <!-- Progress Bar Container -->
            <div 
              ref="progressContainerRef"
              @pointerdown="handleProgressPointerDown"
              class="progress-track-wrapper"
            >
              <div class="progress-track">
                <!-- Background progress -->
                <div class="progress-background"></div>
                <!-- Progress -->
                <div 
                  class="progress-fill"
                  :style="{ width: `${progressPercent}%` }"
                ></div>
                <!-- Drag Handle (Visible on hover/drag) -->
                <div 
                  class="progress-handle"
                  :style="{
                    left: `${progressPercent}%`
                  }"
                ></div>
              </div>
            </div>
          </div>

          <span class="time-display total-time">
            {{ formatTime(duration) }}
          </span>
        </div>

      <!-- Controls Row -->
      <div class="controls-row">
        
        <!-- Left: Song Info -->
        <div class="song-info-section">
          <div class="song-info">
            <span class="info-title">{{ currentSong.title }}</span>
            <span class="info-artist">{{ currentSong.artist }}</span>
          </div>
        </div>

        <!-- Center: Playback Controls -->
        <div class="playback-controls">
          <div class="playback-buttons">
            <!-- Shuffle Button -->
            <button class="control-button shuffle-button">
              <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="16 3 21 3 21 8"></polyline>
                <line x1="4" y1="20" x2="21" y2="3"></line>
                <polyline points="21 16 21 21 16 21"></polyline>
                <line x1="15" y1="15" x2="21" y2="21"></line>
                <line x1="4" y1="4" x2="9" y2="9"></line>
              </svg>
            </button>
            <!-- Previous Button -->
            <button class="control-button previous-button">
              <img src="/src/assets/icon/play/上一集.svg" alt="Previous" class="button-image" />
            </button>
            <!-- Play/Pause Button -->
            <button 
              @click="props.onPlayPause"
              class="control-button play-button"
            >
              <!-- Pause Icon -->
              <img v-if="props.isPlaying" src="/src/assets/icon/play/暂停.svg" alt="Pause" class="button-image" />
              <!-- Play Icon -->
              <img v-else src="/src/assets/icon/play/播放.svg" alt="Play" class="button-image" />
            </button>
            <!-- Next Button -->
            <button class="control-button next-button">
              <img src="/src/assets/icon/play/下一集.svg" alt="Next" class="button-image" />
            </button>
            <!-- File Upload Button -->
            <button 
              class="control-button upload-button"
              @click="openFileInput"
              title="Upload Local File"
            >
              <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Right: Tools & Volume -->
        <div class="volume-section">
          <!-- Volume Control -->
          <div class="volume-control">
            <button 
              @click="toggleMute" 
              class="mute-button"
            >
              <img 
                v-if="isMuted || volumePercent === 0" 
                src="/src/assets/icon/play/静音.svg" 
                alt="Mute" 
                class="mute-icon"
              />
              <img 
                v-else 
                src="/src/assets/icon/play/音量.svg" 
                alt="Volume" 
                class="volume-icon"
              />
            </button>
            
            <div class="volume-track-wrapper">
              <div 
                ref="volumeContainerRef"
                @pointerdown="handleVolumePointerDown"
                class="volume-track-container"
              >
                <div class="volume-track">
                  <!-- Background volume -->
                  <div class="volume-background"></div>
                  <!-- Volume -->
                  <div 
                    class="volume-fill"
                    :style="{ width: `${volumePercent}%` }"
                  ></div>
                  <!-- Volume Handle -->
                  <div 
                    class="volume-handle"
                    :style="{
                      left: `${volumePercent}%`
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Music Player Container */
.music-player {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #1c1c1c;
  color: #e0e0e0;
  user-select: none;
  overflow: hidden;
  border-radius: 56px;
}

/* Hidden File Input */
.file-input {
  display: none;
}

/* Close Button */
.close-button {
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
  touch-action: manipulation;
}

.close-handle-container {
  width: 64px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-handle {
  width: 48px;
  height: 6px;
  background-color: #444;
  border-radius: 9999px;
  transition: background-color 0.3s ease;
}

.close-button:hover .close-handle {
  background-color: #666;
}

/* Main Content Area */
.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
  align-items: center;
  padding-top: 24px;
  position: relative;
}

/* Vinyl Column */
.vinyl-column {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100%;
}

/* Vinyl Container */
.vinyl-container {
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(24px);
}

/* Vinyl Glow */
.vinyl-glow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  filter: blur(96px);
  transform: scale(0.95);
}

/* Tonearm */
.tonearm {
  position: absolute;
  top: -40%;
  left: 50%;
  transform: translateX(-50%);
  width: 160px;
  height: 256px;
  transform-origin: top;
  transition: transform 0.8s ease-in-out;
  z-index: 10;
}

.tonearm-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: brightness(0.9);
}

.tonearm-playing {
  transform: translateX(-50%) rotate(0deg);
}

.tonearm-paused {
  transform: translateX(-50%) rotate(-35deg);
}

/* Vinyl Disc */
.vinyl-disc {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0a0a0a;
  box-shadow: 0 0 0 2px #333, 0 0 0 8px #111, 0 0 0 10px #000;
  border: 1px solid #111;
}

.vinyl-spinning {
  animation: spin 6s linear infinite;
}

/* Vinyl Texture Rings */
.vinyl-texture-ring-1 {
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  border: 1px solid #222;
  background: conic-gradient(from 0deg, transparent 0deg, #222 30deg, transparent 60deg, #222 90deg, transparent 120deg, #222 150deg, transparent 180deg, #222 210deg, transparent 240deg, #222 270deg, transparent 300deg, #222 330deg, transparent 360deg);
  opacity: 0.2;
}

.vinyl-texture-ring-2 {
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  border: 1px solid #1a1a1a;
  background: repeating-radial-gradient(#050505 0, #050505 2px, #151515 3px, #050505 4px);
  opacity: 0.8;
}

/* Vinyl Label */
.vinyl-label {
  position: absolute;
  width: 40%;
  height: 40%;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
  border: 2px solid #222;
}

.label-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.9;
}

.label-center {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.label-center-dot {
  width: 12px;
  height: 12px;
  background-color: #1c1c1c;
  border-radius: 50%;
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Lyrics Column */
.lyrics-column {
  width: 50%;
  display: flex;
  flex-direction: column;
  height: 380px;
  padding-right: 48px;
  padding-left: 16px;
  position: relative;
}

/* Song Title Section */
.song-title-section {
  text-align: center;
  margin-bottom: 32px;
}

.song-title {
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin-bottom: 8px;
}

.song-artist {
  font-size: 14px;
  color: #9ca3af;
}

/* Lyrics Container */
.lyrics-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(28, 28, 28, 0) 0%, rgba(28, 28, 28, 0.8) 50%, rgba(28, 28, 28, 0) 100%);
  isolation: isolate;
}

/* Lyrics Scroll */
.lyrics-scroll {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 48px 16px;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.lyrics-scroll::-webkit-scrollbar {
  display: none;
}

/* Lyrics Content */
.lyrics-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

/* Lyrics Placeholder - height set dynamically via JavaScript */

/* Lyric Line */
.lyric-line {
  font-size: 18px;
  line-height: 1.8;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease-out;
}

.lyric-line.active {
  position: relative;
  font-weight: bold;
}

.lyric-line.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ffffff, transparent);
  border-radius: 1px;
}

/* Controls Bar */
.control-bar {
  display: flex;
  flex-direction: column;
  background-color: #252525;
  padding: 8px 40px 24px 40px;
  z-index: 20;
  flex-shrink: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
}

/* Progress Section */
.progress-section {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  user-select: none;
}

/* Time Display */
.time-display {
  font-size: 10px;
  color: #888;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  width: 32px;
  text-align: right;
  transition: color 0.3s ease;
}

.progress-section:hover .time-display {
  color: white;
}

/* Progress Container */
.progress-container {
  flex: 1;
  position: relative;
}

.progress-track-wrapper {
  height: 32px;
  display: flex;
  align-items: center;
  cursor: pointer;
  touch-action: none;
}

.progress-track {
  width: 100%;
  height: 4px;
  background-color: #444;
  border-radius: 9999px;
  position: relative;
  transition: height 0.3s ease;
}

.progress-track:hover {
  height: 6px;
}

.progress-background {
  position: absolute;
  inset: 0;
  background-color: #444;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #b3b3b3;
  border-radius: 9999px;
  transition: all 0.1s ease-out;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.progress-track-wrapper:hover .progress-fill {
  background-color: #ef4444;
}

.progress-handle {
  position: absolute;
  top: 50%;
  width: 14px;
  height: 14px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  transition: all 0.2s ease-out;
  transform: translate(-50%, -50%);
  z-index: 10;
}

/* Controls Row */
.controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Song Info Section */
.song-info-section {
  width: 25%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
}

.song-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.info-title {
  font-size: 16px;
  color: white;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.info-title:hover {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
  text-decoration-color: rgba(255, 255, 255, 0.3);
}

.info-artist {
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: color 0.3s ease;
}

.info-artist:hover {
  color: #bbb;
}

/* Playback Controls */
.playback-controls {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.playback-buttons {
  display: flex;
  align-items: center;
  gap: 32px;
}

/* Control Button */
.control-button {
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-icon {
  width: 16px;
  height: 16px;
  color: inherit;
}

.button-image {
  width: 24px;
  height: 24px;
}

.shuffle-button {
  color: #bbb;
}

.shuffle-button:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

.previous-button,
.next-button {
  color: #ddd;
}

.previous-button:hover,
.next-button:hover {
  color: white;
  transform: scale(1.05);
  background-color: rgba(255, 255, 255, 0.1);
}

.play-button {
  width: 48px;
  height: 48px;
  background-color: #333;
  transition: all 0.2s ease;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.15);
}

.play-button:hover {
  background-color: #444;
  transform: scale(1.05);
}

.play-button:active {
  transform: scale(0.95);
}

.upload-button {
  color: #bbb;
}

.upload-button:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

/* Volume Section */
.volume-section {
  width: 25%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
}

/* Volume Control */
.volume-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mute-button {
  width: 16px;
  height: 16px;
  color: #aaa;
  cursor: pointer;
  transition: color 0.3s ease;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mute-icon,
.volume-icon {
  width: 16px;
  height: 16px;
}

.volume-track-wrapper {
  position: relative;
}

.volume-track-container {
  width: 80px;
  height: 32px;
  display: flex;
  align-items: center;
  cursor: pointer;
  touch-action: none;
}

.volume-track {
  width: 100%;
  height: 4px;
  background-color: #444;
  border-radius: 9999px;
  position: relative;
}

.volume-background {
  position: absolute;
  inset: 0;
  background-color: #444;
  border-radius: 9999px;
  overflow: hidden;
}

.volume-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #888;
  border-radius: 9999px;
  transition: all 0.1s ease-out;
}

.volume-track-container:hover .volume-fill {
  background-color: #e0e0e0;
}

.volume-handle {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  transition: all 0.2s ease-out;
  transform: translate(-50%, -50%);
  z-index: 10;
}

/* Animations */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Vinyl Spinning Animation */
.vinyl-spinning {
  animation: spin 6s linear infinite;
}

/* Responsive Design */
@media (min-width: 768px) {
  .vinyl-container {
    width: 340px;
    height: 340px;
  }
  
  .tonearm {
    width: 224px;
    height: 320px;
  }
  
  .lyric-line {
    font-size: 20px;
  }
}

@media (max-width: 768px) {
  .lyric-line {
    font-size: 16px;
    line-height: 1.6;
  }
  
  .song-title {
    font-size: 1.25rem;
  }
  
  .song-artist {
    font-size: 0.875rem;
  }
}
</style>