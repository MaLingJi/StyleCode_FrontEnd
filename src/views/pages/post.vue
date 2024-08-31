<template>
    <div class="post-container">
    <div class="post-form-wrapper">
        <a-typography>
        <a-typography-title :level="2">新增文章</a-typography-title>
        <a-form layout="vertical" @submit.prevent="handleSubmit" class="form">
            <a-form-item label="標題">
            <a-input v-model:value="title" placeholder="輸入標題" class="input-large" />
            </a-form-item>

            <a-form-item label="敘述">
            <a-textarea
                v-model:value="description"
                placeholder="輸入敘述"
                rows="5"
                class="textarea"
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
                <plus-outlined />
                <div style="margin-top: 8px">上傳</div>
                </div>
            </a-upload>
            </a-form-item>

            <a-form-item>
            <div class="button-container">
                <a-button @click="handleCancel" style="margin-right: 8px;">取消</a-button>
                <a-button type="primary" html-type="submit">送出</a-button>
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

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { PlusOutlined } from '@ant-design/icons-vue';
import type { UploadProps } from 'ant-design-vue';
import axiosapi from "@/plugins/axios.js";
import useUserStore from "@/stores/user.js";

const title = ref('');
const description = ref('');
const fileList = ref<UploadProps['fileList']>([]);
const router = useRouter();

const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');

const handleCancel = () => {
    previewVisible.value = false;
    previewTitle.value = '';
};

const handlePreview = async (file: UploadProps['fileList'][number]) => {
    if (!file.url && !file.preview) {
        file.preview = (await getBase64(file.originFileObj)) as string;
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

    console.log('驗證透過');

    try {
          const userStore = useUserStore(); // 獲取用戶存儲
          // 先發送文章數據
        const postData = {
              userDetail: { id: userStore.userId }, // 確保這裡獲取正確的用戶 ID
            postTitle: title.value,
            contentType: "論壇",
            contentText: description.value,
        };

          // 發送 POST 請求到後端 API
        const response = await axiosapi.post('/post', postData);
        console.log('貼文已創立:', response.data);
        const postId = response.data.postId;
          // 將文件添加到FormData
        const formData = new FormData();
        fileList.value.forEach(file => {
            if (file.originFileObj) {
                  formData.append('file', file.originFileObj); // 將每個文件添加到FormData中，使用 'file' 作為鍵
            }
        });
          formData.append('postId', postId); // 將 postId 添加到 FormData 中

          // 將圖片上傳請求發送到後端
        // const imageResponse = await axiosapi.post('/images', formData, {
        //     headers: {
        //         'Content-Type': 'multipart/form-data',
        //     },
        // });

        // console.log('圖片已上傳:', imageResponse.data);
          // 提交後清空表單
        title.value = '';
        description.value = '';
          fileList.value = []; // 清空上傳的文件列表

          // 跳轉到論壇頁面
        router.push({ name: 'forum-link' });
    } catch (error) {
        console.error('建立貼文時出錯:', error);
        alert('提交時字數或格式錯誤');
    }
};

function getBase64(file: File) {
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
      border-color: #1890ff; /* 滑鼠移入時變藍色 */
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

.textarea:hover {
      border-color: #ffa500; /* 滑鼠移入時變橘色 */
}

.textarea:focus {
      border-color: #ffa500; /* 按下去時變橘色 */
      box-shadow: 0 0 0 2px rgba(255, 166, 0, 0.2); /* 添加聚焦陰影 */
}

.button-container {
      display: flex; /* 使用 flexbox 來排列按鈕 */
      justify-content: flex-end; /* 使按鈕靠右對齊 */
      margin-top: 16px; /* 按鈕上方間距 */
}
</style>