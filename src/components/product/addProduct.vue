<template>
  <div class="ts-box">
  <div class="ts-content">
    <h3 class="ts-header">新增商品</h3>
    <form @submit.prevent="submitProduct">
      <div class="ts-grid">
        <div class="column is-16-wide">
          <div class="ts-input is-fluid">
            <input type="text" v-model="product.productName" placeholder="商品名稱" required>
          </div>
        </div>
        <div class="column is-8-wide">
          <div class="ts-select is-fluid">
            <select v-model="selectedCategoryId" @change="loadSubcategories" required>
              <option value="">分類</option>
              <option v-for="category in categories" :key="category.categoryId" :value="category.categoryId">
                {{ category.categoryName }}
              </option>
            </select>
          </div>
        </div>
        <div class="column is-8-wide">
          <div class="ts-select is-fluid">
            <select v-model="product.subcategoryId" required>
              <option value="">子分類</option>
              <option v-for="subcategory in subcategories" :key="subcategory.subcategoryId" :value="subcategory.subcategoryId">
                {{ subcategory.subcategoryName }}
              </option>
            </select>
          </div>
        </div>
        <div class="column is-8-wide">
          <div class="ts-input is-fluid">
            <input type="number" v-model="product.price" placeholder="價格" required>
          </div>
        </div>
        <div class="column is-16-wide">
          <div class="ts-textarea product-description-container">
            <textarea v-model="product.productDescription" placeholder="商品描述" rows="5" 
        required
        class="product-description-textarea"></textarea>
          </div>
        </div>
      </div>

          <!-- 商品详情 -->
          <div v-for="(detail, index) in product.productDetails" :key="index" class="ts-grid has-top-spaced">
            <div class="column is-4-wide">
              <div class="ts-input is-fluid">
                <input type="text" v-model="detail.color" placeholder="顏色" required>
              </div>
            </div>
            <div class="column is-4-wide">
              <div class="ts-input is-fluid">
                <input type="text" v-model="detail.size" placeholder="尺寸" required>
              </div>
            </div>
            <div class="column is-4-wide">
              <div class="ts-input is-fluid">
                <input type="number" v-model="detail.stock" placeholder="庫存數量" required @input="updateOnSaleStatus(index)">
              </div>
            </div>

            <div class="column is-4-wide">
               <div class="ts-text">
                  狀態: {{ detail.onSale ? '上架' : '下架' }}
              </div>
            </div>

            <div class="column is-4-wide">
              <button type="button" class="ts-button is-outlined is-icon" @click="removeProductDetail(index)"><span class="ts-icon is-trash-can-icon"></span></button>
            </div>
          </div>
          <button type="button" class="ts-button is-secondary has-top-spaced" @click="addProductDetail">添加商品詳情</button>

          <!-- 图片上传 -->
          <div class="ts-grid has-top-spaced">
            <div class="column is-16-wide">
              <div class="ts-file is-large">
                <input type="file" @change="handleFileUpload" multiple accept="image/*" ref="fileInput">
              </div>
            </div>
          </div>

          <!-- 圖片預覽 -->
          <div class="ts-grid is-4-columns has-top-spaced" v-if="previewImages.length > 0">
            <div v-for="(image, index) in previewImages" :key="index" class="column">
              <div class="ts-image preview-image">
                 <img :src="image" alt="Preview" >
                 <div class="delete-overlay" @click.stop="removeImage(index)">
                    <span class="delete-text">點擊刪除</span>
                </div>
          </div>
        </div>
      </div>

          <div class="ts-grid has-top-spaced">
            <div class="column is-16-wide">
              <button type="submit" class="ts-button is-positive is-fluid">新增商品</button>
            </div>
          </div>
        </form>
      </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axiosapi from '@/plugins/axios.js';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2'
import useUserStore from "@/stores/user.js";

const userStore = useUserStore();
const router = useRouter();
const categories = ref([]);
const subcategories = ref([]);
const selectedCategoryId = ref('');
const product = reactive({
  productName: '',
  price: null,
  subcategoryId: '',
  productDescription: '',
  productDetails: [{ color: '', size: '', stock: null }]
});

