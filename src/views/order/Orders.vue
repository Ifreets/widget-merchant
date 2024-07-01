<template>
  <p
    v-if="!props.orders?.length"
    class="text-center py-3 text-slate-500"
  >
    Chưa có đơn nào được tạo
  </p>
  <article
    v-if="props.orders?.length"
    class="overflow-y-auto h-full scrollbar-thin flex flex-col gap-2"
  >
    <section v-for="order in props.orders">
      <SingleOrder :order="order" />
    </section>
  </article>
</template>
<script setup lang="ts">
//* components
import SingleOrder from '@/views/order/SingleOrder.vue'

// * props
const props = defineProps<{
  orders: any[]
}>()
</script>
