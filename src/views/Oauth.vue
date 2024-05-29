<template>
  <div class="h-full w-full flex justify-center items-center">
    <div class="flex flex-col gap-5 items-center">
      <p class="text-3xl">Để cài đặt Widget vui lòng nhấn kích hoạt</p>
      <button
        @click="onOauth()"
        class="bg-blue-400 active:bg-blue-600 py-2 px-10 text-white text-2xl w-fit"
      >
        Kích hoạt
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import WIDGET from "bbh-chatbox-widget-js-sdk";
import Swal from "sweetalert2";

/** hàm kích hoạt widget */
async function onOauth() {
  try {
    await WIDGET.oAuth();
    let result = await Swal.fire({
      title: "Oauth thành công",
      text: "Nhấn OK để tắt",
      icon: "success",
    });
    if (result.isConfirmed) {
      window.close();
    }
  } catch (error) {
    console.log("oauth widget", error);
  }
}
</script>
<style scoped lang="scss"></style>
