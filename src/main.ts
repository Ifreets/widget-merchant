import {waterfall} from "async";
import {createApp} from "vue";
import App from "@/App.vue";
import {loadEnv, loadApp, loadRouter} from "@/service/core";
import "@/assets/css/tailwind.css";
import WIDGET from "bbh-chatbox-widget-js-sdk";
import type {CbError} from "@/service/interface";
import "./assets/css/index.scss";

// [optional] kích hoạt chế độ debug
WIDGET.debugOn();

const APP = createApp(App);

waterfall(
  [
    (cb: CbError) => loadEnv(cb),
    (cb: CbError) => {
      // nạp secret_key của widget
      WIDGET.load($env.secret_key);
      cb();
    },
    (cb: CbError) => loadRouter(APP, cb),
    (cb: CbError) => loadApp(APP, cb),
  ],
  () => APP.mount("#app")
);
