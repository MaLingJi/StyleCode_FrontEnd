<template>
  <header>
    <div>
      <Navigationbar></Navigationbar>
    </div>
  </header>

  <RouterView></RouterView>

  <footer>
    <Footerpage></Footerpage>
  </footer>
</template>

<script setup>
// import { RouterLink, RouterView } from 'vue-router'
import Navigationbar from "./views/Navigationbar.vue";

// 解決重整headers的authorization消失問題
import useUserStore from "@/stores/user.js";
import axiosapi from "@/plugins/axios.js";
import Footerpage from "@/views/Footerpage.vue";

import { provideCart } from './services/cartService'
provideCart()



const userStore = useUserStore();


axiosapi.defaults.headers.authorization = `Bearer ${userStore.userToken}`;
</script>
<style>
/* 全局樣式 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  width: 100%;
  font-size: 16px;
  line-height: 1.5;
  font-family: Arial, sans-serif;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 20px;
}

/* 響應式斷點 */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }

  .main-content {
    padding: 10px;
  }
}

@media (max-width: 480px) {
  html {
    font-size: 12px;
  }
}

/* 可以根據需要添加更多的媒體查詢 */
</style>