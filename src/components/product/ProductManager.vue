<template>
    <div class="ts-box">
      <h3 class="ts-header">商品管理</h3>
  
      <!-- 商品列表 -->
      <table class="ts-table">
        <thead>
          <tr>
            <th>商品名稱</th>
            <th>價格</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in paginatedProducts" :key="product.productId">
            <td>{{ product.productName }}</td>
            <td>{{ product.price }}</td>
            <td>
              <button @click="editProduct(product)" class="ts-button is-small"><span class="ts-icon is-pen-to-square-icon file content-main field-component-icon group-single icon-icon"></span></button>
              <button @click="deleteProduct(product.productId)" class="ts-button is-wide is-outlined"><span class="ts-icon is-trash-can-icon"></span></button>
            </td>
          </tr>
        </tbody>
      </table>
  
     <!-- 分頁元件 -->
     <div class="ts-pagination is-secondary">
      <Paginate 
        v-model="currentPage" 
        :page-count="getPageCount()" 
        :page-range="3" 
        :margin-pages="1"
        :click-handler="handlePageChange" 
        :prev-text="''" 
        :next-text="''" 
        :prev-class="'item'"
        :next-class="'item'" 
        :prev-link-class="'item is-back'"
        :next-link-class="'item is-next'" 
        :container-class="'ts-pagination'"
        :page-class="'item'" 
        :active-class="'is-active'" 
        :first-last-button="true"
        :first-button-text="'第一頁'"
        :last-button-text="'最後一頁'"
        :first-button-class="'item is-first'"
        :last-button-class="'item is-last'"
      />
    </div>

      <!-- 編輯商品模態框 -->
      <div v-if="editingProduct" class="ts-modal is-active">
        <div class="ts-modal-content">
          <h4 class="ts-header">編輯商品</h4>
          <form @submit.prevent="updateProduct">
            <div class="ts-input is-fluid">
              <input v-model="editingProduct.productName" placeholder="商品名稱" required>
            </div>
            <div class="ts-input is-fluid">
              <input type="number" v-model="editingProduct.price" placeholder="價格" required>
            </div>
            <div class="ts-textarea">
              <textarea v-model="editingProduct.productDescription" placeholder="商品描述" rows="4" required></textarea>
            </div>
  
            <!-- 商品照片管理 -->
            <h5>商品照片</h5>
          <div class="ts-grid is-4-columns">
            <div v-for="image in productImages" :key="image.imageId" class="column">
              <div class="ts-image preview-image">
                <img :src="getImageUrl(image.imgUrl)" :alt="image.imageName">
                <div class="delete-overlay" @click="deleteImage(image.imageId)">
                  <span class="delete-text">點擊刪除</span>
                </div>
              </div>
            </div>
          </div>
          <div class="ts-content has-top-spaced ts-file ">
            <input type="file" @change="addImage" accept="image/*" multiple>
          </div>
          <button type="submit" class="ts-button is-positive">儲存  </button>
          <button @click="closeEditModal" class="ts-button is-outlined">取消</button>
        </form>
      </div>
    </div>
  </div>
  </template>
  
  <script setup>
  import { ref, onMounted , computed } from 'vue';
  import axiosapi from '@/plugins/axios.js';
  import Paginate from 'vuejs-paginate-next';
  import Swal from 'sweetalert2'
  import useUserStore from "@/stores/user.js";
  import { useRouter } from 'vue-router';

  const userStore = useUserStore();
  const router = useRouter();
  const products = ref([]);
  const editingProduct = ref(null);
  const productImages = ref([]);
  const currentPage = ref(1);
  const itemsPerPage = 9;
  
  onMounted(async () => {
    await fetchProducts();
  });
  
  async function fetchProducts() {
    try {
      const response = await axiosapi.get('/allproducts');
      products.value = response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }
  
//   分頁功能
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return products.value.slice(start, end);
});

function getPageCount() {
  return Math.ceil(products.value.length / itemsPerPage);
}

