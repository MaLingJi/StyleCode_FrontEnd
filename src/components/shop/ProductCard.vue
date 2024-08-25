<template>
    <div class="ts-box product-card">
      <div class="ts-image">
        <img :src="getImageUrl(product.coverImage)" :alt="product.productName"/>
      </div>
      <div class="ts-content">
        <h3>{{ product.productName }}</h3>
        <p>價格: ${{ product.price }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  // 定義元件的 props
  const props = defineProps({
    product: {
      type: Object,
      required: true
    }
  });
  
  // 獲取商品圖片 URL 的方法
  const getImageUrl = (imageName) => {
    const path = import.meta.env.VITE_PRODUCT_IMAGE_URL;
    if (imageName) {
      return `${path}${imageName}`;
    }
    // 如果沒有圖片，返回預設圖片
    return '../../../public/No_image.png';
  };
  </script>
  
  <style scoped>
  .product-card {
    transition: all 0.3s ease;
    border: 2px solid transparent;
  }
  
  .product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  .ts-image img {
    width: 100%;
    height: auto;
    object-fit: cover;
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
  
  .product-card:hover .ts-content h3 {
    color: #007bff;
  }
  
  .ts-content p {
    margin: 0;
    color: #666;
    font-weight: bold;
  }
  </style>