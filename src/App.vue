<!-- <script setup></script> -->
<template>
  <div id="app">
    <DefaultHeader />
    <main>
      <router-view />
      <!-- 페이지가 여기에 들어가요 -->
    </main>
    <DefaultFooter />
  </div>
</template>

<script>
import DefaultHeader from './components/common/DefaultHeader.vue'
import DefaultFooter from './components/common/DefaultFooter.vue'

export default {
  name: 'App',
  components: {
    DefaultHeader,
    DefaultFooter,
  },
}
</script>

<style>
/* Tailwind CSS 또는 기본 스타일 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
}
</style>

<!-- <style scoped></style> -->
