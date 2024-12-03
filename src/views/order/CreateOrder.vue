<template>
  <article class="h-full flex flex-col overflow-auto scrollbar-thin">
    <section class="h-max flex flex-col gap-2">
      <!-- Hành trình đơn hàng -->
      <!-- <OrderJourney :order="order" /> -->
      <!-- Thông tin đơn hàng -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <img :src="UserIcon" />
          <p class="font-semibold">Khách hàng</p>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <input
            id="customer-name-input"
            class="px-3 py-2.5 border rounded-md outline-none placeholder:text-slate-500"
            :class="{
              'border-red-500': !customer_name && alert_validate,
            }"
            type="text"
            placeholder="Họ và tên"
            @change="updateAnOrder()"
            v-model="customer_name"
          />
          <Dropbox>
            <template #trigger>
              <div
                @click="show_dropbox = true"
                class="relative flex items-center"
              >
                <input
                  id="phone-input"
                  class="w-full px-3 py-2.5 border rounded-md outline-none placeholder:text-slate-500"
                  :class="{
                    'border-red-500':
                      (!customer_phone || is_phone_valid) && alert_validate,
                  }"
                  type="text"
                  placeholder="Số điện thoại"
                  @change="updatePhoneNumber"
                  v-model="customer_phone"
                />
                <ArrowIcon class="text-gray-500 absolute right-3" />
              </div>
            </template>
            <template #box>
              <div
                class="bg-white border rounded-lg p-1 my-1 max-h-40 overflow-auto scrollbar-thin"
                v-if="show_dropbox"
              >
                <div
                  v-for="phone in $merchant.contact?.suggest_phone?.split(',')"
                  @click="setContactPhone(phone)"
                  class="cursor-pointer px-3 py-1.5 hover:bg-slate-100 rounded-md"
                >
                  {{ phone }}
                </div>
              </div>
            </template>
          </Dropbox>
        </div>
        <div class="w-full">
          <Dropbox>
            <template #trigger>
              <div
                @click="show_dropbox = true"
                class="relative flex items-center"
              >
                <input
                  id="address-input"
                  type="text"
                  placeholder="Địa chỉ"
                  v-model="order_edit.address"
                  @input="search_address"
                  @keyup.enter="selectLocation('address')"
                  @keyup.up="controlLocation('address', 'up')"
                  @keyup.down="controlLocation('address', 'down')"
                  @keydown.tab="tabEvent('address')"
                  :readonly="!isAvailablelUpdate('address')"
                  class="px-3 py-2.5 border rounded-md placeholder:text-slate-500 w-full"
                  :class="{
                    'border-red-500':
                      !order_edit.address && alert_validate && check_address,
                  }"
                />
                <img
                  :src="DeleteIcon"
                  v-show="order_edit.address"
                  @click="removeLocation('all')"
                  v-if="isAvailablelUpdate('address')"
                  class="absolute right-3 w-2 cursor-pointer"
                />
              </div>
            </template>
            <template #box>
              <div
                v-if="show_dropbox && isAvailablelUpdate('address')"
                class="w-full p-1 bg-white rounded-md border shadow-md flex flex-col gap-1 mt-1 max-h-60 overflow-y-auto"
              >
                <template
                  v-if="order_edit.address"
                  v-for="(address, index) in addresses"
                >
                  <div
                    @click="getDetailLocation(address)"
                    class="px-3 py-1.5 hover:bg-slate-100 rounded-md w-full"
                    :class="{
                      'bg-slate-100': index === location_index,
                    }"
                  >
                    {{ address?.address_name }}
                  </div>
                </template>
                <template
                  v-else
                  v-for="(address, index) in selected_address"
                >
                  <div
                    @click="
                      () => {
                        order_edit.address = address.address
                        order_edit.locations = JSON.parse(
                          JSON.stringify(address.locations)
                        )
                        show_dropbox = false
                      }
                    "
                    class="px-3 py-1.5 hover:bg-slate-100 rounded-md w-full"
                    :class="{
                      'bg-slate-100': index === location_index,
                    }"
                  >
                    {{ address?.full_address }}
                  </div>
                </template>
                <div
                  v-if="
                    $merchant.orders?.length &&
                    !order_edit.id &&
                    lastest_address_show
                  "
                  class="px-3 py-1.5 hover:bg-slate-100 rounded-md w-full flex gap-2"
                  @click="
                    () => {
                      order_edit.address = $merchant.orders?.[0]?.address
                      order_edit.locations = $merchant.orders?.[0].locations
                      show_dropbox = false
                    }
                  "
                >
                  <CheckCircle class="stroke-green-600 w-6 h-6" />
                  {{ lastest_address_show }}
                </div>
              </div>
            </template>
          </Dropbox>
        </div>
        <div class="grid grid-cols-1">
          <!-- Tỉnh thành phố -->
          <Dropbox>
            <template #trigger>
              <div
                class="w-full relative flex items-center"
                @click="show_dropbox = true"
              >
                <input
                  type="text"
                  id="province-input"
                  v-model="search_provice"
                  :placeholder="getProvinceName() || `Tỉnh, thành phố`"
                  @input="searchLocation('province')"
                  @keyup.enter="selectLocation('province')"
                  @keyup.up="controlLocation('province', 'up')"
                  @keyup.down="controlLocation('province', 'down')"
                  @keydown.tab="tabEvent('province')"
                  @focusin="
                    () => {
                      search_provice = ''
                      resetHidden()
                    }
                  "
                  @focusout="() => (search_provice = getProvinceName() || '')"
                  class="w-full flex items-center justify-between p-2 border rounded-md"
                  :class="{
                    'border-red-500':
                      !getProvinceName() && alert_validate && check_address,
                    'placeholder:text-black': getProvinceName(),
                  }"
                />
                <ArrowIcon
                  class="text-gray-500 absolute right-3"
                  v-show="!getProvinceName()"
                />
                <img
                  :src="DeleteIcon"
                  @click="removeLocation('province')"
                  class="absolute right-3 w-2 cursor-pointer"
                  v-show="getProvinceName()"
                  v-if="isAvailablelUpdate('address')"
                />
              </div>
            </template>
            <template #box>
              <div
                class="w-full rounded-md p-1 shadow-md border flex flex-col gap-2 bg-white max-h-40 overflow-auto mt-2"
                v-show="show_dropbox && isAvailablelUpdate('address')"
              >
                <div
                  :id="`province-${index}`"
                  v-for="(item, index) in provinces"
                  @click="selectProvince(item)"
                  class="px-3 py-1 hover:bg-slate-100 rounded"
                  :class="{
                    'bg-slate-100': index === province_index,
                  }"
                >
                  {{ item.name }}
                </div>
              </div>
            </template>
          </Dropbox>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <!-- Quận huyện -->
          <Dropbox>
            <template #trigger>
              <div
                class="w-full relative flex items-center"
                @click="show_dropbox = true"
              >
                <input
                  type="text"
                  id="district-input"
                  v-model="search_district"
                  :placeholder="getDistrictName() || `Quận, huyện`"
                  @focusin="
                    () => {
                      search_district = ''
                      resetHidden()
                    }
                  "
                  @focusout="() => (search_district = getDistrictName() || '')"
                  @input="searchLocation('district')"
                  @keyup.enter="selectLocation('district')"
                  @keyup.up="controlLocation('district', 'up')"
                  @keyup.down="controlLocation('district', 'down')"
                  @keydown.tab="tabEvent('district')"
                  class="w-full flex items-center justify-between p-2 border rounded-md"
                  :class="{
                    'border-red-500':
                      !getDistrictName() && alert_validate && check_address,
                    'placeholder:text-black': getDistrictName(),
                  }"
                />
                <ArrowIcon
                  class="text-gray-500 absolute right-3"
                  v-show="!getDistrictName()"
                />
                <img
                  :src="DeleteIcon"
                  @click="removeLocation('district')"
                  class="absolute right-3 w-2 cursor-pointer"
                  v-show="getDistrictName()"
                  v-if="isAvailablelUpdate('address')"
                />
              </div>
            </template>
            <template #box>
              <div
                class="w-full rounded-md p-1 shadow-md border flex flex-col gap-2 bg-white max-h-40 overflow-auto mt-2"
                v-show="show_dropbox && isAvailablelUpdate('address')"
              >
                <div
                  :id="`district-${index}`"
                  v-for="(item, index) in districts"
                  @click="selectDistrict(item)"
                  class="px-3 py-1 hover:bg-slate-100 rounded"
                  :class="{
                    'bg-slate-100': index === district_index,
                  }"
                >
                  {{ item.name_with_type }}
                </div>
              </div>
            </template>
          </Dropbox>
          <!-- Phường xã -->
          <Dropbox>
            <template #trigger>
              <div
                class="w-full relative flex items-center"
                @click="show_dropbox = true"
              >
                <input
                  type="text"
                  id="ward-input"
                  v-model="search_ward"
                  :placeholder="getWardName() || `Phường, xã`"
                  @focusin="
                    () => {
                      search_ward = ''
                      resetHidden()
                    }
                  "
                  @focusout="() => (search_ward = getWardName() || '')"
                  @input="searchLocation('ward')"
                  @keyup.enter="selectLocation('ward')"
                  @keyup.up="controlLocation('ward', 'up')"
                  @keyup.down="controlLocation('ward', 'down')"
                  @keydown.tab="tabEvent('ward')"
                  class="w-full flex items-center justify-between p-2 border rounded-md k"
                  :class="{
                    'border-red-500':
                      !getWardName() && alert_validate && check_address,
                    'placeholder:text-black': getWardName(),
                  }"
                />
                <ArrowIcon
                  class="text-gray-500 absolute right-3"
                  v-show="!getWardName()"
                />
                <img
                  :src="DeleteIcon"
                  @click="removeLocation('ward')"
                  class="absolute right-3 w-2 cursor-pointer"
                  v-show="getWardName()"
                  v-if="isAvailablelUpdate('address')"
                />
              </div>
            </template>
            <template #box>
              <div
                class="w-full rounded-md p-1 shadow-md border flex flex-col gap-2 bg-white max-h-40 overflow-auto mt-2"
                v-show="show_dropbox && isAvailablelUpdate('address')"
              >
                <div
                  :id="`ward-${index}`"
                  v-for="(item, index) in wards"
                  @click="selectWard(item)"
                  class="px-3 py-1 hover:bg-slate-100 rounded"
                  :class="{
                    'bg-slate-100': index === ward_index,
                  }"
                >
                  {{ item.name_with_type }}
                </div>
              </div>
            </template>
          </Dropbox>
        </div>
      </div>
      <!-- tìm kiếm sản phẩm -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <img :src="BagIcon" />
          <p class="font-semibold">Sản phẩm</p>
        </div>
        <div class="flex gap-2 items-center">
          <Dropbox
            class="border py-2 px-3 rounded-md group focus-within:border-blue-600 focus-within:border-2"
            :class="{
              '!border-red-500': !order_edit.products?.length && alert_validate,
            }"
          >
            <template #trigger>
              <div
                class="flex items-center gap-2"
                @click="openSearchProduct"
              >
                <img
                  :src="SearchIcon"
                  class="flex-shink-0 w-4"
                />
                <input
                  id="product-input"
                  type="text"
                  v-model="search_product"
                  @input="start_search"
                  @keyup.enter="selectProductByIndex"
                  @keyup.up="controlProduct('up')"
                  @keyup.down="controlProduct('down')"
                  placeholder="Nhập mã, tên sản phẩm..."
                  :readonly="!isAvailablelUpdate('product')"
                  class="flex-grow outline-none placeholder:text-slate-500 focus:group:border-blue-700"
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
                  v-for="(product, index) in products"
                  :id="`product-${index}`"
                  @click="selectProduct(product, false)"
                  class="py-2 px-2 rounded-md cursor-pointer hover:bg-slate-100 flex items-center gap-2"
                  :class="{
                    'bg-slate-100': index === product_index,
                  }"
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
                <div
                  class="flex flex-col items-center gap-2.5 my-5"
                  v-if="
                    products.length === 0 && !is_calling_api && !search_product
                  "
                >
                  <p class="text-slate-500">Chưa có sản phẩm</p>
                  <button
                    class="font-medium bg-slate-100 text-slate-700 py-2 px-6 rounded-lg gap-1 flex"
                    @click="linkToProductApp"
                  >
                    <img src="@/assets/icons/plus.svg" />
                    <span> Thêm sản phẩm </span>
                  </button>
                </div>
              </div>
            </template>
          </Dropbox>
          <div
            class="bg-black p-2 rounded-md h-fit cursor-pointer"
            @click="addProduct"
            v-tooltip="'Thêm nhanh SP'"
          >
            <img
              src="@/assets/icons/solid_plus.svg"
              class="min-w-5 h-5"
            />
          </div>
        </div>
        <div class="w-full overflow-auto">
          <table class="border-separate border-spacing-y-1 w-full">
            <thead>
              <tr class="bg-slate-500 text-white text-xs sticky top-0 z-10">
                <th class="text-start rounded-s font-medium p-1">
                  Tên sản phẩm
                </th>
                <th class="text-end font-medium p-1">SL</th>
                <th class="text-end font-medium p-1">Đơn giá</th>
                <th class="text-end font-medium p-1 rounded-e">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!order_edit.products?.length">
                <td
                  colspan="5"
                  class="text-center py-3 text-slate-500"
                >
                  <div class="flex flex-col items-center gap-2.5">
                    <div class="rounded-full bg-slate-100 p-3">
                      <img src="@/assets/icons/product-gray.svg" />
                    </div>
                    <p>Chưa có sản phẩm</p>
                  </div>
                </td>
              </tr>
              <tr
                v-else
                v-for="(product, index) in order_edit.products"
                class="cursor-pointer hover:bg-slate-200 group w-max font-medium"
              >
                <td class="p-1 rounded-s">
                  <div v-if="product?.product_id">
                    <p class="w-32 truncate">
                      {{ product?.product_name || '' }}
                    </p>
                    <p
                      :class="{
                        'text-red-500':
                          Number(product.inventory_quantity || 0) <= 0,
                      }"
                      class="text-xs font-normal"
                    >
                      Tồn: {{ product.inventory_quantity }}
                    </p>
                  </div>
                  <input
                    v-else
                    type="text"
                    v-model="product.product_name"
                    :placeholder="'Tên sản phẩm'"
                    class="w-32 border-b outline-none border-black bg-transparent placeholder:text-slate-500"
                  />
                </td>
                <td class="text-end p-1">
                  <cleave
                    class="text-end border-b border-black outline-none bg-transparent w-12"
                    :class="{
                      'text-slate-500': Number(product.quantity) === 0,
                    }"
                    :options="cleave_options"
                    v-model="product.quantity"
                    @change="calculatorOrder(true)"
                    type="tel"
                  />
                </td>
                <td class="text-end p-1">
                  <cleave
                    class="w-16 text-end border-b border-black outline-none bg-transparent"
                    :class="{
                      'text-slate-500':
                        !product.product_name || Number(product.price) === 0,
                    }"
                    :options="cleave_options"
                    v-model="product.price"
                    @change="calculatorOrder(true)"
                    type="tel"
                    :readonly="
                      !isAvailablelUpdate('product') || !product.product_name
                    "
                  />
                </td>
                <td class="text-end p-1 rounded-e">
                  <div class="flex items-center justify-between gap-2 w-20">
                    <p class="w-full">
                      {{ currency(product.total_price) || 0 }}
                    </p>
                    <img
                      @click="removeProduct(index)"
                      v-if="isAvailablelUpdate('product')"
                      class="hidden group-hover:block"
                      :src="CancelIcon"
                      v-tooltip="'Xóa'"
                    />
                  </div>
                </td>
              </tr>
              <tr class="bg-slate-200 font-semibold sticky bottom-0">
                <td class="text-end rounded-s p-1">Tổng</td>
                <td class="text-end p-1">
                  {{ order_edit.quantity || 0 }}
                </td>
                <td class="text-end p-1">
                  {{ currency(order_edit.custom_fields?.products_price) || 0 }}
                </td>
                <td class="text-end rounded-e p-1">
                  {{ currency(order_edit.total_price) || 0 }}
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
        <div class="flex justify-between items-center">
          <p>- Miễn phí giao hàng</p>
          <Toggle
            v-model="order_edit.is_freeship"
            :title="''"
          />
        </div>
        <div class="grid grid-cols-2 items-center">
          <p>- Tổng giá trị đơn hàng</p>
          <p class="font-bold text-base text-end text-green-600">
            {{ currency(order_edit.total_money) || 0 }}
          </p>
        </div>
        <div class="flex justify-between items-center">
          <p>- Phí vận chuyển</p>
          <cleave
            class="w-32 outline-none border-b border-black text-end font-medium text-base"
            :options="cleave_options"
            v-model="order_edit.shipping_fee"
            @change="calculatorOrder(true)"
            @input="
              () => {
                if (order_edit.shipping_fee && order_edit.is_freeship)
                  order_edit.is_freeship = false
              }
            "
            :readonly="!isAvailablelUpdate('money')"
          />
        </div>
        <div class="flex justify-between items-center">
          <p>- Giá giảm</p>
          <cleave
            class="w-32 outline-none border-b border-black text-end font-medium text-base"
            :options="cleave_options"
            v-model="order_edit.discount"
            @change="
              () => {
                order_edit.total_price =
                  Number(order_edit.price || 0) -
                  Number(order_edit.discount || 0)
                order_edit.total_money =
                  Number(order_edit.total_price || 0) +
                  Number(order_edit.shipping_fee || 0)
                order_edit.money_unpaid =
                  Number(order_edit.total_money || 0) -
                  Number(order_edit.money_paid || 0)
                updateAnOrder()
              }
            "
            :readonly="!isAvailablelUpdate('money')"
          />
        </div>

        <!-- <div class="grid grid-cols-2 items-center">
          <p>- Hình thức thanh toán</p>
          <div class="flex justify-end relative">
            <Dropbox place="bottom">
              <template #trigger>
                <button
                  class="flex items-center gap-1 text-end absolute right-0 -top-2.5"
                  @click="show_dropbox = true"
                >
                  <span>{{ payment_methods[payment_method] }}</span>
                  <span>Tiền mặt</span>
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
        </div> -->

        <!-- <div
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
        </div> -->
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
            {{ currency(order_edit.money_unpaid) || 0 }}
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
            v-for="(staff, index) in order_edit.staffs"
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
                          employee?.first_name || '',
                          employee?.last_name || ''
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
                            employee?.first_name || '',
                            employee?.last_name || ''
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
            v-model="order_edit.note"
            :readonly="!isAvailablelUpdate('')"
          />
          <input
            type="text"
            class="w-full flex items-center justify-between py-2.5 px-3 outline-none border rounded-md placeholder:text-slate-500 text-sm"
            placeholder="Ghi chú nội bộ"
            v-model="order_edit.internal_note"
            :readonly="!isAvailablelUpdate('')"
          />
          <!-- <p class="max-h-20 overflow-auto">{{ urlParams }}</p> -->
        </div>
      </div>
    </section>
    <div
      v-if="
        !order_edit.id && order_edit.order_journey && isAvailablelUpdate('')
      "
      class="py-2 border-t sticky bottom-0 bg-white"
    >
      <div
        v-for="(step, step_index) in order_edit.order_journey"
        v-show="checkStepActive() === step_index"
        class="flex gap-2 flex-row-reverse"
      >
        <div
          v-for="(status, status_index) in step"
          class="w-full rounded-md flex items-center justify-center py-2 cursor-pointer font-medium"
          :class="{
            [`${status.bg_color} ${status.text_color}`]: isNumber(status_index),
            'bg-slate-500 text-white cursor-not-allowed': !check_order_valid,
          }"
          @click="activeStep(step_index, status_index, status.action)"
        >
          {{ status.title }}
        </div>
      </div>
    </div>
    <div
      v-if="order_edit.id"
      class="p-2 border-t sticky bottom-0 bg-white"
    >
      <button
        class="w-full py-2 text-base font-semibold text-white bg-black rounded-md"
        @click="updateAnOrder()"
      >
        LƯU
      </button>
    </div>
  </article>
