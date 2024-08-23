<template>
  <div class="ts-container">
    <div class="ts-divider is-section"></div>
    <div class="ts-grid is-evenly-divided">
      <div
        class="column is-center-aligned"
        v-for="category in categories"
        :key="category.categoryId"
      >
        <button
          class="ts-text is-undecorated is-secondary"
          @click="toggleSubcategories(category)"
        >
          {{ category.categoryName }}
        </button>
        <!-- 只有當 showSubcategories 為 true 時顯示子分類 -->
        <div
          v-if="category.showSubcategories"
          class="ts-grid is-evenly-divided"
        >
          <div class="column is-center-aligned">
            <div class="column is-center-aligned"
              v-for="subcategory in category.subcategories"
              :key="subcategory.subcategoryId"
            >
              <button class="ts-text is-undecorated is-secondary">
                {{ subcategory.subcategoryName }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="ts-divider"></div>
        <div class="ts-container is-narrow has-vertically-padded-big">
            <div class="ts-grid is-3-columns is-relaxed is-stretched">
                <div class="column"v-for="product in products" :key="product.productId">
                    <div class="ts-box">
                      <div class="ts-image">
                        <img :src="product.coverImage" :alt="product.productName"/>
                    </div>
                        <div class="ts-image" >{{ product.productName }}
                        </div>
                        <div class="ts-content">{{ product.productDescription }}</div>
                    </div>
                </div>
              </div>
            </div>
</template>

<script setup>
import { ref ,  onMounted} from "vue";
import axiosapi from "@/plugins/axios.js";

const categories = ref([]);

onMounted(async () => {
  try {
    const response = await axiosapi.get("/categories");
    // 將 showSubcategories 初始化為 false
    categories.value = response.data.map((category) => ({
      ...category,
      showSubcategories: false,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
});

const toggleSubcategories = async (category) => {
  // 切換 showSubcategories 狀態
  category.showSubcategories = !category.showSubcategories;

  // 如果是第一次點擊且子分類還沒有加載，則加載子分類
  if (category.showSubcategories && !category.subcategories) {
    try {
      const response = await axiosapi.get(
        `/subcategories/categories/${category.categoryId}`
      );
      category.subcategories = response.data;
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  }
};


const products = ref ('');

axiosapi.get(`/products`).then(response =>{
  products.value = response.data;
  console.log(response.data)
})

const pimage = ref('');
axiosapi.get(`/${products.productId}/cover`).then(response => {
  pimage.value = response.data;
  console.log(response.data)
})


</script>

<style>
.ts-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
}
</style>
