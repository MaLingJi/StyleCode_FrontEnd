import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstste from "pinia-plugin-persistedstate"

import App from './App.vue'
import router from './router/router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.esm'
import '@fortawesome/fontawesome-free/css/all.css'
import { setupCalendar } from 'v-calendar';
import useUserStore from "@/stores/user.js";


const pinia = createPinia();
pinia.use(piniaPluginPersistedstste);
createApp(App)
    .use(pinia)
    .use(router)
    .use(Antd)
    .use(setupCalendar, {})
    .mount('#app')


//定時清除userStore的紀錄
const userStore = useUserStore();

const checkSession = () => {
  console.log("Checking session...");
  userStore.checkSession();
};

// 全局定时器
setInterval(checkSession, 5 * 60 * 1000);