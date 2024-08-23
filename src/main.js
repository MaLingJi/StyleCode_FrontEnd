import { createApp } from 'vue'
import { createPinia } from 'pinia'


import App from './App.vue'
import router from './router/router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.esm'
import '@fortawesome/fontawesome-free/css/all.css'
import 'bulma/css/bulma.css'
import naive from 'naive-ui'

createApp(App)
    .use(router)
    .use(Antd)
    .use(naive)
    .mount('#app')
