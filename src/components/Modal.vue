<template>
  <!-- Modal content -->
  <div class="fixed h-screen w-screen top-0 left-0 z-30 shadow px-8 pt-4 pb-8">
    <slot name="content"></slot>
  </div>

  <!-- Overlay Modal -->
  <div
    id="overlay-modal"
    class="fixed top-0 right-0 z-20 w-screen h-screen bg-black/30"
    @click="$props.close && $props.close()"
  ></div>
</template>

<script setup lang="ts">
const $props = defineProps<{
  close?: Function
}>()
</script>
