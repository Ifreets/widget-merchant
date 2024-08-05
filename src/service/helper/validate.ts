
/** hàm kiểm tra xem có phải số điện thoại hay không */
export function checkPhone(phone: string) {
  const regex = /^\+?(?:[0-9] ?){10,12}[0-9]$/;
  return regex.test(phone)
}

/** hàm kiểm tra xem có phải email hay không */
export function checkEmail(email: string) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email)
}