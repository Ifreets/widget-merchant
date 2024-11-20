import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {
    Order,
    ContactInfo,
    SettingData,
    ProvinceData,
    EmployeeData,
} from '@/service/interface'
import { INIT_ORDER } from '@/service/constant'

/** Store của merchant */
export const useMerchantStore = defineStore('merchant_store', () => {

    // * Variables
    /** Danh sách order */
    const orders = ref<Order[]>([])
    /** Dữ liệu đơn hàng đang cần chỉnh sửa */
    const order_edit = ref<Order>(JSON.parse(JSON.stringify(INIT_ORDER)))
    /** Tổng số đơn hàng */
    const total_order = ref<number>(0)
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
    /** Tab hiện tại đang chọn */
    const current_tab = ref<'ORDERS' | 'CREATE_ORDER' | ''>('ORDERS')
    /** profile */
    const profile = ref<EmployeeData>({})

    // * Functions
    /** Lưu lại danh sách đơn hàng */
    const saveOrders = (data: Order[]) => {
        orders.value = data
    }
    /** Lưu tổng số đơn hàng */
    const saveTotalOrder = (total: number) => {
        total_order.value = total
    }
    /** Lưu lại id đơn hàng đang hiện ra */
    const saveShowOrderId = (id: string) => {
        show_order_id.value = id
    }
    /** Lưu dữ liệu đơn hàng cần chỉnh sửa */
    const saveOrderEdit = (order: Order) => {
        order_edit.value = order
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
            if (item._id)
            employees_ids.value[item._id] = item
        })
    }
    /** Lưu lại tab đang chọn */
    const saveCurrentTab = (tab: 'ORDERS' | 'CREATE_ORDER' | '') => {
        current_tab.value = tab
    }

    return {
        orders,
        setting,
        contact,
        provinces,
        order_edit,
        total_order,
        current_tab,
        employees_ids,
        show_order_id,
        employees_array,
        profile,
        saveOrders,
        saveSetting,
        saveEmployees,
        saveProvinces,
        saveOrderEdit,
        saveTotalOrder,
        saveCurrentTab,
        saveShowOrderId,
        saveMerchantContact,
    }
})