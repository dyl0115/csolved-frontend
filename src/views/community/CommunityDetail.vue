<template>
  <UserHeader />
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 메인 콘텐츠 -->
        <div class="lg:col-span-2">
          <!-- 게시글 상세 -->
          <div class="bg-white rounded-lg shadow-lg mb-6">
            <div class="p-6">
              <!-- 게시글 제목 -->
              <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ post.title }}</h1>

              <!-- 태그 -->
              <div class="mb-4" v-if="post.tags && post.tags.length > 0">
                <span
                  v-for="tag in post.tags"
                  :key="tag.id"
                  class="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full mr-2 mb-2"
                >
                  {{ tag.name }}
                </span>
              </div>

              <!-- 게시글 메타 정보 -->
              <div class="flex flex-wrap items-center text-sm text-gray-600 mb-6">
                <!-- 카테고리 -->
                <div class="flex items-center mr-4 mb-2">
                  <i class="bi bi-journal-text mr-1"></i>
                  <span>{{ post.categoryName }}</span>
                </div>

                <!-- 작성자 -->
                <div class="flex items-center mr-4 mb-2">
                  <i class="bi bi-person mr-1"></i>
                  <span>{{ post.anonymous ? '익명' : post.authorNickname }}</span>
                </div>

                <!-- 조회수 -->
                <div class="flex items-center mr-4 mb-2">
                  <i class="bi bi-eye mr-1"></i>
                  <span>{{ post.views }}</span>
                </div>

                <!-- 작성시간 -->
                <div class="flex items-center mr-4 mb-2">
                  <i class="bi bi-clock mr-1"></i>
                  <span>{{ formatTimeAgo(post.createdAt) }}</span>
                </div>

                <!-- 수정됨 -->
                <div v-if="post.modifiedAt" class="flex items-center mr-4 mb-2">
                  <i class="bi bi-pencil mr-1"></i>
                  <span>수정됨</span>
                </div>

                <!-- 수정/삭제 버튼 -->
                <div v-if="canEdit" class="flex items-center space-x-2 mb-2">
                  <router-link
                    :to="`/community/${post.id}/update`"
                    class="text-blue-600 hover:text-blue-800 text-sm border border-blue-600 hover:border-blue-800 px-2 py-1 rounded"
                  >
                    수정
                  </router-link>
                  <button
                    @click="handleDelete"
                    class="text-red-600 hover:text-red-800 text-sm border border-red-600 hover:border-red-800 px-2 py-1 rounded"
                  >
                    삭제
                  </button>
                </div>
              </div>

              <!-- 게시글 내용 -->
              <div class="prose max-w-none mb-6" v-html="post.content"></div>
            </div>
          </div>

          <!-- 액션 버튼들 -->
          <div class="flex space-x-4 mb-6">
            <!-- 좋아요 버튼 -->
            <button
              @click="handleLike"
              :disabled="isLikeLoading"
              class="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <i class="bi bi-heart mr-2"></i>
              좋아요
              <span class="ml-2">{{ post.likes || 0 }}</span>
            </button>

            <!-- 답변 달기 버튼 -->
            <button
              @click="toggleAnswerForm"
              class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <i class="bi bi-chat-left-text-fill mr-2"></i>
              답변 달기
            </button>

            <!-- 북마크 버튼 -->
            <button
              @click="handleBookmark"
              :disabled="isBookmarkLoading"
              class="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <i
                :class="bookmarked ? 'bi bi-bookmark-x-fill' : 'bi bi-bookmark-fill'"
                class="mr-2"
              ></i>
              {{ bookmarked ? '북마크 취소' : '북마크' }}
            </button>
          </div>

          <!-- 답변 작성 폼 -->
          <div v-show="showAnswerForm" class="bg-white rounded-lg shadow mb-6">
            <div class="p-6">
              <form @submit.prevent="handleAnswerSubmit" class="space-y-4">
                <textarea
                  v-model="answerForm.content"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  :class="{ 'border-red-500': answerErrors.content }"
                  rows="4"
                  placeholder="댓글을 달아 생각을 공유해 주세요!"
                  required
                ></textarea>
                <p v-if="answerErrors.content" class="text-sm text-red-600">
                  {{ answerErrors.content }}
                </p>

                <div class="flex justify-between items-center">
                  <div class="flex items-center">
                    <input
                      v-model="answerForm.anonymous"
                      type="checkbox"
                      id="answer-anonymous"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label for="answer-anonymous" class="ml-2 text-sm text-gray-700">
                      익명으로 댓글 달기
                    </label>
                  </div>
                  <LoadingButton
                    type="submit"
                    :loading="isAnswerLoading"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    등록
                  </LoadingButton>
                </div>
              </form>
            </div>
          </div>

          <!-- 답변 목록 -->
          <div class="bg-white rounded-lg shadow">
            <div class="p-6">
              <!-- 답변이 없을 때 -->
              <div v-if="answers.length === 0" class="text-center py-8">
                <p class="text-gray-500">댓글이 비어있습니다. 첫 번째 댓글을 작성해보세요!</p>
              </div>

              <!-- 답변 목록 -->
              <div v-else class="space-y-6">
                <div
                  v-for="answer in answers"
                  :key="answer.id"
                  class="border-b border-gray-200 pb-6 last:border-b-0"
                >
                  <div class="flex space-x-3">
                    <!-- 프로필 이미지 -->
                    <div class="flex-shrink-0">
                      <img
                        :src="
                          answer.anonymous
                            ? '/images/anonymous.jpg'
                            : answer.authorProfileImage || '/images/default-profile.png'
                        "
                        :alt="answer.anonymous ? '익명' : answer.authorNickname"
                        class="h-10 w-10 rounded-full object-cover"
                      />
                    </div>

                    <!-- 답변 내용 -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center space-x-2 mb-2">
                        <h4 class="text-sm font-medium text-gray-900">
                          {{ answer.anonymous ? '익명' : answer.authorNickname }}
                        </h4>
                        <span class="text-sm text-gray-500">{{
                          formatTimeAgo(answer.createdAt)
                        }}</span>
                        <button
                          v-if="answer.authorId === authStore.user?.id"
                          @click="handleAnswerDelete(answer.id)"
                          class="text-xs text-red-600 hover:text-red-800 border border-red-600 hover:border-red-800 px-2 py-0.5 rounded"
                        >
                          삭제
                        </button>
                      </div>
                      <div class="prose text-sm max-w-none mb-3" v-html="answer.content"></div>

                      <!-- 대댓글 쓰기 버튼 -->
                      <button
                        @click="toggleCommentForm(answer.id)"
                        class="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        댓글 쓰기
                      </button>

                      <!-- 대댓글 작성 폼 -->
                      <div
                        v-show="showCommentForm === answer.id"
                        class="mt-4 bg-gray-50 rounded-lg p-4"
                      >
                        <form @submit.prevent="handleCommentSubmit(answer.id)" class="space-y-3">
                          <textarea
                            v-model="commentForms[answer.id]?.content || ''"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                            rows="3"
                            placeholder="답변에 대한 댓글을 작성하세요!"
                            required
                          ></textarea>

                          <div class="flex justify-between items-center">
                            <div class="flex items-center">
                              <input
                                v-model="commentForms[answer.id]?.anonymous || false"
                                type="checkbox"
                                :id="`comment-anonymous-${answer.id}`"
                                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label
                                :for="`comment-anonymous-${answer.id}`"
                                class="ml-2 text-sm text-gray-700"
                              >
                                익명으로 댓글 달기
                              </label>
                            </div>
                            <LoadingButton
                              type="submit"
                              :loading="isCommentLoading"
                              class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
                            >
                              등록
                            </LoadingButton>
                          </div>
                        </form>
                      </div>

                      <!-- 대댓글 목록 -->
                      <div
                        v-if="answer.comments && answer.comments.length > 0"
                        class="mt-4 space-y-3"
                      >
                        <div
                          v-for="comment in answer.comments"
                          :key="comment.id"
                          class="flex space-x-3 ml-4"
                        >
                          <div class="flex-shrink-0">
                            <img
                              :src="
                                comment.anonymous
                                  ? '/images/anonymous.jpg'
                                  : comment.authorProfileImage || '/images/default-profile.png'
                              "
                              :alt="comment.anonymous ? '익명' : comment.authorNickname"
                              class="h-8 w-8 rounded-full object-cover"
                            />
                          </div>
                          <div class="flex-1 min-w-0">
                            <div class="flex items-center space-x-2 mb-1">
                              <h5 class="text-sm font-medium text-gray-900">
                                {{ comment.anonymous ? '익명' : comment.authorNickname }}
                              </h5>
                              <span class="text-xs text-gray-500">{{
                                formatTimeAgo(comment.createdAt)
                              }}</span>
                              <button
                                v-if="comment.authorId === authStore.user?.id"
                                @click="handleCommentDelete(comment.id)"
                                class="text-xs text-red-600 hover:text-red-800 border border-red-600 hover:border-red-800 px-1 py-0.5 rounded"
                              >
                                삭제
                              </button>
                            </div>
                            <div class="prose text-sm max-w-none" v-html="comment.content"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 사이드바 -->
        <div class="space-y-6">
          <!-- 검색 위젯 -->
          <SearchWidget :search-form="searchForm" @search="handleSearch" />

          <!-- 사이드 위젯 -->
          <SideWidget title="관련 게시글">
            <div class="space-y-2">
              <p class="text-sm text-gray-500">관련 게시글 기능은 추후 추가될 예정입니다.</p>
            </div>
          </SideWidget>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import UserHeader from '@/components/common/UserHeader.vue'
