<script setup>
import { ref, onMounted } from 'vue'

// 控制动画显示
const showAnimation = ref(false)

onMounted(() => {
  // 延迟启动动画，确保组件已挂载
  setTimeout(() => {
    showAnimation.value = true
  }, 100)
})
</script>

<template>
  <div class="info-grid-container">
    <div class="info-grid">
      
      <!-- Profile Card -->
      <div 
        class="info-card profile-card"
        :class="showAnimation ? 'animate-enter' : ''"
        :style="{ animationDelay: '0ms' }"
      >
        <div class="profile-card-bg"></div>
        
        <div class="profile-content">
          <div class="avatar-container">
              <img src="https://picsum.photos/200/200?random=99" alt="Avatar" class="avatar" />
          </div>
          <h1 class="profile-name">Alex Dev</h1>
          <p class="profile-title">Senior Frontend Engineer</p>
        </div>
        
        <div class="profile-info">
          <div class="info-item">
              <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              San Francisco, CA
          </div>
           <div class="info-item">
              <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              Creating digital experiences
          </div>
        </div>
      </div>
      
      <!-- Tech Stack / Stats -->
      <div 
        class="info-card stats-card"
        :class="showAnimation ? 'animate-enter' : ''"
        :style="{ animationDelay: '100ms' }"
      >
        <div class="stats-number">5+</div>
        <div class="stats-label">Years Exp.</div>
      </div>
      
      <!-- Social Links -->
      <div 
        class="info-card social-card"
        :class="showAnimation ? 'animate-enter' : ''"
        :style="{ animationDelay: '200ms' }"
      >
        <a href="#" class="social-link">
          <svg class="social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
            <path d="M9 18c-4.51 2-5-2-7-2"></path>
          </svg>
        </a>
        <a href="#" class="social-link">
          <svg class="social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
          </svg>
        </a>
        <a href="#" class="social-link">
          <svg class="social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
            <rect x="2" y="9" width="4" height="12"></rect>
            <circle cx="4" cy="4" r="2"></circle>
          </svg>
        </a>
        <a href="#" class="social-link">
          <svg class="social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </a>
      </div>
      
      <!-- Project Preview -->
      <div 
        class="info-card project-card"
        :class="showAnimation ? 'animate-enter' : ''"
        :style="{ animationDelay: '300ms' }"
      >
        <div class="project-header">
          <div class="project-title">Project: Dynamic Island</div>
          <div class="project-status">Live</div>
        </div>
        <div class="project-description">Interactive music player with dynamic island UI inspired by iOS 16. Built with React and Framer Motion.</div>
        <div class="project-footer">
          <div class="tech-tags">
            <div class="tech-tag">React</div>
            <div class="tech-tag">Framer Motion</div>
            <div class="tech-tag">TypeScript</div>
          </div>
          <button class="project-button">
            <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Quote -->
      <div 
        class="info-card quote-card"
        :class="showAnimation ? 'animate-enter' : ''"
        :style="{ animationDelay: '400ms' }"
      >
        <div class="quote-symbol">"</div>
        <div class="quote-text">"The only way to do great work is to love what you do."</div>
        <div class="quote-author">- Steve Jobs</div>
      </div>
      
      <!-- Contact CTA -->
      <div 
        class="info-card contact-card"
        :class="showAnimation ? 'animate-enter' : ''"
        :style="{ animationDelay: '500ms' }"
      >
        <div class="contact-title">Let's Connect</div>
        <div class="contact-subtitle">Ready to start a project?</div>
        <button class="contact-button">
          Get in Touch
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Info Grid Container */
.info-grid-container {
  max-width: 64rem;
  margin: 0 auto;
  padding-top: 0;
  padding-left: 16px;
  padding-right: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-bottom: 80px;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  height: 50vh;
  min-height: 400px;
}

/* Responsive Grid for Medium Screens and Above */
@media (min-width: 768px) {
  .info-grid {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
  }
}

