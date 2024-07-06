<template>
    <div class="w-full flex gap-5 items-center overflow-scroll flex-shrink-0">
        <div
            v-for="(step, index) in order.order_journey"
            class="flex items-center gap-1.5 whitespace-nowrap"
            :class="{
                'opacity-30': activeStep(index),
            }"
        >
            <div v-for="(status, index_status) in step">
                <button
                    v-if="activeStatus(step) === index_status"
                    class="text-white rounded-md px-2 py-0.5 text-xs"
                    :class="`${status.bg_color} ${status.text_color}`"
                >
                    {{ status.title }}
                </button>
            </div>
            <img
                v-if="index !== Number(order.order_journey?.length) - 1"
                :src="ChevronsBlackIcon"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
// * Icons
import ChevronsBlackIcon from "@/assets/icons/chevrons-right-black.svg";

// * Interfaces
import type { Order, ActionStep } from '@/service/interface'

//* Props
const props = defineProps<{
    order: Order;
}>();

/** Trả về index step đang kích hoạt */
function stepIndexActive(): number {
    let index_step = 0;
    props.order.order_journey?.map((step, step_index) => {
        step.map((status, index) => {
            if (status.is_active) index_step = step_index;
        });
    });
    return index_step;
}

/** Active step */
function activeStep(index: number) {
    if (!props.order.id) return true;
    if (index === 0) return false;
    if (index > stepIndexActive()) return true;
    return false;
}

/** Active trạng thái đơn hàng */
function activeStatus(step: ActionStep[]) {
    let index = 0;
    step.map((status, index_status) => {
        if (status.is_active) index = index_status;
    });
    return index;
}
</script>
