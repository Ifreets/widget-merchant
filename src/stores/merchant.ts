import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {
    ContactInfo, ProvinceData, SettingData, EmployeeData
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
    /** Dữ liệu nhân viên dạng array */
    const employees_array = ref<EmployeeData[]>([])
    /** Dữ liệu nhân viên dạng object */
    const employees_ids = ref<{ [index: string]: EmployeeData }>({})

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
    /** Lưu dữ liệu nhân viên */
    const saveEmployees = (data: EmployeeData[]) => {
        employees_array.value = data
        data.forEach((item) => {
            employees_ids.value[item._id] = item
        })
    }

    return {
        setting,
        contact,
        provinces,
        employees_ids,
        employees_array,
        saveSetting,
        saveEmployees,
        saveProvinces,
        saveMerchantContact,
    }
})