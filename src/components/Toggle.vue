<template>
  <label class="inline-flex items-center cursor-pointer relative">
    <input
      type="checkbox"
      v-model="value"
      class="sr-only peer"
      :disabled="props.disabled"
    />
    <div
      class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"
    ></div>
    <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300" v-if="props.title">
      {{ props.title }}
    </span>
  </label>
</template>

<script lang="ts" setup>

// * props
const props = defineProps<{
  title?: string
  disabled?: boolean
}>()

const value = defineModel<boolean>({
  default: false,
})
</script>
