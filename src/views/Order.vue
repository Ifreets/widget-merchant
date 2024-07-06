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
    
    // * ghi lại thông tin khách hàng mới
    appStore.data_client = await WIDGET.decodeClient()

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

    // * lưu lại tab hiện tại
    merchantStore.saveCurrentTab('ORDERS')

  } catch (error) {
    console.log('synch to merchant', error)
  }
}

/** hàm thực thi khi mở đoạn chat hoặc chuyển đoạn chat */
async function load() {
  try {
    // bật loading
    commonStore.is_loading_full_screen = true
    let res: IConfigWidget | null = await WIDGET.getConfig({
      brand_name: 'widget-merchant',
      type_config: 'CRM',
    })

    // nếu có sẽ vào dashboard và đồng bộ dữ liệu, nếu không sẽ vào form
    if (!res?.token_business || !res?.id_business) {
      appStore.tab = 'SETTING_NO_TOKEN'
      //tắt loading
      commonStore.is_loading_full_screen = false
      return
    }
    //lưu id_business, token_business vào store
    commonStore.id_business = res.id_business || ''
    commonStore.token_business = res.token_business

    //đồng bộ dữ liệu
    await synchData()

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
</script>
