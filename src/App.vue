<template>
  <div id="app">
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import 'bootstrap-icons/font/bootstrap-icons.css'

export default {
  name: 'App',
  components: {},
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
