<template>
  <div class="mb-4">
    <label class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :class="inputClass"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <div v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'DefaultInputField',
  emits: ['update:modelValue'],
  props: {
    label: String,
    type: { type: String, default: 'text' },
    placeholder: String,
    modelValue: String,
    error: String,
  },

  computed: {
    inputClass() {
      const base = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2'

      if (this.error) {
        return `${base} border-red-300 focus:ring-red-500`
      }
      return `${base} border-gray-300 focus:ring-blue-500`
    },
  },
}
</script>