</template>
<script setup lang="ts">
import { Toast } from '@/service/helper/toast'
import { nonAccentVn } from '@/service/helper/format'
import { useAppStore, useMerchantStore } from '@/stores'
import { confirm2 as confirm } from '@/service/helper/alert'
import { cleave_options, payment_methods } from '@/service/options'
import { currency, convertEmployeeName, copy } from '@/service/helper/format'
import {
  createOrder,
  updateOrder,
  getProduct,
  createProduct,
  getSelectedAddress,
} from '@/service/api/merchant'

import WIDGET from 'bbh-chatbox-widget-js-sdk'
import { ref, onMounted, computed, watch } from 'vue'
import { get, isNumber, pick, debounce, isEmpty } from 'lodash'

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
  Order,
  Product,
  WardData,
  Addresses,
  ProvinceData,
  DistrictData,
  EmployeeData,
  PaymentMethods,
  ISelectedAddress,
} from '@/service/interface'
import { checkPhone } from '@/service/helper/validate'
import { INIT_ORDER, PRODUCT_DEFAULT, PROVINCE } from '@/service/constant'
import Toggle from '@/components/Toggle.vue'
import CheckCircle from '@/components/icons/CheckCircle.vue'
import { storeToRefs } from 'pinia'
import { useLocation } from '@/composable/location'

