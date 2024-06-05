<template>
  <div>
    <img v-if="!is_show_default" :src="avatar" @error="is_show_default = true" />
    <div v-if="is_show_default" class="bg-gray-300 h-full w-full flex items-center justify-center">
      {{ short_name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { convertName, nonAccentVn } from '@/service/helper/format'
import { computed, ref } from 'vue'

const props = defineProps<{
  /** link avatar */
  avatar: string
  /** tên người dùng */
  name: string
}>()

const is_show_default = ref(false)

/** tên rút gọn */
const short_name = computed(() => {
  return convertName(nonAccentVn(props.name))
})
</script>
