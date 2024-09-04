<template>
   <!-- 產品卡片容器，添加點擊、滑鼠進入和離開事件 -->
  <div class="ts-box product-card" 
       @click="navigateToProductDetails"  
       @mouseenter="handleMouseEnter"
       @mouseleave="handleMouseLeave">
        <!-- 圖片容器 -->
    <div class="ts-image image-container">
         <!-- 基本圖片（封面圖） -->
      <img :src="getImageUrl(product.coverImage)" :alt="product.productName" class="base-image" />
         <!-- 懸停圖片，僅在有 URL 時顯示，並根據懸停狀態添加 'show' 類 -->
      <img v-if="hoverImageUrl" :src="hoverImageUrl" :alt="product.productName" class="hover-image" :class="{ 'show': isHovering }" @error="handleImageError"/>
    </div>
      <!-- 產品信息容器 -->
    <div class="ts-content">
      <h3>{{ product.productName }}</h3>
      <p>價格: ${{ product.price }}</p> 
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axiosapi from "@/plugins/axios.js";

// 初始化路由器
const router = useRouter();
// 用於存儲懸停圖片 URL 的響應式引用
const hoverImageUrl = ref('');
// 用於跟踪是否正在懸停的響應式引用
const isHovering = ref(false);

// 定義組件的 props
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

// 獲取圖片 URL 的函數
const getImageUrl = (imageName) => {
  const path = import.meta.env.VITE_PRODUCT_IMAGE_URL;
  if (imageName) {
    return `${path}${imageName}`;
  }
    // 如果沒有圖片，返回默認的 "無圖片" 圖像
  return '../../../public/No_image.png';
};

// 導航到產品詳情頁的函數
const navigateToProductDetails = () => {
  router.push({ name: 'productDetails-link', params: { id: props.product.productId } });
};

// 加載懸停圖片的異步函數
const loadHoverImage = async () => {
  if (!hoverImageUrl.value) {
    try {
      const response = await axiosapi.get(`/${props.product.productId}/images/hover?imageName=move.webp`);
      if (response.data && response.data.imgUrl) {
        hoverImageUrl.value = getImageUrl(response.data.imgUrl);
      }
    } catch (error) {
      console.error("Error loading hover image:", error);
    }
  }
};

// 處理滑鼠進入事件的函數
const handleMouseEnter = () => {
  isHovering.value = true;
};

// 處理滑鼠離開事件的函數
const handleMouseLeave = () => {
  isHovering.value = false;
};

// 處理圖片加載錯誤的函數
const handleImageError = () => {
  console.error('Failed to load hover image:', hoverImageUrl.value);
  hoverImageUrl.value = ''; // 清空 hover 圖片 URL，這樣就只顯示封面圖
};

// 在組件掛載時執行
onMounted(() => {
  // 在背景預加載 hover 圖片，但不立即顯示
  loadHoverImage();
});

// 監聽產品變化
watch(() => props.product, () => {
  // 當產品變化時重置 hover 圖片 URL
  hoverImageUrl.value = ''; // 清空當前的懸停圖片 URL。這是為了確保在產品變化時，不會顯示舊產品的懸停圖片
  loadHoverImage(); // 調用這個函數來加載新產品的懸停圖片
}, { deep: true });

</script>

<style scoped>
/* 產品卡片的基本樣式 */
.product-card {
  transition: all 0.3s ease;
  border: 2px solid transparent;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

/* 產品卡片懸停效果 */
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* 圖片容器樣式 */
.image-container {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  position: relative;
  /* padding-top: 100%; /* 1:1 Aspect Ratio */
  overflow: hidden;
}

/* 圖片的基本樣式 */
.ts-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.5s ease;
}

/* 基本圖片（封面圖）樣式 */
.base-image {
  opacity: 1;
  object-fit: cover;
}

/* 懸停圖片樣式 */
.hover-image {
  opacity: 0;
  z-index: 1; /* 確保 hover 圖片在封面圖上層 */
  object-fit: contain; /* 使用 contain 来保持图片比例 */
}

/* 顯示懸停圖片的樣式 */
.hover-image.show {
  opacity: 1;
}

/* 產品信息容器樣式 */
.ts-content {
  padding: 15px;
}

/* 產品名稱樣式 */
.ts-content h3 {
  margin: 0 0 10px 0;
  font-size: 1.1em;
  transition: color 0.3s ease;
}

/* 產品價格樣式 */
.ts-content p {
  margin: 0;
  color: #666;
  font-weight: bold;
}
</style>