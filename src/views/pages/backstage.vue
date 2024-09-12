<template>
  <div class="backstage-container">
    <div class="backstage-layout">
      <!-- 側邊欄 -->
      <div class="sidebar" :class="{ 'is-active': isSidebarOpen }">
        <div class="ts-box">
          <!-- 訂單部分 -->
          <div class="sidebar-section">
            <div class="ts-content is-dense">
              <div class="ts-grid">
                <div class="column is-fluid">
                  <div class="ts-header">訂單</div>
                </div>
                <div class="column">
                  <span class="ts-icon is-boxes-stacked-icon"></span>
                </div>
              </div>
            </div>
            <div class="ts-menu is-dense is-small">
              <a class="item" @click="switchComp(OrderManagement)">訂單分析</a>
              <a class="item" @click="switchComp(refundReview)">退款申請</a>
            </div>
          </div>
          <div class="ts-divider has-top-spaced-small"></div>
          <div class="ts-content is-dense">
            <div class="ts-grid">
              <div class="column is-fluid">
                <div class="ts-header">商品貨物</div>
              </div>
              <div class="column">
                <span class="ts-icon is-clipboard-icon"></span>
              </div>
            </div>
          </div>
          <div class="ts-menu is-dense is-small">
            <a class="item" @click="handleEditCategories">分類管理</a>
            <a class="item" @click="handleEditSubcategories">子分類管理</a>
            <a class="item" @click="addNewProduct">新增商品</a>
            <a class="item" @click="handleEditProduct">商品管理</a>
            <a class="item" @click="handleEditProductDetail">商品庫存管理</a>
          </div>
          <div class="ts-divider has-top-spaced-small"></div>
          <div class="ts-content is-dense">
            <div class="ts-grid">
              <div class="column is-fluid">
                <div class="ts-header">會員</div>
              </div>
              <div class="column">
                <span class="ts-icon is-gears-icon"></span>
              </div>
            </div>
          </div>
          <div class="ts-menu is-dense is-small has-bottom-spaced-small">
            <a href="#!" class="item" @click="switchComp(backUser)">會員管理</a>
          </div>
          <div class="ts-divider has-top-spaced-small"></div>
          <div class="ts-content is-dense">
            <div class="ts-grid">
              <div class="column is-fluid">
                <div class="ts-header">文章管理</div>
              </div>
              <div class="column">
                <span class="ts-icon is-gears-icon"></span>
              </div>
            </div>
          </div>
          <div class="ts-menu is-dense is-small has-bottom-spaced-small">
            <a href="#!" class="item" @click="switchComp(postset)">管理貼文</a>
            <!-- <a href="#!" class="item" @click="switchComp(postwebset)">網站設定</a> -->
            <!-- <a href="#!" class="item">付款方式</a> -->
          </div>
        </div>
      </div>

      <!-- 側邊欄提示 -->
      <div class="sidebar-hint" :class="{ 'is-hidden': isSidebarOpen }" @click="toggleSidebar">
        <span class="ts-icon is-chevron-right-icon"></span>
      </div>

      <!-- 主要內容區域 -->
      <div class="main-content" @click="closeSidebarOnMobile">
        <div class="ts-divider"></div>
        <div class="ts-container has-vertically-padded-big">
          <div class="ts-box has-bottom-spaced-large">
            <component :is="currentComp"></component>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import AddProduct from "@/components/product/addProduct.vue";
import CategoryManager from "@/components/product/CategoryManager.vue";
import SubcategoryManager from "@/components/product/SubcategoryManager.vue";
import ProductManager from "@/components/product/ProductManager.vue";
import ProductDetailManager from "@/components/product/ProductDetailManager.vue";
import OrderManagement from "@/components/order/OrderManage.vue";
import refundReview from "./refundReview.vue";
import backUser from "@/components/profile/backUser.vue";
import postwebset from "@/components/profile/postwebset.vue";
import postset from "@/components/profile/postset.vue"

import useUserStore from "@/stores/user.js";
const userStore = useUserStore();
console.log(userStore.userId);

const currentComp = ref(OrderManagement);
const isSidebarOpen = ref(false); // 默认在移动端关闭侧边栏

function switchComp(comp) {
  currentComp.value = comp;
  if (window.innerWidth <= 768) {
    isSidebarOpen.value = false;
  }
}

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}

function closeSidebarOnMobile(event) {
  if (window.innerWidth <= 768 && isSidebarOpen.value) {
    // 确保点击的不是侧边栏本身
    if (!event.target.closest('.sidebar')) {
      isSidebarOpen.value = false;
    }
  }
}

// 新增商品
function addNewProduct() {
  switchComp(AddProduct);
}

// 分類管理
function handleEditCategories() {
  switchComp(CategoryManager);
}

// 子分類管理
function handleEditSubcategories() {
  switchComp(SubcategoryManager);
}

// 商品管理
function handleEditProduct() {
  switchComp(ProductManager);
}

// 商品詳情管理
function handleEditProductDetail() {
  switchComp(ProductDetailManager);
}

// 監聽窗口大小變化
const handleResize = () => {
  if (window.innerWidth > 768) {
    isSidebarOpen.value = true;
  } else {
    isSidebarOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize(); // 初始化時調用一次
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.backstage-container {
  width: 100%;
  min-height: 100vh;
  position: relative;
}

.backstage-layout {
  display: flex;
  min-height: calc(100vh - 50px);
}

.sidebar {
  width: 250px;
  background-color: #ffffff; /* 將背景色改為白色 */
  transition: transform 0.3s ease;
  overflow-y: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 添加陰影效果 */
}

.main-content {
  flex: 1;
  overflow-x: auto;
  transition: margin-left 0.3s ease;
}

.sidebar-section {
  margin-bottom: 20px;
}

.sidebar-section:not(:last-child) {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 20px;
}

.sidebar .ts-box {
  background-color: transparent; /* 移除 ts-box 的背景色 */
  box-shadow: none; /* 移除 ts-box 的陰影 */
}


/* 新增：側邊欄提示樣式 */
.sidebar-hint {
  display: none;
  position: fixed;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 20px 10px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  cursor: pointer;
  z-index: 1000;
  transition: opacity 0.3s ease;
}

.sidebar-hint .ts-icon {
  font-size: 24px;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    transform: translateX(-100%);
    z-index: 1000;
  }

  .sidebar.is-active {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
  }

  .sidebar-toggle {
    display: block;
  }

  /* 新增：在移動設備上顯示側邊欄提示 */
  .sidebar-hint {
    display: block;
  }

  .sidebar-hint.is-hidden {
    opacity: 0;
    pointer-events: none;
  }

  .ts-header.is-big {
    font-size: 1.5em;
  }

  .ts-text.is-secondary {
    font-size: 0.9em;
  }
}

@media (max-width: 480px) {
  .ts-container {
    padding: 10px;
  }

  .ts-header.is-big {
    font-size: 1.2em;
  }

  .ts-text.is-secondary {
    font-size: 0.8em;
  }

  .ts-menu.is-dense.is-small .item {
    padding: 8px 12px;
  }
}
</style>