<template>
    <div class="w-full h-full flex justify-center items-center bg-slate-300">
        <div class="w-[395px] h-[300px] bg-white text-sm">
            <div v-if="tab !== 2" class="p-3 flex flex-col gap-2.5">
                <div class="w-full flex gap-2.5">
                    <img :src="Avatar" class="h-16 w-16 rounded-3xl" alt="" srcset="">
                    <div class="w-full flex flex-col gap-1">
                        <div class="h-fit w-full flex justify-between items-center border-b py-1">
                            <p class="text-base">
                                <span class="font-medium">Nguyễn Văn A</span> (@hoang.manh.2923)
                            </p>
                            <img :src="InfoIcon" class="h-4 w-4" alt="" srcset="">
                        </div>
                        <div class="font-medium">
                            <p class="text-sky-600">Số điện thoại</p>
                            <p>******1058,******1293</p>
                        </div>
                    </div>
                </div>
                <div class="py-1 px-3 bg-slate-100 rounded-lg">
                    <div class="flex py-2 text-center font-medium text-[#71717A] border-b">
                        <p class="w-1/2 rounded py-1 cursor-pointer"
                            :class="tab === 0 ? 'text-black bg-white shadow-md' : ''" @click="() => tab = 0">Nhân sự
                            phụ
                            trách</p>
                        <p class="w-1/2 rounded py-1 cursor-pointer"
                            :class="tab === 1 ? 'text-black bg-white shadow-md' : ''" @click="() => tab = 1">Đơn hàng
                        </p>
                    </div>
                    <ul v-if="tab === 0">
                        <li v-for="i in 2" class="flex justify-between items-center py-1 border-b">
                            <div class="flex items-center gap-2">
                                <img :src="Avatar" class="h-8 w-8 rounded-xl" alt="" srcset="">
                                <div class="flex flex-col">
                                    <p class="font-medium">Hoàng Đức Mạnh</p>
                                    <p class="text-xs text-slate-500">BU Hà Nội</p>
                                </div>
                            </div>
                            <p class="bg-green-600 text-white rounded-md pb-0.5 px-2">Dev</p>
                        </li>
                    </ul>
                </div>
            </div>

            <Loading v-if="loading" type="FULL" text="Đang tải..." />
        </div>
    </div>
</template>
<script setup lang="ts">
//* import library
import { ref } from 'vue';

//* import service
import { useCommonStore } from '@/stores';
import { Toast } from '@/service/helper/toast';

//* import component
import Loading from '@/components/Loading.vue';

//* import icon
import Avatar from '@/assets/imgs/avatar.png'
import InfoIcon from '@/assets/icons/info-icon.svg'


/** store */
const commonStore = useCommonStore()

/** Sử dụng toast */
const $toast = new Toast()

const loading = ref<boolean>(false)
const tab = ref<number>(0)


</script>
<style scoped lang="scss"></style>