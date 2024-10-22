//* import function
import { useAppStore, useCommonStore } from '@/stores'
import { request } from '@/service/helper/asyncRequest'


// * API khách hàng
/** Đồng bộ dữ liệu khách hàng tới merchant */
export const syncContact = async () => {
    try {
        const appStore = useAppStore()
        const commonStore = useCommonStore()
        return await request({
            uri: 'https://api-contact.merchant.vn/contact/chatbox_sync_contact',
            method: 'POST',
            body: appStore.data_client,
            headers: {
                'token-business': commonStore.token_business,
            },
        })
    } catch (e) {
        throw e
    }
}

/** cập nhật contact */
export const updateContact = async (data: {}) => {
    try {
        const commonStore = useCommonStore()
        return await request({
            uri: 'https://api-contact.merchant.vn/contact/update_contact',
            method: 'POST',
            body: data,
            headers: {
                'token-business': commonStore.token_business,
            },
        })
    } catch (e) {
        throw e
    }
}

// * API đơn hàng
/** Lấy danh sách đơn hàng */
export const getOrder = async (data: {}) => {
    try {
        const commonStore = useCommonStore()
        return await request({
            uri: 'https://api-product.merchant.vn/order/get_order_by_contact_id',
            method: 'POST',
            body: data,
            headers: {
                'token-business': commonStore.token_business,
            },
        })
    } catch (e) {
        throw e
    }
}
/** Tạo mới đơn hàng */
export const createOrder = async (data: {}) => {
    try {
        const commonStore = useCommonStore()
        return await request({
            uri: 'https://api-product.merchant.vn/order/create_order',
            method: 'POST',
            body: data,
            headers: {
                'token-business': commonStore.token_business,
            },
        })
    } catch (e) {
        throw e
    }
}
/** Update dữ liệu đơn hàng */
export const updateOrder = async (data: {}) => {
    try {
        const commonStore = useCommonStore()
        return await request({
            uri: 'https://api-product.merchant.vn/order/update_order',
            method: 'POST',
            body: data,
            headers: {
                'token-business': commonStore.token_business,
            },
        })
    } catch (e) {
        throw e
    }
}

// * API sản phẩm
/** Lấy danh sách sản phẩm */
export const getProduct = async (data: {}) => {
    try {
        const commonStore = useCommonStore()
        return await request({
            uri: 'https://api-product.merchant.vn/product/get_product',
            method: 'POST',
            body: data,
            headers: {
                'token-business': commonStore.token_business,
            },
        })
    } catch (e) {
        throw e
    }
}
/** Lấy danh sách gói sản phẩm */
export const getPackage = async (data: {}) => {
    try {
        const commonStore = useCommonStore()
        return await request({
            uri: 'https://api-product.merchant.vn/package/get_package',
            method: 'POST',
            body: data,
            headers: {
                'token-business': commonStore.token_business,
            },
        })
    } catch (e) {
        throw e
    }
}

// * API locations
/** Lấy danh sách tỉnh thành */
export const getProvince = async (data: {}) => {
    try {
        const commonStore = useCommonStore()
        return await request({
            uri: 'https://api-product.merchant.vn/locations/province',
            method: 'POST',
            body: data,
            headers: {
                'token-business': commonStore.token_business,
            },
        })
    } catch (e) {
        throw e
    }
}
/** Lấy danh sách quận huyện */
export const getDistrict = async (data: {}) => {
    try {
        const commonStore = useCommonStore()
        return await request({
            uri: 'https://api-product.merchant.vn/locations/district',
            method: 'POST',
            body: data,
            headers: {
                'token-business': commonStore.token_business,
            },
        })
    } catch (e) {
        throw e
    }
}
/** Lấy danh sách xã phường */
export const getWard = async (data: {}) => {
    try {
        const commonStore = useCommonStore()
        return await request({
            uri: 'https://api-product.merchant.vn/locations/ward',
            method: 'POST',
            body: data,
            headers: {
                'token-business': commonStore.token_business,
            },
        })
    } catch (e) {
        throw e
    }
}
/** Nhận diện địa chỉ */
export const detectAddress = async (data: {}) => {
    try {
        const commonStore = useCommonStore()
        return await request({
            uri: 'https://api-product.merchant.vn/locations/detect_address',
            method: 'POST',
            body: data,
            headers: {
                'token-business': commonStore.token_business,
            },
        })
    } catch (e) {
        throw e
    }
}
/** Lấy ra thông tin chi tiết địa chỉ */
export const getAddress = async (data: {}) => {
    try {
        const commonStore = useCommonStore()
        return await request({
            uri: 'https://api-product.merchant.vn/locations/get_address',
            method: 'POST',
            body: data,
            headers: {
                'token-business': commonStore.token_business,
            },
        })
    } catch (e) {
        throw e
    }
}

// * API settings
export const getSetting = async (data: {}) => {
    try {
        const commonStore = useCommonStore()
        return await request({
            uri: 'https://api-product.merchant.vn/setting/get_setting',
            method: 'POST',
            body: data,
            headers: {
                'token-business': commonStore.token_business,
            },
        })
    } catch (e) {
        throw e
    }
}

// * API employee
export const getEmployee = async (data: {}) => {
    try {
        const commonStore = useCommonStore()
        return await request({
            uri: 'https://api.merchant.vn/v1/systems/employee/get_employee',
            method: 'POST',
            body: data,
            headers: {
                'token-business': commonStore.token_business,
            },
        })
    } catch (e) {
        throw e
    }
}

/** lấy token merchant */
export const getMerchantToken = async (data: {}) => {
    try {
        const commonStore = useCommonStore()
        return await request({
            uri: 'https://api.merchant.vn/v1/public/chatbox/exchange_token',
            method: 'POST',
            body: data,
            headers: {
                'token-business': commonStore.token_business,
            },
        })
    } catch (e) {
        throw e
    }
}

export const getProfile = async () => {
    try {
        const commonStore = useCommonStore()
        return await request({
            uri: 'https://api.merchant.vn/v1/apps/info/profile',
            method: 'POST',
            body: {},
            headers: {
                'token-business': commonStore.token_business,
            },
        })
    } catch (e) {
        throw e
    }
}

/** api lấy danh sách cửa hàng */
export const getStore = async (data: {}) => {
    try {
        const commonStore = useCommonStore()
        return await request({
            uri: 'https://api.merchant.vn/v1/public/chatbox/stores',
            method: 'POST',
            body: data,
            headers: {
                'token-business': commonStore.token_business,
            },
        })
    } catch (e) {
        throw e
    }
}