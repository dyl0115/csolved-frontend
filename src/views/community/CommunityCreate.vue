<template>
  <UserHeader />
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <CommunityForm
        :form="form"
        :categories="categories"
        :tags="tags"
        :tag-input="tagInput"
        :errors="errors"
        :is-loading="isLoading"
        @update:form="updateForm"
        @update:tag-input="tagInput = $event"
        @add-tag="addTag"
        @remove-tag="removeTag"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
  </div>
  <UserFooter />
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import UserHeader from '@/components/common/UserHeader.vue'
import UserFooter from '@/components/common/UserFooter.vue'
import CommunityForm from '@/components/community/CommunityForm.vue'
import { createCommunityPost, getCategories } from '@/api/community'

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

// 폼 업데이트
const updateForm = (newForm) => {
  Object.assign(form, newForm)
}

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
      categories.value = result.data.categories
    }
  } catch (error) {
    console.error('카테고리 로드 실패:', error)
  }
}

onMounted(() => {
  loadCategories()
})
</script>
