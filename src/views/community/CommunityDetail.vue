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
              <PostHeader :title="post.title" :tags="post.tags" />

              <PostMeta
                :post-id="post.id"
                :category-name="post.categoryName"
                :author-nickname="post.authorNickname"
                :anonymous="post.anonymous"
                :views="post.views"
                :formatted-created-at="formatTimeAgo(post.createdAt)"
                :modified-at="post.modifiedAt"
                :can-edit="canEdit"
                @delete="handleDelete"
              />

              <!-- 게시글 내용 -->
              <div class="prose max-w-none mb-6" v-html="post.content"></div>
            </div>
          </div>

          <PostActions
            :likes="post.likes"
            :bookmarked="bookmarked"
            :is-like-loading="isLikeLoading"
            :is-bookmark-loading="isBookmarkLoading"
            @like="handleLike"
            @toggle-answer="toggleAnswerForm"
            @bookmark="handleBookmark"
          />

          <CommentSection
            :comments="answers"
            :current-user-id="authStore.user?.id"
            :show-answer-form="showAnswerForm"
            :answer-form="answerForm"
            :answer-errors="answerErrors"
            :is-answer-loading="isAnswerLoading"
            :show-comment-form="showCommentForm"
            :comment-forms="commentForms"
            :is-comment-loading="isCommentLoading"
            :format-time-ago="formatTimeAgo"
            @submit-answer="handleAnswerSubmit"
            @delete-answer="handleAnswerDelete"
            @delete-comment="handleCommentDelete"
            @toggle-comment-form="toggleCommentForm"
            @submit-comment="handleCommentSubmit"
          />
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

    <ConfirmModal
      :show="showDeleteModal"
      title="게시글 삭제"
      message="정말 삭제하시겠습니까?"
      confirm-text="삭제"
      :is-loading="isDeleteLoading"
      @confirm="confirmDelete"
      @cancel="closeDeleteModal"
    />

    <ConfirmModal
      :show="showLikeErrorModal"
      title="알림"
      :message="likeErrorMessage"
      confirm-text="확인"
      cancel-text=""
      :close-on-backdrop="true"
      @confirm="showLikeErrorModal = false"
      @cancel="showLikeErrorModal = false"
    />
  </div>
  <UserFooter />
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTimeFormat } from '@/composables/useTimeFormat'
import UserHeader from '@/components/common/UserHeader.vue'
import UserFooter from '@/components/common/UserFooter.vue'
import SearchWidget from '@/components/board/SearchWidget.vue'
import SideWidget from '@/components/board/SideWidget.vue'
import PostHeader from '@/components/community/PostHeader.vue'
import PostMeta from '@/components/community/PostMeta.vue'
import PostActions from '@/components/community/PostActions.vue'
import CommentSection from '@/components/community/CommentSection.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import {
  getCommunityPostDetail,
  deleteCommunityPost,
  likeCommunityPost,
  bookmarkPost,
  removeBookmark,
  createAnswer,
  deleteAnswer,
  createComment,
  deleteComment,
} from '@/api/community'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { formatTimeAgo } = useTimeFormat()

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
const showLikeErrorModal = ref(false)
const likeErrorMessage = ref('')
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

// 데이터 로드
const loadPostDetail = async () => {
  isLoading.value = true
  try {
    const result = await getCommunityPostDetail(route.params.postId)
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
      post.value.likes++
    } else {
      likeErrorMessage.value = result.message || '좋아요 처리 중 오류가 발생했습니다.'
      showLikeErrorModal.value = true
    }
  } catch (error) {
    console.error('좋아요 실패:', error)
    likeErrorMessage.value = '좋아요 처리 중 오류가 발생했습니다.'
    showLikeErrorModal.value = true
  } finally {
    isLikeLoading.value = false
  }
}

// 북마크 처리
const handleBookmark = async () => {
  isBookmarkLoading.value = true
  try {
    let result
    if (bookmarked.value) {
      // 북마크가 되어있으면 취소
      result = await removeBookmark(post.value.id)
    } else {
      // 북마크가 안되어있으면 추가
      result = await bookmarkPost(post.value.id)
    }

    if (result.success) {
      // API 응답에 bookmarked 값이 있으면 사용, 없으면 직접 토글
      if (result.data && typeof result.data.bookmarked !== 'undefined') {
        bookmarked.value = result.data.bookmarked
      } else {
        bookmarked.value = !bookmarked.value
      }
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
      authorId: authStore.user.id,
      anonymous: answerForm.anonymous,
      content: answerForm.content,
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
