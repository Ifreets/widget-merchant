import { request } from '@/service/helper/asyncRequest'
import type { InputRequestApi } from '@/service/interface'

/** domain của chatbot mới */
async function apiChatbotRequest({
  end_point,
  body,
}: InputRequestApi){
  try {
    const data = await request({
      uri: `${$env.chatbot_v2}/${end_point}`,
      method: 'POST',
      body
    })
		return data
  } catch (e) {
    
  }
}

/** cập nhật lấy data người dùng từ chatbot */
export const decodeClientV2 = async (params:InputRequestApi) => {
  try {
    return await apiChatbotRequest({
      ...params,
      end_point: 'partner/widget/client_info'
    })
  } catch (e) {
    throw e
  }
}
