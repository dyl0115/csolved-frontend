<template>
  <div class="bg-white rounded-lg shadow-md">
    <div class="px-4 py-3 border-b border-gray-200 font-semibold">
      {{ title }}
    </div>
    <div class="p-4">
      <form @submit.prevent="handleSubmit">
        <div class="flex" :class="{ 'flex-col space-y-3': vertical }">
          <!-- 검색 방식 선택 -->
          <select
            v-if="searchOptions.length > 1"
            v-model="localSearchForm.searchType"
            class="flex-shrink-0 px-3 py-2 border border-gray-300 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="vertical ? 'rounded-lg' : 'rounded-l-lg'"
          >
            <option v-for="option in searchOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>

          <!-- 검색창 -->
          <input
            v-model="localSearchForm.searchKeyword"
            type="text"
            :placeholder="placeholder"
            class="flex-1 px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="getInputClass"
            @keyup.enter="handleSubmit"
          />

          <!-- 검색 버튼 -->
          <button
            type="submit"
            class="px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            :class="vertical ? 'rounded-lg' : 'rounded-r-lg'"
            :disabled="!canSearch"
          >
            <i class="bi bi-search"></i>
            <span v-if="vertical" class="ml-2">{{ buttonText }}</span>
          </button>
        </div>

        <!-- 초기화 버튼 -->
        <div v-if="showClearButton && hasSearchValue" class="mt-3">
          <button
            type="button"
            @click="clearSearch"
            class="text-sm text-gray-500 hover:text-gray-700"
          >
            <i class="bi bi-x-circle mr-1"></i>
            검색 초기화
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'

const props = defineProps({
  searchForm: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    default: '검색',
  },
  placeholder: {
    type: String,
    default: '검색어를 입력하세요.',
  },
  buttonText: {
    type: String,
    default: '검색',
  },
  searchOptions: {
    type: Array,
    default: () => [
      { value: 'title', label: '제목' },
      { value: 'author', label: '글쓴이' },
    ],
  },
  vertical: {
    type: Boolean,
    default: false,
  },
  showClearButton: {
    type: Boolean,
    default: true,
  },
  minLength: {
    type: Number,
    default: 2,
  },
})

const emit = defineEmits(['search', 'clear'])

const localSearchForm = reactive({ ...props.searchForm })

// 검색 가능 여부
const canSearch = computed(() => {
  return (localSearchForm.searchKeyword || '').trim().length >= props.minLength
})

// 검색어가 있는지 확인
const hasSearchValue = computed(() => {
  return (localSearchForm.searchKeyword || '').trim().length > 0
})

// 입력 필드 클래스
const getInputClass = computed(() => {
  if (props.vertical) {
    return 'rounded-lg'
  }

  if (props.searchOptions.length > 1) {
    return 'border-t border-b'
  }

  return 'rounded-l-lg border-t border-b border-l'
})

// 폼 제출 처리
const handleSubmit = () => {
  if (canSearch.value) {
    emit('search', { ...localSearchForm })
  }
}

// 검색 초기화
const clearSearch = () => {
  localSearchForm.searchKeyword = ''
  localSearchForm.searchType = props.searchOptions[0]?.value || 'title'
  emit('clear')
}

// props 변경 감지
watch(
  () => props.searchForm,
  (newValue) => {
    Object.assign(localSearchForm, newValue)
  },
  { deep: true },
)
</script>
