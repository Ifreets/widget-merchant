import { defineStore } from "pinia";
import { ref } from "vue";
import type { CustomerInfo } from "bbh-chatbox-widget-js-sdk";
export const useCommonStore = defineStore("common_store", () => {
    /** toggle loading toàn trang */
    const is_loading_full_screen = ref(false);
    /** dữ liệu khách hàng */
    const data_client = ref<CustomerInfo>({});

    return {
        is_loading_full_screen,
        data_client,
    };
});