/** store merchant */
const $merchant = useMerchantStore()
const $appStore = useAppStore()

const { order_edit } = storeToRefs($merchant)

/** Toast */
const $toast = new Toast()

const {
  search_provice,
  search_district,
  search_ward,
  location_index,
  province_index,
  district_index,
  ward_index,
  provinces,
  snap_provinces,
  districts,
  snap_districts,
  wards,
  snap_wards,
  addresses,
  chooseAddress,
  chooseProvince,
  chooseDistrict,
  chooseWard,
  getProvinceName,
  getDistrictName,
  getWardName,
  searchAddressHook,
  searchLocation
} = useLocation(order_edit)

const selected_address = ref<ISelectedAddress[]>([])

/** hiển thị địa chỉ gần nhất */
const lastest_address_show = computed(() => {
  if ($appStore.is_auto_create || !$merchant.orders?.length) return ''
  let arr = []
  const LOCATION = $merchant.orders?.[0]?.locations
  if ($merchant.orders?.[0]?.address) arr.push($merchant.orders?.[0]?.address)

  if (LOCATION?.ward?.name) arr.push(LOCATION?.ward?.name)

  if (LOCATION?.district?.name) arr.push(LOCATION?.district?.name_with_type)

  if (LOCATION?.province?.name) arr.push(LOCATION?.province?.name_with_type)

  return arr.join(', ')
})

