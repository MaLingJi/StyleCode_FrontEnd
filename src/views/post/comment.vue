<template>
  <div>
    <!-- 顯示評論列表 -->
    <a-list
      v-if="comments.length"
      :data-source="comments"
      item-layout="horizontal"
      :header="`${comments.length} 則評論`"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <a-comment
            :author="item.author"
            :avatar="item.avatar"
            :content="item.comment"
            :datetime="item.datetime"
          >
            <!-- 編輯刪除僅使用者可見 -->
            <template #actions>
              <template v-if="item.userId === userId">
                <a-button type="link" @click="editComment(item)">編輯</a-button>
                <a-button type="link" @click="deleteComment(item.commentId)">刪除</a-button>
              </template>
            </template>
          </a-comment>
        </a-list-item>
      </template>
    </a-list>

    <!-- 新增評論表單 -->
    <a-comment>
      <template #avatar>
        <a-avatar src="https://joeschmoe.io/api/v1/random" alt="使用者" />
      </template>
      <template #content>
        <a-form-item>
          <a-textarea v-model:value="newComment" :rows="4" placeholder="發表您的評論..." />
        </a-form-item>
        <a-form-item>
          <a-button html-type="submit" :loading="submitting" type="primary" @click="handleSubmit">
            新增評論
          </a-button>
        </a-form-item>
      </template>
    </a-comment>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import dayjs from 'dayjs';
import axiosapi from "@/plugins/axios.js";
import useUserStore from "@/stores/user.js";
import { useRoute } from 'vue-router';

const comments = ref([]);
const newComment = ref('');
const submitting = ref(false);

const route = useRoute();
const userStore = useUserStore();
const userId = Number(userStore.userId);
const postId = ref(route.params.id);
console.log('postId:', postId.value); // 確認 postId 是否正確
console.log('userId:', userId); // 確認 userId 是否正確

// 獲取評論列表
const fetchComments = async () => {
  try {
    const response = await axiosapi.get(`/comment/post/${postId.value}`);
    console.log('API 請求 URL:', `/comment/post/${postId.value}`);
    console.log('API 返回的數據結構:', response.data);

    if (response.data && response.data.post && Array.isArray(response.data.post.comment)) {
      comments.value = response.data.post.comment.map(comment => ({
        ...comment,
        datetime: dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm')
      }));
    } else {
      comments.value = []; // 如果沒有評論，設置為空數組
    }
  } catch (error) {
    console.error("獲取評論失敗:", error);
  }
};

// 發表新評論
const handleSubmit = async () => {
  if (!newComment.value.trim()) return;
  submitting.value = true;
  try {
    const response = await axiosapi.post(`/comment`, {
      post: { postId: Number(postId.value) }, // postId
      userDetail: { id: userId }, // userId
      comment: newComment.value.trim() // 評論內容
    });
    console.log('處理提交回應:', response.data);
    comments.value.unshift({
      commentId: response.data.commentId,
      userId,
      author: userStore.userName,
      avatar: 'https://joeschmoe.io/api/v1/random',
      comment: response.data.comment, //返回的內容是comment
      datetime: dayjs().format('YYYY-MM-DD HH:mm')
    });
    newComment.value = '';
  } catch (error) {
    console.error("發表評論失敗:", error.response?.data || error.message);
  } finally {
    submitting.value = false;
  }
};

// 編輯評論
const editComment = async (comment) => {
  if (!comment.commentId) {
    console.error("編輯評論失敗: commentId 未定義");
    return;
  }
  try {
    const updatedContent = prompt("編輯評論內容", comment.comment);
    if (!updatedContent) return;

    await axiosapi.put(`/comment/${comment.commentId}`, {
      comment: updatedContent
    });
    comments.value = comments.value.map(c => 
      c.commentId === comment.commentId 
        ? { ...c, comment: updatedContent } 
        : c
    );
    console.log(`編輯評論 ${comment.commentId}`);
  } catch (error) {
    console.error("編輯評論失敗:", error);
  }
};


// 刪除評論
const deleteComment = async (commentId) => {
  try {
    await axiosapi.delete(`/comment/${commentId}`);
    comments.value = comments.value.filter(comment => comment.commentId !== commentId);
  } catch (error) {
    console.error("刪除評論失敗:", error);
  }
};

// 初始化時獲取評論
onMounted(() => {
  fetchComments();
});
</script>

<style scoped>
.edit-button {
  background-color: #1890ff; /* 藍色背景 */
  color: #fff; 
  border: none; 
  padding: 6px 12px; 
  border-radius: 4px; 
  cursor: pointer; /* 滑鼠指標樣式 */
  transition: background-color 0.3s; 
}
.edit-button:hover {
  background-color: #40a9ff; /* 滑鼠懸停時改變背景顏色 */
}
.delete-button {
  background-color: #ff4d4f; 
  color: #fff; 
  border: none; 
  padding: 6px 12px; 
  border-radius: 4px; 
  cursor: pointer; /* 滑鼠指標樣式 */
  transition: background-color 0.3s; 
}
.delete-button:hover {
  background-color: #ff7875; /* 滑鼠懸停時改變背景顏色 */
}
</style>