function handlePageChange(page) {
  currentPage.value = page;
}


  async function editProduct(product) {
    editingProduct.value = { ...product };
    await fetchProductImages(product.productId);
  }
  
  async function updateProduct() {

    const result = await Swal.fire({
    title: '確定要修改這個商品嗎？',
    text: "此操作無法撤銷！",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: 'rgb(35 40 44)',
    cancelButtonColor: '#9e9e9e',
    confirmButtonText: '是的，修改它！',
    cancelButtonText: '取消'
  });
  if(result.isConfirmed){

    
    try {
      // 創建一個新對象，只包含需要更新的字段
      const updateData = {
        productName: editingProduct.value.productName,
        price: editingProduct.value.price,
        productDescription: editingProduct.value.productDescription,
        productImages: editingProduct.value.productImages
        // 如果需要，可以添加其他字段
      };
      
      await axiosapi.put(`/admin/products/${editingProduct.value.productId}`, updateData,{
        headers: { Authorization: `Bearer ${userStore.userToken}` }
      });
      await fetchProducts();
      closeEditModal();
      Swal.fire({
        title: '成功！',
        text: '修改成功！',
        icon: 'success',
        confirmButtonColor: 'rgb(35 40 44)',
        confirmButtonText: '確認'
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('backstage');
        }
      });
    } catch (error) {
      handleApiError(error, '修改失敗，請重試。');
    }
  }else{
    cancelEdit();
  }

  };
  function cancelEdit(){
    editingProduct.value = null;
  }
  
  function closeEditModal() {
    editingProduct.value = null;
    productImages.value = [];
  }
  
  async function deleteProduct(productId) {
    const result = await Swal.fire({
    title: '確定要刪除這個商品嗎？',
    text: "此操作無法撤銷！",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: 'rgb(35 40 44)',
    cancelButtonColor: '#9e9e9e',
    confirmButtonText: '是的，刪除它！',
    cancelButtonText: '取消'
  });
    if (result.isConfirmed) {
      try {
        await axiosapi.delete(`/admin/products/${productId}`,{
          headers: { Authorization: `Bearer ${userStore.userToken}` }
        });
        await fetchProducts();
        Swal.fire({
      title: '成功！',
      text: '刪除成功！',
      icon: 'success',
      confirmButtonColor: 'rgb(35 40 44)',
      confirmButtonText: '確認'
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('backstage');
      }
    });
    } catch (error) {
      handleApiError(error, '刪除失敗，請重試。');
  }
}
};
  
  async function fetchProductImages(productId) {
    try {
      const response = await axiosapi.get(`/${productId}/images`);
      productImages.value = response.data;
    } catch (error) {
      console.error('Error fetching product images:', error);
    }
  }
  
  function getImageUrl(imgUrl) {
    return `${import.meta.env.VITE_PRODUCT_IMAGE_URL}${imgUrl}`;
  }
  
  async function deleteImage(imageId) {
      try {
        await axiosapi.delete(`/admin/products/images/${editingProduct.value.productId}/${imageId}`,{
          headers: { Authorization: `Bearer ${userStore.userToken}` }
        });
        await fetchProductImages(editingProduct.value.productId);
      } catch (error) {
        handleApiError(error, '失敗，請重試。');
      }
  }
  
  async function addImage(event) {
    const files = event.target.files;
    if (files.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
      }
      try {
        await axiosapi.post(`/admin/products/images/${editingProduct.value.productId}/multiple`, formData, {
          headers: { 'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${userStore.userToken}`}
        });

        await fetchProductImages(editingProduct.value.productId);
      } catch (error) {
        handleApiError(error, '失敗，請重試。');
      }
    }
  }


  function handleApiError(error, defaultMessage) {
  console.error('API Error:', error);
  let errorMessage = defaultMessage;

  if (error.response) {
    if (error.response.status === 403) {
      errorMessage = '您沒有權限執行此操作';
      router.push('/secure/login');
    } else if (error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
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
  height: 200px;
  object-fit: cover;
}

.preview-image {
  position: relative;
  overflow: hidden;
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
  cursor: pointer;
}

.preview-image:hover .delete-overlay {
  opacity: 1;
}

.delete-text {
  font-size: 14px;
  font-weight: bold;
}

.ts-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  color: #000;
}
</style>