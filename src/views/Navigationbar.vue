<template>
 <header class="fixed-top-nav">
    <div class="ts-content is-padded is-secondary">
      <div class="ts-container">
        <div class="ts-grid is-middle-aligned">
          <div class="column is-fluid">
            <div class="ts-wrap is-middle-aligned main-nav">
              <RouterLink to="/" class="ts-text is-undecorated logo-link">
                <img src="/MDFK-removebg-preview.png" width="45" alt="Logo">
              </RouterLink>
              <nav class="desktop-nav">
                <RouterLink to="/share" class="nav-link">穿搭</RouterLink>
                <RouterLink to="/forum" class="nav-link">論壇</RouterLink>
                <RouterLink to="/shop" class="nav-link">商城</RouterLink>
                <RouterLink v-if="userStore.isAdmin" to="/backstage" class="nav-link">後台</RouterLink>
              </nav>
              <button class="mobile-menu-toggle" @click="toggleMobileMenu">
                <span class="ts-icon is-bars-icon"></span>
              </button>
            </div>
          </div>
          <div class="column search-column">
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
          <div class="column user-actions">
            <div class="ts-wrap">
              <RouterLink to="/cart" class="ts-text is-undecorated action-icon">
                <span class="ts-icon is-spinning is-cart-shopping-icon is-big"></span>
              </RouterLink>
              <a class="ts-text is-undecorated action-icon" href="#!">
                <span class="ts-icon is-spinning is-bell-icon is-big"></span>
              </a>
              <a class="ts-text is-undecorated action-icon" data-dropdown="user-dropdown" href="#!" v-if="userStore.isLogedin">
                <span class="ts-icon is-spinning is-user-icon is-big"></span>
              </a>
              <div class="ts-dropdown" id="user-dropdown" v-if="userStore.isLogedin">
                <RouterLink to="/secure/profile" class="item">個人頁面</RouterLink>
                <RouterLink v-if="userStore.isAdmin" to="/backstage" class="item">後台</RouterLink>
                <button class="item" @click="logout">登出</button>
              </div>
              <RouterLink to="/secure/login" v-if="!userStore.isLogedin" class="action-icon">
                <span class="ts-icon is-user-icon is-big"></span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
  <div class="nav-placeholder"></div>
  <nav class="mobile-nav" :class="{ 'is-active': isMobileMenuOpen }">
    <RouterLink to="/share" class="nav-link">穿搭</RouterLink>
    <RouterLink to="/forum" class="nav-link">論壇</RouterLink>
    <RouterLink to="/shop" class="nav-link">商城</RouterLink>
    <RouterLink v-if="userStore.isAdmin" to="/backstage" class="nav-link">後台</RouterLink>
  </nav>
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
const isMobileMenuOpen = ref(false);

const handleSearch = async () => {
  if (searchQuery.value.trim()) {
    await productStore.searchProducts(searchQuery.value);
    router.push('/shop');
  }
};

function logout() {
  axiosapi.defaults.headers.authorization = "";
  userStore.setUserId("");
  userStore.setUserToken("");
  userStore.setPermissions("");
  userStore.setLogedin(false);
  router.push('/');
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
</script>

<style scoped>
.fixed-top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-placeholder {
  height: 90px;
}

.main-nav {
  display: flex;
  align-items: center;
}

.desktop-nav {
  display: flex;
  align-items: center;
}

.logo-link {
  margin-right: 30px; /* 增加logo和第一個導航項目之間的間距 */
}

.nav-link {
  padding: 10px 20px; /* 增加內邊距 */
  margin: 0 10px; /* 增加外邊距 */
  text-decoration: none;
  color: #333;
  font-size: 1.1em;
  transition: background-color 0.3s, color 0.3s;
}

.nav-link:hover {
  background-color: #f0f0f0;
  color: #000;
}

.action-icon {
  margin: 0 10px; /* 為用戶操作圖標添加間距 */
}

.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5em;
}

.mobile-nav {
  display: none;
  flex-direction: column;
  position: fixed;
  top: 90px;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 999;
}

.mobile-nav.is-active {
  display: flex;
}

.mobile-nav .nav-link {
  padding: 15px 10px;
  border-bottom: 1px solid #eee;
}

.mobile-nav .nav-link:last-child {
  border-bottom: none;
}

@media (max-width: 1024px) {
  .nav-link {
    padding: 10px 15px;
    margin: 0 5px;
  }
  
  .logo-link {
    margin-right: 20px;
  }
}

@media (max-width: 768px) {
  .desktop-nav, .search-column {
    display: none;
  }

  .mobile-menu-toggle {
    display: block;
  }

  .main-nav {
    justify-content: space-between;
  }
  
  .user-actions {
    margin-left: auto;
  }
}

@media (max-width: 480px) {
  .nav-placeholder {
    height: 70px;
  }

  .fixed-top-nav {
    padding: 10px 0;
  }
  
  .action-icon {
    margin: 0 5px;
  }
}
</style>