import UserFooter from '@/components/common/UserFooter.vue'
import LoadingButton from '@/components/common/LoadingButton.vue'
import SearchWidget from '@/components/board/SearchWidget.vue'
import SideWidget from '@/components/board/SideWidget.vue'
import {
  getCommunityPostDetail,
  deleteCommunityPost,
  likeCommunityPost,
  bookmarkPost,
  createAnswer,
  deleteAnswer,
  createComment,
  deleteComment,
} from '@/api/community'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 게시글 데이터
const post = ref({})
const answers = ref([])
const bookmarked = ref(false)

// 상태 관리
const isLoading = ref(false)
const isLikeLoading = ref(false)
const isBookmarkLoading = ref(false)
const isAnswerLoading = ref(false)
const isCommentLoading = ref(false)
const isDeleteLoading = ref(false)

// 모달 및 폼 표시 상태
const showDeleteModal = ref(false)
const showAnswerForm = ref(false)
const showCommentForm = ref(null)

// 폼 데이터
const answerForm = reactive({
  content: '',
  anonymous: false,
})

const commentForms = ref({})

const answerErrors = reactive({})

// 검색 폼
const searchForm = reactive({
  searchType: 'title',
  searchKeyword: '',
})

// 계산된 속성
const canEdit = computed(() => {
  return authStore.user && post.value.authorId === authStore.user.id
})

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

