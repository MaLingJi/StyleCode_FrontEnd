<template>
  <div class="ts-container product-details">
    <div class="ts-grid desktop-layout">
      <div class="column is-7-wide">
        <!-- 照片輪播 -->
        <div class="carousel-container">
          <!-- 主要圖片展示 -->
          <transition name="fade" mode="out-in">
            <div class="ts-image main-image" :key="currentImageIndex" @click="openLightbox(currentImageIndex)">
              <!-- 當前圖片 -->
              <img :src="getImageUrl(currentImage)" :alt="product.productName" />
            </div>
          </transition>
          <!-- 照片輪播按鈕，往前一張或下一張 -->
          <button class="carousel-button prev" @click="prevImage">&lt;</button>
          <button class="carousel-button next" @click="nextImage">&gt;</button>
        </div>

        <!-- 縮略圖顯示，點擊可選擇對應的圖片 -->
        <div class="ts-grid thumbnail-grid">
          <div class="column is-2-wide" v-for="(image, index) in product.pimages" :key="index">
            <div class="ts-image thumbnail" @click="setCurrentImage(index)"
              :class="{ active: currentImageIndex === index }">
              <img :src="getImageUrl(image.imgUrl)" :alt="product.productName" />
            </div>
          </div>
        </div>
      </div>
      <!-- 商品信息展示，包括選擇顏色、尺寸、庫存檢查等 -->
      <div class="column is-9-wide product-info">
        <h1 class="ts-header is-huge">{{ product.productName }}</h1>
        <p class="ts-text is-large price">
          NT$ {{ selectedDetail ? selectedDetail.price : " " }}
        </p>
        <div class="ts-divider"></div>
        <!-- 顏色和尺寸選擇 -->
    <div class="full-width-container">
      <div class="ts-select is-fluid" style="margin: 0px 0px 15px 0px ;">
        <select v-model="selectedColor" @change="updateSelectedDetail">
          <option value="">請選擇顏色</option>
          <option v-for="color in availableColors" :key="color" :value="color">
            {{ color }}
          </option>
        </select>
      </div>
    </div>
    <div class="full-width-container">
      <div class="ts-select is-fluid">
        <select v-model="selectedSize" @change="updateSelectedDetail">
          <option value="">請選擇尺寸</option>
          <option v-for="size in availableSizes" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>
    </div>
        <!-- 想購買的數量 & 檢查庫存是否足夠 -->
        <div class="ts-grid has-top-spaced">
          <div class="column is-8-wide">
            <div class="ts-input is-fluid">
              <!-- 購買數量輸入框，根據庫存情況設定最大值 -->
              <input type="number" v-model.number="quantity" :min="1" :max="selectedDetail ? selectedDetail.stock : 0"
                :disabled="!isProductAvailable" />
            </div>
          </div>
          <!-- 商品上下架 & 如果沒有庫存 則把加入購物車按鈕鎖起來 -->
          <div class="column is-8-wide">
            <button class="ts-button is-fluid" :class="{
              'is-positive': isProductAvailable,
              'is-gray': !isProductAvailable,
            }" @click="addToCart" :disabled="!isProductAvailable || !selectedDetail">
              {{ buttonText }}
            </button>
          </div>
        </div>
        <!-- 商品描述區域 -->
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


   <!-- 移動版佈局 -->
   <div class="mobile-layout">
      <!-- 照片輪播 -->
      <div class="carousel-container" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
        <div class="ts-image main-image" @click="openLightbox(currentImageIndex)">
          <img :src="getImageUrl(currentImage)" :alt="product.productName" />
        </div>
        <!-- 移除箭頭按鈕 -->
      </div>

      <!-- 照片導航點 -->
      <div class="carousel-dots">
        <span v-for="(image, index) in product.pimages" :key="index" 
              :class="['dot', { active: currentImageIndex === index }]"
              @click="setCurrentImage(index)">
        </span>
      </div>

      <h1 class="ts-header is-large">{{ product.productName }}</h1>
      <p class="ts-text is-large price">
        NT$ {{ product.price }}
      </p>

       <!-- 顏色和尺寸選擇 -->
    <div class="ts-grid full-width-grid">
      <div class="column is-full">
        <div class="ts-select is-fluid">
          <select v-model="selectedColor" @change="updateSelectedDetail">
            <option value="">請選擇顏色</option>
            <option v-for="color in availableColors" :key="color" :value="color">
              {{ color }}
            </option>
          </select>
        </div>
      </div>
      <div class="column is-full">
        <div class="ts-select is-fluid">
          <select v-model="selectedSize" @change="updateSelectedDetail">
            <option value="">請選擇尺寸</option>
            <option v-for="size in availableSizes" :key="size" :value="size">
              {{ size }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- 商品描述 -->
    <div class="ts-box is-segment">
      <div class="ts-content">
        <h3 class="ts-header">商品說明</h3>
        <p class="ts-text">
          {{ selectedDetail ? selectedDetail.productDescription : product.productDescription }}
        </p>
      </div>
    </div>

    <!-- 數量選擇和加入購物車 -->
    <div class="full-width-container">
      <div class="quantity-input">
        <button @click="decreaseQuantity" :disabled="quantity <= 1 || !isProductAvailable" class="quantity-btn">-</button>
        <input type="number" v-model.number="quantity" :min="1" :max="selectedDetail ? selectedDetail.stock : 0"
          :disabled="!isProductAvailable" readonly />
        <button @click="increaseQuantity" :disabled="quantity >= (selectedDetail ? selectedDetail.stock : 0) || !isProductAvailable" class="quantity-btn">+</button>
      </div>
    </div>
    <div class="full-width-container">
      <button class="ts-button is-fluid" :class="{
        'is-positive': isProductAvailable,
        'is-gray': !isProductAvailable,
      }" @click="addToCart" :disabled="!isProductAvailable || !selectedDetail">
        {{ buttonText }}
      </button>
    </div>
  </div>

    <!-- Lightbox 組件，顯示點擊的圖片 -->
    <div v-if="lightboxVisible" class="lightbox" @click="closeLightbox">
      <div class="lightbox-content" @click.stop>
        <img :src="getImageUrl(currentLightboxImage)" :alt="product.productName" />
        <!-- Lightbox 關閉按鈕 -->
        <button class="lightbox-close" @click="closeLightbox">&times;</button>
        <!-- Lightbox 上一張圖片按鈕 -->
        <button class="lightbox-prev" @click="prevLightboxImage">&lt;</button>
        <!-- Lightbox 下一張圖片按鈕 -->
        <button class="lightbox-next" @click="nextLightboxImage">&gt;</button>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import axiosapi from "@/plugins/axios.js";
