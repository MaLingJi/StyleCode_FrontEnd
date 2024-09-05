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

const userStore = useUserStore();
axiosapi.defaults.headers.authorization = `Bearer ${userStore.userToken}`;
</script>
<style scoped></style>
