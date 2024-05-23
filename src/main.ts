import { waterfall } from "async";
import { createApp } from "vue";
import App from "@/App.vue";
import {
    loadEnv,
    loadLib,
    loadApp,
    loadLanguage,
    loadRouter,
} from "@/service/core";
import "@/assets/css/tailwind.css";
import WIDGET from "bbh-chatbox-widget-js-sdk";
import type { CbError } from "@/service/interface";

// [optional] kích hoạt chế độ debug
WIDGET.debugOn();

// nạp secret_key của widget
WIDGET.load("8e2152bda80e40fa85ba4278f6a3353a");
const APP = createApp(App);

waterfall(
    [
        // (cb: CbError) => loadEnv(cb),
        // (cb: CbError) => loadLib(cb),
        (cb: CbError) => loadRouter(APP, cb),
        // (cb: CbError) => loadLanguage(APP, cb),
        (cb: CbError) => loadApp(APP, cb),
    ],
    () => APP.mount("#app")
);
