<template>
  <article class="h-full flex flex-col overflow-hidden">
    <section class="h-full flex flex-col gap-2 overflow-auto scrollbar-thin">
      <!-- Hành trình đơn hàng -->
      <OrderJourney :order="order" />
      <!-- Thông tin đơn hàng -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <img :src="UserIcon" />
          <p class="font-semibold">Khách hàng</p>
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
        <div class="w-full">
          <Dropbox>
            <template #trigger>
              <div @click="show_dropbox = true">
                <input
                  class="px-3 py-2.5 border rounded-md outline-none placeholder:text-slate-500 w-full"
                  type="text"
                  placeholder="Địa chỉ"
                  v-model="order.address"
                  :readonly="!isAvailablelUpdate('address')"
                  @keyup="search_address"
                />
              </div>
            </template>
            <template #box>
              <div
                v-if="
                  show_dropbox &&
                  isAvailablelUpdate('address') &&
                  addresses.length
                "
                class="w-full p-1 bg-white rounded-md border shadow-md flex flex-col gap-1 mt-1"
              >
                <div
                  v-for="address in addresses"
                  @click="getDetailLocation(address)"
                  class="px-3 py-1.5 hover:bg-slate-100 rounded-md w-full"
                >
                  {{ address.address_name }}
                </div>
              </div>
            </template>
          </Dropbox>
        </div>
        <div class="grid grid-cols-1">
          <Dropbox>
            <template #trigger>
              <div
                class="w-full relative flex items-center"
                @click="show_dropbox = true, search_locations = ''"
              >
                <input
                  type="text"
                  id="province-input"
                  v-model="search_locations"
                  placeholder="Tỉnh, thành phố"
                  @keyup="searchLocation('province')"
                  v-if="!get(order, 'locations.province.name')"
                  class="w-full flex items-center justify-between p-2 border rounded-md focus:outline-none"
                />
                <div
                  v-if="get(order, 'locations.province.name')"
                  class="w-full flex items-center justify-between p-2 border rounded-md"
                >
                  {{ get(order, 'locations.province.name') }}
                </div>
                <ArrowIcon
                  class="text-gray-500 absolute right-3"
                  v-if="!get(order, 'locations.province.name')"
                />
                <img
                  :src="DeleteIcon"
                  @click="removeLocation('province')"
                  class="absolute right-3 w-2 cursor-pointer"
                  v-if="get(order, 'locations.province.name')"
                />
              </div>
            </template>
            <template #box>
              <div
                class="w-full rounded-md p-1 shadow-md border flex flex-col gap-2 bg-white max-h-40 overflow-auto mt-2"
                v-show="show_dropbox && isAvailablelUpdate('address')"
              >
                <div
                  v-for="item in provinces"
                  @click="selectProvince(item)"
                  v-show="!item.is_hidden"
                  class="px-3 py-1 hover:bg-slate-100"
                >
                  {{ item.name }}
                </div>
              </div>
            </template>
          </Dropbox>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <Dropbox>
            <template #trigger>
              <div
                class="w-full relative flex items-center"
                @click="show_dropbox = true, search_locations = ''"
              >
                <input
                  type="text"
                  id="province-input"
                  v-model="search_locations"
                  placeholder="Quận, Huyện"
                  @keyup="searchLocation('district')"
                  v-if="!get(order, 'locations.district.name')"
                  class="w-full flex items-center justify-between p-2 border rounded-md focus:outline-none"
                />
                <div
                  v-if="get(order, 'locations.district.name')"
                  class="w-full flex items-center justify-between p-2 border rounded-md"
                >
                  {{ get(order, 'locations.district.name') }}
                </div>
                <ArrowIcon
                  class="text-gray-500 absolute right-3"
                  v-if="!get(order, 'locations.district.name')"
                />
                <img
                  :src="DeleteIcon"
                  @click="removeLocation('district')"
                  class="absolute right-3 w-2 cursor-pointer"
                  v-if="get(order, 'locations.district.name')"
                />
              </div>
            </template>
            <template #box>
              <div
                class="w-full rounded-md p-1 shadow-md border flex flex-col gap-2 bg-white max-h-40 overflow-auto mt-2"
                v-if="show_dropbox && isAvailablelUpdate('address')"
              >
                <div
                  v-for="item in districts"
                  v-show="!item.is_hidden"
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
              <div
                class="w-full relative flex items-center"
                @click="show_dropbox = true, search_locations = ''"
              >
                <input
                  type="text"
                  id="province-input"
                  v-model="search_locations"
                  placeholder="Phường, Xã"
                  @keyup="searchLocation('ward')"
                  v-if="!get(order, 'locations.ward.name')"
                  class="w-full flex items-center justify-between p-2 border rounded-md focus:outline-none"
                />
                <div
                  v-if="get(order, 'locations.ward.name')"
                  class="w-full flex items-center justify-between p-2 border rounded-md"
                >
                  {{ get(order, 'locations.ward.name') }}
                </div>
                <ArrowIcon
                  class="text-gray-500 absolute right-3"
                  v-if="!get(order, 'locations.ward.name')"
                />
                <img
                  :src="DeleteIcon"
                  @click="removeLocation('ward')"
                  class="absolute right-3 w-2 cursor-pointer"
                  v-if="get(order, 'locations.ward.name')"
                />
              </div>
            </template>
            <template #box>
              <div
                class="w-full rounded-md p-1 shadow-md border flex flex-col gap-2 bg-white max-h-40 overflow-auto mt-2"
                v-if="show_dropbox && isAvailablelUpdate('address')"
              >
                <div
                  v-for="item in wards"
                  v-show="!item.is_hidden"
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
                v-model="search_product"
                v-on:keyup="start_search"
                :readonly="!isAvailablelUpdate('product')"
              />
              <ArrowIcon class="flex-shink-0 text-gray-500" />
            </div>
          </template>
          <template #box>
            <div
              class="w-full rounded-md p-1 shadow-md border flex flex-col gap-2 bg-white max-h-40 overflow-auto mt-3"
              v-if="show_dropbox && isAvailablelUpdate('product')"
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
        <div class="w-full overflow-auto">
          <table class="border-separate border-spacing-y-1 w-full">
            <thead>
              <tr class="bg-slate-500 text-white text-xs sticky top-0 z-10">
                <th class="text-start rounded-s font-medium py-1 pl-2">
                  Tên sản phẩm
                </th>
                <th class="text-center font-medium py-1">SL</th>
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
                  <p class="w-28 truncate">
                    {{ product.product_name }}
                  </p>
                </td>
                <td class="text-end py-1">
                  <cleave
                    class="text-end border-b border-black outline-none bg-transparent w-20"
                    :options="cleave_options"
                    v-model="product.quantity"
                    @change="calculatorOrder(true)"
                    type="tel"
                  />
                </td>
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
                      v-if="isAvailablelUpdate('product')"
                      class="hidden group-hover:block mr-4"
                      :src="CancelIcon"
                      v-tooltip="'Xóa'"
                    />
                  </div>
                </td>
              </tr>
              <tr class="bg-slate-200 font-semibold sticky bottom-0">
                <td class="text-end rounded-s py-1 pr-3">Tổng</td>
                <td class="text-end py-1">
                  {{ order.quantity || 0 }}
                </td>
                <td class="text-end py-1">
                  {{ currency(order.discount) || 0 }}
                </td>
                <td class="text-end py-1 rounded-e pr-2">
                  {{ currency(order.total_price) || 0 }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <img :src="CreditCardIcon" />
          <p class="font-semibold">Thanh toán</p>
        </div>
        <div class="grid grid-cols-2 items-center">
          <p>- Tổng tiền</p>
          <p class="font-bold text-base text-end text-green-600">
            {{ currency(order.total_money) || 0 }}
          </p>
        </div>
        <div class="grid grid-cols-2 items-center">
          <p>- Hình thức thanh toán</p>
          <div class="flex justify-end relative">
            <Dropbox place="bottom">
              <template #trigger>
                <button
                  class="flex items-center gap-1 text-end absolute right-0 -top-2.5"
                  @click="show_dropbox = true"
                >
                  <span>{{ payment_methods[payment_method] }}</span>
                  <ArrowIcon />
                </button>
              </template>
              <template #box>
                <div
                  class="w-full rounded-md p-1 shadow-md mt-3 border bg-white"
                  v-if="show_dropbox"
                >
                  <div
                    v-for="(value, key) in payment_methods"
                    @click="selectPayment(key)"
                    class="px-3 py-1.5 hover:bg-slate-100"
                  >
                    {{ value }}
                  </div>
                </div>
              </template>
            </Dropbox>
          </div>
        </div>
        <div
          class="grid grid-cols-2 items-center"
          v-if="payment_method === 'CASH'"
        >
          <p>- Đã thanh toán</p>
          <div class="flex justify-end">
            <cleave
              class="w-32 outline-none border-b border-black text-end text-blue-700 font-bold text-base"
              :options="cleave_options"
              v-model="order.money_paid"
              @change="calculatorOrder(true)"
              :readonly="!isAvailablelUpdate('money')"
            />
          </div>
        </div>
        <div
          class="w-full mt-1"
          v-if="payment_method === 'MOMO' || payment_method === 'TRANSFER'"
        >
          <div class="grid grid-cols-2">
            <p>- Đã thanh toán</p>
            <p class="font-bold text-base text-blue-700 text-end">
              Chờ thanh toán
            </p>
          </div>
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
              <div
                class="text-xs border py-1 px-3 rounded-md bg-slate-100 w-full"
              >
                <p>Số TK:123123123</p>
                <p>Tên TK: CTCP Công nghệ Chatbot</p>
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
              <div
                class="text-xs border py-1 px-3 rounded-md bg-slate-100 w-full"
              >
                <p>Số TK:123123123</p>
                <p>Tên TK: CTCP Công nghệ Chatbot</p>
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
        <div class="grid grid-cols-2">
          <p>- Còn phải thu</p>
          <p class="font-bold text-base text-red-500 text-end">
            {{ currency(order.money_unpaid) || 0 }}
          </p>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <img :src="QuestionMaskIcon" />
          <p class="font-semibold">Thông tin khác</p>
        </div>
        <p class="font-medium">Nhân viên phụ trách</p>
        <div class="grid grid-cols-2 gap-2 mb-2">
          <div
            v-for="(staff, index) in order.staffs"
            v-show="staff.active"
            class="relative"
            :class="{
              'col-span-2': index === 2,
            }"
          >
            <Dropbox>
              <template v-slot:trigger>
                <div
                  class="px-3 py-2.5 rounded-md border bg-white"
                  :class="{
                    'text-gray-500': !staff.employee_id,
                    'text-gray-800': staff.employee_id,
                  }"
                  @click="
                    isAvailablelUpdate('')
                      ? (show_dropbox = true)
                      : (show_dropbox = false)
                  "
                >
                  <p v-if="!staff.employee_id">
                    {{ staff.title }}
                  </p>
                  <p
                    v-if="staff.employee_id"
                    class="w-10/12 truncate whitespace-nowrap"
                  >
                    {{
                      getStaffName($merchant.employees_ids[staff.employee_id])
                    }}
                  </p>
                  <ChevronDownIcon
                    v-if="isAvailablelUpdate('')"
                    class="w-4 absolute right-3 top-2.5"
                  />
                </div>
              </template>
              <template v-slot:box>
                <div
                  class="p-1 rounded-md border bg-white mt-1 z-10 max-h-80 overflow-auto w-fit"
                  :class="{
                    '-ml-11': index === 1 || index === 3,
                  }"
                  v-if="show_dropbox && isAvailablelUpdate('money')"
                >
                  <div
                    @click="unSelectEmployee(index)"
                    class="px-3 py-1.5 text-center rounded hover:bg-slate-100 cursor-pointer"
                  >
                    -- Chọn {{ staff.title }} --
                  </div>
                  <div
                    v-for="employee in $merchant.employees_array"
                    class="rounded-lg px-3 py-1.5 hover:bg-slate-100 whitespace-nowrap truncate cursor-pointer flex items-center gap-2"
                    @click="selectEmployee(employee, index)"
                    v-show="
                      staff.department_id === '' ||
                      staff.department_id === employee.department_id
                    "
                  >
                    <span
                      v-if="!employee?.avatar"
                      class="rounded-full flex h-6 w-6 items-center justify-center bg-sky-600 font-normal text-white text-[9px]"
                    >
                      {{
                        convertEmployeeName(
                          employee.first_name,
                          employee.last_name
                        )
                      }}
                    </span>
                    <object
                      v-if="employee?.avatar"
                      :data="employee?.avatar"
                      type="image/png"
                      class="rounded-full h-6 w-6"
                    >
                      <span
                        class="rounded-full flex h-6 w-6 items-center justify-center bg-sky-600 font-normal text-white text-[9px]"
                      >
                        {{
                          convertEmployeeName(
                            employee.first_name,
                            employee.last_name
                          )
                        }}
                      </span>
                    </object>
                    <p>
                      {{ getStaffName(employee) }}
                    </p>
                  </div>
                </div>
              </template>
            </Dropbox>
          </div>
        </div>
        <p class="font-medium">Ghi chú</p>
        <div class="grid grid-cols-2 gap-2.5">
          <input
            type="text"
            class="w-full flex items-center justify-between py-2.5 px-3 outline-none border rounded-md placeholder:text-slate-500 text-sm"
            placeholder="Ghi chú với khách"
            v-model="order.note"
            :readonly="!isAvailablelUpdate('')"
          />
          <input
            type="text"
            class="w-full flex items-center justify-between py-2.5 px-3 outline-none border rounded-md placeholder:text-slate-500 text-sm"
            placeholder="Ghi chú nội bộ"
            v-model="order.internal_note"
            :readonly="!isAvailablelUpdate('')"
          />
        </div>
      </div>
    </section>
    <div
      v-if="order.order_journey && isAvailablelUpdate('')"
      class="py-2 border-t"
    >
      <div
        v-for="(step, step_index) in order.order_journey"
        v-show="checkStepActive() === step_index"
        class="flex gap-2 flex-row-reverse"
      >
        <div
          v-for="(status, status_index) in step"
          class="w-full rounded-md flex items-center justify-center py-2 cursor-pointer font-medium"
          :class="{
            [`${status.bg_color} ${status.text_color}`]: isNumber(status_index),
            'bg-slate-500 text-white cursor-not-allowed': !checkOrderValid(),
          }"
          @click="activeStep(step_index, status_index, status.action)"
        >
          {{ status.title }}
        </div>
      </div>
    </div>
  </article>
