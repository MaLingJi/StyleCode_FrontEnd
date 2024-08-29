<template>
    <div class="ts-box">
      <h3 class="ts-header">分類管理</h3>
      
      <!-- 新增分類表單 -->
      <form @submit.prevent="addCategory" class="ts-form">
        <div class="ts-input is-fluid">
          <input v-model="newCategory" placeholder="輸入新分類名稱" required>
          <button type="submit" class="ts-button is-positive">新增分類</button>
        </div>
      </form>
  
      <!-- 分類列表 -->
      <table class="ts-table">
        <thead>
          <tr>
            <th >分類名稱</th>
            <th >操作</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="category in paginatedCategories" :key="category.categoryId" >
            <td>
              <div v-if="editingId === category.categoryId" class="ts-input is-fluid">
                <input v-model="editingName" @keyup.enter="updateCategory(category.categoryId)">
              </div>
              <span v-else>{{ category.categoryName }}</span>
            </td>
            <td  class="is-end-aligned">
              <button v-if="editingId === category.categoryId" @click="updateCategory(category.categoryId)" class="ts-button is-small is-positive"><span class="ts-icon is-floppy-disk-icon"></span></button>
              <button v-else @click="startEditing(category)" class="ts-button is-small"><span class="ts-icon is-pen-to-square-icon file content-main field-component-icon group-single icon-icon"></span></button>
              <button @click="deleteCategory(category.categoryId)" class="ts-button is-wide is-outlined"><span class="ts-icon is-trash-can-icon"></span></button>
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
  import { ref, onMounted, computed} from 'vue';
  import axiosapi from '@/plugins/axios.js';
  import Paginate from 'vuejs-paginate-next';
  import Swal from 'sweetalert2'
  
  const categories = ref([]);
  const newCategory = ref('');
  const editingId = ref(null);
  const editingName = ref('');
  const currentPage = ref(1);
  const itemsPerPage = 8;
  
  onMounted(async () => {
    await fetchCategories();
  });
  
  const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return categories.value.slice(start, end);
});

function getPageCount() {
  return Math.ceil(categories.value.length / itemsPerPage);
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
  
  async function addCategory() {
    try {
      await axiosapi.post('/admin/categories/create', { categoryName: newCategory.value });
      newCategory.value = '';
      await fetchCategories();
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

  function startEditing(category) {
    editingId.value = category.categoryId;
    editingName.value = category.categoryName;
}

async function updateCategory(id) {

  const result = await Swal.fire({
    title: '確定要修改這個分類嗎？',
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
      // 將分類名稱包裝在一個對象中
      const updateData = { categoryName: editingName.value };
      // 發送 PUT 請求，包含完整的請求體
      await axiosapi.put(`/admin/categories/${id}`, updateData, {
        
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      editingId.value = null;
      await fetchCategories();
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
  editingId.value = null;
  editingName.value = '';
}
  
  async function deleteCategory(id) {

    const result = await Swal.fire({
    title: '確定要刪除這個分類嗎？',
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
        await axiosapi.delete(`/admin/categories/${id}`);
        await fetchCategories();
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
    console.error('Error creating product:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }

    // 使用 SweetAlert2 顯示錯誤信息
    Swal.fire({
      title: '錯誤',
      text: '刪除失敗，請重試。',
      icon: 'error',
      confirmButtonColor: 'rgb(35 40 44)',
      confirmButtonText: '確認'
    });
  }
};
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