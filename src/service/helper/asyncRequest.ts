/**
 * lib để request api
 */

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
  headers?: HeadersInit
}

/** hàm gọi API */
export const request = async ({
  uri,
  method,
  json,
  body = {},
  headers = {},
}: InputRequest) => {
  try {
    // nếu body là json thì chuyển sang dạng chuỗi và tên các tham số header
    if (json) {
      body = JSON.stringify(body)
      headers = {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        ...headers,
      }
    }
    //nếu method là GET thì bỏ body
    if (method === 'GET') body = undefined
    //call api
    let result: any = await fetch(uri, { method, headers, body })
    //chuyển kết quả về json
    if (json) result = await result.json()
    return result
  } catch (e: any) {
    //check mất mạng
    if (e.message === 'Failed to fetch') {
      throw new Error('Mất kết nối máy chủ...')
    }
    throw e
  }
}
