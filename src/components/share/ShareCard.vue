<template>
    <h2>Share</h2>
    <div class="column">
        <div class="ts-box">
            <div class="ts-image">
                <img src="../../../public/No_image.png" />
            </div>
            <div class="ts-divider"></div>
            <div class="ts-content">{{ post.contentText }}</div>
        </div>
    </div>
</template>

<script setup>
    const props = defineProps(["post"]);
</script>

<style></style>