<template>
    <div class="ts-container">
        <div class="ts-app-layout is-horizontal">
            <div class="ts-grid">
                <div class="column is-fluid">
                    <div class="cell is-fluid is-vertical">
                        <div class="ts-header">發文暱稱: {{ userStore.userId }}</div>
                        <div class="ts-divider"></div>
                        <div class="ts-text is-heavy is-big">標題</div>
                        <div class="ts-input is-solid">
                            <textarea v-model="postTitle" placeholder="請輸入文章標題"></textarea>
                        </div>
                        <div class="ts-text is-heavy is-big">內容</div>
                        <div class="ts-input is-solid">
                            <textarea v-model="contentText" placeholder="請輸入文章內容"></textarea>
                        </div>
                        <div class="ts-text is-heavy is-big">上傳圖片</div>
                        <div class="ts-file">
                            <input class="ts-input" type="file" @change="handleFileUpload" accept="image/*" multiple/>
                        </div>
                        <br>
                        <button class="ts-button" @click="submitPost">送出文章</button>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="cell is-vertical">
                    <h2>標籤</h2>
                    <div class="ts-input is-solid">
                        <textarea name="" id="">123</textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axiosapi from '@/plugins/axios.js';
import Swal from 'sweetalert2';
import useUserStore from "@/stores/user.js"

const router = useRouter();
const userStore = useUserStore();


const postTitle = ref('');
const contentText = ref('');
const imageFiles = ref([]);
// const userName = ref('');

// onMounted(() => {
//     axiosapi.get(`/member/profile/${userStore.userId}`, {
//                     headers: {
//                         'Authorization': `${userStore.userToken}`
//                     }
//                 })
//         .then(response => {
//             getUserData = response.data;
//             console.log("userStore: ", getUserData);
            
            
//         })
//         .catch(error => {
//             console.error('Error fetching image URL:', error);
//         });

// });

function handleFileUpload(event) {
    imageFiles.value = Array.from(event.target.files);
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

    if (imageFiles.value.length === 0) {
        Swal.fire({
            text: '至少上傳一張圖片',
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

    const postData = {
        postTitle: postTitle.value,
        contentText: contentText.value,
        contentType: 'share',
        userDetail: {
            id: userStore.userId,
        }
    };

    // 1. 先發送發文請求
    axiosapi.post("/post", postData)
        .then(postResponse => {
            const postId = postResponse.data.postId;
            console.log('User ID:', userStore.userId);
            // 2. 如果有圖片，發送圖片上傳請求
            if (imageFiles.value.length > 0) {
                const formData = new FormData();
                formData.append('postId', postId);
                imageFiles.value.forEach(file => {
                    formData.append('file', file);
                });

                return axiosapi.post("/images", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
        })
        .then(() => {
            Swal.close();
            Swal.fire({
                text: '發文成功',
                icon: 'success',
                confirmButtonText: '確認',
            }).then(() => {
                router.push('/share'); // 跳轉到文章列表頁面或其他頁面
            });
        })
        .catch(error => {
            Swal.close();
            Swal.fire({
                text: '發文失敗：' + error.message,
                icon: 'error',
                confirmButtonText: '確認',
            });
        });
}

</script>

<style></style>