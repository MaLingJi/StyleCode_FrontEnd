<template>
  <div class="ts-box product-card" 
       @click="navigateToProductDetails"  
       @mouseenter="handleMouseEnter"
       @mouseleave="handleMouseLeave">
    <div class="ts-image image-container">
      <img :src="getImageUrl(product.coverImage)" :alt="product.productName" class="base-image" />
      <img v-if="hoverImageUrl" :src="hoverImageUrl" :alt="product.productName" class="hover-image" :class="{ 'show': isHovering }" @error="handleImageError"/>
    </div>
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

const router = useRouter();
const hoverImageUrl = ref('');
const isHovering = ref(false);

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const getImageUrl = (imageName) => {
  const path = import.meta.env.VITE_PRODUCT_IMAGE_URL;
  if (imageName) {
    return `${path}${imageName}`;
  }
  return '../../../public/No_image.png';
};

const navigateToProductDetails = () => {
  router.push({ name: 'productDetails-link', params: { id: props.product.productId } });
};

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

const handleMouseEnter = () => {
  isHovering.value = true;
};

const handleMouseLeave = () => {
  isHovering.value = false;
};

const handleImageError = () => {
  console.error('Failed to load hover image:', hoverImageUrl.value);
  hoverImageUrl.value = ''; // 清空 hover 圖片 URL，這樣就只顯示封面圖
};

onMounted(() => {
  // 在背景預加載 hover 圖片，但不立即顯示
  loadHoverImage();
});

watch(() => props.product, () => {
  // 當產品變化時重置 hover 圖片 URL
  hoverImageUrl.value = '';
  loadHoverImage();
}, { deep: true });

</script>

<style scoped>
.product-card {
  transition: all 0.3s ease;
  border: 2px solid transparent;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.image-container {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  position: relative;
  overflow: hidden;
}

.ts-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.5s ease;
}

.base-image {
  opacity: 1;
}

.hover-image {
  opacity: 0;
  z-index: 1; /* 確保 hover 圖片在封面圖上層 */
}

.hover-image.show {
  opacity: 1;
}

.ts-content {
  padding: 15px;
}

.ts-content h3 {
  margin: 0 0 10px 0;
  font-size: 1.1em;
  transition: color 0.3s ease;
}

.ts-content p {
  margin: 0;
  color: #666;
  font-weight: bold;
}
</style>