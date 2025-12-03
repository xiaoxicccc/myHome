<template>
  <div class="three-background">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as THREE from 'three';
import { mainStore } from "@/stores";

const store = mainStore();
const canvasRef = ref(null);

// --- Configuration ---
const SEPARATION = 40;
const AMOUNTX = 80;
const AMOUNTY = 80;

// --- State ---
let audioContext = null;
let analyser = null;
let dataArray = null;
let isPlaying = false;
let count = 0;

// --- Three.js Variables ---
let scene, camera, renderer;
let particles;
let fadeScene, fadeCamera, fadePlane;
let audioSource = null;
let audioElement = null; // 跟踪当前连接的音频元素

// ==========================================
// 1. Audio System Setup
// ==========================================
function initAudio() {
    if (audioContext) return; // Already initialized

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
    
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.85;

    dataArray = new Uint8Array(analyser.frequencyBinCount);
}

// 连接音频源
function connectAudioSource(element) {
    // 如果音频元素没有变化，直接返回
    if (audioElement === element) {
        return;
    }
    
    if (!audioContext) {
        initAudio();
    }
    
    // 断开之前的连接
    if (audioSource) {
        audioSource.disconnect();
        audioSource = null;
    }
    
    // 更新当前音频元素引用
    audioElement = element;
    
    try {
        // 连接新的音频源
        audioSource = audioContext.createMediaElementSource(element);
        audioSource.connect(analyser);
        // 确保音频输出到扬声器
        analyser.connect(audioContext.destination);
    } catch (error) {
        console.warn('创建MediaElementSource失败:', error.message);
        // 重新初始化音频上下文，解决重复连接问题
        if (audioContext) {
            audioContext.close();
            audioContext = null;
        }
        // 重新初始化音频系统
        initAudio();
        // 重试连接
        if (audioContext) {
            audioSource = audioContext.createMediaElementSource(element);
            audioSource.connect(analyser);
            analyser.connect(audioContext.destination);
        }
    }
}

