<template>
  <div class="mask is-squircle">
    <img
      v-if="!is_show_default"
      :src="avatar"
      @error="is_show_default = true"
    />
    <div
      v-if="is_show_default"
      class="bg-gray-300 h-full w-full flex items-center justify-center"
    >
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
<style>
.mask {
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: contain;
  mask-size: contain;
}

.mask.is-squircle {
  -webkit-mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' fill='none'%3E%3Cpath fill='%23000' d='M100 0C20 0 0 20 0 100s20 100 100 100 100-20 100-100S180 0 100 0z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' fill='none'%3E%3Cpath fill='%23000' d='M100 0C20 0 0 20 0 100s20 100 100 100 100-20 100-100S180 0 100 0z'/%3E%3C/svg%3E");
}
</style>
