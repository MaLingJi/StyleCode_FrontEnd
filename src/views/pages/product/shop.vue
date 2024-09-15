<template>
  <div class="shop-page-layout">
    <!-- 頁面布局 -->
    <header class="fixed-top-nav">
      <!-- 固定的頂部導航欄 -->
      <div class="ts-container">
        <!-- 傳遞分類數據到 CategoryMenu 元件 -->
        <CategoryMenu :categories="categories" @filterByCategory="filterProductsByCategory"
          @filterBySubcategory="filterProductsBySubcategory" />
      </div>
    </header>

    <main class="main-content">
      <div class="ts-container">
        <div class="ts-grid">
          <div class="column is-16-wide">
            <div class="ts-box">
              <div class="ts-content">
                <h3>排列方式</h3>
                <div class="filter-container">
                  <div class="sort-select" style="width: 20%;">
                    <select v-model="productStore.sortOption" @change="sortProducts">
                      <option value="">預設</option>
                      <option value="priceAsc">價格由低至高</option>
                      <option value="priceDesc">價格由高至低</option>
                    </select>
                  </div>
                  <div class="search-input">
                    <input type="text" v-model="searchQuery" @input="handleSearch" placeholder="搜索商品...">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-13-wide">
        <div class="product-grid">
          <div class="column" v-for="product in productStore.getPaginatedProducts" :key="product.productId">
            <!-- 使用 v-for 迴圈顯示每個商品，並使用 ProductCard 元件渲染每個商品 -->
            <ProductCard :product="product" style="cursor: pointer" />
          </div>
        </div>

        <div class="ts-pagination is-secondary" style="margin: 0px 0px 10px 0px ;">
          <Paginate v-model="productStore.currentPage" :page-count="productStore.getPageCount" :page-range="3"
            :margin-pages="1" :click-handler="handlePageChange" :prev-text="''" :next-text="''" :prev-class="'item'"
            :next-class="'item'" :prev-link-class="'item is-back'" :next-link-class="'item is-next'"
            :container-class="'ts-pagination'" :page-class="'item'" :active-class="'is-active'"
            :first-last-button="true" :first-button-text="'第一頁'" :last-button-text="'最後一頁'"
            :first-button-class="'item is-first'" :last-button-class="'item is-last'" />
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
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// 使用 Pinia 來存儲和管理產品相關的狀態
const productStore = useProductStore();
// 使用 ref 來存儲分類數據
const categories = ref([]);

// 在組件掛載時，執行異步操作來獲取分類和商品數據

const searchQuery = ref('');

const handleSearch = async () => {
  if (searchQuery.value.trim()) {
    await productStore.searchProducts(searchQuery.value);
    router.push('/shop');
  }
};


onMounted(async () => {

  try {
    // 從 API 獲取所有分類數據
    const categoriesResponse = await axiosapi.get("/categories");
    categories.value = categoriesResponse.data.map((category) => ({
      ...category,
      showSubcategories: false, // 初始化分類的子分類不顯示
    }));

    // 從 API 獲取所有產品數據
    // await productStore.fetchAllProducts();

    // 如果 URL 中有 categoryId 和 subcategoryId，按照子分类筛选商品
    const categoryId = route.params.categoryId;
    const subcategoryId = route.params.subcategoryId;

    if (categoryId && subcategoryId) {
      await filterProductsBySubcategory(subcategoryId, categoryId);
    } else {
      // 否则获取所有产品数据
      await productStore.fetchAllProducts();
    }

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

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.ts-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  color: #000;
}

/* 定義商店頁面的布局，包含頂部導航和主內容區域 */
.shop-page-layout {
  padding-top: 60px;
  /* 預留空間給固定的頂部導航 */
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


.search-input input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-input {
  flex: 1;
  /* Allows the search input to grow and fill available space */
}

.filter-container {
  display: flex;
  align-items: stretch;
  gap: 10px;
  /* Adds space between select and input */
  width: 100%;
  /* Ensures the container takes full width */
}

.sort-select select {
  width: 100%;
  height: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  appearance: none;
  /* Removes default styling */
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath d='M0 2l4 4 4-4z' fill='%23000000'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 8px 8px;
}

/* 为卡片添加样式 */
:deep(.product-card) {
  background-color: white; /* 确保卡片背景为白色 */
  box-shadow: 0 2px 5px rgba(0,0,0,0.1); /* 添加轻微阴影 */
  border-radius: 8px; /* 圆角边框 */
  transition: all 0.3s ease; /* 添加过渡效果 */
  width: 100%; /* 确保卡片填满列宽 */
}
:deep(.product-card:hover) {
  box-shadow: 0 4px 10px rgba(0,0,0,0.15); /* 悬停时增强阴影效果 */
  transform: translateY(-5px); /* 悬停时轻微上浮 */
}

/* 调整页面背景色，增加与卡片的对比 */
.shop-page-layout {
  background-color: #f5f5f5; /* 浅灰色背景 */
}

.main-content {
  padding: 20px 0; /* 增加主内容区域的上下内边距 */
}


/* 响应式调整 */
@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    padding: 0 15px;
  }

  .product-column {
    width: 100%;
  }

  :deep(.product-card) {
    border-radius: 6px; /* 稍微减小圆角 */
  }

  :deep(.product-card) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  :deep(.product-card .image-container) {
    padding-bottom: 100%; /* 保持 1:1 的寬高比 */
  }

  :deep(.product-card .product-info) {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  :deep(.product-card h3) {
    font-size: 1em;
    margin-bottom: 5px;
  }

  :deep(.product-card p) {
    font-size: 0.9em;
  }

  .ts-container {
    padding-left: 0;
    padding-right: 0;
  }

  .ts-box {
    margin-left: 0;
    margin-right: 0;
    border-radius: 0;
  }
  
  .column.is-16-wide {
    padding-left: 0;
    padding-right: 0;
  }

  .ts-content {
    padding: 15px;
  }

  .search-input {
    width: 100%;
  }

  .main-content {
    padding-top: 15px;
  }

  .column.is-13-wide {
    padding-left: 0;
    padding-right: 0;
  }

}

@media (max-width: 480px) {
    .product-grid {
    gap: 10px;
  }
}

</style>