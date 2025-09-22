<template>
  <UserHeader />
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- 페이지 헤더 -->
      <div class="bg-white rounded-lg shadow-lg mb-6">
        <div class="p-6 border-b border-gray-200">
          <h1 class="text-2xl font-bold text-gray-900">내 활동</h1>
          <p class="text-gray-600 mt-1">
            내가 작성한 글, 북마크한 글, 댓글 단 글을 확인할 수 있습니다.
          </p>
        </div>

        <!-- 탭 내비게이션 -->
        <div class="px-6">
          <nav class="flex space-x-8" aria-label="Tabs">
            <button
              @click="activeTab = 'bookmarks'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'bookmarks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
            >
              북마크 ({{ bookmarkPosts.length }})
            </button>
            <button
              @click="activeTab = 'posts'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'posts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
            >
              내가 쓴 글 ({{ userPosts.length }})
            </button>
            <button
              @click="activeTab = 'replies'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'replies'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
            >
              댓글 단 글 ({{ repliedPosts.length }})
            </button>
          </nav>
        </div>
      </div>

      <!-- 탭 컨텐츠 -->
      <div class="bg-white rounded-lg shadow-lg">
        <div class="p-6">
          <!-- 북마크한 글 -->
          <div v-if="activeTab === 'bookmarks'">
            <div v-if="isBookmarkLoading" class="flex justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
            <div v-else-if="bookmarkPosts.length === 0" class="text-center py-12">
              <div class="text-gray-400 text-6xl mb-4">🔖</div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">북마크한 글이 없습니다</h3>
              <p class="text-gray-500">관심 있는 글을 북마크해보세요!</p>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="post in bookmarkPosts"
                :key="post.id"
                class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                      <span
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {{ post.categoryName }}
                      </span>
                      <span class="text-xs text-gray-500">{{ formatTimeAgo(post.createdAt) }}</span>
                    </div>
                    <router-link
                      :to="`/community/${post.id}`"
                      class="text-lg font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
                    >
                      {{ post.title }}
                    </router-link>
                    <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span class="flex items-center">
                        <i class="bi bi-person mr-1"></i>
                        {{ post.anonymous ? '익명' : post.authorNickname }}
                      </span>
                      <span class="flex items-center">
                        <i class="bi bi-eye mr-1"></i>
                        {{ post.views }}
                      </span>
                      <span class="flex items-center">
                        <i class="bi bi-chat-left mr-1"></i>
                        {{ post.answerCount || 0 }}
                      </span>
                      <span class="flex items-center">
                        <i class="bi bi-heart mr-1"></i>
                        {{ post.likes || 0 }}
                      </span>
                    </div>
                  </div>
                  <button
                    @click="handleBookmarkToggle(post.id, 'bookmarks')"
                    class="ml-4 text-green-600 hover:text-green-800"
                  >
                    <i class="bi bi-bookmark-x-fill text-lg"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- 북마크 페이지네이션 -->
            <div v-if="bookmarkPagination.totalPages > 1" class="mt-6">
              <BasicPagination
                :pagination="bookmarkPagination"
                @page-change="(page) => updatePage(page, 'bookmarks')"
              />
            </div>
          </div>

          <!-- 내가 쓴 글 -->
          <div v-if="activeTab === 'posts'">
            <div v-if="isUserPostLoading" class="flex justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
            <div v-else-if="userPosts.length === 0" class="text-center py-12">
              <div class="text-gray-400 text-6xl mb-4">📝</div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">작성한 글이 없습니다</h3>
              <p class="text-gray-500">첫 번째 글을 작성해보세요!</p>
              <router-link
                to="/community/create"
                class="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                글 작성하기
              </router-link>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="post in userPosts"
                :key="post.id"
                class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                      <span
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {{ post.categoryName }}
                      </span>
                      <span class="text-xs text-gray-500">{{ formatTimeAgo(post.createdAt) }}</span>
                      <span v-if="post.modifiedAt" class="text-xs text-yellow-600">수정됨</span>
                    </div>
                    <router-link
                      :to="`/community/${post.id}`"
                      class="text-lg font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
                    >
                      {{ post.title }}
                    </router-link>
                    <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span class="flex items-center">
                        <i class="bi bi-eye mr-1"></i>
                        {{ post.views }}
                      </span>
                      <span class="flex items-center">
                        <i class="bi bi-chat-left mr-1"></i>
                        {{ post.answerCount || 0 }}
                      </span>
                      <span class="flex items-center">
                        <i class="bi bi-heart mr-1"></i>
                        {{ post.likes || 0 }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2 ml-4">
                    <router-link
                      :to="`/community/${post.id}/update`"
                      class="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      수정
                    </router-link>
                    <button
                      @click="handlePostDelete(post.id)"
                      class="text-red-600 hover:text-red-800 text-sm"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 내 글 페이지네이션 -->
            <div v-if="userPostPagination.totalPages > 1" class="mt-6">
              <BasicPagination
                :pagination="userPostPagination"
                @page-change="(page) => updatePage(page, 'posts')"
              />
            </div>
          </div>

          <!-- 댓글 단 글 -->
          <div v-if="activeTab === 'replies'">
            <div v-if="isRepliedPostLoading" class="flex justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
            <div v-else-if="repliedPosts.length === 0" class="text-center py-12">
              <div class="text-gray-400 text-6xl mb-4">💬</div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">댓글 단 글이 없습니다</h3>
              <p class="text-gray-500">다른 사람의 글에 댓글을 달아보세요!</p>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="post in repliedPosts"
                :key="post.id"
                class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                      <span
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {{ post.categoryName }}
                      </span>
                      <span class="text-xs text-gray-500">{{ formatTimeAgo(post.createdAt) }}</span>
                    </div>
                    <router-link
                      :to="`/community/${post.id}`"
                      class="text-lg font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
                    >
                      {{ post.title }}
                    </router-link>
                    <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span class="flex items-center">
                        <i class="bi bi-person mr-1"></i>
                        {{ post.anonymous ? '익명' : post.authorNickname }}
                      </span>
                      <span class="flex items-center">
                        <i class="bi bi-eye mr-1"></i>
                        {{ post.views }}
                      </span>
                      <span class="flex items-center">
                        <i class="bi bi-chat-left mr-1"></i>
                        {{ post.answerCount || 0 }}
                      </span>
                      <span class="flex items-center">
                        <i class="bi bi-heart mr-1"></i>
                        {{ post.likes || 0 }}
                      </span>
                    </div>
                    <!-- 마지막 댓글 내용 미리보기 -->
                    <div v-if="post.lastComment" class="mt-2 p-2 bg-gray-50 rounded text-sm">
                      <div class="font-medium text-gray-700 mb-1">내가 단 댓글:</div>
                      <div class="text-gray-600" v-html="post.lastComment.content"></div>
                      <div class="text-xs text-gray-500 mt-1">
                        {{ formatTimeAgo(post.lastComment.createdAt) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 댓글 단 글 페이지네이션 -->
            <div v-if="repliedPostPagination.totalPages > 1" class="mt-6">
              <BasicPagination
                :pagination="repliedPostPagination"
                @page-change="(page) => updatePage(page, 'replies')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 삭제 확인 모달 -->
    <div
      v-show="showDeleteModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="closeDeleteModal"
    >
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-black opacity-50"></div>
        <div class="relative bg-white rounded-lg max-w-md w-full p-6" @click.stop>
          <div class="text-center">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">게시글 삭제</h3>
            <p class="text-gray-600 mb-6">정말 삭제하시겠습니까?</p>
            <div class="flex space-x-4">
              <button
                @click="closeDeleteModal"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                취소
              </button>
              <LoadingButton
                @click="confirmDelete"
                :loading="isDeleteLoading"
                class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                삭제
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <UserFooter />
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import UserHeader from '@/components/common/UserHeader.vue'
import UserFooter from '@/components/common/UserFooter.vue'
import LoadingButton from '@/components/common/LoadingButton.vue'
import BasicPagination from '@/components/common/BasicPagination.vue'
import {
  getBookmarkedPosts,
  getUserPosts,
  getRepliedPosts,
  deleteCommunityPost,
  bookmarkPost,
} from '@/api/community'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 활성 탭
const activeTab = ref('bookmarks')

// 데이터
const bookmarkPosts = ref([])
const userPosts = ref([])
const repliedPosts = ref([])

// 페이지네이션
const bookmarkPagination = reactive({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  hasNext: false,
  hasPrevious: false,
})

const userPostPagination = reactive({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  hasNext: false,
  hasPrevious: false,
})

const repliedPostPagination = reactive({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  hasNext: false,
  hasPrevious: false,
})

// 로딩 상태
const isBookmarkLoading = ref(false)
const isUserPostLoading = ref(false)
const isRepliedPostLoading = ref(false)
const isDeleteLoading = ref(false)

// 삭제 모달
const showDeleteModal = ref(false)
const deletePostId = ref(null)

// 시간 포맷 함수
const formatTimeAgo = (dateString) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return '방금 전'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}일 전`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}개월 전`
  return `${Math.floor(diffInSeconds / 31536000)}년 전`
}

// 북마크한 글 로드
const loadBookmarkedPosts = async (page = 1) => {
  isBookmarkLoading.value = true
  try {
    const result = await getBookmarkedPosts({ page })
    if (result.success) {
      bookmarkPosts.value = result.data.posts || []
      Object.assign(bookmarkPagination, result.data.pagination || {})
    }
  } catch (error) {
    console.error('북마크 목록 로드 실패:', error)
  } finally {
    isBookmarkLoading.value = false
  }
}

// 내가 쓴 글 로드
const loadUserPosts = async (page = 1) => {
  isUserPostLoading.value = true
  try {
    const result = await getUserPosts({ page })
    if (result.success) {
      userPosts.value = result.data.posts || []
      Object.assign(userPostPagination, result.data.pagination || {})
    }
  } catch (error) {
    console.error('내 글 목록 로드 실패:', error)
  } finally {
    isUserPostLoading.value = false
  }
}

// 댓글 단 글 로드
const loadRepliedPosts = async (page = 1) => {
  isRepliedPostLoading.value = true
  try {
    const result = await getRepliedPosts({ page })
    if (result.success) {
      repliedPosts.value = result.data.posts || []
      Object.assign(repliedPostPagination, result.data.pagination || {})
    }
  } catch (error) {
    console.error('댓글 단 글 목록 로드 실패:', error)
  } finally {
    isRepliedPostLoading.value = false
  }
}

// 페이지 업데이트
const updatePage = (page, type) => {
  const query = { ...route.query }

  if (type === 'bookmarks') {
    query.bookmarkPage = page
    loadBookmarkedPosts(page)
  } else if (type === 'posts') {
    query.userPostPage = page
    loadUserPosts(page)
  } else if (type === 'replies') {
    query.repliedPostPage = page
    loadRepliedPosts(page)
  }

  router.push({ query })
}

// 북마크 토글
const handleBookmarkToggle = async (postId, tabType) => {
  try {
    const result = await bookmarkPost(postId)
    if (result.success) {
      // 북마크 목록에서 제거
      if (tabType === 'bookmarks') {
        await loadBookmarkedPosts(bookmarkPagination.currentPage)
      }
    } else {
      alert(result.message || '북마크 처리 중 오류가 발생했습니다.')
    }
  } catch (error) {
    console.error('북마크 토글 실패:', error)
    alert('북마크 처리 중 오류가 발생했습니다.')
  }
}

// 게시글 삭제
const handlePostDelete = (postId) => {
  deletePostId.value = postId
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deletePostId.value = null
}

const confirmDelete = async () => {
  if (!deletePostId.value) return

  isDeleteLoading.value = true
  try {
    const result = await deleteCommunityPost(deletePostId.value)
    if (result.success) {
      // 현재 탭의 목록 새로고침
      if (activeTab.value === 'posts') {
        await loadUserPosts(userPostPagination.currentPage)
      }
      showDeleteModal.value = false
      deletePostId.value = null
    } else {
      alert(result.message || '게시글 삭제 중 오류가 발생했습니다.')
    }
  } catch (error) {
    console.error('게시글 삭제 실패:', error)
    alert('게시글 삭제 중 오류가 발생했습니다.')
  } finally {
    isDeleteLoading.value = false
  }
}

// URL에서 초기 탭과 페이지 설정
const initializeFromQuery = () => {
  // 쿼리에서 페이지 정보 가져오기
  const bookmarkPage = parseInt(route.query.bookmarkPage) || 1
  const userPostPage = parseInt(route.query.userPostPage) || 1
  const repliedPostPage = parseInt(route.query.repliedPostPage) || 1

  // 데이터 로드
  loadBookmarkedPosts(bookmarkPage)
  loadUserPosts(userPostPage)
  loadRepliedPosts(repliedPostPage)

  // 페이지네이션 상태 설정
  bookmarkPagination.currentPage = bookmarkPage
  userPostPagination.currentPage = userPostPage
  repliedPostPagination.currentPage = repliedPostPage
}

// 탭 변경 감지
watch(activeTab, (newTab) => {
  // URL 업데이트는 하지 않고 데이터만 로드
  if (newTab === 'bookmarks' && bookmarkPosts.value.length === 0) {
    loadBookmarkedPosts(bookmarkPagination.currentPage)
  } else if (newTab === 'posts' && userPosts.value.length === 0) {
    loadUserPosts(userPostPagination.currentPage)
  } else if (newTab === 'replies' && repliedPosts.value.length === 0) {
    loadRepliedPosts(repliedPostPagination.currentPage)
  }
})

onMounted(() => {
  initializeFromQuery()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
