import Home from "@/views/Home.vue";
import Oauth from "@/views/Oauth.vue";
export const routes = [
    { path: "/", redirect: "/home" },
    { path: "/home", component: Home },
    { path: "/oauth", component: Oauth },
];
