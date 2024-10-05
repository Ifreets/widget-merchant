/**
 * custom lại sweetalert
 */

import Swal from 'sweetalert2'
import type { SweetAlertIcon } from 'sweetalert2'

/**
 * hàm callback cơ bản, trả về lỗi và kết quả
 */
export interface Cb {
  (error?: any, result?: any): void
}

/**thông báo dạng confirm */
export const confirm = (
  /** icon thông báo */
  icon: SweetAlertIcon,
  /** tiêu đề thông báo */
  title: string,
  /** nội dung thông báo */
  text: string
) => Swal.fire({ title, text, icon, showCancelButton: true })

/**thông báo dạng alert */
export const alert = (
  /** icon thông báo */
  icon: SweetAlertIcon,
  /** tiêu đề thông báo */
  title: string,
  /** nội dung thông báo */
  text: string
) => Swal.fire({ title, text, icon })

/**thông báo dạng confirm */
export const confirm2 = (
  icon: SweetAlertIcon,
  title: string,
  text: string,
  proceed: Cb
) => Swal
  .fire({
    title, text, icon, showCancelButton: true,
    confirmButtonText: 'Xác nhận', cancelButtonText: 'Hủy bỏ'
  })
  .then(({ isConfirmed }: { isConfirmed: boolean }) => {
    if (!isConfirmed) return proceed(true)

    proceed()
  })
