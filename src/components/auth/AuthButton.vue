<template>
  <button :type="type" :disabled="disabled || loading" :class="buttonClass">
    <!-- 로딩 스피너 -->
    <span v-if="loading" class="mr-2">⏳</span>

    <!-- 버튼 텍스트 -->
    <span>{{ loading ? '처리 중...' : '회원가입' }}</span>
  </button>
</template>

<script>
export default {
  name: 'AuthButton',
  props: {
    type: { type: String, default: 'button' },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },

  computed: {
    buttonClass() {
      const base = 'w-full py-2.5 px-4 rounded-md font-medium transition'

      if (this.disabled || this.loading) {
        return `${base} bg-gray-300 text-gray-500 cursor-not-allowed`
      }
      return `${base} bg-blue-600 hover:bg-blue-700 text-white`
    },
  },
}
</script>
