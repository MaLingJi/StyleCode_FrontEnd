<template>
    <a-result status="404" title="404" sub-title="抱歉，您造訪的頁面不存在。">
        <template #extra>
            <router-link to="/" tag="a">
                <a-button  class="ts-x-50">回首頁</a-button>
            </router-link>
        </template>
    </a-result>
</template>

<script setup>

</script>

<style></style>