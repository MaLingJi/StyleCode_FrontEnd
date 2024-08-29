<template>
    <div class="ts-box">
      <h3 class="ts-header">商品詳情管理</h3>
  
      <!-- 商品選擇 -->
      <div class="ts-select is-fluid has-bottom-spaced">
        <select v-model="selectedProductId" @change="loadProductDetails">
          <option value="">選擇商品</option>
          <option v-for="product in products" :key="product.productId" :value="product.productId">
            {{ product.productName }}
          </option>
        </select>
      </div>
  
      <!-- 商品詳情列表 -->
      <div v-if="selectedProductId">
        <h4 class="ts-header">{{ selectedProduct.productName }} 的詳情</h4>
        <table class="ts-table">
          <thead>
            <tr>
              <th>顏色</th>
              <th>尺寸</th>
              <th>庫存</th>
              <th>狀態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="detail in paginatedProductDetails" :key="detail.productDetailsId">
              <td>
                <div v-if="editingDetailId === detail.productDetailsId" class="ts-input is-fluid">
                  <input v-model="editingDetail.color" placeholder="顏色" required>
                </div>
                <span v-else>{{ detail.color }}</span>
              </td>
              <td>
                <div v-if="editingDetailId === detail.productDetailsId" class="ts-input is-fluid">
                  <input v-model="editingDetail.size" placeholder="尺寸" required>
                </div>
                <span v-else>{{ detail.size }}</span>
              </td>
              <td>
                <div v-if="editingDetailId === detail.productDetailsId" class="ts-input is-fluid">
                  <input type="number" v-model="editingDetail.stock" placeholder="庫存" required>
                </div>
                <span v-else>{{ detail.stock }}</span>
              </td>
              <td>
                <div v-if="editingDetailId === detail.productDetailsId" class="ts-checkbox">
                  <input type="hidden" v-model="editingDetail.onSale" :id="'onSale' + detail.productDetailsId">
                  <label :for="'onSale' + detail.productDetailsId">{{ detail.onSale ? '上架' : '下架' }}</label>
                </div>
                <span v-else>{{ detail.onSale ? '上架' : '下架' }}</span>
              </td>
              <td>
                <template v-if="editingDetailId === detail.productDetailsId">
                  <button @click="saveDetail" class="ts-button is-small is-positive"><span class="ts-icon is-floppy-disk-icon"></span></button>
                  <button @click="cancelEdit" class="ts-button is-wide is-outlined"><span class="ts-icon is-arrow-right-from-bracket-icon"></span></button>
                </template>
                <template v-else>
                  <button @click="editDetail(detail)" class="ts-button is-small">
                    <span class="ts-icon is-pen-to-square-icon file content-main field-component-icon group-single icon-icon"></span>
                  </button>
                  <button @click="deleteDetail(detail.productDetailsId)" class="ts-button is-wide is-outlined">
                    <span class="ts-icon is-trash-can-icon"></span>
                  </button>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
  
  <br>
        <!-- 新增商品詳情表單 -->
        <form @submit.prevent="addDetail" class="has-top-spaced">
          <div class="ts-grid">
            <div class="column is-3-wide">
              <div class="ts-input is-fluid">
                <input v-model="newDetail.color" placeholder="顏色" required>
              </div>
            </div>
            <div class="column is-3-wide">
              <div class="ts-input is-fluid">
                <input v-model="newDetail.size" placeholder="尺寸" required>
              </div>
            </div>
            <div class="column is-3-wide">
              <div class="ts-input is-fluid">
                <input type="number" v-model="newDetail.stock" placeholder="庫存" required>
              </div>
            </div>
            <div class="column is-3-wide">
            </div>
          </div>
          <button type="submit" class="ts-button is-positive has-top-spaced">新增詳情</button>
        </form>
      </div>

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
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, computed } from 'vue';
  import axiosapi from '@/plugins/axios.js';
  import Paginate from 'vuejs-paginate-next';
  import Swal from 'sweetalert2'

  const products = ref([]);
  const selectedProductId = ref('');
  const selectedProduct = ref(null);
  const productDetails = ref([]);
  const editingDetailId = ref(null);
  const editingDetail = reactive({});
  const newDetail = reactive({ color: '', size: '', stock: 0, onSale: true });
  const currentPage = ref(1);
  const itemsPerPage = 5;
  
  onMounted(async () => {
    await fetchProducts();
  });
  
  const paginatedProductDetails = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return productDetails.value.slice(start, end);
  });
  
  function getPageCount() {
    return Math.ceil(productDetails.value.length / itemsPerPage);
  }
  
  function handlePageChange(page) {
    currentPage.value = page;
  }
  
  async function fetchProducts() {
    try {
      const response = await axiosapi.get('/allproducts');
      products.value = response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }
  
  async function loadProductDetails() {
    if (selectedProductId.value) {
      try {
        const response = await axiosapi.get(`/products/${selectedProductId.value}`);
        selectedProduct.value = response.data;
        productDetails.value = response.data.productDetails;
        currentPage.value = 1; // 重置頁碼
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    }
  }
  
  function editDetail(detail) {
  editingDetailId.value = detail.productDetailsId;
  editingDetail.color = detail.color;
  editingDetail.size = detail.size;
  editingDetail.stock = detail.stock;
  editingDetail.onSale = detail.onSale;
}

async function saveDetail() {
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
      await axiosapi.put(`/admin/productDetails/${editingDetailId.value}`, editingDetail);
      await loadProductDetails();
      editingDetailId.value = null;
      Swal.fire({
        title: '成功！',
        text: '修改成功！',
        icon: 'success',
        confirmButtonColor: 'rgb(35 40 44)',
        confirmButtonText: '確認'
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/backstage');
        }
      });
    } catch (error) {
      console.error('Error adding category:', error);
      Swal.fire({
        title: '錯誤',
        text: '修改失敗，請重試。',
        icon: 'error',
        confirmButtonColor: 'rgb(35 40 44)',
        confirmButtonText: '確認'
      });
    }
  }else{
    cancelEdit();
  }
  };
  
  function cancelEdit() {
    editingDetailId.value = null;
  }
  
  async function deleteDetail(detailId) {
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
        await axiosapi.delete(`/admin/productDetails/${detailId}`);
        await loadProductDetails();
        Swal.fire({
      title: '成功！',
      text: '刪除成功！',
      icon: 'success',
      confirmButtonColor: 'rgb(35 40 44)',
      confirmButtonText: '確認'
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/backstage');
      }
    });
    } catch (error) {
      console.error('Error adding category:', error);
      Swal.fire({
      title: '錯誤',
      text: '刪除失敗，請重試。',
      icon: 'error',
      confirmButtonColor: 'rgb(35 40 44)',
      confirmButtonText: '確認'
    });
  }
};
};
  async function addDetail() {
    try {
      await axiosapi.post(`/admin/${selectedProductId.value}/productDetails`, [newDetail]);
      await loadProductDetails();
      Object.assign(newDetail, { color: '', size: '', stock: 0, onSale: true });
      Swal.fire({
      title: '成功！',
      text: '新增成功！',
      icon: 'success',
      confirmButtonColor: 'rgb(35 40 44)',
      confirmButtonText: '確認'
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/backstage');
      }
    });
    } catch (error) {
      console.error('Error adding category:', error);
      Swal.fire({
      title: '錯誤',
      text: '新增失敗，請重試。',
      icon: 'error',
      confirmButtonColor: 'rgb(35 40 44)',
      confirmButtonText: '確認'
    });
  }
};
  </script>
  
  <style scoped>
  .ts-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    color: #000;
  }
  </style>