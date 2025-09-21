<template>
  <div :class="containerClass">
    <div :class="overlayClass">
      <div class="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div class="text-center">
          <h1 :class="titleClass">{{ title || altText }}</h1>
          <p v-if="description" :class="descriptionClass">{{ description }}</p>

          <!-- 추가 컨텐츠 슬롯 -->
          <div v-if="$slots.default" class="mt-6">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  imageSrc: {
    type: String,
    required: true,
  },
  altText: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'gradient', 'dark'].includes(value)
  },
  overlay: {
    type: Boolean,
    default: true
  }
})

// 컨테이너 클래스
const containerClass = computed(() => {
  const baseClass = 'relative bg-cover bg-center bg-no-repeat'

  const heights = {
    sm: 'h-32 sm:h-40',
    md: 'h-48 sm:h-64',
    lg: 'h-64 sm:h-80',
    xl: 'h-80 sm:h-96'
  }

  const variants = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    gradient: 'bg-gradient-to-r from-purple-600 to-blue-600',
    dark: 'bg-gray-900'
  }

  let classes = `${baseClass} ${heights[props.height]}`

  if (props.imageSrc) {
    classes += ` [background-image:url('${props.imageSrc}')]`
  } else {
    classes += ` ${variants[props.variant]}`
  }

  return classes
})

// 오버레이 클래스
const overlayClass = computed(() => {
  if (!props.overlay) return 'h-full flex items-center'

  return 'h-full flex items-center bg-black bg-opacity-40'
})

// 제목 클래스
const titleClass = computed(() => {
  return 'text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2'
})

// 설명 클래스
const descriptionClass = computed(() => {
  return 'text-lg sm:text-xl text-white opacity-90'
})
</script>
