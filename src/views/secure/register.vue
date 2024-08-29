<template>
    <div class="ts-app-center" style="height: 85vh;">
        <div class="content">
            <div class="ts-header is-large is-heavy is-icon">
                <div class="ts-icon is-face-kiss-wink-heart-icon"></div>
                註冊會員
            </div>
            <div class="ts-box has-top-spaced-large" style="width: 400px">
                <div class="ts-content">
                    <div class="ts-wrap is-vertical">
                        <div class="ts-text is-label">電子信箱地址</div>
                        <div class="ts-input">
                            <input type="text" v-model="userEmail" @change="checkEmail" />
                        </div>
                        <div class="err-msg">{{ emailMsg }}</div>
                        <div class="ts-text is-label">密碼</div>
                        <div class="ts-input">
                            <input type="password" v-model="password" @change="checkPwdFomat" />
                        </div>
                        <div class="err-msg">{{ pwdFomatMsg }}</div>
                        <div class="ts-text is-description">僅能是英文字母和數字，且最少 8 字，最多 20 字。</div>
                        <div class="ts-text is-label">確認密碼</div>
                        <div class="ts-input">
                            <input type="password" v-model="checkPwd" @change="checkPwds" />
                        </div>
                        <div class="err-msg">{{ pwdMessage }}</div>
                        <button class="ts-button is-fluid" :disabled="isLoginDisabled" @click="register">註冊</button>
                        <div class="ts-divider is-center-text">
                            <div class="ts-text is-description">
                                或是透過下列方式註冊
                            </div>
                        </div>
                        <button class="ts-button is-fluid is-start-icon is-outlined">
                            <span class="ts-icon is-google-icon"></span> Google
                        </button>
                        <p class="ts-text is-center-aligned">已有帳號? <RouterLink to="/secure/login">去登入</RouterLink>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, computed } from 'vue';
import axiosapi from "@/plugins/axios.js"
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';


const userEmail = ref("");
const password = ref("");
const checkPwd = ref("");
const pwdMessage = ref("");
const pwdFomatMsg = ref("");
const emailMsg = ref("");
const router = useRouter();

const isLoginDisabled = computed(function () {
    if (userEmail.value !== '' && password.value !== '' && checkPwd.value !== ''
        && password.value === checkPwd.value && pwdFomatMsg.value === '' && emailMsg.value === '') {
        return false;//可以按註冊
    }
    return true;
});

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

function checkPwds() {
    if (password.value !== checkPwd.value) {
        pwdMessage.value = '密碼與確認密碼不一致';
        console.log("密碼與確認密碼不一致");
    } else {
        pwdMessage.value = '';
    }
}

function checkEmail() {

    let emailRE = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    if (!emailRE.test(userEmail.value)) {
        emailMsg.value = "格式不正確"
        return;
    }

    let request = {
        userEmail: userEmail.value
    }

    axiosapi.post("/api/checkEmail", request)
        .then(function (response) {
            // console.log("response", response);
            if (response.data == "Y") {
                emailMsg.value = "此帳號已被註冊";
            } else {
                emailMsg.value = "";
            }
        })
}

function register() {

    let request = {
        userEmail: userEmail.value,
        userPwd: password.value
    }

    axiosapi.post("/api/register", request)
        .then(function (response) {
            Swal.fire({
                text: response.data,
                icon: "success",
                confirmButtonText: '確認',
                allowOutsideClick: false
            }).then(function (result) {
                router.push({ path: "/secure/login" })
            })
        })
}



</script>

<style scoped>
.err-msg {
    color: red;
}
</style>