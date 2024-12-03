import { PROVINCE } from '@/service/constant'
import { Toast } from '@/service/helper/toast'
import { detectAddressV2, getAddress, getDistrict, getWard } from '@/service/api/merchant'

import { ref, type Ref } from 'vue'

import type {
  Addresses,
  DistrictData,
  LocationDetail,
  Order,
  ProvinceData,
  WardData,
} from '@/service/interface'
import { get } from 'lodash'
import { nonAccentVn } from '@/service/helper/format'

export function useLocation(order_edit: Ref<Order>) {
  const $toast = new Toast()

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

  /** chọn địa chỉ */
  async function chooseAddress(address: Addresses) {
    try {
      if (address?.engine && order_edit.value.locations) {
        if (address?.address) {
          order_edit.value.address = address?.address
        }
        if (address?.province) {
          order_edit.value.locations.province = address?.province
          const CODE = Number(address.province?.id)
            ? address.province?.id
            : address.province?.code
          districts.value = await getDistrict({
            body: {
              province_id: CODE,
            },
          })
          snap_districts.value = districts.value
        }
        if (address?.district) {
          order_edit.value.locations.district = address?.district
          const CODE = Number(address.district?.id)
            ? address.district?.id
            : address.district?.code
          wards.value = await getWard({
            body: {
              district_id: CODE,
            },
          })
          snap_wards.value = wards.value
        }
        if (address?.ward) {
          order_edit.value.locations.ward = address?.ward
        }
        return
      }
  
      /** Gán địa chỉ */
      order_edit.value.address = address.address_name?.split(' - ')?.[0]
  
      /** Lấy dữ liệu chi tiết */
      let location_detail = (await getAddress({
        body: {
          address_id: address.address_id,
          address_name: address.address_name,
        }
      })) as LocationDetail
  
      // * Gán dữ liệu loction
      if (order_edit.value.locations) {
        // * Lưu dữ liệu tỉnh thành
        provinces.value.map(item => {
          if (
            item.code === location_detail.province?.id &&
            order_edit.value.locations
          ) {
            order_edit.value.locations.province = item
            search_provice.value = item.name || ''
          }
        })
  
        // * Lưu dữ liệu quận huyện
        order_edit.value.locations.district = {
          code: location_detail.district?.id,
          name: location_detail.district?.name,
          name_with_type: location_detail.district?.name,
        }
        search_district.value = location_detail.district?.name || ''
  
        // * Lưu dữ liệu phường xã
        order_edit.value.locations.ward = {
          code: location_detail.ward?.id,
          name: location_detail.ward?.name,
          name_with_type: location_detail.ward?.name,
        }
        search_ward.value = location_detail.ward?.name || ''
  
        order_edit.value.locations.street = {
          code: location_detail.street?.id,
          name: location_detail.street?.name,
        }
  
        order_edit.value.locations.house_number = {
          code: location_detail.house_number?.id,
          name: location_detail.house_number?.name,
        }
      }
  
      // * Lấy thêm thông tin quận huyện
      if (location_detail.province?.id) {
        districts.value = await getDistrict({
          body: {
            province_id: location_detail.province?.id,
          },
        })
        snap_districts.value = districts.value
      }
      // * Lấy thêm thông tin phường xã
      if (location_detail.district?.id) {
        wards.value = await getWard({
          body: {
            district_id: location_detail.district?.id,
          },
        })
        snap_wards.value = wards.value
      }
    } catch (error) {
      $toast.error(error)
    }
  }

  /** hàm chọn tỉnh thành */
  async function chooseProvince(item: ProvinceData) {
    try {
      search_provice.value = item.name || ''
      search_district.value = ''
      search_ward.value = ''
      if (order_edit.value.locations) order_edit.value.locations.province = item
      if (order_edit.value.locations) order_edit.value.locations.district = {}
      if (order_edit.value.locations) order_edit.value.locations.ward = {}
      districts.value = await getDistrict({
        body: {
          province_id: item.code,
        },
      })
      snap_districts.value = districts.value
    } catch (error) {
      $toast.error(error)
    }
  }

  /** hàm chọn quận huyện */
  async function chooseDistrict(item: DistrictData) {
    try {
      search_district.value = item.name_with_type || ''
      search_ward.value = ''
      if (order_edit.value.locations) order_edit.value.locations.district = item
      if (order_edit.value.locations) order_edit.value.locations.ward = {}
      wards.value = await getWard({
        body: {
          district_id: item.code,
        }
      })
      snap_wards.value = wards.value
    } catch (error) {
      $toast.error(error)
    }
  }

  /** hàm chọn phường xã */
  async function chooseWard(item: WardData) {
    try {
      search_ward.value = item.name_with_type || ''
      if (order_edit.value.locations) order_edit.value.locations.ward = item
    } catch (error) {
      $toast.error(error)
    }
  }

  /** lấy tên của tỉnh, thành phố */
  function getProvinceName() {
    return (
      get(order_edit.value, 'locations.province.name') ||
      get(order_edit.value, 'locations.province.name_with_type') ||
      ''
    )
  }

  /** lấy tên của quận huyện */
  function getDistrictName() {
    return (
      get(order_edit.value, 'locations.district.name_with_type') ||
      get(order_edit.value, 'locations.district.name') ||
      ''
    )
  }

  /** lấy tên của phường xã */
  function getWardName() {
    return (
      get(order_edit.value, 'locations.ward.name_with_type') ||
      get(order_edit.value, 'locations.ward.name') ||
      ''
    )
  }

  /** tìm kiếm địa chỉ */
  async function searchAddressHook(address: string) {
    try {
      addresses.value = await detectAddressV2({
        body: {
          address: address,
        }
      })
      console.log(addresses.value);
      
    } catch (error) {
      $toast.error(error)
    }
  }

  /** Tìm kiếm location */
  function searchLocation(type: 'province' | 'district' | 'ward') {
    if (type === 'province') {
      let search = nonAccentVn(search_provice.value)
      province_index.value = 0
      provinces.value = snap_provinces.value.filter(item => {
        let name = nonAccentVn(item.name as string)
        if (!search) return true
        if (name.includes(search)) return true
        return false
      })
    }
    if (type === 'district') {
      let search = nonAccentVn(search_district.value)
      district_index.value = 0
      districts.value = snap_districts.value.filter(item => {
        let name = nonAccentVn(item.name as string)
        if (!search) return true
        if (name.includes(search)) return true
        return false
      })
    }
    if (type === 'ward') {
      let search = nonAccentVn(search_ward.value)
      ward_index.value = 0
      wards.value = snap_wards.value.filter(item => {
        let name = nonAccentVn(item.name as string)
        if (!search) return true
        if (name.includes(search)) return true
        return false
      })
    }
  }

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
    addresses,
    chooseAddress,
    chooseProvince,
    chooseDistrict,
    chooseWard,
    getProvinceName,
    getDistrictName,
    getWardName,
    searchAddressHook,
    searchLocation,
  }
}
