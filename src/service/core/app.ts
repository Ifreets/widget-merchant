import { createPinia } from "pinia";
import { i18n } from "@/lang";

import type { App } from "vue";
import type { Cb } from "@/service/interface";

export const loadApp = (APP: App, proceed: Cb) => {
    // init store
    APP.use(createPinia());

    proceed();
};