</template>
<script setup lang="ts">
import { useMerchantStore } from '@/stores'
import { ref, onMounted, readonly } from 'vue'
import { Toast } from '@/service/helper/toast'
import { nonAccentVn } from '@/service/helper/format'
import { get, isNumber, pick, debounce } from 'lodash'
import { confirm2 as confirm } from '@/service/helper/alert'
import { cleave_options, payment_methods } from '@/service/options'
import { currency, convertEmployeeName, copy } from '@/service/helper/format'
import {
  createOrder,
  updateOrder,
  getProduct,
  getPackage,
  getDistrict,
  getWard,
  detectAddress,
  getAddress,
} from '@/service/api/merchant'

// * Components
import cleave from 'vue-cleave-component'
import Dropbox from '@/components/Dropbox.vue'
import OrderJourney from '@/views/order/OrderJourney.vue'

// * Icons
import BagIcon from '@/assets/icons/bag.svg'
import UserIcon from '@/assets/icons/user.svg'
import SearchIcon from '@/assets/icons/search.svg'
import CancelIcon from '@/assets/icons/cancel.svg'
import QRMomoImage from '@/assets/imgs/qr-momo.png'
import QRBankImage from '@/assets/imgs/qr-bank.png'
import ProductIcon from '@/assets/icons/product.svg'
import DeleteIcon from '@/assets/icons/delete-black.svg'
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
  EmployeeData,
  DetectData,
  DetailData,
  Addresses,
  LocationDetail,
} from '@/service/interface'

