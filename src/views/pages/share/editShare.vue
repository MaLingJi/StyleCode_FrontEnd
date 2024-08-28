<template>
    <div class="ts-container">
        <div class="ts-app-layout is-horizontal">
            <div class="cell is-fluid is-vertical">
                <div class="ts-header">發文暱稱: {{ userStore.userId }}</div>
                <div class="ts-divider"></div>
                <h2>標題</h2>
                <div class="ts-input is-solid">
                    <textarea v-model="postTitle"></textarea>
                </div>
                <h2>內容</h2>
                <div class="ts-input is-solid">
                    <textarea v-model="contentText"></textarea>
                </div>
                <h2>圖片</h2>
                <div class="ts-input is-solid">
                    <input type="file" @change="handleFileChange" accept="image/*" multiple>
                </div>
                <div v-if="images.length" class="ts-images">
                    <div v-for="image in images" :key="image.id" class="ts-image">
                        <img :src="image.imgUrl" />
                    </div>
                </div>
                <br>
                <button class="ts-button" @click="submitPost">更新文章</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axiosapi from '@/plugins/axios.js';
import useUserStore from "@/stores/user.js";
import Swal from 'sweetalert2';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const postId = ref(route.params.postId || null);
const postTitle = ref('');
const contentText = ref('');
const images = ref([]);
const imageId = ref('');
const props = defineProps(["post"]);

onMounted(() => {
    // console.log('Post ID:', postId.value);
    // console.log('Route Params:', route.params);
    if (postId.value) {
        loadPostData(postId.value);
    }
    axiosapi.get(`/images/post/${postId.value}`)
        .then(response => {
            const data = response.data;
            imageId.value = data[0].imageId;
        })
        .catch(error => {
            console.error('Error fetching image URL:', error);
        });
    // console.log(imageId.value);
    // console.log(imageId.value != null ? "Null" : "!Null");
});

const loadPostData = async (id) => {
    try {
        const response = await axiosapi.get(`/post/${id}`);
        const postData = response.data;
        console.log("postData: ", postData);
        postTitle.value = postData.postTitle;
        contentText.value = postData.contentText;
        images.value = postData.images || [];
    } catch (error) {
        console.error('Error loading post data:', error);
    }
};

function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
        images.value = file;
        // console.log(images);
    }
}

function submitPost() {
    if (!postTitle.value || !contentText.value) {
        Swal.fire({
            text: '標題和內容不能為空',
            icon: 'warning',
            confirmButtonText: '確認',
        });
        return;
    }

    Swal.fire({
        text: "發文中......",
        showConfirmButton: false,
        allowOutsideClick: false,
    });

    const putData = {
        postTitle: postTitle.value,
        contentText: contentText.value,
        contentType: '分享',
        userDetail: {
            id: userStore.userId,
        }
    };

    // 1. 先發送發文請求
    axiosapi.put(`/post/${postId.value}`, putData)
        .then(postResponse => {
            const postId = postResponse.data.postId;

            // 2. 如果有圖片，發送圖片上傳請求
            if (images.value) {
                // console.log('Post ID value during submit:', postId.value);
                // console.log('Post ID during submit:', postId);
                // console.log(images.value);
                const formData = new FormData();
                formData.append('postId', postId);
                formData.append('file', images.value);

                // if (imageId) {
                return axiosapi.put(`/images/${imageId.value}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                // } else {
                //     return axiosapi.post("/images", formData, {
                //         headers: {
                //             'Content-Type': 'multipart/form-data'
                //         }
                //     })
                // }
            }
        })
        .then(() => {
            Swal.close();
            Swal.fire({
                text: '更新成功',
                icon: 'success',
                confirmButtonText: '確認',
            }).then(() => {
                router.push('/share'); // 跳轉到文章列表頁面或其他頁面
            });
        })
        .catch(error => {
            Swal.close();
            Swal.fire({
                text: '更新失敗：' + error.message,
                icon: 'error',
                confirmButtonText: '確認',
            });
        });
}

// const submitPost = () => {
//     const postData = {
//         postTitle: postTitle.value,
//         contentText: contentText.value,
//         contentType: '分享',
//         images: images.value,
//         userDetail: {
//             id: 2,
//         }
//     };

//     axiosapi.put(`/post/${postId.value}`, postData)
//         .then(response => {
//             console.log('Post updated successfully');
//             router.push('/share');  // 更新成功後跳轉回主頁或其他頁面
//         })
//         .catch(error => {
//             console.error('Error updating post:', error);
//         });
// };
</script>

<style></style>
