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
        <div
          v-if="category.showSubcategories"
          class="ts-grid is-evenly-divided"
        >
          <div class="column is-center-aligned">
            <div class="column is-center-aligned"
              v-for="subcategory in category.subcategories"
              :key="subcategory.subcategoryId"
            >
              <button 
                class="ts-text is-undecorated is-secondary"
                @click="filterProductsBySubcategory(subcategory.subcategoryId)"
              >
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
      <div class="column" v-for="product in filteredProducts" :key="product.productId">
        <div class="ts-box">
          <div class="ts-image">
            <img :src="`${imgUrl}`" :alt="product.productName"/>
          </div>
          <div class="ts-content">
            <h3>{{ product.productName }}</h3>
            <p>{{ product.productDescription }}</p>
            <p>價格: ${{ product.price }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axiosapi from "@/plugins/axios.js";
const path = import.meta.env.VITE_PRODUCT_IMAGE_URL

const categories = ref([]);
const products = ref([]);
const selectedSubcategoryId = ref(null);

const filteredProducts = computed(() => {
  if (selectedSubcategoryId.value) {
    return products.value.filter(product => product.subcategoryId === selectedSubcategoryId.value);
  }
  return products.value;
});


onMounted(async () => {
  
  // 獲取所有分類
  const categoriesResponse = await axiosapi.get("/categories");
  categories.value = categoriesResponse.data.map((category) => ({
    ...category,
    showSubcategories: false,
  }));
  
  // 獲取所有產品
  const productsResponse = await axiosapi.get("/products");
  products.value = productsResponse.data;
  console.log(productsResponse.data)
  

    // axiosapi.get(`/${products.productId}/cover`).then(response => {
    // const data = response.data;
    // let imagePath = data[0].imgUrl;
    // imgUrl.value = `${path}${imagePath}`
    // console.log(imgUrl.value)
    // 為每個產品獲取封面圖片
    // for (let product of products.value) {
    //   const imageResponse = await axiosapi.get(`/${product.productId}/cover`);
    //   product.coverImage = imageResponse.data.imgUrl;
      
    // }
    })
// });

const toggleSubcategories = async (category) => {
  category.showSubcategories = !category.showSubcategories;

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

const filterProductsBySubcategory = (subcategoryId) => {
  selectedSubcategoryId.value = subcategoryId;
};

const imgUrl = ref ('');

onMounted(() => {
  axiosapi.get(`/products`).then(response => {
    const data = response.data;
    let imagePath = data[0].imgUrl;
    imgUrl.value = `${path}${imagePath}`
    console.log(imgUrl.value)
  }).catch(error => {
            console.error('Error fetching image URL:', error);
        });
});
</script>

<style scoped>
.ts-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
}
</style>