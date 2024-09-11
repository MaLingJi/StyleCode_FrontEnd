<template>
  <div class="ts-app-layout is-fullscreen responsive-layout">
    <div class="sidebar-toggle" @click="toggleSidebar">
      <span class="ts-icon is-bars-icon"></span>
    </div>
    <div class="cell sidebar" :class="{ 'is-active': isSidebarOpen }">
      <div class="ts-content is-center-aligned">
        <div class="ts-wrap is-vertical is-compact is-middle-aligned">
          <div class="ts-image is-circular">
            <img :src="userPhoto" width="80" data-dialog="updatePhotoModal" />
          </div>
          <div class="ts-header">{{ userDetail?.userName }}</div>
        </div>
      </div>
      <div class="ts-divider"></div>
      <!-- 使用者資訊 -->
      <div class="sidebar-section">
        <div class="ts-content is-dense">
          <div class="ts-grid">
            <div class="column is-fluid">
              <div class="ts-text is-bold">使用者資訊</div>
            </div>
            <div class="column">
              <span class="ts-icon is-users-icon"></span>
            </div>
          </div>
        </div>
        <div class="ts-menu is-dense is-small" style="opacity: 0.8">
          <a class="item" @click="switchComps(userProfile)">個人資料</a>
          <a class="item" @click="switchComps(notificationsList)">通知列表</a>
          <a class="item" @click="switchComps(card)">信用卡資訊</a>
          <a
            v-if="!userStore.isThirdPartyLogin"
            class="item"
            data-dialog="updatePwdModal"
          >修改密碼</a>
        </div>
      </div>
      <!-- 商城 -->
      <div class="sidebar-section">
        <div class="ts-content is-dense">
          <div class="ts-grid">
            <div class="column is-fluid">
              <div class="ts-text is-bold">商城</div>
            </div>
            <div class="column">
              <span class="ts-icon is-cogs-icon"></span>
            </div>
          </div>
        </div>
        <div class="ts-menu is-dense is-small" style="opacity: 0.8">
          <a class="item" @click="switchComps(order)">購買清單</a>
        </div>
      </div>
      <!-- 管理文章 -->
      <div class="sidebar-section">
        <div class="ts-content is-dense">
          <div class="ts-grid">
            <div class="column is-fluid">
              <div class="ts-text is-bold">管理文章</div>
            </div>
            <div class="column">
              <span class="ts-icon is-newspaper-icon"></span>
            </div>
          </div>
        </div>
        <div class="ts-menu is-dense is-small" style="opacity: 0.8">
          <a href="#!" class="item" @click="switchComps(myPostList)">我的文章</a>
          <a href="#!" class="item" @click="switchComps(myLikePost)">收藏文章</a>
        </div>
      </div>
    </div>
    <div class="sidebar-hint" :class="{ 'is-hidden': isSidebarOpen }" @click="toggleSidebar">
      <span class="ts-icon is-chevron-right-icon"></span>
    </div>
    <div class="cell is-fluid is-scrollable is-secondary main-content">
      <div class="ts-container is-narrow has-vertically-padded-large">
        <component
          v-if="userDetail"
          :is="currentComp"
          :userDetail="userDetail"
        ></component>
      </div>
    </div>
  </div>
  <dialog class="ts-modal is-large" id="updatePhotoModal">
    <div class="content">
      <div class="ts-content">
        <div class="ts-grid">
          <div class="column is-fluid">
            <div class="ts-header">使用者照片</div>
          </div>
          <div class="column">
            <button
              class="ts-close is-large is-secondary"
              data-dialog="updatePhotoModal"
            ></button>
          </div>
        </div>
      </div>
      <div class="ts-divider"></div>
      <div class="ts-content is-center-aligned">
        <div class="ts-wrap is-vertical is-compact is-middle-aligned">
          <div class="ts-image is-circular">
            <img :src="photoPreview" width="200" @click="clickFileInput" />
          </div>
          <div class="ts-content">
            <div class="ts-file">
              <input
                type="file"
                id="fileInput"
                ref="fileInput"
                @change="previewPhoto"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="ts-divider"></div>
      <div class="ts-content is-tertiary">
        <div class="ts-wrap is-end-aligned">
          <button class="ts-button" @click="uploadPhoto">上傳照片</button>
          <button class="ts-button is-outlined" data-dialog="updatePhotoModal">
            取消
          </button>
        </div>
      </div>
    </div>
  </dialog>
  <dialog class="ts-modal is-large" id="updatePwdModal">
    <div class="content">
      <div class="ts-content">
        <div class="ts-grid">
          <div class="column is-fluid">
            <div class="ts-header">修改密碼</div>
          </div>
          <div class="column">
            <button
              class="ts-close is-large is-secondary"
              data-dialog="updatePwdModal"
            ></button>
          </div>
        </div>
      </div>
      <div class="ts-divider"></div>
      <div class="ts-content">
        <div class="ts-container">
          <div class="ts-wrap is-vertical is-compact">
            <div class="ts-text is-label has-top-spaced-large">舊密碼</div>
            <div class="ts-input is-underlined has-top-spaced is-end-icon">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="uPwdInput.oldPwd"
              />
              <span
                :class="[
                  'ts-icon',
                  showPassword ? 'is-eye-icon' : 'is-eye-slash-icon',
                ]"
                @click="togglePasswordVisibility"
              ></span>
            </div>
            <div
              class="ts-text is-label has-top-spaced-large ts-wrap is-relaxed"
            >
              新密碼<span class="err-msg">{{ pwdFomatMsg }}</span>
            </div>
            <div class="ts-input is-underlined has-top-spaced is-end-icon">
              <input
                :type="showPassword2 ? 'text' : 'password'"
                v-model="uPwdInput.newPwd"
                @change="checkPwdFomat"
              />
              <span
                :class="[
                  'ts-icon',
                  showPassword2 ? 'is-eye-icon' : 'is-eye-slash-icon',
                ]"
                @click="togglePasswordVisibility2"
              ></span>
            </div>
            <div class="ts-text is-description">
              僅能是英文字母和數字，且最少 8 字，最多 20 字。
            </div>
            <div
              class="ts-text is-label has-top-spaced-large ts-wrap is-relaxed"
            >
              確認密碼<span class="err-msg">{{ pwdMessage }}</span>
            </div>
            <div class="ts-input is-underlined has-top-spaced is-end-icon">
              <input
                :type="showPassword3 ? 'text' : 'password'"
                v-model="uPwdInput.checkPwd"
                @change="checkPwds"
              />
              <span
                :class="[
                  'ts-icon',
                  showPassword3 ? 'is-eye-icon' : 'is-eye-slash-icon',
                ]"
                @click="togglePasswordVisibility3"
              ></span>
            </div>
          </div>
        </div>
      </div>
      <div class="ts-divider"></div>
      <div class="ts-content is-tertiary">
        <div class="ts-wrap is-end-aligned">
          <button class="ts-button" @click="changePwdInput">快捷輸入</button>
          <button
            class="ts-button"
            :disabled="isLoginDisabled"
            @click="updatePwd"
          >
            更改密碼
          </button>
          <button
            class="ts-button is-outlined"
            data-dialog="updatePwdModal"
            @click="cancelChange"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { shallowRef, ref, onMounted, onUnmounted, reactive, computed, watch } from "vue";
