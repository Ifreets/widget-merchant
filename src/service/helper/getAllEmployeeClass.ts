import { request } from './asyncRequest'
import keyBy from 'lodash/keyBy'

class EmployeeFetcher {
  static #instance: EmployeeFetcher
  /** id doanh nghiệp */
  #id_business: string
  /** token doanh nghiệp */
  #token_business: string
  /** danh sách nhân viên phụ trách khách hàng */
  #list_assigned_employee?: string[]
  constructor(id_business: string, token_business: string) {
    if (!id_business) throw 'Chưa khởi tạo id doanh nghiệp'
    if (!token_business) throw 'Chưa khởi tạo token doanh nghiệp'
    this.#id_business = id_business
    this.#token_business = token_business
    this.#list_assigned_employee = []
  }
  /** singleton */
  public static getInstance(
    id_business: string,
    token_business: string
  ): EmployeeFetcher {
    // kiểm tra xem đã khởi tạo instance chưa, nếu chưa thì tạo mới
    // nếu đã tạo trả về instance đã tạo trước đó
    if (!EmployeeFetcher.#instance) {
      EmployeeFetcher.#instance = new EmployeeFetcher(
        id_business,
        token_business
      )
    }
    return EmployeeFetcher.#instance
  }
  /** format date */
  #formatDate(date: Date): string {
    return (
      date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
    )
  }
  /** check xem đã lấy danh sách tất cả nhân viên ngày hôm nay chưa */
  #checkIsCallToday(): boolean {
    // lấy giá trị của ngày hôm nay
    let today = this.#formatDate(new Date())
    // lấy ngày được lưu trong localStorage
    let isCallToday = localStorage.getItem(this.#id_business)
    // check xem ngày hôm nay lấy danh sách tất cả nhân viên chưa
    return Boolean(isCallToday && isCallToday === today)
  }
  /** hàm gọi API đồng bộ sang merchant */
  async #callAPI(): Promise<Record<string, any>> {
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
  /** hàm đặt giá trị cho danh sách nhân viên phụ trách */
  public setListAssignedEmployee(list_assigned_employee: string[]) {
    this.#list_assigned_employee = list_assigned_employee
  }

  public async getAllEmployee(): Promise<Record<string, any> | null> {
    try {
      /** biến kiểm tra xem nhân viên phụ trách có thông tin trong danh sách tất cả
      nhân viên không */
      let id_exist: boolean = false
      console.log(this.#list_assigned_employee)
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
        !this.#checkIsCallToday() ||
        !Object.keys(list_employee_localstorage) ||
        !id_exist
      ) {
        // lưu ngày gọi
        localStorage.setItem(this.#id_business, this.#formatDate(new Date()))
        let result = await this.#callAPI()
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
export default EmployeeFetcher.getInstance
