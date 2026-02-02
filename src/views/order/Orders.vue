<template>
  <div
    v-if="!merchantStore.orders?.length"
    class="flex flex-col gap-2 items-center py-3 px-2 h-full w-full"
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
    ref="scroll_container"
    class="overflow-y-auto h-full scrollbar-thin flex flex-col gap-2 px-2 w-full"
  >
    <section v-for="(order, index) in merchantStore.orders">
      <OrderInfo
        :order="order"
        :update="(order: Order) => (merchantStore.orders[index] = order)"
      />
    </section>
  </article>
</template>
<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
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

/** Ref cho container scroll */
const scroll_container = ref<HTMLElement | null>(null)
let touch_start_y = 0

/**
 * Xử lý touch start để lưu vị trí bắt đầu
 * @param e TouchEvent
 */
function onTouchStart(e: TouchEvent) {
  touch_start_y = e.touches[0].clientY
}

/**
 * Xử lý touch move để chặn rubber-band ở top
 * Giúp hành vi kéo xuống khi đang ở top truyền ra ngoài (cho logic đóng popup)
 * @param e TouchEvent
 */
function onTouchMove(e: TouchEvent) {
  const el = scroll_container.value
  if (!el) return

  const current_y = e.touches[0].clientY
  const dy = current_y - touch_start_y
  const scroll_top = el.scrollTop

  // Nếu đang ở đỉnh và kéo xuống -> chặn scroll bounce của div
  // Để event bubble lên parent xử lý
  if (scroll_top <= 0 && dy > 0) {
    if (e.cancelable) {
      e.preventDefault()
    }
  }
}

/** Watch element để gán sự kiện (do dùng v-if) */
watch(scroll_container, (el, old_el) => {
  if (old_el) {
    old_el.removeEventListener('touchstart', onTouchStart)
    old_el.removeEventListener('touchmove', onTouchMove)
  }
  if (el) {
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
  }
})

onUnmounted(() => {
  if (scroll_container.value) {
    scroll_container.value.removeEventListener('touchstart', onTouchStart)
    scroll_container.value.removeEventListener('touchmove', onTouchMove)
  }
})

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
  },
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
  if (isMobile()) {
    window.location.href = link_to_merchant.value
  } else {
    window.open(link_to_merchant.value, '_blank')
  }
}

/** hàm kiểm tra xem có phải là mobile không */
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
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
