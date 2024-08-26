<template>
  <div class="ts-container">
       <!-- 使用分類元件 -->
    <CategoryMenu 
      :categories="categories"
      @filterByCategory="filterProductsByCategory"
      @filterBySubcategory="filterProductsBySubcategory"
    />
  </div>
  <div class="ts-divider"></div>
  <div class="ts-container is-narrow has-vertically-padded-big">
    <div class="ts-grid is-3-columns is-relaxed is-stretched">
      <div class="column" v-for="product in getPaginatedProducts()" :key="product.productId">
        <!-- 商品元件 -->
        <ProductCard :product="product" />
      </div>
    </div>

     <!-- 分頁元件 -->
    <div class="ts-pagination is-secondary">
      <Paginate 
        v-model="currentPage" 
        :page-count="getPageCount()" 
        :page-range="3" 
        :margin-pages="1"
        :click-handler="handlePageChange" 
        :prev-text="''" 
        :next-text="''" 
        :prev-class="'item'"
        :next-class="'item'" 
        :prev-link-class="'item is-back'"
        :next-link-class="'item is-next'" 
        :container-class="'ts-pagination'"
        :page-class="'item'" 
        :active-class="'is-active'" 
        :first-last-button="true"
        :first-button-text="'第一頁'"
        :last-button-text="'最後一頁'"
        :first-button-class="'item is-first'"
        :last-button-class="'item is-last'"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axiosapi from "@/plugins/axios.js";
import Paginate from 'vuejs-paginate-next';
import CategoryMenu from "@/components/product/CategoryMenu.vue";
import ProductCard from "@/components/product/ProductCard.vue";

// 存儲分類、商品和分頁相關的響應式數據
const categories = ref([]);
const products = ref([]);
const selectedCategoryId = ref(null);
const selectedSubcategoryId = ref(null);
const currentPage = ref(1);
const itemsPerPage = 9;

// 元件掛載時獲取分類和商品數據
onMounted(async () => {
  try {
       // 獲取所有分類
    const categoriesResponse = await axiosapi.get("/categories");
    categories.value = categoriesResponse.data.map((category) => ({
      ...category,
      showSubcategories: false,
    }));

      // 獲取所有商品
    await fetchProducts();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

// 獲取全部商品的方法
const fetchProducts = async (categoryId = null, subcategoryId = null) => {
  try {
    let url = "/products/filter";
    if (categoryId) url += `?categoryId=${categoryId}`;
    if (subcategoryId) url += `${categoryId ? '&' : '?'}subcategoryId=${subcategoryId}`;
    
    const response = await axiosapi.get(url);
    products.value = response.data;
    
    // 獲取每個商品的封面圖片
    for (let product of products.value) {
      try {
        const response = await axiosapi.get(`/${product.productId}/cover`);
        product.coverImage = response.data.imgUrl;
      } catch (error) {
        console.error(`Error fetching cover image for product ${product.productId}:`, error);
        product.coverImage = null;
      }
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

// 按分類篩選商品
const filterProductsByCategory = async (categoryId) => {
  selectedCategoryId.value = categoryId;
  selectedSubcategoryId.value = null;
  currentPage.value = 1;
  await fetchProducts(categoryId);
};

// 按子分類篩選商品
const filterProductsBySubcategory = async (subcategoryId) => {
  selectedSubcategoryId.value = subcategoryId;
  currentPage.value = 1;
  await fetchProducts(selectedCategoryId.value, subcategoryId);
};

// 處理頁面變更(換頁面時 頁面移到最上層)
const handlePageChange = (pageNum) => {
  currentPage.value = pageNum;
  window.scrollTo(0, 0);
};

// 獲取篩選後的商品
const getFilteredProducts = () => {
  return products.value;
};

// 計算總頁數
const getPageCount = () => {
  return Math.ceil(getFilteredProducts().length / itemsPerPage);
};

// 獲取當前頁的商品
const getPaginatedProducts = () => {
  const filteredProducts = getFilteredProducts();
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredProducts.slice(startIndex, endIndex);
};
</script>

<style scoped>
.ts-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  color: #000;
}

</style>