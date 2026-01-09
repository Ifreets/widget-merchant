<template>
  <article class="text-sm flex flex-col gap-2 h-dvh relative">
    <button
      class="w-2 h-2 absolute top-0 left-0 z-20"
      @click="copyLink()"
    ></button>
    <!-- Skeleton loading -->
    <template v-if="is_loading">
      <!-- Header skeleton -->
      <div
        class="px-2 flex gap-1 w-full flex-shrink-0 items-center sticky top-0 z-10 pt-1 bg-white"
      >
        <div
          class="w-full grid grid-cols-2 bg-slate-200 rounded-md overflow-hidden p-1"
        >
          <div class="h-8 bg-slate-300 rounded animate-pulse"></div>
        </div>
        <div
          v-if="WIDGET.is_admin"
          class="w-5 h-5 bg-slate-300 rounded animate-pulse"
        ></div>
      </div>
      <!-- Content skeleton -->
      <div class="flex-1 flex flex-col gap-2 px-2">
        <div class="h-96 bg-slate-200 rounded animate-pulse"></div>
        <div class="h-10 bg-slate-300 rounded animate-pulse"></div>
      </div>
    </template>
    <!-- Nội dung thật -->
    <template v-else>
      <div
        class="px-2 flex gap-1 w-full flex-shrink-0 items-center sticky top-0 z-10 pt-1 bg-white"
      >
        <Header class="w-full" />
        <img
          v-tooltip="'Cài đặt'"
          v-if="WIDGET.is_admin"
          src="@/assets/icons/setting.svg"
          class="w-5 h-5 cursor-pointer"
          @click="is_show_modal_setting = true"
        />
      </div>
      <Orders
        v-if="merchantStore.current_tab === 'ORDERS'"
        :contact_id="contact_id"
      />
      <CreateOrder
        ref="create_order"
        v-if="merchantStore.current_tab === 'CREATE_ORDER'"
      />
      <DetailReportContact ref="detail_report_contact" />
      <ModalSetting
        v-if="is_show_modal_setting"
        v-model="is_show_modal_setting"
      />
    </template>
  </article>
</template>
<script setup lang="ts">
import {
  getConfigChatbox,
  getEmployee,
  syncContactV2,
} from '@/service/api/merchant'
import { INIT_ORDER } from '@/service/constant'
import { copy } from '@/service/helper/format'
import { useAppStore, useCommonStore, useMerchantStore } from '@/stores'

// * libraries
import WIDGET, { type ChatboxEvent } from 'bbh-chatbox-widget-js-sdk'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

// * components
import CreateOrder from '@/views/order/CreateOrder.vue'
import Header from '@/views/order/Header.vue'
import ModalSetting from '@/views/order/ModalSetting.vue'
import Orders from '@/views/order/Orders.vue'
import DetailReportContact from './order/DetailReportContact.vue'

/** store */
const appStore = useAppStore()
const commonStore = useCommonStore()
const merchantStore = useMerchantStore()
const { order_edit, current_tab } = storeToRefs(merchantStore)

/** id contact */
const contact_id = ref<string>('')
/** ẩn hiện modal cài đặt */
const is_show_modal_setting = ref<boolean>(false)
/** trạng thái loading */
const is_loading = ref<boolean>(true)
/** ref tới form tạo đơn hàng  */
const create_order = ref<InstanceType<typeof CreateOrder>>()
/** ref tới thống kê liên hệ */
const detail_report_contact = ref<InstanceType<typeof DetailReportContact>>()

// lắng nghe sự kiện từ chatbox
WIDGET.onEvent(async (error: any, data: ChatboxEvent) => {
  // nếu không phải sự kiện chuyển hội thoại khách hàng thì thôi
  if (data.type !== 'RELOAD') return

  // nếu là tạo mới thì reset lại form
  if (current_tab.value !== 'ORDERS') {
    order_edit.value = copy(INIT_ORDER)
    order_edit.value.order_journey = copy(
      merchantStore.setting?.online_status || []
    )
    create_order.value?.removeLocation('all', false)
  }
  // load lại dữ liệu
  loadV2()
})

