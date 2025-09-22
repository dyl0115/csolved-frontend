<template>
  <div class="rich-text-editor">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>

    <div class="border border-gray-300 rounded-md" :class="{ 'border-red-500': error }">
      <QuillEditor
        ref="quillEditor"
        v-model:content="content"
        :options="editorOptions"
        content-type="html"
        class="min-h-[300px]"
        @update:content="handleContentUpdate"
      />
    </div>

    <div v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '내용을 입력하세요'
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const quillEditor = ref(null)
const content = ref(props.modelValue)

const editorOptions = computed(() => ({
  theme: 'snow',
  placeholder: props.placeholder,
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video']
    ]
  }
}))

const handleContentUpdate = (newContent) => {
  content.value = newContent
  emit('update:modelValue', newContent)
}

// Watch for external prop changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== content.value) {
    content.value = newValue
  }
})

onMounted(() => {
  // 에디터 초기화 후 추가 설정이 필요한 경우
  if (quillEditor.value) {
    const quill = quillEditor.value.getQuill()

    // 이미지 업로드 핸들러 설정
    const toolbar = quill.getModule('toolbar')
    toolbar.addHandler('image', () => {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'image/*')
      input.click()

      input.onchange = () => {
        const file = input.files[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const range = quill.getSelection()
            quill.insertEmbed(range.index, 'image', e.target.result)
          }
          reader.readAsDataURL(file)
        }
      }
    })

    // 동영상 임베드 핸들러 설정
    toolbar.addHandler('video', () => {
      const url = prompt('동영상 URL을 입력하세요:')
      if (url) {
        const range = quill.getSelection()
        quill.insertEmbed(range.index, 'video', url)
      }
    })
  }
})
</script>

<style scoped>
.rich-text-editor :deep(.ql-editor) {
  min-height: 250px;
}

.rich-text-editor :deep(.ql-toolbar) {
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
}

.rich-text-editor :deep(.ql-container) {
  border-bottom: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom-left-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}

.rich-text-editor :deep(.ql-editor.ql-blank::before) {
  font-style: normal;
  color: #9ca3af;
}
</style>