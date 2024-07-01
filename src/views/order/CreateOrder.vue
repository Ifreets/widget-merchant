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
            <tr>
              <th>Tên sản phẩm</th>
              <th class="text-end">SL</th>
              <th class="text-end">Tồn</th>
              <th class="text-end">Giảm giá</th>
              <th class="text-end pr-2">Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colspan="5"
                class="text-center py-3 text-slate-500"
              >
                Chưa có sản phẩm
              </td>
            </tr>
            <tr class="bg-slate-200 font-semibold">
              <td class="text-end rounded-s">Tổng</td>
              <td class="text-end">0</td>
              <td class="text-end">0</td>
              <td class="text-end">0</td>
              <td class="text-end rounded-e pr-2">0</td>
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
          <Dropbox place="bottom">
            <template #trigger>
              <button class="flex items-center gap-1">
                <span>Tiền mặt</span>
                <ArrowIcon />
              </button>
            </template>
            <template #box>
              <ul
                class="absolute right-0 bg-white shadow-md rounded-md overflow-x-hidden"
              >
                <li
                  v-for="item in type_payment"
                  class="whitespace-nowrap py-1 px-3 cursor-pointer hover:bg-slate-200"
                >
                  {{ item?.label }}
                </li>
              </ul>
            </template>
          </Dropbox>
        </div>
        <div class="flex justify-between">
          <p>- Đã thanh toán</p>
          <cleave
            class="w-28 outline-none border-b border-black text-end text-blue-700 font-bold text-base"
            :options="cleave_options"
          />
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
        <p>Ghi chú</p>
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

// * components
import Dropbox from '@/components/Dropbox.vue'

// * icons
import UserIcon from '@/assets/icons/user.svg'
import ArrowIcon from '@/components/icons/ArrowIcon.vue'
import BagIcon from '@/assets/icons/bag.svg'
import SearchIcon from '@/assets/icons/search.svg'
import CreditCardIcon from '@/assets/icons/credit-card.svg'
import QuestionMaskIcon from '@/assets/icons/question-mark.svg'

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

const type_payment = [
  {
    label: 'Tiền mặt',
    value: 1,
  },
  {
    label: 'Momo (302)',
    value: 2,
  },
  {
    label: 'Chuyển khoản (305)',
    value: 3,
  },
]
</script>
