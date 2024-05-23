<template>
  <div class="w-screen h-screen">
    <Network />
    <AdBlocker />
    <Loading v-if="commonStore.is_loading_full_screen" type="FULL" />
    <div class="h-full overflow-hidden overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores'
import Loading from '@/components/Loading.vue'
import Network from './components/Network.vue'
import AdBlocker from './components/AdBlocker.vue'
import WIDGET from 'bbh-chatbox-widget-js-sdk';
import { onMounted } from 'vue';

const commonStore = useCommonStore()

WIDGET.onEvent(async () => {
  // ghi lại thông tin khách hàng mới
  commonStore.data_client = await WIDGET.decodeClient()
})
onMounted(async () => {
  // khai báo biến lưu trữ dữ liệu khách hàng + init dữ liệu lần đầu
  commonStore.data_client = await WIDGET.decodeClient()
  // [optional] lắng nghe khách hàng thay đổi ở chế độ post message
})

</script>

<style lang="scss">
@import "@/assets/css/index.scss";
</style>