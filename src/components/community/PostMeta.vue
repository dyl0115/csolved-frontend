<template>
  <div class="flex flex-wrap items-center text-sm text-gray-600 mb-6">
    <!-- 카테고리 -->
    <div class="flex items-center mr-4 mb-2">
      <i class="bi bi-journal-text mr-1"></i>
      <span>{{ categoryName }}</span>
    </div>

    <!-- 작성자 -->
    <div class="flex items-center mr-4 mb-2">
      <i class="bi bi-person mr-1"></i>
      <span>{{ anonymous ? '익명' : authorNickname }}</span>
    </div>

    <!-- 조회수 -->
    <div class="flex items-center mr-4 mb-2">
      <i class="bi bi-eye mr-1"></i>
      <span>{{ views }}</span>
    </div>

    <!-- 작성시간 -->
    <div class="flex items-center mr-4 mb-2">
      <i class="bi bi-clock mr-1"></i>
      <span>{{ formattedCreatedAt }}</span>
    </div>

    <!-- 수정됨 -->
    <div v-if="modifiedAt" class="flex items-center mr-4 mb-2">
      <i class="bi bi-pencil mr-1"></i>
      <span>수정됨</span>
    </div>

    <!-- 수정/삭제 버튼 -->
    <div v-if="canEdit" class="flex items-center space-x-2 mb-2">
      <router-link
        :to="`/community/${postId}/update`"
        class="text-blue-600 hover:text-blue-800 text-sm border border-blue-600 hover:border-blue-800 px-2 py-1 rounded"
      >
        수정
      </router-link>
      <button
        @click="$emit('delete')"
        class="text-red-600 hover:text-red-800 text-sm border border-red-600 hover:border-red-800 px-2 py-1 rounded"
      >
        삭제
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  postId: {
    type: [String, Number],
    required: true
  },
  categoryName: {
    type: String,
    required: true
  },
  authorNickname: String,
  anonymous: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  formattedCreatedAt: {
    type: String,
    required: true
  },
  modifiedAt: String,
  canEdit: {
    type: Boolean,
    default: false
  }
})

defineEmits(['delete'])
</script>