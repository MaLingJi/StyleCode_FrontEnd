<template>
  <div class="ts-content">
    <h3 class="ts-header">會員管理</h3>
    <div class="ts-grid is-relaxed is-3-columns has-top-spaced-large">
      <div class="column">
        <div class="ts-box">
          <div class="ts-content">
            <div class="ts-statistic">
              <div class="value">{{ totalItems }}</div>
            </div>
            總會員數
          </div>
          <div class="symbol">
            <span class="ts-icon is-users-icon"></span>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="ts-box">
          <div class="ts-content">
            <div class="ts-statistic">
              <div class="value">{{ todayRegistrations }}</div>
            </div>
            今日註冊人數
          </div>
          <div class="symbol">
            <span class="ts-icon is-users-icon"></span>
          </div>
        </div>
      </div>
    </div>

    <div class="ts-divider is-section has-top-spaced-large"></div>

    <div class="ts-box is-top-indicated">
      <div class="ts-content is-dense">
        <div class="ts-header is-heavy">會員清單</div>
      </div>
      <div class="ts-divider"></div>
      <table class="ts-table is-basic">
        <thead>
          <tr>
            <th>使用者名稱</th>
            <th>電子郵件信箱</th>
            <th>權限</th>
            <th>啟用日期</th>
          </tr>
        </thead>
        <tbody>
          <tr class="" v-for="user in userList" :key="user.userId">
            <td>{{ user.userName }}</td>
            <td>
              {{ user.userEmail }}
            </td>
            <td>
              <select
                @change="updateRole(user.userId, $event)"
                class="ts-select is-solid"
                v-model="user.permissions"
              >
                <option value="Member">一般會員</option>
                <option value="Admin">管理員</option>
                <!-- <option value="Admin">封鎖</option> -->
              </select>
            </td>
            <td>{{ formatDate(user.createdTime) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="ts-divider"></div>
      <div class="ts-content page-bar">
        <div class="ts-pagination is-center-aligned">
          <Paginate
            :page-count="pageCount"
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
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import axiosapi from "@/plugins/axios.js";
import Swal from "sweetalert2";
import Paginate from "vuejs-paginate-next";

const userList = ref([]);

///分頁
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const totalPages = ref(0);
const pageCount = computed(() => totalPages.value);

//今日註冊變數
const todayRegistrations = ref(0);

// 格式化日期的輔助方法
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString(); // 根據需要調整格式
};

function callFindUsers(page = 1) {
  currentPage.value = page;

  axiosapi
    .get(`/admin/userback`, {
      params: {
        page: currentPage.value - 1, // 後端頁碼從 0 開始
        pageSize: pageSize.value,
      },
    })
    .then(function (response) {
      if (response.status === 200) {
        console.log(response.data);
        const data = response.data;
        userList.value = data.items;
        totalItems.value = data.totalItems;
        totalPages.value = data.totalPages;
        currentPage.value = data.currentPage + 1; // 前端頁碼從 1 開始
      } else if (response.status == 204) {
        console.log("尚無用戶");
        userList.value = [];
        totalItems.value = 0;
        totalPages.value = 0; // 新增：重置總頁數
        currentPage.value = 1; // 新增：重置當前頁碼到第一頁
      }
    })
    .catch(function (error) {
      Swal.fire({
        text: "獲取用戶時出現錯誤" + error.message,
        icon: "error",
        confirmButtonText: "確認",
        confirmButtonColor: "rgb(35 40 44)",
        allowOutsideClick: false,
      });
    });
}

//今日註冊人數
const fetchTodayRegistrations = async () => {
  try {
    const response = await axiosapi.get("/admin/todayregistrations");
    todayRegistrations.value = response.data;
  } catch (error) {
    console.error("Error fetching today's registrations:", error);
    Swal.fire({
      text: "獲取今日註冊人數時出現錯誤: " + error.message,
      icon: "error",
      confirmButtonText: "確認",
      confirmButtonColor: "rgb(35 40 44)",
      allowOutsideClick: false,
    });
  }
};

// 更改權限
const updateRole = async (userId, event) => {
  const selectElement = event.target;
  const newRole = selectElement.value;

  // 找到相應的用戶
  const user = userList.value.find((user) => user.userId === userId);
  if (user) {
    //確認對話框
    const result = await Swal.fire({
      title: "確認更改權限",
      text: `您確定要將用戶 ${user.userName} 的角色更改為 ${
        newRole === "Member" ? "一般會員" : "管理員"
      } 嗎？`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "確定",
      cancelButtonText: "取消",
      confirmButtonColor: "rgb(35 40 44)",
      cancelButtonColor: "#9e9e9e",
    });
    if (result.isConfirmed) {
      try {
        console.log(userId);
        const response = await axiosapi.put(`/admin/userback/${userId}`, {
          id: userId,
          role: newRole,
        });

        if (response.status === 200) {
          // 更新前端角色
          user.permissions = newRole;
          Swal.fire({
            text: `成功更新權限為: ${
              newRole === "Member" ? "一般會員" : "管理員"
            }`,
            icon: "success",
            confirmButtonText: "確認",
            confirmButtonColor: "rgb(35 40 44)",
            allowOutsideClick: false,
          });
        } else {
          Swal.fire({
            text: "更新失敗，請稍後重試。",
            icon: "error",
            confirmButtonText: "確認",
            confirmButtonColor: "rgb(35 40 44)",
            allowOutsideClick: false,
          });
          console.error("更新失敗，請稍後重試。");
        }
      } catch (error) {
        console.error("更新權限時出現錯誤:", error);
        Swal.fire({
          text: "更新失敗，請稍後重試。" + error.message,
          icon: "error",
          confirmButtonText: "確認",
          confirmButtonColor: "rgb(35 40 44)",
          allowOutsideClick: false,
        });
      }
    }
  }
};
// 處理頁面變化
function handlePageChange(page) {
  callFindUsers(page);
}

// 如果需要，您可以添加這些方法來處理首頁和尾頁
function goToFirstPage() {
  callFindUsers(1);
}

function goToLastPage() {
  callFindUsers(pageCount.value);
}

onMounted(function () {
  callFindUsers();
  fetchTodayRegistrations();
});
</script>

<style scoped>
select {
  width: 100px;
  text-align: center;
}
ul {
  margin-top: 0;
}
</style>