/* Info Card Base Styles */
.info-card {
  border-radius: 32px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

/* Glass panel effects */
.info-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Profile Card */
.profile-card {
  grid-column: 1 / -1;
  grid-row: span 2;
  background: rgba(17, 24, 39, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Stats Card */
.stats-card {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.stats-card:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

/* Social Card */
.social-card {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

/* Project Card */
.project-card {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.project-card:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

/* Quote Card */
.quote-card {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Contact Card */
.contact-card {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.contact-card:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

/* Responsive Grid Columns */
@media (min-width: 768px) {
  .profile-card {
    grid-column: 1 / 3;
  }
  
  .stats-card {
    grid-column: 3 / 4;
    grid-row: 1 / 2;
  }
  
  .social-card {
    grid-column: 4 / 5;
    grid-row: 1 / 2;
  }
  
  .project-card {
    grid-column: 3 / 5;
    grid-row: 2 / 3;
  }
  
  .quote-card {
    grid-column: 1 / 3;
    grid-row: 3 / 4;
  }
  
  .contact-card {
    grid-column: 3 / 5;
    grid-row: 3 / 4;
  }
}

/* Profile Card Background */
.profile-card-bg {
  position: absolute;
  top: 0;
  right: 0;
  width: 256px;
  height: 256px;
  background-color: rgba(59, 130, 246, 0.2);
  border-radius: 50%;
  filter: blur(80px);
  transform: translateY(-50%) translateX(50%);
  transition: background-color 0.5s ease;
}

.profile-card:hover .profile-card-bg {
  background-color: rgba(96, 165, 250, 0.3);
}

/* Profile Content */
.profile-content {
  z-index: 10;
}

.avatar-container {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(to top right, #e5e7eb, white);
  margin-bottom: 24px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-name {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: -0.025em;
  line-height: 1;
}

.profile-title {
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.125rem;
  margin: 0;
}

/* Profile Info */
.profile-info {
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}

.info-icon {
  width: 16px;
  height: 16px;
  color: inherit;
}

/* Stats Card Content */
.stats-number {
  color: white;
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.stats-label {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  font-weight: 500;
}

/* Social Links */
.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
  transition: all 0.3s ease;
}

.social-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.social-icon {
  width: 24px;
  height: 24px;
  color: inherit;
}

/* Project Card Content */
.project-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.project-title {
  color: white;
  font-weight: 700;
  font-size: 1.125rem;
}

.project-status {
  padding: 4px 12px;
  border-radius: 9999px;
  background-color: rgba(34, 197, 94, 0.2);
  color: #34d399;
  font-size: 12px;
  font-weight: 500;
}

.project-description {
  margin-top: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-footer {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tech-tags {
  display: flex;
  gap: 8px;
}

.tech-tag {
  padding: 4px 8px;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}

.project-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.project-button:hover {
  color: rgba(255, 255, 255, 0.8);
}

.button-icon {
  width: 20px;
  height: 20px;
  color: inherit;
}

/* Quote Card Content */
.quote-symbol {
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 16px;
  font-size: 2rem;
}

.quote-text {
  color: white;
  font-size: 1.125rem;
  font-weight: 500;
  font-style: italic;
  margin-bottom: 16px;
}

.quote-author {
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
}

/* Contact Card Content */
.contact-title {
  color: white;
  font-weight: 700;
  font-size: 1.125rem;
  margin-bottom: 8px;
}

.contact-subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  margin-bottom: 16px;
}

.contact-button {
  padding: 12px 24px;
  border-radius: 9999px;
  background: linear-gradient(to right, #2563eb, #7c3aed);
  color: white;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.contact-button:hover {
  box-shadow: 0 20px 25px -5px rgba(37, 99, 235, 0.2), 0 10px 10px -5px rgba(37, 99, 235, 0.1);
  transform: scale(1.05);
}

/* Animation for card entrance */
@keyframes enter {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-enter {
  animation: enter 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}
</style>
