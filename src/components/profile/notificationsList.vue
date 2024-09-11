<template>
  <div class="ts-grid header-title is-middle-aligned is-spaced-between">
    <div class="ts-header is-huge is-heavy">通知列表</div>
    <button class="ts-button is-start-icon" @click="allRead">
      <span class="ts-icon is-envelope-open-icon"></span>
      一鍵已讀
    </button>
  </div>
  <div v-if="notifications.length > 0">
    <template v-for="(notification, index) in notifications" :key="index">
      <div
        class="ts-box is-horizontal"
        @click="readNotification(notification.id)"
      >
        <div
          class="ts-grid is-middle-aligned is-spaced-between is-center-aligned"
          style="width: 20%"
        >
          <span
            class="column"
            :class="{
              'ts-icon': true,
              'is-shop-icon': notification.type === 'shop',
              'is-heart-icon': notification.type === 'post',
            }"
            style="font-size: 50px"
          ></span>
        </div>
        <div class="ts-content right-side">
          <div class="ts-grid is-spaced-between">
            <div
              class="ts-header column"
              :class="{
                'is-heavy': notification.status === 0,
                'unread-notification': notification.status === 0,
              }"
            >
              {{ notification.message }}
            </div>
          </div>
          <p class="ts-text is-tiny is-secondary">
            {{ getRelativeTime(notification.createdTime) }}
          </p>
        </div>
      </div>
    </template>
    <div class="ts-content page-bar is-center-aligned">
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

  <div class="ts-box is-hollowed" v-else>
    <div class="ts-blankslate">
      <div class="header ts-icon is-bell-slash-icon"></div>
      <div class="description">暫無通知</div>
    </div>
  </div>
</template>

<script setup>
import axiosapi from "@/plugins/axios.js";
import useUserStore from "@/stores/user.js";
import { onMounted, ref, computed } from "vue";
import Swal from "sweetalert2";
import Paginate from "vuejs-paginate-next";

const userStore = useUserStore();
const notifications = ref([]);

const currentPage = ref(1);
const pageSize = ref(5);
const totalItems = ref(0);
const totalPages = ref(0);
const pageCount = computed(() => totalPages.value);

defineProps({
  userDetail: {
    type: Object,
    required: true,
  },
});

async function callFindNotification(page = 1) {
  currentPage.value = page;
  try {
    if (!userStore.userId) {
      console.error("User ID is not defined");
      return;
    }

    const response = await axiosapi.get(
      `/member/notifications/page/${userStore.userId}`,
      {
        params: {
          page: currentPage.value - 1, // 後端頁碼從 0 開始
          pageSize: pageSize.value,
        },
      }
    );

    if (response.data) {
      notifications.value = response.data.content || [];
      console.log("notifications.value", notifications.value);
      totalItems.value = response.data.totalElements || 0;
      totalPages.value = response.data.totalPages || 0;
      currentPage.value = response.data.currentPage + 1;
    } else {
      console.error("Failed to fetch notifications:", response.data.message);
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
}

function getRelativeTime(dateString) {
  const date = new Date(dateString.replace(" ", "T"));
  const now = new Date();
  const difinSeconds = Math.floor((now - date) / 1000);

  if (difinSeconds < 60) return "剛剛";
  if (difinSeconds < 3600) return `${Math.floor(difinSeconds / 60)} 分鐘前`;
  if (difinSeconds < 86400) return `${Math.floor(difinSeconds / 3600)} 小時前`;
  if (difinSeconds < 2592000) return `${Math.floor(difinSeconds / 86400)} 天前`;
  if (difinSeconds < 3153600)
    return `${Math.floor(difinSeconds / 2592000)} 個月前`;
  return `${Math.floor(difinSeconds / 3153600)} 年前`;
}

function readNotification(noid) {
  console.log("已讀");
  console.log("noid", noid);
  axiosapi
    .put(`/member/notifications/${noid}`)
    .then(function (response) {
      if (response.data.success) {
        // 找到該通知並將狀態設為已讀（已讀為 1）
        const notification = notifications.value.find(
          (notif) => notif.id === noid
        );
        if (notification) {
          notification.status = 1; // 更新狀態為已讀
        }
      } else {
        console.error("無法將通知標記為已讀:", response.data.message);
      }
    })
    .catch((error) => {
      console.error("標記通知為已讀時出錯:", error);
    });
}

//////// 一鍵已讀 ////////
async function allRead() {
  try {
    const response = await axiosapi.put(
      `/member/notifications/allread/${userStore.userId}`
    );
    if (response.status === 200) {
      notifications.value.forEach((notification) => {
        if (notification.status === 0) {
          notification.status = 1;
        }
      });
      Swal.fire({
        text: "所有通知已標記為已讀",
        icon: "success",
        confirmButtonColor: "rgb(35 40 44)",
        confirmButtonText: "確認",
      });
    } else {
      Swal.fire({
        text: "無法將通知全部標記為已讀",
        icon: "error",
        confirmButtonColor: "rgb(35 40 44)",
        confirmButtonText: "確認",
      });
    }
  } catch (error) {
    console.error("標記通知全部為已讀時出錯:", error);
    Swal.fire({
      text: "發生錯誤,請稍後再試",
      icon: "error",
      confirmButtonColor: "rgb(35 40 44)",
      confirmButtonText: "確認",
    });
  }
}

// 處理頁面變化
function handlePageChange(page) {
  callFindNotification(page);
}

onMounted(async () => {
  Swal.fire({
    title: "讀取中...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
  await callFindNotification();
  Swal.close();
});
</script>

<style scoped>
.unread-notification {
  color: rgb(48, 103, 205);
}
.header-title {
  margin-bottom: 2rem;
}
ul.ts-pagination {
  margin-top: 0;
}
</style>
