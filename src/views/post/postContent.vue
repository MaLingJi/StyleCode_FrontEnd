<template>
  <div class="container">
    <section class="post-content">
      <div v-if="loading">載入中...</div>
      <div v-else>
        <h1>{{ post.postTitle }}</h1>
        <p>{{ post.contentText }}</p>

        <!-- 顯示圖片 -->
        <div v-if="Array.isArray(post.images) && post.images.length > 0" class="post-images">
          <img 
            v-for="image in post.images" 
            :key="image.imageId" 
            :src="image.imgUrl" 
            alt="Post Image" 
            class="post-image"
          />
          <!-- @error="handleImageError"   -->
        </div>

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
        <!-- 編輯按鈕 -->
        <a-button type="primary" @click="() => goToEditPage(post.postId)">編輯</a-button>
        
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
                  <a-textarea 
                    v-if="item.isEditing" 
                    v-model:value="item.editContent" 
                    rows="2" 
                    placeholder="編輯評論..."
                  />
                  <span class="comment-time">{{ dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss') }}</span>
                </template>
                <template #actions>
                  <a-button 
                    type="primary" 
                    v-if="!item.isEditing" 
                    @click="startEditing(item)">編輯</a-button>
                  <a-button 
                    type="primary" 
                    v-if="item.isEditing" 
                    @click="() => saveComment(item.commentId, item.editContent)">保存</a-button>
                  <a-button class="delete-button" @click="() => deleteComment(item.commentId)">刪除</a-button>
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

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import axiosapi from "@/plugins/axios.js";
import dayjs from 'dayjs';
import { HeartFilled, HeartOutlined, StarFilled, StarOutlined, ShareAltOutlined } from '@ant-design/icons-vue';
import useUserStore from "@/stores/user.js";

const post = ref({});
const comments = ref([]);
const newComment = ref('');
const submitting = ref(false);
const likes = ref(0);
const collects = ref(0);
const shares = ref(0);
const loading = ref(true);
const path = import.meta.env.VITE_POST_IMAGE_URL;

const userStore = useUserStore();
const userId = Number(userStore.userId);
const route = useRoute();
const router = useRouter();
const postId = Number(route.params.id);

// 獲取文章數據
const fetchPostData = async () => {
  try {
    const response = await axiosapi.get(`/post/${postId}`);
    console.log(response.data); // 查看返回的post數據格式
    post.value = response.data;
    likes.value = post.value.likesCount || 0; 
    collects.value = post.value.collectionsCount || 0;
    if (Array.isArray(post.value.images)) {
      post.value.images = post.value.images
      .filter(image => !image.deletedAt)  // 過濾已刪除的圖片
      .map(image => ({
        ...image,
        imgUrl: `${path}${image.imgUrl}` //用 path 變數構建完整的URL
      }));
    } else {
      post.value.images = []; // 如果不是數組,初始化為空數組
    }
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
      // comments.value = response.data.filter(comment => comment.post.postId === postId); // 根據 postId 過濾評論
      console.log("獲取的評論數據:", comments.value); // 調試
    } catch (error) {
      console.error("獲取評論數據失敗:", error);
    }
  }
};

// 導航到編輯頁面
const goToEditPage = (postId) => {
  router.push({ name: "editPost-link", params: { id: postId } });
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
    await axiosapi.post(`/comment`, { post: { postId: postId }, userDetail: { id: userStore.userId }, comment: newComment.value });
    const newCommentData = { 
      userDetail: { id: userStore.userId },
      comment: newComment.value,
      createdAt: new Date().toISOString()
    };
    comments.value.push(newCommentData); // 添加新評論到列表
    saveCommentsToLocalStorage();
    newComment.value = '';
  } catch (error) {
    console.error("新增評論失敗:", error.response ? error.response.data : error);
  }
};

  // 將評論保存到本地存儲
  const saveCommentsToLocalStorage = () => {
  localStorage.setItem(`comments_${postId}`, JSON.stringify(comments.value));
};
// // 處理圖片載入錯誤
// const handleImageError = (event: Event) => {
//   const target = event.target as HTMLImageElement;
//   target.src = 'https://via.placeholder.com/500'; // 替換為佔位符圖片 URL
// };

  // 刪除評論
  const deleteComment = async (commentId) => {
  try {
    console.log("刪除評論ID:", commentId); // 調試輸出
    await axiosapi.delete(`/comment/${commentId}`);
    comments.value = comments.value.filter(comment => comment.commentId !== commentId);
    saveCommentsToLocalStorage();
  } catch (error) {
    console.error("刪除評論失敗:", error);
  }
};

  // 編輯評論
  const editComment = async (commentId , newContent) => {
  try {
    console.log("編輯評論ID:", commentId); // 調試輸出
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

// 開始編輯評論
const startEditing = (comment) => {
  comment.isEditing = true;
  comment.editContent = comment.comment; // 將原始評論內容設置為編輯內容
};

// 保存已編輯的評論
const saveComment = async (commentId, newContent) => {
  await editComment(commentId, newContent);
  const index = comments.value.findIndex(comment => comment.commentId === commentId);
  if (index !== -1) {
    comments.value[index].isEditing = false; // 編輯完成後關閉編輯狀態
  }
};

// 點擊喜歡
const toggleLike = async () => {
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
      await axiosapi.post(`/likes`, { posts: { postId: postId }, userDetail: { id: userStore.userId } });
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

  if (post.value.isCollected) {
    try {
      await axiosapi.delete(`/collections/${postId}/${userId}`);
      post.value.isCollected = false;
      collects.value -= 1;
    } catch (error) {
      console.error("取消收藏失敗:", error);
    }
  } else {
    try {
      await axiosapi.post(`/collections`, {
        post: { postId: postId },
        userDetail: { id: userStore.userId },
      });
      post.value.isCollected = true;
      collects.value += 1;
    } catch (error) {
      console.error("添加收藏失敗:", error);
    }
  }
};

// 點擊分享
const toggleShare = async () => {
  try {
    await axiosapi.post(`/shares`, { posts: { postId: postId }, userDetail: { id: userStore.userId } });
    shares.value += 1;
  } catch (error) {
    console.error("分享失敗:", error.response ? error.response.data : error.message);
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
</script>

<style scoped>
.container {
  width: 80%; /* 根據需要調整縮小的百分比 */
  max-width: 1200px; /* 可以設定一個最大寬度 */
  margin: 0 auto; /* 居中對齊 */
}
.post-content {
  padding: 20px;
}
.post-images {
  display: flex; 
  flex-wrap: wrap; /* 允许换行 */
  justify-content: center; /*图片在容器中水平居中*/
  gap: 10px;
  margin: auto; /* 容器在页面上居中 */
  max-width: 80%; 
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
.post-image {
  width: 100%;
  max-width: 100%; 
  height: auto; /* auto高度自动调整 */
  object-fit: cover; /* 确保图片在容器中覆盖并保持比例 */
  border-radius: 8px; 
  width: calc(33.333% - 10px); 
}
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