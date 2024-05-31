/**
 * custom lại sweetalert
 */

import Swal from "sweetalert2";

import type { SweetAlertIcon } from "sweetalert2";

/**thông báo dạng confirm */
export const confirm = (icon: SweetAlertIcon, title: string, text: string) =>
  Swal.fire({ title, text, icon, showCancelButton: true });
