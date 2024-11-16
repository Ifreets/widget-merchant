<template>
  <div
    class="text-xs font-medium w-full flex gap-2 items-center overflow-x-scroll flex-shrink-0 scrollbar-thin"
  >
    <div
      v-for="(step, index) in order.order_journey"
      class="flex items-center gap-1.5 whitespace-nowrap min-w-max"
      :class="{
        // 'opacity-30': activeStep(index),
      }"
    >
      <div
        v-for="(status, index_status) in step"
        v-if="stepIndexActive() >= index"
      >
        <button
          v-if="activeStatus(step) === index_status"
          :id="`${index}_${index_status}`"
          class="text-white rounded-md px-2 py-0.5 text-xs"
          :class="`${status.bg_color} ${status.text_color}`"
        >
          {{ status.title }}
        </button>
      </div>
      <VMenu v-else>
        <p
          class="px-2 py-0.5 border rounded-md border-slate-500 text-slate-700 cursor-default"
        >
          {{ index === 1 ? 'Xác nhận' : '' }}
          {{ index === 2 ? 'Giao hàng' : '' }}
          {{ index === 3 ? 'Kết thúc' : '' }}
        </p>
        <template
          #popper
          v-if="stepIndexActive() + 1 === index"
        >
          <ul class="border w-40 text-sm p-1">
            <li
              v-for="(status, index_status) in step"
              class="cursor-pointer hover:bg-slate-100 rounded-md px-2 py-1"
              @click="updateStatus(status)"
            >
              <button>
                {{ status.title }}
              </button>
            </li>
          </ul>
        </template>
      </VMenu>
      <img
        v-if="index !== Number(order.order_journey?.length) - 1"
        :src="ChevronsBlackIcon"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

// * Icons
import ChevronsBlackIcon from '@/assets/icons/chevrons-right-black.svg'

// * Interfaces
import type { Order, ActionStep } from '@/service/interface'
import { Toast } from '@/service/helper/toast'
import { updateOrder } from '@/service/api/merchant'

//* Props
const props = defineProps<{
  order: Order
  update: Function
}>()

const $toast = new Toast()

onMounted(() => {
  scollToLastStep()
})

/** Trả về index step đang kích hoạt */
function stepIndexActive(): number {
  let index_step = 0
  props.order.order_journey?.map((step, step_index) => {
    step.map((status, index) => {
      if (status.is_active) index_step = step_index
    })
  })
  return index_step
}

/** Active step */
function activeStep(index: number) {
  if (!props.order.id) return true
  if (index === 0) return false
  if (index > stepIndexActive()) return true
  return false
}

/** Active trạng thái đơn hàng */
function activeStatus(step: ActionStep[]) {
  let index = 0
  step.map((status, index_status) => {
    if (status.is_active) index = index_status
  })
  return index
}

function scollToLastStep() {
  let index_step = 0
  let index_action = 0
  props.order.order_journey?.map((step, step_index) => {
    step.map((status, index) => {
      if (status.is_active) {
        index_step = step_index
        index_action = index
      }
    })
  })
  const element = document.getElementById(`${index_step}_${index_action}`)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    })
  }
}

async function updateStatus(status: ActionStep) {
  try {
    const res = await updateOrder({
      id: props.order.id,
      last_order_journey: {
        ...status,
        is_active: true,
      },
      status: status.action,
    })
    props.update(res)
  } catch (e) {
    $toast.error(e as string)
  }
}
</script>

<style>
.v-popper__popper .v-popper__wrapper .v-popper__arrow-container {
  display: none !important;
}
</style>
