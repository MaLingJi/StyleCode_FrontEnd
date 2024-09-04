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
                <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
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

<script>
import { PlusOutlined } from '@ant-design/icons-vue';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axiosapi from '@/plugins/axios.js';

export default {
    components: {
        PlusOutlined
    },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const postId = route.params.id; // 獲取 postId
        
        const post = ref({
            postId: postId,
            postTitle: '',
            contentText: '',
            images: []
        });

        const fileList = ref([]);
        const uploadUrl = `http://localhost:8080/images`;
        const previewVisible = ref(false);
        const previewImage = ref('');
        const previewTitle = ref('');

        onMounted(async () => {
        try {
        const response = await axiosapi.get(`/post/${postId}`);
        const data = JSON.parse(JSON.stringify(response.data));
        if (data) {
            post.value = data;
            if (post.value.images) {
                post.value.images.forEach(image => {
                    fileList.value.push({
                        uid: image.imageId,
                        name: image.imgUrl,
                        status: 'done',
                        url: `${path}/${image.imageId}`,
                    });
                });
            }
        }
        } catch (error) {
            console.error('獲取文章數據失敗:', error);
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
        };

        const handleRemove = async (file) => {
            try {
                console.log(`正在刪除影像: /images/${file.uid}`);
                const response = await axiosapi.delete(`/images/${file.uid}`); 
                console.log(`圖片已刪除: ${response.data}`);
            } catch (error) {
                console.error('刪除影像時發生錯誤:', error.response ? error.response.data : error.message);
            }
        };
        // 更新 fileList上傳的文件狀態
        const handleChange = (info) => {
            fileList.value = info.fileList;
        };

        const updatePost = async () => {
            try {
                const formData = new FormData();
                if (fileList.value.some(file => file.status === 'done')) { // 如果有新上傳的圖片
            fileList.value.forEach(file => {
                if (file.status === 'done') {
                    formData.append('file', file.originFileObj); // 添加 file 參數
                }
            });
        }
        formData.append('postId', postId); // 添加 postId

        // 更新文章
        const response = await axiosapi.put(`${path}/${post.value.postId}`, post.value);
        console.log('文章已更新:', response.data);
        router.push(`/post/${post.value.postId}`); // 更新後重定向
    } catch (error) {
        console.error('更新文章時發生錯誤:', error.response ? error.response.data : error);
    }
};

        const deletePost = async () => {
            try {
                const imageIds = post.value.images.map(image => image.imageId);
                
                await axiosapi.delete(`/post/${post.value.postId}`);
                for (const imageId of imageIds) {
                    await axiosapi.delete(`/images/${imageId}`);
                }
                router.push('/posts');
            } catch (error) {
                console.error('刪除貼文和圖片時出錯:', error);
            }
        };

        // function getBase64(file) {
        //     return new Promise((resolve, reject) => {
        //         const reader = new FileReader();
        //         reader.readAsDataURL(file);
        //         reader.onload = () => resolve(reader.result);
        //         reader.onerror = error => reject(error);
        //     });
        // }

        return {
            post,
            fileList,
            uploadUrl,
            previewVisible,
            previewImage,
            previewTitle,
            handleCancel,
            handlePreview,
            handleRemove,
            updatePost,
            deletePost,
            handleChange
        };
    }
};
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
.input-large {
    width: 100%; 
    border-color: #e8e8e8;
    transition: border-color 0.3s ease;
}
.input-large:hover {
    border-color: #1890ff; 
}
.input-large:focus {
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2); 
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