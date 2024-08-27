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
                            <input class="ts-input" type="file" @change="handleFileUpload" accept="image/*" />
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
const imageFile = ref(null);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        imageFile.value = file;
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

    const postData = {
        postTitle: postTitle.value,
        contentText: contentText.value,
        contentType: 'share',
        userDetail: {
            id: 2,
        }
    };

    // 1. 先發送發文請求
    axiosapi.post("/api/post", postData)
        .then(postResponse => {
            const postId = postResponse.data.postId;

            // 2. 如果有圖片，發送圖片上傳請求
            if (imageFile.value) {
                const formData = new FormData();
                formData.append('postId', postId);
                formData.append('file', imageFile.value);

                return axiosapi.post("/api/images", formData, {
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

// onMounted(function () {
//     callFind();
// });

// function callFind() {
//     console.log("callFind");
//     Swal.fire({
//         text: "Loading......",
//         showConfirmButton: false,
//         allowOutsideClick: false,
//     });
//     axiosapi.get("/post").then(function (response) {
//         console.log("response: ", response);

//         posts.value = response.data;
//         // console.log("posts.value: ", posts.value);

//         setTimeout(function () {
//             Swal.close();
//         }, 500);
//     }).catch(function (error) {
//         console.log("callFind error", error);
//         Swal.fire({
//             text: '失敗：' + error.message,
//             icon: 'error',
//             allowOutsideClick: false,
//             confirmButtonText: '確認',
//         });
//     });
// }
</script>

<style></style>