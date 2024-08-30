<template>
  <div class="category-menu" :class="{ 'is-hidden': isHidden }" ref="containerRef">
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

const props = defineProps({
  categories: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['filterByCategory', 'filterBySubcategory']);

const containerRef = ref(null);
const isHidden = ref(false);
let lastScrollTop = 0;

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

const hideSubcategories = (category) => {
  category.showSubcategories = false;
};

const hideAllSubcategories = () => {
  props.categories.forEach(category => {
    category.showSubcategories = false;
  });
};

const handleOutsideClick = (event) => {
  if (containerRef.value && !containerRef.value.contains(event.target)) {
    hideAllSubcategories();
  }
};

const handleScroll = () => {
  const st = window.pageYOffset || document.documentElement.scrollTop;
  const navbarHeight = 60; // 假設導航欄高度為 60px，請根據實際情況調整

  if (st > navbarHeight) {
    if (st > lastScrollTop) {
      // 向下滾動超過導航欄
      isHidden.value = true;
    } else {
      // 向上滾動
      isHidden.value = false;
    }
  } else {
    // 滾動位置在導航欄內，始終顯示分類菜單
    isHidden.value = false;
  }
  lastScrollTop = st <= 0 ? 0 : st;
};

onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>

.category-menu {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f8f8;
  padding: 10px 0;
  position: fixed;
  top: 90px; /* 設置為導航欄的高度 */
  left: 0;
  right: 0;
  z-index: 999; /* 確保它在導航欄之下 */
  transition: transform 0.3s ease-in-out;
}

.category-menu.is-hidden {
  transform: translateY(-100%);
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