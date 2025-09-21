<template>
  <nav class="mt-8" aria-label="Pagination">
    <hr v-if="showDivider" class="mb-6 border-gray-200" />

    <div class="flex items-center justify-center gap-4" :class="alignmentClass">
      <!-- 첫 페이지 버튼 -->
      <button
        v-if="showFirstLast && pagination.currentPage > 2"
        @click="handlePageChange(1)"
        class="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
        :disabled="pagination.currentPage === 1"
      >
        <i class="bi bi-chevron-double-left"></i>
      </button>

      <!-- 이전 페이지 -->
      <button
        @click="handlePageChange(pagination.currentPage - 1)"
        :disabled="pagination.currentPage <= 1"
        class="px-4 py-2 rounded-lg transition-colors"
        :class="
          pagination.currentPage > 1
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        "
      >
        <i v-if="iconOnly" class="bi bi-chevron-left"></i>
        <span v-else>{{ prevText }}</span>
      </button>

      <!-- 페이지 번호들 (type이 'numbers'일 때) -->
      <div v-if="type === 'numbers'" class="flex items-center gap-2">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="handlePageChange(page)"
          class="w-10 h-10 rounded-lg transition-colors"
          :class="
            page === pagination.currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          "
        >
          {{ page }}
        </button>

        <!-- 생략 표시 -->
        <span v-if="showEndEllipsis" class="px-2 text-gray-400">...</span>
      </div>

      <!-- 페이지 입력 (type이 'input'일 때) -->
      <div v-else-if="type === 'input'" class="flex items-center gap-2">
        <input
          v-model="currentPageInput"
          type="text"
          @keyup.enter="handlePageInputChange"
          @blur="handlePageInputChange"
          class="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          :min="1"
          :max="pagination.totalPage"
        />
        <span class="text-gray-500">/ {{ pagination.totalPage }}</span>
      </div>

      <!-- 간단한 정보만 (type이 'simple'일 때) -->
      <div v-else-if="type === 'simple'" class="flex items-center gap-2">
        <span class="text-gray-500">
          {{ pagination.currentPage }} / {{ pagination.totalPage }}
        </span>
      </div>

      <!-- 다음 페이지 -->
      <button
        @click="handlePageChange(pagination.currentPage + 1)"
        :disabled="pagination.currentPage >= pagination.totalPage"
        class="px-4 py-2 rounded-lg transition-colors"
        :class="
          pagination.currentPage < pagination.totalPage
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        "
      >
        <i v-if="iconOnly" class="bi bi-chevron-right"></i>
        <span v-else>{{ nextText }}</span>
      </button>

      <!-- 마지막 페이지 버튼 -->
      <button
        v-if="showFirstLast && pagination.currentPage < pagination.totalPage - 1"
        @click="handlePageChange(pagination.totalPage)"
        class="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
        :disabled="pagination.currentPage === pagination.totalPage"
      >
        <i class="bi bi-chevron-double-right"></i>
      </button>
    </div>

    <!-- 페이지 정보 -->
    <div v-if="showInfo" class="text-center mt-4 text-sm text-gray-500">
      {{ getPageInfo }}
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  pagination: {
    type: Object,
    required: true,
  },
  prevText: {
    type: String,
    default: '이전 페이지',
  },
  nextText: {
    type: String,
    default: '다음 페이지',
  },
  type: {
    type: String,
    default: 'input',
    validator: (value) => ['input', 'numbers', 'simple'].includes(value),
  },
  align: {
    type: String,
    default: 'center',
    validator: (value) => ['left', 'center', 'right'].includes(value),
  },
  showDivider: {
    type: Boolean,
    default: true,
  },
  showFirstLast: {
    type: Boolean,
    default: false,
  },
  showInfo: {
    type: Boolean,
    default: false,
  },
  iconOnly: {
    type: Boolean,
    default: false,
  },
  maxVisible: {
    type: Number,
    default: 5,
  },
})

const emit = defineEmits(['page-change'])

const currentPageInput = ref(props.pagination.currentPage)

// 정렬 클래스
const alignmentClass = computed(() => {
  const alignments = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }
  return alignments[props.align]
})

// 보여질 페이지 번호들 (numbers 타입일 때)
const visiblePages = computed(() => {
  if (props.type !== 'numbers') return []

  const current = props.pagination.currentPage
  const total = props.pagination.totalPage
  const maxVisible = props.maxVisible

  let start = Math.max(1, current - Math.floor(maxVisible / 2))
  let end = Math.min(total, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// 마지막 생략 표시 여부
const showEndEllipsis = computed(() => {
  if (props.type !== 'numbers') return false
  const lastVisible = visiblePages.value[visiblePages.value.length - 1]
  return lastVisible < props.pagination.totalPage
})

// 페이지 정보 텍스트
const getPageInfo = computed(() => {
  const { currentPage, totalPage, totalCount } = props.pagination
  if (totalCount) {
    const start = (currentPage - 1) * 10 + 1 // 임시로 페이지 사이즈 10으로 가정
    const end = Math.min(currentPage * 10, totalCount)
    return `${start}-${end} / ${totalCount}개`
  }
  return `${currentPage} / ${totalPage} 페이지`
})

// 페이지 변경 처리
const handlePageChange = (page) => {
  const pageNum = parseInt(page)
  if (
    pageNum >= 1 &&
    pageNum <= props.pagination.totalPage &&
    pageNum !== props.pagination.currentPage
  ) {
    emit('page-change', pageNum)
  }
}

// 입력 필드 페이지 변경 처리
const handlePageInputChange = () => {
  const pageNum = parseInt(currentPageInput.value)
  if (pageNum >= 1 && pageNum <= props.pagination.totalPage) {
    handlePageChange(pageNum)
  } else {
    currentPageInput.value = props.pagination.currentPage
  }
}

// pagination prop 변경 감지
watch(
  () => props.pagination.currentPage,
  (newPage) => {
    currentPageInput.value = newPage
  },
)
</script>
