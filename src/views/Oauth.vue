<template>
  <div class="h-full w-full flex justify-center items-center">
    <div class="flex flex-col gap-5 items-center">
      <p class="text-3xl">Để cài đặt Widget vui lòng nhấn kích hoạt</p>
      <button
        @click="onOauth"
        class="bg-blue-400 active:bg-blue-600 py-2 px-10 text-white text-2xl w-fit"
      >
        Kích hoạt
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import WIDGET from 'bbh-chatbox-widget-js-sdk'

import { confirm } from '@/service/helper/alert'

/** hàm kích hoạt widget */
async function onOauth() {
  try {
    // kích hoạt widget
    await WIDGET.oAuth()
    // mở ra modal thông báo thành công
    let result = await confirm('success', 'Oauth thành công', 'Nhấn OK để tắt')
    // nếu nhấn OK tắt, đóng giao diện
    if (!result.isConfirmed) return
    window.close()
  } catch (error) {
    console.log('oauth widget', error)
  }
}
</script>
<style scoped lang="scss"></style>
