import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import "@/style/style.scss";
import App from './App.vue'
import router from './router'
// swiper
import "swiper/css";
// 自定义鼠标样式
import { cursorInit, cursorCleanup } from '@/utils/cursor.js';
const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 初始化自定义鼠标样式
cursorInit();

// 路由切换时重新初始化鼠标样式
router.afterEach(() => {
  cursorCleanup();
  cursorInit();
});

app.mount('#app')
