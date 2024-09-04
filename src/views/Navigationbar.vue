<template>
  <div class="ts-content is-padded is-secondary">
    <div class="ts-container">
      <div class="ts-grid is-middle-aligned">
        <div class="column is-fluid">
          <div class="ts-wrap is-middle-aligned">
            <RouterLink to="/" class="ts-text is-undecorated"
              ><img src="/beginner.png" width="45px" />
            </RouterLink>
            <RouterLink to="/share" class="ts-text is-undecorated is-big"
              >穿搭</RouterLink
            >
            <RouterLink to="/forum" class="ts-text is-undecorated is-big"
              >論壇</RouterLink
            >
            <RouterLink to="/shop" class="ts-text is-undecorated is-big"
              >商城</RouterLink
            >
            <RouterLink
              to="/backstage"
              v-if="userStore.permissions == 'Admin'"
              class="ts-text is-undecorated is-big"
              >後台</RouterLink
            >
          </div>
        </div>
        <div class="column">
          <div class="ts-wrap">
            <div class="ts-input is-start-icon">
              <span
                class="ts-icon is-angle-down-icon"
                data-dropdown="dropdown"
              ></span>
              <div class="ts-dropdown" id="dropdown">
                <button class="item">文章</button>
                <button class="item">商城</button>
              </div>
              <input type="text" placeholder="搜尋文章(商城)..." />
            </div>
          </div>
        </div>
        <div class="column ts-menu">
          <div class="ts-wrap">
            <RouterLink class="ts-text is-undecorated width-30" to="/cart"
              ><span
                class="ts-icon is-spinning is-cart-shopping-icon is-big"
              ></span
            ></RouterLink>
            <button
              class="ts-text is-undecorated width-30"
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
              <template
                v-for="(notification, index) in notifications.slice(0, 5)"
                :key="index"
              >
                <div class="item" @click="readNotification(notification.Nid)">
                  <div class="ts-iconset is-outlined ts-wrap is-middle-aligned">
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
              <!-- <div
                class="item ts-content is-secondary is-dense ts-wrap is-center-aligned"
              >
                <RouterLink to="/secure/profile/notifications" class=""
                  >前往通知列表</RouterLink
                >
              </div> -->
            </div>
            <a
              class="ts-text is-undecorated width-30"
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
  <div class="ts-divider"></div>
</template>

<script setup>
import axiosapi from "@/plugins/axios.js";
import useUserStore from "@/stores/user.js";
import { onMounted, onUnmounted, ref, watch } from "vue";

const userStore = useUserStore();
const notifications = ref([]);
const unreadCount = ref(0); //未讀通知數
const intervalTime = 10000 * 1000; //每隔10秒
let intervalId; //儲存 setInterval 的 ID

///////////////////////////// 登出 /////////////////////////////

function logout() {
  //pinia 清空資料
  axiosapi.defaults.headers.authorization = "";
  userStore.setUserId("");
  userStore.setUserToken("");
  userStore.setPermissions("");
  userStore.setLogedin(false);
  unreadCount.value = 0;
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
        // 找到該通知並將狀態設為已讀（假設已讀為 1）
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
</script>

<style scoped>
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
