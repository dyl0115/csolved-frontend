<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- CSolved Platform 소개 -->
        <div class="text-center md:text-left">
          <h5 class="text-lg font-semibold mb-4">CSolved Platform</h5>
          <p class="text-gray-300 text-sm leading-relaxed">
            함께 경험을 공유할 수 있는 플랫폼입니다.
          </p>
        </div>

        <!-- 고객지원 -->
        <div class="text-center md:text-left">
          <h5 class="text-lg font-semibold mb-4">고객지원</h5>
          <div class="text-sm">
            <div class="flex items-center justify-center md:justify-start space-x-2 text-gray-300">
              <i class="bi bi-envelope"></i>
              <span>dyl0115@naver.com</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 저작권 -->
      <div class="border-t border-gray-700 mt-8 pt-6 text-center">
        <p class="text-xs text-gray-400">
          Copyright &copy; {{ currentYear }} CSolved. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'UserFooter',
  computed: {
    currentYear() {
      return new Date().getFullYear()
    },
  },
}
</script>

<style scoped>
/* Footer가 페이지 하단에 고정되도록 */
footer {
  margin-top: auto;
}

/* 호버 효과 */
.footer-link {
  transition: color 0.2s ease-in-out;
}

.footer-link:hover {
  text-decoration: underline;
}
</style>