// 데이터 로드
const loadPostDetail = async () => {
  isLoading.value = true
  try {
    const result = await getCommunityPostDetail(route.params.id)
    if (result.success) {
      post.value = result.data.post
      answers.value = result.data.answers || []
      bookmarked.value = result.data.bookmarked || false
    } else {
      alert('게시글을 불러올 수 없습니다.')
      router.push('/communities?page=1')
    }
  } catch (error) {
    console.error('게시글 로드 실패:', error)
    alert('게시글을 불러오는 중 오류가 발생했습니다.')
  } finally {
    isLoading.value = false
  }
}

// 좋아요 처리
const handleLike = async () => {
  isLikeLoading.value = true
  try {
    const result = await likeCommunityPost(post.value.id)
    if (result.success) {
      post.value.likes = result.data.likes
    } else {
      alert(result.message || '좋아요 처리 중 오류가 발생했습니다.')
    }
  } catch (error) {
    console.error('좋아요 실패:', error)
    alert('좋아요 처리 중 오류가 발생했습니다.')
  } finally {
    isLikeLoading.value = false
  }
}

// 북마크 처리
const handleBookmark = async () => {
  isBookmarkLoading.value = true
  try {
    const result = await bookmarkPost(post.value.id)
    if (result.success) {
      bookmarked.value = result.data.bookmarked
    } else {
      alert(result.message || '북마크 처리 중 오류가 발생했습니다.')
    }
  } catch (error) {
    console.error('북마크 실패:', error)
    alert('북마크 처리 중 오류가 발생했습니다.')
  } finally {
    isBookmarkLoading.value = false
  }
}

