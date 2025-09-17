<template>
  <header class="bg-blue-600 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-xl font-bold">Csolved</h1>
      <nav>
        <router-link to="/" class="mr-4">홈</router-link>
        <router-link to="/login" class="mr-4">로그인</router-link>
        <router-link to="/signup">회원가입</router-link>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'DefaultHeader',
}
</script>
