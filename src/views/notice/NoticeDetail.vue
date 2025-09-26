<template>
  <UserHeader />
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 메인 콘텐츠 -->
        <div class="lg:col-span-2">
          <!-- 공지사항 상세 -->
          <div class="bg-white rounded-lg shadow-lg mb-6">
            <div class="p-6">
              <!-- 공지사항 제목 -->
              <div class="mb-6">
                <h1 class="text-2xl font-bold text-gray-900 mb-2">
                  {{ notice.title }}
                </h1>
              </div>

              <!-- 공지사항 메타 정보 -->
              <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                  <span class="font-medium">{{ notice.authorNickname }}</span>
                  <span>조회 {{ notice.views }}</span>
                  <span>{{ formatDate(notice.createdAt) }}</span>
                  <span v-if="notice.modifiedAt" class="text-blue-500">
                    (수정됨: {{ formatDate(notice.modifiedAt) }})
                  </span>
                </div>

                <!-- 수정/삭제 버튼 -->
                <div v-if="canEdit" class="flex space-x-2">
                  <button
                    @click="editNotice"
                    class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    수정
                  </button>
                  <button
                    @click="handleDelete"
                    class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    삭제
                  </button>
                </div>
              </div>

              <!-- 공지사항 내용 -->
              <div class="prose max-w-none mb-6" v-html="notice.content"></div>
            </div>
          </div>
        </div>

        <!-- 사이드바 -->
        <div class="space-y-6">
          <!-- 검색 위젯 -->
          <SearchWidget :search-form="searchForm" @search="handleSearch" />

          <!-- 사이드 위젯 -->
          <SideWidget title="관련 공지사항">
            <div class="space-y-2">
              <p class="text-sm text-gray-500">관련 공지사항 기능은 추후 추가될 예정입니다.</p>
            </div>
          </SideWidget>
        </div>
      </div>
    </div>

    <ConfirmModal
      :show="showDeleteModal"
      title="공지사항 삭제"
      message="정말 삭제하시겠습니까?"
      confirm-text="삭제"
      :is-loading="isDeleteLoading"
      @confirm="confirmDelete"
      @cancel="closeDeleteModal"
    />
  </div>
  <UserFooter />
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getNoticeDetail, deleteNotice } from '@/api/notice'

import UserHeader from '@/components/common/UserHeader.vue'
import UserFooter from '@/components/common/UserFooter.vue'
import SearchWidget from '@/components/board/SearchWidget.vue'
import SideWidget from '@/components/board/SideWidget.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 공지사항 데이터
const notice = ref({})

// 상태 관리
const isLoading = ref(false)
const isDeleteLoading = ref(false)

// 모달 상태
const showDeleteModal = ref(false)

// 검색 폼
const searchForm = reactive({
  searchType: 'title',
  searchKeyword: '',
})

// 계산된 속성
const canEdit = computed(() => {
  return authStore.user && notice.value.authorId === authStore.user.id
})

// 데이터 로드
const loadNoticeDetail = async () => {
  isLoading.value = true
  try {
    const result = await getNoticeDetail(route.params.noticeId)
    if (result.success) {
      notice.value = result.data
    } else {
      alert('공지사항을 불러올 수 없습니다.')
      router.push('/notice')
    }
  } catch (error) {
    console.error('공지사항 로드 실패:', error)
    alert('공지사항을 불러오는 중 오류가 발생했습니다.')
    router.push('/notice')
  } finally {
    isLoading.value = false
  }
}

// 공지사항 수정
const editNotice = () => {
  router.push(`/notice/update/${notice.value.id}`)
}

// 공지사항 삭제
const handleDelete = () => {
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
}

const confirmDelete = async () => {
  isDeleteLoading.value = true
  try {
    const result = await deleteNotice(notice.value.id)
    if (result.success) {
      router.push('/notice')
    } else {
      alert(result.message || '공지사항 삭제 중 오류가 발생했습니다.')
    }
  } catch (error) {
    console.error('공지사항 삭제 실패:', error)
    alert('공지사항 삭제 중 오류가 발생했습니다.')
  } finally {
    isDeleteLoading.value = false
    showDeleteModal.value = false
  }
}

// 검색 처리
const handleSearch = (searchData) => {
  router.push({
    path: '/notice',
    query: {
      page: 1,
      searchType: searchData.searchType,
      searchKeyword: searchData.searchKeyword,
    },
  })
}

// 날짜 포맷팅
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR')
}

onMounted(loadNoticeDetail)
</script>

<style scoped>
.prose img {
  max-width: 100%;
  height: auto;
}

.prose pre {
  background: #2d3748;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
}

.prose code {
  background: #edf2f7;
  color: #4a5568;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.prose pre code {
  background: transparent;
  color: inherit;
  padding: 0;
}
</style>