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
                <div class="ts-header">商品貨物</div>
              </div>
              <div class="column">
                <span class="ts-icon is-boxes-stacked-icon"></span>
              </div>
            </div>
          </div>
          <div class="ts-menu is-dense is-small">
            <a class="item" @click="handleEditCategories" >分類管理</a>
            <a class="item" @click="handleEditSubcategories">子分類管理</a>
            <a class="item" @click="addNewProduct">新增商品</a>
            <a class="item" @click="handleEditProduct">商品管理</a>
            <a class="item" @click="handleEditProductDetail">商品庫存管理</ a>
          </div>
          <div class="ts-divider has-top-spaced-small"></div>
          <div class="ts-content is-dense">
            <div class="ts-grid">
              <div class="column is-fluid">
                <div class="ts-header">訂單與出貨</div>
              </div>
              <div class="column">
                <span class="ts-icon is-truck-icon"></span>
              </div>
            </div>
          </div>
          <div class="ts-menu is-dense is-small">
            <a class="item" @click=switchComp(OrderManagement)>管理訂單</a>
            <a href="#!" class="item">設定物流</a>
            <a href="#!" class="item">月結統計</a>
          </div>
          <div class="ts-divider has-top-spaced-small"></div>
          <div class="ts-content is-dense">
            <div class="ts-grid">
              <div class="column is-fluid">
                <div class="ts-header">會員與網站</div>
              </div>
              <div class="column">
                <span class="ts-icon is-gears-icon"></span>
              </div>
            </div>
          </div>
          <div class="ts-menu is-dense is-small has-bottom-spaced-small">
            <a href="#!" class="item">網站設定</a>
            <a href="#!" class="item">付款方式</a>
            <a href="#!" class="item">會員管理</a>
            <a href="#!" class="item">機器人配置</a>
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
            <a href="#!" class="item">網站設定</a>
            <a href="#!" class="item">付款方式</a>
        </div>
    </div>
</div>
<!-- 新增商品 -->
<div class="column is-12-wide">
    <div class=" ts-box has-bottom-spaced-large">
        <component :is="currentComp" ></component>
    </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AddProduct from '@/components/product/addProduct.vue';
import CategoryManager from '@/components/product/categoryManager.vue'
import SubcategoryManager from '@/components/product/subcategoryManager.vue'
import ProductManager from '@/components/product/productManager.vue'
import ProductDetailManager from '@/components/product/productDetailManager.vue'
import { shallowRef, onMounted } from 'vue';
import OrderManagement from '@/components/order/OrderManage.vue';

const currentComp = shallowRef(null);
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
