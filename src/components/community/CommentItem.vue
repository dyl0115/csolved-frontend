<template>
  <div class="flex space-x-3" :class="isReply ? 'ml-4' : ''">
    <!-- 프로필 이미지 -->
    <div class="flex-shrink-0">
      <img
        :src="profileImageSrc"
        :alt="displayName"
        :class="isReply ? 'h-8 w-8' : 'h-10 w-10'"
        class="rounded-full object-cover"
      />
    </div>

    <!-- 댓글 내용 -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center space-x-2 mb-2">
        <h4 :class="isReply ? 'text-sm' : 'text-sm'" class="font-medium text-gray-900">
          {{ displayName }}
        </h4>
        <span :class="isReply ? 'text-xs' : 'text-sm'" class="text-gray-500">
          {{ formattedCreatedAt }}
        </span>
        <button
          v-if="canDelete"
          @click="$emit('delete', commentId)"
          :class="isReply ? 'text-xs' : 'text-xs'"
          class="text-red-600 hover:text-red-800 border border-red-600 hover:border-red-800 px-1 py-0.5 rounded"
        >
          삭제
        </button>
      </div>

      <div
        :class="isReply ? 'text-sm' : 'text-sm'"
        class="prose max-w-none mb-3"
        v-html="content"
      ></div>

      <!-- 대댓글 쓰기 버튼 (일반 댓글에만 표시) -->
      <button
        v-if="!isReply"
        @click="$emit('toggleReply', commentId)"
        class="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
      >
        댓글 쓰기
      </button>

      <!-- 대댓글 작성 폼 -->
      <CommentForm
        v-if="!isReply"
        :show="showReplyForm"
        :form-data="replyFormData"
        :is-loading="isReplyLoading"
        placeholder="답변에 대한 댓글을 작성하세요!"
        :rows="3"
        wrapper-class="mt-4 bg-gray-50 rounded-lg p-4"
        button-class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
        :id-suffix="`comment-${commentId}`"
        @submit="$emit('submitReply', commentId, $event)"
      />

      <!-- 대댓글 목록 -->
      <div v-if="replies && replies.length > 0" class="mt-4 space-y-3">
        <CommentItem
          v-for="reply in replies"
          :key="reply.id"
          :comment-id="reply.id"
          :author-id="reply.authorId"
          :author-nickname="reply.authorNickname"
          :author-profile-image="reply.authorProfileImage"
          :anonymous="reply.anonymous"
          :content="reply.content"
          :formatted-created-at="reply.formattedCreatedAt"
          :current-user-id="currentUserId"
          :is-reply="true"
          @delete="$emit('deleteReply', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import CommentForm from './CommentForm.vue'

const props = defineProps({
  commentId: {
    type: [String, Number],
    required: true
  },
  authorId: {
    type: [String, Number],
    required: true
  },
  authorNickname: String,
  authorProfileImage: String,
  anonymous: {
    type: Boolean,
    default: false
  },
  content: {
    type: String,
    required: true
  },
  formattedCreatedAt: {
    type: String,
    required: true
  },
  currentUserId: [String, Number],
  isReply: {
    type: Boolean,
    default: false
  },
  replies: {
    type: Array,
    default: () => []
  },
  showReplyForm: {
    type: Boolean,
    default: false
  },
  replyFormData: {
    type: Object,
    default: () => ({ content: '', anonymous: false })
  },
  isReplyLoading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['delete', 'deleteReply', 'toggleReply', 'submitReply'])

const displayName = computed(() =>
  props.anonymous ? '익명' : props.authorNickname
)

const profileImageSrc = computed(() => {
  if (props.anonymous) return '/images/anonymous.jpg'
  return props.authorProfileImage || '/images/default-profile.png'
})

const canDelete = computed(() =>
  props.currentUserId && props.authorId === props.currentUserId
)
</script>