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

const userStore = useUserStore();
axiosapi.defaults.headers.authorization = `Bearer ${userStore.userToken}`;
    import Footerpage from '@/views/Footerpage.vue'
</script>
<style scoped>

</style>
