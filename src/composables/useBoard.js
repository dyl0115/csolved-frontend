import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { API_BASE_URL, API_ENDPOINTS, RESPONSE_CODES } from '@/utils/constants'
import axios from 'axios'

export function useBoard(apiEndpoint = '/api/posts') {
  const route = useRoute()
  const router = useRouter()

  // 상태 관리
  const posts = ref([])
  const categories = ref([])
  const popularPosts = ref([])
  const techStacks = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // 페이지네이션
  const pagination = reactive({
    currentPage: 1,
    totalPage: 1,
    totalCount: 0,
    pageSize: 20,
  })

  // 검색 폼
  const searchForm = reactive({
    searchKeyword: '',
    searchType: 'title',
    searchOptions: [
      { value: 'title', label: '제목' },
      { value: 'author', label: '작성자' },
    ],
  })

  // 정렬 타입
  const sortType = ref('recent')
  const sortOptions = ref([
    { value: 'recent', label: '최신순', icon: 'bi bi-clock' },
    { value: 'views', label: '조회순', icon: 'bi bi-eye' },
    { value: 'likes', label: '좋아요순', icon: 'bi bi-fire' },
    { value: 'answers', label: '댓글많은순', icon: 'bi bi-chat-dots' },
  ])

  // 선택된 카테고리
  const selectedCategory = ref(null)

  // API 호출
  const loadData = async () => {
    if (isLoading.value) return

    isLoading.value = true
    error.value = null

    try {
      const params = new URLSearchParams()

      // 쿼리 파라미터에서 값 가져오기
      if (route.query.page) params.append('page', route.query.page)
      if (route.query.searchKeyword) params.append('searchKeyword', route.query.searchKeyword)
      if (route.query.searchType) params.append('searchType', route.query.searchType)
      if (route.query.sortType) params.append('sortType', route.query.sortType)
      if (route.query.filterType && route.query.filterValue) {
        params.append('filterType', route.query.filterType)
        params.append('filterValue', route.query.filterValue)
      }

      // 현재 상태를 쿼리에서 업데이트
      updateStateFromQuery()

      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.POST.LIST}?${params}`)

      if (response.data) {
        posts.value = response.data.posts || []

        // 페이지네이션 정보 업데이트
        if (response.data.pagination) {
          Object.assign(pagination, response.data.pagination)
        }

        // 인기 게시글 (사이드바용)
        if (response.data.popularPosts) {
          popularPosts.value = response.data.popularPosts
        }

        // 기술 스택 (프로젝트용)
        if (response.data.techStacks) {
          techStacks.value = response.data.techStacks
        }
      }

      // 카테고리 정보 별도 로드 (첫 로드시에만)
      if (categories.value.length === 0) {
        await loadCategories()
      }
    } catch (err) {
      error.value = err.response?.data?.message || '데이터를 불러오는데 실패했습니다.'
      console.error('Board data loading error:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 카테고리 로드
  const loadCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categories`)
      if (response.data && response.data.categories) {
        categories.value = response.data.categories
      }
    } catch (err) {
      console.error('Categories loading error:', err)
    }
  }

  // 무한 스크롤용 추가 로드
  const loadMore = async () => {
    if (pagination.currentPage >= pagination.totalPage) return

    pagination.currentPage += 1
    await updateQuery({ page: pagination.currentPage })

    // 기존 게시글에 추가
    const currentPosts = [...posts.value]
    await loadData()
    posts.value = [...currentPosts, ...posts.value]
  }

  // 쿼리에서 상태 업데이트
  const updateStateFromQuery = () => {
    pagination.currentPage = parseInt(route.query.page) || 1
    searchForm.searchKeyword = route.query.searchKeyword || ''
    searchForm.searchType = route.query.searchType || 'title'
    sortType.value = route.query.sortType || 'recent'

    // filterType이 category인 경우 selectedCategory 설정
    if (route.query.filterType === 'category' && route.query.filterValue) {
      selectedCategory.value = route.query.filterValue
    } else {
      selectedCategory.value = null
    }
  }

  // URL 쿼리 업데이트
  const updateQuery = async (newQuery) => {
    const query = { ...route.query, ...newQuery }

    // 기본값이면 쿼리에서 제거
    if (query.page === 1) delete query.page
    if (!query.searchKeyword) {
      delete query.searchKeyword
      delete query.searchType
    }
    if (query.searchType === 'title' && !query.searchKeyword) delete query.searchType
    if (query.sortType === 'recent') delete query.sortType
    if (!query.filterValue) {
      delete query.filterType
      delete query.filterValue
    }

    await router.push({ query })
  }

  // 페이지 변경
  const updatePage = async (page) => {
    await updateQuery({ page })
  }

  // 검색 처리
  const handleSearch = async (searchData) => {
    await updateQuery({
      searchKeyword: searchData.searchKeyword,
      searchType: searchData.searchType,
      page: 1,
    })
  }

  // 정렬 변경
  const handleSortChange = async (sortType) => {
    await updateQuery({ sortType, page: 1 })
  }

  // 카테고리 필터
  const handleCategoryFilter = async (categoryId) => {
    if (categoryId) {
      await updateQuery({
        filterType: 'category',
        filterValue: categoryId,
        page: 1
      })
    } else {
      // 카테고리 필터 제거
      await updateQuery({
        filterType: null,
        filterValue: null,
        page: 1
      })
    }
  }

  // 기술 스택 필터 (프로젝트용)
  const handleTechStackFilter = async (techStack) => {
    await updateQuery({ techStack, page: 1 })
  }

  // 계산된 속성들
  const hasData = computed(() => posts.value.length > 0)
  const hasPagination = computed(() => pagination.totalPage > 1)
  const currentSortOption = computed(() =>
    sortOptions.value.find((option) => option.value === sortType.value),
  )

  return {
    // 상태
    posts,
    categories,
    popularPosts,
    techStacks,
    isLoading,
    error,
    pagination,
    searchForm,
    sortType,
    sortOptions,
    selectedCategory,

    // 계산된 속성
    hasData,
    hasPagination,
    currentSortOption,

    // 메서드
    loadData,
    loadMore,
    updatePage,
    handleSearch,
    handleSortChange,
    handleCategoryFilter,
    handleTechStackFilter,
    updateQuery,
  }
}
