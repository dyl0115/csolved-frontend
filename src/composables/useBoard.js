import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
    pageSize: 20
  })

  // 검색 폼
  const searchForm = reactive({
    query: '',
    searchType: 'title',
    searchOptions: [
      { value: 'title', label: '제목' },
      { value: 'content', label: '내용' },
      { value: 'author', label: '작성자' }
    ]
  })

  // 정렬 타입
  const sortType = ref('recent')
  const sortOptions = ref([
    { value: 'recent', label: '최신순', icon: 'bi bi-clock' },
    { value: 'popular', label: '인기순', icon: 'bi bi-fire' },
    { value: 'views', label: '조회순', icon: 'bi bi-eye' },
    { value: 'comments', label: '댓글순', icon: 'bi bi-chat-dots' }
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
      if (route.query.search) params.append('search', route.query.search)
      if (route.query.searchType) params.append('searchType', route.query.searchType)
      if (route.query.sort) params.append('sort', route.query.sort)
      if (route.query.category) params.append('category', route.query.category)

      // 현재 상태를 쿼리에서 업데이트
      updateStateFromQuery()

      const response = await axios.get(`${apiEndpoint}?${params}`)

      if (response.data.success) {
        posts.value = response.data.data.posts || []

        // 페이지네이션 정보 업데이트
        if (response.data.data.pagination) {
          Object.assign(pagination, response.data.data.pagination)
        }

        // 카테고리 정보 (첫 로드시에만)
        if (response.data.data.categories && categories.value.length === 0) {
          categories.value = response.data.data.categories
        }

        // 인기 게시글 (사이드바용)
        if (response.data.data.popularPosts) {
          popularPosts.value = response.data.data.popularPosts
        }

        // 기술 스택 (프로젝트용)
        if (response.data.data.techStacks) {
          techStacks.value = response.data.data.techStacks
        }
      }
    } catch (err) {
      error.value = err.response?.data?.message || '데이터를 불러오는데 실패했습니다.'
      console.error('Board data loading error:', err)
    } finally {
      isLoading.value = false
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
    searchForm.query = route.query.search || ''
    searchForm.searchType = route.query.searchType || 'title'
    sortType.value = route.query.sort || 'recent'
    selectedCategory.value = route.query.category || null
  }

  // URL 쿼리 업데이트
  const updateQuery = async (newQuery) => {
    const query = { ...route.query, ...newQuery }

    // 기본값이면 쿼리에서 제거
    if (query.page === 1) delete query.page
    if (!query.search) delete query.search
    if (query.searchType === 'title') delete query.searchType
    if (query.sort === 'recent') delete query.sort
    if (!query.category) delete query.category

    await router.push({ query })
  }

  // 페이지 변경
  const updatePage = async (page) => {
    await updateQuery({ page })
  }

  // 검색 처리
  const handleSearch = async (searchData) => {
    await updateQuery({
      search: searchData.query,
      searchType: searchData.searchType,
      page: 1
    })
  }

  // 정렬 변경
  const handleSortChange = async (sort) => {
    await updateQuery({ sort, page: 1 })
  }

  // 카테고리 필터
  const handleCategoryFilter = async (categoryId) => {
    await updateQuery({ category: categoryId, page: 1 })
  }

  // 기술 스택 필터 (프로젝트용)
  const handleTechStackFilter = async (techStack) => {
    await updateQuery({ techStack, page: 1 })
  }

  // 계산된 속성들
  const hasData = computed(() => posts.value.length > 0)
  const hasPagination = computed(() => pagination.totalPage > 1)
  const currentSortOption = computed(() =>
    sortOptions.value.find(option => option.value === sortType.value)
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
    updateQuery
  }
}