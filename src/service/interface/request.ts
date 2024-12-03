/** Đầu vào để request api */
export interface InputRequestApi {
    /** Dữ liệu gửi đi */
    body?: any
    /** Token truy cập */
    access_token?: string
    /** Đuôi api */
    end_point?: string
    /** Headers */
    headers?: {}
    /** ẩn loading */
    hide_loading?: boolean
}

/** Đầu vào để request axios */
export interface InputRequestAxios {
    /** Url api */
    uri: string
    /** Phương thức request */
    method: 'POST' | 'GET'
    /** Dữ liệu gửi đi */
    body?: any
    /** Headers */
    headers?: any
}
