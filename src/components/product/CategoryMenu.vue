<template>
    <div class="category-menu" ref="containerRef">
      <div 
        class="category-item" 
        v-for="category in categories" 
        :key="category.categoryId"
        @mouseenter="showSubcategories(category)"
        @mouseleave="hideSubcategories(category)"
      >
        <button 
          class="category-button"
          @click="$emit('filterByCategory', category.categoryId)"
        >
          {{ category.categoryName }}
        </button>
        <div v-if="category.showSubcategories" class="subcategory-menu">
          <button 
            v-for="subcategory in category.subcategories"
            :key="subcategory.subcategoryId"
            class="subcategory-button"
            @click="$emit('filterBySubcategory', subcategory.subcategoryId)"
          >
            {{ subcategory.subcategoryName }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import axiosapi from "@/plugins/axios.js";
  
  // 定義元件的 props
  const props = defineProps({
    categories: {
      type: Array,
      required: true
    }
  });
  
  // 定義元件可觸發的事件
  const emit = defineEmits(['filterByCategory', 'filterBySubcategory']);
  
  // 創建一個 ref 來引用分類菜單容器
  const containerRef = ref(null);

  // 顯示子分類的方法
  const showSubcategories = async (category) => {
    hideAllSubcategories();
    category.showSubcategories = true;
  
     // 如果子分類尚未加載，則從服務器獲取
    if (!category.subcategories) {
      try {
        const response = await axiosapi.get(`/subcategories/categories/${category.categoryId}`);
        category.subcategories = response.data;
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    }
  };
  
  
// 隱藏特定分類的子分類
  const hideSubcategories = (category) => {
    category.showSubcategories = false;
  };
  
  // 隱藏所有分類的子分類
  const hideAllSubcategories = () => {
    props.categories.forEach(category => {
      category.showSubcategories = false;
    });
  };
  
  // 處理點擊分類菜單外部的事件
  const handleOutsideClick = (event) => {
    if (containerRef.value && !containerRef.value.contains(event.target)) {
      hideAllSubcategories();
    }
  };
  
  // 組件掛載時添加點擊事件監聽器
  onMounted(() => {
    document.addEventListener('click', handleOutsideClick);
  });
  
  // 組件卸載時移除點擊事件監聽器
  onUnmounted(() => {
    document.removeEventListener('click', handleOutsideClick);
  });
  </script>
  
  <style scoped>
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