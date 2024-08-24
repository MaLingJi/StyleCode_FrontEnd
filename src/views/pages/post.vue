<template>
    <div class="post-container">
    <a-typography>
        <a-typography-title>新增文章</a-typography-title>
        <a-form
        layout="vertical"
        @submit.prevent="handleSubmit"
        >
        <a-form-item label="標題">
            <a-input v-model:value="title" placeholder="輸入標題" />
        </a-form-item>

        <a-form-item label="敘述">
            <a-textarea v-model:value="description" placeholder="輸入敘述" :rows="10" />
        </a-form-item>

        <a-upload>
            <a-button icon="upload">選擇圖片</a-button>
        </a-upload>

        <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
            <a-button @click="handleCancel" style="margin-right: 8px;">取消</a-button>
            <a-button type="primary" html-type="submit">送出</a-button>
        </div>
        </a-form>
    </a-typography>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const title = ref('');
const description = ref('');

const handleCancel = () => {
    // 這裡可以添加邏輯來處理取消操作，例如清空表單或導航回其他頁面
};

const handleSubmit = () => {
    if (!title.value || !description.value) {
    alert('請填寫所有欄位');
    return;
    }

    // 處理提交邏輯
    console.log('Title:', title.value);
    console.log('Description:', description.value);

    // 提交後可以清空表單
    title.value = '';
    description.value = '';
};
</script>

<style scoped>
.post-container {
    padding: 20px;
}

a-input,
a-textarea {
    width: 100%;
}

a-button[icon="upload"] {
    margin-top: 8px;
}
</style>