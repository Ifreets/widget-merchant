/**
 * Dữ liệu sản phẩm
 */
export interface Product {
    /** Id bản ghi hệ thống */
    id?: string;

    /** Mã danh mục */
    category_id?: string;

    /** Mã sản phẩm tạo random */
    product_id?: string;

    /** Tên sản phẩm */
    name?: string;

    /** Tên tìm kiếm */
    search_name?: string;

    /** Mô tả sản phẩm */
    description?: string;

    /** Ảnh sản phẩm */
    images?: string[];

    /** Loại sản phẩm */
    type?: string;

    /** Trạng thái sản phẩm */
    status?: string;

    /** Thuộc tính tùy biến */
    custom_fields?: {
        /** Xuất xứ */
        origin?: string;
        /** Nguồn gốc */
        source?: string;
        /** Loại */
        type?: string;
        /** Mùa */
        season?: string;
        /** Trạng thái phân bổ doanh thu */
        revenue_allocation?: boolean;
        /** Hình thức phân bổ doanh thu */
        allocation_form?: string;
        /** Giá trị giảm dần */
        value_gradually_decreases?: string | null
        /** Đơn vị phân bổ */
        allocation_unit?: string
        /** Trạng thái phân bổ hoa hồng theo % */
        commission_allocation?: boolean;
        /** Các phòng ban được phân bổ hoa hồng theo %  */
        departments_allocated_commissions?: any[]
        /** Tính % hoa hồng cho marketing */
        calculate_commission_for_marketing?: boolean;
    }

    /** Giá nhập */
    cost?: number;

    /** Giá bán */
    price?: number;

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

    /** Số lượng */
    quantity?: number;

    /** Số lượng hàng tồn */
    inventory_quantity?: number;

    /** Số lượng hàng có thể bán */
    stock_quantity?: number;

    /** Số lượng đã bán */
    sold_quantity?: number;

    /** Số lượng bị hỏng */
    damaged_quantity?: number;

    /** VAT */
    vat?: number;

    /** Phí dịch vụ */
    service_fee?: number | null;

    /**
   * Giá bán sỉ
   * */
    wholesale_price?: number

    /**
   * Cho phép bán hàng khi hết số lượng
   * */
    sold_when_quantity_runs_out?: boolean

    /** Barcode */
    barcode?: string;

    /** Max số lượng tồn kho */
    max_inventory_quantity?: number;

    /** Min số lượng tồn kho */
    min_inventory_quantity?: number;

    /** Vị trí thứ tự sắp xếp */
    position_index?: number;

    /** Khối lượng sản phẩm */
    weight?: number

    /** Chiều dài sản phẩm */
    length?: number

    /** Chiều rộng sản phẩm */
    width?: number

    /** Chiều cao sản phẩm */
    height?: number
}
