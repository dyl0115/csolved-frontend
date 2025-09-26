<template>
  <div class="bg-white rounded-lg shadow-md">
    <div class="px-4 py-3 border-b border-gray-200 font-semibold">
      {{ config.title }}
    </div>
    <div class="p-4">

      <!-- 카테고리 목록 -->
      <ul class="space-y-1">
        <li v-for="category in displayCategories" :key="category.id">
          <button
            @click="handleCategoryClick(category.id)"
            class="w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between"
            :class="
              selectedCategory === category.id
                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                : 'hover:bg-gray-50 text-gray-700'
            "
          >
            <div class="flex items-center">
              <i v-if="category.icon" :class="category.icon" class="mr-2"></i>
              <span>{{ category.name }}</span>
            </div>

            <div class="flex items-center space-x-2">
              <!-- 게시글 수 -->
              <span v-if="config.showPostCount && category.postCount" class="text-sm text-gray-500">
                {{ category.postCount }}
              </span>
              <!-- 선택됨 표시 -->
              <i v-if="selectedCategory === category.id" class="bi bi-check text-sm"></i>
            </div>
          </button>
        </li>
      </ul>

      <!-- 더보기 버튼 -->
      <div v-if="hasMoreCategories" class="mt-3">
        <button
          @click="toggleShowMore"
          class="w-full text-center text-sm text-blue-600 hover:text-blue-800 py-2"
        >
          {{ showMore ? '접기' : `더보기 (${remainingCount}개 더)` }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  categories: {
    type: Array,
    required: true,
    default: () => [],
  },
  selectedCategory: {
    type: [String, Number],
    default: null,
  },
  config: {
    type: Object,
    default: () => ({
      title: '카테고리',
      showAll: false,
      showPostCount: true,
      maxDisplay: 10
    })
  },
  totalCount: {
    type: Number,
    default: null,
  }
})

const emit = defineEmits(['category-filter'])

const showMore = ref(false)

// 표시할 카테고리 계산
const displayCategories = computed(() => {
  if (showMore.value || props.categories.length <= props.config.maxDisplay) {
    return props.categories
  }
  return props.categories.slice(0, props.config.maxDisplay)
})

// 더 표시할 카테고리가 있는지
const hasMoreCategories = computed(() => {
  return props.categories.length > props.config.maxDisplay
})

// 남은 카테고리 수
const remainingCount = computed(() => {
  return Math.max(0, props.categories.length - props.config.maxDisplay)
})

// 카테고리 클릭 처리
const handleCategoryClick = (categoryId) => {
  emit('category-filter', categoryId)
}

// 더보기/접기 토글
const toggleShowMore = () => {
  showMore.value = !showMore.value
}
</script>
