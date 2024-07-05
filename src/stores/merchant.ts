import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {
    ContactInfo, ProvinceData, SettingData
} from '@/service/interface'
import Setting from '@/components/Setting.vue'

/** Store của merchant */
export const useMerchantStore = defineStore('merchant_store', () => {

    // * Variables
    const setting = ref<SettingData>()
    /** Dữ liệu contact */
    const contact = ref<ContactInfo>()
    /** Dữ liệu tỉnh thành */
    const provinces = ref<ProvinceData[]>([])

    // * Functions
    const saveSetting = (data: SettingData) => {
        setting.value = data
    }
    /** Lưu dữ liệu tỉnh thành */
    const saveProvinces = (data: ProvinceData[]) => {
        provinces.value = data
    }
    /** Lưu dữ liệu contact */
    const saveMerchantContact = (data: ContactInfo) => {
        contact.value = data
    }

    return {
        setting,
        contact,
        provinces,
        saveSetting,
        saveProvinces,
        saveMerchantContact,
    }
})