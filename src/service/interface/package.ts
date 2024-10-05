import type { Product } from './product';

/** Định nghĩa gói sản phẩm */
export interface Package {
    /** Id bản ghi hệ thống */
    id?: string;

    /** Mã gói sản phẩm */
    package_id?: string;

    /** Id danh mục cha */
    parent_category_id?: string;

    /** Tên gói sản phẩm */
    name?: string;

    /** Tên tìm kiếm */
    search_name?: string;

    /** Mô tả gói sản phẩm */
    description?: string;

    /** Các danh mục */
    categories?: string[];

    /** Các đối tượng */
    objects?: string[];

    /** Các dịp */
    occasions?: string[];

    /** Các bộ sưu tập */
    collections?: string[];

    /** Các dịch vụ */
    services?: string[];

    /** Các sản phẩm */
    products?: Product[];

    /** Sản phẩm hộp bình */
    vase?: Product[];

    /** Sản phẩm bọc ở ngoài */
    wrapping?: Product[];

    /** Danh sách phụ kiện đi kèm */
    accessories?: Product[];

    /** Danh sách sản phẩm đi kèm */
    accompanies?: Product[];

    /** Danh sách ảnh */
    images?: string[];

    /** Các màu sắc */
    colors?: string[];

    /** Các kích cỡ */
    sizes?: string[];

    /** Giá nhập */
    cost?: number;

    /** Giá bán */
    price?: number;

    /** Phí vận chuyển */
    shipping?: number;

    /** Phụ thu */
    surcharge?: number;

    /** Thợ chính làm ra sản phẩm */
    master?: {
        name: string;
        wage: number
    };

    /** Thợ phụ làm ra sản phẩm */
    assistant?: {
        name: string;
        wage: number
    };

    /** Tăng giá */
    increase?: number;

    /** Giá trên website */
    display_price?: number;

    /** Độ bền */
    durability?: number;

    /** Mực nước */
    water?: number;

    /** Sức bền */
    strength?: number;

    /** Thuộc tính tùy biến */
    custom_fields?: object;

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

    /** Vị trí thứ tự sắp xếp */
    position_index?: number;
}

/** Các keys liên quan tới danh mục */
export type KeyCategory = 'categories' | 'objects' | 'collections' | 'services'