import { useRoute } from "vue-router";
import axiosapi from "@/plugins/axios.js";
import useUserStore from "@/stores/user.js";
import Swal from "sweetalert2";

import userProfile from "@/components/profile/userProfile.vue";
import card from "@/components/profile/card.vue";
import order from "../pages/order.vue";
import notificationsList from "@/components/profile/notificationsList.vue";
import myPostList from "@/components/profile/myPostList.vue";
import myLikePost from "@/components/profile/myLikePost.vue";

const route = useRoute();
const props = defineProps(["initialView"]);

const userStore = useUserStore();
const currentComp = shallowRef(userProfile);

const userDetail = ref(null);
const userPhoto = ref("");
const photoPath = import.meta.env.VITE_USER_IMAGE_URL;
const fileInput = ref(null);
const photoPreview = ref("");
const photo = ref(null);
const pwdMessage = ref("");
const pwdFomatMsg = ref("");


function switchComps(comp) {
  console.log("Switching to component:", comp);
  if (typeof comp === "string") {
    switch (comp) {
      case "userProfile":
        currentComp.value = userProfile;
        break;
      case "card":
        currentComp.value = card;
        break;
      case "order":
        currentComp.value = order;
        break;
      case "notificationList":
        currentComp.value = notificationsList;
        break;
      default:
        currentComp.value = userProfile;
    }
    
  } else {
    currentComp.value = comp;
  }
  ////響應式
  if (window.innerWidth <= 768) {
    isSidebarOpen.value = false;
  }
}

///////////////////////////// 顯示使用者資料 /////////////////////////////

