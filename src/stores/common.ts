import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useCommonStore = defineStore('common_store', () => {
  /** toggle loading toàn trang */
  const is_loading_full_screen = ref(false)
  /** danh sách tất cả nhân viên */
  const listAllEmployee = ref<{ [key: string]: any }>({})
  /** id doanh nghiệp */
  const id_business = ref<string>('')
  /** token doanh nghiệp */
  const token_business = ref<string>('')

  /** avatar của nhân viên */
  function getAvatarEmployee(item: string) {
    return listAllEmployee.value[item]?.avatar
  }
  /** tên nhân viên */
  function getNameEmployee(item: string) {
    return (
      listAllEmployee.value[item]?.first_name +
      ' ' +
      listAllEmployee.value[item]?.last_name
    )
  }
  /** tên chi nhánh */
  function getNameBranch(item: string) {
    return listAllEmployee.value[item]?.branch.name
  }
  /** tên phòng ban */
  function getNameDepartment(item: string) {
    return listAllEmployee.value[item]?.department.name
  }

  return {
    is_loading_full_screen,
    listAllEmployee,
    id_business,
    token_business,
    getAvatarEmployee,
    getNameEmployee,
    getNameBranch,
    getNameDepartment,
  }
})