import useUserStore from "@/stores/user.js"
import Swal from "sweetalert2";
import { useRouter } from 'vue-router';
import { useCart } from '@/services/cartService';

const userStore = useUserStore();
const { fetchCartCount } = useCart();
const route = useRoute(); // 使用 vue-router 獲取當前路由
const product = ref({}); // 用於存儲產品數據
const selectedColor = ref(""); // 存儲選擇的顏色
const selectedSize = ref(""); // 存儲選擇的尺寸
const quantity = ref(1); // 存儲購買數量，預設為 1
const selectedDetail = ref(null); // 存儲選中的商品詳細信息
const currentImageIndex = ref(0); // 存儲當前顯示的圖片索引
const user = useUserStore().userId // 從 Pinia 中獲取當前用戶 ID
const router = useRouter();

// 獲取圖片的完整 URL
const getImageUrl = (imageName) => {
  const path = import.meta.env.VITE_PRODUCT_IMAGE_URL;
  if (imageName) {
    return `${path}${imageName}`;
  }
  return "../../../public/No_image.png"; // 若無圖片則返回預設圖片
};

// 計算當前顯示的圖片 URL
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

// 設定當前顯示的圖片索引
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

// 監聽 selectedDetail 的變化
watch(selectedDetail, (newDetail) => {
  if (newDetail) {
    // 確保數量至少為1，最多為庫存量
    quantity.value = Math.max(1, Math.min(quantity.value, newDetail.stock));
  } else {
    quantity.value = 1; // 如果沒有選中商品，將數量重置為1
  }
});

