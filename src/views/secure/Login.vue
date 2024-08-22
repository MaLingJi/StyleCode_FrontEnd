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
                        <input type="text" v-model="userEmail"/>
                    </div>
                    <div class="ts-text is-label">密碼</div>
                    <div class="ts-input is-start-icon">
                        <span class="ts-icon is-lock-icon"></span>
                        <input type="password" v-model="password"/>
                    </div>
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
    import axios from 'axios';
    import Swal from 'sweetalert2';

    const userEmail = ref("");
    const password = ref("");
    const message = ref("");

    //其中一個欄位沒輸入就不給按登入
    const isLoginDisabled = computed(function(){
        if(userEmail.value !== '' && password.value !== ''){
            return false;
        }
        return true;
    })
    
    function login(){
        let request = {
            userEmail : userEmail.value,
            userPwd : password.value
        }

        axios.post("http://localhost:8080/login",request)
        .then(function(response){
            console.log("response",response);
            if(response.data.success){
                Swal.fire({
                    text: response.data.message,
                    icon: "success",
                    confirmButtonText: '確認'
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