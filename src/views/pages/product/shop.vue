<template>
  <div class="shop-page-layout">
    <header class="fixed-top-nav">
      <div class="ts-container">
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
                  <select v-model="productStore.sortOption" @change="sortProducts">
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
            <ProductCard :product="product" />
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

const productStore = useProductStore();
const categories = ref([]);

onMounted(async () => {
  try {
    const categoriesResponse = await axiosapi.get("/categories");
    categories.value = categoriesResponse.data.map((category) => ({
      ...category,
      showSubcategories: false,
    }));

    await productStore.fetchAllProducts();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

const filterProductsByCategory = (categoryId) => {
  productStore.fetchProductsByCategory(categoryId);
};

const filterProductsBySubcategory = (subcategoryId, categoryId) => {
  productStore.fetchProductsBySubcategory(categoryId, subcategoryId);
};

const handlePageChange = (pageNum) => {
  productStore.setPage(pageNum);
  window.scrollTo(0, 0);
};

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

.shop-page-layout {
  padding-top: 60px;
}

.ts-box {
  margin-bottom: 20px;
}

.ts-content h3 {
  margin-bottom: 10px;
}

.product-list {
  flex-grow: 1;
}

.column.is-16-wide .ts-box {
  height: 80%;
}




@media (max-width: 768px) {
  .ts-grid {
    flex-direction: column;
  }

  .sidebar, .product-list {
    width: 100%;
  }

  .sidebar {
    margin-bottom: 20px;
  }
}
</style>