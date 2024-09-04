<template>
  <div class="forbidden">
    <h1>403 - 沒有權限</h1>
    <p>很抱歉，您沒有權限訪問此頁面。</p>
    <button @click="redirectToLogin" class="ts-button is-primary">前往登入</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const redirectToLogin = () => {
  router.push({ name: 'longin-ling' });
};
</script>