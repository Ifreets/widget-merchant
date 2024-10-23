import type { InjectionKey } from 'vue'
import type { TSynchData } from '../interface'

export const keySynchData = Symbol() as InjectionKey<TSynchData>

export const PRODUCT_DEFAULT = {
  cost:0,
  product_id: '',
  product_name: '',
  type: 'product',
  status:'ACTIVE',
  custom_fields: {
    revenue_allocation: false,
    commission_allocation: false,
    value_gradually_decreases: null,
    departments_allocated_commissions: [],
    calculate_commission_for_marketing: false,
  },
  price: 0,
  wholesale_price: 0,
  vat: 0,
  service_fee: null,
  max_inventory_quantity: 0,
  min_inventory_quantity: 0,
  sold_when_quantity_runs_out: false,
  weight: 0,
  length: 0,
  width: 0,
  height: 0,
  images: [],
  quantity:1,
  discount:0,
  total_price:0,
}
