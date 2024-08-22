<template>
            <div class="ts-app-center" style="height: 85vh;">
        <div class="content">
            <div class="ts-header is-large is-heavy is-icon">
                <div class="ts-icon is-face-smile-icon"></div>
                註冊會員
            </div>
            <div class="ts-box has-top-spaced-large" style="width: 400px">
            <div class="ts-content">
                <div class="ts-wrap is-vertical">
                    <div class="ts-text is-label">電子信箱地址</div>
                    <div class="ts-input">
                        <input type="text" />
                    </div>
                    <div class="ts-text is-label">密碼</div>
                    <div class="ts-input">
                        <input type="password" />
                    </div>
                    <div class="ts-text is-description">僅能是英文字母和數字，且最少 8 字，最多 80 字。</div>
                    <div class="ts-text is-label">確認密碼</div>
                    <div class="ts-input">
                        <input type="password" />
                    </div>
                    <button class="ts-button is-fluid">註冊</button>
                    <div class="ts-divider is-center-text">
                        <div class="ts-text is-description">
                            或是透過下列方式註冊
                        </div>
                    </div>
                    <button class="ts-button is-fluid is-start-icon is-outlined">
                        <span class="ts-icon is-google-icon"></span> Google
                    </button>
                    <p class="ts-text is-center-aligned">已有帳號? <RouterLink to="/secure/register">去登入</RouterLink></p>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
    
<script setup lang='ts'>
    import { ref } from 'vue';
    import axios from 'axios';

    const userEmail = ref("");
    const password = ref("");
    const checkPwd = ref("");




</script>
    
<style scoped>
    
</style>