/** cảnh báo */
const alert_validate = ref<boolean>(false)

/** tên của người nhận */
const customer_name = ref(getContactName())

/** số điện thoại người nhận */
const customer_phone = ref(getContactPhone())

/** Tìm kiếm sản phẩm */
const start_search = debounce(() => {
  show_dropbox.value = true
  loadProduct()
}, 500)

/** Tìm kiếm địa chỉ */
const search_address = debounce(() => {
  searchAddress()
}, 500)

/** danh sách sản phẩm */
const products = ref<Product[]>([])

/** Tìm kiếm sản phẩm */
const search_product = ref<string>('')

/** mở/đóng modal */
const show_dropbox = ref<boolean>(false)

/** phương thức thanh toán */
const payment_method = ref<PaymentMethods>('CASH')

/** Index của sản phẩm */
const product_index = ref<number>(0)

// const full_address = ref<string>('')

/** đang gọi api */
const is_calling_api = ref<boolean>(false)

/** kiểm tra đơn hàng đã điền đủ thông tin chưa */
const check_order_valid = computed(() => {
  if (!order_edit.value.products?.length) {
    return false
  }
  if (customer_name.value === '') {
    return false
  }
  // if (customer_phone.value === '') {
  //   return false
  // }
  // if (check_address.value) {
  //   return false
  // }

  return true
})

/** kiểm tra địa chỉ đã điền chưa */
const check_address = computed(() => {
  return false
  const is_address_valid = !order_edit.value.address

  const is_province_valid = !order_edit.value.locations?.province?.name

  const is_district_valid =
    !order_edit.value.locations?.district?.name_with_type

  const is_ward_valid = !order_edit.value.locations?.ward?.name_with_type

  return (
    is_address_valid || is_province_valid || is_district_valid || is_ward_valid
  )
})

const is_phone_valid = computed(() => {
  return (
    (!customer_phone.value.includes('*') &&
      !checkPhone(customer_phone.value)) ||
    customer_phone.value.length < 10
  )
})

onMounted(() => {
  if (order_edit.value?.id) {
    order_edit.value = $merchant.order_edit
    if (order_edit.value.locations) {
      search_provice.value = order_edit.value.locations.province?.name || ''
      search_district.value =
        order_edit.value.locations.district?.name_with_type || ''
      search_ward.value = order_edit.value.locations.ward?.name_with_type || ''
      customer_name.value = order_edit.value.custom_fields?.customer_name || ''
      customer_phone.value = order_edit.value.custom_fields?.last_phone || ''
    }
    calculatorOrder()
  } else {
    order_edit.value.order_journey = copy(
      $merchant.setting?.online_status || []
    )
    order_edit.value.staffs = $merchant.setting?.online_staff
    order_edit.value.contact_id = $merchant.contact?.identifier_id
    order_edit.value.contact_info = $merchant.contact
    order_edit.value.address = copy($merchant.orders?.[0]?.address || '')
    order_edit.value.locations = copy($merchant.orders?.[0]?.locations || {})
  }

  //khởi tạo giá trị của các field khi tạo đơn tự động
  initDataParams()
  getSelectedAddresses()
})

