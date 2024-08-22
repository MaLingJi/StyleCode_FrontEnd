<template>
    <div class="b-example-divider"></div>
    <div class="flex-shrink-0 p-3 bg-white" style="width: 280px">
      <span class="fs-5 fw-semibold">分類</span>
      <n-cascader
        :options="cascaderOptions"
        v-model:value="selectedValue"
        placeholder="選擇分類"
        @update:value="handleSelectionChange"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { NCascader } from 'naive-ui';
  import axiosapi from '@/plugins/axios.js';
  
  const cascaderOptions = ref([]);
  const selectedValue = ref(null);
  
  onMounted(async () => {
    try {
      const response = await axiosapi.get('/categories');
      const categories = response.data;
  
      cascaderOptions.value = categories.map((category) => ({
        label: category.categoryName,
        value: category.categoryId,
        children: [], // 子分類初始化為空
      }));
  
      for (let category of cascaderOptions.value) {
        const subcategoriesResponse = await axiosapi.get(`/subcategories/categories/${category.value}`);
        category.children = subcategoriesResponse.data.map((subcategory) => ({
          label: subcategory.subcategoryName,
          value: subcategory.subcategoryId,
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });
  
  const handleSelectionChange = (value) => {
    console.log('選中的值:', value);
  };
  </script>
  
  <style>
  </style>
  