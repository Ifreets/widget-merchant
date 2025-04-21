<template>
  <article class="text-sm flex flex-col gap-2 h-dvh relative">
    <button
      class="w-2 h-2 absolute top-0 left-0 z-20"
      @click="copyLink()"
    ></button>
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
  </article>
</template>
<script setup lang="ts">
import {
  syncContact,
  getProvince,
  getSetting,
  getEmployee,
  getMerchantToken,
  getConfigChatbox,
} from '@/service/api/merchant'
import { Toast } from '@/service/helper/toast'
import { copy } from '@/service/helper/format'
import { INIT_ORDER } from '@/service/constant'
import { decodeClientV2 } from '@/service/api/chatbot'
import { queryString } from '@/service/helper/queyString'
import { checkPhone, checkEmail } from '@/service/helper/validate'
import { useAppStore, useCommonStore, useMerchantStore } from '@/stores'

// * libraries
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'
import WIDGET, { type ChatboxEvent } from 'bbh-chatbox-widget-js-sdk'

// * components
import Header from '@/views/order/Header.vue'
import Orders from '@/views/order/Orders.vue'
import CreateOrder from '@/views/order/CreateOrder.vue'
import ModalSetting from '@/views/order/ModalSetting.vue'
import DetailReportContact from './order/DetailReportContact.vue'

/** store */
const appStore = useAppStore()
const commonStore = useCommonStore()
const merchantStore = useMerchantStore()
const { order_edit, current_tab } = storeToRefs(merchantStore)

/** toast */
const $toast = new Toast()

/** id contact */
const contact_id = ref<string>('')

/** ẩn hiện modal cài đặt */
const is_show_modal_setting = ref<boolean>(false)

const create_order = ref<InstanceType<typeof CreateOrder>>()

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

onMounted(async () => {
  // load()
  loadV2()
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
    const contact = await syncContact({
      body: appStore.data_client,
    })

    // * Lưu lại id contact
    contact_id.value = contact.identifier_id

    // * Lưu lại thông tin contact
    merchantStore.saveMerchantContact(contact)

    /** Lấy danh sách tỉnh thành */
    const provinces = await getProvince({})

    // * Lưu lại danh sách tỉnh thành
    merchantStore.saveProvinces(provinces)

    /** Lấy setting */
    const setting = await getSetting({
      body: { type: 'order' },
    })

    // * Lưu lại setting
    merchantStore.saveSetting(setting.value)

    /** Lấy danh sách nhân viên */
    const employees = await getEmployee({})

    // * Lưu lại danh sách nhân viên
    merchantStore.saveEmployees(employees.data)

    // const profile = await getProfile()

    // merchantStore.profile = profile.data
  } catch (error) {
    console.log('synch to merchant', error)
  }
}

/** hàm thực thi khi mở đoạn chat hoặc chuyển đoạn chat */
async function load() {
  try {
    // bật loading
    commonStore.is_loading_full_screen = true

    const partner_token = queryString('partner_token')
    const client_id = queryString('client_id')
    const message_id = queryString('message_id')

    // * ghi lại thông tin khách hàng mới
    // appStore.data_client = await WIDGET.decodeClient()
    // appStore.data_client = await WIDGET.getClientInfo()
    const data = await decodeClientV2({
      body: {
        access_token: partner_token === 'undefined' ? null : partner_token,
        client_id: client_id === 'undefined' ? null : client_id,
        message_id: message_id === 'undefined' ? null : message_id,
        secret_key: $env.secret_key,
      },
    })

    if (data.data) {
      appStore.data_client = data.data
    }

    const res = await getMerchantToken({
      body: {
        access_token: WIDGET.access_token,
        // access_token: queryString('partner_token'),
        secret_key: $env.secret_key,
        ...(commonStore?.store?.chatbox_page_id
          ? {
              redirect_to_store: commonStore?.store?.chatbox_page_id,
            }
          : {}),
      },
    })

    if (res?.data) {
      // await WIDGET.oAuth(res.data)
      commonStore.token_business = res.data
    } else {
      $toast.error('Không thấy thông tin nhân sự trong merchant')
      throw 'Không thấy thông tin nhân sự trong merchant'
    }

    let { is_auto_create, phone } = getFieldParam()

    // lưu số điện thoại của khách nhận được từ AI nếu có vào contact để đồng bộ sang merchant
    if (appStore.data_client?.conversation_contact?.client_phone && phone)
      appStore.data_client.conversation_contact.client_phone = phone

    //đồng bộ dữ liệu
    await synchData()

    // nếu là tạo đơn tự động bằng AI thì chuyển sang tab tạo đơn và bật cờ lên
    if (is_auto_create) {
      merchantStore.current_tab = 'CREATE_ORDER'
      appStore.is_auto_create = true
    }

    //tắt loading
    commonStore.is_loading_full_screen = false
  } catch (error) {
    console.log('load home', error)
    // $toast.error(error as string)
    // $toast.error(queryString('partner_token') ?? 'Không có partner token trên url')
    // $toast.error(queryString('client_id') ?? 'Không có client id trên url')
    // $toast.error(queryString('message_id') ?? 'Không cá message id trên url')
    //chuyển tab setting
    // appStore.tab = 'SETTING_NO_TOKEN'
    //tắt loading
    commonStore.is_loading_full_screen = false
  }
}

