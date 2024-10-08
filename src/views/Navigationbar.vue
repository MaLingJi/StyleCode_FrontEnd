<template>
  <header class="fixed-top-nav">
    <div class="ts-content is-padded is-secondary">
      <div class="ts-container">
        <div class="ts-grid is-middle-aligned">
          <div class="column is-fluid">
            <div class="ts-wrap is-middle-aligned main-nav">
              <RouterLink to="/" class="ts-text is-undecorated logo-link">
                <img src="/MDFK-removebg-preview.png" width="45" alt="Logo" />
              </RouterLink>
              <nav class="desktop-nav">
                <RouterLink to="/share" class="nav-link">穿搭</RouterLink>
                <RouterLink to="/forum" class="nav-link">論壇</RouterLink>
                <RouterLink to="/shop" class="nav-link">商城</RouterLink>
              </nav>
              <button class="mobile-menu-toggle" @click="toggleMobileMenu">
                <span class="ts-icon is-bars-icon"></span>
              </button>
            </div>
          </div>
          <div class="column user-actions">
            <div class="ts-wrap">
              <RouterLink
                class="ts-text is-undecorated action-icon width-30"
                to="/cart"
                ><span
                  class="ts-icon is-cart-shopping-icon is-big"
                ></span>
                <span
                  class="ts-badge is-negative is-small notification-badge"
                  v-if="cartItemCount > 0"
                >
                  {{ cartItemCount }}
                </span>
              </RouterLink>
              <div class="notification-container">
                <button
                  class="ts-text is-undecorated action-icon width-30"
                  @click="toggleNotifications"
                >
                  <span class="ts-icon  is-bell-icon is-big"></span>
                  <span
                    class="ts-badge is-negative is-small notification-badge"
                    v-if="unreadCount > 0"
                    >{{ unreadCount }}</span
                  >
                </button>

                <div
                  class="ts-popover ts-menu noti-popover"
                  :class="{ 'is-active': isNotificationOpen }"
                  v-if="userStore.isLogedin"
                >
                  <div class="ts-content has-dark is-dense">
                    <div class="">通知</div>
                  </div>
                  <div class="ts-divider"></div>
                  <!-- 如果沒有通知，顯示 "暫無通知" -->
                  <div
                    v-if="notifications && notifications.length === 0"
                    class="ts-content is-dense"
                  >
                    <div class="ts-text is-secondary">暫無通知</div>
                    <div class="ts-divider"></div>
                  </div>
                  <!-- 有通知，顯示通知列表 -->
                  <div v-else>
                    <template
                      v-for="notification in notifications.slice(0, 5)"
                      :key="notification.id"
                    >
                      <div
                        class="item"
                        @click="readNotification(notification.Nid)"
                      >
                        <div
                          class="ts-iconset is-outlined ts-grid is-middle-aligned is-spaced-between"
                        >
                          <span
                            class="column"
                            :class="{
                              'ts-icon': true,
                              'is-shop-icon': notification.type === 'shop',
                              'is-heart-icon': notification.type === 'post',
                            }"
                          ></span>
                          <div class="column" style="width: 80%">
                            <div
                              class="ts-text"
                              :class="{
                                'is-heavy': notification.status === 0,
                                'unread-notification':
                                  notification.status === 0,
                              }"
                            >
                              {{ notification.message }}
                            </div>
                            <div class="ts-text is-tiny is-secondary">
                              {{ dayjs(notification.createdTime).fromNow() }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="ts-divider"></div>
                    </template>
                  </div>
                  <div
                    class="item ts-content is-secondary is-dense ts-wrap is-center-aligned"
                  >
                    <div @click="toNotificationList">前往通知列表</div>
                  </div>
                </div>
              </div>
              <a
                class="ts-text is-undecorated action-icon"
                data-dropdown="user-dropdown"
                v-if="userStore.isLogedin"
                ><span class="ts-icon is-user-icon is-big"></span
              ></a>
              <div
                class="ts-dropdown"
                id="user-dropdown"
                v-if="userStore.isLogedin"
              >
                <RouterLink to="/secure/profile" class="item"
                  >個人頁面</RouterLink
                >
                <RouterLink
                  to="/backstage"
                  class="item"
                  v-if="userStore.permissions == 'Admin'"
                  >後台</RouterLink
                >
                <button class="item" @click="logout">登出</button>
              </div>
              <RouterLink
                to="/secure/login"
                v-if="!userStore.isLogedin"
                class="action-icon"
                ><span class="ts-icon is-regular is-user-icon is-big"></span
              ></RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
  <div class="nav-placeholder"></div>
  <nav
    class="mobile-nav"
    :class="{ 'is-active': isMobileMenuOpen }"
    @click.stop
  >
    <RouterLink to="/share" class="nav-link" @click="closeMobileMenu"
      >穿搭</RouterLink
    >
    <RouterLink to="/forum" class="nav-link" @click="closeMobileMenu"
      >論壇</RouterLink
    >
    <RouterLink to="/shop" class="nav-link" @click="closeMobileMenu"
      >商城</RouterLink
    >
  </nav>
</template>

<script setup>
import axiosapi from "@/plugins/axios.js";
import useUserStore from "@/stores/user.js";
import { useRouter } from "vue-router";
import { useCart } from "@/services/cartService";
import { onMounted, onUnmounted, ref, watch } from "vue";
import Swal from "sweetalert2";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.locale("zh-tw");

const router = useRouter();
const { cartItemCount, fetchCartCount, updateCartCount } = useCart();
const userStore = useUserStore();
const notifications = ref([]);
const unreadCount = ref(0); //未讀通知數
const intervalTime = 5000; //每隔2秒
let intervalId; //儲存 setInterval 的 ID

///////////////////////////// 登出 /////////////////////////////
async function logout() {
  axiosapi.defaults.headers.authorization = "";
  axiosapi.post("/logout");
  userStore.logout();
  unreadCount.value = 0;
  updateCartCount(0);
  notifications.value = [];
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  await Swal.fire({
    icon: "success",
    title: "登出成功",
    text: "您已成功登出。",
    timer: 1000,
    showConfirmButton: false,
  });
  router.push("/");
}

///////////////////////////// 通知 /////////////////////////////

async function callFindNotification() {
  try {
    if (!userStore.userId) {
      console.error("User ID is not defined");
      return;
    }

    const response = await axiosapi.get(
      `/member/notifications/${userStore.userId}`
    );

    if (response.data.success) {
      // console.log(response.data.notificationList);
      notifications.value = response.data.notificationList || [];
      unreadCount.value = response.data.unreadCount || 0;
    } else {
      console.error("Failed to fetch notifications:", response.data.message);
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
}
function readNotification(noid) {
  console.log("已讀");
  axiosapi
    .put(`/member/notifications/${noid}`)
    .then(function (response) {
      if (response.data.success) {
        // 找到該通知並將狀態設為已讀（已讀為 1）
        const notification = notifications.value.find(
          (notif) => notif.Nid === noid
        );
        if (notification) {
          notification.status = 1; // 更新狀態為已讀
          unreadCount.value = unreadCount.value - 1;
        }
      } else {
        console.error("無法將通知標記為已讀:", response.data.message);
      }
    })
    .catch((error) => {
      console.error("標記通知為已讀時出錯:", error);
    });
}

//前往通知列表
function toNotificationList() {
  router.push({
    name: "profile-ling",
    params: { initialView: "notificationList" },
  });
  isNotificationOpen.value = false;
}

onMounted(function () {
  if (userStore.isLogedin) {
    //一開始載入時呼叫一次
    callFindNotification();

    //每隔一段時間呼叫一次
    intervalId = setInterval(callFindNotification, intervalTime);
    fetchCartCount(userStore.userId);
  }
});

onUnmounted(function () {
  if (intervalId) {
    //卸載時清除，通知計時
    clearInterval(intervalId);
  }
  document.removeEventListener("click", closeNotificationsOutside);
});

// 控制移動端選單的狀態
const isMobileMenuOpen = ref(false);

// 切換移動端選單的函數
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  if (isMobileMenuOpen.value) {
    document.addEventListener("click", handleOutsideClick);
  } else {
    document.removeEventListener("click", handleOutsideClick);
  }
};

// 關閉移動端選單的函數
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  document.removeEventListener("click", handleOutsideClick);
};

// 處理點擊外部區域的函數
const handleOutsideClick = (event) => {
  if (
    isMobileMenuOpen.value &&
    !event.target.closest(".mobile-nav") &&
    !event.target.closest(".mobile-menu-toggle")
  ) {
    closeMobileMenu();
  }
};

// 監聽使用者登入狀態變化，當登入後調用 `callFindNotification`
watch(
  () => userStore.isLogedin,
  (newValue) => {
    if (newValue) {
      callFindNotification(); // 登入後立即呼叫
      if (!intervalId) {
        intervalId = setInterval(callFindNotification, intervalTime);
      }
    } else {
      // 如果使用者登出，清除間隔
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }
  }
);

//響應式  通知修改

const isNotificationOpen = ref(false);

function toggleNotifications() {
  isNotificationOpen.value = !isNotificationOpen.value;
  if (isNotificationOpen.value) {
    document.addEventListener("click", closeNotificationsOutside);
  } else {
    document.removeEventListener("click", closeNotificationsOutside);
  }
}

function closeNotificationsOutside(event) {
  if (
    !event.target.closest(".noti-popover") &&
    !event.target.closest(".action-icon")
  ) {
    isNotificationOpen.value = false;
    document.removeEventListener("click", closeNotificationsOutside);
  }
}
</script>

<style scoped>
.fixed-top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-placeholder {
  height: 90px;
}

.main-nav {
  display: flex;
  align-items: center;
}

.desktop-nav {
  display: flex;
  align-items: center;
}

.logo-link {
  margin-right: 30px;
  /* 增加logo和第一個導航項目之間的間距 */
}

.nav-link {
  padding: 10px 20px;
  /* 增加內邊距 */
  margin: 0 10px;
  /* 增加外邊距 */
  text-decoration: none;
  color: #333;
  font-size: 1.1em;
  transition: background-color 0.3s, color 0.3s;
}

.nav-link:hover {
  background-color: #f0f0f0;
  color: #000;
}

.action-icon {
  margin: 0 10px;
  /* 為用戶操作圖標添加間距 */
}

.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5em;
}

