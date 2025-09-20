<template>
  <div class="mb-6" :class="alignmentClass">
    <router-link
      :to="createUrl"
      class="inline-flex items-center px-4 py-2 rounded-lg transition-colors"
      :class="buttonClass"
    >
      <i v-if="icon" :class="icon" class="mr-2"></i>
      {{ buttonText }}
    </router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  createUrl: {
    type: String,
    required: true,
  },
  buttonText: {
    type: String,
    default: '게시글 작성하기',
  },
  icon: {
    type: String,
    default: 'bi bi-pencil-square',
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'warning', 'danger'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  align: {
    type: String,
    default: 'right',
    validator: (value) => ['left', 'center', 'right'].includes(value),
  },
})

// 정렬 클래스
const alignmentClass = computed(() => {
  const alignments = {
    left: 'flex justify-start',
    center: 'flex justify-center',
    right: 'flex justify-end',
  }
  return alignments[props.align]
})

// 버튼 스타일 클래스
const buttonClass = computed(() => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }

  return `${variants[props.variant]} ${sizes[props.size]}`
})
</script>
