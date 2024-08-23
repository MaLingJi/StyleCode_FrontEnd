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
    import axiosapi from '@/plugins/axios.js';
    const path = import.meta.env.VITE_POST_IMAGE_URL;
    const props = defineProps(["post"]);
    const imgUrl = ref('');

    onMounted(() => {
    axiosapi.get(`http://localhost:8080/images/post/${props.post.postId}`)
        .then(response => {
            const data = response.data;
            let imagePath = data[0].imgUrl;
            imgUrl.value = `${path}${imagePath}`;
            console.log(imgUrl.value);  // 確保這裡打印的是正確的 URL
        })
        .catch(error => {
            console.error('Error fetching image URL:', error);
        });
});
</script>

<style></style>