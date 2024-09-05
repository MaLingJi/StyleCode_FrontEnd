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
            <RouterLink class="ts-text is-undecorated action-icon" to="/cart"
              ><span
                class="ts-icon is-spinning is-cart-shopping-icon is-big"
              ></span
            ></RouterLink>
            <button
                class="ts-text is-undecorated action-icon width-30"
                popovertarget="noti-popup"
                @click="clearNotifications"
              >
                <span class="ts-icon is-spinning is-bell-icon is-big"></span
                ><span
                  class="ts-badge is-negative is-small notification-badge"
                  v-if="unreadCount > 0"
                  >{{ unreadCount }}</span
                >
              </button>
              <div
                class="ts-popover ts-menu noti-popver"
                id="noti-popup"
                v-if="userStore.isLogedin"
                popover
              >
                <div class="ts-content has-dark is-dense">
                  <div class="">通知</div>
                </div>
                <div class="ts-divider"></div>
                <!-- 如果沒有通知，顯示 "暫無通知" -->
                <div
                  v-if="notifications.length === 0"
                  class="ts-content is-dense"
                >
                  <div class="ts-text is-secondary">暫無通知</div>
                </div>
                <template
                  v-for="(notification, index) in notifications.slice(0, 5)"
                  :key="index"
                >
                  <div class="item" @click="readNotification(notification.Nid)">
                    <div
                      class="ts-iconset is-outlined ts-wrap is-middle-aligned"
                    >
                      <span
                        :class="{
                          'ts-icon': true,
                          'is-shop-icon': notification.type === 'shop',
                          'is-heart-icon': notification.type === 'post',
                        }"
                      ></span>
                      <div>
                        <div
                          class="ts-text"
                          :class="{
                            'is-heavy': notification.status === 0,
                            'unread-notification': notification.status === 0,
                          }"
                        >
                          {{ notification.message }}
                        </div>
                        <div class="ts-text is-tiny is-secondary">
                          {{ getRelativeTime(notification.createdTime) }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="ts-divider"></div>
                </template>
                <div
                  class="item ts-content is-secondary is-dense ts-wrap is-center-aligned"
                >
                  <div @click="toNotificationList">前往通知列表</div>
                </div>
              </div>
              <a
                class="ts-text is-undecorated action-icon"
                data-dropdown="user-dropdown"
                href="#!"
                v-if="userStore.isLogedin"
                ><span class="ts-icon is-spinning is-user-icon is-big"></span
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
                class="width-30"
                ><span class="ts-icon is-user-icon is-big"></span
              ></RouterLink>
            </div>
          </div>
        </div>
      </div>

      </div>
  </header>
  <div class="nav-placeholder"></div>
  <nav class="mobile-nav" :class="{ 'is-active': isMobileMenuOpen }">
    <RouterLink to="/share" class="nav-link">穿搭</RouterLink>
    <RouterLink to="/forum" class="nav-link">論壇</RouterLink>
    <RouterLink to="/shop" class="nav-link">商城</RouterLink>
    <RouterLink v-if="userStore.isAdmin" to="/backstage" class="nav-link"
      >後台</RouterLink
    >
  </nav>
</template>

<script setup>
import axiosapi from "@/plugins/axios.js"
import useUserStore from "@/stores/user.js"
import { useRouter } from 'vue-router';

import { onMounted, onUnmounted, ref, watch } from "vue";

const router = useRouter();

const userStore = useUserStore();
const notifications = ref([]);
const unreadCount = ref(0); //未讀通知數
const intervalTime = 10000; //每隔10秒
let intervalId; //儲存 setInterval 的 ID


///////////////////////////// 登出 /////////////////////////////
function logout() {
  axiosapi.defaults.headers.authorization = "";
  userStore.setUserId("");
  userStore.setUserToken("");
  userStore.setPermissions("");
  userStore.setLogedin(false);
  unreadCount.value = 0;
  notifications.value = [];
  router.push("/");
}

///////////////////////////// 通知 /////////////////////////////

function callFindNotification() {
  axiosapi
    .get(`/member/notifications/${userStore.userId}`)
    .then(function (response) {
      if (response.data.success) {
        console.log(response.data.notificationList);
        notifications.value = response.data.notificationList;
        unreadCount.value = response.data.unreadCount;
      }
    });
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
        }
      } else {
        console.error("無法將通知標記為已讀:", response.data.message);
      }
    })
    .catch((error) => {
      console.error("標記通知為已讀時出錯:", error);
    });
}

//打開鈴鐺通知歸0
function clearNotifications() {
  unreadCount.value = 0;
}

function toNotificationList() {
  router.push({
    name: "profile-ling",
    params: { initialView: "notificationList" },
  });
}

onMounted(function () {
  if (userStore.isLogedin) {
    //一開始載入時呼叫一次
    callFindNotification();

    //每隔一段時間呼叫一次
    intervalId = setInterval(callFindNotification, intervalTime);
  }
});

onUnmounted(function () {
  if (intervalId) {
    //卸載時清除，通知計時
    clearInterval(intervalId);
  }
});

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
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
  margin-right: 30px; /* 增加logo和第一個導航項目之間的間距 */
}

.nav-link {
  padding: 10px 20px; /* 增加內邊距 */
  margin: 0 10px; /* 增加外邊距 */
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
  margin: 0 10px; /* 為用戶操作圖標添加間距 */
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

/* ---------------- 通知相關的CSS ---------------- */
.width-30 {
  position: relative;
  display: inline-block;
  width: 30px;
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
}
.noti-popver {
  width: 300px;
}
.unread-notification {
  color: rgb(48, 103, 205);
}
</style>
