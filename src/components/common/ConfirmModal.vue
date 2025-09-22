<template>
  <div
    v-show="show"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click="handleBackdropClick"
  >
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="fixed inset-0 bg-black opacity-50"></div>
      <div class="relative bg-white rounded-lg max-w-md w-full p-6" @click.stop>
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ title }}</h3>
          <p class="text-gray-600 mb-6">{{ message }}</p>
          <div class="flex space-x-4" :class="{ 'justify-center': !cancelText }">
            <button
              v-if="cancelText"
              @click="$emit('cancel')"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              {{ cancelText }}
            </button>
            <LoadingButton
              @click="$emit('confirm')"
              :loading="isLoading"
              :class="[confirmButtonClass, { 'flex-1': cancelText, 'px-8': !cancelText }]"
            >
              {{ confirmText }}
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import LoadingButton from './LoadingButton.vue'

const emit = defineEmits(['confirm', 'cancel'])

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: '확인'
  },
  cancelText: {
    type: String,
    default: '취소'
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  confirmButtonClass: {
    type: String,
    default: 'flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  }
})

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    emit('cancel')
  }
}
</script>