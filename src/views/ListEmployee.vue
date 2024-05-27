<template>
    <ul v-if="tab === 'LIST'" class="max-h-[100px] overflow-y-auto scrollbar-thin">
        <li v-for="item in list_employee" class="flex justify-between items-center py-1 border-b">
            <div class="flex items-center gap-2">
                <object class="h-8 w-8 rounded-xl" :data="commonStore?.listAllEmployee[item].avatar">
                    <img loading="lazy" :src="AvatarDefault">
                </object>
                <div class="flex flex-col">
                    <p class="font-medium max-w-48 truncate">{{ commonStore?.listAllEmployee[item].first_name + ' ' +
                        commonStore?.listAllEmployee[item].last_name }}</p>
                    <p class="text-xs text-slate-500 max-w-48 truncate">{{
                        commonStore?.listAllEmployee[item].branch.name }}</p>
                </div>
            </div>
            <p class="bg-green-600 text-white rounded-md pb-0.5 px-2 max-w-20 truncate">
                {{ commonStore?.listAllEmployee[item].department.name }}
            </p>
        </li>
    </ul>
</template>
<script setup lang="ts">
//* import function
import { getAllEmployee } from '@/service/helper/getAllEmploy';
import { useCommonStore } from '@/stores';
//* import library
import { onMounted } from 'vue';
//* import icon && image
import AvatarDefault from '@/assets/imgs/default-avatar.png'

//* props
const props = defineProps<{
    token: string
    id_client: string
    list_employee: string[]
}>()
const tab = defineModel('tab', { default: "" })

/** store */
const commonStore = useCommonStore()

onMounted(() => {
    commonStore.is_loading_full_screen = true
    // lấy danh sách toàn bộ nhân vi
    getAllEmployee(props.id_client, props.token, (data: any) => {
        commonStore.listAllEmployee = data;
        commonStore.is_loading_full_screen = false
    }, props.list_employee)
})

</script>