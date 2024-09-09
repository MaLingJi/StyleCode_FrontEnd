<template>
    <div class="edit-container">
        <div class="post-form-wrapper">
            <h1>編輯文章</h1>
            <div>
                <label for="title">標題:</label>
                <input type="text" id="title" v-model="post.postTitle" disabled />
            </div>
            <div>
                <label for="content">內容:</label>
                <textarea id="content" v-model="post.contentText" class="textarea" rows="4"></textarea>
            </div>
            <div class="clearfix">
                <a-upload
                    v-model:file-list="fileList"
                    list-type="picture-card"
                    :max-count="3"
                    :multiple="true"
                    @preview="handlePreview"
                    @remove="handleRemove"
                    @change="handleChange"
                >
                    <div v-if="fileList.length < 3">
                        <PlusOutlined />
                        <div style="margin-top: 8px">上傳</div>
                    </div>
                </a-upload>
                <a-modal 
                :open="previewVisible" 
                :title="previewTitle" 
                :footer="null" 
                @cancel="handleCancel"
                >
                <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
            </div>
            <div class="button-container">
                <button class="update-button" @click="updatePost">更新文章</button>
                <button class="delete-button" @click="deletePost">刪除文章</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axiosapi from '@/plugins/axios.js';
import { PlusOutlined } from '@ant-design/icons-vue';
import Swal from 'sweetalert2'

const route = useRoute();
const router = useRouter();
const postId = route.params.id; // 獲取 postId
const path = import.meta.env.VITE_POST_IMAGE_URL;
const post = ref({
    postId: postId,
    postTitle: '',
    contentText: '',
    images: []
});

const fileList = ref([]);
const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');

onMounted(async () => {
    try {
        const response = await axiosapi.get(`/post/${postId}`);
        post.value = response.data;
        if (post.value.images) {
            post.value.images.filter(image => !image.deletedAt).forEach(image => {
                fileList.value.push({
                    uid: image.imageId,
                    name: image.imgUrl,
                    status: 'done',
                    url: `${path}/${image.imgUrl}`,
                });
            });
        }
    } catch (error) {
        console.error('獲取文章數據失敗:', error.response ? error.response.data : error);
    }
});

const handleCancel = () => {
    previewVisible.value = false;
    previewTitle.value = '';
};

const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
    }
    previewImage.value = file.url || file.preview;
    previewVisible.value = true;
    previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);

    // setTimeout(() => {
    //     document.querySelector('.ant-modal').focus();
    // }, 300);
    };

    const handleRemove = async (file) => {
    try {
        console.log(`正在刪除影像: /images/${file.uid}`);
        const response = await axiosapi.delete(`/images/${file.uid}`);
        console.log(`圖片已刪除: ${response.data}`);
        // 從 fileList 中移除已刪除的圖片
        fileList.value = fileList.value.filter(item => item.uid !== file.uid);
    } catch (error) {
        console.error('刪除影像時發生錯誤:', error.response ? error.response.data : error.message);
    }
};

        const handleChange = async (info) => {
            fileList.value = info.fileList;

            for (const file of info.fileList) {
                if (file.status === 'done' && file.originFileObj) {
                const formData = new FormData();
                formData.append('file', file.originFileObj);
                formData.append('postId', postId);

            try {
                const response = await axiosapi.post(`/images`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log('圖片已上傳:', response.data);
            } catch (error) {
                console.error('上傳圖片時發生錯誤:', error.response ? error.response.data : error);
            }
        }
    }
};

        const updatePost = async () => {
        const result = await Swal.fire({
            title: '確認更新?',
            text: "您確定要更新這篇文章嗎?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '是的，更新!',
            cancelButtonText: '取消'
        });

        if (result.isConfirmed) {
            // 如果用戶確認，執行更新操作
            try {
            const contentResponse = await axiosapi.put(`/post/${post.value.postId}`, {
                contentText: post.value.contentText
            });
            console.log('文章內容已更新:', contentResponse.data);
            for (const file of fileList.value) {
                if (file.originFileObj) {
                    const formData = new FormData();
                    formData.append('file', file.originFileObj);
                    formData.append('postId', postId);
                    const imageResponse = await axiosapi.post(`/images`, formData);
                // 更新 fileList 中對應項目的 uid 和 url
                file.uid = imageResponse.data.imageId;
                file.url = `${path}/${imageResponse.data.imgUrl}`;
            }
        }
            Swal.fire({
                icon: 'success',
                title: '更新成功!',
                text: '文章已成功更新。',
                timer: 1000, 
                showConfirmButton: false
            });
            router.push(`/post/${post.value.postId}`);
        } catch (error) {
            console.error('更新文章時發生錯誤:', error.response ? error.response.data : error);
        }
    }
};

    const deletePost = async () => {
        const result = await Swal.fire({
        title: '確定刪除?',
        text: "您確定要刪除這篇文章嗎?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '是的，刪除!',
        cancelButtonText: '取消'
    });

    if (result.isConfirmed) {
        try {
            const imageIds = post.value.images.map(image => image.imageId);
            await axiosapi.delete(`/post/${post.value.postId}`);
            
            for (const imageId of imageIds) {
                await axiosapi.delete(`/images/${imageId}`);
            }

            Swal.fire({
                icon: 'success',
                title: '刪除成功!',
                text: '文章已成功刪除。',
                timer: 1000, 
                showConfirmButton: false 
            });
            router.push('/posts');
        } catch (error) {
            console.error('刪除貼文時出錯:', error);
        }
    }
};

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
</script>

<style scoped>
.edit-container {
    max-width: 800px; 
    margin: 0 auto;
    padding: 20px; 
}
.post-form-wrapper {
    background-color: #f0f0f0; 
    padding: 30px; 
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-width: 800px; 
    width: 100%; 
}
.textarea {
    width: 100%; 
    border-color: #e8e8e8; 
    transition: border-color 0.3s ease; 
    font-size: 20px; 
}
.textarea:hover {
    border-color: #ffa500; 
}
.textarea:focus {
    border-color: #ffa500; 
    box-shadow: 0 0 0 2px rgba(255, 166, 0, 0.2); 
}
.button-container {
    display: flex; 
    justify-content: flex-end; 
    margin-top: 16px; 
}
.update-button {
    background-color: #1890ff; 
    color: white; 
    padding: 8px 16px; 
    border: none; 
    border-radius: 4px;
    cursor: pointer; 
    margin-left: 8px; 
}
.delete-button {
    background-color: #ff4d4f; 
    color: white; 
    padding: 8px 16px; 
    border: none; 
    border-radius: 4px; 
    cursor: pointer; 
}
</style>