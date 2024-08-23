<template>
    <div class="ts-app-center" style="height: 85vh;">
        <div class="content">
            <div class="ts-header is-large is-heavy is-icon">
                <div class="ts-icon is-face-smile-icon"></div>
                登入
            </div>
            <div class="ts-box has-top-spaced-large" style="width: 400px">
            <div class="ts-content">
                <div class="ts-wrap is-vertical">
                    <div class="ts-text is-label">電子信箱地址</div>
                    <div class="ts-input is-start-icon">
                        <span class="ts-icon is-envelope-icon"></span>
                        <input type="email" v-model="userEmail" @change="checkEmail"/>
                    </div>
                    <div id="err-msg">{{ emailMsg }}</div>
                    <div class="ts-text is-label">密碼</div>
                    <div class="ts-input is-start-icon">
                        <span class="ts-icon is-lock-icon"></span>
                        <input type="password" v-model="password" @change="checkPwdFomat"/>
                    </div>
                    <div id="err-msg">{{ pwdFomatMsg }}</div>
                    <div id="err-msg">{{ message }}</div>
                    <button class="ts-button is-fluid" @click="login" :disabled="isLoginDisabled">登入</button>
                    <div class="ts-divider is-center-text">
                        <div class="ts-text is-description">
                            或是透過下列方式登入
                        </div>
                    </div>
                    <button class="ts-button is-fluid is-start-icon is-outlined">
                        <span class="ts-icon is-google-icon"></span> Google
                    </button>

                    <p class="ts-text is-center-aligned">新朋友? <RouterLink to="/secure/register">去註冊</RouterLink></p>
                </div>
            </div>
        </div>
    </div>
</div>

</template>
    
<script setup>
    import { ref,computed } from 'vue';
    import axiosapi from "@/plugins/axios.js"
    import Swal from 'sweetalert2';
    import { useRouter } from 'vue-router';
    import useUserStore from "@/stores/user.js"
    

    const userEmail = ref("");
    const password = ref("");
    const message = ref("");
    const router = useRouter();
    const userStore = useUserStore();
    const pwdFomatMsg = ref("");
    const emailMsg = ref("");

    //其中一個欄位沒輸入就不給按登入
    const isLoginDisabled = computed(function(){
        if(userEmail.value !== '' && password.value !== '' && pwdFomatMsg.value === '' && emailMsg.value === ''){
            return false;//可以按登入
        }
        return true;
    })

    function checkEmail(){
        let emailRE = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        if(!emailRE.test(userEmail.value)){
            emailMsg.value = "格式不正確"
            return;
        }
    }
    function checkPwdFomat(){
        let pedRE = new RegExp(/^[a-zA-Z0-9]+$/);
        if(password.value.length < 8){
            pwdFomatMsg.value = "密碼太短";
            return;
        }
        if(password.value.length > 20){
            pwdFomatMsg.value = "密碼太長";
            return;
        }
        if(!pedRE.test(password.value)){
            pwdFomatMsg.value = "只能包含英文字母和數字";
            return;
        }
        pwdFomatMsg.value = "";
    }
    
    function login(){

        //pinia 清空資料
        axiosapi.defaults.headers.authorization = "";
        userStore.setUserId("");
        userStore.setLogedin(false);

        let request = {
            userEmail : userEmail.value,
            userPwd : password.value
        }

        axiosapi.post("/login",request)
        .then(function(response){
            console.log("response",response);
            if(response.data.success){
                Swal.fire({
                    text: response.data.message,
                    icon: "success",
                    confirmButtonText: '確認',
                    allowOutsideClick: false
                }).then(function(result){
                    
                    //使用者資訊存到localStorage
                    axiosapi.defaults.headers.authorization = `Bearer ${response.data.token}`;
                    userStore.setUserId(response.data.userId);
                    userStore.setUserToken(response.data.token);
                    userStore.setPermissions(response.data.permissions);
                    userStore.setLogedin(true);

                    //跳轉首頁
                    router.push({path:"/"});
                })
            }else{
                message.value = response.data.message;
            }
        })
        .catch(function(error){
            console.log("error",error);
            Swal.fire({
                text: "錯誤：" + error,
                icon: "error"
            });
        });
    }
</script>
    
<style scoped>
    #err-msg{
        color: red;
    }
</style>