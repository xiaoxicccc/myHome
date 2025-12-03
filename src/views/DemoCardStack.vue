<template>
  <main id="app" class="w-full min-h-screen bg-slate-950 text-white overflow-hidden relative selection:bg-yellow-500/30">
    
    <!-- INTRO OVERLAY -->
    <div id="intro-overlay" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white">
      <div class="overflow-hidden">
        <h1 id="intro-text" class="text-6xl md:text-9xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 opacity-0 blur-md translate-y-12">
          Visionary
        </h1>
      </div>
      <div class="w-48 md:w-64 h-[2px] bg-slate-800 mt-8 rounded-full overflow-hidden">
        <div id="intro-bar" class="w-full h-full bg-yellow-400 origin-left scale-x-0"></div>
      </div>
    </div>

    <!-- MAIN CONTENT (Hidden initially) -->
    <div id="main-content" class="opacity-0 transition-opacity duration-1000">
      
      <div id="stack-wrapper" class="relative w-full h-screen bg-slate-950 overflow-hidden perspective-container">
        <!-- Background Ambience -->
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950 pointer-events-none"></div>
        
        <!-- Scroll Indicator -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-pulse text-white/40 pointer-events-none mix-blend-screen">
          <span class="text-[10px] uppercase tracking-[0.4em] font-light">Scroll to Flip</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
        </div>

        <!-- Cards Container -->
        <div class="w-full h-full flex items-center justify-center preserve-3d">
          <div id="cards-container" class="relative w-[90vw] md:w-[700px] h-[60vh] md:h-[500px] preserve-3d">
            <!-- Cards will be rendered here via JS -->
          </div>
        </div>
      </div>

    </div>
  </main>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// --- DATA ---
const CARDS = [
  {
    id: 1,
    title: "NEBULA",
    subtitle: "Cosmic Exploration",
    description: "Journey through the vast expanse of interstellar clouds where stars are born.",
    imageUrl: "https://picsum.photos/id/10/800/1200",
    color: "from-purple-500 to-indigo-900"
  },
  {
    id: 2,
    title: "ALPINE",
    subtitle: "Mountain Peaks",
    description: "Experience the serenity and danger of the world's highest altitudes.",
    imageUrl: "https://picsum.photos/id/29/800/1200",
    color: "from-emerald-500 to-teal-900"
  },
  {
    id: 3,
    title: "URBAN",
    subtitle: "City Lights",
    description: "The pulse of the metropolis never stops beating in the neon rain.",
    imageUrl: "https://picsum.photos/id/48/800/1200",
    color: "from-blue-500 to-slate-900"
  },
  {
    id: 4,
    title: "OCEANIC",
    subtitle: "Deep Blue",
    description: "Discover the mysteries hidden beneath the crushing pressure of the deep.",
    imageUrl: "https://picsum.photos/id/58/800/1200",
    color: "from-cyan-500 to-blue-900"
  },
  {
    id: 5,
    title: "DESERT",
    subtitle: "Golden Sands",
    description: "Silence speaks volumes in the shifting dunes of the endless sahara.",
    imageUrl: "https://picsum.photos/id/78/800/1200",
    color: "from-orange-500 to-red-900"
  },
];

// --- RENDER FUNCTION ---
function renderCards() {
  const cardsContainer = document.getElementById('cards-container');
  if (!cardsContainer) return;

  CARDS.forEach((card, index) => {
    const cardEl = document.createElement('div');
    // Add class 'card-item' for selection later
    cardEl.className = `card-item absolute inset-0 rounded-[24px] overflow-hidden shadow-2xl border border-white/10 will-change-transform preserve-3d`;
    cardEl.style.zIndex = CARDS.length - index;
    cardEl.style.backgroundColor = '#0f172a';

    cardEl.innerHTML = `
      <!-- Image Layer -->
      <div class="absolute inset-0">
        <img src="${card.imageUrl}" alt="${card.title}" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-tr ${card.color} opacity-30 mix-blend-overlay"></div>
        <div class="absolute inset-0 card-gradient"></div>
      </div>

      <!-- Content Layer -->
      <div class="content-box absolute inset-0 flex flex-col justify-end p-8 md:p-12 translate-z-20">
        <div class="flex items-end justify-between w-full">
          <div class="max-w-md">
             <div class="flex items-center gap-3 mb-3">
              <span class="h-[2px] w-12 bg-yellow-400"></span>
              <h3 class="text-yellow-400 text-xs font-bold tracking-[0.25em] uppercase drop-shadow-md">
                ${card.subtitle}
              </h3>
            </div>
            <h2 class="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-2xl mb-4">
              ${card.title}
            </h2>
            <p class="text-slate-300 text-sm md:text-lg leading-relaxed font-light line-clamp-3 md:line-clamp-none border-l-2 border-white/20 pl-4">
              ${card.description}
            </p>
          </div>
          
          <!-- Decorative Number -->
          <div class="hidden md:block">
             <span class="text-8xl font-black text-white/5 select-none">0${card.id}</span>
          </div>
        </div>
      </div>
    `;
    cardsContainer.appendChild(cardEl);
  });
}

