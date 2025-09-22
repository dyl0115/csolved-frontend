<template>
  <UserHeader />
  <div class="min-h-screen bg-gray-50">
    <!-- 메인 컨텐츠 -->
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow-lg">
        <div class="bg-gray-800 text-white px-6 py-4 rounded-t-lg">
          <h1 class="text-xl font-semibold mb-0">글 작성하기</h1>
        </div>

        <div class="p-6">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- 카테고리 선택 -->
            <div>
              <label for="categoryId" class="block text-sm font-medium text-gray-700 mb-2">
                카테고리
              </label>
              <select
                v-model="form.categoryId"
                id="categoryId"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.categoryId }"
                required
              >
                <option value="">카테고리를 선택하세요</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
              <p v-if="errors.categoryId" class="mt-1 text-sm text-red-600">
                {{ errors.categoryId }}
              </p>
            </div>

            <!-- 제목 입력 -->
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2"> 제목 </label>
              <input
                v-model="form.title"
                type="text"
                id="title"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.title }"
                placeholder="제목을 입력하세요"
                required
              />
              <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
            </div>

            <!-- 익명/실명 토글 -->
            <div class="flex items-center">
              <input
                v-model="form.anonymous"
                type="checkbox"
                id="anonymousToggle"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="anonymousToggle" class="ml-2 text-sm text-gray-700">
                익명으로 작성
              </label>
            </div>

            <!-- 태그 -->
            <div>
              <label for="tag-input" class="block text-sm font-medium text-gray-700 mb-2">
                태그
              </label>
              <div
                class="min-h-[42px] px-3 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent flex flex-wrap items-center gap-2"
                :class="{ 'border-red-500': errors.tags }"
              >
                <!-- 태그 목록 -->
                <span
                  v-for="(tag, index) in tags"
                  :key="index"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {{ tag }}
                  <button
                    type="button"
                    @click="removeTag(index)"
                    class="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>

                <!-- 태그 입력 -->
                <input
                  v-model="tagInput"
                  type="text"
                  id="tag-input"
                  class="flex-1 min-w-0 outline-none border-0 p-0 text-sm"
                  placeholder="태그를 입력하고 스페이스/엔터를 누르세요"
                  @keydown.enter.prevent="addTag"
                  @keydown.space.prevent="addTag"
                />
              </div>
              <p v-if="errors.tags" class="mt-1 text-sm text-red-600">{{ errors.tags }}</p>
            </div>

            <!-- 게시글 내용 -->
            <div>
              <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
                내용
              </label>
              <div ref="editorContainer" class="border border-gray-300 rounded-md">
                <textarea
                  v-model="form.content"
                  id="content"
                  class="w-full px-3 py-2 border-0 rounded-md resize-none focus:outline-none"
                  :class="{ 'border-red-500': errors.content }"
                  placeholder="내용을 입력하세요"
                  rows="15"
                  required
                ></textarea>
              </div>
              <p v-if="errors.content" class="mt-1 text-sm text-red-600">{{ errors.content }}</p>
            </div>

            <!-- 버튼 그룹 -->
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="handleCancel"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                취소
              </button>
              <LoadingButton
                type="submit"
                :loading="isLoading"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                작성완료
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
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import UserHeader from '@/components/common/UserHeader.vue'
import UserFooter from '@/components/common/UserFooter.vue'
import LoadingButton from '@/components/common/LoadingButton.vue'
// import { createCommunityPost, getCategories } from '@/api/community'

const router = useRouter()
const authStore = useAuthStore()

// 폼 데이터
const form = reactive({
  categoryId: '',
  title: '',
  content: '',
  anonymous: false,
})

// 태그 관련
const tags = ref([])
const tagInput = ref('')

// 카테고리 목록
const categories = ref([])

// 상태 관리
const isLoading = ref(false)
const errors = reactive({})
const editorContainer = ref(null)

// 폼 유효성 검사
const validateForm = () => {
  const newErrors = {}

  if (!form.categoryId) {
    newErrors.categoryId = '카테고리를 선택해주세요.'
  }

  if (!form.title || form.title.trim().length === 0) {
    newErrors.title = '제목을 입력해주세요.'
  } else if (form.title.trim().length < 2) {
    newErrors.title = '제목은 최소 2글자 이상이어야 합니다.'
  } else if (form.title.trim().length > 100) {
    newErrors.title = '제목은 100글자를 초과할 수 없습니다.'
  }

  if (!form.content || form.content.trim().length === 0) {
    newErrors.content = '내용을 입력해주세요.'
  } else if (form.content.trim().length < 10) {
    newErrors.content = '내용은 최소 10글자 이상이어야 합니다.'
  }

  if (tags.value.length > 5) {
    newErrors.tags = '태그는 최대 5개까지 입력할 수 있습니다.'
  }

  Object.keys(errors).forEach((key) => {
    delete errors[key]
  })
  Object.assign(errors, newErrors)

  return Object.keys(newErrors).length === 0
}

// 태그 추가
const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !tags.value.includes(tag) && tags.value.length < 5) {
    tags.value.push(tag)
    tagInput.value = ''
  }
}

// 태그 제거
const removeTag = (index) => {
  tags.value.splice(index, 1)
}

// 폼 제출
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    const postData = {
      ...form,
      tags: tags.value.join(','),
      authorId: authStore.user?.id,
    }

    const result = await createCommunityPost(postData)

    if (result.success) {
      // 성공 시 커뮤니티 목록으로 이동
      await router.push('/communities?page=1')
    } else {
      // 서버 에러 처리
      if (result.errors) {
        Object.assign(errors, result.errors)
      } else {
        alert(result.message || '글 작성 중 오류가 발생했습니다.')
      }
    }
  } catch (error) {
    console.error('글 작성 실패:', error)
    alert('글 작성 중 오류가 발생했습니다.')
  } finally {
    isLoading.value = false
  }
}

// 취소 처리
const handleCancel = () => {
  if (form.title || form.content || tags.value.length > 0) {
    if (confirm('작성 중인 내용이 있습니다. 정말 취소하시겠습니까?')) {
      router.go(-1)
    }
  } else {
    router.go(-1)
  }
}

// 카테고리 목록 로드
const loadCategories = async () => {
  try {
    const result = await getCategories()
    if (result.success) {
      categories.value = result.data
    }
  } catch (error) {
    console.error('카테고리 로드 실패:', error)
  }
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
/* 에디터 컨테이너 스타일 */
.large-editor {
  min-height: 400px;
}

/* 태그 입력 필드 포커스 스타일 */
.focus-within\:ring-2:focus-within {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
    var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width))
    var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus-within\:ring-blue-500:focus-within {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity));
}

.focus-within\:border-transparent:focus-within {
  border-color: transparent;
}
</style>
