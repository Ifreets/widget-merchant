<template>
  <header>
    <div
      class="grid grid-cols-2 bg-slate-200 rounded-md overflow-hidden cursor-pointer p-1"
    >
      <span
        class="text-center py-1 rounded"
        :class="{
          'font-semibold bg-white': merchantStore.current_tab === 'ORDERS',
          'text-gray-500': merchantStore.current_tab !== 'ORDERS',
        }"
        @click="orderTab"
      >
        Đơn hàng ({{ merchantStore.orders?.length }})
      </span>
      <span
        class="text-center py-1 rounded"
        :class="{
          'font-semibold bg-white':
            merchantStore.current_tab === 'CREATE_ORDER',
          'text-gray-500': merchantStore.current_tab !== 'CREATE_ORDER',
        }"
        @click="() => {
          merchantStore.current_tab = 'CREATE_ORDER'
          merchantStore.saveOrderEdit(JSON.parse(JSON.stringify(INIT_ORDER)))
        }"
      >
        <span v-if="!merchantStore.order_edit.id">
          Tạo đơn
        </span>
        <span v-if="merchantStore.order_edit.id">
          #{{ merchantStore.order_edit.order_id }}
        </span>
      </span>
    </div>
  </header>
</template>
<script setup lang="ts">
import { INIT_ORDER } from '@/service/constant';
import { useMerchantStore } from '@/stores'
const merchantStore = useMerchantStore()
/** Chuyển qua tab đơn hàng */
function orderTab() {
  merchantStore.current_tab = 'ORDERS'
  merchantStore.saveOrderEdit({})
}

</script>
