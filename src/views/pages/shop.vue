<template>
  <div class="ts-container" ref="containerRef">
    <div class="category-menu">
      <div class="category-item" v-for="category in categories" :key="category.categoryId">
        <button class="category-button" @click="toggleSubcategories(category)">
          {{ category.categoryName }}
        </button>
        <div v-if="category.showSubcategories" class="subcategory-menu">
          <button v-for="subcategory in category.subcategories" :key="subcategory.subcategoryId"
            class="subcategory-button" @click="filterProductsBySubcategory(subcategory.subcategoryId)">
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
            <img :src="getImageUrl(product.coverImage)" :alt="product.productName" />
          </div>
          <div class="ts-content">
            <h3>{{ product.productName }}</h3>
            <p>價格: ${{ product.price }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="ts-pagination is-secondary">
      <Paginate v-model="currentPage" :page-count="getPageCount()" :page-range="5" :margin-pages="0"
        :click-handler="handlePageChange" :prev-text="''" :next-text="''" :container-class="'ts-pagination'"
        :page-class="'item'" :active-class="'is-active'" :prev-class="'item is-back'" :next-class="'item is-next'" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axiosapi from "@/plugins/axios.js";
import Paginate from 'vuejs-paginate-next';

const path = import.meta.env.VITE_PRODUCT_IMAGE_URL

const categories = ref([]);
const products = ref([]);
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
    const productsResponse = await axiosapi.get("/products");
    products.value = productsResponse.data;

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
    console.error("Error fetching data:", error);
  }
  document.addEventListener('click', handleOutsideClick);
});

const handleOutsideClick = (event) => {
  // 检查点击是否在分类菜单之外
  if (containerRef.value && !containerRef.value.contains(event.target)) {
    // 关闭所有打开的子菜单
    closeAllSubmenus();
  }
};

const getImageUrl = (imageName) => {
  if (imageName) {
    return `${path}${imageName}`;
  }
  return `${path}/image.jpg`; // 返回一個默認圖片路徑
};

const closeAllSubmenus = () => {
  categories.value.forEach(category => {
    category.showSubcategories = false;
  });
};
const toggleSubcategories = async (category) => {
  // 关闭其他打开的子菜单
  categories.value.forEach(cat => {
    if (cat !== category) {
      cat.showSubcategories = false;
    }
  });

  category.showSubcategories = !category.showSubcategories;

  if (category.showSubcategories && !category.subcategories) {
    axiosapi.get(`/subcategories/categories/${category.categoryId}`)
      .then(response => {
        category.subcategories = response.data;
      })
      .catch(error => {
        console.error("Error fetching subcategories:", error);
      });
  }
};

const filterProductsBySubcategory = (subcategoryId) => {
  selectedSubcategoryId.value = subcategoryId;
  currentPage.value = 1; // 重置到第一頁
  closeAllSubmenus();
};

const handlePageChange = (pageNum) => {
  currentPage.value = pageNum;
};

// 替代 computed 屬性的方法
const getFilteredProducts = () => {
  if (selectedSubcategoryId.value) {
    return products.value.filter(product => product.subcategoryId === selectedSubcategoryId.value);
  }
  return products.value;
};

const getPageCount = () => {
  return Math.ceil(getFilteredProducts().length / itemsPerPage);
};

const getPaginatedProducts = () => {
  const filteredProducts = getFilteredProducts();
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredProducts.slice(startIndex, endIndex);
};

// 在组件卸载时移除事件监听器
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
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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