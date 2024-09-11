<template>
  <div>
    <a-list
      class="comment-list"
      :header="`${comments.length} 則回覆`"
      item-layout="horizontal"
      :data-source="comments"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <a-comment :author="item.userDetail.userName || `用戶 ${item.userId}`" :avatar="item.avatar">
            <template #content>
              <p v-if="!item.isEditing">{{ item.commentText }}</p>
              <a-textarea 
                v-if="item.isEditing" 
                v-model:value="item.editContent" 
                rows="2" 
                placeholder="編輯評論..."
              />
              <span class="comment-time">{{ dayjs(item.createdAt).fromNow() }}</span>
            </template>
            <template #actions>
              <a-button 
                type="primary" 
                v-if="!item.isEditing && item.userId === userId" 
                @click="startEditing(item)">編輯</a-button>
              <a-button 
                type="primary" 
                v-if="item.isEditing" 
                @click="() => saveComment(item.commentId, item.editContent)">保存</a-button>
              <a-button class="delete-button" v-if="item.userId === userId" @click="() => deleteComment(item.commentId)">刪除</a-button>
            </template>
          </a-comment>
        </a-list-item>
      </template>
    </a-list>

    <a-comment class="new-comment">
      <template #avatar>
        <a-avatar src="/public/MDFK.png" alt="用戶" />
      </template>
      <template #content>
        <a-form-item>
          <a-textarea 
            v-model:value="newComment" 
            :rows="4" 
            placeholder="新增評論..." 
            class="comment-textarea"
            show-count 
            :maxlength="230"
          />
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
import axiosapi from "@/plugins/axios.js";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-tw';
import useUserStore from "@/stores/user.js";
import Swal from 'sweetalert2';

dayjs.extend(relativeTime);// 使用相對時間插件
dayjs.locale('zh-tw');// 設置語言為中文
const props = defineProps({
  postId: {
    type: Number,
    required: true
  }
});

const comments = ref([]);
const newComment = ref('');
const submitting = ref(false);
const userStore = useUserStore();
const userId = userStore.userId;
const userName = userStore.userName;

// 獲取留言數據
const fetchComments = async () => {
  try {
    console.log("取得postId的評論:", props.postId);
    const response = await axiosapi.get(`/comment?postId=${props.postId}`);
    
    // 確保 response.data 是數組
    if (Array.isArray(response.data)) {
      
      comments.value = response.data.filter(comment => !comment.deletedAt) .map(comment => ({
        commentId: comment.commentId,
        postId: comment.postId,
        userId: comment.userId,
        userDetail: { userName: comment.userName || `用戶${comment.userId}` },
        commentText: comment.commentText,
        createdAt: comment.createdAt,
        deletedAt: comment.deletedAt,
        isEditing: false,
        editContent: '',
        userId: comment.userId
      }));
    } else {
      console.error("獲取的評論數據不是數組:", response.data);
      comments.value = []; // 如果不是數組，則重置為空數組
    }
  } catch (error) {
    console.error("獲取留言失敗:", error);
  }
};

// 新增評論
const handleSubmit = async () => {
  submitting.value = true;
  try {
    const response = await axiosapi.post(`/comment`, {
      comment: newComment.value,
      post: { postId: props.postId },
      userDetail: { id: userId, userName: userName } 
    });

    if (response.data) {
      console.log("response.data",response.data);
      comments.value.unshift({ //留言跑 push最下面 unshift最上面
        commentId: response.data.commentId,
        commentText: newComment.value, //確保命名是commentText
        post: { postId: props.postId },
        userDetail: { id: userId, userName: userName },
        createdAt: new Date().toISOString(),
        isEditing: false,
        editContent: '',
        userId: userId
      });
      newComment.value = ''; 
    } else {
      console.error("新增評論返回的數據格式不正確:", response.data);
    }
  } catch (error) {
    console.error("新增評論失敗:", error);
  } finally {
    submitting.value = false;
  }
};

// 編輯留言
const startEditing = (item) => {
  item.isEditing = true;
  item.editContent = item.commentText;
};

const saveComment = async (commentId, content) => {
  try {
    console.log("編輯評論ID:", commentId);
    const originalComment = comments.value.find(item => item.commentId === commentId).commentText;
    if (content === originalComment) {
      const index = comments.value.findIndex(item => item.commentId === commentId);
      if (index !== -1) {
        comments.value[index].isEditing = false; 
      }
      return;
    }
    await axiosapi.put(`/comment/${commentId}`, { comment: content,
      //updatedAt: new Date().toISOString() //添加更新的時間
    });

    const index = comments.value.findIndex(item => item.commentId === commentId);
    if (index !== -1) {
      comments.value[index].commentText = content; 
      comments.value[index].isEditing = false; 
      //comments.value[index].createdAt = response.data.updatedAt; // 添加更新留言的時間DTO要改
      Swal.fire({
      icon: 'success',
      title: '留言編輯成功!',
      showConfirmButton: false,
      timer: 900
    });
    }
  } catch (error) {
    console.error("保存留言失敗:", error);
  }
};

// 刪除留言
const deleteComment = async (commentId) => {
  try {
    console.log("刪除評論ID:", commentId);
    await axiosapi.delete(`/comment/${commentId}`); 
    comments.value = comments.value.filter(item => item.commentId !== commentId);
    
    Swal.fire({
      icon: 'success',
      title: '留言刪除成功!',
      showConfirmButton: false,
      timer: 900
    });
  } catch (error) {
    console.error("刪除留言失敗:", error);
  }
};

// 初始載入
onMounted(async () => {
  await fetchComments(); 
});
</script>

<style scoped>
.comment-list {
  margin-top: 20px;
}
.new-comment {
  margin-top: 20px;
}
.edit-button {
  background-color: #0a0a0a; /* 藍色背景 */
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