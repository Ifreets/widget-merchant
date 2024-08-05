<template>
  <article class="py-1 px-3 text-sm flex flex-col gap-2 overflow-hidden h-dvh">
    <Header
      v-model="current_tab"
      class="flex-shrink-0"
    />
    <Orders
      v-if="merchantStore.current_tab === 'ORDERS'"
      :contact_id="contact_id"
    />
    <CreateOrder v-if="merchantStore.current_tab === 'CREATE_ORDER'" />
  </article>
</template>
<script setup lang="ts">
// * libraries
import { ref, onMounted } from 'vue'
import WIDGET from 'bbh-chatbox-widget-js-sdk'
import { queryString } from '@/service/helper/queyString'
import { useAppStore, useCommonStore, useMerchantStore } from '@/stores'
import {
  syncContact,
  getProvince,
  getSetting,
  getEmployee,
} from '@/service/api/merchant'

// * components
import Header from '@/views/order/Header.vue'
import Orders from '@/views/order/Orders.vue'
import CreateOrder from '@/views/order/CreateOrder.vue'

// * Types
import type { IConfigWidget } from '@/service/interface'

/** store */
const appStore = useAppStore()
const commonStore = useCommonStore()
const merchantStore = useMerchantStore()

/** tab hiện tại */
const current_tab = ref<'ORDERS' | 'CREATE_ORDER'>('ORDERS')

/** id contact */
const contact_id = ref<string>('')

// lắng nghe sự kiện từ chatbox
WIDGET.onEvent(async () => {
  load()
})

onMounted(async () => {
  load()
})

/** hàm call API đồng bộ dữ liệu sang merchant */
async function synchData() {
  try {
    // * lưu lại total order
    merchantStore.saveTotalOrder(0)

    // * lưu lại tab hiện tại
    merchantStore.saveCurrentTab('')

    // * Reset order
    merchantStore.saveOrderEdit({})

    // * lưu lại tab hiện tại
    merchantStore.saveCurrentTab('ORDERS')

    /** Thông tin contact từ merchant */
    const contact = await syncContact()

    // * Lưu lại id contact
    contact_id.value = contact.identifier_id

    // * Lưu lại thông tin contact
    merchantStore.saveMerchantContact(contact)

    /** Lấy danh sách tỉnh thành */
    const provinces = await getProvince({})

    // * Lưu lại danh sách tỉnh thành
    merchantStore.saveProvinces(provinces)

    /** Lấy setting */
    const setting = await getSetting({ type: 'order' })

    // * Lưu lại setting
    merchantStore.saveSetting(setting.value)

    /** Lấy danh sách nhân viên */
    const employees = await getEmployee({})

    // * Lưu lại danh sách nhân viên
    merchantStore.saveEmployees(employees.data)
  } catch (error) {
    console.log('synch to merchant', error)
  }
}

/** hàm thực thi khi mở đoạn chat hoặc chuyển đoạn chat */
async function load() {
  try {
    // bật loading
    commonStore.is_loading_full_screen = true
    
    // * ghi lại thông tin khách hàng mới
    appStore.data_client = await WIDGET.decodeClient()

    // lưu token business vào store store
    commonStore.token_business = appStore.data_client.public_profile?.token_partner || ''
    
    //đồng bộ dữ liệu
    await synchData()

    if(getFieldParam()) {
      merchantStore.current_tab = 'CREATE_ORDER'
      appStore.is_auto_create = true
    }
    //tắt loading
    commonStore.is_loading_full_screen = false

  } catch (error) {
    console.log('load home', error)
    //chuyển tab setting
    appStore.tab = 'SETTING_NO_TOKEN'
    //tắt loading
    commonStore.is_loading_full_screen = false
  }
}

// lấy dữ liệu từ param
function getFieldParam(): boolean {
  let email = queryString('email')
  let phone = queryString('phone')
  let address = queryString('address')

  return !! (email || phone || address)
}

</script>
