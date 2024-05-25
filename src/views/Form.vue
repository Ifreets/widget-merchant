<template>
    <div v-if="tab == 'FORM' || tab == 'FORM_NO_TOKEN'" class="p-3 flex flex-col gap-2.5">
        <div class="h-6">
            <p @click="tab = 'LIST'" v-if="tab == 'FORM'"
                class="flex items-center font-medium bg-slate-200 w-fit px-2 rounded-md cursor-pointer gap-1">
                <img :src="ArrowIcon" alt="">
                <span class="pb-0.5">Quay
                    lại</span>
            </p>
        </div>
        <form class="flex flex-col gap-4 rounded-lg p-3 bg-slate-100">
            <p v-if="status_submit === 'SUCCESS'" class="text-center text-green-600">
                Thiết lập thành công
            </p>
            <p v-if="status_submit === 'ERROR'" class="text-center text-red-500">
                ID hoặc Token bị lỗi, vui lòng kiểm tra lại
            </p>
            <div class="flex flex-col gap-1">
                <label class="font-medium" for="">Nhập ID Business <span class="text-red-500">*</span></label>
                <input v-model="id" class="outline-none pb-1.5 pt-1 px-3 rounded-md border" type="text"
                    placeholder="Nhập ID">
            </div>
            <div class="flex flex-col gap-1">
                <label class="font-medium" for="">Nhập Token Business <span class="text-red-500">*</span></label>
                <input v-model="token" class="outline-none pb-1.5 pt-1 px-3 rounded-md border" type="text"
                    placeholder="Nhập Token">
            </div>
            <div class="flex justify-between items-center">
                <button @click.prevent="onSubmit"
                    class="active:bg-green-500 rounded-md py-2 px-4 w-fit border bg-white hover:shadow-md">
                    Kết nối</button>
                <div>
                    <p class="flex items-center gap-0.5 cursor-pointer"><img :src="GuidanceIcon" alt="">
                        <span class="pb-0.5"><u>Hướng dẫn thiết lập</u></span>
                    </p>
                </div>
            </div>

        </form>
    </div>
</template>

<script setup lang="ts">
//* import library
import { request } from '@/service/helper/request';
import { ref } from 'vue';
import WIDGET from 'bbh-chatbox-widget-js-sdk';

//* import icon
import ArrowIcon from '@/assets/icons/arrow-icon.svg'
import GuidanceIcon from '@/assets/icons/guidance-icon.svg'

/** Trạng thái của hành động submit form */
const status_submit = ref<'SUCCESS' | 'ERROR' | ''>('')


const props = defineProps<{
    synchData: Function
}>()

const tab = defineModel('tab', { default: "" })
const id = defineModel('id', { default: "" })
const token = defineModel('token', { default: "" })

/** hàm xử lý  */
async function onSubmit() {
    try {
        if (id.value && token.value) {
            // call API check token có hợp lệ không
            request({
                uri: 'https://api.merchant.vn/v1/apps/info/profile',
                method: 'GET',
                headers: {
                    'token-business': token.value
                }
            }, async (e, r) => {
                // nếu thành công thì lưu token vừa nhập vào widget sdk
                if (r.status === 200) {
                    await WIDGET.saveConfig({
                        brand_name: 'widget-merchant',
                        type_config: 'CRM',
                        config_data: {
                            id_business: id.value,
                            token_business: token.value
                        }
                    })
                    status_submit.value = 'SUCCESS'
                    if (tab.value == 'FORM_NO_TOKEN') {
                        await props.synchData(token.value)
                        tab.value = 'LIST'
                    }
                } else {
                    status_submit.value = 'ERROR'
                }
            });

        } else {
            status_submit.value = 'ERROR'
        }
    } catch (err) {
        status_submit.value = 'ERROR'
    }
}
</script>