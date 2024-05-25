<template>
    <div class="w-full h-full flex justify-center items-center bg-slate-300">
        <div class="w-screen h-screen lg:w-[395px] lg:h-[300px] bg-white text-sm">
            <div v-if="tab == 'LIST' || tab == 'LOAD'" class="p-3 flex flex-col gap-2.5">
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
                    <ListEmployee v-if="tab === 'LIST'" v-model:tab="tab" :token="token" :listEmployee="listEmployee"
                        :id_client="commonStore?.data_client?.public_profile?.fb_client_id || ''" />
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
            <Form v-if="tab == 'FORM' || tab == 'FORM_NO_TOKEN'" v-model:tab="tab" v-model:id="id" v-model:token="token"
                :synchData="synchData" />
        </div>
    </div>
</template>
<script setup lang="ts">
//* import library
import { onMounted, ref } from 'vue';

//* import service
import { useCommonStore } from '@/stores';

//* import component
import ListEmployee from '@/views/ListEmployee.vue';
import Form from '@/views/Form.vue';

//* import icon
import Avatar from '@/assets/imgs/avatar.png'
import InfoIcon from '@/assets/icons/info-icon.svg'

import WIDGET from 'bbh-chatbox-widget-js-sdk';
import type { IConfigWidget } from '@/service/interface';
import { request } from '@/service/helper/request';


/** store */
const commonStore = useCommonStore()

/** tab hiện tại */
const tab = ref<'LIST' | 'LOAD' | 'FORM' | 'FORM_NO_TOKEN' | ''>('')
/** id của form */
const id = ref<string>('')
/** token của form */
const token = ref<string>('')
/** danh sách nhân viên */
const listEmployee = ref<any>([])

/** hàm xử lý submit form */

/** hàm call API đồng bộ dữ liệu sang merchant */
async function synchData(token_business: string) {
    try {
        if (Object.keys(commonStore.data_client).length) {
            request({
                uri: 'https://api-contact.merchant.vn/contact/chatbox_sync_contact',
                method: 'POST',
                body: commonStore.data_client,
                json: true, headers: {
                    'token-business': token_business
                }
            }, (e, r) => {
                listEmployee.value = r.assigned_employees
            });
        }
    } catch (err) {

    }
}

WIDGET.onEvent(async () => {
    try {
        // ghi lại thông tin khách hàng mới
        commonStore.data_client = await WIDGET.decodeClient()
    } catch (err) {
        console.log(err);
    }

})
onMounted(async () => {
    try {
        commonStore.is_loading_full_screen = true
        // khai báo biến lưu trữ dữ liệu khách hàng + init dữ liệu lần đầu
        commonStore.data_client = await WIDGET.decodeClient()
        // [optional] lắng nghe khách hàng thay đổi ở chế độ post message
        //call API lấy token từ widget
        let res: IConfigWidget | null = await WIDGET.getConfig({
            brand_name: 'widget-merchant',
            type_config: 'CRM'
        })
        // nếu có sẽ vào dashboard và đồng bộ dữ liệu, nếu không sẽ vào form
        if (res?.token_business) {
            await synchData(res?.token_business);
            id.value = res.id_business || ''
            token.value = res.token_business
            tab.value = 'LIST'
        } else {
            tab.value = 'FORM_NO_TOKEN'
        }
        res = null
        commonStore.is_loading_full_screen = false
    } catch (err) {
        console.log(err);
        tab.value = 'FORM_NO_TOKEN'
        commonStore.is_loading_full_screen = false
    }


})
</script>
<style scoped lang="scss">
.scrollbar-thin {
    scrollbar-width: thin;
}
</style>