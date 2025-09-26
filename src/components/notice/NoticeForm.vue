<template>
  <div class="notice-form bg-white rounded-lg shadow-lg">
    <div class="bg-gray-800 text-white px-6 py-4 rounded-t-lg">
      <h1 class="text-xl font-semibold mb-0">{{ isEdit ? '공지사항 수정' : '공지사항 작성' }}</h1>
    </div>

    <div class="p-6">
      <form @submit.prevent="$emit('submit')" class="space-y-6">
        <!-- 제목 입력 -->
        <DefaultInputField
          label="제목"
          :model-value="form.title"
          @update:model-value="$emit('update:form', { ...form, title: $event })"
          placeholder="제목을 입력하세요"
          :error="errors.title"
        />

        <!-- 상단 고정 옵션 -->
        <div class="flex items-center">
          <input
            :checked="form.isPinned"
            @change="$emit('update:form', { ...form, isPinned: $event.target.checked })"
            type="checkbox"
            id="pinnedToggle"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="pinnedToggle" class="ml-2 text-sm text-gray-700">
            상단에 고정
          </label>
        </div>

        <!-- 위지윅 에디터 -->
        <RichTextEditor
          label="내용"
          :model-value="form.content"
          @update:model-value="$emit('update:form', { ...form, content: $event })"
          placeholder="내용을 입력하세요"
          :error="errors.content"
        />

        <!-- 버튼 그룹 -->
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="$emit('cancel')"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            취소
          </button>
          <LoadingButton
            type="submit"
            :loading="isLoading"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {{ isEdit ? '수정완료' : '작성완료' }}
          </LoadingButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import DefaultInputField from '@/components/common/DefaultInputField.vue'
import RichTextEditor from '@/components/common/RichTextEditor.vue'
import LoadingButton from '@/components/common/LoadingButton.vue'

defineProps({
  form: {
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
  isEdit: {
    type: Boolean,
    default: false
  }
})

defineEmits([
  'update:form',
  'submit',
  'cancel'
])
</script>

<style scoped>
/* 컴포넌트별 커스텀 스타일 */
</style>