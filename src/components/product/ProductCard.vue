<template>
  <div class="ts-box product-card" @click="navigateToProductDetails">
    <div class="ts-image image-container">
      <img :src="getImageUrl(product.coverImage)" :alt="product.productName" />
    </div>
    <div class="ts-content">
      <h3>{{ product.productName }}</h3>
      <p>價格: ${{ product.price }}</p> 
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

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
</script>

<style scoped>
.product-card {
  transition: all 0.3s ease;
  border: 2px solid transparent;
  width: 100%;
  max-width: 500px; /* 限制卡片最大寬度 */
  margin: 0 auto; /* 居中卡片 */
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.image-container {
  width: 100%;
  height: 0;
  padding-bottom: 100%; /* 創建一個正方形的容器 */
  position: relative;
  overflow: hidden;
}

.ts-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 確保圖片覆蓋整個區域，可能會裁剪 */
  transition: all 0.3s ease;
}

.product-card:hover .ts-image img {
  transform: scale(1.05);
}

.ts-content {
  padding: 15px;
}

.ts-content h3 {
  margin: 0 0 10px 0;
  font-size: 1.1em;
  transition: color 0.3s ease;
}

/* .product-card:hover .ts-content h3 {
  color: #007bff;
} */

.ts-content p {
  margin: 0;
  color: #666;
  font-weight: bold;
}
</style>