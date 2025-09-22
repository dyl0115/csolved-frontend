<template>
  <UserHeader />
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-2xl mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow-lg">
        <!-- 헤더 -->
        <div class="px-6 py-4 border-b border-gray-200">
          <h1 class="text-xl font-semibold text-blue-600">내 프로필</h1>
        </div>

        <div class="p-6">
          <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
            <!-- 프로필 이미지 -->
            <div class="flex justify-center mb-6">
              <div class="relative">
                <!-- 프로필 이미지 표시 -->
                <img
                  :src="profileImageUrl"
                  alt="프로필 이미지"
                  class="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                />

                <!-- 카메라 아이콘 -->
                <label class="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                  <input
                    type="file"
                    class="hidden"
                    accept="image/*"
                    @change="handleImageSelect"
                    ref="fileInput"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </label>
              </div>
            </div>

            <!-- 닉네임 입력 -->
            <div class="mb-6">
              <label for="nickname" class="block text-sm font-medium text-gray-700 mb-2">
                닉네임
              </label>
              <input
                v-model="form.nickname"
                type="text"
                id="nickname"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.nickname }"
                placeholder="닉네임을 입력하세요"
                required
              />
              <p v-if="errors.nickname" class="mt-1 text-sm text-red-600">{{ errors.nickname }}</p>
            </div>

            <!-- 성공 메시지 -->
            <div v-if="showSuccessMessage" class="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm">프로필이 성공적으로 업데이트되었습니다!</p>
                </div>
              </div>
            </div>

            <!-- 제출 버튼 -->
            <div class="flex justify-center">
              <LoadingButton
                type="submit"
                :loading="isLoading"
                class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                수정하기
              </LoadingButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <UserFooter />
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import UserHeader from '@/components/common/UserHeader.vue'
import UserFooter from '@/components/common/UserFooter.vue'
import LoadingButton from '@/components/common/LoadingButton.vue'
import { updateProfile } from '@/api/user'

const router = useRouter()
const authStore = useAuthStore()

// 폼 데이터
const form = reactive({
  nickname: '',
  profileImage: null
})

// 상태 관리
const isLoading = ref(false)
const errors = reactive({})
const showSuccessMessage = ref(false)
const fileInput = ref(null)
const selectedImageUrl = ref('')

// 프로필 이미지 URL 계산
const profileImageUrl = computed(() => {
  if (selectedImageUrl.value) {
    return selectedImageUrl.value
  }
  if (form.currentProfileImage) {
    return form.currentProfileImage
  }
  return '/images/default-profile.png'
})

// 폼 유효성 검사
const validateForm = () => {
  const newErrors = {}

  if (!form.nickname || form.nickname.trim().length === 0) {
    newErrors.nickname = '닉네임을 입력해주세요.'
  } else if (form.nickname.trim().length < 2) {
    newErrors.nickname = '닉네임은 최소 2글자 이상이어야 합니다.'
  } else if (form.nickname.trim().length > 20) {
    newErrors.nickname = '닉네임은 20글자를 초과할 수 없습니다.'
  }

  // 특수문자 검사 (한글, 영문, 숫자만 허용)
  const nicknameRegex = /^[가-힣a-zA-Z0-9]+$/
  if (form.nickname.trim() && !nicknameRegex.test(form.nickname.trim())) {
    newErrors.nickname = '닉네임은 한글, 영문, 숫자만 사용할 수 있습니다.'
  }

  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
  Object.assign(errors, newErrors)

  return Object.keys(newErrors).length === 0
}

// 이미지 선택 처리
const handleImageSelect = (event) => {
  const file = event.target.files[0]

  if (!file) {
    return
  }

  // 파일 타입 검사
  if (!file.type.startsWith('image/')) {
    alert('이미지 파일만 업로드할 수 있습니다.')
    return
  }

  // 파일 크기 검사 (5MB 제한)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    alert('이미지 파일은 5MB 이하만 업로드할 수 있습니다.')
    return
  }

  // 이미지 미리보기
  const reader = new FileReader()
  reader.onload = (e) => {
    selectedImageUrl.value = e.target.result
  }
  reader.readAsDataURL(file)

  // 폼에 파일 저장
  form.profileImage = file
}

// 폼 제출
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true
  showSuccessMessage.value = false

  try {
    // FormData 객체 생성
    const formData = new FormData()
    formData.append('userId', authStore.user?.id)
    formData.append('nickname', form.nickname.trim())

    if (form.profileImage) {
      formData.append('profileImage', form.profileImage)
    }

    const result = await updateProfile(formData)

    if (result.success) {
      // 사용자 정보 업데이트
      if (result.data) {
        authStore.user = { ...authStore.user, ...result.data }
      }

      showSuccessMessage.value = true

      // 3초 후 메시지 숨김
      setTimeout(() => {
        showSuccessMessage.value = false
      }, 3000)

      // 파일 선택 초기화
      if (fileInput.value) {
        fileInput.value.value = ''
      }
      form.profileImage = null
      selectedImageUrl.value = ''
    } else {
      // 서버 에러 처리
      if (result.errors) {
        Object.assign(errors, result.errors)
      } else {
        alert(result.message || '프로필 수정 중 오류가 발생했습니다.')
      }
    }
  } catch (error) {
    console.error('프로필 수정 실패:', error)
    alert('프로필 수정 중 오류가 발생했습니다.')
  } finally {
    isLoading.value = false
  }
}

// 컴포넌트 마운트 시 사용자 정보 설정
onMounted(() => {
  if (authStore.user) {
    form.nickname = authStore.user.nickname || ''
    form.currentProfileImage = authStore.user.profileImage || null
  }
})
</script>

<style scoped>
/* 파일 입력 숨기기 */
input[type="file"] {
  display: none;
}

/* 프로필 이미지 호버 효과 */
.profile-image:hover + .camera-icon {
  transform: scale(1.1);
}

/* 트랜지션 효과 */
.camera-icon {
  transition: transform 0.2s ease-in-out;
}

/* 성공 메시지 애니메이션 */
@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.success-message {
  animation: fadeInOut 0.3s ease-out;
}
</style>