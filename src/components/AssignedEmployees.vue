<template>
  <ul
    v-if="appStore.tab === 'USER'"
    class="max-h-[100px] overflow-y-auto scrollbar-thin"
  >
    <li
      v-if="props.list_employee?.length"
      v-for="item in props.list_employee"
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

//* props
const props = defineProps<{
  /** danh sách nhân viên phụ trách */
  list_employee: string[]
}>()
/** store */
const commonStore = useCommonStore()
const appStore = useAppStore()
</script>
