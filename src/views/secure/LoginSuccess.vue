<template>
  <div class="ts-container ts-wrap is-middle-aligned" style="height: 70vh">
    <div class="ts-content is-very-padded is-tertiary is-middle-aligned" style="width: 100%">
      <div class="ts-header is-huge is-heavy is-center-aligned">
        登入成功！！
      </div>
      <div class="ts-text is-secondary is-center-aligned">
        歡迎來到 Modern Fashion King 網站！3秒後跳轉回首頁
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import axiosapi from "@/plugins/axios.js";
import { useRouter } from "vue-router";
import useUserStore from "@/stores/user.js";
import { useCart } from '@/services/cartService';

const { fetchCartCount } = useCart();
const router = useRouter();
const userStore = useUserStore();

onMounted(async () => {
  try {
    const response = await axiosapi.get("/user-info", {
      withCredentials: true, // 單獨設置 withCredentials 將coockie帶到後端
    });
    console.log(response.data);
    axiosapi.defaults.headers.authorization = `Bearer ${response.data.token}`;
    const expirationTime = new Date(new Date().getTime() + 100 * 60 * 1000); //100分鐘
    userStore.setExpirationTime(expirationTime.toISOString()); // 使用ISO字串格式保存
    userStore.setUserId(response.data.userId);
    userStore.setUserToken(response.data.token);
    userStore.setPermissions(response.data.permissions);
    userStore.setLogedin(true);
    userStore.setThirdPartyLogin(true);
    //購物車通知 使用者登出後再登入會再抓一次
    fetchCartCount(userStore.userId)
    //跳轉首頁
    setTimeout(() => {
      router.push({ path: "/" });
    }, 3000);
  } catch (error) {
    console.error("Failed to fetch user information:", error);
  }
});
</script>

<style></style>
