<template>
    <div class="m-auto w-fit flex flex-col items-center justify-center">
        <h1>THÔNG TIN CỦA KHÁCH HÀNG</h1>
        <p>Tên người dùng : {{ commonStore?.data_client?.public_profile?.client_name }}</p>
        <p>Tên trang : {{ commonStore?.data_client?.public_profile?.page_name }}</p>
    </div>
</template>
<script setup lang="ts">
import { useCommonStore } from '@/stores';

const commonStore = useCommonStore()

</script>
<style scoped lang="scss"></style>