<template>
  <header class="fixed-top-nav">
    <div class="ts-content is-padded is-secondary">
      <div class="ts-container">
        <div class="ts-grid is-middle-aligned">
          <div class="column is-fluid">
            <div class="ts-wrap is-middle-aligned">
              <RouterLink to="/" class="ts-text is-undecorated"><img src="/beginner.png" width="45px"></RouterLink>
              <RouterLink to="/share" class="ts-text is-undecorated is-big">穿搭</RouterLink>
              <RouterLink to="/forum" class="ts-text is-undecorated is-big">論壇</RouterLink>
              <RouterLink to="/shop" class="ts-text is-undecorated is-big">商城</RouterLink>
              <RouterLink to="/backstage" class="ts-text is-undecorated is-big">後台</RouterLink>
            </div>
          </div>
          <div class="column">
            <div class="ts-wrap">
              <div class="ts-input is-start-icon">
                <span class="ts-icon is-search-icon"></span>
                <input 
                  type="text" 
                  v-model="searchQuery" 
                  @input="handleSearch" 
                  placeholder="搜索商品..."
                >
              </div>
            </div>
          </div>
          <div class="column">
            <div class="ts-wrap">
              <RouterLink to="/cart" class="ts-text is-undecorated">
                <span class="ts-icon is-spinning is-cart-shopping-icon is-big"></span>
              </RouterLink>
              <a class="ts-text is-undecorated" href="#!">
                <span class="ts-icon is-spinning is-bell-icon is-big"></span>
              </a>
              <a class="ts-text is-undecorated" data-dropdown="user-dropdown" href="#!" v-if="userStore.isLogedin">
                <span class="ts-icon is-spinning is-user-icon is-big"></span>
              </a>
              <div class="ts-dropdown" id="user-dropdown" v-if="userStore.isLogedin">
                <RouterLink to="/secure/profile" class="item">個人頁面</RouterLink>
                <RouterLink to="/backstage" class="item">後台</RouterLink>
                <button class="item" @click="logout">登出</button>
              </div>
              <RouterLink to="/secure/login" v-if="!userStore.isLogedin"
              ><span class="ts-icon is-user-icon is-big"></span
            ></RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
  <!-- 添加一個佔位 div，以防止內容被固定導航欄覆蓋 -->
  <div class="nav-placeholder"></div>
</template>

<script setup>
import { ref } from 'vue';
import axiosapi from "@/plugins/axios.js"
import useUserStore from "@/stores/user.js"
import { useProductStore } from '@/stores/product'; 
import { useRouter } from 'vue-router';

const router = useRouter();
const productStore = useProductStore();
const searchQuery = ref('');
const userStore = useUserStore();

const handleSearch = async () => {
  if (searchQuery.value.trim()) {
    try {
      const response = await axiosapi.get(`/products/search/${searchQuery.value}`);
      productStore.setSearchResults(response.data);
      router.push('/shop');
    } catch (error) {
      console.error('Error searching products:', error);
    }
  }
};

//Pinia 清空 
function logout() {
  axiosapi.defaults.headers.authorization = "";
  userStore.setUserId("");
  userStore.setUserToken("");
  userStore.setPermissions("");
  userStore.setLogedin(false);
}
</script>

<style scoped>
.fixed-top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #fff; /* 或者你想要的背景色 */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* 添加陰影效果 */
}

.nav-placeholder {
  height: 90px; /* 調整這個值以匹配你的導航欄高度 */
}

</style>