<template>
  <div class="space-y-4">
    <PostItem
      v-for="post in posts"
      :key="post.id"
      :post="post"
      :base-url="baseUrl"
      :layout="layout"
      :show-tags="showTags"
      :show-category="showCategory"
      :show-meta="showMeta"
      @click="handlePostClick"
    />

    <!-- 리스트가 비어있을 때 슬롯 -->
    <slot name="empty" v-if="posts.length === 0">
      <div class="text-center py-8 text-gray-500">게시글이 없습니다.</div>
    </slot>
  </div>
</template>

<script setup>
import PostItem from './PostItem.vue'

const props = defineProps({
  posts: {
    type: Array,
    required: true,
    default: () => [],
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

const emit = defineEmits(['post-click'])

const handlePostClick = (post) => {
  emit('post-click', post)
}
</script>
