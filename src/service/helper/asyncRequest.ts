/**
 * lib để request api
 */

import axios from 'axios'
import { get } from 'lodash'
import type { Method } from '@/service/interface/app'

/** kiểu dữ liệu các tham số của request */
interface InputRequest {
  /** uri của request */
  uri: string
  /** phương thức request */
  method: Method
  /** body của request */
  body?: any
  /** body đầu vào là json, trả kết quả về json */
  json?: boolean
  /** tham số header */
  headers?: any
}

/** hàm gọi API */
export const request = async ({
  uri,
  method,
  body = {},
  headers = {},
}: InputRequest) => {
  try {
    /** Lấy ra kết quả request */
    let result = await axios(uri, { method, headers, data: body })

    /** Trả về kết quả */
    if (result.data) return result.data

    /** Trả về kết quả */
    return result

  } catch (e) {
    throw get(e, 'response.data.context_error.message') ||
    get(e, 'response.data.message') ||
    get(e, 'response.data') ||
    get(e, 'message') ||
    e
  }
}