async function loadV2() {
  try {
    /** id tin nhắn */
    const MESSAGE_ID = WIDGET.message_id

    /** id bình luận */
    const COMMENT_ID = WIDGET.comment_id

    if (
      (MESSAGE_ID && MESSAGE_ID !== 'undefined') ||
      (COMMENT_ID && COMMENT_ID !== 'undefined')
    ) {
      merchantStore.current_tab = 'CREATE_ORDER'
      appStore.is_auto_create = true
    }

    await Promise.all([getDataMerchant(), getDataChatbox()])

    detail_report_contact.value?.getReporContact()

    syncAndGetContact()

    /** Lấy danh sách nhân viên */
    const employees = await getEmployee({})

    // * Lưu lại danh sách nhân viên
    merchantStore.saveEmployees(employees.data)
  } catch {}
}

async function getDataMerchant() {
  try {
    const data = await getConfigChatbox({
      body: {
        access_token: WIDGET.partner_token,
        client_id: WIDGET.client_id,
        secret_key: $env.secret_key,
      },
    })
    if (!data.data) return
    merchantStore.orders = data.data?.orders
    if (merchantStore.orders[0] && merchantStore.orders[0].id) {
      merchantStore.saveShowOrderId(merchantStore.orders[0].id)
    }

    commonStore.token_business = data.data?.access_token
    const setting = data.data?.setting
    merchantStore.saveSetting(setting)
    merchantStore.order_edit.order_journey = setting?.online_status || []
    merchantStore.order_edit.staffs = setting?.online_staff || []
  } catch (error) {
    throw error
  }
}

async function getDataChatbox() {
  try {
    const partner_token = queryString('partner_token')
    const client_id = queryString('client_id')
    const message_id = queryString('message_id')

    // const data = await decodeClientV2({
    //   access_token: partner_token === 'undefined' ? null : partner_token,
    //   client_id: client_id === 'undefined' ? null : client_id,
    //   message_id: message_id === 'undefined' ? null : message_id,
    //   secret_key: $env.secret_key,
    // })
    const data = await WIDGET.getClientInfo()

    if (!data) return

    console.log('data', data)

    appStore.data_client = data

    create_order.value?.initDataParams()
  } catch (error) {
    throw error
  }
}

async function syncAndGetContact() {
  try {
    /** Thông tin contact từ merchant */
    const contact = await syncContact({
      body: appStore.data_client,
    })

    // * Lưu lại id contact
    contact_id.value = contact.identifier_id

    // * Lưu lại thông tin contact
    merchantStore.saveMerchantContact(contact)

    create_order.value?.getSelectedAddresses()

    merchantStore.order_edit.contact_id = contact?.identifier_id
    merchantStore.order_edit.contact_info = contact
  } catch (error) {
    throw error
  }
}

// lấy dữ liệu từ param
function getFieldParam() {
  /** data AI trả về */
  const AI_DATA = appStore.data_client?.public_profile?.ai?.[0]

  // lấy data từ url param
  let email = AI_DATA?.email?.[0]
  let phone = AI_DATA?.phone_number?.[0]
  let cta = AI_DATA?.cta

  console.log(cta)

  // check xem số điện thoại có hợp lệ hay không
  if (!phone || !checkPhone(phone)) phone = ''

  // check xem email có hợp lệ hay không
  if (!email || !checkEmail(email)) email = ''

  return {
    // nếu có cta thì is_auto_create bằng true
    is_auto_create: !!cta,
    phone,
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
