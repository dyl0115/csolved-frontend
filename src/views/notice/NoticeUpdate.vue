<template>
  <UserHeader />
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <NoticeForm
        :form="form"
        :errors="errors"
        :is-loading="isLoading"
        :is-edit="true"
        @update:form="form = $event"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
  </div>
  <UserFooter />
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getNoticeDetail, updateNotice } from '@/api/notice'

import UserHeader from '@/components/common/UserHeader.vue'
import UserFooter from '@/components/common/UserFooter.vue'
import NoticeForm from '@/components/notice/NoticeForm.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 폼 데이터
const form = reactive({
  title: '',
  content: '',
  authorId: null,
  isPinned: false
})

// 에러 및 로딩 상태
const errors = reactive({})
const isLoading = ref(false)
const isFormLoading = ref(false)

// 기존 데이터 로드
const loadNoticeData = async () => {
  isFormLoading.value = true
  try {
    const result = await getNoticeDetail(route.params.noticeId)
    if (result.success) {
      const notice = result.data

      // 권한 확인
      if (authStore.user?.id !== notice.authorId) {
        alert('수정 권한이 없습니다.')
        router.push('/notice')
        return
      }

      // 폼 데이터 설정
      form.title = notice.title
      form.content = notice.content
      form.authorId = notice.authorId
      form.isPinned = notice.isPinned || false
    } else {
      alert('공지사항을 불러올 수 없습니다.')
      router.push('/notice')
    }
  } catch (error) {
    console.error('공지사항 로드 실패:', error)
    alert('공지사항을 불러오는 중 오류가 발생했습니다.')
    router.push('/notice')
  } finally {
    isFormLoading.value = false
  }
}

// 폼 제출
const handleSubmit = async () => {
  // 에러 초기화
  Object.keys(errors).forEach(key => delete errors[key])

  // 유효성 검사
  if (!form.title.trim()) {
    errors.title = '제목을 입력해주세요.'
    return
  }

  if (!form.content.trim()) {
    errors.content = '내용을 입력해주세요.'
    return
  }

  isLoading.value = true

  try {
    const result = await updateNotice(route.params.noticeId, {
      title: form.title,
      content: form.content,
      authorId: form.authorId,
      isPinned: form.isPinned
    })

    if (result.success) {
      router.push(`/notice/${route.params.noticeId}`)
    } else {
      if (result.errors) {
        Object.assign(errors, result.errors)
      } else {
        alert(result.message || '공지사항 수정 중 오류가 발생했습니다.')
      }
    }
  } catch (error) {
    console.error('공지사항 수정 실패:', error)
    alert('공지사항 수정 중 오류가 발생했습니다.')
  } finally {
    isLoading.value = false
  }
}

// 취소 처리
const handleCancel = () => {
  if (confirm('수정을 취소하시겠습니까? 변경한 내용이 모두 사라집니다.')) {
    router.push(`/notice/${route.params.noticeId}`)
  }
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(loadNoticeData)
</script>

<style scoped>
/* 컴포넌트별 커스텀 스타일 */
</style>