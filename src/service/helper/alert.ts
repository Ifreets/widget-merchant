/**
 * custom lại sweetalert
 */

import Swal from 'sweetalert2'

import type { SweetAlertIcon } from 'sweetalert2'

/**thông báo dạng confirm */
export const confirm = (
  /** icon thông báo */
  icon: SweetAlertIcon,
  /** tiêu đề thông báo */
  title: string,
  /** nội dung thông báo */
  text: string
) => Swal.fire({ title, text, icon, showCancelButton: true })
