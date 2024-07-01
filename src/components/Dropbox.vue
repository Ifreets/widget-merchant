<template>
  <div ref="fancy_ref">
    <div
      @click="showBox"
      ref="trigger_ref"
    >
      <slot name="trigger"></slot>
    </div>
    <div
      ref="box_ref"
      class="fixed z-[1000]"
    >
      <slot
        v-if="show == true"
        name="box"
      ></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { createPopper } from '@popperjs/core'

import type { ComponentRef } from '@/service/interface'

const $props = defineProps<{
  place?: any
  on?: Boolean
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

/**Mở modal */
function showBox() {
  /**Hiện modal dropdown */
  show.value = !show.value

  /** Tạo event khi click vào phần html trigger, gọi sang hàm handleClick */
  document.addEventListener('click', handleClick)

  /** Khi component render xong thì sẽ tạo mới hàm poper và truyền phần tử html vào */
  nextTick(() => {
    let trigger = trigger_ref.value,
      box = box_ref.value

    poperInstant.value = createPopper(trigger, box, {
      placement: $props.place || 'top',
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