onMounted(() => {
  loadV2()
})

/** load dữ liệu app */
async function loadV2() {
  try {
    // bật skeleton loading
    is_loading.value = true

    /** id tin nhắn */
    const MESSAGE_ID = WIDGET.message_id

    /** id bình luận */
    const COMMENT_ID = WIDGET.comment_id

    // nếu có id comment và id mess thì chuyển sang tự động tạo đơn
    if (
      (MESSAGE_ID && MESSAGE_ID !== 'undefined') ||
      (COMMENT_ID && COMMENT_ID !== 'undefined')
    ) {
      merchantStore.current_tab = 'CREATE_ORDER'
      appStore.is_auto_create = true
    }

    // lấy dữ liệu chatbot và merchant
    await Promise.all([getDataMerchant(), getDataChatbox()])

    // lấy dữ liệu report contact
    detail_report_contact.value?.getReporContact()

    // chạy đồng bộ dữ liệu sang merchant liên hệ
    syncAndGetContact()

    /** Lấy danh sách nhân viên */
    const employees = await getEmployee({})

    // * Lưu lại danh sách nhân viên
    merchantStore.saveEmployees(employees.data)
  } catch {
    // xử lý lỗi nếu cần
  } finally {
    // tắt skeleton loading
    is_loading.value = false
  }
}

/** lấy dữ liệu merchant */
async function getDataMerchant() {
  try {
    /** dữ liệu merchant */
    const DATA = await getConfigChatbox({
      body: {
        access_token: WIDGET.partner_token,
        client_id: WIDGET.client_id,
        secret_key: $env.secret_key,
      },
    })

    // nếu không có thì thôi
    if (!DATA.data) return

    // lưu lại danh sách đơn hàng
    merchantStore.orders = DATA.data?.orders
    // mở đơn đầu tiên
    if (merchantStore.orders?.[0]?.id) {
      merchantStore.saveShowOrderId(merchantStore.orders[0].id)
    }
    // lưu lại token merchant
    commonStore.token_business = DATA.data?.access_token
    /** lưu lại dữ liệu setting merchant */
    const SETTING = DATA.data?.setting
    // lưu lại setting vào store
    merchantStore.saveSetting(SETTING)
    // lưu lại hành trình đơn hàng
    merchantStore.order_edit.order_journey = SETTING?.online_status || []
    // lưu lại danh sách nhân viên
    merchantStore.order_edit.staffs = SETTING?.online_staff || []
  } catch (error) {
    throw error
  }
}

/** lấy dữ liệu chatbox */
async function getDataChatbox() {
  try {
    /** dữ liệu chatbot của khách hàng */
    const DATA = await WIDGET.getClientInfo()

    // nếu không có thì thôi
    if (!DATA) return
    // lưu lại dữ liệu
    appStore.data_client = DATA
  } catch (error) {
    throw error
  }
}

/** đồng bộ dữ liệu sang app Liên hệ */
async function syncAndGetContact() {
  try {
    /** Thông tin contact từ merchant */
    const contact = await syncContactV2({
      body: appStore.data_client,
    })

    // * Lưu lại id contact
    contact_id.value = contact.identifier_id

    // * Lưu lại thông tin contact
    merchantStore.saveMerchantContact(contact)

    // khởi tạo các giá trị của đơn hàng
    create_order.value?.initDataParams()

    // lấy danh sách địa chỉ đã nhập trước đó
    create_order.value?.getSelectedAddresses()

    /** lưu lại id contact */
    merchantStore.order_edit.contact_id = contact?.identifier_id
    // lưu lại dữ liệu danh bạ
    merchantStore.order_edit.contact_info = contact
  } catch (error) {
    throw error
  }
}

/** hàm sao chép link của url */
function copyLink() {
  const textarea = document.createElement('textarea')
  textarea.value = window.location.href
  textarea.style.position = 'fixed'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  console.log('Copied using fallback!')
}
</script>
