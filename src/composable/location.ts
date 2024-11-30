import { PROVINCE } from '@/service/constant'

import { ref, type Ref } from 'vue'

import type { Addresses, DistrictData, Order, ProvinceData, WardData } from '@/service/interface'

export function useLocation(order_edit: Ref<Order>) {
  /** Nội dung tìm kiếm province */
  const search_provice = ref<string>('')

  /** Nội dung tìm kiếm district */
  const search_district = ref<string>('')

  /** Nội dung tìm kiếm ward */
  const search_ward = ref<string>('')

  /** Index của địa chỉ */
  const location_index = ref<number>(0)

  /** Index của province */
  const province_index = ref<number>(0)

  /** Index của district */
  const district_index = ref<number>(0)

  /** Index của ward */
  const ward_index = ref<number>(0)

  /** Danh sách tỉnh thành */
  const provinces = ref<ProvinceData[]>(PROVINCE)

  /** Dữ liệu danh sách */
  const snap_provinces = ref<ProvinceData[]>(PROVINCE)

  /** Danh sách quận huyện */
  const districts = ref<DistrictData[]>([])

  /** Snap danh sách quận huyện */
  const snap_districts = ref<DistrictData[]>([])

  /** Danh sách phường xã */
  const wards = ref<WardData[]>([])

  /** Snap danh sách phường xã */
  const snap_wards = ref<WardData[]>([])

  /** Danh sách địa chỉ */
const addresses = ref<Addresses[]>([])

  return {
    search_provice,
    search_district,
    search_ward,
    location_index,
    province_index,
    district_index,
    ward_index,
    provinces,
    snap_provinces,
    districts,
    snap_districts,
    wards,
    snap_wards,
    addresses
  }
}
