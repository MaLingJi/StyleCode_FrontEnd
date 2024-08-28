<template>
    <div class="ts-box">
      <h3 class="ts-header">子分類管理</h3>
      
      <!-- 新增子分類表單 -->
      <form @submit.prevent="addSubcategory" class="ts-form">
        <div class="ts-select is-fluid">
          <select v-model="newSubcategory.categoryId" required>
            <option value="">選擇分類</option>
            <option v-for="category in categories" :key="category.categoryId" :value="category.categoryId">
              {{ category.categoryName }}
            </option>
          </select>
        </div>
        <br>
        <br>
        <div class="ts-input is-fluid">
            <input v-model="newSubcategory.subcategoryName" placeholder="輸入新子分類名稱" required>
          <button type="submit" class="ts-button is-positive">新增子分類</button>
        </div>
      </form>
  
      <!-- 子分類列表 -->
      <table class="ts-table">
        <thead>
          <tr>
            <th>子分類名稱</th>
            <th>分類</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="subcategory in paginatedSubcategories" :key="subcategory.subcategoryId">
            <td>
              <div v-if="editingId === subcategory.subcategoryId" class="ts-input is-fluid">
                <input v-model="editingName" @keyup.enter="updateSubcategory(subcategory.subcategoryId)">
              </div>
              <span v-else>{{ subcategory.subcategoryName }}</span>
            </td>
            <td>{{ subcategory.categoryName }}</td>
            <td class="is-end-aligned">
              <button v-if="editingId === subcategory.subcategoryId" @click="updateSubcategory(subcategory.subcategoryId)" class="ts-button is-small is-positive"><span class="ts-icon is-window-restore-icon"></span></button>
              <button v-else @click="startEditing(subcategory)" class="ts-button is-small"><span class="ts-icon is-pen-to-square-icon file content-main field-component-icon group-single icon-icon"></span></button>
              <button @click="deleteSubcategory(subcategory.subcategoryId)" class="ts-button is-wide is-outlined"><span class="ts-icon is-trash-can-icon"></span></button>
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
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import axiosapi from '@/plugins/axios.js';
  import Paginate from 'vuejs-paginate-next';
  
  const subcategories = ref([]);
  const categories = ref([]);
  const newSubcategory = ref({ categoryId: '', subcategoryName: '' });
  const editingId = ref(null);
  const editingName = ref('');
  const currentPage = ref(1);
const itemsPerPage = 8;
  
  onMounted(async () => {
    await fetchCategories();
    await fetchSubcategories();
  });
  
  const paginatedSubcategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return subcategories.value.slice(start, end);
});

function getPageCount() {
  return Math.ceil(subcategories.value.length / itemsPerPage);
}

function handlePageChange(page) {
  currentPage.value = page;
}

  async function fetchCategories() {
    try {
      const response = await axiosapi.get('/categories');
      categories.value = response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }
  
  async function fetchSubcategories() {
    try {
      const response = await axiosapi.get('/subcategories');
      subcategories.value = response.data;
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  }
  
  async function addSubcategory() {
  try {
    console.log('Sending data:', newSubcategory.value); // 記錄發送的數據
    const response = await axiosapi.post('/admin/subcategories/create', {
      subcategoryName: newSubcategory.value.subcategoryName,
      category: { categoryId: newSubcategory.value.categoryId }
    });
    console.log('Response:', response.data); // 記錄響應
    newSubcategory.value = { categoryId: '', subcategoryName: '' };
    await fetchSubcategories();
    alert('新增成功。');
  } catch (error) {
    console.error('Error adding subcategory:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    // 可以在這裡添加錯誤提示給用戶
    alert('新增失敗，可能有重複的名稱。');
  }
}
  
  function startEditing(subcategory) {
    editingId.value = subcategory.subcategoryId;
    editingName.value = subcategory.subcategoryName;
  }
  
  async function updateSubcategory(id) {
    try {
      const updateData = { subcategoryName: editingName.value };
      await axiosapi.put(`/admin/subcategories/${id}`, updateData, {
        headers: { 'Content-Type': 'application/json' }
      });
      editingId.value = null;
      await fetchSubcategories();
      alert('更新成功');
    } catch (error) {
      console.error('Error updating subcategory:', error);
    }
  }
  
  async function deleteSubcategory(id) {
    if (confirm('確定要刪除這個子分類嗎？')) {
      try {
        await axiosapi.delete(`/admin/subcategories/${id}`);
        await fetchSubcategories();
      } catch (error) {
        console.error('Error deleting subcategory:', error);
      }
    }
  }
  </script>
<style>
    .ts-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  color: #000;
}
</style>