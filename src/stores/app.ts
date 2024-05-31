import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CustomerInfo } from 'bbh-chatbox-widget-js-sdk'
export const useAppStore = defineStore('app_store', () => {
  /** tab hiện tại của app */
  const tab = ref<'LIST' | 'LOAD' | 'FORM' | 'FORM_NO_TOKEN' | ''>('')
  /** dữ liệu khách hàng */
  const data_client = ref<CustomerInfo>({})
  /** thông tin khách hàng */
  const customer_info = ref<{
    /** link ảnh đại diện */
    avatar?: string
    /** email */
    email?: string
    /** số điện thoại */
    phone?: string
    /** id contact merchent */
    id_contact_merchant?: string
  }>()
  /** tên khách hàng */
  function getClientName() {
    return data_client?.value?.public_profile?.client_name
  }
  /** email khách hàng */
  function getClientEmail() {
    if (!customer_info?.value?.email) return ''
    return '(' + customer_info?.value?.email + ')'
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
    getClientName,
    getClientEmail,
    getLinkToMerchant,
    getUserAvatar,
  }
})
