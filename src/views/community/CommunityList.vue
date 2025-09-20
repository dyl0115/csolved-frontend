<template>
  <div>
    <!-- 게시판 배너 -->
    <img
      src="../../assets/images/community-banner.svg"
      alt="커뮤니티 게시판"
      class="w-full max-h-[300px] min-h-[200px] object-cover"
    />

    <!-- 게시판 페이지 본문 -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 메인 콘텐츠 -->
        <div class="lg:col-span-2">
          <!-- 게시글이 없는 경우 -->
          <div v-if="posts.length === 0" class="bg-white rounded-lg shadow-md text-center p-8 my-8">
            <h5 class="text-xl font-bold mb-2">게시글이 없습니다</h5>
            <p class="text-gray-600 mb-4">첫 번째 글을 작성해보세요!</p>
            <router-link
              to="/community/create"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              글 작성하기
            </router-link>
          </div>

          <!-- 게시글이 있는 경우: 게시글 작성 버튼 -->
          <div v-if="posts.length > 0" class="flex justify-end mb-6">
            <router-link
              to="/community/create"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i class="bi bi-pencil-square mr-2"></i>
              게시글 작성하기
            </router-link>
          </div>

          <!-- 게시글 리스트 -->
          <div
            v-for="post in posts"
            :key="post.id"
            class="bg-white rounded-lg shadow-md mb-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            <router-link
              :to="`/community/${post.id}`"
              class="block p-6 text-gray-900 hover:text-gray-900"
            >
              <div>
                <!-- 제목 -->
                <h3 class="text-xl font-bold mb-3 truncate">
                  {{ post.title }}
                </h3>

                <!-- 태그 -->
                <div class="mb-4">
                  <span
                    v-for="tag in post.tags"
                    :key="tag.id"
                    class="inline-block bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded-full mr-2 mb-1"
                  >
                    {{ tag.name }}
                  </span>
                </div>

                <!-- 메타 정보 -->
                <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <!-- 카테고리 -->
                  <div class="flex items-center">
                    <i class="bi bi-journal-text mr-1"></i>
                    <span>{{ post.categoryName }}</span>
                  </div>

                  <!-- 댓글수 -->
                  <div class="flex items-center">
                    <i class="bi bi-chat-dots mr-1"></i>
                    <span>{{ post.answerCount }}</span>
                  </div>

                  <!-- 좋아요수 -->
                  <div class="flex items-center">
                    <i class="bi bi-heart-fill mr-1"></i>
                    <span>{{ post.likes }}</span>
                  </div>

                  <!-- 조회수 -->
                  <div class="flex items-center">
                    <i class="bi bi-eye mr-1"></i>
                    <span>{{ post.views }}</span>
                  </div>

                  <!-- 작성자 -->
                  <div class="flex items-center">
                    <i class="bi bi-person mr-1"></i>
                    <span>{{ post.anonymous ? '익명' : post.authorNickname }}</span>
                  </div>

                  <!-- 작성시간 -->
                  <div class="flex items-center">
                    <i class="bi bi-clock mr-1"></i>
                    <span>{{ formatTimeAgo(post.createdAt) }}</span>
                  </div>

                  <!-- 수정여부 -->
                  <div v-if="post.modifiedAt" class="flex items-center">
                    <i class="bi bi-pencil mr-1"></i>
                    <span>수정됨</span>
                  </div>
                </div>
              </div>
            </router-link>
          </div>

          <!-- 페이지네이션 -->
          <nav class="mt-8" aria-label="Pagination">
            <hr class="mb-6 border-gray-200" />
            <div class="flex items-center justify-center gap-4">
              <!-- 이전 페이지 -->
              <button
                v-if="pagination.currentPage > 1"
                @click="updatePage(pagination.currentPage - 1)"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                이전 페이지
              </button>
              <button
                v-else
                disabled
                class="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
              >
                이전 페이지
              </button>

              <!-- 페이지 입력 -->
              <div class="flex items-center gap-2">
                <input
                  type="text"
                  v-model="currentPageInput"
                  @keyup.enter="updatePage(currentPageInput)"
                  @blur="updatePage(currentPageInput)"
                  class="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :min="1"
                  :max="pagination.totalPage"
                />
                <span class="text-gray-500">/ {{ pagination.totalPage }}</span>
              </div>

              <!-- 다음 페이지 -->
              <button
                v-if="pagination.currentPage < pagination.totalPage"
                @click="updatePage(pagination.currentPage + 1)"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                다음 페이지
              </button>
              <button
                v-else
                disabled
                class="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
              >
                다음 페이지
              </button>
            </div>
          </nav>
        </div>

        <!-- 사이드바 -->
        <div class="space-y-6">
          <!-- 검색 위젯 -->
          <div class="bg-white rounded-lg shadow-md">
            <div class="px-4 py-3 border-b border-gray-200 font-semibold">검색</div>
            <div class="p-4">
              <form @submit.prevent="handleSearch">
                <div class="flex">
                  <!-- 검색 방식 선택 -->
                  <select
                    v-model="searchForm.searchType"
                    class="flex-shrink-0 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="title">제목</option>
                    <option value="author">글쓴이</option>
                  </select>

                  <!-- 검색창 -->
                  <input
                    v-model="searchForm.searchKeyword"
                    type="text"
                    placeholder="검색어를 입력하세요."
                    class="flex-1 px-3 py-2 border-t border-b border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />

                  <!-- 검색 버튼 -->
                  <button
                    type="submit"
                    class="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                  >
                    <i class="bi bi-search"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- 정렬 위젯 -->
          <div class="bg-white rounded-lg shadow-md">
            <div class="px-4 py-3 border-b border-gray-200 font-semibold">정렬</div>
            <div class="p-4">
              <select
                v-model="sortType"
                @change="handleSortChange"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="recent">최신순</option>
                <option value="views">조회수 많은 순</option>
                <option value="answers">댓글 많은 순</option>
                <option value="likes">좋아요 많은 순</option>
              </select>
            </div>
          </div>

          <!-- 카테고리 위젯 -->
          <div class="bg-white rounded-lg shadow-md">
            <div class="px-4 py-3 border-b border-gray-200 font-semibold">카테고리</div>
            <div class="p-4">
              <ul class="space-y-2">
                <li v-for="category in categories" :key="category.id">
                  <button
                    @click="handleCategoryFilter(category.id)"
                    class="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    {{ category.name }}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <!-- 사이드 위젯 -->
          <div class="bg-white rounded-lg shadow-md">
            <div class="px-4 py-3 border-b border-gray-200 font-semibold">사이드 위젯</div>
            <div class="p-4 text-gray-600">이후 기능 추가...</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommunityList',
  data() {
    return {
      posts: [],
      categories: [],
      pagination: {
        currentPage: 1,
        totalPage: 1,
      },
      currentPageInput: 1,
      searchForm: {
        searchType: 'title',
        searchKeyword: '',
      },
      sortType: 'recent',
      loading: false,
    }
  },
  async mounted() {
    await this.loadData()
    this.initializeFromQuery()
  },
  watch: {
    '$route.query': {
      handler() {
        this.loadData()
      },
      deep: true,
    },
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        const params = {
          page: this.$route.query.page || 1,
          searchType: this.$route.query.searchType,
          searchKeyword: this.$route.query.searchKeyword,
          sortType: this.$route.query.sortType || 'recent',
          filterType: this.$route.query.filterType,
          filterValue: this.$route.query.filterValue,
        }

        // API 호출 (실제 API 엔드포인트에 맞게 수정)
        const response = await this.$api.get('/communities', { params })

        this.posts = response.data.posts
        this.categories = response.data.categories
        this.pagination = response.data.page
        this.currentPageInput = this.pagination.currentPage
      } catch (error) {
        console.error('데이터 로딩 실패:', error)
        this.$toast.error('데이터를 불러오는데 실패했습니다.')
      } finally {
        this.loading = false
      }
    },

    initializeFromQuery() {
      const query = this.$route.query
      this.searchForm.searchType = query.searchType || 'title'
      this.searchForm.searchKeyword = query.searchKeyword || ''
      this.sortType = query.sortType || 'recent'
    },

    updatePage(page) {
      const pageNum = parseInt(page)
      if (pageNum >= 1 && pageNum <= this.pagination.totalPage) {
        this.$router.push({
          query: {
            ...this.$route.query,
            page: pageNum,
          },
        })
      }
    },

    handleSearch() {
      this.$router.push({
        query: {
          ...this.$route.query,
          page: 1,
          searchType: this.searchForm.searchType,
          searchKeyword: this.searchForm.searchKeyword,
        },
      })
    },

    handleSortChange() {
      this.$router.push({
        query: {
          ...this.$route.query,
          page: 1,
          sortType: this.sortType,
        },
      })
    },

    handleCategoryFilter(categoryId) {
      this.$router.push({
        query: {
          page: 1,
          filterType: 'CATEGORY',
          filterValue: categoryId,
        },
      })
    },

    formatTimeAgo(dateString) {
      // 시간 포맷팅 유틸리티 함수
      const now = new Date()
      const date = new Date(dateString)
      const diff = now - date

      const minutes = Math.floor(diff / (1000 * 60))
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))

      if (minutes < 60) {
        return `${minutes}분 전`
      } else if (hours < 24) {
        return `${hours}시간 전`
      } else if (days < 30) {
        return `${days}일 전`
      } else {
        return date.toLocaleDateString('ko-KR')
      }
    },
  },
}
</script>

<style scoped>
/* 커스텀 스타일이 필요한 경우에만 사용 */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
