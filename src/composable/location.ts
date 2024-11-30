import { ref } from "vue"

export function useLocation(){
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
  return {
    search_provice,
    search_district,
    search_ward,
    location_index,
    province_index,
    district_index,
    ward_index
  }
}