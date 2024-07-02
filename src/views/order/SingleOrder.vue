<template>
  <div
    class="overflow-hidden rounded-lg border"
    :class="status?.bg_color?.replace('bg', 'border')"
  >
    <div
      class="text-white py-2 px-3 flex justify-between"
      :class="status.bg_color"
    >
      <div
        class="flex items-center gap-2.5 cursor-pointer"
        @click="choosed_order_id = props.order?.id"
      >
        <ArrowIcon :class="{ '-rotate-90': !is_show_info }" />
        {{ props.order?.order_id }}
      </div>
      <div class="flex gap-2">
        <img
          :src="EditIcon"
          class="w-4.5 h-4.5 cursor-pointer"
        />
        <img
          :src="LinkIcon"
          class="w-4.5 h-4.5 cursor-pointer"
        />
      </div>
    </div>
    <div
      class="p-3 flex flex-col gap-1"
      v-if="is_show_info"
    >
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
        <div class="flex flex-col gap-1">
          <div class="flex justify-between">
            <p class="flex items-center">
              <span class="h-1 w-1 mx-2 rounded-full bg-black block"></span>
              <span>Tổng tiền</span>
            </p>
            <p class="font-bold text-green-700">604.000</p>
          </div>
          <div class="flex justify-between">
            <p class="flex items-center">
              <span class="h-1 w-1 mx-2 rounded-full bg-black block"></span>
              <span>Đã thanh toán</span>
            </p>
            <p class="font-bold text-blue-700">300.000</p>
          </div>
          <div class="flex justify-between">
            <p class="flex items-center">
              <span class="h-1 w-1 mx-2 rounded-full bg-black block"></span>
              <span>Còn phải thu</span>
            </p>
            <p class="font-bold text-red-500">304.000</p>
          </div>
        </div>
      </div>
      <div class="flex gap-1">
        <img :src="PenIcon" />
        <p class="whitespace-nowrap">Ghi chú:</p>
        <p class="truncate pl-4">
          Trước khi đến phải gọi khách để khách biết trước
        </p>
      </div>
      <div class="flex justify-between">
        <p class="flex gap-1">
          <img :src="CalendarIcon" />
          <span>Dự kiến nhận hàng:</span>
        </p>
        <p class="font-semibold text-slate-500">Chưa có</p>
      </div>
      <div class="flex justify-between">
        <p class="flex gap-1">
          <img :src="ClockIcon" />
          <span>Cập nhật lần cuối:</span>
        </p>
        <p>5 phút trước</p>
      </div>
      <div class="flex justify-between">
        <div class="flex items-center gap-1">
          <img :src="BagIcon" />
          <p>Người sửa cuối</p>
        </div>
        <div class="flex items-center gap-1">
          <img
            :src="AvatarOrderIcon"
            class="w-4 h-4"
          />
          <p>Nguyễn Đình Tùng</p>
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
import PenIcon from '@/assets/icons/pen.svg'
import CalendarIcon from '@/assets/icons/calendar.svg'
import ClockIcon from '@/assets/icons/clock.svg'
import AvatarOrderIcon from '@/assets/imgs/avatar-order.png'

// * props
const props = defineProps<{
  order: any
}>()

const choosed_order_id = defineModel({ default: '' })

const is_show_info = computed(() => {
  return props.order?.id === choosed_order_id.value
})

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
