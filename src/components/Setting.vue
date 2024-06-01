<template>
  <div
    v-if="['SETTING', 'SETTING_NO_TOKEN'].includes(appStore?.tab)"
    class="p-3 flex flex-col gap-2.5"
  >
    <div class="h-6">
      <p
        @click="appStore.tab = 'USER'"
        v-if="appStore?.tab === 'SETTING'"
        class="flex items-center font-medium bg-slate-200 w-fit px-2 rounded-md cursor-pointer gap-1"
      >
        <img :src="ArrowIcon" alt="" />
        <span class="pb-0.5">Quay lại</span>
      </p>
    </div>
    <form class="flex flex-col gap-4 rounded-lg p-3 bg-slate-100">
      <p v-if="status_submit === 'SUCCESS'" class="text-center text-green-600">
        Thiết lập thành công
      </p>
      <p v-if="status_submit === 'ERROR'" class="text-center text-red-500">
        ID hoặc Token bị lỗi, vui lòng kiểm tra lại
      </p>
      <div class="flex flex-col gap-1">
        <label class="font-medium" for=""
          >Nhập ID Business <span class="text-red-500">*</span></label
        >
        <input
          v-model="commonStore.id_business"
          class="outline-none pb-1.5 pt-1 px-3 rounded-md border"
          type="text"
          placeholder="Nhập ID"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label class="font-medium" for=""
          >Nhập Token Business <span class="text-red-500">*</span></label
        >
        <input
          v-model="commonStore.token_business"
          class="outline-none pb-1.5 pt-1 px-3 rounded-md border"
          type="text"
          placeholder="Nhập Token"
        />
      </div>
      <div class="flex justify-between items-center">
        <button
          @click.prevent="onSubmit"
          class="active:bg-green-500 rounded-md py-2 px-4 w-fit border bg-white hover:shadow-md"
        >
          Kết nối
        </button>
        <div>
          <a :href="link_guild" target="_blank" rel="noopener noreferrer">
            <p class="flex items-center gap-0.5 cursor-pointer">
              <img :src="GuidanceIcon" alt="" />
              <span class="pb-0.5"><u>Hướng dẫn thiết lập</u></span>
            </p>
          </a>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
//* import function
import { request } from '@/service/helper/asyncRequest'
//* import library
import {
  computed,
  getCurrentInstance,
  inject,
  ref,
  type InjectionKey,
} from 'vue'
import WIDGET from 'bbh-chatbox-widget-js-sdk'
//* import icon
import ArrowIcon from '@/assets/icons/arrow-icon.svg'
import GuidanceIcon from '@/assets/icons/guidance-icon.svg'
import { useAppStore, useCommonStore } from '@/stores'
import { keySynchData } from '@/service/constant'

/** store */
const appStore = useAppStore()
const commonStore = useCommonStore()

/** Trạng thái của hành động submit form */
const status_submit = ref<'SUCCESS' | 'ERROR' | ''>('')

/** link hướng dẫn thiết lập */
const link_guild = computed(() => $env.link_guild)

/** hàm đồng bộ khai báo từ trang home */
const synchData = inject(keySynchData)

/** hàm xử lý khi submit */
async function onSubmit() {
  try {
    // khi chưa nhập đủ các field sẽ báo lỗi
    // if (!commonStore.id_business || !commonStore.token_business) {
    //   status_submit.value = 'ERROR'
    //   return
    // }
    // bật loading
    commonStore.is_loading_full_screen = true
    // call API check token có hợp lệ không
    // let r: any = await request({
    //   uri: 'https://api.merchant.vn/v1/apps/info/profile',
    //   method: 'GET',
    //   headers: {
    //     'token-business': commonStore.token_business,
    //   },
    // })
    //tắt loading
    commonStore.is_loading_full_screen = false
    // nếu thành công thì lưu token vừa nhập vào widget sdk
    // if (r.status !== 200) {
    //   status_submit.value = 'ERROR'
    //   return
    // }
    // lưu id, token vào widget sdk
    await WIDGET.saveConfig({
      brand_name: 'widget-merchant',
      type_config: 'CRM',
      config_data: {
        id_business: commonStore.id_business,
        token_business: commonStore.token_business,
      },
    })
    status_submit.value = 'SUCCESS'
    // Nếu là lần đầu nhập id và token thì đồng bộ dữ liệu
    if (appStore.tab !== 'SETTING_NO_TOKEN' || !synchData) return
    await synchData(commonStore.token_business)
    // đẩy sang giao diện thông tin của người dùng
    appStore.tab = 'USER'
  } catch (error) {
    console.log('verify widget', error)
    status_submit.value = 'ERROR'
  }
}
</script>
