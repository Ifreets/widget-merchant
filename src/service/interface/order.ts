import type { ContactInfo } from './contact'
import type { ActionStep, StaffInfo } from './setting'
import type {
  ProvinceData,
  WardData,
  DistrictData,
  StreetData,
} from './locations'

/** Dữ liệu sản phẩm trong đơn hàng */
export interface OrderProduct {
  /** Id sản phẩm */
  product_id?: string
  /** Tên sản phẩm */
  product_name?: string
  /** Dạng sản phẩm */
  product_type?: string
  /** Danh sách ảnh */
  images?: string[]
  /** ID biến thể */
  variant_id?: string
  /** Giá bán */
  price?: number
  /** Số lượng nhập */
  quantity?: number
  /** Tiền thuế vat */
  vat?: number
  /** Chiết khấu */
  discount?: number
  /** Tổng tiền */
  total_price?: number
  /** Trạng thái phân bổ sản phẩm */
  revenue_allocation?: boolean
  /** Phí dịch vụ */
  service_fee?: number | null
  /** cân nặng tính tiền */
  weight?: number
  /** Chiều dài sản phẩm */
  length?: number
  /** Chiều rộng sản phẩm */
  width?: number
  /** Chiều cao sản phẩm */
  height?: number
  /** Số lượng tồn kho */
  inventory_quantity?: number
  /** Thuộc tính tùy biến */
  custom_fields?: {
    /** Xuất xứ */
    origin?: string
    /** Nguồn gốc */
    source?: string
    /** Loại */
    type?: string
    /** Mùa */
    season?: string
    /** Trạng thái phân bổ doanh thu */
    revenue_allocation?: boolean
    /** Hình thức phân bổ doanh thu */
    allocation_form?: string
    /** Giá trị giảm dần */
    value_gradually_decreases?: string | null
    /** Đơn vị phân bổ */
    allocation_unit?: string
    /** Trạng thái phân bổ hoa hồng theo % */
    commission_allocation?: boolean
    /** Các phòng ban được phân bổ hoa hồng theo %  */
    departments_allocated_commissions?: any[]
    /** Tính % hoa hồng cho marketing */
    calculate_commission_for_marketing?: boolean
  }
}

export interface OrderLocation {
  /** Tỉnh thành */
  province?: ProvinceData
  /** Quận huyện */
  district?: DistrictData
  /** Phường xã */
  ward?: WardData
  /** Dữ liệu tên đường */
  street?: StreetData
  /** Số nhà */
  house_number?: StreetData
}

/** Dữ liệu đơn hàng */
export interface Order {
  /** ID bản ghi đơn hàng */
  id?: string

  /** Mã đơn hàng */
  order_id?: string

  /** Sản phẩm */
  products?: OrderProduct[]

  /** Số lượng sản phẩm */
  quantity?: number

  /** Giá bán */
  price?: number

  /** Giảm giá */
  discount?: number

  /** Tiền thuế phải nộp */
  vat?: number

  /** Tổng tiền */
  total_price?: number

  /** Tổng tiền khách sẽ phải thanh toán */
  total_money?: number

  /** Số tiền khách hàng đã đưa */
  money_paid?: number

  /** phí vận chuyển */
  shipping_fee?: number

  /** Số tiền trả lại khách hàng */
  money_back?: number

  /** Số tiền cần thu về */
  money_proceeds?: number

  /** Số tiền khách hàng chưa thanh toán */
  money_unpaid?: number

  /** Có tính vào công nợ không? */
  save_in_debt?: boolean

  /** Phương thức thanh toán */
  payment_method?: string

  /** Nhân viên thu tiền */
  cashier?: string

  /** Ghi chú */
  note?: string

  /** Trạng thái đơn hàng */
  status?: string

  /** Mã khách hàng */
  contact_id?: string

  /** Snap lại thông tin khách hàng */
  contact_info?: ContactInfo

  /** Chi phí khác */
  other_costs?: {
    name: string
    value: number
  }[]

  /** Tổng chi phí khác */
  total_other_costs?: number

  /** Danh sách ảnh */
  images?: string[]

  /** Lịch sử hoạt động */
  action_logs?: {
    employee_id?: string
    status?: string | ActionStep[]
    time?: Date
  }[]

  /** Địa chỉ nhận hàng */
  address?: string

  full_address?: string

  /** Thông tin vị trí */
  locations?: OrderLocation

  /** Trạng thái freeship */
  is_freeship?: boolean

  /** Ghi chú nội bộ */
  internal_note?: string

  /** Ảnh nội bộ */
  internal_images?: string[]

  /** Thời gian tạo đơn tùy chọn */
  created_date?: Date

  /** Kết quả feedback */
  feedback_result?: string

  /** Thuộc tính tùy biến */
  custom_fields?: {
    /** Kênh bán hàng */
    sales_channel?: string
    /** Nguồn gốc đơn hàng */
    source?: string
    /** Id thợ chính làm sản phẩm */
    master?: string
    /** Id thợ phụ làm sản phẩm */
    assistant?: string
    /** Tổng giá các loại sản phẩm */
    products_price?: number
    /** số điện thoại người */
    last_phone?: string
    /** tên người nhận */
    customer_name?: string
    /** id trang */
    page_id?: string
    /** id facebook */
    fb_client_id?: string
  }

  /** Hành trình đơn hàng */
  order_journey?: ActionStep[][]

  /** Nhân viên bán hàng */
  saler?: StaffInfo

  /** Nhân viên tham gia */
  staffs?: StaffInfo[]

  /** Trạng thái xuất kho */
  is_inventory_export?: boolean

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

  /** Thời gian tạo */
  createdAt?: Date

  /** Thời gian update */
  updatedAt?: Date

  /** Số lượng tồn kho */
  inventory_quantity?: number

  is_archived?: boolean
}

export interface ISelectedAddress {
  /** địa chỉ */
  address?: string
  /** id chi nhánh */
  branch_id?: string
  /** id doanh nghiệp */
  business_id?: string
  /** id liên hệ */
  contact_id?: string
  /** thời gian tạo */
  createdAt?: string
  /** id phòng ban */
  department_id?: string
  /** id nhân viên */
  employee_id?: string
  /** địa chỉ đầy đủ */
  full_address?: string
  /** id */
  id?: string
  /** địa chỉ */
  locations?: OrderLocation
  /** id đội nhóm */
  team_id?: string
  /** thời gian update */
  updatedAt?: string
  /** id user */
  user_id?: string
}
