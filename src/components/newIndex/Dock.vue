<template>
  <div class="dock-wrapper">
    <!-- Main Dock container -->
    <div 
      ref="dockContainerRef"
      class="dock-container"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
      @wheel="handleWheel"
      @mouseenter="handleContainerMouseEnter"
    >
      <!-- Main Dock panel -->
      <div class="dock-panel"
           :style="{
             borderColor: isMouseOverContainer.value ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'
           }">
        
        <!-- Dock items -->
        <div 
          v-for="item in items" 
          :key="item.id"
          ref="dockItemRefs"
          class="dock-item"
          :style="{
            width: `${item.width}px`,
            height: `${item.width}px`,
            transform: `scale(${item.scale}) translateY(${item.yOffset}px)`,
            backgroundColor: item.isHovered ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'
          }"
          @click="console.log('Clicked:', item.id)"
          @mouseenter="handleItemMouseEnter(item)"
          @mouseleave="handleItemMouseLeave(item)"
        >
          <div class="dock-item-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path v-if="item.icon === 'home'" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline v-if="item.icon === 'home'" points="9 22 9 12 15 12 15 22"></polyline>
              <circle v-if="item.icon === 'user'" cx="12" cy="7" r="4"></circle>
              <path v-if="item.icon === 'user'" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <polyline v-if="item.icon === 'code'" points="16 18 22 12 16 6"></polyline>
              <polyline v-if="item.icon === 'code'" points="8 6 2 12 8 18"></polyline>
              <path v-if="item.icon === 'layers'" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <polyline v-if="item.icon === 'terminal'" points="4 17 10 11 4 5"></polyline>
              <line v-if="item.icon === 'terminal'" x1="12" y1="19" x2="20" y2="19"></line>
              <rect v-if="item.icon === 'image'" x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle v-if="item.icon === 'image'" cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline v-if="item.icon === 'image'" points="21 15 16 10 5 21"></polyline>
              <path v-if="item.icon === 'music'" d="M9 18V5l12-2v13"></path>
              <circle v-if="item.icon === 'music'" cx="6" cy="18" r="3"></circle>
              <circle v-if="item.icon === 'music'" cx="18" cy="16" r="3"></circle>
              <path v-if="item.icon === 'mail'" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline v-if="item.icon === 'mail'" points="22,6 12,13 2,6"></polyline>
              <rect v-if="item.icon === 'cpu'" x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
              <rect v-if="item.icon === 'cpu'" x="9" y="9" width="6" height="6"></rect>
              <line v-if="item.icon === 'cpu'" x1="9" y1="1" x2="9" y2="4"></line>
              <line v-if="item.icon === 'cpu'" x1="15" y1="1" x2="15" y2="4"></line>
              <line v-if="item.icon === 'cpu'" x1="9" y1="20" x2="9" y2="23"></line>
              <line v-if="item.icon === 'cpu'" x1="15" y1="20" x2="15" y2="23"></line>
              <line v-if="item.icon === 'cpu'" x1="20" y1="9" x2="23" y2="9"></line>
              <line v-if="item.icon === 'cpu'" x1="20" y1="14" x2="23" y2="14"></line>
              <line v-if="item.icon === 'cpu'" x1="1" y1="9" x2="4" y2="9"></line>
              <line v-if="item.icon === 'cpu'" x1="1" y1="14" x2="4" y2="14"></line>
              <circle v-if="item.icon === 'settings'" cx="12" cy="12" r="3"></circle>
              <path v-if="item.icon === 'settings'" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </div>
          
          <!-- Tooltip - Apple style: appears above -->
          <div 
            class="dock-tooltip"
            :style="{
              opacity: item.isHovered ? 1 : 0,
              transform: `translateX(-50%) translateY(${item.isHovered ? '0px' : '8px'})`
            }"
          >
            <span>{{ item.label }}</span>
          </div>
          
          <!-- Reflection shine effect -->
          <div class="dock-item-shine"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import gsap from 'gsap'

// Dock container ref
const dockContainerRef = ref(null)
const dockItemRefs = ref([])
const mouseX = ref(Infinity)
const isMouseOverContainer = ref(false)

// Dock items data
const items = ref([
  { id: 'home', icon: 'home', label: 'Home', width: 48, scale: 1, yOffset: 0, isHovered: false, originalWidth: 48 },
  { id: 'profile', icon: 'user', label: 'Profile', width: 48, scale: 1, yOffset: 0, isHovered: false, originalWidth: 48 },
  { id: 'projects', icon: 'code', label: 'Projects', width: 48, scale: 1, yOffset: 0, isHovered: false, originalWidth: 48 },
  { id: 'stack', icon: 'layers', label: 'Stack', width: 48, scale: 1, yOffset: 0, isHovered: false, originalWidth: 48 },
  { id: 'terminal', icon: 'terminal', label: 'Console', width: 48, scale: 1, yOffset: 0, isHovered: false, originalWidth: 48 },
  { id: 'photos', icon: 'image', label: 'Gallery', width: 48, scale: 1, yOffset: 0, isHovered: false, originalWidth: 48 },
  { id: 'music', icon: 'music', label: 'Music', width: 48, scale: 1, yOffset: 0, isHovered: false, originalWidth: 48 },
  { id: 'contact', icon: 'mail', label: 'Contact', width: 48, scale: 1, yOffset: 0, isHovered: false, originalWidth: 48 },
  { id: 'system', icon: 'cpu', label: 'System', width: 48, scale: 1, yOffset: 0, isHovered: false, originalWidth: 48 },
  { id: 'settings', icon: 'settings', label: 'Settings', width: 48, scale: 1, yOffset: 0, isHovered: false, originalWidth: 48 },
])

