<template>
  <img
    v-if="type === 'MINI'"
    width="25"
    height="25"
    class="animate-spin"
    :src="LoadingSvg"
  />

  <div
    v-else
    class="absolute top-0 left-0 w-full h-full bg-slate-200 bg-opacity-50 flex items-center justify-center z-[9999]"
  >
    <img width="30" height="30" class="animate-spin" :src="LoadingSvg" />
    <p class="text-orange-500 ml-2">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
import LoadingSvg from "@/assets/icons/loading.svg";

withDefaults(
  defineProps<{
    /**
     * MINI: chỉ có loading
     * FULL: phủ toàn trang
     */
    type?: "MINI" | "FULL";
    text?: string;
  }>(),
  {
    type: "MINI",
  }
);
</script>

<script lang="ts">
const text = "Đang tải dữ liệu ...";
</script>
