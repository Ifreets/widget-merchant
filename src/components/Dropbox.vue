<template>
  <div
    ref="fancy_ref"
    class="w-full relative"
  >
    <div
      @click="showBox"
      ref="trigger_ref"
    >
      <slot name="trigger"></slot>
    </div>
    <div
      ref="box_ref"
      class="absolute z-50 w-full right-0"
    >
      <slot
        v-if="show == true"
        name="box"
      ></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { createPopper } from '@popperjs/core'

import type { ComponentRef } from '@/service/interface/'

const $props = defineProps<{
  place?: any
  on?: Boolean
  show_box?: Boolean
}>()

/**Ẩn hiện data modal */
const show = ref<boolean>(false)
/**Gán giá trị hàm Poper */
const poperInstant = ref<any>()
/**Lấy phần tử html slot */
const box_ref = ref<ComponentRef>()
/**Lấy phần tử html trigger */
const trigger_ref = ref<ComponentRef>()
/**Lấy phần tử html của cả component */
const fancy_ref = ref<ComponentRef>()

/** Hiện box từ bên ngoài */
watch(
  () => $props.show_box,
  () => {
    console.log('$props.show_box ===>', $props.show_box)
    showBox()
  }
)

/**Mở modal */
function showBox() {
  /** Hiện modal dropdown */
  show.value = true

  /** Tạo event khi click vào phần html trigger, gọi sang hàm handleClick */
  document.addEventListener('click', handleClick)

  /**
   * Khi component render xong thì sẽ
   * - Tạo mới hàm poper
   * - Truyền phần tử html vào
   * */
  nextTick(() => {
    poperInstant.value = createPopper(trigger_ref.value, box_ref.value, {
      placement: $props.place || 'bottom',
    })
  })
}
/**Tắt dropdown khi click outside hoặc inside */
function handleClick(e: Event) {
  let fancy: ComponentRef = fancy_ref.value,
    click_out: boolean = true,
    parent: any

  const target = e.target
  if (target instanceof HTMLElement) {
    parent = target.parentNode
  }
  if (fancy) {
    /** check xem có click outside hay ko */
    while (parent !== null && parent !== fancy) {
      parent = parent.parentNode
      if (fancy === parent) click_out = false
    }

    /** nếu click outside thì ẩn dropdown đi */
    if (click_out == true) {
      show.value = false

      /**Loại bỏ sử kiện đã tạo và destroy poper */
      document.removeEventListener('click', handleClick)
      nextTick(() => {
        poperInstant.value.destroy()
        poperInstant.value = null
      })
    }
  }
}
</script>
