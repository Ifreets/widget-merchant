<template>
  <Modal
    v-if="is_show_modal_setting"
    :close="() => (is_show_modal_setting = false)"
  >
    <template #content>
      <article class="bg-white rounded-lg">
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
                  @click="is_show_dropbox = true"
                >
                  <span
                    v-if="!store?.chatbox_page_id"
                    class="text-gray-500"
                    >Chọn cửa hàng nhận đơn</span
                  >
                  <span v-else>{{ store?.name }}</span>
                  <ArrowIcon class="text-gray-500 w-4 h-4" />
                </button>
              </template>
              <template #box>
                <ul
                  class="w-full max-h-40 overflow-auto bg-white my-1 p-1 border rounded-md"
                  v-show="is_show_dropbox"
                >
                  <li
                    v-for="item in stores"
                    class="px-3 py-1 hover:bg-slate-100 rounded cursor-pointer"
                    @click="store = item, is_show_dropbox = false"
                  >
                    <p class="truncate">{{ item?.name || '' }}</p>
                  </li>
                </ul>
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
          <button
            class="cursor-pointer py-2 px-4 rounded-md border"
            @click="is_show_modal_setting = false"
          >
            Đóng
          </button>
          <button
            class="cursor-pointer py-2 px-4 rounded-md bg-blue-700 text-white"
            @click="updateSetting()"
          >
            Lưu lại
          </button>
        </footer>
      </article>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores'
import { Toast } from '@/service/helper/toast'
import { getStore } from '@/service/api/merchant'

// * libraries
import { onMounted, ref } from 'vue'
import WIDGET from 'bbh-chatbox-widget-js-sdk'

// * components
import Modal from '@/components/Modal.vue'
import Dropbox from '@/components/Dropbox.vue'

// * icons
import ArrowIcon from '@/components/icons/ArrowIcon.vue'

// * interfaces
import type { Store } from '@/service/interface'

// * store
const commonStore = useCommonStore()

// * toast
const $toast = new Toast()

/** danh sách cửa hàng */
const stores = ref<Store[]>([])

/** cửa hàng đang chọn */
const store = ref<Store>({})

/** ẩn hiện dropbox */
const is_show_dropbox = ref<boolean>(false)

/** ẩn hiệm modal */
const is_show_modal_setting = defineModel({
  type: Boolean,
  default: false,
})

onMounted(() => {
  getStores()
  store.value = commonStore.store
})

/** lấy danh sách cửa hàng */
async function getStores() {
  try {
    const res = await getStore({
      access_token: WIDGET.access_token,
      secret_key: $env.secret_key,
    })
    if (res?.data) stores.value = res.data
  } catch (e) {
    $toast.error(e as string)
  }
}

/** lưu lại cài đặt */
async function updateSetting() {
  try {
    if (!store.value?.chatbox_page_id) return

    await WIDGET.saveConfig({
      brand_name: 'widget-merchant',
      type_config: 'CRM',
      config_data: {
        store: store.value,
      },
    })
    commonStore.store = store.value
    $toast.success('Lưu thiết lập thành công')
  } catch (e) {
    $toast.error(e as string)
  }
}
</script>
