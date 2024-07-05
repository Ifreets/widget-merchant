<template>
  <article class="h-full flex flex-col overflow-hidden">
    <section class="h-full flex flex-col gap-2 overflow-auto scrollbar-thin">
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <img :src="UserIcon" />
          <p class="font-semibold">
            Khách hàng
            {{ getContactPhone() }}
          </p>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <input
            class="px-3 py-2.5 border rounded-md outline-none placeholder:text-slate-500"
            type="text"
            placeholder="Họ và tên"
            :value="getContactName()"
            disabled
          />
          <input
            class="px-3 py-2.5 border rounded-md outline-none placeholder:text-slate-500"
            type="text"
            placeholder="Số điện thoại"
            :value="getContactPhone()"
            disabled
          />
        </div>
        <input
          class="px-3 py-2.5 border rounded-md outline-none placeholder:text-slate-500"
          type="text"
          placeholder="Địa chỉ"
          v-model="order.address"
        />
        <div class="grid grid-cols-3 gap-2">
          <Dropbox>
            <template #trigger>
              <button
                class="w-full flex items-center justify-between p-2 border rounded-md"
                @click="show_dropbox = true"
              >
                <span
                  class="truncate block text-slate-500"
                  v-if="!get(order, 'location.province.name')"
                >
                  Tỉnh, thành phố
                </span>
                <span
                  class="truncate block text-slate-500"
                  v-else
                >
                  {{ get(order, 'location.province.name') }}
                </span>
                <ArrowIcon class="text-gray-500" />
              </button>
            </template>
            <template #box>
              <div
                class="w-40 rounded-md p-1 shadow-md border flex flex-col gap-2 bg-white max-h-40 overflow-auto mt-2"
                v-if="show_dropbox"
              >
                <!-- <input
                  type="text"
                  class="px-2 py-1 border rounded-md focus:outline-none"
                  placeholder="Tìm kiếm"
                /> -->
                <div
                  v-for="item in provinces"
                  @click="selectProvince(item)"
                  class="px-3 py-1 hover:bg-slate-100"
                >
                  {{ item.name }}
                </div>
              </div>
            </template>
          </Dropbox>
          <Dropbox>
            <template #trigger>
              <button
                class="w-full flex items-center justify-between p-2 border rounded-md"
                @click="show_dropbox = true"
              >
                <span
                  class="truncate block text-slate-500"
                  v-if="!get(order, 'location.district.name_with_type')"
                >
                  Quận, Huyện
                </span>
                <span
                  class="truncate block text-slate-500"
                  v-else
                >
                  {{ get(order, 'location.district.name_with_type') }}
                </span>
                <ArrowIcon class="text-gray-500" />
              </button>
            </template>
            <template #box>
              <div
                class="w-40 rounded-md p-1 shadow-md border flex flex-col gap-2 bg-white max-h-40 overflow-auto mt-2"
                v-if="show_dropbox"
              >
                <!-- <input
                  type="text"
                  class="px-2 py-1 border rounded-md focus:outline-none"
                  placeholder="Tìm kiếm"
                /> -->
                <div
                  v-for="item in districts"
                  @click="selectDistrict(item)"
                  class="px-3 py-1 hover:bg-slate-100"
                >
                  {{ item.name_with_type }}
                </div>
              </div>
            </template>
          </Dropbox>
          <Dropbox>
            <template #trigger>
              <button
                class="w-full flex items-center justify-between p-2 border rounded-md"
                @click="show_dropbox = true"
              >
                <span
                  class="truncate block text-slate-500"
                  v-if="!get(order, 'location.ward.name_with_type')"
                >
                  Phường, xã
                </span>
                <span
                  class="truncate block text-slate-500"
                  v-else
                >
                  {{ get(order, 'location.ward.name_with_type') }}
                </span>
                <ArrowIcon class="text-gray-500" />
              </button>
            </template>
            <template #box>
              <div
                class="w-52 rounded-md p-1 shadow-md border flex flex-col gap-2 bg-white max-h-40 overflow-auto mt-2 -ml-20"
                v-if="show_dropbox"
              >
                <!-- <input
                  type="text"
                  class="px-2 py-1 border rounded-md focus:outline-none"
                  placeholder="Tìm kiếm"
                /> -->
                <div
                  v-for="item in wards"
                  @click="selectWard(item)"
                  class="px-3 py-1 hover:bg-slate-100"
                >
                  {{ item.name_with_type }}
                </div>
              </div>
            </template>
          </Dropbox>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <img :src="BagIcon" />
          <p class="font-semibold">Sản phẩm</p>
        </div>
        <Dropbox class="border py-2 px-3 rounded-md">
          <template #trigger>
            <div
              class="flex items-center gap-2"
              @click="show_dropbox = true"
            >
              <img
                :src="SearchIcon"
                class="flex-shink-0 w-4"
              />
              <input
                type="text"
                class="flex-grow outline-none placeholder:text-slate-500"
                placeholder="Nhập mã, tên sản phẩm..."
              />
              <ArrowIcon class="flex-shink-0 text-gray-500" />
            </div>
          </template>
          <template #box>
            <div
              class="w-full rounded-md p-1 shadow-md border flex flex-col gap-2 bg-white max-h-40 overflow-auto mt-3"
              v-if="show_dropbox"
            >
              <div
                v-for="product in products"
                @click="selectProduct(product, false)"
                class="py-2 px-2 rounded-md cursor-pointer hover:bg-slate-100 flex items-center gap-2"
              >
                <img
                  v-if="get(product, 'images[0]')"
                  :src="get(product, 'images[0]')"
                  class="w-8 h-8 rounded"
                />
                <img
                  :src="ProductIcon"
                  class="w-8 h-8 rounded"
                  v-else
                />
                <div>
                  <p class="font-medium text-sm">
                    {{ product.name }}
                    -
                    <span class="text-xs text-gray-600">
                      (#{{ product.product_id }})
                    </span>
                  </p>
                  <p class="font-medium text-xs">
                    {{ currency(product.price) || 0 }}
                  </p>
                </div>
              </div>
            </div>
          </template>
        </Dropbox>
        <table class="border-separate border-spacing-y-1">
          <thead>
            <tr class="bg-slate-500 text-white text-xs sticky top-0 z-10">
              <th class="text-start rounded-s font-medium py-1 pl-2">
                Tên sản phẩm
              </th>
              <th class="w-8 text-center font-medium py-1">SL</th>
              <th class="text-end font-medium py-1">Tồn</th>
              <th class="text-end font-medium py-1">Giảm giá</th>
              <th class="text-end font-medium py-1 pr-2 rounded-e">
                Tổng tiền
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!order.products?.length">
              <td
                colspan="5"
                class="text-center py-3 text-slate-500"
              >
                Chưa có sản phẩm
              </td>
            </tr>
            <tr
              v-else
              v-for="(product, index) in order.products"
              class="cursor-pointer hover:bg-slate-200 group"
            >
              <td class="py-1 pl-2 rounded-s">
                <p class="w-10/12 truncate">
                  {{ product.product_name }}
                </p>
              </td>
              <td class="text-end py-1">
                <cleave
                  class="w-8 text-center border-b border-black outline-none bg-transparent"
                  :options="cleave_options"
                  v-model="product.quantity"
                  @change="calculatorOrder(true)"
                  type="tel"
                />
              </td>
              <td class="text-end py-1">{{ product.inventory_quantity }}</td>
              <td class="text-end py-1">
                <cleave
                  class="w-14 text-end border-b border-black outline-none bg-transparent"
                  :options="cleave_options"
                  v-model="product.discount"
                  @change="calculatorOrder(true)"
                  type="tel"
                />
              </td>
              <td class="text-end py-1 pr-2 rounded-e">
                <div
                  class="flex items-center justify-end group w-full"
                  @click="removeProduct(index)"
                >
                  <p class="group-hover:hidden">
                    {{ currency(product.total_price) || 0 }}
                  </p>
                  <img
                    class="hidden group-hover:block mr-4"
                    :src="CancelIcon"
                    v-tooltip="'Xóa'"
                  />
                </div>
              </td>
            </tr>
            <tr class="bg-slate-200 font-semibold sticky bottom-0">
              <td class="text-end rounded-s py-1 pr-3">Tổng</td>
              <td class="text-center py-1">{{ order.quantity }}</td>
              <td class="text-end py-1">{{ order.inventory_quantity }}</td>
              <td class="text-end py-1">{{ order.discount }}</td>
              <td class="text-end py-1 rounded-e pr-2">
                {{  currency(order.total_price) || 0 }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <img :src="CreditCardIcon" />
          <p class="font-semibold">Thanh toán</p>
        </div>
        <div class="flex justify-between">
          <p>- Tổng tiền</p>
          <p class="font-bold text-base">0</p>
        </div>
        <div class="flex justify-between">
          <p>- Hình thức thanh toán</p>
          <Dropbox
            place="bottom"
            class="relative"
          >
            <template #trigger>
              <button
                class="flex items-center gap-1"
                @click="show_dropbox = true"
              >
                <span>{{ payment_methods[payment_method] }}</span>
                <ArrowIcon />
              </button>
            </template>
            <template #box>
              <ul
                class="relative right-0 bg-white shadow-md rounded-md overflow-x-hidden border"
                v-if="show_dropbox"
              >
                <li
                  v-for="(item, key) in payment_methods"
                  class="whitespace-nowrap py-1 px-3 cursor-pointer"
                  :class="
                    key === payment_method
                      ? 'bg-slate-500 text-white'
                      : 'hover:bg-slate-200'
                  "
                  @click="selectPayment(key)"
                >
                  {{ item }}
                </li>
              </ul>
            </template>
          </Dropbox>
        </div>
        <div class="flex justify-between flex-wrap">
          <p>- Đã thanh toán</p>
          <cleave
            v-if="payment_method === 'CASH'"
            class="w-28 outline-none border-b border-black text-end text-blue-700 font-bold text-base"
            :options="cleave_options"
          />
          <p
            v-if="payment_method === 'MOMO' || payment_method === 'TRANSFER'"
            class="font-bold text-base text-blue-700"
          >
            Chờ thanh toán
          </p>
          <div
            v-if="payment_method === 'MOMO'"
            class="w-full flex items-center gap-2.5"
          >
            <img
              :src="QRMomoImage"
              class="flex-shrink-0 h-min"
            />
            <div class="flex flex-col gap-1">
              <p>Thông tin Link thanh toán</p>
              <div class="text-xs-10 border py-1 px-3 rounded-md bg-slate-100">
                <p>Số tài khoản:123123123</p>
                <p>Tên tài khoản: CTCP Công nghệ Chatbot</p>
                <p>Ngân hàng: Techcombank</p>
                <p>Link TT: https://pay.merchant.vn/138m</p>
              </div>
              <button
                class="text-xs py-0.5 px-2 bg-blue-700 w-fit font-medium text-white rounded-md"
              >
                Sao chép Link
              </button>
              <button
                class="text-xs py-0.5 px-2 bg-blue-700 w-fit font-medium text-white rounded-md"
              >
                Sao chép ảnh QR
              </button>
            </div>
          </div>
          <div
            v-if="payment_method === 'TRANSFER'"
            class="w-full flex items-center gap-2.5"
          >
            <img
              :src="QRBankImage"
              class="flex-shrink-0 h-min"
            />
            <div class="flex flex-col gap-1">
              <p>Thông tin Link thanh toán</p>
              <div class="text-[10px] border py-1 px-3 rounded-md bg-slate-100">
                <p>Số tài khoản:123123123</p>
                <p>Tên tài khoản: CTCP Công nghệ Chatbot</p>
                <p>Ngân hàng: Techcombank</p>
                <p>Link TT: https://pay.merchant.vn/138m</p>
              </div>
              <button
                class="text-xs py-0.5 px-2 bg-blue-700 w-fit font-medium text-white rounded-md"
              >
                Sao chép Link
              </button>
              <button
                class="text-xs py-0.5 px-2 bg-blue-700 w-fit font-medium text-white rounded-md"
              >
                Sao chép ảnh QR
              </button>
            </div>
          </div>
        </div>
        <div class="flex justify-between">
          <p>- Còn phải thu</p>
          <p class="font-bold text-base text-red-500">0</p>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <img :src="QuestionMaskIcon" />
          <p class="font-semibold">Thông tin khác</p>
        </div>
        <p class="text-xs font-medium">Nhân viên phụ trách</p>
        <div class="grid grid-cols-2 gap-2.5">
          <Dropbox>
            <template #trigger>
              <button
                class="w-full flex items-center justify-between py-2 px-3 border rounded-md"
              >
                <span class="text-xs text-slate-500">Kinh doanh</span>
                <ArrowIcon />
              </button>
            </template>
          </Dropbox>
          <Dropbox>
            <template #trigger>
              <button
                class="w-full flex items-center justify-between py-2 px-3 border rounded-md"
              >
                <span class="text-xs text-slate-500">Triển khai</span>
                <ArrowIcon />
              </button>
            </template>
          </Dropbox>
        </div>
        <div class="grid grid-cols-2 gap-2.5">
          <Dropbox>
            <template #trigger>
              <button
                class="w-full flex items-center justify-between py-2 px-3 border rounded-md"
              >
                <span class="text-xs text-slate-500">Quảng cáo</span>
                <ArrowIcon />
              </button>
            </template>
          </Dropbox>
          <Dropbox>
            <template #trigger>
              <button
                class="w-full flex items-center justify-between py-2 px-3 border rounded-md"
              >
                <span class="text-xs text-slate-500">Hỗ trợ</span>
                <ArrowIcon />
              </button>
            </template>
          </Dropbox>
        </div>
        <p class="font-medium">Ghi chú</p>
        <div class="grid grid-cols-2 gap-2.5">
          <input
            type="text"
            class="w-full flex items-center justify-between py-2.5 px-3 outline-none border rounded-md placeholder:text-slate-500"
            placeholder="Ghi chú với khách"
          />
          <input
            type="text"
            class="w-full flex items-center justify-between py-2.5 px-3 outline-none border rounded-md placeholder:text-slate-500"
            placeholder="Ghi chú nội bộ"
          />
        </div>
      </div>
    </section>
    <section
      class="pt-3 pb-2 grid grid-cols-2 gap-2.5 text-base font-semibold flex-shrink-0"
    >
      <button
        class="bg-slate-200 text-slate-500 rounded-lg py-2 hover:brightness-90"
      >
        Làm lại
      </button>
      <button class="bg-black text-white rounded-lg py-2 hover:opacity-50">
        Tạo đơn
      </button>
    </section>
  </article>
</template>
<script setup lang="ts">
import { get } from 'lodash'
import { ref, onMounted } from 'vue'
import { useMerchantStore } from '@/stores'
import { copy, currency } from '@/service/helper/format'
import { cleave_options, payment_methods } from '@/service/options'
import {
  getProduct,
  getPackage,
  getDistrict,
  getWard,
} from '@/service/api/merchant'

// * Components
import cleave from 'vue-cleave-component'
import Dropbox from '@/components/Dropbox.vue'

// * Icons
import BagIcon from '@/assets/icons/bag.svg'
import UserIcon from '@/assets/icons/user.svg'
import SearchIcon from '@/assets/icons/search.svg'
import CancelIcon from '@/assets/icons/cancel.svg'
import QRMomoImage from '@/assets/imgs/qr-momo.png'
import QRBankImage from '@/assets/imgs/qr-bank.png'
import ProductIcon from '@/assets/icons/product.svg'
import ArrowIcon from '@/components/icons/ArrowIcon.vue'
import CreditCardIcon from '@/assets/icons/credit-card.svg'
import QuestionMaskIcon from '@/assets/icons/question-mark.svg'

/** Dữ liệu interface */
import type {
  Product,
  PaymentMethods,
  ProvinceData,
  DistrictData,
  WardData,
  Order,
} from '@/service/interface'

/** store merchant */
const $merchant = useMerchantStore()

/** đơn hàng */
const order = ref<Order>({
  products: [],
  quantity: 0,
  price: 0,
  discount: 0,
  vat: 0,
  total_price: 0,
  total_money: 0,
  money_paid: 0,
  money_back: 0,
  money_proceeds: 0,
  money_unpaid: 0,
  save_in_debt: false,
  payment_method: '',
  cashier: '',
  note: '',
  status: '',
  contact_id: $merchant.contact?.identifier_id,
  contact_info: {},
  other_costs: [],
  total_other_costs: 0,
  images: [],
  address: '',
  is_freeship: false,
  internal_note: '',
  internal_images: [],
  created_date: new Date(),
  custom_fields: {
    sales_channel: 'online',
    source: '',
    master: '',
    assistant: '',
  },
  location: {},
  order_journey: $merchant.setting?.online_status,
  staffs: $merchant.setting?.online_staff,
  inventory_quantity: 0
})

/** Danh sách phường xã */
const wards = ref<WardData[]>([])

/** danh sách sản phẩm */
const products = ref<Product[]>([])

/** Tìm kiếm sản phẩm */
const search_product = ref<string>('')

/** mở/đóng modal */
const show_dropbox = ref<boolean>(false)

/** Danh sách quận huyện */
const districts = ref<DistrictData[]>([])

/** phương thức thanh toán */
const payment_method = ref<PaymentMethods>('CASH')

/** Danh sách tỉnh thành */
const provinces = ref<ProvinceData[]>($merchant.provinces)

onMounted(() => {
  loadProduct()
})

/** chọn phương thức thanh toán */
function selectPayment(value: PaymentMethods) {
  show_dropbox.value = false
  payment_method.value = value
}

/** Lấy ra tên khách hàng */
function getContactName() {
  return `${$merchant.contact?.first_name} ${$merchant.contact?.last_name}`
}

/** Lấy ra sdt của contact */
function getContactPhone() {
  return $merchant.contact?.suggest_phone
}

/** Chọn tỉnh thành */
async function selectProvince(item: ProvinceData) {
  show_dropbox.value = false
  if (order.value.location) order.value.location.province = item
  if (order.value.location) order.value.location.district = {}
  if (order.value.location) order.value.location.ward = {}
  districts.value = await getDistrict({
    province_id: item.code,
  })
}

/** Chọn quận huyện */
async function selectDistrict(item: DistrictData) {
  show_dropbox.value = false
  if (order.value.location) order.value.location.district = item
  if (order.value.location) order.value.location.ward = {}
  wards.value = await getWard({
    district_id: item.code,
  })
}

/** Chọn phường xã */
function selectWard(item: WardData) {
  show_dropbox.value = false
  if (order.value.location) order.value.location.ward = item
}

/** Lấy thông tin sản phẩm */
async function loadProduct() {
  products.value = await getProduct({
    search: search_product.value,
  })
}
/** Chọn sản phẩm thêm vào đơn hàng */
function selectProduct(item: Product, still_show_box?: boolean) {
  // if (!isAvailablelUpdate("product")) return (show_dropbox.value = false);

  /** Cập nhật số lượng sản phẩm */
  if (order.value.products?.some(i => i.product_id === item.product_id)) {
    order.value.products = order.value.products.map(product => {
      if (
        product.product_id === item.product_id &&
        product.quantity &&
        item.type !== 'gmv'
      ) {
        product.quantity = Number(product.quantity) + 1
      }
      return product
    })
  } else {
    /** Thêm sản phẩm vào order */
    order.value.products?.push({
      product_id: item.product_id,
      product_name: item.name,
      images: item.images,
      price: item.price,
      quantity:
        item.type === 'gmv'
          ? 0
          : item.type === 'weighing_measuring_product'
          ? item.weight
          : 1,
      vat: item.vat || 0,
      service_fee: item.service_fee || 0,
      discount: 0,
      total_price: item.price,
      product_type: item.type || 'product',
      revenue_allocation: item.custom_fields?.revenue_allocation || false,
      weight: item.weight || 0,
      inventory_quantity: item.inventory_quantity || 0,
    })
  }

  /** Tắt modal */
  if (!still_show_box) show_dropbox.value = false

  /** Tính giá trị đơn hàng */
  calculatorOrder()
}
/** Loại bỏ sản phẩm khỏi order */
function removeProduct(index: number) {
  order.value.products = order.value.products?.filter((item, i) => {
    return i !== index
  })
  calculatorOrder()
}
/** Tính giá trị đơn hàng */
function calculatorOrder(is_update_order?: boolean) {
  /** Đơn giá */
  let product_price = 0
  /** Tổng tiền 1 loại sản phẩm trong đơn (số lượng x giá) */
  let price = 0
  /** Tổng số lượng sản phẩm */
  let quantity = 0
  /** Tổng tiền VAT */
  let vat = 0
  /** Tổng tiền giảm giá */
  let discount = 0
  /** Tồn kho */
  let inventory_quantity = 0

  /** Mảng sản phẩm trong đơn hàng */
  const products = order.value.products || []

  /** Tính toán số lượng và giá từng loại sản phẩm */
  order.value.products = products.map(item => {
    /** Tính phần trăng thuế */
    let percent_vat = Number(item.vat) / 100

    if(item.inventory_quantity) inventory_quantity += item.inventory_quantity

    // * Tính giá trị sản phẩm gmv
    if (item.product_type === 'gmv') {
      // * Tính tổng số lượng sản phẩm
      quantity += 1

      // * Tính tổng giá sản phẩm
      price += Number(item.quantity) * (Number(item.service_fee) / 100)

      // * Tính tổng thuế vat
      vat += Number(item.quantity) * percent_vat

      // * Tính tổng giảm giá
      discount += Number(item.discount)

      // * Tính tổng giá trị sản phẩm gmv
      item.total_price =
        Number(item.quantity) * (Number(item.service_fee) / 100) -
        Number(item.discount) +
        Number(percent_vat) * Number(item.quantity)
    }

    // * Tính giá trị sản phẩm cân đo
    if (item.product_type === 'weighing_measuring_product') {
      // * Tính giá trên 1 đơn vị khối lượng
      let price_per_weight = Number(item.price) / Number(item.weight)

      // * Tính tổng số lượng sản phẩm
      quantity += 1

      // * Tính tổng giá sản phẩm
      product_price += Number(item.price)

      // * Tính tổng giá sản phẩm
      price += Number(price_per_weight) * Number(item.quantity)

      // * Tính tổng thuế vat
      vat += Number(price_per_weight) * Number(item.quantity) * percent_vat

      // * Tính tổng giảm giá
      discount += Number(item.discount)

      // * Tính tổng tiền sản phẩm
      let item_price = Number(item.quantity) * Number(price_per_weight)

      // * Tính tổng giá trị sau khi giảm giá và thuế
      item.total_price =
        item_price - Number(item.discount) + Number(percent_vat) * item_price
    }

    // * Tính giá trị sản phẩm bình thường
    if (
      !item.product_type ||
      item.product_type === 'product' ||
      item.product_type === 'service'
    ) {
      // * Tính tổng số lượng sản phẩm
      quantity += Number(item.quantity)

      // * Tính tổng giá sản phẩm
      product_price += Number(item.price)

      // * Tính tổng thuế vat
      vat += Number(item.price) * Number(item.quantity) * percent_vat

      // * Tính tổng giảm giá
      discount += Number(item.discount) * Number(item.quantity)

      // * Tính tổng giá sản phẩm
      price += Number(item.price) * Number(item.quantity)

      // * Tính tổng tiền sản phẩm
      let item_price = Number(item.quantity) * Number(item.price)

      // * Tính tổng giá trị sau khi giảm giá và thuế
      item.total_price =
        item_price -
        Number(item.discount) * Number(item.quantity) +
        Number(percent_vat) * item_price
    }

    return item
  })

  order.value.quantity = quantity
  order.value.price = price
  order.value.vat = vat
  order.value.discount = discount
  order.value.total_price = price + vat - discount
  order.value.inventory_quantity = inventory_quantity
  if (order.value.custom_fields) {
    order.value.custom_fields['products_price'] = product_price
  }

  let total_other_costs = 0

  // * Tính tổng chi phí khác
  order.value.other_costs?.map(item => {
    total_other_costs += Number(item.value)
  })

  console.log('total_other_costs ===>', order.value.total_other_costs)

  order.value.total_other_costs = total_other_costs

  // * Tính tổng tiền khách cần trả
  order.value.total_money =
    Number(order.value.total_price) + Number(order.value.total_other_costs)

  // * Tính số tiền còn phải trả
  order.value.money_unpaid =
    Math.round(Number(order.value.total_money)) - Number(order.value.money_paid)

  if (is_update_order) updateAnOrder()
}

/** Cập nhật order */
async function updateAnOrder(status?: string) {
  // * Nếu order chưa có id thì dừng lại
  if (!order.value.id) return

  // * Nếu có trạng thái truyền vào thì cho thay đổi status order
  if (status) order.value.status = status

  // try {
  //   if (!checkOrderValid()) return
  //   await updateOrder({
  //     body: formatOrderData(order.value),
  //   })
  // } catch (e) {
  //   $toast.error(e as string)
  // }
}
</script>
