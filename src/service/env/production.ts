/**
 * .env.dev
 */

import type { Env } from '@/service/interface'

const ENV: Env = {
  // secret_key: '6f8b22eebe1d4d93b2f4a618901df020',
  secret_key: '3f1c74d5c1e74bfa9136cac1cbcbbf70',
  link_guild:
    'https://docs.google.com/document/d/1wEUjWLlLjhA1ZJ3ORD4z4KEszFBgopbIqq8KGLLGKUQ/edit?addon_store',
  chatbot: 'https://chatbox-app-v2.botbanhang.vn',
  chatbot_v2: 'https://chatbox-app-v2.botbanhang.vn',
  merchant: 'https://api.merchant.vn/v1',
  contact: 'https://api-contact.merchant.vn',
  product: 'https://api-product.merchant.vn',
}
export default ENV
