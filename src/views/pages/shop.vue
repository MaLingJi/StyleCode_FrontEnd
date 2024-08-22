<template>
<!-- 
<link href="../../../sidebars.css" rel="stylesheet">
<link rel="canonical" href="https://getbootstrap.com/docs/5.1/examples/sidebars/"> -->

<div class="b-example-divider"></div>
  <div class="flex-shrink-0 p-3 bg-white" style="width: 280px">
    <span class="fs-5 fw-semibold">分類</span>
    <ul class="list-unstyled ps-0">
      <li class="mb-1" v-for="category in categories" :key="category.categoryId">
        <div>
          <button
            class="btn btn-toggle align-items-center rounded collapsed"
            data-bs-toggle="collapse"
            :data-bs-target="'#category-' + category.categoryId"
            aria-expanded="false"
          >
            {{ category.categoryName }}
          </button>
        </div>
        <div class="collapse" :id="'category-' + category.categoryId">
          <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
            <li v-for="subcategory in category.subcategories" :key="subcategory.subcategoryId">
              <button class="btn btn-link">
                {{ subcategory.subcategoryName }}
              </button>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axiosapi from "@/plugins/axios.js";

const categories = ref([]);

onMounted(async () => {
    const response = await axiosapi.get("/categories");
    categories.value = response.data;
    
    for (let category of categories.value) {
      const subcategoriesResponse = await axiosapi.get(`/subcategories/categories/${category.categoryId}`);
      category.subcategories = subcategoriesResponse.data;
    }
    console.error("Error fetching data:", error);
  })
</script>

<style>
</style>