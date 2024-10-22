<template>
  <!-- Overlay Modal -->
  <div
    id="default-modal"
    tabindex="-1"
    aria-hidden="true"
    class="fixed top-0 right-0 z-20 w-screen h-screen bg-black/30"
    @click="$props.close?.()"
  ></div>
  <!-- Modal content -->
  <div class="fixed h-fit top-0 left-0 z-20 shadow mx-8 translate-y-20">
    <slot name="content"></slot>
  </div>

</template>

<script setup lang="ts">
const $props = defineProps<{
  close?: Function
}>()
</script>