// 在組件掛載時，根據商品 ID 獲取商品詳細信息
onMounted(async () => {
  try {
    const response = await axiosapi.get(`/products/${route.params.id}`);
    product.value = response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
});

// 獲取可選擇的顏色
const availableColors = computed(() => {
  return [
    // Set 是 JavaScript 中的一種數據結構，它只儲存唯一值。這裡使用 new Set(...) 來過濾掉重複的顏色，確保每種顏色只出現一次。
    ...new Set(
      // map 方法從 productDetails 數組中提取每個商品詳細信息的 color 屬性。map 會返回一個新數組，其中包含所有商品的顏色。
      product.value.productDetails?.map((detail) => detail.color) || []
    ), // (?.) 是可選鏈操作符，確保在 productDetails 為 undefined 或 null 的情況下不會導致錯誤，而是返回 undefined。
  ];// 如果 productDetails 是 undefined 或 null，則使用 || [] 返回一個空數組，以避免後續操作出現錯誤。
});

// 獲取可選擇的尺寸
const availableSizes = computed(() => {
  return [
    ...new Set(
      product.value.productDetails?.map((detail) => detail.size) || []
    ),
  ];
});

// 當顏色或尺寸變更時，更新選擇的商品詳細信息
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

const buttonText = computed(() => {
  if (!selectedColor.value || !selectedSize.value) {
    return "請選擇顏色和尺寸";
  } else if (!selectedDetail.value) {
    return "所選規格無庫存";
  } else if (selectedDetail.value.stock === 0) {
    return "商品已售罄";
  } else if (!selectedDetail.value.onSale) {
    return "商品已下架";
  } else {
    return "加入購物車";
  }
});

// 欄位未選擇 會通知顧客要選擇商品規格 & 如果該商品沒有庫存時通知顧客商品已售鑿或下架
const addToCart = () => {
  if (!selectedDetail.value || selectedDetail.value.stock === 0) {
    alert("請選擇商品規格");
    return;
  }
  if (!isProductAvailable.value) {
    alert("商品已售罄或下架");
    return;
  }
  if (!isProductAvailable.value) {
    let message = buttonText.value;
    if (message === "加入購物車") {
      message = "無法加入購物車，請稍後再試";
    }
    Swal.fire({
      icon: 'warning',
      title: '無法加入購物車',
      text: message,
      showConfirmButton: false,
      timer: 1500
    });
    return;
  }

  if (!user) {
    Swal.fire({
      title: '請先登入',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(35 40 44)',
      cancelButtonColor: '#9e9e9e',
      confirmButtonText: '登入',
      cancelButtonText: '再看一下'
    }).then((result) => {
      if (result.isConfirmed) {
        setTimeout(() => { router.push('/secure/login') }, 1000)
      }
    });
    return;
  }

  axiosapi.post('/member/cart/add', {
    "userId": user,
    "productDetailsId": selectedDetail.value.productDetailsId,
    "quantity": quantity.value
  }).then(response => {
    if (response.data != '') {
      Swal.fire({
        icon: 'success',
        title: '成功加入購物車',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      })
      fetchCartCount(userStore.userId);
    } else {
      Swal.fire({
        icon: 'error',
        title: '加入購物車失敗',
        text: '庫存不足',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      })
    }
  })
    .catch(
      error => {
        Swal.fire({
          icon: 'error',
          title: '加入購物車失敗',
          text: '庫存不足',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
        })
        console.error(error)
      }
    )
};

// Lightbox 相關狀態
const lightboxVisible = ref(false); // 控制 Lightbox 的顯示與否
const currentLightboxIndex = ref(0); // Lightbox 中當前顯示的圖片索引

// 開啟 Lightbox
const openLightbox = (index) => {
  currentLightboxIndex.value = index;
  lightboxVisible.value = true;
};

// 關閉 Lightbox
const closeLightbox = () => {
  lightboxVisible.value = false;
};

// 切換到上一張 Lightbox 圖片
const prevLightboxImage = () => {
  currentLightboxIndex.value = (currentLightboxIndex.value - 1 + product.value.pimages.length) % product.value.pimages.length;
};

// 切換到下一張 Lightbox 圖片
const nextLightboxImage = () => {
  currentLightboxIndex.value = (currentLightboxIndex.value + 1) % product.value.pimages.length;
};

// 計算當前 Lightbox 顯示的圖片 URL
const currentLightboxImage = computed(() => {
  return product.value.pimages?.[currentLightboxIndex.value]?.imgUrl;
});

//響應式
let touchStartX = 0;
let touchEndX = 0;

const touchStart = (e) => {
  touchStartX = e.touches[0].clientX;
};

const touchMove = (e) => {
  touchEndX = e.touches[0].clientX;
};

const touchEnd = () => {
  if (touchStartX - touchEndX > 50) {
    // 向左滑動
    nextImage();
  } else if (touchEndX - touchStartX > 50) {
    // 向右滑動
    prevImage();
  }
};

// 添加數量增減函數
const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const increaseQuantity = () => {
  if (selectedDetail.value && quantity.value < selectedDetail.value.stock) {
    quantity.value++;
  }
};



</script>

<style scoped>
.product-details {
  padding: 2rem 0;
  /* 商品詳情頁面的內邊距 */
}

.carousel-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  /* 照片輪播區域的最大寬度 */
  margin: 0 auto;
}

