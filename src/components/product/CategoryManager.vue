<template>
      <h3 class="ts-header" style="margin: 10px;">分類管理</h3>
      
      <!-- 新增分類表單 -->
      <form @submit.prevent="addCategory" class="ts-form">
        <div class="ts-input is-fluid">
          <input v-model="newCategory" placeholder="輸入新分類名稱" required>
          <button type="submit" class="ts-button is-positive">新增分類</button>
        </div>
      </form>
  
      <!-- 分類列表 -->
      <table class="ts-table" style="margin: 15px 0px 0px 0px ;">
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
  </template>
  
  <script setup>
  import { ref, onMounted, computed} from 'vue';
  import axiosapi from '@/plugins/axios.js';
  import Paginate from 'vuejs-paginate-next';
  import Swal from 'sweetalert2'
  import useUserStore from "@/stores/user.js"
  import { useRouter } from 'vue-router';

  const userStore = useUserStore() // Pinia用戶存儲
  const router = useRouter(); // 跳轉頁面

  const categories = ref([]); // 存儲所有分類
  const newCategory = ref(''); // 新分類的名稱
  const editingId = ref(null); // 用於編輯功能
  const editingName = ref(''); // 用於編輯功能
  const currentPage = ref(1); //  當前頁碼
  const itemsPerPage = 8; // 每頁顯示的項目數
  
  // 鉤子: 組件掛載時獲取分類數據
  onMounted(async () => {
    await fetchCategories();
  });
  
  // 計算當前頁的分類
  const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return categories.value.slice(start, end);
});

// 計算總頁數
function getPageCount() {
  return Math.ceil(categories.value.length / itemsPerPage);
}

// 處理頁碼變化
function handlePageChange(page) {
  currentPage.value = page;
}

//  獲取所有分類
  async function fetchCategories() {
    try {
      const response = await axiosapi.get('/categories');
      categories.value = response.data;
    } catch (error) {
      handleApiError(error, '獲取分類失敗');
    }
  }
  
  // 添加新分類
  async function addCategory() {
    try {
      await axiosapi.post('/admin/categories/create', { categoryName: newCategory.value },{
        headers: { Authorization: `Bearer ${userStore.userToken}` }
      })

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
      handleApiError(error, '新增失敗，請重試。');
  }
};

 //  開始編輯分類
  function startEditing(category) {
    editingId.value = category.categoryId;
    editingName.value = category.categoryName;
}

// 更新分類
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
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userStore.userToken}`
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
      handleApiError(error, '修改失敗，請重試。');
    }
  }else{
    cancelEdit();
  }
};
  function cancelEdit() {
  editingId.value = null;
  editingName.value = '';
}
  
 //  刪除分類
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
      await axiosapi.delete(`/admin/categories/${id}`, {
        headers: { Authorization: `Bearer ${userStore.userToken}` }
      });
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
      handleApiError(error, '刪除分類失敗');
    }
  }
}

//  統一處理API錯誤,包括權限錯誤的處理  
function handleApiError(error, defaultMessage) {
  console.error('API Error:', error);
  let errorMessage = defaultMessage;

  if (error.response) {
    if (error.response.status === 403) {
      errorMessage = '您沒有權限執行此操作';
      // 可能需要登出用戶或重定向到登錄頁面
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
    .ts-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  color: #000;
}
  </style>