// --- ANIMATION SEQUENCE ---

function initApp() {
  // 1. Render HTML
  renderCards();
  const cards = document.querySelectorAll('.card-item');
  const mainContent = document.getElementById('main-content');
  const introOverlay = document.getElementById('intro-overlay');
  const wrapper = document.getElementById('stack-wrapper');

  if (!cards.length || !mainContent || !introOverlay || !wrapper) return;

  // 2. Initial Set (Off-screen)
  const isMobile = window.innerWidth < 768;
  const xOffset = isMobile ? 12 : 35; 
  const yOffset = isMobile ? -12 : -35; 
  const zOffset = -60; 

  gsap.set(cards, {
    y: window.innerHeight + 200, 
    x: 0,
    z: (i) => i * zOffset,
    scale: (i) => 1 - (i * 0.04),
    rotationX: 30,
    opacity: 0,
    transformOrigin: "center center"
  });

  // 3. Intro Animation
  const tlIntro = gsap.timeline({
    onComplete: () => {
       runEntranceAnimation(cards, xOffset, yOffset, zOffset);
    }
  });

  tlIntro
    .to('#intro-text', { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: "power3.out" })
    .to('#intro-bar', { scaleX: 1, duration: 1, ease: "expo.inOut" }, "-=0.8")
    .to(['#intro-text', '#intro-bar'], { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" })
    .to(introOverlay, { yPercent: -100, duration: 0.8, ease: "power4.inOut" })
    .set(mainContent, { opacity: 1 }, "<"); // Show main content container
}

function runEntranceAnimation(cards, xOffset, yOffset, zOffset) {
  document.body.style.overflow = 'hidden'; // Lock scroll

  const tlEntrance = gsap.timeline({
    delay: 0.2,
    onComplete: () => {
      document.body.style.overflow = ''; // Unlock scroll
      initScrollInteraction(cards, xOffset, yOffset, zOffset);
    }
  });

  cards.forEach((card, i) => {
    tlEntrance.to(card, {
      y: i * yOffset, // Move UP
      x: i * xOffset, // Move RIGHT (Diagonal stack)
      z: i * zOffset,
      scale: 1 - (i * 0.04),
      rotationX: i === 0 ? 0 : 5,
      rotationZ: i * 2,
      opacity: 1,
      duration: 1.6,
      ease: "power4.out",
    }, i * 0.1);
  });
}

function initScrollInteraction(cards, xOffset, yOffset, zOffset) {
  ScrollTrigger.refresh();

  const wrapper = document.getElementById('stack-wrapper');
  if (!wrapper) return;

  const scrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: wrapper,
      start: "top top",
      end: "+=" + (window.innerHeight * 3),
      scrub: 1,
      pin: true,
      anticipatePin: 1,
    }
  });

  cards.forEach((card, i) => {
    if (i === cards.length - 1) return;

    // A. Push Away Current
    scrollTl.to(card, {
      y: -window.innerHeight * 1.2,
      rotationX: -45,
      z: 100,
      opacity: 0,
      scale: 0.9,
      duration: 1,
      ease: "power1.inOut"
    }, i);

    // B. Pull Next Cards Forward
    const nextCards = Array.from(cards).slice(i + 1);
    if (nextCards.length > 0) {
      scrollTl.to(nextCards, {
        x: (index) => index * xOffset,
        y: (index) => index * yOffset,
        z: (index) => index * zOffset,
        scale: (index) => 1 - (index * 0.04),
        rotationX: (index) => index === 0 ? 0 : 5,
        rotationZ: (index) => index * 2,
        duration: 1,
        ease: "power1.inOut"
      }, i);

      // C. Text Reveal
      const newTopCard = nextCards[0];
      const textContent = newTopCard.querySelector('.content-box');
      if (textContent) {
        scrollTl.fromTo(textContent, 
          { opacity: 0, y: 30, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: "power2.out" },
          i + 0.3
        );
      }
    }
  });
}

// Start the app
onMounted(() => {
  initApp();
});

onUnmounted(() => {
  // Cleanup ScrollTriggers
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
});
</script>

<style scoped>
.perspective-container {
  perspective: 2000px;
}

.preserve-3d {
  transform-style: preserve-3d;
}

.translate-z-20 {
  transform: translateZ(20px);
}

.card-gradient {
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
}

/* Utility to ensure clicks work if needed, though mostly scroll based */
.pointer-events-auto {
  pointer-events: auto;
}

/* Hide scrollbar */
::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}
</style>
