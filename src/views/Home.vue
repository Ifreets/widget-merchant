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
                            :class="tab === 0 ? 'text-black bg-white shadow-md' : ''" @click="() => tab = 0">Nhân sự phụ
                            trách</p>
                        <p class="w-1/2 rounded py-1 cursor-pointer"
                            :class="tab === 1 ? 'text-black bg-white shadow-md' : ''" @click="() => tab = 1">Đơn hàng
                        </p>
                    </div>
                    <ul v-if="tab === 0" class="max-h-[100px] overflow-y-auto scrollbar-thin">
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
                    <div v-if="tab === 1">
                        <p class="text-center py-1 font-medium">Tính năng đang được phát triển...</p>
                    </div>
                </div>
                <div class="flex justify-end">
                    <p class="bg-slate-200 text-slate-700 pb-0.5 px-2 rounded-md cursor-pointer" @click="() => tab = 2">
                        Thiết lập</p>
                </div>
            </div>
            <div v-if="tab == 2" class="p-3 flex flex-col gap-2.5">
                <div>
                    <p @click="tab = 0"
                        class="flex items-center font-medium bg-slate-200 w-fit px-2 rounded-md cursor-pointer gap-1">
                        <img :src="ArrowIcon" alt="">
                        <span class="pb-0.5">Quay
                            lại</span>
                    </p>
                </div>
                <form class="flex flex-col gap-2.5 rounded-lg p-3 bg-slate-100">
                    <div class="flex flex-col gap-1">
                        <label class="font-medium" for="">Nhập ID Business <span class="text-red-500">*</span></label>
                        <input v-model="id" class="outline-none pb-1.5 pt-1 px-3 rounded-md border" type="text"
                            placeholder="Nhập ID">
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="font-medium" for="">Nhập Token Business <span
                                class="text-red-500">*</span></label>
                        <input v-model="token" class="outline-none pb-1.5 pt-1 px-3 rounded-md border" type="text"
                            placeholder="Nhập Token">
                    </div>
                    <div v-if="status_submit !== 'SUCCESS'" class="flex justify-center">
                        <button @click.prevent="onSubmit"
                            class="bg-slate-600 active:bg-green-500 text-white rounded-md p-1 px-4 w-fit">Gửi</button>
                    </div>
                    <p v-if="status_submit === 'SUCCESS'" class="text-center text-green-600">Thiết lập thành công</p>
                    <p v-if="status_submit === 'ERROR'" class="text-center text-red-500">ID hoặc Token bị lỗi, vui lòng
                        kiểm tra lại</p>
                    <div>
                        <p class="flex items-center gap-0.5 cursor-pointer"><img :src="GuidanceIcon" alt=""><span
                                class="pb-0.5"><u>Hướng dẫn thiết lập</u></span>
                        </p>
                    </div>
                </form>
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

//* import component
import Loading from '@/components/Loading.vue';

//* import icon
import Avatar from '@/assets/imgs/avatar.png'
import InfoIcon from '@/assets/icons/info-icon.svg'
import ArrowIcon from '@/assets/icons/arrow-icon.svg'
import GuidanceIcon from '@/assets/icons/guidance-icon.svg'

/** store */
const commonStore = useCommonStore()

const loading = ref<boolean>(false)
const tab = ref<number>(0)
const status_submit = ref<'SUCCESS' | 'ERROR' | ''>('')
const id = ref<string>('')
const token = ref<string>('')

function onSubmit() {
    if (id.value && token.value && id.value === '123123123' && token.value === '123123123') {
        status_submit.value = 'SUCCESS'
    } else {
        status_submit.value = 'ERROR'
    }
}
</script>
<style scoped lang="scss">
.scrollbar-thin {
    scrollbar-width: thin;
}
</style>