// ==========================================
// 2. Visualizer System Setup (Three.js)
// ==========================================
function initVisualizer() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
    camera.position.z = 1800;
    camera.position.y = 600;
    camera.lookAt(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.value,
        antialias: true,
        alpha: false,
        preserveDrawingBuffer: true // Crucial for trails
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 1);

    // --- Fade Effect (Trails) ---
    fadeScene = new THREE.Scene();
    fadeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const fadeGeometry = new THREE.PlaneGeometry(2, 2);
    const fadeMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.15, // Trail length
        depthTest: false,
        depthWrite: false
    });
    fadePlane = new THREE.Mesh(fadeGeometry, fadeMaterial);
    fadeScene.add(fadePlane);

    // --- Particles ---
    const numParticles = AMOUNTX * AMOUNTY;
    const positions = new Float32Array(numParticles * 3);
    const scales = new Float32Array(numParticles);
    
    let i = 0, j = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
            positions[i] = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
            positions[i + 1] = 0;
            positions[i + 2] = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
            scales[j] = 1;
            i += 3;
            j++;
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Custom Shader
    const material = new THREE.ShaderMaterial({
        uniforms: {
            color: { value: new THREE.Color(0x00ffff) },
            pixelRatio: { value: window.devicePixelRatio },
        },
        vertexShader: `
            attribute float scale;
            uniform float pixelRatio;
            varying float vScale;
            
            void main() {
                vScale = scale;
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                // Physical size attenuation
                gl_PointSize = scale * 8.0 * pixelRatio * ( 600.0 / - mvPosition.z );
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            varying float vScale;
            
            void main() {
                // Distance from center (0.0 to 0.5)
                float dist = distance(gl_PointCoord, vec2(0.5));
                
                // Exponential falloff for "hot light" look
                float intensity = 1.0 - (pow(dist * 2.0, 1.5));
                intensity = clamp(intensity, 0.0, 1.0);
                
                if (intensity <= 0.0) discard;

                // Dynamic coloring: White center for large particles
                vec3 finalColor = color;
                if (vScale > 3.0) {
                    finalColor = mix(color, vec3(1.0, 1.0, 1.0), (vScale - 3.0) * 0.2);
                }

                gl_FragColor = vec4( finalColor, intensity );
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Start Loop
    animate();
}

// ==========================================
// 3. Animation Loop
// ==========================================
function animate() {
    requestAnimationFrame(animate);

    // Get Frequency Data
    if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray);
    }

    const positions = particles.geometry.attributes.position.array;
    const scales = particles.geometry.attributes.scale.array;

    // Calculate average volume for color brightness
    let sum = 0;
    if (analyser && isPlaying) {
        for(let k=0; k < dataArray.length; k++) sum += dataArray[k];
    }
    const avgVolume = isPlaying ? sum / dataArray.length : 0;

    let i = 0, j = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
            
            // 1. Base Idle Wave
            const sineHeight = (Math.sin((ix + count) * 0.3) * 30) + (Math.sin((iy + count) * 0.5) * 30);
            
            let audioHeight = 0;
            let scaleFactor = 0.5; // Base size
            
            // 2. Audio Reaction
            if (analyser && isPlaying) {
                const centerX = AMOUNTX / 2;
                const centerY = AMOUNTY / 2;
                const dist = Math.sqrt(Math.pow(ix - centerX, 2) + Math.pow(iy - centerY, 2));
                const maxDist = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
                
                // Map particle position to frequency index
                const normDist = dist / maxDist;
                const freqIndex = Math.floor(normDist * (dataArray.length / 2)); 
                const val = dataArray[freqIndex] || 0;
                
                audioHeight = val * 2.5; 
                
                // Bass/Hit reaction size
                scaleFactor = 0.5 + Math.pow((val / 255.0), 2.5) * 5.0;
            }

            positions[i + 1] = sineHeight + audioHeight;
            scales[j] = scaleFactor;

            i += 3;
            j++;
        }
    }

    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.scale.needsUpdate = true;

    // Color Cycling
    const hue = (count * 0.005) % 1;
    const targetColor = new THREE.Color();
    targetColor.setHSL(hue, 0.9, 0.5 + (avgVolume / 255) * 0.2); 
    particles.material.uniforms.color.value.lerp(targetColor, 0.1);

    count += 0.1;

    // Render with Trails
    renderer.render(fadeScene, fadeCamera);
    renderer.clearDepth(); // Keep particles on top of fade plane
    renderer.render(scene, camera);
}

// ==========================================
// 4. Resize Handling
// ==========================================
const handleResize = () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        if (particles) {
            particles.material.uniforms.pixelRatio.value = window.devicePixelRatio;
        }
    }
};

// ==========================================
// 5. Store Integration
// ==========================================
watch(
    () => store.playerState,
    (newState) => {
        isPlaying = newState;
        if (isPlaying && audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }
);

// ==========================================
// 6. Cleanup
// ==========================================
const cleanup = () => {
    if (renderer) {
        renderer.dispose();
    }
    
    if (particles) {
        particles.geometry.dispose();
        particles.material.dispose();
    }
    
    // 断开音频连接
    if (audioSource) {
        audioSource.disconnect();
        audioSource = null;
    }
    
    // 关闭音频上下文
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
    
    // 重置音频元素引用
    audioElement = null;
    
    // 移除事件监听
    window.removeEventListener('resize', handleResize);
};

onMounted(() => {
    // 初始化视觉效果
    initVisualizer();
    
    // 添加事件监听
    window.addEventListener('resize', handleResize);
    
    // 等待DOM更新，然后尝试获取音频元素
    setTimeout(() => {
        const audioElements = document.getElementsByTagName('audio');
        if (audioElements.length > 0) {
            const audioElement = audioElements[0];
            // 连接音频源
            connectAudioSource(audioElement);
        }
    }, 1000);
});

onBeforeUnmount(() => {
    cleanup();
});
</script>

<style scoped>
.three-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  
  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>