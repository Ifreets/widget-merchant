<template>
  <div class="flex items-center w-full pb-2 px-2"
    v-if="$merchant.current_tab === 'ORDERS'"
    :class="{
      'justify-between':customer_data?.report_order,
      'justify-end':!customer_data?.report_order
    }"
  >
    <VMenu
      :delay="0"
      v-if="customer_data?.report_order"
      :placement="'top'"
      :triggers="['hover', 'touch']"
    >
      <div
        class="flex items-center gap-2 border border-slate-200 rounded px-2 select-none"
        v-if="
          Object.values(customer_data?.report_order)[0]?.order_success || 
          Object.values(customer_data?.report_order)[0]?.order_fail
        "
      >
        <div class="bg-red-500 h-2 rounded-full w-20">
          <div
            class="bg-green-600 h-2 rounded-full"
            :style="{
              width: `${getWidthSuccessOrder()}px`,
            }"
          ></div>
        </div>
        <p class="font-medium">
          <span class="text-green-600">
            {{ Object.values(customer_data?.report_order)[0]?.order_success }}
          </span>
          <span class="text-slate-700">/</span>
          <span class="text-red-500">
            {{ Object.values(customer_data?.report_order)[0]?.order_fail }}
          </span>
        </p>
      </div>
      <template #popper>
        <div class="py-2.5 px-3 font-medium flex flex-col gap-1 w-44 text-sm">
          <p class="text-xs">Thông tin đơn của khách trên hệ thống:</p>
          <div class="flex justify-between">
            <p class="text-green-500">Đơn thành công</p>
            <p>
              {{ Object.values(customer_data?.report_order)[0]?.order_success }}
            </p>
          </div>
          <div class="flex justify-between">
            <p class="text-red-500">Đơn hoàn</p>
            <p>
              {{ Object.values(customer_data?.report_order)[0]?.order_fail }}
            </p>
          </div>
        </div>
      </template>
    </VMenu>
    <div class="flex gap-3">
      <a
        v-if="$app.data_client?.conversation_contact?.client_phone"
        :href="`zalo://conversation?phone=${$app.data_client?.conversation_contact?.client_phone}`"
        target="_blank"
        v-tooltip="'Xem Zalo'"
      >
        <ZaloIcon class="w-5 h-5" />
      </a>
      <a
        v-if="customer_data?.uid"
        :href="`https://m.me/${customer_data?.uid}`"
        target="_blank"
        v-tooltip="'Xem Messenger'"
      >
        <MessengerIcon class="w-5 h-5" />
      </a>
      <a
        v-if="customer_data?.uid"
        :href="`https://fb.com/${customer_data?.uid}`"
        target="_blank"
        v-tooltip="'Xem Facebook'"
      >
        <FacebookIcon class="w-5 h-5" />
      </a>
      <a
        v-if="contact?.identifier_id"
        class="flex-grow-0 flex-shrink-0 max-h-fit rounded border border-blue-700"
        :href="`https://merchant.vn/login?chat_access_token=${WIDGET.access_token}&redirect=https://merchant.vn/a/contact?id=${contact?.identifier_id}`"
        target="_blank"
        v-tooltip="'Thông tin khách hàng'"
      >
        <UserCircleIcon class="w-5 h-5 fill-blue-700" />
      </a>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Toast } from '@/service/helper/toast'
import { useAppStore, useMerchantStore } from '@/stores'
import { getContactReport } from '@/service/api/merchant'

// * libraries
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import WIDGET from 'bbh-chatbox-widget-js-sdk'

// * components

// * icons
import ZaloIcon from '@/components/icons/ZaloIcon.vue'
import FacebookIcon from '@/components/icons/FacebookIcon.vue'
import MessengerIcon from '@/components/icons/MessengerIcon.vue'
import UserCircleIcon from '@/components/icons/UserCircleIcon.vue'

// * interfaces
import type { PhoneData } from '@/service/interface'

// * stores
const $app = useAppStore()
const $merchant = useMerchantStore()
const { order_edit,contact } = storeToRefs($merchant)

const $toast = new Toast()

const customer_data = ref<PhoneData>({})

/** hàm tính chiều rộng của thống kê số đơn thành công */
function getWidthSuccessOrder(){
  const REPORT =  Object.values(customer_data.value?.report_order || {})

  const WIDTH = 80 

  if(!REPORT?.length || !REPORT[0].order_success) return 0

  if(!REPORT[0].order_fail) return WIDTH

  const TOTAL = REPORT[0].order_success + REPORT[0].order_fail
  
  return REPORT[0].order_success / TOTAL * WIDTH
}


/** hàm lấy dữ liệu thống kê khách hàng */
async function getReporContact() {
  try {
    customer_data.value = {}

    if (!$app.data_client?.conversation_contact?.client_phone) return

    customer_data.value = await getContactReport({
      body: {
        phone: $app.data_client?.conversation_contact?.client_phone,
      },
    })
  } catch (e) {
    console.log(e);
  }
}
/** mở truy cập sang merchant */
function openLink() {
  window.open(
    `https://merchant.vn/login?chat_access_token=${WIDGET.access_token}&redirect=https://merchant.vn/a/order`,
    '_blank'
  )
}

defineExpose({ getReporContact })
</script>
