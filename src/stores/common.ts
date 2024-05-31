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

  return {
    is_loading_full_screen,
    listAllEmployee,
    id_business,
    token_business,
  }
})
