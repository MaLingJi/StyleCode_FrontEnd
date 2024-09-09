<template>
  <!-- <div class="ts-divider"></div> -->

  <!-- 矚目看板 -->
  <div class="ts-content is-tertiary is-vertically-padded">
    <div class="ts-container">
      <div class="ts-header is-big is-heavy">庫存管理</div>
      <div class="ts-text is-secondary">編輯商品的相關金額與剩餘數量。</div>
    </div>
  </div>
  <!-- / 矚目看板 -->

  <div class="ts-divider"></div>
  <div class="ts-container has-vertically-padded-big">
    <div class="ts-grid is-relaxed">
      <div class="column is-4-wide">
        <div class="ts-box">
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
            <a href="#!" class="item">訂單列表</a>
            <a class="item" @click="switchComp(refundReview)">退款申請</a>
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
            <a href="#!" class="item" @click="switchComp(postwebset)">網站設定</a>
            <!-- <a href="#!" class="item">付款方式</a> -->
          </div>
        </div>
      </div>
      <!-- 新增商品 -->
      <div class="column is-12-wide">
        <div class="ts-box has-bottom-spaced-large">
          <component :is="currentComp"></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AddProduct from "@/components/product/addProduct.vue";
import CategoryManager from "@/components/product/CategoryManager.vue";
import SubcategoryManager from "@/components/product/SubcategoryManager.vue";
import ProductManager from "@/components/product/ProductManager.vue";
import ProductDetailManager from "@/components/product/ProductDetailManager.vue";
import { shallowRef, onMounted } from "vue";
import OrderManagement from "@/components/order/OrderManage.vue";
import refundReview from "./refundReview.vue";
import backUser from "@/components/profile/backUser.vue";
import postwebset from "@/components/profile/postwebset.vue"

import useUserStore from "@/stores/user.js";
const userStore = useUserStore();
console.log(userStore.userId);

const currentComp = shallowRef(OrderManagement);
function switchComp(comp) {
  currentComp.value = comp;
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
</script>

<style></style>
