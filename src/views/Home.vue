<template>
  <div class="w-full h-full flex justify-center items-center bg-slate-300">
    <div class="w-screen h-screen sm:w-[395px] sm:h-[300px] bg-white text-sm">
      <div
        v-if="tab == 'LIST' || tab == 'LOAD'"
        class="p-3 flex flex-col gap-2.5"
      >
        <div class="w-full flex gap-2.5">
          <img
            loading="lazy"
            :src="user_avatar"
            class="h-16 w-16 rounded-3xl"
          />
          <div class="w-full flex flex-col gap-1">
            <div
              class="h-fit w-full flex justify-between items-center border-b py-1"
            >
              <p class="text-base truncate w-64">
                <span class="font-medium">
                  {{ client_name }}
                </span>
                {{ client_email }}
              </p>
              <a
                :href="link_to_merchant"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img :src="InfoIcon" class="h-4 w-4" />
              </a>
            </div>
            <div class="font-medium">
              <p class="text-sky-600">Số điện thoại</p>
              <p class="truncate w-60">{{ customer_infor?.phone }}</p>
            </div>
          </div>
        </div>
        <div class="py-1 px-3 bg-slate-100 rounded-lg">
          <div
            class="flex py-2 text-center font-medium text-[#71717A] border-b"
          >
            <p
              class="w-1/2 rounded py-1 cursor-pointer"
              :class="tab === 'LIST' ? 'text-black bg-white shadow-md' : ''"
              @click="() => (tab = 'LIST')"
            >
              Nhân sự phụ trách
            </p>
            <p
              class="w-1/2 rounded py-1 cursor-pointer"
              :class="tab === 'LOAD' ? 'text-black bg-white shadow-md' : ''"
              @click="() => (tab = 'LOAD')"
            >
              Đơn hàng
            </p>
          </div>
          <ListEmployee
            v-if="tab === 'LIST'"
            v-model:tab="tab"
            :list_employee="list_employee"
          />
          <div v-if="tab === 'LOAD'">
            <p class="text-center py-1 font-medium">
              Tính năng đang được phát triển...
            </p>
          </div>
        </div>
        <div class="flex justify-end">
          <p
            class="bg-slate-200 text-slate-700 pb-0.5 px-2 rounded-md cursor-pointer"
            @click="() => (tab = 'FORM')"
          >
            Thiết lập
          </p>
        </div>
      </div>
      <!-- FORM -->
      <Form
        v-if="tab == 'FORM' || tab == 'FORM_NO_TOKEN'"
        v-model:tab="tab"
        v-model:id="id"
        v-model:token="token"
        :synchData="synchData"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
//* import function
import {request} from "@/service/helper/asyncRequest";
import {useCommonStore} from "@/stores";
//* import library
import {computed, onMounted, ref} from "vue";
import WIDGET from "bbh-chatbox-widget-js-sdk";

//* import component
import ListEmployee from "@/components/ListEmployee.vue";
import Form from "@/components/Form.vue";

//* import icon
import InfoIcon from "@/assets/icons/info-icon.svg";

//* import interface
import type {IConfigWidget} from "@/service/interface";
import {getAllEmployee} from "@/service/helper/getAllEmploy";

/** store */
const commonStore = useCommonStore();

/** tab hiện tại */
const tab = ref<"LIST" | "LOAD" | "FORM" | "FORM_NO_TOKEN" | "">("");
/** id của form */
const id = ref<string>("");
/** token của form */
const token = ref<string>("");
/** danh sách nhân viên */
const list_employee = ref<any>([]);
/** thông tin khách hàng */
const customer_infor = ref<{
  /** link ảnh đại diện */
  avatar?: string;
  /** email */
  email?: string;
  /** số điện thoại */
  phone?: string;
  /** id contact merchent */
  id_contact_merchant?: string;
}>();

