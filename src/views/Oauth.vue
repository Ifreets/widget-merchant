<template>
  <div class="h-full w-full flex justify-center items-center">
    <div class="flex flex-col gap-5 items-center">
      <p class="text-3xl text-center px-3">
        Để cài đặt Widget vui lòng nhập token và nhấn kích hoạt
      </p>
      <input
        class="w-80 px-3 py-2 rounded-lg border-2"
        type="text"
        placeholder="Nhập token"
        v-model="commonStore.token_business"
      />
      <button
        @click="onOauth"
        class="bg-blue-400 active:bg-blue-600 py-2 px-10 text-white text-xl w-fit rounded-lg font-medium"
      >
        Kích hoạt
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import WIDGET from 'bbh-chatbox-widget-js-sdk'
import { useCommonStore } from '@/stores'
import { confirm } from '@/service/helper/alert'
import { request } from '@/service/helper/asyncRequest'
import { Toast } from '@/service/helper/toast'
import { get } from 'lodash'

// * store
const commonStore = useCommonStore()

/** Toast */
const $toast = new Toast()

/** hàm kích hoạt widget */
async function onOauth() {
  try {
    //check xem có token chưa
    if (!commonStore.token_business) {
      let result = await confirm(
        'error',
        'Vui lòng nhập token',
        'Nhấn OK để tắt'
      )
      // nếu nhấn OK tắt, đóng giao diện
      if (!result.isConfirmed) return
    }

    // call API check token có hợp lệ không
    let r: any = await request({
      uri: 'https://api.merchant.vn/v1/apps/info/profile',
      method: 'GET',
      json: true,
      headers: {
        'token-business': commonStore.token_business,
      },
    }) 

    // kích hoạt widget
    await WIDGET.oAuth(commonStore.token_business)

    // // lưu id, token vào widget sdk
    // r = await WIDGET.saveConfig({
    //   brand_name: 'widget-merchant',
    //   type_config: 'CRM',
    //   config_data: {
    //     token_business: commonStore.token_business,
    //   },
    // })

    // mở ra modal thông báo thành công
    let result = await confirm('success', 'Oauth thành công', 'Nhấn OK để tắt')
    // nếu nhấn OK tắt, đóng giao diện
    if (!result.isConfirmed) return
    window.close()
  } catch (e) {
    // console.log('oauth widget', e)
    let message:any = get(e, 'response.data.context_error.message') ||
    get(e, 'response.data.message') ||
    get(e, 'response.data') ||
    get(e, 'message') ||
    get(e, 'error_message') ||
    e
    $toast.error(message)
  }
}
</script>
<style scoped lang="scss"></style>