watch(
  () => search_product.value,
  () => {
    if (is_calling_api.value) return
    is_calling_api.value = true
  }
)

watch(
  () => order_edit.value.is_freeship,
  (newValue, oldValue) => {
    if (newValue) order_edit.value.shipping_fee = 0
    calculatorOrder()
  },
  { deep: true }
)

/** hàm lấy danh sách địa chỉ đã chọn */
async function getSelectedAddresses() {
  try {
    console.log($merchant.contact?.identifier_id)

    if (!$merchant.contact?.identifier_id) return

    selected_address.value = await getSelectedAddress({
      body: {
        contact_id: $merchant.contact?.identifier_id,
      }
    })
  } catch (error) {
    $toast.error(error as string)
  }
}

/** hàm khởi tạo giá trị của các field khi tạo tự động */
async function initDataParams() {
  if (order_edit.value?.id) return
  customer_name.value = $appStore.data_client.public_profile?.client_name || ''
  customer_phone.value =
    $appStore.data_client?.conversation_contact?.client_phone || ''

  // nếu không phải chế độ tạo tự động thì thôi
  if (!$appStore.is_auto_create) return

  const AI_DATA = $appStore.data_client?.public_profile?.ai?.[0]

  // lấy giá trị từ url param
  const email = AI_DATA?.email?.[0]
  const phone = AI_DATA?.phone_number?.[0]

  if (phone) customer_phone.value = phone

  const address = AI_DATA?.ctas?.place_order?.address || ''
  /** thành phố */
  const city = AI_DATA?.ctas?.place_order?.city || ''
  /** phường */
  const ward_name = AI_DATA?.ctas?.place_order?.ward || ''
  /** quận */
  const district_name = AI_DATA?.ctas?.place_order?.district || ''
  /** phố */
  const street_name = AI_DATA?.ctas?.place_order?.street_name || ''
  /** số nhà */
  const house_number = AI_DATA?.ctas?.place_order?.house_number || ''

  const place = AI_DATA?.ctas?.place_order?.place || ''

  /** tên tỉnh lấy từ chat */
  let city_name = $appStore.data_client?.public_profile?.location?.city

  //nếu AI không quét ra thành phố thì lấy thành phố của chatbox
  if (!city && city_name) {
    PROVINCE.forEach(item => {
      /** tên tỉnh không dấu */
      const nonAccentVnProvince = nonAccentVn(item.name || '')
      /** tên tỉnh không dấu và không khoảng trắng */
      const province = nonAccentVnProvince?.replace(/\s+/g, '')

      /** kiểm tra xem tỉnh nào trùng với tên tỉnh từ chat trả về */
      if (province.includes(city_name?.toLocaleLowerCase() || '')) {
        /** gán tên có dấu lại vào tên tỉnh */
        city_name = item.name
      }
    })
  }

  // nếu có địa chỉ thì tự động điền
  // if (address) {
  // gán địa chỉ chọn địa chỉ
  const array = []

  const house_street = `${house_number} ${street_name}`.trim()

  /** có số nhà và đường và ít nhất 1 trong 3 field tỉnh, quận, phường */
  if (house_street && (ward_name || district_name || city)) {
    array.push(house_street)
    if (ward_name) array.push(ward_name)
    if (district_name) array.push(district_name)
    if (city) array.push(city)
  }

  /** có place và it nhất 1 trong 3 field tỉnh, quận, phường */
  if (!array.length && place && (ward_name || district_name || city)) {
    array.push(place)
    if (ward_name) array.push(ward_name)
    if (district_name) array.push(district_name)
    if (city) array.push(city)
  }

  /** chỉ có đường hoặc place */
  if (!array.length && (house_street || place || address)) {
    array.push(address)
  }

  if (array.length) {
    // full_address.value = array.join(', ')
    order_edit.value.address = array.join(', ')
  }

  // if (!full_address.value) return
  if (!order_edit.value.address) return

  // tìm kiếm địa chỉ
  await searchAddress(true)
  
  if (addresses.value?.[0]?.engine === 'FILTER' && order_edit.value.locations) {
    if (addresses.value?.[0]?.address) {
      order_edit.value.address = addresses.value?.[0]?.address
    }
    if (addresses.value?.[0]?.province) {
      order_edit.value.locations.province = addresses.value?.[0]?.province
    }
    if (addresses.value?.[0]?.district) {
      order_edit.value.locations.district = addresses.value?.[0]?.district
    }
    if (addresses.value?.[0]?.ward) {
      order_edit.value.locations.ward = addresses.value?.[0]?.ward
    }

    // tắt tự động tạo từ lần thứ 2 trở đi
    $appStore.is_auto_create = false

    return
  }

  // chọn địa chỉ
  if ((ward_name || district_name) && house_street) {
    getDetailLocation(addresses.value[0])
  } else {
    focusInput('address-input')
  }
  // order.value.address = address
  // }

  // tắt tự động tạo từ lần thứ 2 trở đi
  $appStore.is_auto_create = false
}

/** Cập nhật số điện thoại */
async function updatePhoneNumber() {
  try {
    if (!customer_phone.value) return

    if (
      !customer_phone.value.includes('*') &&
      !checkPhone(customer_phone.value)
    ) {
      customer_phone.value = ''
      $toast.error('Số điện thoại không hợp lệ')
      return
    }

    updateAnOrder()
  } catch (e) {
    console.log(e)
  }
}

/** mở tìm kiếm sản phẩm */
function openSearchProduct() {
  show_dropbox.value = true
  loadProduct()
}

/** Cập nhật sdt */
function setContactPhone(value: string) {
  customer_phone.value = value
  show_dropbox.value = false
  updateAnOrder()
}

/** chọn phương thức thanh toán */
function selectPayment(value: PaymentMethods) {
  show_dropbox.value = false
  payment_method.value = value
}

/** Lấy ra tên khách hàng */
function getContactName() {
  return `${$appStore.data_client.public_profile?.client_name || ''}`
}

