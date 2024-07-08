<template>
  <p
    v-if="!orders?.length"
    class="text-center py-3 text-slate-500"
  >
    Chưa có đơn nào được tạo
  </p>
  <article
    v-if="orders?.length"
    class="overflow-y-auto h-full scrollbar-thin flex flex-col gap-2"
  >
    <section v-for="order in orders">
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
import SingleOrder from '@/views/order/SingleOrder.vue'

// * Interfaces
import type { Order } from '@/service/interface';

// * props
const props = defineProps<{
  contact_id: string
}>()

/** Store */
const merchantStore = useMerchantStore()

/** Danh sách đơn hàng */
const orders = ref<Order[]>([])

/** Hiện box từ bên ngoài */
watch(
  () => props.contact_id,
  () => {
    console.log('watch contact_id =>>>>>>>', props.contact_id)
    getOrders()
  }
)

onMounted(() => {
  console.log("props.contact_id ===>", props.contact_id)
  if(props.contact_id) getOrders()
})

/** Lấy danh sách đơn hàng */
async function getOrders() {
  orders.value = await getOrder({
    contact_id: props.contact_id
  })
  if(orders.value[0] && orders.value[0].id) {
    merchantStore.saveShowOrderId(orders.value[0].id)
  }
  merchantStore.saveTotalOrder(orders.value.length)
}

</script>
