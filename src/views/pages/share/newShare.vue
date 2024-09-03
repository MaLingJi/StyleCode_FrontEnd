<template>
    <div class="ts-container">
        <div class="ts-app-layout is-horizontal">
            <div class="ts-grid">
                <div class="column is-fluid">
                    <div class="cell is-fluid is-vertical">
                        <div class="ts-grid">
                            <div class="ts-image">
                                <img :src="userPhoto" width="40">
                            </div>
                            <div class="ts-header">{{ userName }}</div>
                        </div>
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
                            <input class="ts-input" type="file" @change="handleFileUpload" accept="image/*" multiple />
                        </div>

                        <div class="image-previews">
                            <div v-for="(image, index) in imageFiles" :key="index" class="image-preview"
                                @mouseover="hoverIndex = index" @mouseleave="hoverIndex = null">
                                <img :src="image.previewUrl" alt="Preview Image" />
                                <div class="image-controls" v-if="hoverIndex === index">
                                    <i class="ts-icon is-pen-to-square-icon" @click="editImage(index)"></i>
                                    <i class="ts-icon is-trash-can-icon" @click="removeImage(index)"></i>
                                </div>
                            </div>
                        </div>

                        <br>
                        <button class="ts-button" @click="submitPost">送出文章</button>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="cell is-vertical">
                    <div class="ts-text is-heavy is-big">標籤</div>
                    <div class="ts-input">
                        <input type="text" placeholder="搜尋標籤…" v-model="inputTagValue" @blur="addTag" />
                    </div>
                    <div class="ts-chip">
                        <span v-for="(tag, index) in tags" :key="index" class="ts-label">
                            {{ tag }}
                        </span>
                    </div>
                    <div class="ts-input">
                        <input type="text" placeholder="搜尋標籤…" v-model="inputTagValue" @blur="addTag" />
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

const userPhotoPath = import.meta.env.VITE_USER_IMAGE_URL;
const postPhotoPath = import.meta.env.VITE_POST_IMAGE_URL;
const productPhotoPath = import.meta.env.VITE_PRODUCT_IMAGE_URL;

const router = useRouter();
const userStore = useUserStore();

const postTitle = ref('');
const contentText = ref('');
const imageFiles = ref([]);
const hoverIndex = ref(null);
const inputTagValue = ref('');
const tags = ref([]);
const userName = ref('');
const userPhoto = ref('');
const editingImageIndex = ref(null); // 用來追蹤正在編輯的圖片索引

const request = {
    headers: {
        Authorization: "Bearer " + userStore.userToken,
    },
};

function addTag() {
    if (inputTagValue.value.trim() !== '') {
        tags.value.push(inputTagValue.value.trim());
        inputTagValue.value = '';
    }
}

onMounted(() => {
    axiosapi.get(`/member/profile/${userStore.userId}`, request)
        .then(response => {
            userName.value = response.data.userDetail.userName;
            userPhoto.value = userPhotoPath + response.data.userDetail.userPhoto;
            console.log("userId: ", userPhoto.value);
        })
        .catch(error => {
            console.error('Error fetching URL:', error);
        });
});

function handleFileUpload(event) {
    const files = Array.from(event.target.files); // 获取多个文件
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (editingImageIndex.value !== null) {
                // 如果正在编辑，更新相应的图片
                imageFiles.value[editingImageIndex.value] = {
                    file,
                    previewUrl: e.target.result,
                };
                editingImageIndex.value = null; // 重置编辑索引
            } else {
                // 否则，添加新的图片
                imageFiles.value.push({
                    file,
                    previewUrl: e.target.result,
                });
            }
        };
        reader.readAsDataURL(file);
    });
}

function removeImage(index) {
    imageFiles.value.splice(index, 1);
}

function editImage(index) {
    editingImageIndex.value = index;
    document.querySelector('input[type="file"]').click(); // 觸發文件選擇器
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
        postDTO: {
            postTitle: postTitle.value,
            contentText: contentText.value,
            contentType: 'share',
            userId: userStore.userId
        },
        tagNames: tags.value
    };

    // 1. 先發送發文請求
    axiosapi.post("/post/postwithtags", postData)
        .then(postResponse => {
            const postId = postResponse.data.postId;
            console.log('User ID: ', userStore.userId);
            console.log('Post ID: ', postId);
            // 2. 如果有圖片，發送圖片上傳請求
            if (imageFiles.value.length > 0) {
                const formData = new FormData();
                formData.append('postId', postId);
                imageFiles.value.forEach(file => {
                    formData.append('file', file.file);
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

<style scoped>
.ts-chip .ts-label {
    background-color: #9d7e7e;
    padding: 5px 5px;
    border-radius: 10px;
}

.image-previews {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.image-preview {
    position: relative;
    width: 100px;
    height: 100px;
}

.image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
}

.image-controls {
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    gap: 5px;
    padding: 5px;
    border-radius: 5px;
    cursor: pointer;
}
</style>
