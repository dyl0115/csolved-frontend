<template>
  <header class="bg-blue-600 shadow-lg">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between items-center py-4">
        <!-- 로고 -->
        <div class="flex items-center">
          <router-link
            to="/communities?page=1"
            class="text-2xl font-bold text-white hover:text-blue-200 transition-colors"
          >
            Csolved
          </router-link>
        </div>

        <!-- 데스크톱 내비게이션 -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link
            to="/notices?page=1"
            class="text-white hover:text-blue-200 transition-colors font-medium"
          >
            공지사항
          </router-link>
          <router-link
            to="/communities?page=1"
            class="text-white hover:text-blue-200 transition-colors font-medium"
          >
            커뮤니티
          </router-link>

          <!-- 사용자 드롭다운 -->
          <div class="relative" ref="userDropdown">
            <button
              @click="toggleDropdown"
              class="flex items-center text-white hover:text-blue-200 transition-colors font-medium"
            >
              <span>{{ displayUserName }}</span>
              <svg class="ml-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <div
              v-show="isDropdownOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
            >
              <router-link
                to="/users/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                @click="closeDropdown"
              >
                내 프로필
              </router-link>
              <hr class="border-gray-200" />
              <router-link
                to="/users/activity?bookmarkPage=1&userPostPage=1&repliedPostPage=1"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                @click="closeDropdown"
              >
                내 활동
              </router-link>
              <hr class="border-gray-200" />
              <button
                @click="handleSignOut"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                로그아웃
              </button>
              <button
                @click="openWithdrawModal"
                class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                회원탈퇴
              </button>
            </div>
          </div>
        </div>

        <!-- 모바일 햄버거 버튼 -->
        <div class="md:hidden">
          <button
            @click="toggleMobileMenu"
            class="text-white hover:text-blue-200 transition-colors"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                v-if="!isMobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- 모바일 메뉴 -->
      <div v-show="isMobileMenuOpen" class="md:hidden pb-4">
        <div class="flex flex-col space-y-2">
          <router-link
            to="/communities?page=1"
            class="text-white hover:text-blue-200 transition-colors font-medium py-2"
            @click="closeMobileMenu"
          >
            Home
          </router-link>
          <router-link
            to="/notices?page=1"
            class="text-white hover:text-blue-200 transition-colors font-medium py-2"
            @click="closeMobileMenu"
          >
            공지사항
          </router-link>
          <router-link
            to="/communities?page=1"
            class="text-white hover:text-blue-200 transition-colors font-medium py-2"
            @click="closeMobileMenu"
          >
            커뮤니티
          </router-link>
          <router-link
            to="/questions?page=1"
            class="text-white hover:text-blue-200 transition-colors font-medium py-2"
            @click="closeMobileMenu"
          >
            면접질문
          </router-link>
          <router-link
            to="/code-reviews?page=1"
            class="text-white hover:text-blue-200 transition-colors font-medium py-2"
            @click="closeMobileMenu"
          >
            코드리뷰
          </router-link>
          <hr class="border-blue-500" />
          <router-link
            to="/users/profile"
            class="text-white hover:text-blue-200 transition-colors font-medium py-2"
            @click="closeMobileMenu"
          >
            내 프로필
          </router-link>
          <router-link
            to="/users/activity?bookmarkPage=1&userPostPage=1&repliedPostPage=1"
            class="text-white hover:text-blue-200 transition-colors font-medium py-2"
            @click="closeMobileMenu"
          >
            내 활동
          </router-link>
          <button
            @click="handleSignOut"
            class="text-white hover:text-blue-200 transition-colors font-medium py-2 text-left"
          >
            로그아웃
          </button>
          <button
            @click="openWithdrawModal"
            class="text-red-300 hover:text-red-100 transition-colors font-medium py-2 text-left"
          >
            회원탈퇴
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- 회원탈퇴 확인 모달 -->
  <div
    v-show="isWithdrawModalOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click="closeWithdrawModal"
  >
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="fixed inset-0 bg-black opacity-50"></div>
      <div class="relative bg-white rounded-lg max-w-md w-full p-6" @click.stop>
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">회원탈퇴</h3>
          <p class="text-gray-600 mb-6">정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
          <div class="flex space-x-4">
            <button @click="closeWithdrawModal" class="btn-secondary flex-1">취소</button>
            <button @click="handleWithdraw" class="btn-danger flex-1">탈퇴하기</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// 드롭다운 상태
const isDropdownOpen = ref(false)
const userDropdown = ref(null)

// 모바일 메뉴 상태
const isMobileMenuOpen = ref(false)

// 회원탈퇴 모달 상태
const isWithdrawModalOpen = ref(false)

// 사용자 이름 계산
const displayUserName = computed(() => {
  return authStore.user?.nickname || '사용자'
})

// 드롭다운 토글
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

// 드롭다운 닫기
const closeDropdown = () => {
  isDropdownOpen.value = false
}

// 모바일 메뉴 토글
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// 모바일 메뉴 닫기
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// 회원탈퇴 모달 열기
const openWithdrawModal = () => {
  isWithdrawModalOpen.value = true
  closeDropdown()
  closeMobileMenu()
}

// 회원탈퇴 모달 닫기
const closeWithdrawModal = () => {
  isWithdrawModalOpen.value = false
}

// 로그아웃 처리
const handleSignOut = async () => {
  if (confirm('로그아웃 하시겠습니까?')) {
    try {
      authStore.logout()
      await router.push('/signin')
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error)
    }
  }
  closeDropdown()
  closeMobileMenu()
}

// 회원탈퇴 처리
const handleWithdraw = async () => {
  try {
    // 실제 회원탈퇴 API 호출 구현 필요
    console.log('회원탈퇴 처리')
    closeWithdrawModal()
  } catch (error) {
    console.error('회원탈퇴 중 오류 발생:', error)
  }
}

// 외부 클릭 감지
const handleClickOutside = (event) => {
  if (userDropdown.value && !userDropdown.value.contains(event.target)) {
    closeDropdown()
  }
}

// ESC 키 감지
const handleEscKey = (event) => {
  if (event.key === 'Escape') {
    closeDropdown()
    closeMobileMenu()
    closeWithdrawModal()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscKey)
})
</script>

<style scoped>
/* Tailwind CSS 클래스를 사용하므로 추가 스타일링 불필요 */
</style>