/** Lấy ra sdt của contact */
function getContactPhone() {
  if ($appStore.data_client.conversation_contact?.client_phone)
    return $appStore.data_client.conversation_contact?.client_phone

  if (!$merchant.contact?.suggest_phone) return ''
  return $merchant.contact?.suggest_phone?.split(',').reverse()[0] || ''
}

/** Chọn tỉnh thành */
async function selectProvince(item: ProvinceData) {
  show_dropbox.value = false
  chooseProvince(item)
  focusInput('district-input')
}

/** Chọn quận huyện */
async function selectDistrict(item: DistrictData) {
  show_dropbox.value = false
  chooseDistrict(item)
  focusInput('ward-input')
}

/** Chọn phường xã */
function selectWard(item: WardData) {
  show_dropbox.value = false
  chooseWard(item)
  product_index.value = 0
  focusInput('product-input')
}

/** Lấy thông tin sản phẩm */
async function loadProduct() {
  try {
    products.value = await getProduct({
      body: {
        search: search_product.value,
      }
    })
    is_calling_api.value = false
  } catch (e) {
    is_calling_api.value = false
    $toast.error(e as string)
  }
}

function addProduct() {
  if (!order_edit.value.products) return
  order_edit.value.products = [
    ...order_edit.value.products,
    JSON.parse(JSON.stringify(PRODUCT_DEFAULT)),
  ]
}

