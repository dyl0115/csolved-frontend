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
/* App 전용 스타일 */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>

<!-- <style scoped></style> -->
