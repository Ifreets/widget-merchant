<template>
  <div :class="{ 'opacity-30': !isEqual(status, journey) }">
    <p
      class="w-fit py-0.5 px-2 rounded-md whitespace-nowrap text-xs"
      :class="journey.bg_color + ' ' + journey.text_color"
    >
      {{ journey.title }}
    </p>
  </div>
</template>

<script setup lang="ts">
// * library
import { computed } from 'vue'
import isEqual from 'lodash/isEqual'

// * props
const props = defineProps<{
  journey: any
  status: any
}>()

/** trạng thái của giai đoạn */
const journey = computed(() => getJourney(props.journey))

/** hàm lấy trạng thái của giai đoạn */
function getJourney(journey: any): any {
  let result = journey[0]
  if (journey.length) {
    journey.some((item: any) => {
      if (item.is_active) result = item
    })
    return result
  }
}
</script>
