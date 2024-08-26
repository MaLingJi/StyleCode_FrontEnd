<template>
    <div class="ts-container product-details">
      <div class="ts-grid">
        <div class="column is-7-wide">
          <div class="ts-image main-image">
            <img :src="getImageUrl(product.pimages?.[0]?.imgUrl)" :alt="product.productName"/>
          </div>
          <div class="ts-grid thumbnail-grid">
            <div class="column" v-for="(image, index) in product.pimages" :key="index">
              <div class="ts-image thumbnail">
                <img :src="getImageUrl(image.imgUrl)" :alt="product.productName"/>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-9-wide product-info">
          <h1 class="ts-header is-huge">{{ product.productName }}</h1>
          <p class="ts-text is-large price">NT$ {{ selectedDetail ? selectedDetail.price : '請選擇規格' }}</p>
          <div class="ts-divider"></div>
          <div class="ts-grid">
            <div class="column is-8-wide">
              <div class="ts-select is-fluid">
                <select v-model="selectedColor" @change="updateSelectedDetail">
                  <option value="">請選擇顏色</option>
                  <option v-for="color in availableColors" :key="color" :value="color">{{ color }}</option>
                </select>
              </div>
            </div>
            <div class="column is-8-wide">
              <div class="ts-select is-fluid">
                <select v-model="selectedSize" @change="updateSelectedDetail">
                  <option value="">請選擇尺寸</option>
                  <option v-for="size in availableSizes" :key="size" :value="size">{{ size }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="ts-grid has-top-spaced">
            <div class="column is-8-wide">
              <div class="ts-input is-fluid">
                <input type="number" v-model.number="quantity" min="1" :max="selectedDetail ? selectedDetail.stock : 0">
              </div>
            </div>
            <div class="column is-8-wide">
              <button class="ts-button is-fluid is-positive" @click="addToCart" :disabled="!selectedDetail">
                加入購物車
              </button>
            </div>
          </div>
          <div class="ts-box is-segment has-top-spaced-large">
            <div class="ts-content">
              <h3 class="ts-header">商品說明</h3>
              <p class="ts-text">{{ selectedDetail ? selectedDetail.productDescription : product.productDescription }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import axiosapi from '@/plugins/axios.js';
  
  const route = useRoute();
  const product = ref({});
  const selectedColor = ref('');
  const selectedSize = ref('');
  const quantity = ref(1);
  const selectedDetail = ref(null);
  
  const getImageUrl = (imageName) => {
    const path = import.meta.env.VITE_PRODUCT_IMAGE_URL;
    if (imageName) {
      return `${path}${imageName}`;
    }
    return '../../../public/No_image.png';
  };
  
  onMounted(async () => {
    try {
      const response = await axiosapi.get(`/products/${route.params.id}`);
      product.value = response.data;
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  });
  
  const availableColors = computed(() => {
    return [...new Set(product.value.productDetails?.map(detail => detail.color) || [])];
  });
  
  const availableSizes = computed(() => {
    return [...new Set(product.value.productDetails?.map(detail => detail.size) || [])];
  });
  
  const updateSelectedDetail = () => {
    selectedDetail.value = product.value.productDetails?.find(
      detail => detail.color === selectedColor.value && detail.size === selectedSize.value
    ) || null;
    
    if (selectedDetail.value) {
      quantity.value = Math.min(quantity.value, selectedDetail.value.stock);
    } else {
      quantity.value = 1;
    }
  };
  
  const addToCart = () => {
    if (!selectedDetail.value) {
      alert('請選擇商品規格');
      return;
    }
    // 這裡添加將商品加入購物車的邏輯
    console.log('Added to cart:', {
      productId: product.value.productId,
      productDetailsId: selectedDetail.value.productDetailsId,
      color: selectedColor.value,
      size: selectedSize.value,
      quantity: quantity.value
    });
  };
  </script>
  
  <style scoped>
  .product-details {
    padding: 2rem 0;
  }
  
  .main-image img {
    width: 100%;
    height: auto;
  }
  
  .thumbnail-grid {
    margin-top: 1rem;
  }
  
  .thumbnail img {
    width: 100%;
    height: auto;
    cursor: pointer;
  }
  
  .product-info {
    padding-left: 2rem;
  }
  
  .product-code {
    margin-top: 0.5rem;
  }
  
  .price {
    font-weight: bold;
    color: #000;
    margin: 1rem 0;
  }
  
  .ts-select, .ts-input, .ts-button {
    margin-top: 1rem;
  }
  </style>