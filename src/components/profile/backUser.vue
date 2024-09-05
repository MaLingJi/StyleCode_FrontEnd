<template>
  <div class="ts-box">
    <div class="ts-content">
      <h3 class="ts-header">會員管理</h3>
      <div class="ts-grid is-relaxed is-3-columns has-top-spaced-large">
        <div class="column">
          <div class="ts-box">
            <div class="ts-content">
              <div class="ts-statistic">
                <div class="value">8,652</div>
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
                <div class="value">123</div>
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
            <a class="item is-back"></a>
            <a class="item">1</a>
            <a class="item is-active">2</a>
            <a class="item">3</a>
            <a class="item">4</a>
            <a class="item is-next"></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axiosapi from "@/plugins/axios.js";
import Swal from "sweetalert2";
import Paginate from "vuejs-paginate-next";

const userList = ref([]);

// 格式化日期的輔助方法
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString(); // 根據需要調整格式
};

function callFindUsers() {
  axiosapi
    .get(`/admin/userback`)
    .then(function (response) {
      if (response.status === 200) {
        console.log(response.data);
        userList.value = response.data;
      } else if (response.status == 204) {
        console.log("尚無用戶");
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

// 更新角色並呼叫 API 函數
const updateRole = async (userId, event) => {
  const selectElement = event.target;
  const newRole = selectElement.value;

  // 找到相應的用戶
  const user = userList.value.find((user) => user.userId === userId);
  if (user) {
    //確認對話框
    const result = await Swal.fire({
      title: "確認更新權限",
      text: `您確定要將用戶 ${user.userName} 的角色更新為 ${
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

onMounted(function () {
  callFindUsers();
});
</script>

<style scoped>
select {
  width: 100px;
  text-align: center;
}
.page-bar {
  width: 35%;
}
</style>
