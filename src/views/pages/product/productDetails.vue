<template>
  <div class="ts-container product-details">
    <div class="ts-grid">
      <div class="column is-7-wide">
        <div class="carousel-container">
          <!-- 照片輪播 -->
          <transition name="fade" mode="out-in">
            <div class="ts-image main-image" :key="currentImageIndex">
              <img
                :src="getImageUrl(currentImage)"
                :alt="product.productName"
              />
            </div>
          </transition>
          <!-- 往前一張or下一張 -->
          <button class="carousel-button prev" @click="prevImage">&lt;</button>
          <button class="carousel-button next" @click="nextImage">&gt;</button>
        </div>
        
        <div class="ts-grid thumbnail-grid">
          <div
            class="column is-2-wide"
            v-for="(image, index) in product.pimages"
            :key="index"
          >
            <div
              class="ts-image thumbnail"
              @click="setCurrentImage(index)"
              :class="{ active: currentImageIndex === index }"
            >
              <img
                :src="getImageUrl(image.imgUrl)"
                :alt="product.productName"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 選擇商品顏色或尺吋 -->
      <div class="column is-9-wide product-info">
        <h1 class="ts-header is-huge">{{ product.productName }}</h1>
        <p class="ts-text is-large price">
          NT$ {{ selectedDetail ? selectedDetail.price : " " }}
        </p>
        <div class="ts-divider"></div>
        <div class="ts-grid">
          <div class="column is-8-wide">
            <div class="ts-select is-fluid">
              <select v-model="selectedColor" @change="updateSelectedDetail">
                <option value="">請選擇顏色</option>
                <option
                  v-for="color in availableColors"
                  :key="color"
                  :value="color"
                >
                  {{ color }}
                </option>
              </select>
            </div>
          </div>
          <div class="column is-8-wide">
            <div class="ts-select is-fluid">
              <select v-model="selectedSize" @change="updateSelectedDetail">
                <option value="">請選擇尺寸</option>
                <option
                  v-for="size in availableSizes"
                  :key="size"
                  :value="size"
                >
                  {{ size }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <!-- 想購買的數量 & 檢查庫存是否足夠 -->
        <div class="ts-grid has-top-spaced">
          <div class="column is-8-wide">
            <div class="ts-input is-fluid">
              <input
                type="number"
                v-model.number="quantity"
                min="1"
                :max="selectedDetail ? selectedDetail.stock : 0"
                :disabled="!isProductAvailable"
              />
            </div>
          </div>
          <!-- 商品上下架 & 如果沒有庫存 則把加入購物車按鈕鎖起來 -->
          <div class="column is-8-wide">
            <button
              class="ts-button is-fluid"
              :class="{
                'is-positive': isProductAvailable,
                'is-negative': !isProductAvailable,
              }"
              @click="addToCart"
              :disabled="!isProductAvailable || !selectedDetail"
            >
              {{ isProductAvailable ? "加入購物車" : "請選擇規格" }}
            </button>
          </div>
        </div>
        <div class="ts-box is-segment has-top-spaced-large">
          <div class="ts-content">
            <h3 class="ts-header">商品說明</h3>
            <p class="ts-text">
              {{
                selectedDetail
                  ? selectedDetail.productDescription
                  : product.productDescription
              }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import axiosapi from "@/plugins/axios.js";

const route = useRoute();
const product = ref({});
const selectedColor = ref("");
const selectedSize = ref("");
const quantity = ref(1);
const selectedDetail = ref(null);
const currentImageIndex = ref(0);

// 找到對應商品的圖片
const getImageUrl = (imageName) => {
  const path = import.meta.env.VITE_PRODUCT_IMAGE_URL;
  if (imageName) {
    return `${path}${imageName}`;
  }
  return "../../../public/No_image.png";
};

const currentImage = computed(() => {
  return product.value.pimages?.[currentImageIndex.value]?.imgUrl;
});

// 照片輪播 下一張照片
const nextImage = () => {
  currentImageIndex.value =
    (currentImageIndex.value + 1) % product.value.pimages.length;
};

// 照片輪播 上一張照片
const prevImage = () => {
  currentImageIndex.value =
    (currentImageIndex.value - 1 + product.value.pimages.length) %
    product.value.pimages.length;
};

const setCurrentImage = (index) => {
  currentImageIndex.value = index;
};

// 檢查商品庫存 與 狀態
const isProductAvailable = computed(() => {
  return (
    selectedDetail.value &&
    selectedDetail.value.stock > 0 &&
    selectedDetail.value.onSale
  );
});

// 獲取單個商品ID
onMounted(async () => {
  try {
    const response = await axiosapi.get(`/products/${route.params.id}`);
    product.value = response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
});

// 商品的顏色
const availableColors = computed(() => {
  return [
    ...new Set(
      product.value.productDetails?.map((detail) => detail.color) || []
    ),
  ];
});

// 商品的尺寸
const availableSizes = computed(() => {
  return [
    ...new Set(
      product.value.productDetails?.map((detail) => detail.size) || []
    ),
  ];
});

// 變更選項時 找尋對應的尺寸與顏色
const updateSelectedDetail = () => {
  selectedDetail.value =
    product.value.productDetails?.find(
      (detail) =>
        detail.color === selectedColor.value &&
        detail.size === selectedSize.value
    ) || null;

    // 庫存的數量去核對後端的庫存數量 & 點進商品時 數量欄位預設為1
  if (selectedDetail.value) {
    quantity.value = Math.min(quantity.value, selectedDetail.value.stock);
  } else {
    quantity.value = 1;
  }
};

// 欄位未選擇 會通知顧客要選擇商品規格 & 如果該商品沒有庫存時通知顧客商品已售鑿或下架
const addToCart = () => {
  if (!selectedDetail.value) {
    alert("請選擇商品規格");
    return;
  }
  if (!isProductAvailable.value) {
    alert("商品已售罄或下架");
    return;
  }
  // 這裡添加將商品加入購物車的邏輯
  console.log("Added to cart:", {
    productId: product.value.productId,
    productDetailsId: selectedDetail.value.productDetailsId,
    color: selectedColor.value,
    size: selectedSize.value,
    quantity: quantity.value,
  });
};
</script>

<style scoped>
.product-details {
  padding: 2rem 0;
}

.carousel-container {
  position: relative;
  overflow: hidden;
}

.main-image img {
  width: 100%;
  height: auto;
}

.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}

.carousel-button.prev {
  left: 10px;
}

.carousel-button.next {
  right: 10px;
}

.thumbnail-grid {
  margin-top: 1rem;
}

.thumbnail {
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s ease;
  width: 60px;
  height: 60px;
  overflow: hidden;
}


.thumbnail.active,
.thumbnail:hover {
  opacity: 1;
  border: 2px solid var(--ts-gray-400);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