const previewImages = ref([]);
const files = ref([]);
const fileInput = ref(null);

onMounted(async () => {
  try {
    const response = await axiosapi.get('/categories');
    categories.value = response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
});

const loadSubcategories = async () => {
  if (selectedCategoryId.value) {
    try {
      const response = await axiosapi.get(`/subcategories/categories/${selectedCategoryId.value}`);
      subcategories.value = response.data;
      product.subcategoryId = ''; // Reset subcategory selection
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  } else {
    subcategories.value = [];
    product.subcategoryId = '';
  }
};

const addProductDetail = () => {
  product.productDetails.push({ color: '', size: '', stock: null, onSale: false });
};

const removeProductDetail = (index) => {
  product.productDetails.splice(index, 1);
};

const updateOnSaleStatus = (index) => {
  const detail = product.productDetails[index];
  detail.onSale = detail.stock > 0;
};

const handleFileUpload = (event) => {
  const newFiles = Array.from(event.target.files);
  files.value = [...files.value, ...newFiles];
  
  for (let i = 0; i < newFiles.length; i++) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImages.value.push(e.target.result);
    };
    reader.readAsDataURL(newFiles[i]);
  }
};

const removeImage = (index) => {
  console.log('Removing image at index:', index);
  previewImages.value.splice(index, 1);
  files.value.splice(index, 1);
  resetFileInput();
};

const resetFileInput = () => {
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const submitProduct = async () => {
  try {
    // 创建商品
    const productData = {
      ...product,
      subcategoryId: { subcategoryId: product.subcategoryId }
    };
    const response = await axiosapi.post('/admin/products/create', productData,{
      headers: { Authorization: `Bearer ${userStore.userToken}` }
    }
    );
    
    console.log("Response:", response);
    const createdProductId = response.data.productId;

    // 上传图片
    if (files.value.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < files.value.length; i++) {
        formData.append('file', files.value[i]);
      }
      await axiosapi.post(`/admin/products/images/${createdProductId}/multiple`, formData, {
        headers: { 'Content-Type': 'multipart/form-data'}
      });
    }

    Swal.fire({
      title: '成功！',
      text: '商品新增成功！',
      icon: 'success',
      confirmButtonText: '確認',
      confirmButtonColor: 'rgb(35 40 44)',
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/shop');
      }
    });
  } catch (error) {
   handleApiError(error, '新增失敗，請重試。');
  }
};
const resetForm = () => {
  Object.keys(product).forEach(key => {
    if (key === 'productDetails') {
      product[key] = [{ color: '', size: '', stock: null }];
    } else {
      product[key] = '';
    }
  });
  selectedCategoryId.value = '';
  subcategories.value = [];
  files.value = [];
  previewImages.value = [];
};

function handleApiError(error, defaultMessage) {
  console.error('API Error:', error);
  let errorMessage = defaultMessage;

  if (error.response) {
    if (error.response.status === 403) {
      errorMessage = '您沒有權限執行此操作';
      router.push('/secure/login');
    } else if (error.response.data && error.response.data.message) {
      errorMessage = "操作失敗";
    }
  }

  Swal.fire({
    title: '錯誤',
    text: errorMessage,
    icon: 'error',
    confirmButtonColor: 'rgb(35 40 44)',
    confirmButtonText: '確認'
  });
}
</script>

<style scoped>
.ts-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.preview-image {
  position: relative;
  cursor: pointer;
}

.delete-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.preview-image:hover .delete-overlay {
  opacity: 1;
}
.ts-textarea{
  border-width: 30px;
}

.product-description-container {
  width: 100%;
  max-width: 1000px; /* 調整這個值以匹配您表單的寬度 */
  margin: 0 auto;
}

.product-description-textarea {
  width: 100%;
  min-height: 100px; /* 調整高度以匹配約 4-5 行文字 */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical; /* 允許用戶垂直調整大小 */
}

/* 響應式設計 */
@media (max-width: 768px) {
  .product-description-container {
    max-width: 100%;
  }
}

</style>