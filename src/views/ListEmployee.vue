<template>
    <ul v-if="tab === 'LIST'" class="max-h-[100px] overflow-y-auto scrollbar-thin">
        <li v-for="item in listEmployee" class="flex justify-between items-center py-1 border-b">
            <div class="flex items-center gap-2">
                <img :src="Avatar" class="h-8 w-8 rounded-xl" alt="" srcset="">
                <div class="flex flex-col">
                    <p class="font-medium max-w-48 truncate">{{ commonStore?.listAllEmployee[item].first_name + ' ' +
                        commonStore?.listAllEmployee[item].last_name }}</p>
                    <p class="text-xs text-slate-500 max-w-48 truncate">BU Hà Nội</p>
                </div>
            </div>
            <p class="bg-green-600 text-white rounded-md pb-0.5 px-2 max-w-20 truncate">Dev</p>
        </li>
    </ul>
</template>
<script setup lang="ts">
import Avatar from '@/assets/imgs/avatar.png'
import { getAllEmployee } from '@/service/helper/getAllEmploy';
import { useCommonStore } from '@/stores';
import { onMounted } from 'vue';

const commonStore = useCommonStore()

const tab = defineModel('tab', { default: "" })
const props = defineProps<{
    token: string
    id_client: string
    listEmployee: string[]
}>()
onMounted(() => {
    getAllEmployee(props.id_client, props.token, (data: any) => {
        commonStore.listAllEmployee = data;
    })
})

</script>