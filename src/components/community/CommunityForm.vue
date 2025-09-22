<template>
  <div class="community-form bg-white rounded-lg shadow-lg">
    <div class="bg-gray-800 text-white px-6 py-4 rounded-t-lg">
      <h1 class="text-xl font-semibold mb-0">글 작성하기</h1>
    </div>

    <div class="p-6">
      <form @submit.prevent="$emit('submit')" class="space-y-6">
        <!-- 카테고리 선택 -->
        <div>
          <label for="categoryId" class="block text-sm font-medium text-gray-700 mb-2">
            카테고리
          </label>
          <select
            :value="form.categoryId"
            @input="$emit('update:form', { ...form, categoryId: $event.target.value })"
            id="categoryId"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            :class="{ 'border-red-500': errors.categoryId }"
            required
          >
            <option value="">카테고리를 선택하세요</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <p v-if="errors.categoryId" class="mt-1 text-sm text-red-600">
            {{ errors.categoryId }}
          </p>
        </div>

        <!-- 제목 입력 -->
        <DefaultInputField
          label="제목"
          :model-value="form.title"
          @update:model-value="$emit('update:form', { ...form, title: $event })"
          placeholder="제목을 입력하세요"
          :error="errors.title"
        />

        <!-- 익명/실명 토글 -->
        <div class="flex items-center">
          <input
            :checked="form.anonymous"
            @change="$emit('update:form', { ...form, anonymous: $event.target.checked })"
            type="checkbox"
            id="anonymousToggle"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="anonymousToggle" class="ml-2 text-sm text-gray-700">
            익명으로 작성
          </label>
        </div>

        <!-- 태그 입력 -->
        <div>
          <label for="tag-input" class="block text-sm font-medium text-gray-700 mb-2">
            태그
          </label>
          <div
            class="min-h-[42px] px-3 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent flex flex-wrap items-center gap-2"
            :class="{ 'border-red-500': errors.tags }"
          >
            <!-- 태그 목록 -->
            <span
              v-for="(tag, index) in tags"
              :key="index"
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {{ tag }}
              <button
                type="button"
                @click="$emit('removeTag', index)"
                class="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>

            <!-- 태그 입력 -->
            <input
              :value="tagInput"
              @input="$emit('update:tagInput', $event.target.value)"
              type="text"
              id="tag-input"
              class="flex-1 min-w-0 outline-none border-0 p-0 text-sm"
              placeholder="태그를 입력하고 스페이스/엔터를 누르세요"
              @keydown.enter.prevent="$emit('addTag')"
              @keydown.space.prevent="$emit('addTag')"
            />
          </div>
          <p v-if="errors.tags" class="mt-1 text-sm text-red-600">{{ errors.tags }}</p>
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
            작성완료
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
  categories: {
    type: Array,
    default: () => []
  },
  tags: {
    type: Array,
    default: () => []
  },
  tagInput: {
    type: String,
    default: ''
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

defineEmits([
  'update:form',
  'update:tagInput',
  'addTag',
  'removeTag',
  'submit',
  'cancel'
])
</script>

<style scoped>
.focus-within\:ring-2:focus-within {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
    var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width))
    var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus-within\:ring-blue-500:focus-within {
  --tw-ring-opacity: 1;
  --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity));
}

.focus-within\:border-transparent:focus-within {
  border-color: transparent;
}
</style>