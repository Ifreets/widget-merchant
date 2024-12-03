//* import function
import { useAppStore, useCommonStore } from '@/stores'
import { request, type InputRequest } from '@/service/helper/asyncRequest'
import type { InputRequestApi } from '@/service/interface'

/** api chung merchant */
async function apiMerchantRequest({
  end_point,
  body,
}: InputRequestApi) {
  try {
		const commonStore = useCommonStore()

    const data = await request({
      uri: `${$env.merchant}/${end_point}`,
      method: 'POST',
      body,
			headers: {
        'token-business': commonStore.token_business,
      }
    })
		return data
  } catch (e) {
		throw e
	}
}

/** api chung contact */
async function apiContactRequest({
  end_point,
  body,
}: InputRequestApi) {
  try {
		const commonStore = useCommonStore()

    const data = await request({
      uri: `${$env.contact}/${end_point}`,
      method: 'POST',
      body,
			headers: {
        'token-business': commonStore.token_business,
      },
    })
		return data
  } catch (e) {
		throw e
	}
}

/** apoi chung đơn hàng, sản phẩm */
async function apiProductRequest({
  end_point,
  body,
}: InputRequestApi) {
  try {
		const commonStore = useCommonStore()

    const data = await request({
      uri: `${$env.product}/${end_point}`,
      method: 'POST',
      body,
			headers: {
        'token-business': commonStore.token_business,
      },
    })
		return data
  } catch (e) {
		throw e
	}
}

// * API MERCHANT
/** API lấy thông tin cho widget */
export const getConfigChatbox = async (params:InputRequestApi) => {
  try {
    return await apiMerchantRequest({
			...params,
      end_point: 'public/chatbox/get_config',
    })
  } catch (e) {
    throw e
  }
}

/** lấy token merchant */
export const getMerchantToken = async (params:InputRequestApi) => {
  try {
    return await apiMerchantRequest({
			...params,
      end_point: 'public/chatbox/exchange_token'
    })
  } catch (e) {
    throw e
  }
}

/** api lấy danh sách cửa hàng */
export const getStore = async (params:InputRequestApi) => {
  try {
    return await apiMerchantRequest({
			...params,
      end_point: 'public/chatbox/stores',
    })
  } catch (e) {
    throw e
  }
}

/** lấy danh sách nhân viên */
export const getEmployee = async (params:InputRequestApi) => {
  try {
    return await apiMerchantRequest({
			...params,
      end_point: 'systems/employee/get_employee'
    })
  } catch (e) {
    throw e
  }
}

/** lấy thông tin của nhân viên hiện tại */
export const getProfile = async (params:InputRequestApi) => {
  try {
    return await apiMerchantRequest({
			...params,
      end_point: 'apps/info/profile',
    })
  } catch (e) {
    throw e
  }
}

// * API CONTACT
/** Đồng bộ dữ liệu khách hàng tới merchant */
export const syncContact = async (params:InputRequestApi) => {
  try {
    return await apiContactRequest({
			...params,
      end_point: 'contact/chatbox_sync_contact',
    })
  } catch (e) {
    throw e
  }
}

/** cập nhật contact */
export const updateContact = async (params:InputRequestApi) => {
  try {
    return await apiContactRequest({
			...params,
      end_point: 'https://api-contact.merchant.vn/contact/update_contact',
    })
  } catch (e) {
    throw e
  }
}

// * API đơn hàng
/** Lấy danh sách đơn hàng */
export const getOrder = async (params:InputRequestApi) => {
  try {
    return await apiProductRequest({
			...params,
      end_point: 'order/get_order_by_contact_id',
    })
  } catch (e) {
    throw e
  }
}
/** Tạo mới đơn hàng */
export const createOrder = async (params:InputRequestApi) => {
  try {
    return await apiProductRequest({
			...params,
      end_point: 'order/create_order',
    })
  } catch (e) {
    throw e
  }
}
/** Update dữ liệu đơn hàng */
export const updateOrder = async (params:InputRequestApi) => {
  try {
    return await apiProductRequest({
			...params,
      end_point: 'order/update_order',
    })
  } catch (e) {
    throw e
  }
}

/** lấy thông tin contact */
export async function getContactReport(params: InputRequestApi) {
  try {
    return await apiProductRequest({
      ...params,
      end_point: 'report/contact',
    })
  } catch (e) {
    throw e
  }
}

// * API sản phẩm
/** Lấy danh sách sản phẩm */
export const getProduct = async (params:InputRequestApi) => {
  try {
    return await apiProductRequest({
			...params,
      end_point: 'product/get_product',
    })
  } catch (e) {
    throw e
  }
}
/** Lấy danh sách gói sản phẩm */
export const getPackage = async (params:InputRequestApi) => {
  try {
    return await apiProductRequest({
			...params,
      end_point: 'package/get_package',
    })
  } catch (e) {
    throw e
  }
}

/** tạo mới sản phẩm */
export const createProduct = async (params:InputRequestApi) => {
  try {
    return await apiProductRequest({
			...params,
      end_point: 'product/create_product',
    })
  } catch (e) {
    throw e
  }
}

// * API locations
/** Lấy danh sách tỉnh thành */
export const getProvince = async (params:InputRequestApi) => {
  try {
    return await apiProductRequest({
			...params,
      end_point: 'locations/province',
    })
  } catch (e) {
    throw e
  }
}
/** Lấy danh sách quận huyện */
export const getDistrict = async (params:InputRequestApi) => {
  try {
    return await apiProductRequest({
			...params,
      end_point: 'locations/district',
    })
  } catch (e) {
    throw e
  }
}
/** Lấy danh sách xã phường */
export const getWard = async (params:InputRequestApi) => {
  try {
    return await apiProductRequest({
			...params,
      end_point: 'locations/ward',
    })
  } catch (e) {
    throw e
  }
}
/** Nhận diện địa chỉ cữ
 * @deprecated
*/
export const detectAddress = async (params:InputRequestApi) => {
  try {
    return await apiProductRequest({
			...params,
      end_point: 'locations/detect_address',
    })
  } catch (e) {
    throw e
  }
}
/** nhận diện địa chỉ mới */
export const detectAddressV2 = async (params:InputRequestApi) => {
  try {
    return await apiProductRequest({
			...params,
      end_point: 'locations/detect_address_v2'
    })
  } catch (e) {
    throw e
  }
}
/** Lấy ra thông tin chi tiết địa chỉ */
export const getAddress = async (params:InputRequestApi) => {
  try {
    return await apiProductRequest({
			...params,
      end_point: 'locations/get_address',
    })
  } catch (e) {
    throw e
  }
}
/** lấy danh sách địa chỉ đã chọn */
export const getSelectedAddress = async (params:InputRequestApi) => {
  try {
    return await apiProductRequest({
			...params,
      end_point: 'order/get_contact_address',
    })
  } catch (e) {
    throw e
  }
}

// * API settings
export const getSetting = async (params:InputRequestApi) => {
  try {
    return await apiProductRequest({
			...params,
      end_point: 'setting/get_setting',
    })
  } catch (e) {
    throw e
  }
}