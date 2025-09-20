<template>
  <div class="bg-white rounded-lg shadow-md text-center p-8 my-8">
    <div v-if="icon" class="text-6xl mb-4">{{ icon }}</div>
    <h5 class="text-xl font-bold mb-2" :class="titleClass">{{ title }}</h5>
    <p class="text-gray-600 mb-4" :class="messageClass">{{ message }}</p>
    <router-link
      :to="createUrl"
      class="inline-flex items-center px-4 py-2 rounded-lg transition-colors"
      :class="buttonClass"
    >
      <i v-if="buttonIcon" :class="buttonIcon" class="mr-2"></i>
      {{ buttonText }}
    </router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '게시글이 없습니다',
  },
  message: {
    type: String,
    default: '첫 번째 글을 작성해보세요!',
  },
  createUrl: {
    type: String,
    required: true,
  },
  buttonText: {
    type: String,
    default: '글 작성하기',
  },
  buttonIcon: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'success', 'warning'].includes(value),
  },
})

// 스타일 계산
const titleClass = computed(() => {
  const variants = {
    default: 'text-gray-900',
    primary: 'text-blue-900',
    success: 'text-green-900',
    warning: 'text-yellow-900',
  }
  return variants[props.variant]
})

const messageClass = computed(() => {
  const variants = {
    default: 'text-gray-600',
    primary: 'text-blue-700',
    success: 'text-green-700',
    warning: 'text-yellow-700',
  }
  return variants[props.variant]
})

const buttonClass = computed(() => {
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700',
  }
  return variants[props.variant]
})
</script>
