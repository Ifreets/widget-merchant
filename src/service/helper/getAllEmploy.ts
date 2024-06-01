import keyBy from 'lodash/keyBy'
import { request } from './asyncRequest'

/** format date */
function formatDate(date: Date) {
  return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
}
/** check xem đã lấy danh sách tất cả nhân viên ngày hôm nay chưa */
function checkIsCallToday(id: string) {
  // lấy giá trị của ngày hôm nay
  let today = formatDate(new Date())
  // lấy ngày được lưu trong localStorage
  let isCallToday = localStorage.getItem(id)
  // check xem ngày hôm nay lấy danh sách tất cả nhân viên chưa
  return isCallToday && isCallToday === today
}

/** chuyển mảng nhân viên thành object */
function arrayToObject(arr: Object[]) {
  let result: any = {}
  result = keyBy(arr, '_id')
  return result
}
/** hàm gọi API lấy danh sách tất cả nhân viên */
async function callAPI(token: string, id: string) {
  try {
    // gọi api
    let result = await request({
      uri: 'https://api.merchant.vn/v1/apps/info/business_employees',
      method: 'GET',
      json: true,
      headers: {
        'token-business': token,
      },
    })
    // không có kết quả thì throw lỗi
    if (!result) throw { messege: 'Không có kết quả' }
    return arrayToObject(result.data.employees)
  } catch (error) {
    console.log('call api get all employ:', error)
    throw error
  }
}

/** thuật toán lấy toàn bộ danh sách theo hướng của anh Mạnh
 * 1. Nếu không có danh sách nhân viên phụ trách thì không gọi API nữa
 * 2. Nếu đã gọi nhưng có nhân viên phụ trách không có thông tin trong danh sách
 * localStorage thì vẫn gọi API
 * 3. Nếu đã gọi và có thông tin của nhân viên phụ trách thì lấy data từ localStorage
 * 3. Nếu chưa thì gọi và lưu data vào localStorage
 */
export async function getAllEmployee(
  /** id của doanh nghiệp */
  id: string,
  /** token doanh nghiệp */
  token: string,
  /** danh sách nhân viên phụ trách khách hàng */
  list_employee: string[]
) {
  try {
    /** biến kiểm tra xem nhân viên phụ trách có thông tin trong danh sách tất cả \
     * nhân viên không */
    let id_exist: boolean = false

    // nếu danh sách nhân viên phụ trách rỗng thì không cần lấy thông tin nữa
    if (!list_employee.length) return null
    // lấy danh sách từ localStorage
    let list_employee_localstorage = JSON.parse(
      localStorage.getItem(id + '-data') || '{}'
    )

    //kiểm tra các nhân viên phụ trách có thông tin trong danh sách của localStorage không
    if (list_employee_localstorage) {
      id_exist = list_employee.every((id) => id in list_employee_localstorage)
    }
    // nếu hôm nay chưa lấy danh sách hoặc các nhân viên phụ trách không có thông tin
    // trong danh sách lưu ở localStorage thì gọi api lấy danh sách mới và lưu vào localStorage
    if (
      !checkIsCallToday(id) ||
      !Object.keys(list_employee_localstorage) ||
      !id_exist
    ) {
      // lưu ngày gọi
      localStorage.setItem(id, formatDate(new Date()))
      let result = await callAPI(token, id)
      // lưu data xuống localStorage
      localStorage.setItem(id + '-data', JSON.stringify(result))
      return result
    }
    // nếu đã gọi api ngày hôm đó và các nhân viên đều
    //có thông tin trong localStorage sẽ lấy data từ localStorage
    return list_employee_localstorage
  } catch (error) {
    throw error
  }
}