async function showData(userId) {
  console.log("userId", userId);
  Swal.fire({
    title: "讀取中...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
  try {
    const response = await axiosapi.get(`/member/profile/${userId}`);
    Swal.close();
    console.log("response.data", response.data);
    if (response.data.success !== false) {
      console.log("response.data.userDetail", response.data.userDetail);
      userDetail.value = response.data.userDetail;
      if (isUrl(response.data.userDetail.userPhoto)) {
        userPhoto.value = response.data.userDetail.userPhoto;
        photoPreview.value = response.data.userDetail.userPhoto;
      } else {
        userPhoto.value = photoPath + response.data.userDetail.userPhoto;
        photoPreview.value = photoPath + response.data.userDetail.userPhoto;
      }
    } else {
      console.error(response.data.message);
    }
  } catch (error) {}
  axiosapi
    .get(`/member/profile/${userId}`)
    .then(function (response) {
      console.log("response.data", response.data);
      if (response.data.success !== false) {
        console.log("response.data.userDetail", response.data.userDetail);
        userDetail.value = response.data.userDetail;
        if (isUrl(response.data.userDetail.userPhoto)) {
          userPhoto.value = response.data.userDetail.userPhoto;
          photoPreview.value = response.data.userDetail.userPhoto;
        } else {
          userPhoto.value = photoPath + response.data.userDetail.userPhoto;
          photoPreview.value = photoPath + response.data.userDetail.userPhoto;
        }
      } else {
        console.error(response.data.message);
      }
    })
    .catch(function (error) {
      console.error("Error fetching user details:", error);
    });
}

function isUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

///////////////////////////// 修改照片 /////////////////////////////

function clickFileInput() {
  document.getElementById("fileInput").click();
}
function previewPhoto(even) {
  const file = fileInput.value.files[0];
  if (file) {
    photo.value = file;
    photoPreview.value = URL.createObjectURL(file); //顯示預覽照片
  }
}

//更新使用者照片
async function uploadPhoto() {
  const formData = new FormData();
  console.log("photo.value:", photo.value);
  formData.append("myPhoto", photo.value);
  formData.forEach((value, key) => {
    console.log(`${key}:`, value);
  });
  document.querySelector("#updatePhotoModal").close();
  Swal.fire({
    title: "處理中...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
  try {
    const response = await axiosapi.put(
      `/member/profile/photo/${userStore.userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    Swal.close();

    if (response.data.success) {
      userPhoto.value = photoPath + response.data.newPhotoName;
      photoPreview.value = userPhoto.value;
      await Swal.fire({
        text: response.data.message,
        icon: "success",
        confirmButtonText: "確認",
        confirmButtonColor: "rgb(35 40 44)",
        allowOutsideClick: false,
      });
    } else {
      await Swal.fire({
        text: response.data.message,
        icon: "warning",
        confirmButtonText: "確認",
        confirmButtonColor: "rgb(35 40 44)",
        allowOutsideClick: false,
      });
      document.querySelector("#updatePhotoModal").show();
    }
  } catch (error) {
    Swal.fire({
      text: "更新失敗，請稍後再試。" + error.message,
      icon: "error",
      confirmButtonText: "確認",
      confirmButtonColor: "rgb(35 40 44)",
      allowOutsideClick: false,
    });
    document.querySelector("#updatePhotoModal").show();
  }
}

///////////////////////////// 修改密碼 /////////////////////////////

const showPassword = ref(false);
const showPassword2 = ref(false);
const showPassword3 = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
const togglePasswordVisibility2 = () => {
  showPassword2.value = !showPassword2.value;
};
const togglePasswordVisibility3 = () => {
  showPassword3.value = !showPassword3.value;
};

const uPwdInput = reactive({
  oldPwd: "",
  newPwd: "",
  checkPwd: "",
});

const changePwdInput = () => {
  uPwdInput.oldPwd = "hogehoge";
  uPwdInput.newPwd = "hogepassword";
  uPwdInput.checkPwd = "hogepassword";
};
function checkPwds() {
  if (uPwdInput.newPwd !== uPwdInput.checkPwd) {
    pwdMessage.value = "新密碼與確認密碼不一致";
  } else {
    pwdMessage.value = "";
  }
}

function checkPwdFomat() {
  let pedRE = new RegExp(/^[a-zA-Z0-9]+$/);
  if (uPwdInput.newPwd.length < 8) {
    pwdFomatMsg.value = "密碼太短";
    return;
  }
  if (uPwdInput.newPwd.length > 20) {
    pwdFomatMsg.value = "密碼太長";
    return;
  }
  if (!pedRE.test(uPwdInput.newPwd)) {
    pwdFomatMsg.value = "只能包含英文字母和數字";
    return;
  }
  pwdFomatMsg.value = "";
}
const isLoginDisabled = computed(function () {
  if (
    uPwdInput.oldPwd !== "" &&
    uPwdInput.newPwd !== "" &&
    uPwdInput.checkPwd !== "" &&
    pwdMessage.value === "" &&
    pwdFomatMsg.value === ""
  ) {
    return false; //可以按更新
  }
  return true;
});

async function updatePwd() {
  document.querySelector("#updatePwdModal").close();
  const result = await Swal.fire({
    title: "確認更新密碼",
    text: `您確定要更改密碼嗎？`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "確定",
    cancelButtonText: "取消",
    confirmButtonColor: "rgb(35 40 44)",
    cancelButtonColor: "#9e9e9e",
  });
  if (result.isConfirmed) {
    try {
      const response = await axiosapi.put(
        `changePassword/${userStore.userId}`,
        uPwdInput
      );

      if (response.data.success) {
        // document.querySelector("#updatePwdModal").close();
        Swal.fire({
          text: response.data.message,
          icon: "success",
          confirmButtonText: "確認",
          confirmButtonColor: "rgb(35 40 44)",
          allowOutsideClick: false,
        });
        uPwdInput.oldPwd = "";
        uPwdInput.newPwd = "";
        uPwdInput.checkPwd = "";
      } else {
        document.querySelector("#updatePwdModal").close();
        Swal.fire({
          text: response.data.message,
          icon: "warning",
          confirmButtonText: "確認",
          confirmButtonColor: "rgb(35 40 44)",
          allowOutsideClick: false,
        });
      }
    } catch {
      document.querySelector("#updatePwdModal").close();
      Swal.fire({
        text: "更新失敗，請稍後再試。" + error.message,
        icon: "error",
        confirmButtonText: "確認",
        confirmButtonColor: "rgb(35 40 44)",
        allowOutsideClick: false,
      });
    }
  } else {
    console.log("取消");
    document.querySelector("#updatePwdModal").showModal();
  }
}

function cancelChange() {
  uPwdInput.oldPwd = "";
  uPwdInput.newPwd = "";
  uPwdInput.checkPwd = "";
}
///////////////////////////// 其他 /////////////////////////////

onMounted(function () {
  window.addEventListener('resize', handleResize);
  handleResize(); // 初始化時調用一次
  console.log("Current auth header:", axiosapi.defaults.headers.authorization);
  showData(userStore.userId);

  ////////跳轉回到購買清單
  handleInitialView();
  if (route.params.initialView) {
    switchComps(route.params.initialView);
  }

});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (photoPreview.value) {
    URL.revokeObjectURL(photoPreview.value); // 釋放臨時 URL
  }
});

//////跳轉回到購買清單

function handleInitialView() {
  console.log("Handling initial view:", props.initialView);
  if (props.initialView) {
    switchComps(props.initialView);
  }
}

// 監聽路由參數變化
watch(
  () => props.initialView,
  (newView) => {
    console.log("initialView changed:", newView);
    if (newView) {
      switchComps(newView);
    }
  }
);

/////////////////響應式樣式//////////////////

// 新增的響應式邏輯
const isSidebarOpen = ref(true);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};


// 監聽窗口大小變化
const handleResize = () => {
  if (window.innerWidth > 768) {
    isSidebarOpen.value = true;
  } else {
    isSidebarOpen.value = false;
  }
};

</script>



<style scoped>
.responsive-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  overflow-y: auto;
  transition: transform 0.3s ease, width 0.3s ease;
  background-color: #000000;
  color: #ffffff;
}

.sidebar .ts-menu.is-dense.is-small .item {
  color: #ffffff;
}

.sidebar .ts-menu.is-dense.is-small .item:hover {
  background-color: #333333;
}

.main-content {
  flex-grow: 1;
  transition: margin-left 0.3s ease;
}

.sidebar-toggle {
  display: none;
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1001;
  background-color: var(--ts-primary);
  color: white;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.sidebar-hint {
  display: none;
  position: fixed;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px 10px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  cursor: pointer;
  z-index: 1000;
  transition: opacity 0.3s ease, transform 0.3s ease;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
}

.sidebar-hint .ts-icon {
  font-size: 24px;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    transform: translateX(-100%);
    z-index: 1000;
  }

  .sidebar.is-active {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
  }

  .sidebar-toggle {
    display: block;
  }

  .sidebar-hint {
    display: block;
    transform: translateY(-50%) translateX(-100%);
  }

  .sidebar-hint:not(.is-hidden) {
    transform: translateY(-50%) translateX(0);
  }

  .sidebar-hint.is-hidden {
    opacity: 0;
    pointer-events: none;
  }
}

.err-msg {
  color: red;
}
</style>