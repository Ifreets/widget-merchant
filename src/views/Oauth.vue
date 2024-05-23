<template>
    <div class="m-auto w-fit">
        <p>Trang Oauth</p>
        <button @click="() => onOauth()">Kích hoạt</button>
    </div>
</template>
<script setup lang="ts">
import WIDGET from 'bbh-chatbox-widget-js-sdk'
import Swal from 'sweetalert2';

async function onOauth() {
    try {
        const res = await WIDGET.oAuth()
        Swal.fire({
            title: "Oauth thành công",
            text: "Nhấn OK để tắt",
            icon: "success"
        }).then((result) => {
            if (result.isConfirmed) {
                window.close()
            }

        });
    } catch (error) {
        console.log(error)
        return false
    }
}

</script>
<style scoped lang="scss"></style>