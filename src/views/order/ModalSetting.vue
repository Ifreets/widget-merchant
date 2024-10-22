<template>
  <Modal 
    v-if="is_show_modal_setting" 
    :close="() => is_show_modal_setting = false"
  >
    <template #content>
      <article class="bg-white mt-20 rounded-lg overflow-hidden">
        <header class="flex justify-between py-2 px-6">
          <h2 class="text-xl font-bold">Cài đặt</h2>
          <img
            src="@/assets/icons/close.svg"
            class="w-5 h-5 cursor-pointer"
            @click="is_show_modal_setting = false"
          />
        </header>
        <main class="border-y-2 py-3 px-6 flex flex-col gap-3">
          <section class="flex flex-col gap-1">
            <p class="font-medium">
              Chọn cửa hàng nhận đơn <span class="text-red-500">*</span>
            </p>
            <Dropbox>
              <template #trigger>
                <button
                  class="py-2 px-4 rounded-md border flex justify-between w-full items-center"
                >
                  Chọn cửa hàng nhận đơn
                  <ArrowIcon class="text-gray-500 w-4 h-4" />
                </button>
              </template>
            </Dropbox>
          </section>
          <p class="text-xs text-slate-700">
            Sau khi lưu, tất cả các đơn hàng sẽ được đẩy về cửa hàng được chọn.
            <br />
            Lưu ý: Các đơn hàng trước đó sẽ không tự động đồng bộ về cửa hàng
            được chọn.
          </p>
        </main>
        <footer class="flex justify-between font-medium py-2 px-6">
          <button class="cursor-pointer py-2 px-4 rounded-md border"
            @click="is_show_modal_setting = false"
          >
            Đóng
          </button>
          <button
            class="cursor-pointer py-2 px-4 rounded-md bg-blue-700 text-white"
          >
            Lưu lại
          </button>
        </footer>
      </article>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Dropbox from '@/components/Dropbox.vue'
import ArrowIcon from '@/components/icons/ArrowIcon.vue'
import Modal from '@/components/Modal.vue'

const is_show_modal_setting = defineModel({
  type: Boolean,
  default: false
})


</script>
