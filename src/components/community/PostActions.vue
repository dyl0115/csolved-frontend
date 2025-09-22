<template>
  <div class="flex space-x-4 mb-6">
    <!-- 좋아요 버튼 -->
    <button
      @click="$emit('like')"
      :disabled="isLikeLoading"
      class="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
    >
      <i class="bi bi-heart mr-2"></i>
      좋아요
      <span class="ml-2">{{ likes || 0 }}</span>
    </button>

    <!-- 답변 달기 버튼 -->
    <button
      @click="$emit('toggleAnswer')"
      class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <i class="bi bi-chat-left-text-fill mr-2"></i>
      답변 달기
    </button>

    <!-- 북마크 버튼 -->
    <button
      @click="$emit('bookmark')"
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
</template>

<script setup>
defineProps({
  likes: {
    type: Number,
    default: 0
  },
  bookmarked: {
    type: Boolean,
    default: false
  },
  isLikeLoading: {
    type: Boolean,
    default: false
  },
  isBookmarkLoading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['like', 'toggleAnswer', 'bookmark'])
</script>