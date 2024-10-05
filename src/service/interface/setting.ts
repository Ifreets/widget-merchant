/** Dữ liệu setting đơn hàng */
export interface Setting {

    /** ID bản ghi */
    id?: string;

    /** Dạng dữ liệu */
    type?: string;

    /** Key setting */
    key?: string;

    /** Giá trị setting */
    value?: SettingData;

    /** ID doanh nghiệp */
    business_id?: string;

    /** ID chi nhánh */
    branch_id?: string;

    /** ID Phòng ban */
    department_id?: string;

    /** ID đội nhóm (dữ liệu này lúc có lúc không) */
    team_id?: string;

    /** ID nhân viên */
    employee_id?: string;

    /** ID user */
    user_id?: string;

    /** Thời gian tạo record */
    createdAt?: Date;

    /** Thời gian cập nhật record */
    updatedAt?: Date;

}

/** Dữ liệu setting đơn hàng */
export interface SettingHistory {

    /** ID bản ghi */
    id?: string;

    /** Dạng dữ liệu */
    type?: string;

    /** Giá trị setting */
    value?: SettingData;

    old_value?: SettingData;

    /** ID doanh nghiệp */
    business_id?: string;

    /** ID chi nhánh */
    branch_id?: string;

    /** ID Phòng ban */
    department_id?: string;

    /** ID đội nhóm (dữ liệu này lúc có lúc không) */
    team_id?: string;

    /** ID nhân viên */
    employee_id?: string;

    /** ID user */
    user_id?: string;

    /** Thời gian tạo record */
    createdAt?: Date;

    /** Thời gian cập nhật record */
    updatedAt?: Date;

}

/** Dữ liệu thiết lập */
export interface SettingData {

    /** Gửi thông báo */
    send_telegram_notification?: boolean

    /** Trigger api facebook */
    trigger_capi?: boolean

    /** Danh sách trạng thái ofline */
    online_status?: ActionStep[][]

    /** Danh sách trạng thái offline */
    offline_status?: ActionStep[][]

    /** Chu kỳ kinh doanh của doanh nghiệp */
    business_period: {
        month: {
            start_date: number
            end_date: number
        }
        year: {
            start_time: Date
            end_time: Date
        }
    }

    /** Nhân viên online */
    online_staff: StaffInfo[]

    /** Nhân viên offline */
    offline_staff: StaffInfo[]

    /** Nhân viên bán hàng */
    saler: StaffInfo
};

/** Dữ liệu trong từng step */
export interface ActionStep {
    /** Tiêu đề của trạng thái */
    title: string;
    /** Hành động sẽ thực hiện */
    action: string;
    /** Màu nền nút bấm */
    bg_color: string;
    /** Màu chữ */
    text_color: string;
    /** Trạng thái active */
    is_active?: boolean
}

/** Dữ liệu nhân viên */
export interface StaffInfo {
    active: boolean
    /** Tiêu đề */
    title: string
    /** ID doanh nghiệp */
    business_id: string
    /** ID chi nhánh */
    branch_id: string
    /** ID phòng ban */
    department_id: string
    /** ID đội nhóm */
    team_id: string
    /** ID nhân viên */
    employee_id: string
    /** ID user */
    user_id: string
    /** Thu nhập p3 */
    salary_p3?: number
    /** Thu nhập p4 */
    salary_p4?: number
}