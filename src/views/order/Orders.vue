<template>
  <div
    v-if="!merchantStore.orders?.length"
    class="flex flex-col gap-2 items-center py-3 px-2 h-full"
  >
    <p class="text-slate-500">Chưa có đơn nào được tạo</p>
    <p
      class="flex gap-1 items-center cursor-pointer font-medium underline hover:text-blue-700"
      @click="openLink()"
    >
      Truy cập Merchant
      <LinkIcon class="w-4 h-4" />
    </p>
  </div>
  <article
    v-if="merchantStore.orders?.length"
    class="overflow-y-auto h-full scrollbar-thin flex flex-col gap-2 px-2"
  >
    <section v-for="(order, index) in merchantStore.orders">
      <OrderInfo
        :order="order"
        :update="(order: Order) => merchantStore.orders[index] = order"
      />
    </section>
  </article>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useCommonStore, useMerchantStore } from '@/stores'
import { getDeeplink, getOrder } from '@/service/api/merchant'

// * library
import WIDGET from 'bbh-chatbox-widget-js-sdk'

// * Components
import OrderInfo from '@/views/order/OrderInfo.vue'

// * icons
import LinkIcon from '@/components/icons/LinkIcon.vue'

// * interfaces
import type { Order } from '@/service/interface'

// * props
const props = defineProps<{
  contact_id: string
}>()

/** Store */
const commonStore = useCommonStore()
const merchantStore = useMerchantStore()

/** link tới merchant */
const link_to_merchant = ref<string>('')

onMounted(() => {
  // nếu là điện thoại thì lây deep link
  if (isMobile()) {
    getDeepLinks()
  } else {
    link_to_merchant.value = `https://merchant.vn/login?chat_access_token=${WIDGET.access_token}&redirect=https://merchant.vn/a/order`
  }
})

/** Hiện box từ bên ngoài */
watch(
  () => props.contact_id,
  () => {
    console.log('props.contact_id', props.contact_id)
    // getOrders()
  }
)

/** Lấy danh sách đơn hàng */
async function getOrders() {
  try {
    merchantStore.orders = await getOrder({
      body: {
        contact_id: props.contact_id,
      },
    })
    if (merchantStore.orders[0] && merchantStore.orders[0].id) {
      merchantStore.saveShowOrderId(merchantStore.orders[0].id)
    }
    commonStore.is_loading_full_screen = false
  } catch (e) {
    console.log(e)
  }
}

/** mở truy cập sang merchant */
function openLink() {
  window.open(link_to_merchant.value, '_blank')
}

/** hàm kiểm tra xem có phải là mobile không */
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

/** hàm lấy deep link */
async function getDeepLinks() {
  try {
    const RES = await getDeeplink({
      body: {
        redirect: 'https://merchant.vn/a/order',
        access_token: WIDGET.access_token,
      },
    })
    
    // lưu lại deep link
    link_to_merchant.value = RES?.data?.deeplink
  } catch (error) {
    console.log(error)
  }
}
</script>
