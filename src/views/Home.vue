<template>
  <div class="w-full h-full flex justify-center items-center bg-slate-300">
    <div class="w-screen h-screen sm:w-[395px] sm:h-[300px] bg-white text-sm">
      <div
        v-if="['LIST', 'LOAD'].includes(appStore.tab)"
        class="p-3 flex flex-col gap-2.5"
      >
        <div class="w-full flex gap-2.5">
          <img
            loading="lazy"
            :src="appStore?.getUserAvatar()"
            class="h-16 w-16 rounded-3xl"
          />
          <div class="w-full flex flex-col gap-1">
            <div
              class="h-fit w-full flex justify-between items-center border-b py-1"
            >
              <p class="text-base truncate w-64">
                <span class="font-medium">
                  {{ appStore?.getClientName() }}
                </span>
                {{ appStore?.getClientEmail() }}
              </p>
              <a
                :href="appStore?.getLinkToMerchant()"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img :src="InfoIcon" class="h-4 w-4" />
              </a>
            </div>
            <div class="font-medium">
              <p class="text-sky-600">Số điện thoại</p>
              <p class="truncate w-60">{{ customer_info?.phone }}</p>
            </div>
          </div>
        </div>
        <div class="py-1 px-3 bg-slate-100 rounded-lg">
          <div
            class="flex py-2 text-center font-medium text-[#71717A] border-b"
          >
            <p
              class="w-1/2 rounded py-1 cursor-pointer"
              :class="
                appStore.tab === 'LIST' ? 'text-black bg-white shadow-md' : ''
              "
              @click="appStore.tab = 'LIST'"
            >
              Nhân sự phụ trách
            </p>
            <p
              class="w-1/2 rounded py-1 cursor-pointer"
              :class="
                appStore.tab === 'LOAD' ? 'text-black bg-white shadow-md' : ''
              "
              @click="appStore.tab = 'LOAD'"
            >
              Đơn hàng
            </p>
          </div>
          <ListEmployee
            v-if="appStore.tab === 'LIST'"
            v-model:tab="appStore.tab"
            :list_employee="list_employee"
          />
          <div v-if="appStore.tab === 'LOAD'">
            <p class="text-center py-1 font-medium">
              Tính năng đang được phát triển...
            </p>
          </div>
        </div>
        <div class="flex justify-end">
          <p
            class="bg-slate-200 text-slate-700 pb-0.5 px-2 rounded-md cursor-pointer"
            @click="appStore.tab = 'FORM'"
          >
            Thiết lập
          </p>
        </div>
      </div>
      <!-- FORM -->
      <Form
        v-if="appStore.tab == 'FORM' || appStore.tab == 'FORM_NO_TOKEN'"
        :synchData="synchData"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
//* import function
import { request } from '@/service/helper/asyncRequest'
import { useAppStore, useCommonStore } from '@/stores'

//* import library
import { onMounted, ref } from 'vue'
import WIDGET from 'bbh-chatbox-widget-js-sdk'
import size from 'lodash/size'

//* import component
import ListEmployee from '@/components/ListEmployee.vue'
import Form from '@/components/Form.vue'

//* import icon
import InfoIcon from '@/assets/icons/info-icon.svg'

//* import interface
import type { IConfigWidget } from '@/service/interface'
import { getAllEmployee } from '@/service/helper/getAllEmploy'

/** store */
const appStore = useAppStore()
const commonStore = useCommonStore()

/** danh sách nhân viên */
const list_employee = ref<any>([])
/** thông tin khách hàng */
const customer_info = ref<{
  /** link ảnh đại diện */
  avatar?: string
  /** email */
  email?: string
  /** số điện thoại */
  phone?: string
  /** id contact merchent */
  id_contact_merchant?: string
}>()

WIDGET.onEvent(async () => {
  load()
})

onMounted(async () => {
  load()
})

/** hàm call API đồng bộ dữ liệu sang merchant */
async function synchData(token_business: string) {
  try {
    // nếu không có thông tin khách hàng thì không đồng bộ dữ liệu
    if (!size(appStore.data_client)) return
    // call API đóng bộ dữ liệu sang merchant
    let result = await request({
      uri: 'https://api-contact.merchant.vn/contact/chatbox_sync_contact',
      method: 'POST',
      body: appStore.data_client,
      json: true,
      headers: {
        'token-business': token_business,
      },
    })
    // nếu đồng bộ thành công thì
    if (result.message || !result) return
    list_employee.value = result.assigned_employees || []

    customer_info.value = {
      avatar: result?.avatar,
      email: result?.suggest_email,
      phone: result?.suggest_phone,
      id_contact_merchant: result?.identifier_id,
    }
  } catch (error) {
    console.log('synch to merchant', error)
  }
}
/** hàm xử lý lấy tất cả nhân viên */
async function fetchAllEmployee(
  /** id doanh nghiệp */
  id_business: string,
  /** token doanh nghiệp */
  token_business: string,
  /** danh sách nhân viên được giao phụ trách khách hàng */
  list_employee: string[]
) {
  /** lấy danh sách toàn bộ nhân viên */
  let result = await getAllEmployee(id_business, token_business, list_employee)
  if (!result) return
  commonStore.listAllEmployee = result
}
/** hàm thực thi khi mở đoạn chat hoặc chuyển đoạn chat */
async function load() {
  // bật loading
  commonStore.is_loading_full_screen = true
  // ghi lại thông tin khách hàng mới
  appStore.data_client = await WIDGET.decodeClient()
  //call API lấy token từ widget
  let res: IConfigWidget | null = await WIDGET.getConfig({
    brand_name: 'widget-merchant',
    type_config: 'CRM',
  })
  // nếu có sẽ vào dashboard và đồng bộ dữ liệu, nếu không sẽ vào form
  if (!res?.token_business || !res?.id_business) {
    appStore.tab = 'FORM_NO_TOKEN'
    //tắt loading
    commonStore.is_loading_full_screen = false
    return
  }
  //đồng bộ dữ liệu
  await synchData(res?.token_business)
  //lấy danh sách tất cả nhân viên
  await fetchAllEmployee(
    res.id_business,
    res.token_business,
    list_employee.value
  )
  //lưu id_business, token_business vào store
  commonStore.id_business = res.id_business || ''
  commonStore.token_business = res.token_business
  appStore.tab = 'LIST'
  //tắt loading
  commonStore.is_loading_full_screen = false
}
</script>
