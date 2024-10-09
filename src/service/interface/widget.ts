import type { CustomerInfo } from "bbh-chatbox-widget-js-sdk";

export interface ICustomerInfo extends CustomerInfo{
  /** thông tin từ fb */
  public_profile?: {
    /** địa chỉ */
    location?: {
        /** thành phố */
        city?: string,
        /** quốc gia */
        country?: string,
        latitude?: number,
        longitude?: number,
        /** phố */
        street?: string,
        zip?: string,
        _id?: string
    },
    /**mã xác thực của đối tác */
    token_partner?: string,
    /**id của nhân viên hiện tại */
    current_staff_id?: string,
    /** user_id của nhân viên hiện tại */
    current_user_id?: string,
    /**tên của nhân viên hiện tại */
    current_staff_name?: string,

    conversation_id?: string,
    
    fb_page_id?: string,
    /**id trang */
    page_id?: string,
    /** id tổ chức */
    org_id?: string,
    /**id khách hàng */
    fb_client_id?: string,
    /** tên trang */
    page_name?: string,
    /** tên khách */
    client_name?: string,
    /** ảnh đại diện khách hàng */
    client_avatar?: string|null
}
}