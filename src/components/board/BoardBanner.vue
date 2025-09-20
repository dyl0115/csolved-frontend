<template>
  <img :src="imageSrc" :alt="altText" class="w-full max-h-[300px] min-h-[200px] object-cover" />
</template>

<script setup>
defineProps({
  imageSrc: {
    type: String,
    required: true,
  },
  altText: {
    type: String,
    required: true,
  },
})
</script>
