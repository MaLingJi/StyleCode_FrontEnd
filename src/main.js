import { createApp } from 'vue'
import { createPinia } from 'pinia'


import App from './App.vue'
import router from './router/router'
import naive from 'naive-ui'

createApp(App)
    .use(router)
    .use(naive)
    .mount('#app')
