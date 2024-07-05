/** Dữ liệu tỉnh thành */
export interface ProvinceData {
    name?: string,
    slug?: string,
    type?: string,
    name_with_type?: string,
    code?: string
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
}