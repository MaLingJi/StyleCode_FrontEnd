import { createApp } from 'vue'
import { createPinia } from 'pinia'


import App from './App.vue'
import router from './router/router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.esm'
import '@fortawesome/fontawesome-free/css/all.css'
import 'bulma/css/bulma.css'

createApp(App)
    .use(router)
    .use(Antd)
    .mount('#app')
