<template>
  <div v-show="show" :class="wrapperClass">
    <div class="p-6">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <textarea
          v-model="formData.content"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          :class="{ 'border-red-500': errors.content }"
          :rows="rows"
          :placeholder="placeholder"
          required
        ></textarea>
        <p v-if="errors.content" class="text-sm text-red-600">
          {{ errors.content }}
        </p>

        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <input
              v-model="formData.anonymous"
              type="checkbox"
              :id="anonymousCheckboxId"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label :for="anonymousCheckboxId" class="ml-2 text-sm text-gray-700">
              익명으로 댓글 달기
            </label>
          </div>
          <LoadingButton
            type="submit"
            :loading="isLoading"
            :class="buttonClass"
          >
            등록
          </LoadingButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import LoadingButton from '@/components/common/LoadingButton.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  formData: {
    type: Object,
    required: true
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: '댓글을 달아 생각을 공유해 주세요!'
  },
  rows: {
    type: Number,
    default: 4
  },
  wrapperClass: {
    type: String,
    default: 'bg-white rounded-lg shadow mb-6'
  },
  buttonClass: {
    type: String,
    default: 'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
  },
  idSuffix: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['submit'])

const anonymousCheckboxId = computed(() =>
  props.idSuffix ? `anonymous-${props.idSuffix}` : 'anonymous'
)

const handleSubmit = () => {
  emit('submit', props.formData)
}

watch(() => props.show, (newShow) => {
  if (newShow) {
    props.formData.content = ''
    props.formData.anonymous = false
  }
})
</script>