/** Chọn sản phẩm thêm vào đơn hàng */
function selectProduct(item: Product, still_show_box?: boolean) {
  // if (!isAvailablelUpdate("product")) return (show_dropbox.value = false);

  /** Cập nhật số lượng sản phẩm */
  if (order_edit.value.products?.some(i => i.product_id === item.product_id)) {
    order_edit.value.products = order_edit.value.products.map(product => {
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
    order_edit.value.products?.push({
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
      length: item.length || 0,
      width: item.width || 0,
      height: item.height || 0,
      inventory_quantity: item.inventory_quantity || 0,
    })
  }

  /** Tắt modal */
  if (!still_show_box) show_dropbox.value = false

  /** Xóa text tìm kiếm sản phẩm */
  search_product.value = ''

  /** Tính giá trị đơn hàng */
  loadProduct()

  /** Reset index sản phẩm */
  product_index.value = 0

  /** Tính giá trị đơn hàng */
  calculatorOrder()
}

/** Loại bỏ sản phẩm khỏi order */
function removeProduct(index: number) {
  order_edit.value.products = order_edit.value.products?.filter((item, i) => {
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
  const products = order_edit.value.products || []

  /** Tính toán số lượng và giá từng loại sản phẩm */
  order_edit.value.products = products.map(item => {
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

  order_edit.value.quantity = quantity
  order_edit.value.price = price
  order_edit.value.vat = vat
  order_edit.value.discount = discount
  order_edit.value.total_price = price + vat - discount
  order_edit.value.inventory_quantity = inventory_quantity
  if (order_edit.value.custom_fields) {
    order_edit.value.custom_fields['products_price'] = product_price
  }

  let total_other_costs = 0

  // * Tính tổng chi phí khác
  order_edit.value.other_costs?.map(item => {
    total_other_costs += Number(item.value)
  })

  order_edit.value.total_other_costs = total_other_costs

  // * Tính tổng tiền khách cần trả
  order_edit.value.total_money =
    Number(order_edit.value.total_price) +
    Number(order_edit.value.total_other_costs) +
    Number(order_edit.value.shipping_fee || 0)

  // * Tính số tiền còn phải trả
  order_edit.value.money_unpaid =
    Math.round(Number(order_edit.value.total_money)) -
    Number(order_edit.value.money_paid)

  if (is_update_order) updateAnOrder()
}

/** Tạo đơn hàng */
async function createNewOrder(status?: string) {
  try {
    removeFullAddress()

    if (!checkOrderValid()) return
    if (!order_edit.value.contact_id) {
      return $toast.error('Vui lòng chọn khách hàng trước khi tạo đơn hàng')
    }
    // * Check địa chỉ
    // if (!order.value.address) {
    //   return $toast.error('Vui lòng nhập chỉ trước khi tạo đơn hàng')
    // }
    // * Check tỉnh thành
    // if (!order.value?.locations?.province?.code) {
    //   return $toast.error('Vui lòng chọn tỉnh thành trước khi tạo đơn hàng')
    // }
    // * Check quận huyện
    // if (!order.value?.locations?.district?.code) {
    //   return $toast.error('Vui lòng chọn quận huyện trước khi tạo đơn hàng')
    // }
    // * Check phường xã
    // if (!order.value?.locations?.ward?.code) {
    //   return $toast.error('Vui lòng chọn phường xã trước khi tạo đơn hàng')
    // }

    await createNewProduct()

    let new_order = await createOrder({
      body:{
        ...formatOrderData(order_edit.value),
        status: status ? status : 'DRART_ORDER',
        chatbox_widget_token: WIDGET?.access_token,
        assigned_employee: $appStore.data_client?.conversation_staff?.user_id,
      }
    })
    order_edit.value = new_order
    /** Lưu lại đơn mới vào store */
    $merchant.saveOrders([new_order, ...$merchant.orders])
    $toast.success('Tạo đơn hàng thành công')
  } catch (e) {
    console.log(e)
    $toast.error(e as string)
  }
}

/** tạo các sản phẩm mới */
async function createNewProduct() {
  try {
    if (!order_edit.value.products) return
    for (let index = 0; index < order_edit.value.products.length; index++) {
      const element = order_edit.value.products[index]
      if (element.product_id) continue
      const res = await createProduct({
        body: {
          ...element,
          name: element.product_name,
          price: Number(element.price),
        }
      })
      order_edit.value.products[index] = {
        ...element,
        product_id: res?.product_id,
        inventory_quantity: res?.inventory_quantity || 0,
        revenue_allocation: res?.custom_fields?.revenue_allocation || false,
        service_fee: res.service_fee || 0,
      }
    }
  } catch (e) {
    // $toast.error(e as string)
    throw e
  }
}

/** Cập nhật order */
async function updateAnOrder(status?: string) {
  removeFullAddress()

  // * Nếu order chưa có id thì dừng lại
  if (!order_edit.value.id) return

  // * Nếu có trạng thái truyền vào thì cho thay đổi status order
  if (status) order_edit.value.status = status

  try {
    if (!checkOrderValid()) return
    await updateOrder({
      body: formatOrderData(order_edit.value)
    })
  } catch (e) {
    $toast.error(e as string)
  }
}

/** Check xem đối tượng có được quyền update hay không */
function isAvailablelUpdate(
  type: 'product' | 'customer' | 'money' | 'address' | ''
) {
  if (order_edit.value.is_archived) return false

  // * Nếu là đơn hàng đang tạo thì không cần check
  if (!order_edit.value.order_id) return true

  // * Các trường hợp được update sản phẩm
  switch (order_edit.value.status) {
    case 'DRART_ORDER':
      if (type === 'product') return true
      if (type === 'customer') return true
      if (type === 'money') return true
      if (type === 'address') return true
      if (type === '') return true
      break
    case 'WAITING_ITEM':
      if (type === 'product') return true
      if (type === 'customer') return true
      if (type === 'money') return true
      if (type === 'address') return true
      if (type === '') return true
      break
    case 'PACKING_ORDER':
      if (type === 'product') return false
      if (type === 'customer') return true
      if (type === 'money') return true
      if (type === 'address') return true
      if (type === '') return true
      break
    case 'CONFIRM_ORDER':
      if (type === 'product') return false
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
    case 'DELIVERY_ORDER':
      if (type === 'product') return false
      if (type === 'customer') return false
      if (type === 'money') return false
      if (type === 'address') return false
      if (type === '') return true
      break
    case 'SHIPPING_ORDER':
      if (type === 'product') return false
      if (type === 'customer') return false
      if (type === 'money') return false
      if (type === 'address') return false
      if (type === '') return true
      break
    case 'PAID_ORDER':
      if (type === 'product') return false
      if (type === 'customer') return false
      if (type === 'money') return false
      if (type === 'address') return false
      if (type === '') return true
      break
    case 'RETURN_ORDER':
      return false

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
  return staff?.first_name || '' + ' ' + staff?.last_name || ''
}

/** Bỏ chọn nhân viên */
function unSelectEmployee(index: number) {
  let staffs = order_edit.value.staffs || []
  if (staffs[index]) {
    staffs[index] = {
      ...staffs[index],
      business_id: '',
      branch_id: '',
      team_id: '',
      employee_id: '',
      user_id: '',
    }
    order_edit.value.staffs = staffs
  }
  show_dropbox.value = false
}

/** Chọn nhân viên */
function selectEmployee(employee: EmployeeData, index: number) {
  let staffs = order_edit.value.staffs || []
  if (staffs[index]) {
    staffs[index] = {
      ...staffs[index],
      ...pick(employee, ['branch_id', 'business_id', 'team_id', 'user_id']),
      employee_id: employee?._id || '',
    }
    order_edit.value.staffs = staffs
  }
  show_dropbox.value = false
}

/** Kiểm tra đơn hàng có hợp lệ hay không? */
function checkOrderValid() {
  alert_validate.value = true
  // * Kiểm tra sản phẩm
  if (!order_edit.value.products?.length) {
    $toast.error('Vui lòng chọn sản phẩm trước khi tạo đơn hàng')
    scrollToElement('product-input')
    return false
  }
  if (customer_name.value === '') {
    $toast.error('Vui lòng nhập tên khách hàng trước khi tạo đơn hàng')
    scrollToElement('customer-name-input')
    return false
  }

  // if (customer_phone.value === '') {
  //   $toast.error('Vui lòng nhập số điện thoại trước khi tạo đơn hàng')
  //   scrollToElement('phone-input')
  //   return false
  // }

  // if (is_phone_valid.value) {
  //   $toast.error('Số điện thoại không hợp lệ')
  //   scrollToElement('phone-input')
  //   return false
  // }

  // if (check_address.value) {
  //   $toast.error('Vui lòng nhập địa chỉ nhận hàng')
  //   scrollToElement('address-input')
  //   return false
  // }

  alert_validate.value = false
  return true
}

/** Format dữ liệu */
function formatOrderData(order: Order) {
  order.money_paid = Number(order.money_paid || 0)
  order.shipping_fee = Number(order.shipping_fee || 0)
  order.discount = Number(order.discount || 0)
  order.products = order.products?.map(product => {
    product.price = Number(product.price || 0)
    product.quantity = Number(product.quantity || 0)
    return product
  })
  return order
}

// * Check xem trạng thái đơn hàng nào đang được kích hoạt
function checkStepActive() {
  let result
  const order_journey = order_edit.value?.order_journey || []
  order_journey.map((step, index_step) => {
    step.map(status => {
      if (status.is_active) result = index_step
    })
  })
  if (!result && result !== 0) return 0

  console.log(result)

  return result
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
      order_edit.value.order_journey?.map((step, index_step) => {
        step.map((status, index_status) => {
          if (index_step === step_index && index_status === status_index) {
            status.is_active = true
          } else status.is_active = false
        })
      })
    }

    // if (
    //   (!customer_phone.value.includes('*') &&
    //     !checkPhone(customer_phone.value)) ||
    //   customer_phone.value.length < 10
    // ) {
    //   throw 'Số điện thoại không hợp lệ'
    // }

    order_edit.value.custom_fields = {
      ...order_edit.value.custom_fields,
      customer_name: customer_name.value,
      last_phone: customer_phone.value,
    }

    // * Không xử lý gì cả
    if (action === 'NONE') {
      activeStatus()
      updateAnOrder()
    }

    // * Tạo đơn nháp
    if (action === 'DRART_ORDER') {
      console.log(order_edit.value)
      if (
        order_edit.value.custom_fields?.sales_channel === 'online' &&
        !order_edit.value.contact_id
      ) {
        return $toast.error('Vui lòng chọn khách hàng trước khi tạo đơn hàng')
      }
      createNewOrder()

      activeStatus()
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
      order_edit.value.is_inventory_export = true
      activeStatus()
      updateAnOrder('INVENTORY_EXPORT')
    }

    // * Xác nhận nhập kho hàng
    if (action === 'INVENTORY_IMPORT') {
      // * Nếu token chưa được xuất kho thì thông báo lỗi
      if (!order_edit.value.is_inventory_export) {
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
async function searchAddress(is_auto_create: boolean = false) {
  // addresses.value = await detectAddress({
  //   address: order.value.address,
  // })

  if (is_auto_create) {
    const MESSAGE =
      /** dạng tin nhắn ảnh */
      $appStore.data_client?.public_profile?.ai?.[0]?.ocr?.original_text ||
      /** tin nhắn thường */
      $appStore.data_client?.public_profile?.message_text ||
      ''

    // order_edit.value.full_address = JSON.parse(
    //   JSON.stringify(MESSAGE || full_address.value || '')
    // )

    order_edit.value.full_address = copy(
      MESSAGE || order_edit.value.address || ''
    )
  } else {
    order_edit.value.full_address = JSON.parse(
      JSON.stringify(order_edit.value.address || '')
    )
  }
  // addresses.value = await detectAddressV2({
  //   address: full_address.value || order_edit.value.address,
  // })
  if(order_edit.value.address) await searchAddressHook(order_edit.value.address)

  // full_address.value = ''
  // order_edit.value.address = ''
}

/** Chọn địa chỉ */
async function getDetailLocation(address: Addresses) {
  try {
    focusInput('product-input')
    // * Tắt dropbox
    show_dropbox.value = false

    await chooseAddress(address)

    product_index.value = 0
  } catch (error) {
    console.log(error);
    
    $toast.error(error as string)
  }
}

/** Xóa location
 * @param type 'province': Xóa tỉnh,Thành phố
 * @param type 'district': Xóa quận huyện
 * @param type 'ward': Xóa phường xã
 * @param type 'all': Xóa toàn bộ
 * @param focus: Focus vào input
 */
function removeLocation(
  type: 'province' | 'district' | 'ward' | 'all',
  focus: boolean = true
) {
  if (order_edit.value.locations?.province && type === 'province') {
    order_edit.value.locations.province = {}
    order_edit.value.locations.district = {}
    order_edit.value.locations.ward = {}
    search_district.value = ''
    search_ward.value = ''
    if (focus) focusInput('province-input')
  }
  if (order_edit.value.locations?.district && type === 'district') {
    order_edit.value.locations.district = {}
    order_edit.value.locations.ward = {}
    search_ward.value = ''
    if (focus) focusInput('district-input')
  }
  if (order_edit.value.locations?.ward && type === 'ward') {
    order_edit.value.locations.ward = {}
    if (focus) focusInput('ward-input')
  }
  if (type === 'all') {
    order_edit.value.address = ''
    order_edit.value.locations = {
      province: {},
      district: {},
      ward: {},
    }
    if (focus) focusInput('address-input')
    search_provice.value = ''
    search_district.value = ''
    search_ward.value = ''
  }
  resetHidden()
}

/** Focus vào input */
function focusInput(id: string) {
  let input = document.getElementById(id) as HTMLInputElement
  setTimeout(() => {
    if (input) input.click()
    if (input) input.focus()
  }, 100)
}

/** Loại bỏ trạng thái ẩn hiện */
function resetHidden() {
  provinces.value = snap_provinces.value
  districts.value = snap_districts.value
  wards.value = snap_wards.value
}

/** Lấy địa chỉ theo index control */
function selectLocation(type: 'province' | 'district' | 'ward' | 'address') {
  if (addresses.value[location_index.value] && type === 'address') {
    getDetailLocation(addresses.value[location_index.value])
  }
  if (provinces.value[province_index.value] && type === 'province') {
    selectProvince(provinces.value[province_index.value])
  }
  if (districts.value[district_index.value] && type === 'district') {
    selectDistrict(districts.value[district_index.value])
  }
  if (wards.value[ward_index.value] && type === 'ward') {
    selectWard(wards.value[ward_index.value])
  }
}

/** Chọn option địa chỉ */
function controlLocation(
  type: 'province' | 'district' | 'ward' | 'address',
  action: 'up' | 'down'
) {
  switch (type) {
    case 'address':
      if (action === 'down') {
        if (location_index.value === addresses.value.length - 1) {
          location_index.value = 0
        } else location_index.value++
      }
      if (action === 'up') {
        if (location_index.value === 0) {
          location_index.value = addresses.value.length - 1
        } else location_index.value--
      }
      break
    case 'province':
      if (action === 'down') {
        if (province_index.value === provinces.value.length - 1) {
          province_index.value = 0
        } else province_index.value++
      }
      if (action === 'up') {
        if (province_index.value === 0) {
          province_index.value = provinces.value.length - 1
        } else province_index.value--
      }
      scrollToElement('province-' + province_index.value)
      break
    case 'district':
      if (action === 'down') {
        if (district_index.value === districts.value.length - 1) {
          district_index.value = 0
        } else district_index.value++
      }
      if (action === 'up') {
        if (district_index.value === 0) {
          district_index.value = districts.value.length - 1
        } else district_index.value--
      }
      scrollToElement('district-' + district_index.value)
      break
    case 'ward':
      if (action === 'down') {
        if (ward_index.value === wards.value.length - 1) {
          ward_index.value = 0
        } else ward_index.value++
      }
      if (action === 'up') {
        if (ward_index.value === 0) {
          ward_index.value = wards.value.length - 1
        } else ward_index.value--
      }
      scrollToElement('ward-' + ward_index.value)
      break
  }
}

/** Lấy ra index đầu tiên không bị ẩn */
function selectProductByIndex() {
  if (products.value[product_index.value]) {
    selectProduct(products.value[product_index.value], false)
  }
}

/** Chọn option sản phẩm */
function controlProduct(action: 'up' | 'down') {
  switch (action) {
    case 'up':
      if (product_index.value === 0) {
        product_index.value = products.value.length - 1
      } else product_index.value--
      break
    case 'down':
      if (product_index.value === products.value.length - 1) {
        product_index.value = 0
      } else product_index.value++
      break
  }
  scrollToElement('product-' + product_index.value)
}

/** Cuộn tới đối tượng */
function scrollToElement(element_id: string) {
  const element = document.getElementById(element_id)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    })
  }
}

function tabEvent(type: 'province' | 'district' | 'ward' | 'address') {
  switch (type) {
    case 'address':
      focusInput('province-input')
      break
    case 'province':
      focusInput('district-input')
      break
    case 'district':
      focusInput('ward-input')
      break
    case 'ward':
      focusInput('product-input')
      break
  }
}

/** Mở trang sản phẩm */
function linkToProductApp() {
  show_dropbox.value = false
  search_product.value = ''
  window.open(
    `https://merchant.vn/login?chat_access_token=${WIDGET.access_token}&redirect=https://merchant.vn/a/product`,
    '_blank'
  )
}

/** nếu không có location thì xóa full_address */
function removeFullAddress() {
  if (
    isEmpty(order_edit.value.locations?.province) &&
    isEmpty(order_edit.value.locations?.district) &&
    isEmpty(order_edit.value.locations?.ward)
  ) {
    order_edit.value.full_address = ''
  }
}

defineExpose({ initDataParams, getSelectedAddresses, removeLocation })
</script>
