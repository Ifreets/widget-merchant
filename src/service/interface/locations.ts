/** Dữ liệu tỉnh thành */
export interface ProvinceData {
    name?: string,
    slug?: string,
    type?: string,
    name_with_type?: string,
    code?: string
    is_hidden?: boolean
}

/** Dữ liệu quận huyện */
export interface DistrictData {
    name?: string,
    type?: string,
    slug?: string,
    name_with_type?: string,
    path?: string,
    path_with_type?: string,
    code?: string,
    parent_code?: string
    is_hidden?: boolean
}

/** Dữ liệu xã phường */
export interface WardData {
    name?: string,
    type?: string,
    slug?: string,
    name_with_type?: string,
    path?: string,
    path_with_type?: string,
    code?: string,
    parent_code?: string
    is_hidden?: boolean
}

export interface StreetData {
    code?: string
    name?: string
}

/** Các dạng type detect */
export type DetectType = 'PROVINCE' | 'DISTRICT' | 'WARD' | 'STREET' | 'HOUSE_NUMBER'

/** Dữ liệu chi tiết */
export interface DetailData {
    id?: string
    code?: string
    type?: DetectType
    name?: string
}

/** Dữ liệu detect */
export interface DetectData {
    formattedAddress: string
    components: DetailData[]
}

/** Danh sách đia chỉ detect */
export interface Addresses {
    address_id?: string;
    address_name?: string
    engine?:string
    province?: ProvinceData
    district?: DistrictData
    ward?: WardData
    address?: string
}

/** Dữ liệu chi tiết của địa chỉ */
export interface LocationDetail {
    /** Số nhà */
    house_number?: DetailData
    /** Tên đường */
    street? : DetailData
    /** Xã phường */
    ward?: DetailData
    /** Quận huyện */
    district?: DetailData
    /** Tỉnh thành */
    province?: DetailData
}