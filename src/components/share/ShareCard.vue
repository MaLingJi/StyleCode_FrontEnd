<template>
    <div class="ts-box">
        <div class="ts-image">
            <img :src="imgUrl" />
        </div>
        <div class="ts-divider"></div>
        <div class="ts-content">{{ props.post.contentText }}</div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const props = defineProps(["post"]);

const imgUrl = ref('');

onMounted(async () => {
    const response = await fetch(`http://localhost:8080/images/post/${props.post.postId}`);
    const data = await response.json();
    let imagePath = data[0].imgUrl;
    imgUrl.value = `http://localhost:8080/image/${imagePath}`;
    console.log(imgUrl.value);
});
</script>

<style></style>