.main-image {
  width: 100%;
  padding-bottom: 100%;
  /* 保持圖片比例 */
  position: relative;
  overflow: hidden;
}

.main-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 圖片覆蓋容器，保持比例 */
}

/* 桌面版佈局 */
.desktop-layout {
  display: flex;
}

/* 移動版佈局 */
.mobile-layout {
  display: none;
}

/* 添加新的樣式 */
.carousel-dots {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.dot {
  height: 8px;
  width: 8px;
  margin: 0 4px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  transition: background-color 0.6s ease;
}

.dot.active {
  background-color: #717171;
}

/* 修改數量輸入框樣式 */
.quantity-input input {
  -webkit-appearance: none;
  -moz-appearance: textfield;
  appearance: none;
  margin: 0;
  text-align: center;
  width: 50px;
  border: none;
  background: transparent;
}


.quantity-input {
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-input input::-webkit-inner-spin-button, 
.quantity-input input::-webkit-outer-spin-button { 
  -webkit-appearance: none;
  margin: 0; 
}

.quantity-btn {
  background-color: #f0f0f0;
  border: none;
  color: #333;
  font-size: 18px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.quantity-btn:hover {
  background-color: #e0e0e0;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  z-index: 10;
  text-decoration: none;
}

.carousel-button.prev {
  left: 10px;
  /* 上一張按鈕的位置 */
}

.carousel-button.next {
  right: 10px;
  /* 下一張按鈕的位置 */
}

.thumbnail-grid {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  /* 縮略圖居中 */
}

.thumbnail {
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s ease;
  width: 60px;
  height: 60px;
  overflow: hidden;
  margin: 0 5px;
}


.thumbnail.active,
.thumbnail:hover {
  opacity: 1;
  border: 2px solid var(--ts-gray-400);
  /* 選中或懸停時的邊框樣式 */
}


.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 縮略圖覆蓋容器，保持比例 */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.ts-box.is-segment {
  margin-top: 2rem;
}

.ts-table {
  width: 100%;
  margin-top: 1rem;
}

.ts-image img {
  max-width: 100%;
  height: auto;
  margin-top: 1rem;
  object-fit: cover;
}

/* Lightbox 樣式 */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* 背景半透明 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.lightbox-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  
}

.lightbox-content img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  /* Lightbox 圖片保持比例 */
}

.lightbox-close,
.lightbox-prev,
.lightbox-next {
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 24px;
  text-decoration: none;
}

.lightbox-close:hover,
.lightbox-prev:hover,
.lightbox-next:hover {
  text-decoration: none; /* Ensure no underline on hover */
  background: rgba(0, 0, 0, 0.7); /* Darken background slightly on hover for better UX */
}


.lightbox-close {
  top: 10px;
  right: 10px;
  /* 關閉按鈕的位置 */
}

.lightbox-prev {
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
}

.lightbox-next {
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
}

/* 使主圖片可點擊 */
.main-image {
  cursor: pointer;
}


/* 更新移動版樣式 */
@media (max-width: 768px) {
  .desktop-layout {
    display: none;
  }

  .mobile-layout {
    display: block;
    padding: 0 1rem;
  }

  .full-width-container {
    margin-left: -1rem;
    margin-right: -1rem;
    width: calc(100% + 2rem);
    padding: 0.5rem 1rem;
  }

  .ts-select,
  .ts-button {
    width: 100%;
    margin-bottom: 1rem;
  }

  .quantity-input {
    display: flex;
    width: 100%;
    margin-bottom: 1rem;
  }

  .quantity-btn {
    flex: 1;
    height: 40px;
    font-size: 20px;
    background-color: #f0f0f0;
    border: none;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .quantity-btn:hover {
    background-color: #e0e0e0;
  }

  .quantity-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .quantity-input input {
    flex: 2;
    text-align: center;
    font-size: 18px;
    -webkit-appearance: none;
    -moz-appearance: textfield;
    appearance: none;
    margin: 0;
    border: none;
    background: transparent;
  }

  .quantity-input input::-webkit-inner-spin-button, 
  .quantity-input input::-webkit-outer-spin-button { 
    -webkit-appearance: none;
    margin: 0; 
  }

  .ts-button {
    height: 50px;
    font-size: 18px;
  }

  .ts-box.is-segment {
    margin-left: -1rem;
    margin-right: -1rem;
    width: calc(100% + 2rem);
    border-left: none;
    border-right: none;
  }
}
</style>