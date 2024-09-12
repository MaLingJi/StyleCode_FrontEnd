<template>
  <div class="ts-app-center" style="height: 85vh">
    <div class="content">
      <div class="ts-header is-huge is-heavy is-icon">
        <div>
          <img
            src="/MDFK-removebg-preview.png"
            alt="logo"
            style="width: 150px"
          />
        </div>
        登入
      </div>
      <div class="ts-box has-top-spaced-large" style="width: 400px">
        <div class="ts-content">
          <div class="ts-wrap is-vertical">
            <div class="ts-text is-label">電子信箱地址</div>
            <div class="ts-input is-start-icon">
              <span class="ts-icon is-envelope-icon"></span>
              <input type="email" v-model="userEmail" @input="checkEmail" />
            </div>
            <div id="err-msg">{{ emailMsg }}</div>
            <div class="ts-text is-label">密碼</div>
            <div class="ts-input is-icon">
              <span class="ts-icon is-lock-icon"></span>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                @input="checkPwdFomat"
              />
              <span
                :class="[
                  'ts-icon',
                  showPassword ? 'is-eye-icon' : 'is-eye-slash-icon',
                ]"
                @click="togglePasswordVisibility"
              ></span>
            </div>
            <div id="err-msg">{{ pwdFomatMsg }}</div>
            <div id="err-msg">{{ message }}</div>
            <button
              class="ts-button is-fluid"
              @click="login"
              :disabled="isLoginDisabled"
            >
              登入
            </button>
            <div class="ts-divider is-center-text">
              <div class="ts-text is-description">快捷輸入</div>
            </div>
            <div class="ts-grid is-spaced-between">
              <button
                class="ts-button is-start-icon is-outlined is-2-wide"
                style="width: 45%"
                @click="updateFields"
              >
                <span class="ts-icon is-pen-icon"></span> hoge123
              </button>
              <button
                class="ts-button is-start-icon is-outlined is-2-wide"
                style="width: 45%"
                @click="adminInput"
              >
                <span class="ts-icon is-pen-icon"></span> 管理員
              </button>
            </div>
            <div class="ts-divider is-center-text">
              <div class="ts-text is-description">或是透過下列方式登入</div>
            </div>
            <button
              class="ts-button is-fluid is-start-icon is-outlined"
              @click="toGoogleLogin"
            >
              <span class="ts-icon is-google-icon"></span>
              Google
            </button>

            <p class="ts-text is-center-aligned">
              新朋友?
              <RouterLink
                to="/secure/register"
                class="link ts-text is-underlined"
                >去註冊</RouterLink
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import axiosapi from "@/plugins/axios.js";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import useUserStore from "@/stores/user.js";
import { useCart } from '@/services/cartService';

const { fetchCartCount } = useCart();
const userEmail = ref("");
const password = ref("");
const message = ref("");
const router = useRouter();
const userStore = useUserStore();
const pwdFomatMsg = ref("");
const emailMsg = ref("");
const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

//其中一個欄位沒輸入就不給按登入
const isLoginDisabled = computed(function () {
  if (
    userEmail.value !== "" &&
    password.value !== "" &&
    pwdFomatMsg.value === "" &&
    emailMsg.value === ""
  ) {
    return false; //可以按登入
  }
  return true;
});

//管理員快捷輸入
const adminInput = () => {
  userEmail.value = "hoge@gmail.com";
  password.value = "hogehoge";
};

const updateFields = () => {
  userEmail.value = "hoge123@gmail.com";
  password.value = "hogehoge";
};

function checkEmail() {
  let emailRE = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
  if (!emailRE.test(userEmail.value)) {
    emailMsg.value = "格式不正確";
    return;
  } else {
    emailMsg.value = ""; // 格式正確時清除錯誤訊息
  }
}
function checkPwdFomat() {
  let pedRE = new RegExp(/^[a-zA-Z0-9]+$/);
  if (password.value.length < 8) {
    pwdFomatMsg.value = "密碼太短";
    return;
  }
  if (password.value.length > 20) {
    pwdFomatMsg.value = "密碼太長";
    return;
  }
  if (!pedRE.test(password.value)) {
    pwdFomatMsg.value = "只能包含英文字母和數字";
    return;
  }
  pwdFomatMsg.value = "";
}

function login() {
  //pinia 清空資料
  axiosapi.defaults.headers.authorization = "";
  userStore.setUserId("");
  userStore.setLogedin(false);

  let request = {
    userEmail: userEmail.value,
    userPwd: password.value,
  };

  axiosapi
    .post("/login", request)
    .then(function (response) {
      console.log("response", response);
      if (response.data.success) {
        Swal.fire({
          text: response.data.message,
          icon: "success",
          confirmButtonText: "確認",
          confirmButtonColor: "rgb(35 40 44)",
          allowOutsideClick: false,
        }).then(function (result) {
          //使用者資訊存到localStorage
          axiosapi.defaults.headers.authorization = `Bearer ${response.data.token}`;
          const expirationTime = new Date(
            new Date().getTime() + 100 * 60 * 1000
          ); //100分鐘
          userStore.setExpirationTime(expirationTime.toISOString()); // 使用ISO字串格式保存
          userStore.setUserId(response.data.userId);
          userStore.setUserToken(response.data.token);
          userStore.setPermissions(response.data.permissions);
          userStore.setLogedin(true);
          //購物車通知 使用者登出後再登入會再抓一次
          fetchCartCount(userStore.userId)
          //跳轉首頁
          router.push({ path: "/" });
        });
      } else {
        message.value = response.data.message;
      }
    })
    .catch(function (error) {
      console.log("error", error);
      Swal.fire({
        text: "錯誤：" + error,
        icon: "error",
      });
    });
}
function toGoogleLogin() {
  console.log("googleLogin");
  window.location.href = `${import.meta.env.VITE_API_URL}/google-login`;
}
</script>

<style scoped>
#err-msg {
  color: red;
}
.link:hover {
  color: cornflowerblue;
}
</style>
