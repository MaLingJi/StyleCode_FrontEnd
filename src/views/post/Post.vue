<template>
    <div class="post-container">
    <div class="post-form-wrapper">
        <a-typography>
        <a-typography-title :level="2">新增文章</a-typography-title>
        <a-form layout="vertical" @submit.prevent="handleSubmit" class="form">
            <a-form-item label="標題">
            <a-input v-model:value="title" placeholder="輸入標題" class="input-large" :maxlength="30" show-count/>
            </a-form-item>

            <a-form-item label="敘述">
            <a-textarea
                v-model:value="description"
                placeholder="輸入敘述"
                rows="5"
                class="textarea"
                show-count 
                :maxlength="230"
            />
            </a-form-item>

            <a-form-item label="上傳圖片">
            <a-upload
                v-model:file-list="fileList"
                action="http://localhost:8080/images"
                list-type="picture-card"
                :max-count="3"
                :multiple="true"
                @preview="handlePreview"
            >
                <div v-if="fileList.length < 3">
                <PlusOutlined />
                <div style="margin-top: 8px">上傳</div>
                </div>
            </a-upload>
            </a-form-item>

            <a-form-item>
            <div class="button-container">
                <a-button type="primary" html-type="submit" style="margin-right: 8px;">送出</a-button>
                <a-button @click="handleCancel">取消</a-button>
            </div>
            </a-form-item>
        </a-form>
        </a-typography>
    </div>
    <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { PlusOutlined } from '@ant-design/icons-vue';
import axiosapi from "@/plugins/axios.js";
import useUserStore from "@/stores/user.js";
import Swal from 'sweetalert2';

const title = ref('');
const description = ref('');
const fileList = ref([]);
const router = useRouter();

const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');

const handleCancel = () => {
    previewVisible.value = false;
    previewTitle.value = '';
    title.value = '';
    description.value = '';
    fileList.value = [];
    router.push('/forum');
};

const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
    }
    previewImage.value = file.url || file.preview;
    previewVisible.value = true;
    previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};

const handleSubmit = async () => {
    if (!title.value || !description.value) {
        alert('請填寫所有欄位');
        return;
    }

    const userStore = useUserStore();
    
    const postData = {
        userDetail: { id: userStore.userId }, 
        postTitle: title.value,
        contentType: "forum",
        contentText: description.value,
    };

    try {
          // 發送 POST 請求到後端 API
        const response = await axiosapi.post('/post', postData);
        const postId = response.data.postId;

          // 如果有上傳的圖片，則處理圖片上傳
        if (fileList.value.length > 0) {
            const formData = new FormData();
            fileList.value.forEach(file => {
                if (file.originFileObj) {
                    formData.append('file', file.originFileObj); 
                }
            });
            formData.append('postId', postId); 

              // 將圖片上傳請求發送到後端
            const imageResponse = await axiosapi.post('/images', formData);
            console.log('圖片已上傳:', imageResponse.data);
        }

        // 提交後清空表單
        title.value = '';
        description.value = '';
        fileList.value = []; 

        Swal.fire({
        icon: 'success',
        title: '創建文章成功!',
        showConfirmButton: false,
        timer: 1000
        });
        
        router.push('/forum');
        } catch (error) {
        console.error('建立貼文時出錯:', error);
        alert('提交時字數或格式錯誤');
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
.post-container {
      padding: 40px 20px; /* 加大內邊距 */
    display: flex;
      justify-content: center; /* 將內容置中 */
}
.post-form-wrapper {
      background-color: #f0f0f0; /* 設定背景顏色為淺灰色 */
      padding: 30px; /* 設定內邊距 */
      border-radius: 10px; /* 設定圓角 */
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 添加陰影 */
      max-width: 700px; /* 設定最大寬度 */
      width: 100%; /* 使容器在小於最大寬度時填滿 */
}
.input-large {
      width: 100%; /* 使輸入框填滿表單寬度 */
      border-color: #e8e8e8; /* 設置預設邊框顏色 */
      transition: border-color 0.3s ease; /* 添加過渡效果 */
}  
.input-large:hover {
      border-color: #ff8018; /* 滑鼠移入時變藍色 */
}
.input-large:focus {
      border-color: #1890ff; /* 按下去時變藍色 */
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2); /* 添加聚焦陰影 */
}  
.textarea {
      width: 100%; /* 使文本區域填滿表單寬度 */
      border-color: #e8e8e8; /* 設置預設邊框顏色 */
      transition: border-color 0.3s ease; /* 添加過渡效果 */
      font-size: 20px; /* 設置字體大小 */
}
.textarea:focus {
    box-shadow: 0 0 0 2px rgba(255, 166, 0, 0.2); 
}  
.button-container {
      display: flex; /* 使用 flexbox 來排列按鈕 */
      justify-content: flex-end; /* 使按鈕靠右對齊 */
      margin-top: 16px; /* 按鈕上方間距 */
}
.button-container .ant-btn {
    background-color: white;
    color: black;
    border: 1px solid black;
    transition: background-color 0.3s ease, color 0.3s ease;
}
.button-container .ant-btn:hover {
    background-color: black;
    color: white;
}
.button-container .ant-btn-primary {
    background-color: black;
    color: white;
    border: 1px solid black;
}
.button-container .ant-btn-primary:hover {
    background-color: white;
    color: black;
}
</style>