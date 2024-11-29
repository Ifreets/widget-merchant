<template>
  <div class="w-screen h-screen">
    <!-- <Loading
      v-if="commonStore.is_loading_full_screen"
      type="FULL"
    /> -->
    <LoadingBar />
    <div class="h-full overflow-hidden">
      <router-view />
    </div>
    <Color />
  </div>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores'

// * libraries
import { onMounted } from 'vue';
import WIDGET from 'bbh-chatbox-widget-js-sdk';

// * components
import Color from '@/components/Color.vue'
import LoadingBar from '@/components/LoadingBar.vue';

const commonStore = useCommonStore()

onMounted(async () => {
  const res = await WIDGET.getConfig({
    brand_name: 'widget-merchant',
    type_config: 'CRM',
  })
  if(res?.store){
    commonStore.store = res.store
  }
})

</script>

<style lang="scss"></style>
