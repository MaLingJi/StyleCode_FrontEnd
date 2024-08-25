<template>
  <div class="ts-container" ref="containerRef">
    <div class="category-menu">
      <div 
        class="category-item" 
        v-for="category in categories" 
        :key="category.categoryId"
        @mouseenter="showSubcategories(category)"
        @mouseleave="hideSubcategories(category)"
      >
        <button 
          class="category-button"
          @click="filterProductsByCategory(category.categoryId)"
        >
          {{ category.categoryName }}
        </button>
        <div v-if="category.showSubcategories" class="subcategory-menu">
          <button 
            v-for="subcategory in category.subcategories"
            :key="subcategory.subcategoryId"
            class="subcategory-button"
            @click="filterProductsBySubcategory(subcategory.subcategoryId)"
          >
            {{ subcategory.subcategoryName }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="ts-divider"></div>
  <div class="ts-container is-narrow has-vertically-padded-big">
    <div class="ts-grid is-3-columns is-relaxed is-stretched">
      <div class="column" v-for="product in getPaginatedProducts()" :key="product.productId">
        <div class="ts-box">
          <div class="ts-image">
            <img :src="getImageUrl(product.coverImage)" :alt="product.productName"/>
          </div>
          <div class="ts-content">
            <h3>{{ product.productName }}</h3>
            <p>價格: ${{ product.price }}</p>
          </div>
        </div>
      </div>
    </div>

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
import { ref, onMounted, onUnmounted } from "vue";
import axiosapi from "@/plugins/axios.js";
import Paginate from 'vuejs-paginate-next';

const path = import.meta.env.VITE_PRODUCT_IMAGE_URL;

const categories = ref([]);
const products = ref([]);
const selectedCategoryId = ref(null);
const selectedSubcategoryId = ref(null);
const currentPage = ref(1);
const itemsPerPage = 9;
const containerRef = ref(null);

onMounted(async () => {
  try {
     // 獲取所有分類
    const categoriesResponse = await axiosapi.get("/categories");
    categories.value = categoriesResponse.data.map((category) => ({
      ...category,
      showSubcategories: false,
    }));
    
      // 獲取所有產品
    await fetchProducts();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  document.addEventListener('click', handleOutsideClick);
});

// 處理分類與子分類 和全部商品 
const fetchProducts = async (categoryId = null, subcategoryId = null) => {
  try {
    let url = "/products/filter";
    if (categoryId) url += `?categoryId=${categoryId}`;
    if (subcategoryId) url += `${categoryId ? '&' : '?'}subcategoryId=${subcategoryId}`;
    
    const response = await axiosapi.get(url);
    products.value = response.data;
    
    // 為每個產品獲取封面圖片
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


const getImageUrl = (imageName) => {
  if (imageName) {
    return `${path}${imageName}`;//商品圖片 路徑+商品ID
  }
  return `../../../public/No_image.png`;// 返回一個默認圖片路徑
};

  //隱藏所有子分類 (例如在點擊分類以外的區域)
  const hideAllSubcategories = () => {
    categories.value.forEach(category => {
      category.showSubcategories = false;
    });
  };

const handleOutsideClick = (event) => {
   // 檢查點擊是否再分類之外
  if (containerRef.value && !containerRef.value.contains(event.target)) {
      //關閉所有打開的子分類
    hideAllSubcategories();
  }
};

//滑鼠移入時 顯示該分類底下的子分類 ，並隱藏其他分類底下的子分類
const showSubcategories = async (category) => {
  hideAllSubcategories();
  category.showSubcategories = true;

  if (!category.subcategories) {
    try {
      const response = await axiosapi.get(`/subcategories/categories/${category.categoryId}`);
      category.subcategories = response.data;
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  }
};

//隱藏某一個特定分類的子分類（例如當滑鼠移出某一個分類時）
const hideSubcategories = (category) => {
  category.showSubcategories = false;
};

const filterProductsByCategory = async (categoryId) => {
  //將 selectedCategoryId 設置為選中的分類 ID，並將 selectedSubcategoryId 清空為 null
    selectedCategoryId.value = categoryId;
    selectedSubcategoryId.value = null;
    //將 currentPage 設置為 1，確保從第一頁開始顯示產品
    currentPage.value = 1;
    //fetchProducts 函數來異步獲取該分類下的產品
  await fetchProducts(categoryId);
};

const filterProductsBySubcategory = async (subcategoryId) => {
  //將 selectedSubcategoryId 設置為選中的子分類 ID
  selectedSubcategoryId.value = subcategoryId;
  //將 currentPage 設置為 1，確保從第一頁開始顯示產品
  currentPage.value = 1;
  //通過 fetchProducts 函數來異步獲取該子分類下的產品，並傳入已選中的分類 ID 和子分類 ID
  await fetchProducts(selectedCategoryId.value, subcategoryId);
  //隱藏所有打開的子分類菜單
  hideAllSubcategories();
};

//換頁後從頁面頂部開始查看商品
const handlePageChange = (pageNum) => {
  currentPage.value = pageNum;
  window.scrollTo(0, 0);
};

//當前篩選過的產品列表
const getFilteredProducts = () => {
  return products.value;
};

//基於當前篩選過的產品列表的長度和每頁顯示的項目數量 itemsPerPage
const getPageCount = () => {
  // Math.ceil 來確保頁數向上取整，以便在產品數量不能整除每頁數量時仍然能夠顯示最後一頁
  return Math.ceil(getFilteredProducts().length / itemsPerPage);
};

//它先根據當前頁數計算要顯示的產品範圍（即 startIndex 和 endIndex），然後使用 slice 方法來獲取這個範圍內的產品。這樣，前端界面只會顯示當前頁面的產品。
const getPaginatedProducts = () => {
  const filteredProducts = getFilteredProducts();
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredProducts.slice(startIndex, endIndex);
};

//Vue 組件卸載時（例如導航到其他頁面或該組件被摧毀時）移除之前添加的點擊事件監聽器 handleOutsideClick，以防止內存洩漏或不必要的事件觸發
onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});
</script>

<style scoped>
.ts-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.ts-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  color: #000;
}

.category-menu {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f8f8;
  padding: 10px 0;
}

.category-item {
  position: relative;
  margin: 0 15px;
}

.category-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 10px 5px;
  transition: color 0.3s;
}

.category-button:hover {
  color: #888;
}

.subcategory-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #eee;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  min-width: 150px;
  z-index: 10;
}

.subcategory-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 10px 15px;
  text-align: left;
  transition: background-color 0.3s;
}

.subcategory-button:hover {
  background-color: #f0f0f0;
}

</style>