/** store merchant */
const $merchant = useMerchantStore()

/** Toast */
const $toast = new Toast()

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
  locations: {},
  order_journey: $merchant.setting?.online_status || [],
  staffs: $merchant.setting?.online_staff || [],
  inventory_quantity: 0,
})

/** Tìm kiếm sản phẩm */
const start_search = debounce(() => {
  loadProduct()
}, 500)

/** Tìm kiếm địa chỉ */
const search_address = debounce(() => {
  searchAddress()
}, 500)

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

/** Danh sách địa chỉ */
const addresses = ref<Addresses[]>([])

/** Tìm kiếm tên địa điểm */
const search_locations = ref<string>('')

onMounted(() => {
  loadProduct()
  if ($merchant.order_edit.id) {
    order.value = $merchant.order_edit
    calculatorOrder()
    return
  }
  if (!order.value.id) {
    order.value.order_journey = copy($merchant.setting?.online_status || [])
    order.value.staffs = $merchant.setting?.online_staff
    order.value.contact_id = $merchant.contact?.identifier_id
    order.value.contact_info = $merchant.contact
  }
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
  if (order.value.locations) order.value.locations.province = item
  if (order.value.locations) order.value.locations.district = {}
  if (order.value.locations) order.value.locations.ward = {}
  districts.value = await getDistrict({
    province_id: item.code,
  })
  search_locations.value = ''
}

/** Chọn quận huyện */
async function selectDistrict(item: DistrictData) {
  show_dropbox.value = false
  if (order.value.locations) order.value.locations.district = item
  if (order.value.locations) order.value.locations.ward = {}
  wards.value = await getWard({
    district_id: item.code,
  })
  search_locations.value = ''
}

/** Chọn phường xã */
function selectWard(item: WardData) {
  show_dropbox.value = false
  if (order.value.locations) order.value.locations.ward = item
  search_locations.value = ''
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

    if (item.inventory_quantity) inventory_quantity += item.inventory_quantity

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

/** Tạo đơn hàng */
async function createNewOrder(status?: string) {
  try {
    if (!checkOrderValid()) return
    if (!order.value.contact_id) {
      return $toast.error('Vui lòng chọn khách hàng trước khi tạo đơn hàng')
    }
    // * Check địa chỉ
    if (!order.value.address) {
      return $toast.error('Vui lòng nhập chỉ trước khi tạo đơn hàng')
    }
    // * Check tỉnh thành
    if (!order.value?.locations?.province?.code) {
      return $toast.error('Vui lòng chọn tỉnh thành trước khi tạo đơn hàng')
    }
    // * Check quận huyện
    if (!order.value?.locations?.district?.code) {
      return $toast.error('Vui lòng chọn quận huyện trước khi tạo đơn hàng')
    }
    // * Check phường xã
    if (!order.value?.locations?.ward?.code) {
      return $toast.error('Vui lòng chọn phường xã trước khi tạo đơn hàng')
    }

    let new_order = await createOrder({
      ...formatOrderData(order.value),
      status: status ? status : 'DRART_ORDER',
    })

    console.log('new_order', new_order)

    order.value = new_order
    $toast.success('Tạo đơn hàng thành công')
  } catch (e) {
    $toast.error(e as string)
  }
}

/** Cập nhật order */
async function updateAnOrder(status?: string) {
  // * Nếu order chưa có id thì dừng lại
  if (!order.value.id) return

  // * Nếu có trạng thái truyền vào thì cho thay đổi status order
  if (status) order.value.status = status

  try {
    if (!checkOrderValid()) return
    await updateOrder(formatOrderData(order.value))
  } catch (e) {
    $toast.error(e as string)
  }
}

/** Check xem đối tượng có được quyền update hay không */
function isAvailablelUpdate(
  type: 'product' | 'customer' | 'money' | 'address' | ''
) {
  // * Nếu là đơn hàng đang tạo thì không cần check
  if (!order.value.order_id) return true

  // * Các trường hợp được update sản phẩm
  switch (order.value.status) {
    case 'DRART_ORDER':
      if (type === 'product') return true
      if (type === 'customer') return true
      if (type === 'money') return true
      if (type === 'address') return true
      if (type === '') return true
      break
    case 'CONFIRM_ITEMS':
      if (type === 'product') return false
      if (type === 'customer') return true
      if (type === 'money') return true
      if (type === 'address') return true
      if (type === '') return true
      break
    case 'CONFIRM_BUYER':
      if (type === 'product') return false
      if (type === 'customer') return false
      if (type === 'money') return true
      if (type === 'address') return true
      if (type === '') return true
      break
    case 'CONFIRM_METHOD_PAY':
      if (type === 'product') return false
      if (type === 'customer') return false
      if (type === 'money') return false
      if (type === 'address') return true
      if (type === '') return true
      break
    case 'CONFIRM_DELIVERY_ADDRESS':
      if (type === 'product') return false
      if (type === 'customer') return false
      if (type === 'money') return false
      if (type === 'address') return false
      if (type === '') return true
      break
    case 'INVENTORY_EXPORT':
      if (type === 'product') return false
      if (type === 'customer') return false
      if (type === 'money') return false
      if (type === 'address') return true
      if (type === '') return true
      break
    case 'INVENTORY_IMPORT':
      return false
    case 'CANCEL_ORDER':
      return false
    case 'ORDER_SUCESS':
      return false
    case 'CANCEL_ORDER':
      return false
    default:
      return false
  }
}

/** Lấy ra tên của nhân viên */
function getStaffName(staff: EmployeeData) {
  return staff.first_name + ' ' + staff.last_name
}

/** Bỏ chọn nhân viên */
function unSelectEmployee(index: number) {
  let staffs = order.value.staffs || []
  if (staffs[index]) {
    staffs[index] = {
      ...staffs[index],
      business_id: '',
      branch_id: '',
      team_id: '',
      employee_id: '',
      user_id: '',
    }
    order.value.staffs = staffs
  }
  show_dropbox.value = false
}

/** Chọn nhân viên */
function selectEmployee(employee: EmployeeData, index: number) {
  let staffs = order.value.staffs || []
  if (staffs[index]) {
    staffs[index] = {
      ...staffs[index],
      ...pick(employee, ['branch_id', 'business_id', 'team_id', 'user_id']),
      employee_id: employee._id,
    }
    order.value.staffs = staffs
  }
  show_dropbox.value = false
}

/** Kiểm tra đơn hàng có hợp lệ hay không? */
function checkOrderValid() {
  // * Kiểm tra sản phẩm
  if (!order.value.products?.length) return false
  return true
}

/** Format dữ liệu */
function formatOrderData(order: Order) {
  order.money_paid = Number(order.money_paid)
  return order
}

// * Check xem trạng thái đơn hàng nào đang được kích hoạt
function checkStepActive() {
  let result
  const order_journey = order.value?.order_journey || []
  order_journey.map((step, index_step) => {
    step.map(status => {
      if (status.is_active) result = index_step
    })
  })
  if (!result && result !== 0) return 0
  return result + 1
}

/** Kích hoạt step tiếp theo */
async function activeStep(
  step_index: number,
  status_index: number,
  action: string
) {
  try {
    // * Nếu dữ liệu đơn hàng không hợp lệ thì dừng lại
    if (!checkOrderValid()) return

    /** Kích hoạt 1 bước trong hành trình đơn hàng */
    function activeStatus() {
      order.value.order_journey?.map((step, index_step) => {
        step.map((status, index_status) => {
          if (index_step === step_index && index_status === status_index) {
            status.is_active = true
          } else status.is_active = false
        })
      })
    }

    // * Không xử lý gì cả
    if (action === 'NONE') {
      activeStatus()
      updateAnOrder()
    }

    // * Tạo đơn nháp
    if (action === 'DRART_ORDER') {
      if (
        order.value.custom_fields?.sales_channel === 'online' &&
        !order.value.contact_id
      ) {
        return $toast.error('Vui lòng chọn khách hàng trước khi tạo đơn hàng')
      }
      activeStatus()
      createNewOrder()
    }

    // * Xác nhận không thay đổi sản phẩm
    if (action === 'CONFIRM_ITEMS') {
      activeStatus()
      updateAnOrder('CONFIRM_ITEMS')
    }

    // * Xác nhận không thay đổi sản phẩm
    if (action === 'CONFIRM_BUYER') {
      activeStatus()
      updateAnOrder('CONFIRM_BUYER')
    }

    // * Xác nhận không thay đổi phương thức thanh toán
    if (action === 'CONFIRM_METHOD_PAY') {
      activeStatus()
      updateAnOrder('CONFIRM_METHOD_PAY')
    }

    // * Xác nhận không thay đổi địa chỉ nhận hàng
    if (action === 'CONFIRM_DELIVERY_ADDRESS') {
      activeStatus()
      updateAnOrder('CONFIRM_DELIVERY_ADDRESS')
    }

    // * Xác nhận xuất kho hàng
    if (action === 'INVENTORY_EXPORT') {
      order.value.is_inventory_export = true
      activeStatus()
      updateAnOrder('INVENTORY_EXPORT')
    }

    // * Xác nhận nhập kho hàng
    if (action === 'INVENTORY_IMPORT') {
      // * Nếu token chưa được xuất kho thì thông báo lỗi
      if (!order.value.is_inventory_export) {
        return $toast.error('Đơn hàng chưa được xuất kho')
      }

      confirm(
        'question',
        'Bạn có chắc chắc muốn hủy đơn hàng này?',
        '',
        async (e, r) => {
          if (e) return
          activeStatus()
          updateAnOrder('INVENTORY_IMPORT')
          $toast.success('Hủy đơn hàng thành công')
        }
      )
    }

    // * Đơn thành công
    if (action === 'ORDER_SUCESS') {
      activeStatus()
      updateAnOrder('ORDER_SUCESS')
    }

    // * Đơn hủy
    if (action === 'CANCEL_ORDER') {
      confirm(
        'question',
        'Bạn có chắc chắc muốn hủy đơn hàng này?',
        '',
        async (e, r) => {
          if (e) return
          activeStatus()
          updateAnOrder('CANCEL_ORDER')
          $toast.success('Hủy đơn hàng thành công')
        }
      )
    }

    // * Đơn thành công
    if (action === 'ALERT') {
      activeStatus()
      updateAnOrder('ALERT')
    }
  } catch (e) {
    $toast.error(e as string)
  }
}

/** Tìm kiếm địa chỉ */
async function searchAddress() {
  addresses.value = await detectAddress({
    address: order.value.address,
  })
}

/** Chọn địa chỉ */
async function getDetailLocation(address: Addresses) {
  /** Gán địa chỉ */
  order.value.address = address.address_name.split(' - ')[0]

  // * Tắt dropbox
  show_dropbox.value = false

  /** Lấy dữ liệu chi tiết */
  let location_detail = (await getAddress({
    address_id: address.address_id,
  })) as LocationDetail

  // * Gán dữ liệu loction
  if (order.value.locations) {
    provinces.value.map(item => {
      if (item.code === location_detail.province?.id && order.value.locations) {
        order.value.locations.province = item
      }
    })

    order.value.locations.district = {
      code: location_detail.district?.id,
      name: location_detail.district?.name,
      name_with_type: location_detail.district?.name,
    }

    order.value.locations.ward = {
      code: location_detail.ward?.id,
      name: location_detail.ward?.name,
      name_with_type: location_detail.ward?.name,
    }

    order.value.locations.street = {
      code: location_detail.street?.id,
      name: location_detail.street?.name,
    }

    order.value.locations.house_number = {
      code: location_detail.house_number?.id,
      name: location_detail.house_number?.name,
    }
  }

  // * Lấy thêm thông tin quận huyện
  if (location_detail.province?.id) {
    districts.value = await getDistrict({
      province_id: location_detail.province?.id,
    })
  }
  // * Lấy thêm thông tin phường xã
  if (location_detail.district?.id) {
    wards.value = await getWard({
      district_id: location_detail.district?.id,
    })
  }
}

/** Tìm kiếm location */
function searchLocation(type: 'province' | 'district' | 'ward') {
  let search = nonAccentVn(search_locations.value)
  if (type === 'province') {
    provinces.value.map(item => {
      let name = nonAccentVn(item.name as string)
      if (!search) item.is_hidden = false
      else if (name.includes(search)) item.is_hidden = false
      else item.is_hidden = true
    })
  }
  if (type === 'district') {
    districts.value.map(item => {
      let name = nonAccentVn(item.name as string)
      if (!search) item.is_hidden = false
      else if (name.includes(search)) item.is_hidden = false
      else item.is_hidden = true
    })
  }
  if (type === 'ward') {
    wards.value.map(item => {
      let name = nonAccentVn(item.name as string)
      if (!search) item.is_hidden = false
      else if (name?.includes(search)) item.is_hidden = false
      else item.is_hidden = true
    })
  }
}

/** Xóa location */
function removeLocation(type: 'province' | 'district' | 'ward') {
  search_locations.value = ''
  if (order.value.locations?.province && type === 'province') {
    order.value.locations.province = {}
  }
  if (order.value.locations?.district && type === 'district') {
    order.value.locations.district = {}
  }
  if (order.value.locations?.ward && type === 'ward') {
    order.value.locations.ward = {}
  }
}
</script>
