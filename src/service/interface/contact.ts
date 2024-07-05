/** Lưu dữ liệu contact */
export interface ContactInfo {
    /** ID bản ghi dạng UUID */
    id?: string

    /** ID định danh khách hàng */
    identifier_id?: string

    /** id được hash ra từ avatar */
    hash_id?: string

    /** Tên gọi */
    first_name?: string

    /** Tên họ */
    last_name?: string

    /** Ảnh đại diện */
    avatar?: string

    /** Gợi ý số điện thoại */
    suggest_phone?: string

    /** Danh sách sdt */
    phones?: string[]

    /** Gợi ý email */
    suggest_email?: string

    /** Danh sách email */
    emails?: string[]

    /** Gợi ý psid */
    suggest_psid?: string

    /** Danh sách psid */
    psids?: string[]

    /** Gợi ý page_id */
    suggest_page_id?: string

    /** Danh sách page_id */
    page_ids?: string[]

    /** Danh sách label_id */
    label_ids?: string[]

    /** Danh sách địa chỉ */
    addresses?: any[]

    /** Giới tính */
    gender?: string

    /** Sinh nhật */
    birthday?: Date | string

    /** Tên công ty */
    company?: string

    /** ID doanh nghiệp */
    business_id?: string

    /** ID chi nhánh */
    branch_id?: string

    /** ID Phòng ban */
    department_id?: string

    /** ID đội nhóm (dữ liệu này lúc có lúc không) */
    team_id?: string

    /** ID nhân viên */
    employee_id?: string

    /** ID user */
    user_id?: string

    /** Danh sách SDT đã được xác thực */
    verified_phones?: string[]

    /** Danh sách email đã được xác thực */
    verified_emails?: string[]

    /** Danh sách nhân viên đã được assign vào */
    assigned_employees?: string[]

    /** Thời gian tạo record */
    createdAt?: Date

    /** Thời gian cập nhật record */
    updatedAt?: Date

    /** Thời gian tạo Note cuối cùng */
    last_time_note?: Date

    /** Thông tin người đọc note */
    unread?: {
        [user_id: string]: {
            is_read: boolean
            last_time_read: Date
        }
    }

    /** Tên gợi nhớ theo user */
    alias_names?: {
        [user_id: string]: {
            display_name: string
            search_name: string
        }
    }

    /** Dữ liệu gim trên contact */
    pin_content?: string
}