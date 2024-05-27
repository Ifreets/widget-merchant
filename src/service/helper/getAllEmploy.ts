import type { Cb } from "../interface";
import { request } from "./request";

/** format date */
function formatDate(date: Date) {
    return (
        date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
    );
}
/** check xem đã gọi ngày hôm nay chưa */
function checkIsCallToday(id: string) {
    let isCallToday = localStorage.getItem(id);
    if (isCallToday && isCallToday === formatDate(new Date())) return false;
    // nếu không có đặt là ngày hôm nay
    localStorage.setItem(id, formatDate(new Date()));
    return true;
}

/** chuyển mảng nhân viên thành object */
function arrayToObject(arr: Object[]) {
    let result: any = {};
    arr.forEach((item: any) => {
        result[item["_id"]] = item;
    });
    return result;
}

function callAPI(token: string, id: string, Cb: Function) {
    request(
        {
            uri: "https://api.merchant.vn/v1/apps/info/business_employees",
            method: "GET",
            json: true,
            headers: {
                "token-business": token,
            },
        },
        (e: any, r: any) => {
            // lưu data xuống localStorage
            localStorage.setItem(
                id + "-data",
                JSON.stringify(arrayToObject(r.data.employees))
            );
            Cb(arrayToObject(r.data.employees));
        }
    );
}

/** thuật toán lấy toàn bộ danh sách theo hướng của anh Mạnh */
export function getAllEmployee(
    id: string,
    token: string,
    Cb: Function,
    list_employee: string[]
) {
    if (checkIsCallToday(id)) {
        callAPI(token, id, Cb);
    } else {
        // nếu đã gọi api ngày hôm đó sẽ lấy data từ localStorage
        if (localStorage.getItem(id + "-data")) {
            let list_employee_localstorage = JSON.parse(
                localStorage.getItem(id + "-data") || ""
            );
            let id_exist = list_employee.every(
                (id) => id in list_employee_localstorage
            );
            if (id_exist) {
                Cb(list_employee_localstorage);
            } else {
                callAPI(token, id, Cb);
            }
        }
    }
}
