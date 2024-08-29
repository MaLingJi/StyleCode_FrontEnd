<template>
    <div v-if="!post.deletedAt" class="ts-box" @click="navigateToShareDetails(props.post.postId)">
        <div class="ts-image">
            <img :src="imgUrl" />
        </div>
        <div class="ts-divider"></div>
        <div class="ts-content">
            暱稱: {{ props.post.userName ? props.post.userName : 'Unknown User' }}
        </div>
        <!-- <div class="ts-content">
            內容: {{ props.post.contentText }}
        </div> -->
        <!-- <div class="ts-content">
            <button class="ts-button is-small" @click="editPost">編輯</button>
            <button class="ts-button is-small is-negative" @click="deletePost">刪除</button>
        </div> -->
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axiosapi from '@/plugins/axios.js';
import { useRouter } from 'vue-router';
// import Swal from 'sweetalert2';
const path = import.meta.env.VITE_POST_IMAGE_URL;
const props = defineProps(["post"]);
const imgUrl = ref('');
const router = useRouter();

onMounted(() => {
    // console.log(props.post.userName);
    axiosapi.get(`/images/post/${props.post.postId}`)
        .then(response => {
            const data = response.data;
            let imagePath = data[0].imgUrl;
            imgUrl.value = `${path}${imagePath}`;
        })
        .catch(error => {
            console.error('Error fetching image URL:', error);
        });
});

function navigateToShareDetails(postId) {
  router.push({ name: 'shareDetails-link', params: { postId } });
}
// const editPost = () => {
//     router.push({ name: "edit-share-link", params: { postId: props.post.postId } });
// };

// const deletePost = () => {
//     axiosapi.delete(`/post/${props.post.postId}`)
//         .then(() => {
//             Swal.close();
//             Swal.fire({
//                 text: '刪除成功',
//                 icon: 'success',
//                 confirmButtonText: '確認',
//             }).then(() => {
//                 router.go(0); // 跳轉到文章列表頁面或其他頁面
//             });
//         })
//         .catch(error => {
//             Swal.close();
//             Swal.fire({
//                 text: '刪除失敗：' + error.message,
//                 icon: 'error',
//                 confirmButtonText: '確認',
//             });
//         });
// };
</script>

<style></style>