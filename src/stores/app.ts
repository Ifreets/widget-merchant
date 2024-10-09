import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ICustomerInfo } from '@/service/interface/widget'
export const useAppStore = defineStore('app_store', () => {
  /** tab hiện tại của app */
  const tab = ref<'USER' | 'ORDER' | 'SETTING' | 'SETTING_NO_TOKEN' | ''>(
    'USER'
  )
  /** dữ liệu khách hàng */
  const data_client = ref<ICustomerInfo>({})
  /** thông tin khách hàng */
  const customer_info = ref<{
    /** link ảnh đại diện */
    avatar?: string
    /** số diện thoại */
    phone?: string
    /** id contact merchent */
    id_contact_merchant?: string
  }>()

  /** tự động tạo đơn hàng */
  const is_auto_create = ref<boolean>(false)

  /** tên khách hàng */
  function getClientName() {
    return data_client?.value?.public_profile?.client_name
  }
  /** email khách hàng */
  function getClientID() {
    if (!customer_info?.value?.id_contact_merchant) return ''
    return '(@' + customer_info?.value?.id_contact_merchant + ')'
  }
  /** đường dẫn đến contact merchant */
  function getLinkToMerchant() {
    return (
      'https://merchant.vn/a/contact?id=' +
      customer_info?.value?.id_contact_merchant
    )
  }
  /** avater của người dùng */
  function getUserAvatar() {
    return (
      'https://chatbox-static-v3.botbanhang.vn/app/facebook/avatar/' +
      data_client?.value?.public_profile?.fb_client_id +
      '?page_id=' +
      data_client?.value?.public_profile?.page_id +
      '&staff_id=' +
      data_client?.value?.public_profile?.current_staff_id +
      '&width=64&height=64'
    )
  }

  return {
    tab,
    data_client,
    customer_info,
    is_auto_create,
    getClientName,
    getClientID,
    getLinkToMerchant,
    getUserAvatar,
  }
})
