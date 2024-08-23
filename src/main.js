import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstste from "pinia-plugin-persistedstate"

import App from './App.vue'
import router from './router/router'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstste);
createApp(App)
    .use(pinia)
    .use(router)
    .mount('#app')
