<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ title }}</h1>

    <div class="mb-4" v-if="tags && tags.length > 0">
      <span
        v-for="tag in tags"
        :key="tag.id"
        class="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full mr-2 mb-2"
      >
        {{ tag.name }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  tags: {
    type: Array,
    default: () => []
  }
})
</script>