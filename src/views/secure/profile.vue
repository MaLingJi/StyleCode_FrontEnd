<template>
  <div class="ts-app-layout is-fullscreen is-horizontal">
    <div class="cell has-dark" style="width: 240px; color: var(--ts-white)">
      <div class="ts-content is-center-aligned">
        <div class="ts-wrap is-vertical is-compact is-middle-aligned">
          <div class="ts-image is-circular">
            <img :src="userPhoto" width="80" data-dialog="updatePhotoModal" />
          </div>
          <div class="ts-header">{{ userDetail?.userName }}</div>
        </div>
      </div>
      <div class="ts-divider"></div>
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
        <a class="item" @click="switchComps(card)">信用卡資訊</a>
        <a href="#!" class="item" data-dialog="updatePwdModal">修改密碼</a>
      </div>
      <div class="ts-divider has-top-spaced-small"></div>
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
        <a class="item">購買清單</a>
      </div>
      <div class="ts-divider has-top-spaced-small"></div>
      <a href="#!" class="ts-content is-interactive is-dense">
        <div class="ts-grid">
          <div class="column is-fluid">
            <div class="ts-text is-bold">管理文章</div>
          </div>
          <div class="column">
            <span class="ts-icon is-newspaper-icon"></span>
          </div>
        </div>
      </a>
      <div class="ts-menu is-dense is-small" style="opacity: 0.8">
        <a href="#!" class="item">我的文章</a>
        <a href="#!" class="item">收藏文章</a>
      </div>
    </div>
    <div class="cell is-fluid is-scrollable is-secondary">
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
            <div class="ts-input is-underlined has-top-spaced">
              <input type="text" v-model="uPwdInput.oldPwd" />
            </div>
            <div
              class="ts-text is-label has-top-spaced-large ts-wrap is-relaxed"
            >
              新密碼<span class="err-msg">{{ pwdFomatMsg }}</span>
            </div>
            <div class="ts-input is-underlined has-top-spaced">
              <input
                type="text"
                v-model="uPwdInput.newPwd"
                @change="checkPwdFomat"
              />
            </div>
            <div class="ts-text is-description">
              僅能是英文字母和數字，且最少 8 字，最多 20 字。
            </div>
            <div
              class="ts-text is-label has-top-spaced-large ts-wrap is-relaxed"
            >
              確認密碼<span class="err-msg">{{ pwdMessage }}</span>
            </div>
            <div class="ts-input is-underlined has-top-spaced">
              <input
                type="text"
                v-model="uPwdInput.checkPwd"
                @change="checkPwds"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="ts-divider"></div>
      <div class="ts-content is-tertiary">
        <div class="ts-wrap is-end-aligned">
          <button
            class="ts-button"
            :disabled="isLoginDisabled"
            @click="updatePwd"
          >
            更改密碼
          </button>
          <button class="ts-button is-outlined" data-dialog="updatePwdModal">
            取消
          </button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import userProfile from "@/components/profile/userProfile.vue";
import card from "@/components/profile/card.vue";

import {
  shallowRef,
  ref,
  onMounted,
  onUnmounted,
  reactive,
  computed,
} from "vue";
import axiosapi from "@/plugins/axios.js";
import useUserStore from "@/stores/user.js";
import Swal from "sweetalert2";

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

//切換components
function switchComps(comp) {
  currentComp.value = comp;
}

///////////////////////////// 顯示使用者資料 /////////////////////////////

function showData(userId) {
  console.log("userId", userId);
  axiosapi
    .get(`/member/profile/${userId}`)
    .then(function (response) {
      console.log("response.data", response.data);
      if (response.data.success !== false) {
        console.log("response.data.userDetail", response.data.userDetail);
        userDetail.value = response.data.userDetail;
        userPhoto.value = photoPath + response.data.userDetail.userPhoto;
        photoPreview.value = photoPath + response.data.userDetail.userPhoto;
      } else {
        console.error(response.data.message);
      }
    })
    .catch(function (error) {
      console.error("Error fetching user details:", error);
    });
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

    if (response.data.success) {
      userPhoto.value = photoPath + response.data.newPhotoName;
      photoPreview.value = userPhoto.value;
      document.querySelector("#updatePhotoModal").close();
      Swal.fire({
        text: response.data.message,
        icon: "success",
        confirmButtonText: "確認",
        allowOutsideClick: false,
      });
    } else {
      document.querySelector("#updatePhotoModal").close();
      Swal.fire({
        text: response.data.message,
        icon: "warning",
        confirmButtonText: "確認",
        allowOutsideClick: false,
        customClass: {
          container: "my-swal",
        },
      });
    }
  } catch (error) {
    document.querySelector("#updatePhotoModal").close();
    Swal.fire({
      text: "更新失敗，請稍後再試。" + error.message,
      icon: "error",
      confirmButtonText: "確認",
      allowOutsideClick: false,
    });
  }
}

///////////////////////////// 修改密碼 /////////////////////////////

const uPwdInput = reactive({
  oldPwd: "",
  newPwd: "",
  checkPwd: "",
});
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
  try {
    const response = await axiosapi.put(
      `changePassword/${userStore.userId}`,
      uPwdInput
    );

    if (response.data.success) {
      document.querySelector("#updatePwdModal").close();
      Swal.fire({
        text: response.data.message,
        icon: "success",
        confirmButtonText: "確認",
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
        allowOutsideClick: false,
      });
    }
  } catch {
    document.querySelector("#updatePwdModal").close();
    Swal.fire({
      text: "更新失敗，請稍後再試。" + error.message,
      icon: "error",
      confirmButtonText: "確認",
      allowOutsideClick: false,
    });
  }
}

///////////////////////////// 其他 /////////////////////////////

onMounted(function () {
  axiosapi.defaults.headers.authorization = `Bearer ${userStore.userToken}`;
  console.log("Current auth header:", axiosapi.defaults.headers.authorization);
  showData(userStore.userId);
});
onUnmounted(() => {
  if (photoUrl.value) {
    URL.revokeObjectURL(photoPreview.value); // 釋放臨時 URL
  }
});
</script>

<style scoped>
.err-msg {
  color: red;
}
</style>
