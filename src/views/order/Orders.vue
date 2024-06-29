<template>
  <p
    v-if="!props.orders?.length"
    class="text-center py-3 text-slate-500"
  >
    Chưa có đơn nào được tạo
  </p>
  <article v-if="props.orders?.length">
    <section
      v-for="order in props.orders"
      class="overflow-hidden rounded-lg border"
      :class="getStatus(order, 'BORDER')"
    >
      <div
        class="text-white py-2 px-3 flex justify-between"
        :class="getStatus(order, 'BACKGROUND')"
      >
        <div class="flex items-center gap-2.5">
          <ArrowIcon />
          {{ order?.order_id }}
        </div>
        <div class="flex gap-5">
          <img :src="EditIcon" />
          <img :src="LinkIcon" />
        </div>
      </div>
      <div class="p-3">
        <ul class="flex gap-1">
          <li
            class="flex gap-1"
            v-for="item in order.order_journey"
          >
            <img :src="DoubleArrowIcon" />
            <p class="w-fit py-0.5 px-2 rounded-md"></p>
          </li>
        </ul>
      </div>
    </section>
  </article>
</template>
<script setup lang="ts">
// * icons
import ArrowIcon from '@/components/icons/ArrowIcon.vue'
import EditIcon from '@/assets/icons/edit.svg'
import LinkIcon from '@/assets/icons/link.svg'
import DoubleArrowIcon from '@/assets/icons/double-arrow.svg'

// * props
const props = defineProps<{
  orders: any[]
}>()

/** trạng thái của đơn hàng */
function getStatus(order: any, type: 'TEXT' | 'BORDER' | 'BACKGROUND') {
  let status = ''
  order.order_journey.some((sublist: any) => {
    const activeItem = sublist.find((item: any) => {
      return item.is_active
    })
    // nếu tìm thấy object có fiels is_active = true thì dừng duyệt
    if (activeItem) {
      // trả lại tiêu đề của trạng thái
      if (type === 'TEXT') status = activeItem.title
      // trả về màu chữ của trạng thái
      if (type === 'BORDER')
        status = activeItem.bg_color.replace('bg', 'border')
      if (type === 'BACKGROUND') status = activeItem.bg_color
      return true // Dừng duyệt nếu đã tìm thấy
    }
    return false // Tiếp tục duyệt
  })
  return status
}
</script>
