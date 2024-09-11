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

import { onMounted, onUnmounted, watch } from "vue";
// 解決重整headers的authorization消失問題
import useUserStore from "@/stores/user.js";
import axiosapi from "@/plugins/axios.js";
import Footerpage from "@/views/Footerpage.vue";

const userStore = useUserStore();
let intervalId = null;
axiosapi.defaults.headers.authorization = `Bearer ${userStore.userToken}`;

onMounted(() => {
  if (userStore.isLogedin) {
    userStore.startSessionCheck();
  }
});
onUnmounted(() => {
  userStore.stopSessionCheck();
});

watch(
  () => userStore.isLogedin,
  (newValue) => {
    if (newValue) {
      userStore.startSessionCheck();
    } else {
      userStore.stopSessionCheck();
    }
  }
);
</script>
<style scoped></style>
