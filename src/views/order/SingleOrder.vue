<template>
  <div
    class="overflow-hidden rounded-lg border"
    :class="status?.bg_color?.replace('bg', 'border')"
  >
    <div
      class="text-white py-2 px-3 flex justify-between"
      :class="status.bg_color"
    >
      <div class="flex items-center gap-2.5">
        <ArrowIcon />
        {{ props.order?.order_id }}
      </div>
      <div class="flex gap-5">
        <img :src="EditIcon" />
        <img :src="LinkIcon" />
      </div>
    </div>
    <div class="p-3 flex flex-col gap-1">
      <ul class="flex gap-1 overflow-auto scrollbar-horizontal pb-1">
        <li
          class="flex gap-1 min-w-max"
          v-for="journey in props.order.order_journey"
        >
          <img :src="DoubleArrowIcon" />
          <StepOrder
            :journey="journey"
            :status="status"
          />
        </li>
      </ul>
      <div class="grid grid-cols-2 font-medium">
        <div class="flex items-center gap-1">
          <img :src="UserIcon" />
          <p>
            {{ getFullName(order) }}
          </p>
        </div>
        <div class="flex items-center gap-1">
          <img :src="PhoneIcon" />
          <p>{{ order.contact_info.suggest_phone }}</p>
        </div>
      </div>
      <div class="flex items-center gap-1">
        <img :src="ShipIcon" />
        <p>Toà nhà Tây hà, 19 Tố Hữu, Phùng Khoang, Nam..</p>
      </div>
      <div class="grid grid-cols-2 border-b pb-1">
        <div class="flex items-center gap-1">
          <img :src="BagIcon" />
          <p>
            {{ props.order.quantity + ' sản phẩm' }}
          </p>
        </div>
        <div class="flex items-center gap-1">
          <img :src="WeightIcon" />
          <p>0 g</p>
        </div>
      </div>
      <div class="border-b pb-1">
        <div class="flex items-center gap-1">
          <img :src="CreditCardIcon" />
          <p class="font-semibold">Thanh toán</p>
        </div>
        <div>
          <div class="flex justify-between">
            <p><span></span><span>Tổng tiền</span></p>
            <p>604.000</p>
          </div>
          <div class="flex justify-between">
            <p><span></span><span>Đã thanh toán</span></p>
            <p>300.000</p>
          </div>
          <div class="flex justify-between">
            <p><span></span><span>Còn phải thu</span></p>
            <p>304.000</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// * library
import { computed } from 'vue'

// * components
import StepOrder from '@/views/order/StepOrder.vue'

// * icons
import ArrowIcon from '@/components/icons/ArrowIcon.vue'
import EditIcon from '@/assets/icons/edit.svg'
import LinkIcon from '@/assets/icons/link.svg'
import DoubleArrowIcon from '@/assets/icons/double-arrow.svg'
import UserIcon from '@/assets/icons/user.svg'
import PhoneIcon from '@/assets/icons/phone.svg'
import ShipIcon from '@/assets/icons/ship.svg'
import BagIcon from '@/assets/icons/bag.svg'
import WeightIcon from '@/assets/icons/weight.svg'
import CreditCardIcon from '@/assets/icons/credit-card.svg'

// * props
const props = defineProps<{
  order: any
}>()

// * trạng thái hiện tại của đơn hàng
const status = computed(() => getStatus(props.order))

/** trạng thái của đơn hàng */
function getStatus(order: any): any {
  let status = {}
  order.order_journey.some((sublist: any) => {
    const activeItem = sublist.find((item: any) => {
      return item.is_active
    })
    // nếu tìm thấy object có fiels is_active = true thì dừng duyệt
    if (activeItem) {
      status = activeItem
    }
    return false // Tiếp tục duyệt
  })
  return status
}

function getFullName(order: any) {
  return order.contact_info.first_name + ' ' + order.contact_info.last_name
}
</script>

<style scoped lang="scss">
// Màu của thumb
$color-thumb: #c4c3c3;
// Màu khi kéo thumb
$color-thumb-active: #888;

// custom lại scrolbar chiều ngang
.scrollbar-horizontal {
  // Ẩn scroll bar mặc định
  &::-webkit-scrollbar {
    // Độ rộng của scroll bar
    height: 6px;
    // Màu nền của track
    background: transparent;
  }

  &::-webkit-scrollbar-track {
    // Bo góc
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb {
    // Màu của thumb
    background-color: $color-thumb;
    // Bo góc
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb:active {
    // Màu khi kéo thumb
    background-color: $color-thumb-active;
  }
}

// custom lại scrollbar chiều dọc
.scrollbar-vertical {
  // Ẩn scroll bar mặc định
  &::-webkit-scrollbar {
    // Độ rộng của scroll bar
    width: 6px;
    // Màu nền của track
    background: transparent;
  }

  &::-webkit-scrollbar-track {
    // Bo góc
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb {
    // Màu của thumb
    background-color: $color-thumb;
    // Bo góc
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb:active {
    // Màu khi kéo thumb
    background-color: $color-thumb-active;
  }
}
</style>
