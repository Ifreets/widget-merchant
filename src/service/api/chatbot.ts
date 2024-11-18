import { request } from '@/service/helper/asyncRequest'

/** cập nhật lấy data người dùng từ chatbot */
export const decodeClientV2 = async (data: {}) => {
  try {
    return await request({
      uri: 'https://chatbox-app-v2.botbanhang.vn/partner/widget/client_info',
      method: 'POST',
      body: data,
      headers: {},
    })
  } catch (e) {
    throw e
  }
}