.mobile-nav {
  display: none;
  flex-direction: column;
  position: fixed;
  top: 90px;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 999;
}

.mobile-nav.is-active {
  display: flex;
}

.mobile-nav .nav-link {
  padding: 15px 10px;
  border-bottom: 1px solid #eee;
}

.mobile-nav .nav-link:last-child {
  border-bottom: none;
}

@media (max-width: 1024px) {
  .nav-link {
    padding: 10px 15px;
    margin: 0 5px;
  }

  .logo-link {
    margin-right: 20px;
  }
}

@media (max-width: 768px) {
  .desktop-nav,
  .search-column {
    display: none;
  }

  .mobile-menu-toggle {
    display: block;
  }

  .main-nav {
    justify-content: space-between;
  }

  .user-actions {
    margin-left: auto;
  }

  .mobile-nav {
    top: 70px; /* 調整為與 nav-placeholder 相同的高度 */
  }

  .noti-popover {
    top: 70px;
    right: 10px;
    width: 100%;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .nav-placeholder {
    height: 70px;
  }

  .fixed-top-nav {
    padding: 10px 0;
  }

  .action-icon {
    margin: 0 5px;
  }
}
@media (min-width: 1536px) {
  /* 你的 CSS 規則 */
  .noti-popover {
    display: none;
    position: fixed;
    top: 70px;
    right: 70px;
    width: calc(100% - 20px);
    max-width: 400px;
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
}
/* ---------------- 通知相關的CSS ---------------- */
.width-30 {
  position: relative;
  display: inline-block;
  width: 30px;
}

.notification-badge {
  position: absolute;
  top: 0;
  right: -10px;
}

.noti-popver {
  width: 400px;
}

.unread-notification {
  color: rgb(48, 103, 205);
}

.noti-popover {
  display: none;
  position: fixed;
  top: 70px;
  width: calc(100% - 20px);
  max-width: 400px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.noti-popover.is-active {
  display: block;
}

.notification-container {
  position: relative;
}
</style>
