<template>
  <div class="flex flex-wrap gap-1">
    <span
      v-for="tag in tags"
      :key="tag.id"
      :class="tagClass"
      :style="tagStyle(tag)"
      @click.prevent="handleTagClick(tag)"
    >
      {{ tag.name }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tags: {
    type: Array,
    default: () => [],
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'colored', 'outlined'].includes(value),
  },
  clickable: {
    type: Boolean,
    default: false,
  },
  maxTags: {
    type: Number,
    default: null,
  },
})

const emit = defineEmits(['tag-click'])

// 태그 클래스 계산
const tagClass = computed(() => {
  const baseClass = 'inline-block rounded-full font-medium transition-colors'

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  }

  const variants = {
    default: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    colored: '', // 개별 태그 색상 사용
    outlined: 'border border-gray-300 text-gray-700 hover:border-gray-400',
  }

  const clickableClass = props.clickable ? 'cursor-pointer' : ''

  return `${baseClass} ${sizes[props.size]} ${variants[props.variant]} ${clickableClass}`
})

// 표시할 태그들 계산 (maxTags 제한)
const displayTags = computed(() => {
  if (props.maxTags && props.tags.length > props.maxTags) {
    return props.tags.slice(0, props.maxTags)
  }
  return props.tags
})

// 생략된 태그 개수
const remainingCount = computed(() => {
  if (props.maxTags && props.tags.length > props.maxTags) {
    return props.tags.length - props.maxTags
  }
  return 0
})

// 컬러 태그 스타일
const tagStyle = (tag) => {
  if (props.variant === 'colored' && tag.color) {
    return {
      backgroundColor: tag.color,
      color: getContrastColor(tag.color),
    }
  }
  return {}
}

// 색상에 따른 텍스트 색상 결정
const getContrastColor = (hexColor) => {
  if (!hexColor) return '#000000'

  // hex를 rgb로 변환
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  // 밝기 계산 (0-255)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  return brightness > 128 ? '#000000' : '#ffffff'
}

const handleTagClick = (tag) => {
  if (props.clickable) {
    emit('tag-click', tag)
  }
}
</script>