onMounted(async () => {
  commonStore.is_loading_full_screen = true;
  // khai báo biến lưu trữ dữ liệu khách hàng + init dữ liệu lần đầu
  commonStore.data_client = await WIDGET.decodeClient();
  // [optional] lắng nghe khách hàng thay đổi ở chế độ post message
  //call API lấy token từ widget
  let res: IConfigWidget | null = await WIDGET.getConfig({
    brand_name: "widget-merchant",
    type_config: "CRM",
  });

  // nếu có sẽ vào dashboard và đồng bộ dữ liệu, nếu không sẽ vào form
  if (res?.token_business && res?.id_business) {
    /** đồng bộ dữ liệu */
    await synchData(res?.token_business);
    /** lấy tất cả thông tin nhân viên */
    await fetchAllEmployee(
      res.id_business,
      res.token_business,
      list_employee.value
    );
    id.value = res.id_business || "";
    token.value = res.token_business;
    tab.value = "LIST";
  } else {
    tab.value = "FORM_NO_TOKEN";
  }
  commonStore.is_loading_full_screen = false;
});

/** tên khách hàng */
const client_name = computed(
  () => commonStore.data_client?.public_profile?.client_name
);

/** email khách hàng */
const client_email = computed(() =>
  customer_infor?.value?.email ? "(" + customer_infor?.value?.email + ")" : ""
);

/** id khách hàng */
const id_client = computed(
  () => commonStore?.data_client?.public_profile?.fb_client_id || ""
);
/** đường dẫn đến contact merchant */
const link_to_merchant = computed(
  () =>
    "https://merchant.vn/a/contact?id=" +
    customer_infor?.value?.id_contact_merchant
);

/** avater của người dùng */
const user_avatar = computed(
  () =>
    "https://chatbox-static-v3.botbanhang.vn/app/facebook/avatar/" +
    commonStore?.data_client?.public_profile?.fb_client_id +
    "?page_id=" +
    commonStore?.data_client?.public_profile?.page_id +
    "&staff_id=" +
    commonStore?.data_client?.public_profile?.current_staff_id +
    "&width=64&height=64"
);

/** hàm call API đồng bộ dữ liệu sang merchant */
async function synchData(token_business: string) {
  try {
    if (!Object.keys(commonStore.data_client).length) return;
    let result = await request({
      uri: "https://api-contact.merchant.vn/contact/chatbox_sync_contact",
      method: "POST",
      body: commonStore.data_client,
      json: true,
      headers: {
        "token-business": token_business,
      },
    });
    console.log("synch to merchant", result);

    if (result.message || !result) return;
    list_employee.value = result.assigned_employees || [];
    console.log("list employee", list_employee.value);

    customer_infor.value = {
      avatar: result?.avatar,
      email: result?.suggest_email,
      phone: result?.suggest_phone,
      id_contact_merchant: result?.identifier_id,
    };
  } catch (error) {
    console.log("synch to merchant", error);
  }
}
/** hàm xử lý lấy tất cả nhân viên */
async function fetchAllEmployee(
  id: string,
  token: string,
  list_employee: string[]
) {
  /** lấy danh sách toàn bộ nhân viên */
  let result = await getAllEmployee(id, token, list_employee);
  if (!result) return;
  commonStore.listAllEmployee = result;
}

WIDGET.onEvent(async () => {
  commonStore.is_loading_full_screen = true;
  // ghi lại thông tin khách hàng mới
  commonStore.data_client = await WIDGET.decodeClient();
  // [optional] lắng nghe khách hàng thay đổi ở chế độ post message
  //call API lấy token từ widget
  let res: IConfigWidget | null = await WIDGET.getConfig({
    brand_name: "widget-merchant",
    type_config: "CRM",
  });
  // nếu có sẽ vào dashboard và đồng bộ dữ liệu, nếu không sẽ vào form
  if (!res?.token_business || !res?.id_business)
    return (tab.value = "FORM_NO_TOKEN");
  //đồng bộ dữ liệu
  await synchData(res?.token_business);
  //lấy danh sách tất cả nhân viên
  await fetchAllEmployee(
    res.id_business,
    res.token_business,
    list_employee.value
  );

  id.value = res.id_business || "";
  token.value = res.token_business;
  tab.value = "LIST";
  commonStore.is_loading_full_screen = false;
});
</script>
