import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {
    ContactInfo, ProvinceData, SettingData, EmployeeData
} from '@/service/interface'
import Setting from '@/components/Setting.vue'

/** Store của merchant */
export const useMerchantStore = defineStore('merchant_store', () => {

    // * Variables
    /** Thiết lập đơn hàng */
    const setting = ref<SettingData>()
    /** Dữ liệu contact */
    const contact = ref<ContactInfo>()
    /** Hiển thị đơn hàng */
    const show_order_id = ref<string>('')
    /** Dữ liệu tỉnh thành */
    const provinces = ref<ProvinceData[]>([])
    /** Dữ liệu nhân viên dạng array */
    const employees_array = ref<EmployeeData[]>([])
    /** Dữ liệu nhân viên dạng object */
    const employees_ids = ref<{ [index: string]: EmployeeData }>({})
    const saveShowOrderId = (id: string) => {

    // * Functions
    /** Lưu lại id đơn hàng đang hiện ra */
        show_order_id.value = id
    }
    /** Lưu dữ liệu setting */
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
        show_order_id,
        setting,
        contact,
        provinces,
        employees_ids,
        employees_array,
        saveShowOrderId,
        saveSetting,
        saveEmployees,
        saveProvinces,
        saveMerchantContact,
    }
})