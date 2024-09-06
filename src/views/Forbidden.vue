<template>
  <a-result status="403" title="403" sub-title="很抱歉，您沒有權限訪問此頁面。">
    <template #extra>
      <router-link to="/secure/login" tag="a">
        <a-button class="ts-x-50">前往登入</a-button>
      </router-link>
    </template>
  </a-result>
</template>

<script setup></script>
