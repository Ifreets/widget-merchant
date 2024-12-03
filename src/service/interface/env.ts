export interface Env {
  /** key bí mật của widget */
  secret_key: string
  /** link hướng dẫn thiết lập */
  link_guild: string
  /** domain của chatbot cũ */
  chatbot: string
  /** domain của chatbot mới */
  chatbot_v2: string
  /** domain của merchant */
  merchant: string
  /** domain của contact */
  contact: string
  /** domain của đơn hàng, sản phẩm */
  product: string
}