// 답변 폼 토글
const toggleAnswerForm = () => {
  showAnswerForm.value = !showAnswerForm.value
  if (showAnswerForm.value) {
    answerForm.content = ''
    answerForm.anonymous = false
    Object.keys(answerErrors).forEach((key) => delete answerErrors[key])
  }
}

// 답변 제출
const handleAnswerSubmit = async () => {
  if (!answerForm.content.trim()) {
    answerErrors.content = '댓글 내용을 입력해주세요.'
    return
  }

  isAnswerLoading.value = true
  try {
    const result = await createAnswer({
      postId: post.value.id,
      content: answerForm.content,
      anonymous: answerForm.anonymous,
      authorId: authStore.user.id,
    })

    if (result.success) {
      // 답변 목록 새로고침
      await loadPostDetail()
      showAnswerForm.value = false
      answerForm.content = ''
      answerForm.anonymous = false
    } else {
      if (result.errors) {
        Object.assign(answerErrors, result.errors)
      } else {
        alert(result.message || '댓글 작성 중 오류가 발생했습니다.')
      }
    }
  } catch (error) {
    console.error('댓글 작성 실패:', error)
    alert('댓글 작성 중 오류가 발생했습니다.')
  } finally {
    isAnswerLoading.value = false
  }
}

// 답변 삭제
const handleAnswerDelete = async (answerId) => {
  if (!confirm('정말 삭제하시겠습니까?')) return

  try {
    const result = await deleteAnswer(answerId)
    if (result.success) {
      await loadPostDetail()
    } else {
      alert(result.message || '댓글 삭제 중 오류가 발생했습니다.')
    }
  } catch (error) {
    console.error('댓글 삭제 실패:', error)
    alert('댓글 삭제 중 오류가 발생했습니다.')
  }
}

// 대댓글 폼 토글
const toggleCommentForm = (answerId) => {
  if (showCommentForm.value === answerId) {
    showCommentForm.value = null
  } else {
    showCommentForm.value = answerId
    if (!commentForms.value[answerId]) {
      commentForms.value[answerId] = {
        content: '',
        anonymous: false,
      }
    }
  }
}

// 대댓글 제출
const handleCommentSubmit = async (answerId) => {
  const commentForm = commentForms.value[answerId]
  if (!commentForm?.content.trim()) return

  isCommentLoading.value = true
  try {
    const result = await createComment({
      postId: post.value.id,
      answerId: answerId,
      content: commentForm.content,
      anonymous: commentForm.anonymous,
      authorId: authStore.user.id,
    })

    if (result.success) {
      await loadPostDetail()
      showCommentForm.value = null
      commentForm.content = ''
      commentForm.anonymous = false
    } else {
      alert(result.message || '댓글 작성 중 오류가 발생했습니다.')
    }
  } catch (error) {
    console.error('댓글 작성 실패:', error)
    alert('댓글 작성 중 오류가 발생했습니다.')
  } finally {
    isCommentLoading.value = false
  }
}

// 대댓글 삭제
const handleCommentDelete = async (commentId) => {
  if (!confirm('정말 삭제하시겠습니까?')) return

  try {
    const result = await deleteComment(commentId)
    if (result.success) {
      await loadPostDetail()
    } else {
      alert(result.message || '댓글 삭제 중 오류가 발생했습니다.')
    }
  } catch (error) {
    console.error('댓글 삭제 실패:', error)
    alert('댓글 삭제 중 오류가 발생했습니다.')
  }
}

// 게시글 삭제
const handleDelete = () => {
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
}

const confirmDelete = async () => {
  isDeleteLoading.value = true
  try {
    const result = await deleteCommunityPost(post.value.id)
    if (result.success) {
      router.push('/communities?page=1')
    } else {
      alert(result.message || '게시글 삭제 중 오류가 발생했습니다.')
    }
  } catch (error) {
    console.error('게시글 삭제 실패:', error)
    alert('게시글 삭제 중 오류가 발생했습니다.')
  } finally {
    isDeleteLoading.value = false
    showDeleteModal.value = false
  }
}

// 검색 처리
const handleSearch = (searchData) => {
  router.push({
    path: '/communities',
    query: {
      page: 1,
      searchType: searchData.searchType,
      searchKeyword: searchData.searchKeyword,
    },
  })
}

onMounted(() => {
  loadPostDetail()
})
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
