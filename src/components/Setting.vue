<template>
    <div
        v-if="['SETTING', 'SETTING_NO_TOKEN'].includes(appStore?.tab)"
        class="p-3 flex flex-col gap-2.5 text-gray-900"
    >
        <div class="h-5">
            <p
                @click="appStore.tab = 'USER'"
                v-if="appStore?.tab === 'SETTING'"
                class="flex items-center font-medium bg-slate-200 w-fit px-3 rounded-md cursor-pointer gap-0.5 select-none"
            >
                <img :src="ArrowIcon" alt="" />
                <span class="py-1 text-xs">Quay lại</span>
            </p>
        </div>
        <form class="flex flex-col gap-3 rounded-lg p-3 bg-slate-100">
            <p
                v-if="status_submit === 'SUCCESS'"
                class="text-center text-green-600 font-medium"
            >
                Thiết lập thành công !
            </p>
            <p
                v-if="status_submit === 'ERROR'"
                class="text-center text-red-500 font-medium"
            >
                {{ text_error }}
            </p>
            <div class="flex flex-col gap-1">
                <label class="font-medium" for=""
                    >Nhập ID Business <span class="text-red-500">*</span></label
                >
                <input
                    v-model="commonStore.id_business"
                    class="outline-none py-2 px-3 rounded-md border"
                    type="text"
                    placeholder="Nhập ID"
                />
            </div>
            <div class="flex flex-col gap-1">
                <label class="font-medium" for=""
                    >Nhập Token Business
                    <span class="text-red-500">*</span></label
                >
                <input
                    v-model="commonStore.token_business"
                    class="outline-none py-2 px-3 rounded-md border"
                    type="text"
                    placeholder="Nhập Token"
                />
            </div>
            <div class="flex justify-between items-center">
                <button
                    @click.prevent="onSubmit"
                    class="active:bg-green-500 rounded-md py-1.5 px-4 w-fit border select-none bg-white hover:shadow-md"
                >
                    Kết nối
                </button>
                <div>
                    <a
                        :href="link_guild"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <p
                            class="flex items-center gap-0.5 cursor-pointer select-none"
                        >
                            <img :src="GuidanceIcon" alt="" />
                            <span class="pb-0.5 text-xs px-0.5"
                                ><u>Hướng dẫn thiết lập</u></span
                            >
                        </p>
                    </a>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
//* import function
import { request } from '@/service/helper/asyncRequest'
//* import library
import {
    computed,
    getCurrentInstance,
    inject,
    ref,
    type InjectionKey,
} from 'vue'
import WIDGET from 'bbh-chatbox-widget-js-sdk'
//* import icon
import ArrowIcon from '@/assets/icons/arrow-icon.svg'
import GuidanceIcon from '@/assets/icons/guidance-icon.svg'
import { useAppStore, useCommonStore } from '@/stores'
import { keySynchData } from '@/service/constant'

/** store */
const appStore = useAppStore()
const commonStore = useCommonStore()

/** Trạng thái của hành động submit form */
const status_submit = ref<'SUCCESS' | 'ERROR' | ''>('')

/**  */
const text_error = ref('ID hoặc Token bị lỗi, vui lòng kiểm tra lại !')

/** link hướng dẫn thiết lập */
const link_guild = computed(() => $env.link_guild)

/** hàm đồng bộ khai báo từ trang home */
const synchData = inject(keySynchData)

/** hàm xử lý khi submit */
async function onSubmit() {
    try {
        // khi chưa nhập đủ các field sẽ báo lỗi
        if (!commonStore.id_business || !commonStore.token_business)
            throw { message: 'ID hoặc Token bị lỗi, vui này kiểm tra lại !' }

        // bật loading
        commonStore.is_loading_full_screen = true

        // call API check token có hợp lệ không
        let r: any = await request({
            uri: 'https://api.merchant.vn/v1/apps/info/profile',
            method: 'GET',
            json: true,
            headers: {
                'token-business': commonStore.token_business,
            },
        })
        // tokem id lỗi
        if (!r?.data?._id)
            throw { message: 'ID hoặc Token bị lỗi, vui này kiểm tra lại !' }

        // nếu thành công thì lưu token vừa nhập vào widget sdk
        // lưu id, token vào widget sdk
        r = await WIDGET.saveConfig({
            brand_name: 'widget-merchant',
            type_config: 'CRM',
            config_data: {
                id_business: commonStore.id_business,
                token_business: commonStore.token_business,
            },
        })
        if (!(r.message === 'SAVE CONFIG SUCCESS'))
            throw { message: 'Không lưu được ID và token trên chatbot' }

        // Nếu là lần đầu nhập id và token thì đồng bộ dữ liệu
        if (appStore.tab !== 'SETTING_NO_TOKEN' || !synchData) {
            status_submit.value = 'SUCCESS'
            //tắt loading
            commonStore.is_loading_full_screen = false
            return
        }
        await synchData(commonStore.token_business)

        //tắt loading
        commonStore.is_loading_full_screen = false
        // đẩy sang giao diện thông tin của người dùng
        appStore.tab = 'USER'
    } catch (error: any) {
        console.log('verify widget', error)
        // nếu có messess lỗi thì lưu lại
        if (error.message) text_error.value = error.message
        status_submit.value = 'ERROR'
        //tắt loading
        commonStore.is_loading_full_screen = false
    }
}
</script>
