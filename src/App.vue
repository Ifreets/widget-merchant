<template>
  <div class="w-screen h-screen">
    <!-- <Loading
      v-if="commonStore.is_loading_full_screen"
      type="FULL"
    /> -->
    <LoadingBar />
    <div class="h-full overflow-hidden overflow-y-auto">
      <router-view />
    </div>
    <Color />
  </div>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores'

//* components
import Loading from '@/components/Loading.vue'
import Color from '@/components/Color.vue'
import LoadingBar from '@/components/LoadingBar.vue';

const commonStore = useCommonStore()
</script>

<style lang="scss"></style>
