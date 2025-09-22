<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- CSolved Platform 소개 -->
        <div class="text-center md:text-left">
          <h5 class="text-lg font-semibold mb-4">CSolved Platform</h5>
          <p class="text-gray-300 text-sm leading-relaxed">
            신입 백엔드 개발자들이 함께 성장하고 경험을 공유할 수 있는 플랫폼입니다.
          </p>
        </div>

        <!-- 게시판 링크 -->
        <div class="text-center md:text-left">
          <h5 class="text-lg font-semibold mb-4">게시판</h5>
          <div class="space-y-2 text-sm">
            <div>
              <router-link
                to="/communities?page=1"
                class="text-gray-300 hover:text-white transition-colors duration-200"
              >
                커뮤니티
              </router-link>
            </div>
            <div>
              <router-link
                to="/questions?page=1"
                class="text-gray-300 hover:text-white transition-colors duration-200"
              >
                면접질문
              </router-link>
            </div>
            <div>
              <router-link
                to="/code-reviews?page=1"
                class="text-gray-300 hover:text-white transition-colors duration-200"
              >
                코드리뷰
              </router-link>
            </div>
          </div>
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
    }
  }
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
