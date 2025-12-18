<template>
  <div class="profile-island-container">
    <!-- Fixed Background -->
    <!-- <div class="fixed-background"></div> -->
    
    <!-- Fixed Mesh Gradient Blobs -->
    <!-- <div class="gradient-blob blob-1"></div> -->
    <!-- <div class="gradient-blob blob-2"></div> -->

    <!-- Top Right Controls Group -->
    <div class="top-controls">
        <!-- Exit Button -->
        <button
          @click="handleReload"
          class="reload-button"
          title="Reload"
        >
          <svg class="reload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
    </div>

    <!-- Main Layout -->
    <main class="main-layout">
        <!-- Dynamic Island Header -->
        <DynamicIsland :song="currentSong" />

        <!-- Content Area -->
        <InfoGrid />

        <!-- Bottom Navigation -->
        <Dock />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import DynamicIsland from '@/components/newIndex/DynamicIsland.vue';
import InfoGrid from '@/components/newIndex/InfoGrid.vue';
import Dock from '@/components/newIndex/Dock.vue';

const router = useRouter();

// Current song data
const currentSong = ref({
  id: '1',
  title: 'Lofi Dreams',
  artist: 'Chillhop Music',
  coverUrl: 'https://picsum.photos/500/500',
  audioUrl: 'https://p.scdn.co/mp3-preview/8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a',
  duration: 180
});

// Handle reload
const handleReload = () => {
  window.location.reload();
};
</script>

<style scoped>
/* Main container */
.profile-island-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  color: #1e293b;
}

/* Fixed background */
.fixed-background {
  position: absolute;
  inset: 0;
  z-index: -20;
  background: linear-gradient(to bottom right, #312e81, #5b21b6, #ec4899);
}

/* Gradient blobs */
.gradient-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  z-index: -10;
  mix-blend-mode: multiply;
}

.blob-1 {
  top: -20%;
  left: -10%;
  width: 50vw;
  height: 50vw;
  background-color: rgba(139, 92, 246, 0.3);
  animation: blob1 20s infinite linear;
}

.blob-2 {
  bottom: -20%;
  right: -10%;
  width: 60vw;
  height: 60vw;
  background-color: rgba(236, 72, 153, 0.3);
  animation: blob2 15s infinite linear;
}

/* Top controls */
.top-controls {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Reload button */
.reload-button {
  padding: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  color: #1e293b;
}

.reload-button:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.3);
}

.reload-button:active {
  transform: scale(0.95);
}

/* Reload icon */
.reload-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.reload-button:hover .reload-icon {
  transform: translateX(2px);
}

/* Main layout */
.main-layout {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .profile-island-container {
    color: #f1f5f9;
  }
  
  .reload-button {
    color: white;
  }
}

/* Blob animations */
@keyframes blob1 {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.2) rotate(90deg);
    opacity: 0.6;
  }
}

@keyframes blob2 {
  0%, 100% {
    transform: scale(1.2) rotate(0deg);
    opacity: 0.4;
  }
  50% {
    transform: scale(1) rotate(-60deg);
    opacity: 0.6;
  }
}
</style>
