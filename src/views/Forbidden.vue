<template>
    <a-result status="403" title="403" sub-title="抱歉，您無權訪問此頁面。">
    <template #extra>
        <router-link to="/" tag="a">
        <a-button type="primary">回首頁</a-button>
        </router-link>
    </template>
    </a-result>
</template>

<script setup>

</script>

<style scoped>

</style>