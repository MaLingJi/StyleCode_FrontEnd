<template>
  <div class="shop-page-layout">
     <!-- 頁面布局 -->
    <header class="fixed-top-nav">
        <!-- 固定的頂部導航欄 -->
      <div class="ts-container">
          <!-- 傳遞分類數據到 CategoryMenu 元件 -->
        <CategoryMenu 
          :categories="categories"
          @filterByCategory="filterProductsByCategory"
          @filterBySubcategory="filterProductsBySubcategory"
        />
      </div>
    </header>
  
    <main class="main-content">
      <div class="ts-container">
        <div class="ts-grid">
          <div class="column is-16-wide">
            <div class="ts-box">
              <div class="ts-content">
                <h3>排列方式</h3>
                <div class="ts-select is-fluid">
                   <!-- 排列方式的下拉選單 -->
                  <select v-model="productStore.sortOption" @change="sortProducts">
                       <!-- 雙向綁定選擇的排列方式，當選擇變更時調用 sortProducts 方法 -->
                    <option value="">預設</option>
                    <option value="priceAsc">價格由低到高</option>
                    <option value="priceDesc">價格由高到低</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="column is-13-wide">
        <div class="ts-grid is-3-columns is-relaxed is-stretched">
          <div class="column" v-for="product in productStore.getPaginatedProducts" :key="product.productId">
             <!-- 使用 v-for 迴圈顯示每個商品，並使用 ProductCard 元件渲染每個商品 -->
            <ProductCard :product="product"  style="cursor: pointer" />
          </div>
        </div>
        
        <div class="ts-pagination is-secondary">
          <Paginate 
            v-model="productStore.currentPage"
            :page-count="productStore.getPageCount" 
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
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axiosapi from "@/plugins/axios.js";
import Paginate from 'vuejs-paginate-next';
import CategoryMenu from "@/components/product/CategoryMenu.vue";
import ProductCard from "@/components/product/ProductCard.vue";
import { useProductStore } from '@/stores/product';
import Swal from "sweetalert2";

// 使用 Pinia 來存儲和管理產品相關的狀態
const productStore = useProductStore();
// 使用 ref 來存儲分類數據
const categories = ref([]);

// 在組件掛載時，執行異步操作來獲取分類和商品數據





onMounted(async () => {

  Swal.fire({
    title: '讀取中...',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  try {
    // 從 API 獲取所有分類數據
    const categoriesResponse = await axiosapi.get("/categories");
    categories.value = categoriesResponse.data.map((category) => ({
      ...category,
      showSubcategories: false, // 初始化分類的子分類不顯示
    }));

    // 從 API 獲取所有產品數據
    await productStore.fetchAllProducts();
    Swal.close();
  } catch (error) {
    console.error("Error fetching data:", error);
    // 如果出現錯誤，也關閉讀取提示並顯示錯誤訊息
    Swal.fire({
      icon: 'error',
      title: '載入失敗',
      text: '無法載入數據，請稍後再試。'
    });
  }
});

// 根據分類篩選商品
const filterProductsByCategory = (categoryId) => {
  productStore.fetchProductsByCategory(categoryId);
};

// 根據子分類篩選商品
const filterProductsBySubcategory = (subcategoryId, categoryId) => {
  productStore.fetchProductsBySubcategory(categoryId, subcategoryId);
};

// 當頁面變更時，更新頁碼並滾動到頁面頂部
const handlePageChange = (pageNum) => {
  productStore.setPage(pageNum);
  window.scrollTo(0, 0);
};

// 根據選擇的排序選項來排序產品
const sortProducts = () => {
  productStore.sortProducts();
};

</script>

<style scoped>
.ts-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  color: #000;
}

/* 定義商店頁面的布局，包含頂部導航和主內容區域 */
.shop-page-layout {
  padding-top: 60px;/* 預留空間給固定的頂部導航 */
}

/* 調整產品框的下邊距 */
.ts-box {
  margin-bottom: 20px;
}

/* 調整標題和其下方間距 */
.ts-content h3 {
  margin-bottom: 10px;
}

/* 定義產品列表的樣式，確保其填滿可用空間 */
.product-list {
  flex-grow: 1;
}

/* 調整寬度為 16 格的列內的框高度 */
.column.is-16-wide .ts-box {
  height: 80%;
}



/* 為手機端設置響應式布局 */
@media (max-width: 768px) {
  .ts-grid {
    flex-direction: column; /* 將列改為垂直排列 */
  }

  .sidebar, .product-list {
    width: 100%;/* 調整寬度為 100% */
  }

  .sidebar {
    margin-bottom: 20px;/* 為側邊欄添加下邊距 */
  }
}
</style>