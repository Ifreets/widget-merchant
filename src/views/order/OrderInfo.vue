<template>
  <div>
    <!-- Order ID -->
    <div
      class="text-white py-2 px-3 flex justify-between"
      :class="{
        [current_action?.bg_color || 'bg-black']: true,
        'rounded-t-lg': merchantStore.show_order_id === props.order?.id,
        'rounded-lg': merchantStore.show_order_id !== props.order?.id,
      }"
      @click="toogleOrder()"
    >
      <div class="flex items-center gap-2.5 cursor-pointer">
        <ArrowIcon
          :class="{
            '-rotate-90': merchantStore.show_order_id !== props.order?.id,
          }"
        />
        {{ props.order?.order_id }}
      </div>
      <div class="flex gap-2">
        <img
          :src="EditIcon"
          class="w-4.5 h-4.5 cursor-pointer"
          @click.stop="editOrder"
        />
        <img
          :src="LinkIcon"
          class="w-4.5 h-4.5 cursor-pointer"
          @click.stop="openOrderDetail"
        />
      </div>
    </div>
    <div
      class="p-3 flex flex-col gap-1 border border-t-transparent rounded-b-lg"
      :class="
        current_action?.bg_color?.replace('bg', 'border') || 'border-black'
      "
      v-if="merchantStore.show_order_id == props.order?.id"
    >
      <OrderJourney :order="props.order" />
      <!-- Tên khách hàng -->
      <div class="grid grid-cols-2 font-medium">
        <div class="flex items-center gap-1">
          <img :src="UserIcon" />
          <p>
            {{ getFullName(order) }}
          </p>
        </div>
        <div class="flex items-center gap-1">
          <img :src="PhoneIcon" />
          <p>{{ props.order.contact_info?.suggest_phone }}</p>
        </div>
      </div>
      <!-- Địa chỉ giao hàng -->
      <div class="flex items-center gap-1">
        <img :src="ShipIcon" />
        <p>{{ getAddress() }}</p>
      </div>
      <!-- Số lượng sản phẩm -->
      <div class="grid grid-cols-2 border-b pb-1">
        <div class="flex items-center gap-1">
          <img :src="BagIcon" />
          <p>{{ props.order.quantity }} sản phẩm</p>
        </div>
        <div class="flex items-center gap-1">
          <img :src="WeightIcon" />
          <p>0 g</p>
        </div>
      </div>
      <!-- Thanh toán -->
      <div class="border-b pb-1">
        <div class="flex items-center gap-1 mb-2">
          <img :src="CreditCardIcon" />
          <p class="font-semibold">Thanh toán</p>
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex justify-between">
            <p class="flex items-center">
              <span class="h-1 w-1 mx-2 rounded-full bg-black block"></span>
              <span>Tổng tiền</span>
            </p>
            <p class="font-bold text-green-700">
              {{ currency(props.order.total_money) }}
            </p>
          </div>
          <div class="flex justify-between">
            <p class="flex items-center">
              <span class="h-1 w-1 mx-2 rounded-full bg-black block"></span>
              <span>Đã thanh toán</span>
            </p>
            <p class="font-bold text-blue-700">
              {{ currency(props.order.money_paid) || 0 }}
            </p>
          </div>
          <div class="flex justify-between">
            <p class="flex items-center">
              <span class="h-1 w-1 mx-2 rounded-full bg-black block"></span>
              <span>Còn phải thu</span>
            </p>
            <p class="font-bold text-red-500">
              {{ currency(props.order.money_unpaid) || 0 }}
            </p>
          </div>
        </div>
      </div>
      <!-- Ghi chú -->
      <div class="flex gap-1">
        <img :src="PenIcon" />
        <p class="whitespace-nowrap">Ghi chú:</p>
        <p class="truncate pl-4">
          {{ props.order.note || props.order.internal_note }}
        </p>
      </div>
      <!-- Dự kiến nhận hàng -->
      <div class="flex justify-between">
        <p class="flex gap-1">
          <img :src="CalendarIcon" />
          <span>Dự kiến nhận hàng:</span>
        </p>
        <p class="font-semibold text-slate-500">Chưa có</p>
      </div>
      <!-- Cập nhật lần cuối -->
      <div class="flex justify-between">
        <p class="flex gap-1">
          <img :src="ClockIcon" />
          <span>Cập nhật lần cuối:</span>
        </p>
        <p>
          {{
            formatDistanceToNowStrict(props.order.updatedAt as Date, {
              locale: vi,
            })
          }}
          trước
        </p>
      </div>
      <!-- Người sửa cuối -->
      <div class="flex justify-between">
        <div class="flex items-center gap-1">
          <img :src="BagIcon" />
          <p>Người sửa cuối</p>
        </div>
        <div class="flex items-center gap-1">
          <span
            v-if="!merchantStore.employees_ids[last_employee]?.avatar"
            class="rounded-full w-5 h-5 bg-sky-600 text-[10px] text-white flex items-center justify-center"
          >
            {{
              convertEmployeeName(
                merchantStore.employees_ids[last_employee]?.first_name,
                merchantStore.employees_ids[last_employee]?.last_name
              )
            }}
          </span>
          <object
            v-if="merchantStore.employees_ids[last_employee]?.avatar"
            :data="merchantStore.employees_ids[last_employee]?.avatar"
            type="image/png"
            class="w-4 h-4 rounded-full"
          >
            <span
              class="rounded-full w-5 h-5 bg-sky-600 text-[10px] text-white flex items-center justify-center"
            >
              {{
                convertEmployeeName(
                  merchantStore.employees_ids[last_employee]?.first_name,
                  merchantStore.employees_ids[last_employee]?.last_name
                )
              }}
            </span>
          </object>
          <p>
            {{ merchantStore.employees_ids[last_employee]?.first_name }}
            {{ merchantStore.employees_ids[last_employee]?.last_name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { vi } from 'date-fns/locale'
import { useMerchantStore } from '@/stores'
import { currency } from '@/service/helper/format'
import { formatDistanceToNowStrict } from 'date-fns'
import { convertEmployeeName } from '@/service/helper/format'

/** Components */
import OrderJourney from '@/views/order/OrderJourney.vue'

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

import type { Order, ActionStep } from '@/service/interface'

// * props
const props = defineProps<{
  order: Order
}>()

/** store */
const merchantStore = useMerchantStore()

/** trạng thái hiện tại của đơn hàng */
const current_action = ref<ActionStep>()

/** nhân viên cuối cùng cập nhật */
const last_employee = ref<string>('')

onMounted(() => {
  getStatus()
  getActionLog()
})

/** Lấy ra hành trình đơn hiện tại của khách hàng */
function getStatus() {
  /** Lấy ra hành trình đơn hàng */
  let order_journey = props.order.order_journey || []
  // * Duyệt qua từng bước hành trình
  order_journey.map(step => {
    step.map(action => {
      if (action.is_active) {
        current_action.value = action
      }
    })
  })
}

/** Ẩn hiện order */
function toogleOrder() {
  if (props.order?.id !== merchantStore.show_order_id) {
    merchantStore.saveShowOrderId(props.order?.id || '')
  } else {
    merchantStore.saveShowOrderId('')
  }
}

/** Lấy tên khách hàng */
function getFullName(order: any) {
  let first_name = order.contact_info.first_name || ''
  let last_name = order.contact_info.last_name || ''
  return `${last_name} ${first_name}`
}

/** Lấy địa chỉ */
function getAddress() {
  let province = props.order.locations?.province || {}
  let district = props.order.locations?.district || {}
  let ward = props.order.locations?.ward || {}
  let address = props.order?.address || ''
  if (ward.name) address += `, ${ward.name}`
  if (district.name) address += `, ${district.name}`
  if (province.name) address += `, ${province.name}`
  return address
}

/** Lấy ra actions logs */
function getActionLog() {
  let logs = props.order.action_logs || []
  let last_log = logs[logs.length - 1] || {}
  last_employee.value = last_log.employee_id || ''
}

/** Mở trang chi tiết đơn hàng */
function openOrderDetail() {
  let order_id = props.order?.order_id
  window.open(`https://merchant.vn/a/order?id=${order_id}`, '_blank')
}

/** Chỉnh sửa đơn hàng */
function editOrder() {
  merchantStore.saveOrderEdit(props.order)
  merchantStore.saveCurrentTab('CREATE_ORDER')
}

</script>
