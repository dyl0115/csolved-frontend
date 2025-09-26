<template>
  <UserHeader />
  <div>
    <!-- 게시판 배너 -->
    <BoardBanner
      :image-src="noticeBannerImage"
      alt-text=""
      title="공지사항"
      description="중요한 공지사항을 확인하세요"
      variant="primary"
    />

    <!-- 게시판 페이지 본문 -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 메인 콘텐츠 -->
        <div class="lg:col-span-2">
          <!-- 빈 게시판 -->
          <EmptyBoard
            v-if="notices.length === 0"
            :create-url="isAdmin ? '/notice/create' : ''"
            title="아직 공지사항이 없어요"
            message="공지사항이 등록되면 여기에 표시됩니다"
            :button-text="isAdmin ? '공지사항 작성하기' : ''"
            icon="📢"
          />

          <!-- 글 작성 버튼 (admin만) -->
          <CreateButton
            v-if="notices.length > 0 && isAdmin"
            create-url="/notice/create"
            button-text="공지사항 작성하기"
          />

          <!-- 공지사항 리스트 -->
          <div class="space-y-4">
            <div
              v-for="notice in notices"
              :key="notice.id"
              class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              @click="goToDetail(notice.id)"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="text-lg font-medium text-gray-900 mb-2">
                    {{ notice.title }}
                  </h3>
                  <div class="flex items-center text-sm text-gray-500 space-x-4">
                    <span>{{ notice.authorNickname }}</span>
                    <span>조회 {{ notice.views }}</span>
                    <span>{{ formatDate(notice.createdAt) }}</span>
                    <span v-if="notice.modifiedAt" class="text-blue-500">
                      (수정됨: {{ formatDate(notice.modifiedAt) }})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 페이지네이션 -->
          <Pagination :pagination="pagination" type="input" @page-change="updatePage" />
        </div>

        <!-- 사이드바 -->
        <div class="space-y-6">
          <!-- 검색 위젯 -->
          <SearchWidget :search-form="searchForm" @search="handleSearch" />

          <!-- 최근 공지사항 위젯 -->
          <SideWidget title="최근 공지사항">
            <div class="space-y-2">
              <div v-for="notice in recentNotices" :key="notice.id" class="border-b pb-2 last:border-0">
                <router-link
                  :to="`/notice/${notice.id}`"
                  class="text-sm text-blue-600 hover:underline"
                >
                  {{ notice.title }}
                </router-link>
                <div class="text-xs text-gray-500 mt-1">
                  👁️ {{ notice.views }} · {{ formatDate(notice.createdAt) }}
                </div>
              </div>
            </div>
          </SideWidget>
        </div>
      </div>
    </div>
  </div>
  <UserFooter />
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getNotices } from '@/api/notice'

// 이미지 경로
const noticeBannerImage = '/images/notice-banner.svg'

// 컴포넌트 imports
import UserHeader from '@/components/common/UserHeader.vue'
import UserFooter from '@/components/common/UserFooter.vue'
import BoardBanner from '@/components/board/BoardBanner.vue'
import EmptyBoard from '@/components/board/EmptyBoard.vue'
import CreateButton from '@/components/board/CreateButton.vue'
import Pagination from '@/components/common/BasicPagination.vue'
import SearchWidget from '@/components/board/SearchWidget.vue'
import SideWidget from '@/components/board/SideWidget.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 상태 관리
const notices = ref([])
const pagination = ref({
  currentPage: 1,
  totalPage: 1,
  offset: 0,
  size: 10
})
const isLoading = ref(false)

// 검색 폼
const searchForm = reactive({
  searchType: 'title',
  searchKeyword: '',
})

// URL 쿼리에서 초기 검색 조건 설정
const initializeSearchFromQuery = () => {
  const query = route.query
  if (query.searchType && query.searchKeyword) {
    searchForm.searchType = query.searchType
    searchForm.searchKeyword = query.searchKeyword
  }
  if (query.page) {
    pagination.value.currentPage = parseInt(query.page) || 1
  }
}


// 최근 공지사항 (상위 5개)
const recentNotices = computed(() => {
  return notices.value.slice(0, 5)
})

// admin 권한 체크
const isAdmin = computed(() => {
  return authStore.user?.admin === true
})

// 데이터 로드
const loadData = async (page = 1) => {
  isLoading.value = true
  try {
    const params = {
      page,
      searchType: searchForm.searchType,
      searchKeyword: searchForm.searchKeyword
    }

    // 빈 검색어는 제외
    if (!params.searchKeyword) {
      delete params.searchType
      delete params.searchKeyword
    }

    const result = await getNotices(params)
    if (result.success) {
      notices.value = result.data.notices || []
      pagination.value = result.data.pagination || pagination.value
    } else {
      console.error('공지사항 로드 실패:', result.message)
      alert('공지사항을 불러올 수 없습니다.')
    }
  } catch (error) {
    console.error('공지사항 로드 실패:', error)
    alert('공지사항을 불러오는 중 오류가 발생했습니다.')
  } finally {
    isLoading.value = false
  }
}

// 페이지 변경
const updatePage = (page) => {
  pagination.value.currentPage = page

  // URL 업데이트
  const query = { ...route.query, page }
  router.push({ path: route.path, query })
}

// 검색 처리
const handleSearch = (searchData) => {
  searchForm.searchType = searchData.searchType
  searchForm.searchKeyword = searchData.searchKeyword
  pagination.value.currentPage = 1

  // URL 업데이트
  const query = {
    page: 1,
    searchType: searchData.searchType,
    searchKeyword: searchData.searchKeyword
  }

  // 빈 검색어인 경우 searchType, searchKeyword 제거
  if (!searchData.searchKeyword) {
    delete query.searchType
    delete query.searchKeyword
  }

  router.push({ path: route.path, query })
}


// 상세 페이지로 이동
const goToDetail = (noticeId) => {
  router.push(`/notice/${noticeId}`)
}

// 날짜 포맷팅
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR')
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  initializeSearchFromQuery()
  loadData(pagination.value.currentPage)
})

// URL 쿼리 변경 감지하여 데이터 재로드
watch(() => route.query, () => {
  initializeSearchFromQuery()
  loadData(pagination.value.currentPage)
}, { deep: true })
</script>

<style scoped>
/* 컴포넌트별 커스텀 스타일 */
</style>