<template>
  <div
    v-if="commonStore.is_loading_full_screen"
    class="loading-bar"
    :style="{ width: `${progress}%` }"
  ></div>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores';
import { ref, watch } from 'vue'

const commonStore = useCommonStore()

const progress = ref(0)
let intervalId: number

watch(
  () => commonStore.is_loading_full_screen,
  () => {
    if (commonStore.is_loading_full_screen) {
      startLoading()
    } else {
      stopLoading()
    }
  }
)

function startLoading() {
  progress.value = 0

  // Tăng dần tiến độ đến 90% trong khi chờ API hoàn tất
  intervalId = setInterval(() => {
    if (progress.value < 90) {
      progress.value += 2
    }
  }, 100) // Tăng dần mỗi 100ms
}

function stopLoading() {
  // Khi API hoàn tất, hoàn thành thanh tiến trình
  progress.value = 100

  // Dừng và reset lại sau khi đạt 100%
  setTimeout(() => {
    clearInterval(intervalId)
    progress.value = 0
  }, 500) // Giữ thanh 100% trong 500ms rồi reset lại
}
</script>

<style scoped>
.loading-bar {
  @apply fixed top-0 left-0 h-1 bg-[#7217bd3f] z-50 transition-all ease-linear;
}
</style>
