<template>
  <p
    v-if="!merchantStore.orders?.length"
    class="text-center py-3 text-slate-500"
  >
    Chưa có đơn nào được tạo
  </p>
  <article
    v-if="merchantStore.orders?.length"
    class="overflow-y-auto h-full scrollbar-thin flex flex-col gap-2"
  >
    <section v-for="order in merchantStore.orders">
      <OrderInfo
        :order="order"
      />
    </section>
  </article>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useMerchantStore } from '@/stores';
import { getOrder } from '@/service/api/merchant';

// * Components
import OrderInfo from '@/views/order/OrderInfo.vue'

// * props
const props = defineProps<{
  contact_id: string
}>()

/** Store */
const merchantStore = useMerchantStore()

/** Hiện box từ bên ngoài */
watch(
  () => props.contact_id,
  () => {
    console.log("props.contact_id", props.contact_id)
    getOrders()
  }
)

/** Lấy danh sách đơn hàng */
async function getOrders() {
  merchantStore.orders = await getOrder({
    contact_id: props.contact_id
  })
  if(merchantStore.orders[0] && merchantStore.orders[0].id) {
    merchantStore.saveShowOrderId(merchantStore.orders[0].id)
  }
}

</script>
