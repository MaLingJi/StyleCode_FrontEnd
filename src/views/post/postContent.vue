<template>
  <div class="container">
    <section class="post-content">
      <div v-if="loading">載入中...</div>
      <div v-else>
        <h1>{{ post.postTitle }}</h1>
        <p>{{ post.contentText }}</p>

        <!-- 顯示圖片 -->
        <div v-if="Array.isArray(post.images) && post.images.length > 0" class="post-images">
          <a-image 
            v-for="image in post.images" 
            :key="image.imageId" 
            :src="image.imgUrl" 
            alt="Post Image" 
            class="post-image"
            :width="200" 
          />
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
        <a-button v-if="post.userId === userId" type="primary" 
          @click="() => goToEditPage(post.postId)">編輯</a-button>
        <!-- 鑲入留言列表和新增留言區 -->
        <comment :post-id="postId"></comment>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axiosapi from "@/plugins/axios.js";
import { HeartFilled, HeartOutlined, StarFilled, StarOutlined, ShareAltOutlined } from '@ant-design/icons-vue';
import useUserStore from "@/stores/user.js";
import comment from './comment.vue';

const post = ref({});
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
    post.value = response.data;
    likes.value = post.value.likesCount || 0; 
    collects.value = post.value.collectionsCount || 0;
    if (Array.isArray(post.value.images)) {
      post.value.images = post.value.images
      .filter(image => !image.deletedAt)  // 過濾已刪除的圖片
      .map(image => ({
        ...image,
        imgUrl: `${path}${image.imgUrl}` //用path變數構建完整的URL
      }));
    } else {
      post.value.images = []; //不是數組,初始化為空數組
    }
  } catch (error) {
    console.error("獲取文章數據失敗:", error);
  }
};

// 導航到編輯頁面
const goToEditPage = (postId) => {
  router.push({ name: "editPost-link", params: { id: postId } });
};

// // 處理圖片載入錯誤
// const handleImageError = (event: Event) => {
//   const target = event.target as HTMLImageElement;
//   target.src = 'https://via.placeholder.com/500'; // 替換為佔位符圖片 URL
// };

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
      await axiosapi.post(`/collections`, {
        post: { postId: postId },
        userDetail: { id: userStore.userId },
      });
    } catch (error) {
      console.error("添加收藏失敗:", error);
    }
  } else {
    try {
      await axiosapi.delete(`/collections/${postId}/${userId}`);
    } catch (error) {
      console.error("取消收藏失敗:", error);
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
    loading.value = false; // 完成載入
  }
});

// 初始載入
onMounted(async () => {
  loading.value = true; // 開始載入
  await fetchPostData();
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
</style>