<template>
  <header>
    <div
      class="grid grid-cols-2 bg-slate-200 rounded-md overflow-hidden cursor-pointer p-1"
    >
      <span
        class="text-center py-1 rounded"
        :class="{
          'font-semibold bg-white': tab === 'ORDERS',
          'text-gray-500': tab !== 'ORDERS',
        }"
        @click="tab = 'ORDERS'"
      >
        Đơn hàng (0)
      </span>
      <span
        class="text-center py-1 rounded"
        :class="{
          'font-semibold bg-white': tab === 'CREATE_ORDER',
          'text-gray-500': tab !== 'CREATE_ORDER',
        }"
        @click="tab = 'CREATE_ORDER'"
      >
        Tạo đơn
      </span>
    </div>
  </header>
</template>
<script setup lang="ts">
const tab = defineModel<'ORDERS' | 'CREATE_ORDER'>({ default: 'ORDERS' })
</script>
