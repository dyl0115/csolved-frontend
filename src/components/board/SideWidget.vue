<template>
  <div class="bg-white rounded-lg shadow-md">
    <!-- 헤더 -->
    <div
      v-if="title || $slots.header"
      class="px-4 py-3 border-b border-gray-200 font-semibold"
      :class="headerClass"
    >
      <slot name="header">
        <div class="flex items-center justify-between">
          <span>{{ title }}</span>
          <slot name="header-action"></slot>
        </div>
      </slot>
    </div>

    <!-- 본문 -->
    <div class="p-4" :class="contentClass">
      <slot>
        <div class="text-gray-600">
          {{ defaultContent }}
        </div>
      </slot>
    </div>

    <!-- 푸터 -->
    <div v-if="$slots.footer" class="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  defaultContent: {
    type: String,
    default: '이후 기능 추가...',
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'success', 'warning', 'danger'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
})

// 헤더 클래스
const headerClass = computed(() => {
  const variants = {
    default: 'bg-gray-50',
    primary: 'bg-blue-50 text-blue-900',
    success: 'bg-green-50 text-green-900',
    warning: 'bg-yellow-50 text-yellow-900',
    danger: 'bg-red-50 text-red-900',
  }
  return variants[props.variant]
})

// 콘텐츠 클래스
const contentClass = computed(() => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }
  return sizes[props.size]
})
</script>
