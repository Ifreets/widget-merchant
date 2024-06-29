<template>
  <article class="py-1 px-3 text-sm flex flex-col gap-2">
    <Header v-model="current_tab" />
    <Orders
      v-if="current_tab === 'ORDERS'"
      :orders="orders"
    />
    <CreateOrder v-if="current_tab === 'CREATE_ORDER'" />
  </article>
</template>
<script setup lang="ts">
// * libraries
import { ref } from 'vue'
import { mockup_orders } from '@/service/mockup'

// * components
import Header from '@/views/order/Header.vue'
import Orders from '@/views/order/Orders.vue'
import CreateOrder from '@/views/order/CreateOrder.vue'

/** tab hiện tại */
const current_tab = ref<'ORDERS' | 'CREATE_ORDER'>('ORDERS')

/** danh sách đơn hàng */
const orders = ref<any[]>(mockup_orders)
</script>
