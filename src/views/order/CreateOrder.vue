<template>
  <article class="h-full flex flex-col overflow-hidden">
    <section class="h-full flex flex-col gap-2 overflow-auto scrollbar-thin">
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
          />
          <input
            class="px-3 py-2.5 border rounded-md outline-none placeholder:text-slate-500"
            type="number"
            placeholder="Số điện thoại"
          />
        </div>
        <input
          class="px-3 py-2.5 border rounded-md outline-none placeholder:text-slate-500"
          type="text"
          placeholder="Địa chỉ"
        />
        <div class="grid grid-cols-3 gap-2">
          <Dropbox>
            <template #trigger>
              <button
                class="w-full flex items-center justify-between p-2 border rounded-md"
              >
                <span class="truncate block text-slate-500">
                  Tỉnh, thành phố
                </span>
                <ArrowIcon class="text-gray-500" />
              </button>
            </template>
          </Dropbox>
          <Dropbox>
            <template #trigger>
              <button
                class="w-full flex items-center justify-between p-2 border rounded-md"
              >
                <span class="truncate block text-slate-500">Quận, Huyện</span>
                <ArrowIcon class="text-gray-500" />
              </button>
            </template>
          </Dropbox>
          <Dropbox>
            <template #trigger>
              <button
                class="w-full flex items-center justify-between p-2 border rounded-md"
              >
                <span class="truncate block text-slate-500">Phường, xã</span>
                <ArrowIcon class="text-gray-500" />
              </button>
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
            <div class="flex items-center gap-2">
              <img
                :src="SearchIcon"
                class="flex-shink-0"
              />
              <input
                type="text"
                class="flex-grow outline-none placeholder:text-slate-500"
                placeholder="Nhập mã, tên sản phẩm..."
              />
              <ArrowIcon class="flex-shink-0 text-gray-500" />
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
            <tr v-if="!products.length">
              <td
                colspan="5"
                class="text-center py-3 text-slate-500"
              >
                Chưa có sản phẩm
              </td>
            </tr>
            <tr
              v-else
              v-for="product in products"
              class="cursor-pointer hover:bg-slate-200 group"
            >
              <td class="py-1 pl-2 rounded-s">
                {{ product.name }}
              </td>
              <td class="text-end py-1">
                <cleave
                  v-model="product.mount"
                  class="w-8 text-center border-b border-black outline-none bg-transparent"
                  :options="cleave_options"
                />
              </td>
              <td class="text-end py-1">21</td>
              <td class="text-end py-1">
                <cleave
                  v-model="product.discount"
                  class="w-14 text-end border-b border-black outline-none bg-transparent"
                  :options="cleave_options"
                />
              </td>
              <td class="text-end py-1 pr-2 rounded-e">
                <div class="relative">
                  <p class="group-hover:opacity-0">
                    {{ Intl.NumberFormat().format(product.total_price) }}
                  </p>
                  <img
                    @click="console.log(product)"
                    class="hidden group-hover:block absolute top-0 right-4"
                    :src="CancelIcon"
                    v-tooltip="'Xóa'"
                  />
                </div>
              </td>
            </tr>
            <tr class="bg-slate-200 font-semibold sticky bottom-0">
              <td class="text-end rounded-s py-1">Tổng</td>
              <td class="text-center py-1">24</td>
              <td class="text-end py-1">63</td>
              <td class="text-end py-1">240.000</td>
              <td class="text-end py-1 rounded-e pr-2">960.000</td>
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
                @click="is_open_modal = true"
              >
                <span>{{
                  type_payment.filter(item => item?.value === payment)[0].label
                }}</span>
                <ArrowIcon />
              </button>
            </template>
            <template #box>
              <ul
                class="relative right-0 bg-white shadow-md rounded-md overflow-x-hidden border"
                v-if="is_open_modal"
              >
                <li
                  v-for="item in type_payment"
                  class="whitespace-nowrap py-1 px-3 cursor-pointer"
                  :class="
                    item.value === payment
                      ? 'bg-slate-500 text-white'
                      : 'hover:bg-slate-200'
                  "
                  @click="choosePayment(item?.value)"
                >
                  {{ item?.label }}
                </li>
              </ul>
            </template>
          </Dropbox>
        </div>
        <div class="flex justify-between flex-wrap">
          <p>- Đã thanh toán</p>
          <cleave
            v-if="payment === '1'"
            class="w-28 outline-none border-b border-black text-end text-blue-700 font-bold text-base"
            :options="cleave_options"
          />
          <p
            v-if="payment === '2' || payment === '3'"
            class="font-bold text-base text-blue-700"
          >
            Chờ thanh toán
          </p>
          <div
            v-if="payment === '2'"
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
            v-if="payment === '3'"
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
// * libraries
import cleave from 'vue-cleave-component'
import { ref } from 'vue'
import { mockup_products } from '@/service/mockup'

// * components
import Dropbox from '@/components/Dropbox.vue'

// * icons
import UserIcon from '@/assets/icons/user.svg'
import ArrowIcon from '@/components/icons/ArrowIcon.vue'
import BagIcon from '@/assets/icons/bag.svg'
import SearchIcon from '@/assets/icons/search.svg'
import CreditCardIcon from '@/assets/icons/credit-card.svg'
import QuestionMaskIcon from '@/assets/icons/question-mark.svg'
import CancelIcon from '@/assets/icons/cancel.svg'
import QRMomoImage from '@/assets/imgs/qr-momo.png'
import QRBankImage from '@/assets/imgs/qr-bank.png'

/** Cấu hình cleave */
const cleave_options = {
  numeral: true,
  numeralThousandsGroupStyle: 'thousand',
  numeralDecimalMark: ',',
  delimiter: '.',
  prefix: '',
  noImmediatePrefix: true,
  rawValueTrimPrefix: true,
  numeralDecimalScale: 3,
}

/** các phương thức thanh toán */
const type_payment = [
  {
    label: 'Tiền mặt',
    value: '1',
  },
  {
    label: 'Momo (302)',
    value: '2',
  },
  {
    label: 'Chuyển khoản (305)',
    value: '3',
  },
]

/** danh sách sản phẩm */
const products = ref<any[]>(mockup_products)

/** phương thức thanh toán */
const payment = ref<string>('1')

/** mở/đóng modal */
const is_open_modal = ref<boolean>(false)

/** chọn phương thức thanh toán */
function choosePayment(value: string) {
  is_open_modal.value = false
  payment.value = value
}
</script>
