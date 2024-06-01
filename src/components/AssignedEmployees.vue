<template>
  <ul
    v-if="appStore.tab === 'USER'"
    class="max-h-[100px] overflow-y-auto scrollbar-thin"
  >
    <li
      v-if="list_employee?.length"
      v-for="item in list_employee"
      class="flex justify-between items-center py-1 border-b"
    >
      <div class="flex items-center gap-2">
        <object
          class="h-8 w-8 rounded-xl"
          :data="commonStore.getAvatarEmployee(item)"
          type="image/png"
        >
          <img loading="lazy" :src="AvatarDefault" />
        </object>
        <div class="flex flex-col">
          <p class="font-medium max-w-48 truncate">
            {{ commonStore.getNameEmployee(item) }}
          </p>
          <p class="text-xs text-slate-500 max-w-48 truncate">
            {{ commonStore.getNameBranch(item) }}
          </p>
        </div>
      </div>
      <p
        class="bg-green-600 text-white rounded-md pb-0.5 px-2 max-w-20 truncate"
      >
        {{ commonStore.getNameDepartment(item) }}
      </p>
    </li>
    <p v-else class="text-center py-1 font-medium">Danh sách nhân viên trống</p>
  </ul>
</template>
<script setup lang="ts">
//* import function
import { useAppStore, useCommonStore } from '@/stores'
//* import icon && image
import AvatarDefault from '@/assets/imgs/default-avatar.png'
import WIDGET from 'bbh-chatbox-widget-js-sdk'
import { onMounted, ref } from 'vue'
import { getAllEmployee } from '@/service/helper/getAllEmploy'

//* props
const list_employee = defineModel<string[]>('list_employee')
/** store */
const commonStore = useCommonStore()
const appStore = useAppStore()

// lắng nghe sự kiện từ chatbox
WIDGET.onEvent(async () => {
  load()
})

onMounted(async () => {
  load()
})
async function load() {
  if (!list_employee.value) return
  //lấy danh sách tất cả nhân viên
  await fetchAllEmployee(
    commonStore.id_business,
    commonStore.token_business,
    list_employee.value
  )
}
/** hàm xử lý lấy tất cả nhân viên */
async function fetchAllEmployee(
  /** id doanh nghiệp */
  id_business: string,
  /** token doanh nghiệp */
  token_business: string,
  /** danh sách nhân viên được giao phụ trách khách hàng */
  list_employee: string[]
) {
  try {
    /** lấy danh sách toàn bộ nhân viên */
    let result = await getAllEmployee(
      id_business,
      token_business,
      list_employee
    )
    if (!result) return
    commonStore.listAllEmployee = result
  } catch (error) {
    console.log('get all employee home', error)
  }
}
</script>
