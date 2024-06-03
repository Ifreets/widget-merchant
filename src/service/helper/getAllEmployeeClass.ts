import { request } from './asyncRequest'
import keyBy from 'lodash/keyBy'

export default class GetAllEmployee {
  #id_business: string = ''
  #token_business: string = ''
  #list_assigned_employee?: string[]
  constructor(
    id_business: string,
    token_business: string,
    list_assigned_employee: string[]
  ) {
    this.#id_business = id_business
    this.#token_business = token_business
    this.#list_assigned_employee = list_assigned_employee
  }
  /** format date */
  private formatDate(date: Date) {
    return (
      date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
    )
  }
  /** check xem đã lấy danh sách tất cả nhân viên ngày hôm nay chưa */
  private checkIsCallToday() {
    // lấy giá trị của ngày hôm nay
    let today = this.formatDate(new Date())
    // lấy ngày được lưu trong localStorage
    let isCallToday = localStorage.getItem(this.#id_business)
    // check xem ngày hôm nay lấy danh sách tất cả nhân viên chưa
    return Boolean(isCallToday && isCallToday === today)
  }

  private async callAPI() {
    try {
      // gọi api
      let result = await request({
        uri: 'https://api.merchant.vn/v1/apps/info/business_employees',
        method: 'GET',
        json: true,
        headers: {
          'token-business': this.#token_business,
        },
      })
      // không có kết quả thì throw lỗi
      if (!result) throw { messege: 'Không có kết quả' }
      return keyBy(result.data.employees, '_id')
    } catch (error) {
      console.log('call api get all employ:', error)
      throw error
    }
  }
  public async getAllEmployee() {
    try {
      if (!this.#list_assigned_employee)
        throw 'Chưa khởi tạo danh sách nhân viên phụ trách'
      if (!this.#id_business) throw 'Chưa khởi tạo id doanh nghiệp'
      if (!this.#token_business) throw 'Chưa khởi tạo token doanh nghiệp'
      /** biến kiểm tra xem nhân viên phụ trách có thông tin trong danh sách tất cả \
       * nhân viên không */
      let id_exist: boolean = false

      // nếu danh sách nhân viên phụ trách rỗng thì không cần lấy thông tin nữa
      if (!this.#list_assigned_employee?.length) return null
      // lấy danh sách từ localStorage
      let list_employee_localstorage = JSON.parse(
        localStorage.getItem(this.#id_business + '-data') || '{}'
      )

      //kiểm tra các nhân viên phụ trách có thông tin trong danh sách của localStorage không
      if (list_employee_localstorage) {
        id_exist = this.#list_assigned_employee.every(
          (id) => id in list_employee_localstorage
        )
      }
      // nếu hôm nay chưa lấy danh sách hoặc các nhân viên phụ trách không có thông tin
      // trong danh sách lưu ở localStorage thì gọi api lấy danh sách mới và lưu vào localStorage
      if (
        !this.checkIsCallToday() ||
        !Object.keys(list_employee_localstorage) ||
        !id_exist
      ) {
        // lưu ngày gọi
        localStorage.setItem(this.#id_business, this.formatDate(new Date()))
        let result = await this.callAPI()
        // lưu data xuống localStorage
        localStorage.setItem(
          this.#id_business + '-data',
          JSON.stringify(result)
        )
        return result
      }
      // nếu đã gọi api ngày hôm đó và các nhân viên đều
      //có thông tin trong localStorage sẽ lấy data từ localStorage
      return list_employee_localstorage
    } catch (error) {
      throw error
    }
  }
}
