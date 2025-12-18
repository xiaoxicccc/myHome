import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Login from '../views/Login.vue'
import IpadMini from '../views/IpadMini.vue'
import Index from '../views/index.vue'
import Flowers from '../views/flowers.vue'
import Shoes from '../views/Shoes.vue'
import lens from '../views/lens.vue'
import ProfileIsland from '../views/ProfileIsland.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',  
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/ipad-mini',
      name: 'ipad-mini',
      component: IpadMini
    },
    {
      path: '/index',
      name: 'index',
      component: Index
    },
    {
      path: '/flowers',
      name: 'flowers',
      component: Flowers
    },
    {
      path: '/shoes',
      name: 'shoes',
      component: Shoes
    },
    {
      path: '/lens',
      name: 'lens',
      component: lens
    },
    {
      path: '/profile-island',
      name: 'profile-island',
      component: ProfileIsland
    }
  ]
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
  // 检查用户是否已登录
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  // 白名单页面，不需要登录即可访问
  const whiteList = ['/login'];
  
  // 如果用户未登录，且访问的不是白名单页面，则跳转到登录页面
  if (!isLoggedIn && !whiteList.includes(to.path)) {
    next('/login');
  } else {
    // 如果用户已登录，且访问的是登录页面，则跳转到首页
    if (isLoggedIn && to.path === '/login') {
      next('/home');
    } else {
      // 其他情况，正常跳转
      next();
    }
  }
});

export default router