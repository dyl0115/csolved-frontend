<template>
  <div :class="containerClass">
    <!-- 카테고리 -->
    <div v-if="display.category && post.categoryName" class="flex items-center">
      <i class="bi bi-journal-text mr-1"></i>
      <span>{{ post.categoryName }}</span>
    </div>

    <!-- 댓글수 -->
    <div v-if="display.comments" class="flex items-center">
      <i class="bi bi-chat-dots mr-1"></i>
      <span>{{ post.answerCount || 0 }}</span>
    </div>

    <!-- 좋아요수 -->
    <div v-if="display.likes" class="flex items-center">
      <i class="bi bi-heart-fill mr-1"></i>
      <span>{{ post.likes || 0 }}</span>
    </div>

    <!-- 조회수 -->
    <div v-if="display.views" class="flex items-center">
      <i class="bi bi-eye mr-1"></i>
      <span>{{ post.views || 0 }}</span>
    </div>

    <!-- 작성자 -->
    <div v-if="display.author" class="flex items-center">
      <i class="bi bi-person mr-1"></i>
      <span>{{ post.anonymous ? '익명' : post.authorNickname }}</span>
    </div>

    <!-- 작성시간 -->
    <div v-if="display.date" class="flex items-center">
      <i class="bi bi-clock mr-1"></i>
      <span>{{ formatTimeAgo(post.createdAt) }}</span>
    </div>

    <!-- 수정여부 -->
    <div v-if="display.modified && post.modifiedAt" class="flex items-center">
      <i class="bi bi-pencil mr-1"></i>
      <span>수정됨</span>
    </div>

    <!-- 상태 표시 (예: 해결됨, 인기글 등) -->
    <div v-if="post.status" class="flex items-center">
      <span :class="getStatusClass(post.status)">
        {{ getStatusText(post.status) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTimeFormat } from '@/composables/useTimeFormat'

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  layout: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical', 'compact'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  display: {
    type: Object,
    default: () => ({
      category: true,
      comments: true,
      likes: true,
      views: true,
      author: true,
      date: true,
      modified: true
    })
  }
})

const { formatTimeAgo } = useTimeFormat()

// 컨테이너 클래스 계산
const containerClass = computed(() => {
  const baseClass = 'text-gray-500'

  const layouts = {
    horizontal: 'flex flex-wrap items-center gap-4',
    vertical: 'space-y-2',
    compact: 'flex flex-wrap items-center gap-2',
  }

  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  return `${baseClass} ${layouts[props.layout]} ${sizes[props.size]}`
})

// 상태에 따른 클래스 반환
const getStatusClass = (status) => {
  const statusClasses = {
    solved: 'px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full',
    unsolved: 'px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full',
    popular: 'px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full',
    pinned: 'px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full',
    closed: 'px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full',
  }
  return statusClasses[status] || 'px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full'
}

// 상태 텍스트 반환
const getStatusText = (status) => {
  const statusTexts = {
    solved: '✅ 해결됨',
    unsolved: '❓ 미해결',
    popular: '🔥 인기글',
    pinned: '📌 고정',
    closed: '🔒 마감',
  }
  return statusTexts[status] || status
}
</script>
