<template>
  <div class="about">
    <!-- 向上滚动引导动画 -->
    <ScrollUp />
    <h1>About Page</h1>
    <p>This is the about page.</p>
    <p>Here you can learn more about our application.</p>
  </div>
</template>

<script setup>
import ScrollUp from '@/components/ScrollUp.vue';

defineOptions({
  name: 'AboutView'
})
</script>

<style lang="scss" scoped>
.about {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
</style>