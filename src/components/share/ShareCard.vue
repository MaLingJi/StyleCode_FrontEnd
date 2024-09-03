<template>
    <div class="ts-box" @click="navigateToShareDetails(props.post.postId)">
        <div class="ts-image">
            <img :src="imgUrl" />
        </div>
        <div class="ts-divider"></div>
        <div class="ts-content">
            暱稱: {{ props.post.userName ? props.post.userName : 'Unknown User' }}
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// import Swal from 'sweetalert2';
const path = import.meta.env.VITE_POST_IMAGE_URL;
const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});
const imgUrl = ref('');
const router = useRouter();

onMounted(() => {
    console.log("Received post:", props.post);
    // 确保post存在
    if (props.post && props.post.images && props.post.images.length > 0) {
        imgUrl.value = `${path}${props.post.images[0].imgUrl}`;
    }
});

function navigateToShareDetails(postId) {
  router.push({ name: 'shareDetails-link', params: { postId } });
}
</script>

<style></style>