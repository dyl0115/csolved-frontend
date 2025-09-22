<template>
  <component :is="layout === 'table' ? 'tr' : 'div'" :class="containerClass" @click="handleClick">
    <!-- 기본/카드 레이아웃 -->
    <template v-if="layout !== 'table'">
      <router-link
        :to="`${baseUrl}/${post.id}`"
        class="block p-6 text-gray-900 hover:text-gray-900"
      >
        <div>
          <!-- 제목 -->
          <h3 class="font-bold mb-3" :class="titleClass">
            {{ post.title }}
          </h3>

          <!-- 태그 -->
          <PostTags v-if="showTags && post.tags?.length" :tags="post.tags" class="mb-4" />

          <!-- 메타 정보 -->
          <PostMeta v-if="showMeta" :post="post" :show-category="showCategory" :layout="metaLayout" />
        </div>
      </router-link>
    </template>

    <!-- 테이블 레이아웃 -->
    <template v-else>
      <td class="px-6 py-4">
        <router-link
          :to="`${baseUrl}/${post.id}`"
          class="font-medium text-blue-600 hover:text-blue-800"
        >
          {{ post.title }}
        </router-link>
        <PostTags v-if="showTags && post.tags?.length" :tags="post.tags" class="mt-1" size="sm" />
      </td>
      <td v-if="showCategory" class="px-6 py-4 text-sm text-gray-500">
        {{ post.categoryName }}
      </td>
      <td class="px-6 py-4 text-sm text-gray-500">
        {{ post.anonymous ? '익명' : post.authorNickname }}
      </td>
      <td class="px-6 py-4 text-sm text-gray-500">
        {{ formatTimeAgo(post.createdAt) }}
      </td>
      <td class="px-6 py-4 text-sm text-gray-500 text-center">
        {{ post.views }}
      </td>
      <td class="px-6 py-4 text-sm text-gray-500 text-center">
        {{ post.answerCount }}
      </td>
    </template>
  </component>
</template>

<script setup>
import { computed } from 'vue'
import PostTags from './PostTags.vue'
import PostMeta from './PostMeta.vue'
import { useTimeFormat } from '@/composables/useTimeFormat'

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  baseUrl: {
    type: String,
    required: true,
  },
  layout: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'compact', 'card', 'table'].includes(value),
  },
  showTags: {
    type: Boolean,
    default: true,
  },
  showCategory: {
    type: Boolean,
    default: true,
  },
  showMeta: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['click'])

const { formatTimeAgo } = useTimeFormat()

// 컨테이너 클래스 계산
const containerClass = computed(() => {
  const layouts = {
    default:
      'bg-white rounded-lg shadow-md mb-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200',
    compact: 'bg-white rounded border hover:border-blue-300 mb-2 transition-colors',
    card: 'bg-white rounded-xl shadow-lg mb-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300',
    table: 'border-b border-gray-200 hover:bg-gray-50',
  }
  return layouts[props.layout]
})

// 제목 클래스 계산
const titleClass = computed(() => {
  const layouts = {
    default: 'text-xl truncate',
    compact: 'text-lg truncate',
    card: 'text-2xl',
    table: 'text-base',
  }
  return layouts[props.layout]
})

// PostMeta 컴포넌트에 맞는 layout 매핑
const metaLayout = computed(() => {
  const layoutMap = {
    default: 'horizontal',
    compact: 'compact',
    card: 'horizontal',
    table: 'horizontal'
  }
  return layoutMap[props.layout] || 'horizontal'
})

const handleClick = () => {
  emit('click', props.post)
}
</script>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
