<template>
    <div class="w-full h-full flex justify-center items-center bg-slate-300">
        <div class="w-screen h-screen lg:w-[395px] lg:h-[300px] bg-white text-sm">
            <div v-if="tab !== 'FORM'" class="p-3 flex flex-col gap-2.5">
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
                            :class="tab === 'LIST' ? 'text-black bg-white shadow-md' : ''" @click="() => tab = 'LIST'">
                            Nhân sự phụ
                            trách</p>
                        <p class="w-1/2 rounded py-1 cursor-pointer"
                            :class="tab === 'LOAD' ? 'text-black bg-white shadow-md' : ''" @click="() => tab = 'LOAD'">
                            Đơn hàng
                        </p>
                    </div>
                    <ul v-if="tab === 'LIST'" class="max-h-[100px] overflow-y-auto scrollbar-thin">
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
                    <div v-if="tab === 'LOAD'">
                        <p class="text-center py-1 font-medium">Tính năng đang được phát triển...</p>
                    </div>
                </div>
                <div class="flex justify-end">
                    <p class="bg-slate-200 text-slate-700 pb-0.5 px-2 rounded-md cursor-pointer"
                        @click="() => tab = 'FORM'">
                        Thiết lập</p>
                </div>
            </div>
            <!-- FORM -->
            <div v-if="tab == 'FORM'" class="p-3 flex flex-col gap-2.5">
                <div>
                    <p @click="tab = 'LIST'"
                        class="flex items-center font-medium bg-slate-200 w-fit px-2 rounded-md cursor-pointer gap-1">
                        <img :src="ArrowIcon" alt="">
                        <span class="pb-0.5">Quay
                            lại</span>
                    </p>
                </div>
                <form class="flex flex-col gap-4 rounded-lg p-3 bg-slate-100">
                    <p v-if="status_submit === 'SUCCESS'" class="text-center text-green-600">Thiết lập thành công</p>
                    <p v-if="status_submit === 'ERROR'" class="text-center text-red-500">ID hoặc Token bị lỗi, vui lòng
                        kiểm tra lại</p>
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
                    <div class="flex justify-between items-center">
                        <button @click.prevent="onSubmit"
                            class="active:bg-green-500 rounded-md py-2 px-4 w-fit border bg-white hover:shadow-md">Kết
                            nối</button>
                        <div>
                            <p class="flex items-center gap-0.5 cursor-pointer"><img :src="GuidanceIcon" alt=""><span
                                    class="pb-0.5"><u>Hướng dẫn thiết lập</u></span>
                            </p>
                        </div>
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

/** loading */
const loading = ref<boolean>(false)

/** tab hiện tại */
const tab = ref<'LIST' | 'LOAD' | 'FORM'>('LIST')
/** Trạng thái của hành động submit form */
const status_submit = ref<'SUCCESS' | 'ERROR' | ''>('')
/** id của form */
const id = ref<string>('')
/** token của form */
const token = ref<string>('')
/** hàm xử lý submit form */
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