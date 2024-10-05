import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

interface ToastInterFace {
    /** Dạng thông báo thành công */
    success(message: string, position?: string, gravity?: string): void
    /** Dạng thông báo cảnh báo */
    warning(message: string, position?: string, gravity?: string): void
    /** Dạng thông báo lỗi */
    error(message: string, position?: string, gravity?: string): void
}

const toast = (
    message: string,
    type: string,
    position?: string | any,
    gravity?: string | any,
    duration?: number | any,
) => {
    let background: string, color: string;
    switch (type) {
        case "error":
            background = "linear-gradient(to right, #f43f5e, #e11d48)";
            color = "#fff";
            break;
        case "warning":
            background = "linear-gradient(to right, #fb923c, #f97316)";
            color = "#fff";
            break;
        case "success":
            background = "linear-gradient(to right, #22c55e, #16a34a)";
            color = "#fff";
            break;
        default:
            background = "linear-gradient(to right, #64748b, #475569)";
            color = "#fff";
    }

    Toastify({
        text: message,
        duration: duration || 3000,
        close: true,
        gravity: gravity || "top", // `top` or `bottom`
        position: position || "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: background,
            color: color,
        },
        onClick: function () { }, // Callback after click
    }).showToast();
};

export class Toast implements ToastInterFace {
    constructor() { }
    success(message: string, position?: string, gravity?: string) {
        toast(message, "success", position, gravity);
    }
    warning(message: string, position?: string, gravity?: string) {
        toast(message, "warning", position, gravity);
    }
    error(message: string, position?: string, gravity?: string) {
        toast(message, "error", position, gravity);
    }
}