// Calculate item width based on mouse distance
const calculateItemWidth = (itemIndex) => {
  if (!dockItemRefs.value[itemIndex]) return items.value[itemIndex].originalWidth
  
  const itemRect = dockItemRefs.value[itemIndex].getBoundingClientRect()
  const distance = mouseX.value - itemRect.x - itemRect.width / 2
  
  // Calculate width based on distance
  // Max width at center, decreases as distance increases
  const maxWidth = 64
  const minWidth = 48
  const maxDistance = 150
  
  let width = maxWidth
  if (Math.abs(distance) > maxDistance) {
    width = minWidth
  } else {
    // Smooth interpolation using cosine easing
    const normalizedDistance = Math.abs(distance) / maxDistance
    const easing = (1 + Math.cos(normalizedDistance * Math.PI)) / 2
    width = minWidth + (maxWidth - minWidth) * easing
  }
  
  return width
}

// Update all item widths based on mouse position
const updateItemWidths = () => {
  items.value.forEach((item, index) => {
    const width = calculateItemWidth(index)
    
    // Calculate scale based on width
    const scale = 1 + (width - item.originalWidth) / 128
    
    // Calculate y offset based on width (lift items when scaled)
    const yOffset = -(width - item.originalWidth) / 8
    
    // Update item properties with GSAP animation
    gsap.to(item, {
      width: width,
      scale: scale,
      yOffset: yOffset,
      duration: 0.2,
      ease: 'power2.out'
    })
  })
}

// Event handlers
const handleMouseMove = (e) => {
  mouseX.value = e.pageX
  updateItemWidths()
}

const handleMouseLeave = () => {
  isMouseOverContainer.value = false
  mouseX.value = Infinity
  
  // Reset all items to original size
  items.value.forEach((item) => {
    gsap.to(item, {
      width: item.originalWidth,
      scale: 1,
      yOffset: 0,
      duration: 0.3,
      ease: 'elastic.out(1, 0.5)'
    })
    item.isHovered = false
  })
}

const handleContainerMouseEnter = () => {
  isMouseOverContainer.value = true
}

const handleItemMouseEnter = (item) => {
  item.isHovered = true
}

const handleItemMouseLeave = (item) => {
  // Always reset hover state when mouse leaves the item
  // This ensures tooltip disappears when moving between items
  item.isHovered = false
}

const handleWheel = (e) => {
  if (dockContainerRef.value) {
    // Map vertical scroll to horizontal with smooth animation
    gsap.to(dockContainerRef.value, {
      scrollLeft: dockContainerRef.value.scrollLeft + e.deltaY * 0.5,
      duration: 0.3,
      ease: 'power2.out'
    })
  }
}

// Initialize Dock animation
onMounted(() => {
  nextTick(() => {
    // Initial entrance animation for Dock container
    gsap.from(dockContainerRef.value, {
      y: 100,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(1.7)'
    })
    
    // Initial entrance animation for Dock items
    items.value.forEach((item, index) => {
      gsap.fromTo(item, 
        { yOffset: 50, opacity: 0 },
        {
          yOffset: 0,
          opacity: 1,
          duration: 0.4,
          delay: index * 0.05,
          ease: 'back.out(1.7)'
        }
      )
    })
  })
})
</script>

<style scoped>
/* Dock wrapper */
.dock-wrapper {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  width: 100%;
  max-width: 95vw;
  display: flex;
  justify-content: center;
  perspective: 1000px;
}

/* Responsive design for medium screens and above */
@media (min-width: 768px) {
  .dock-wrapper {
    max-width: 48rem;
  }
}

/* Dock container */
.dock-container {
  position: relative;
  transition: all 0.3s ease;
}

/* Dock panel */
.dock-panel {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 12px 16px;
  border-radius: 32px;
  display: flex;
  gap: 12px;
  overflow-x: auto;
  overflow-y: hidden;
  align-items: flex-end;
  margin: 0 auto;
  max-width: 100%;
  position: relative;
  z-index: 10;
  transition: all 0.3s ease;
}

/* Hide scrollbar */
.dock-panel {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.dock-panel::-webkit-scrollbar {
  display: none;
}

/* Dock glow effect */
.dock-glow {
  position: absolute;
  inset: 0;
  border-radius: 32px;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
  filter: blur(12px);
  pointer-events: none;
  z-index: 0;
  transition: opacity 0.3s ease;
}

/* Dock items */
.dock-item {
  position: relative;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 20;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

/* Dock item icon */
.dock-item-icon {
  color: rgba(255, 255, 255, 0.9);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dock-item-icon svg {
  width: 24px;
  height: 24px;
}

/* Dock tooltip */
.dock-tooltip {
  position: absolute;
  top: -48px;
  left: 50%;
  transform: translateX(-50%) translateY(8px);
  padding: 4px 12px;
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  pointer-events: none;
  transition: all 0.2s ease;
  white-space: nowrap;
}

/* Dock item shine effect */
.dock-item-shine {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: linear-gradient(to top right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.dock-item:hover .dock-item-shine {
  opacity: 1;
}
</style>
