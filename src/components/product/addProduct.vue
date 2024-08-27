<template>
  <div class="ts-container">
    <div class="ts-box">
      <div class="ts-content">
        <h3 class="ts-header">新增商品</h3>
        <form @submit.prevent="submitProduct">
          <!-- 商品基本信息 -->
          <div class="ts-grid">
            <div class="column is-16-wide">
              <div class="ts-input is-fluid">
                <input type="text" v-model="product.productName" placeholder="商品名稱" required>
              </div>
            </div>
            <div class="column is-8-wide">
              <div class="ts-input is-fluid">
                <input type="number" v-model="product.price" placeholder="價格" required>
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
            <div class="column is-16-wide">
              <div class="ts-textarea">
                <textarea v-model="product.productDescription" placeholder="商品描述" rows="4" required></textarea>
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
                <input type="text" v-model="detail.size" placeholder="尺寸 S-M-L" required>
              </div>
            </div>
            <div class="column is-4-wide">
              <div class="ts-input is-fluid">
                <input type="number" v-model="detail.stock" placeholder="庫存數量" required>
              </div>
            </div>
            <div class="column is-4-wide">
              <div class="ts-checkbox">
                <input type="checkbox" v-model="detail.onSale" :id="'onSale' + index">
                <label :for="'onSale' + index">上架</label>
              </div>
            </div>
          </div>
          <button type="button" class="ts-button is-secondary has-top-spaced" @click="addProductDetail">添加商品</button>

          <!-- 图片上传 -->
          <div class="ts-grid has-top-spaced">
            <div class="column is-16-wide">
              <div class="ts-input">
                <input type="file" @change="handleFileUpload" multiple accept="image/*">
              </div>
            </div>
          </div>

          <!-- 图片预览 -->
          <div class="ts-grid is-4-columns has-top-spaced" v-if="previewImages.length > 0">
            <div v-for="(image, index) in previewImages" :key="index" class="column">
              <div class="ts-image">
                <img :src="image" alt="Preview">
              </div>
            </div>
          </div>

          <div class="ts-grid has-top-spaced">
            <div class="column is-8-wide">
              <button type="submit" class="ts-button is-positive is-fluid">新增商品</button>
            </div>
            <div class="column is-8-wide">
              <button type="button" class="ts-button is-negative is-fluid" @click="cancelCreation">取消</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axiosapi from '@/plugins/axios.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const categories = ref([]);
const subcategories = ref([]);
const selectedCategoryId = ref('');
const product = reactive({
  productName: '',
  price: null,
  subcategoryId: '',
  productDescription: '',
  productDetails: [{ color: '', size: '', stock: null, onSale: false }]
});

const previewImages = ref([]);
const files = ref([]);

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

const handleFileUpload = (event) => {
  files.value = event.target.files;
  previewImages.value = [];
  for (let i = 0; i < files.value.length; i++) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImages.value.push(e.target.result);
    };
    reader.readAsDataURL(files.value[i]);
  }
};

const submitProduct = async () => {
  try {
    // 创建商品
    const response = await axiosapi.post('/admin/products/create', product);
    const createdProductId = response.data.productId;

    // 上传图片
    if (files.value.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < files.value.length; i++) {
        formData.append('file', files.value[i]);
      }
      await axiosapi.post(`/admin/products/images/${createdProductId}/multiple`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }

    alert('商品创建成功！');
    router.push('/backstage'); // 假设后台路径是 '/admin/dashboard'
  } catch (error) {
    console.error('Error creating product:', error);
    alert('创建商品失败，请重试。');
  }
};

const cancelCreation = () => {
  router.push('/backstage'); // 假设后台路径是 '/admin/dashboard'
};

const resetForm = () => {
  Object.keys(product).forEach(key => {
    if (key === 'productDetails') {
      product[key] = [{ color: '', size: '', stock: null, onSale: false }];
    } else {
      product[key] = '';
    }
  });
  selectedCategoryId.value = '';
  subcategories.value = [];
  files.value = [];
  previewImages.value = [];
};
</script>

<style scoped>
.ts-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
}
</style>