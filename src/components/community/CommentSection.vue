<template>
  <!-- 답변 작성 폼 -->
  <CommentForm
    :show="showAnswerForm"
    :form-data="answerForm"
    :errors="answerErrors"
    :is-loading="isAnswerLoading"
    @submit="$emit('submitAnswer', $event)"
  />

  <!-- 답변 목록 -->
  <div class="bg-white rounded-lg shadow">
    <div class="p-6">
      <!-- 답변이 없을 때 -->
      <div v-if="comments.length === 0" class="text-center py-8">
        <p class="text-gray-500">댓글이 비어있습니다. 첫 번째 댓글을 작성해보세요!</p>
      </div>

      <!-- 답변 목록 -->
      <div v-else class="space-y-6">
        <div
          v-for="comment in commentsWithFormattedTime"
          :key="comment.id"
          class="border-b border-gray-200 pb-6 last:border-b-0"
        >
          <CommentItem
            :comment-id="comment.id"
            :author-id="comment.authorId"
            :author-nickname="comment.authorNickname"
            :author-profile-image="comment.authorProfileImage"
            :anonymous="comment.anonymous"
            :content="comment.content"
            :formatted-created-at="comment.formattedCreatedAt"
            :current-user-id="currentUserId"
            :replies="comment.repliesWithFormattedTime"
            :show-reply-form="showCommentForm === comment.id"
            :reply-form-data="commentForms[comment.id] || { content: '', anonymous: false }"
            :is-reply-loading="isCommentLoading"
            @delete="$emit('deleteComment', $event)"
            @toggle-reply="$emit('toggleCommentForm', $event)"
            @submit-reply="$emit('submitComment', $event, $arguments[1])"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import CommentForm from './CommentForm.vue'
import CommentItem from './CommentItem.vue'

const props = defineProps({
  comments: {
    type: Array,
    required: true
  },
  currentUserId: [String, Number],
  showAnswerForm: {
    type: Boolean,
    default: false
  },
  answerForm: {
    type: Object,
    required: true
  },
  answerErrors: {
    type: Object,
    default: () => ({})
  },
  isAnswerLoading: {
    type: Boolean,
    default: false
  },
  showCommentForm: [String, Number, null],
  commentForms: {
    type: Object,
    default: () => ({})
  },
  isCommentLoading: {
    type: Boolean,
    default: false
  },
  formatTimeAgo: {
    type: Function,
    required: true
  }
})

defineEmits(['submitAnswer', 'deleteComment', 'toggleCommentForm', 'submitComment'])

const commentsWithFormattedTime = computed(() =>
  props.comments.map(comment => ({
    ...comment,
    formattedCreatedAt: props.formatTimeAgo(comment.createdAt),
    repliesWithFormattedTime: comment.comments?.map(reply => ({
      ...reply,
      formattedCreatedAt: props.formatTimeAgo(reply.createdAt)
    })) || []
  }))
)
</script>