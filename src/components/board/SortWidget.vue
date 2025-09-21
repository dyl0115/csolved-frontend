<template>
  <div class="bg-white rounded-lg shadow-md">
    <div class="px-4 py-3 border-b border-gray-200 font-semibold">
      {{ title }}
    </div>
    <div class="p-4">
      <!-- 드롭다운 방식 -->
      <select
        v-if="type === 'dropdown'"
        :model-value="sortType"
        @change="handleChange"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option v-for="option in sortOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <!-- 버튼 방식 -->
      <div v-else-if="type === 'buttons'" class="space-y-2">
        <button
          v-for="option in sortOptions"
          :key="option.value"
          @click="handleSortChange(option.value)"
          class="w-full px-3 py-2 text-left rounded-lg transition-colors"
          :class="
            sortType === option.value
              ? 'bg-blue-100 text-blue-800 border border-blue-300'
              : 'hover:bg-gray-50 border border-transparent'
          "
        >
          <i v-if="option.icon" :class="option.icon" class="mr-2"></i>
          {{ option.label }}
          <i v-if="sortType === option.value" class="bi bi-check float-right mt-0.5"></i>
        </button>
      </div>

      <!-- 탭 방식 -->
      <div v-else-if="type === 'tabs'" class="flex flex-wrap gap-1">
        <button
          v-for="option in sortOptions"
          :key="option.value"
          @click="handleSortChange(option.value)"
          class="px-3 py-1.5 text-sm rounded-full transition-colors"
          :class="
            sortType === option.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          "
        >
          {{ option.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  sortType: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '정렬',
  },
  sortOptions: {
    type: Array,
    default: () => [
      { value: 'recent', label: '최신순', icon: 'bi bi-clock' },
      { value: 'views', label: '조회수 많은 순', icon: 'bi bi-eye' },
      { value: 'answers', label: '댓글 많은 순', icon: 'bi bi-chat-dots' },
      { value: 'likes', label: '좋아요 많은 순', icon: 'bi bi-heart' },
    ],
  },
  type: {
    type: String,
    default: 'dropdown',
    validator: (value) => ['dropdown', 'buttons', 'tabs'].includes(value),
  },
})

const emit = defineEmits(['sort-change'])

const handleChange = (event) => {
  emit('sort-change', event.target.value)
}

const handleSortChange = (value) => {
  emit('sort-change', value)
}
</script>
