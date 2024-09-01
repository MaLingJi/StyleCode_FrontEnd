<template>
  <div class="container">
    <section class="post-content">
      <div v-if="loading">載入中...</div>
      <div v-else>
        <h1>{{ post.postTitle }}</h1>
        <p>{{ post.contentText }}</p>

        <div class="actions">
          <span key="comment-basic-like">
            <a-tooltip title="Like">
              <template v-if="post.isLiked">
                <heart-filled @click="toggleLike" style="color: #eb2f96;" />
              </template>
              <template v-else>
                <heart-outlined @click="toggleLike" style="color: #eb2f96;" />
              </template>
            </a-tooltip>
            <span style="padding-left: 8px; cursor: auto">{{ likes }}</span>
          </span>
          <span key="comment-basic-collect">
            <a-tooltip title="Collect">
              <template v-if="post.isCollected">
                <star-filled @click="toggleCollect" style="color: #fadb14;" />
              </template>
              <template v-else>
                <star-outlined @click="toggleCollect" style="color: #fadb14;" />
              </template>
            </a-tooltip>
            <span style="padding-left: 8px; cursor: auto">{{ collects }}</span>
          </span>
          <span key="comment-basic-share">
            <a-tooltip title="Share">
              <share-alt-outlined @click="toggleShare" style="color: #1890ff;" />
            </a-tooltip>
            <span style="padding-left: 8px; cursor: auto">{{ shares }}</span>
          </span>
        </div>

        <a-list
          class="comment-list"
          :header="`${comments.length} 則回覆`"
          item-layout="horizontal"
          :data-source="comments"
        >
        <template #renderItem="{ item }">
                <a-list-item>
              <a-comment :author="`用戶 ${item.userDetail.id}`" :avatar="item.avatar">
                <template #content>
                  <p v-if="!item.isEditing">{{ item.comment }}</p>
                  <a-textarea v-if="item.isEditing" v-model:value="item.editContent" />
                  <span class="comment-time">{{ dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss') }}</span>
                  <a-button v-if="item.userDetail.id === userId" @click="toggleEdit(item)">
                    {{ item.isEditing ? '保存' : '編輯' }}
                  </a-button>
                  <a-button v-if="item.userDetail.id === userId" @click="deleteComment(item.id)">刪除</a-button>
                  </template>
              </a-comment>
            </a-list-item>
          </template>
        </a-list>

        <a-comment class="new-comment">
          <template #avatar>
            <a-avatar src="https://joeschmoe.io/api/v1/random" alt="用戶" />
          </template>
          <template #content>
            <a-form-item>
              <a-textarea 
                v-model:value="newComment" 
                :rows="4" 
                placeholder="新增評論..." 
                class="comment-textarea"
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
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axiosapi from "@/plugins/axios.js";
import dayjs from 'dayjs';
import { HeartFilled, HeartOutlined, StarFilled, StarOutlined, ShareAltOutlined } from '@ant-design/icons-vue';
import useUserStore from "@/stores/user.js";

// 定義 Post 接口
interface Post {
  postId: number;
  postTitle: string;
  contentText: string;
  isLiked: boolean;
  isCollected: boolean;
  likesCount: number;
  collectionsCount: number;
  images: Array<{ imgUrl: string }>; // 假設圖片數據結構
}

const userStore = useUserStore();
const userId = Number(userStore.userId);
const route = useRoute();
const postId = Number(route.params.id);
const post = ref({} as any);
const comments = ref([]);
const newComment = ref('');
const submitting = ref(false);
const likes = ref(0);
const collects = ref(0);
const shares = ref(0);
const loading = ref(true);

// 獲取文章數據
const fetchPostData = async () => {
  try {
    const response = await axiosapi.get(`/post/${postId}`);
    post.value = response.data;
    likes.value = post.value.likesCount || 0; 
    collects.value = post.value.collectionsCount || 0;
  } catch (error) {
    console.error("獲取文章數據失敗:", error);
  }
};

// 獲取評論數據
const fetchComments = async () => {
  const storedComments = localStorage.getItem(`comments_${postId}`);
  if (storedComments) {
    comments.value = JSON.parse(storedComments); // 從本地存儲恢復評論
  } else {
    try {
      const response = await axiosapi.get(`/comment`);
      comments.value = response.data.filter(comment => comment.post.postId === postId); // 根據 postId 過濾評論
    } catch (error) {
      console.error("獲取評論數據失敗:", error);
    }
  }
};

// 監聽路由參數變化
// watch(() => route.params.id, async (newId) => {
//   if (newId) {
//     loading.value = true; // 開始載入
//     await fetchPostData();
//     await fetchComments();
//     loading.value = false; // 完成載入
//   }
// });

// // 初始載入
// onMounted(async () => {
//   loading.value = true; // 開始載入
//   await fetchPostData();
//   await fetchComments();
//   loading.value = false; // 完成載入
// });

// 提交評論
const handleSubmit = async () => {
  if (!newComment.value) return;

  try {
    await axiosapi.post(`/comment`, { 
      post: { postId: postId },
      userDetail: { id: userId },
      comment: newComment.value
    });

    // 提交成功後，立即更新評論列表
    const newCommentData = { 
      userDetail: { id: userId },
      comment: newComment.value,
      createdAt: new Date().toISOString() // 將日期轉換為字符串
    };
    comments.value.push(newCommentData); // 添加新評論到列表

    // 保存到本地存儲
    saveCommentsToLocalStorage();

    newComment.value = '';
  } catch (error) {
    console.error("新增評論失敗:", error);
  }
};

// 將評論保存到本地存儲
const saveCommentsToLocalStorage = () => {
  localStorage.setItem(`comments_${postId}`, JSON.stringify(comments.value));
};

// 刪除評論
const deleteComment = async (commentId: number) => {
  try {
    await axiosapi.delete(`/comment/${commentId}`);
    comments.value = comments.value.filter(comment => comment.commentId !== commentId);
    saveCommentsToLocalStorage();
  } catch (error) {
    console.error("刪除評論失敗:", error);
  }
};

// 編輯評論
const editComment = async (commentId: number, newContent: string) => {
  try {
    await axiosapi.put(`/comment/${commentId}`, { comment: newContent });
    const index = comments.value.findIndex(comment => comment.commentId === commentId);
    if (index !== -1) {
      comments.value[index].comment = newContent;
      saveCommentsToLocalStorage();
    }
  } catch (error) {
    console.error("編輯評論失敗:", error);
  }
};

// 定義 toggleEdit 函數
const toggleEdit = (item) => {
  item.isEditing = !item.isEditing;
  if (item.isEditing) {
    item.editContent = item.comment;
  } else {
    editComment(item.commentId, item.editContent); // 保存編輯
  }
};

// 監聽路由參數變化
watch(() => route.params.id, async (newId) => {
  if (newId) {
    loading.value = true; // 開始載入
    await fetchPostData();
    await fetchComments();
    loading.value = false; // 完成載入
  }
});

// 初始載入
onMounted(async () => {
  loading.value = true; // 開始載入
  await fetchPostData();
  await fetchComments();
  loading.value = false; // 完成載入
});

// 點擊喜歡
const toggleLike = async () => {
  console.log(`Sending DELETE request to /likes/${postId}/${userId}`);
  if (post.value.isLiked) {
    // 用戶已經點讚，執行取消讚
    try {
      await axiosapi.delete(`/likes/${postId}/${userId}`);
      post.value.isLiked = false;
      likes.value = Math.max(likes.value - 1, 0);
    } catch (error) {
      console.error("取消喜歡失敗:", error.response ? error.response.data : error.message);
    }
  } else {
    // 用戶尚未點讚，執行新增讚
    try {
      await axiosapi.post(`/likes`,{posts:{postId:postId},userDetail:{id:userId}
      });
      post.value.isLiked = true;
      likes.value++;
    } catch (error) {
      console.error("更新喜歡狀態失敗:", error.response ? error.response.data : error.message);
    }
  }
};

// 點擊收藏
const toggleCollect = async () => {
  post.value.isCollected = !post.value.isCollected;
  collects.value += post.value.isCollected ? 1 : -1;
  
  if (collects.value < 0) {
    collects.value = 0;
  }
  // 更新後端資料
  try {
    await axiosapi.post(`/collections`,{posts:{postId:postId}, userDetail:{id:userId}
    });
  } catch (error) {
    console.error("收回收藏失敗:", error.response ? error.response.data : error.message);
  }
};

// 分享按鈕邏輯
const toggleShare = () => {
  shares.value++;
  // 這裡可以添加分享的 API 請求
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100vw;
  height: 100vh;
  padding: 16px;
}

.post-content {
  max-width: 1200px;
  width: 100%;
  background-color: white;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.actions {
  margin-top: 16px;
}

.comment-list {
  margin-top: 16px;
}

.new-comment {
  width: 100%;
  max-width: 800px;
  height: auto;
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  background-color: #f9f9f9;
  margin-top: 16px;
  overflow: hidden;
}

.comment-textarea {
  font-size: 16px;
}

.comment-time {
  color: #888;
  font-size: 12px;
}
</style>