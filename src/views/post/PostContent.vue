<template>
  <div class="container">
    <section class="post-content">
      <div v-if="loading">載入中...</div>
      <div v-else>
        <!-- 添加作者資訊 -->
        <a-comment>
          <template #author>
            <div class="author-info" style="display: flex; align-items: center;">
              <a-avatar :size="64" :src="post.userDetail.userPhoto" /> 
              <span class="author-name" style="margin-left: 8px;">{{ post.userDetail.userName }}</span>
              <span class="post-timestamp" style="margin-left: 10px;">
                <a-tooltip :title="dayjs(post.createdAt).format('YYYY-MM-DD HH:mm:ss')">
                  <span>{{ dayjs(post.createdAt).fromNow() }}</span>
                </a-tooltip>
              </span>
            </div>
          </template>
        </a-comment>
        <h1 style="display: inline-block;">{{ post.postTitle }}</h1>
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
                <heart-filled @click="handleLikeClick" style="color: #000000;" />
              </template>
              <template v-else>
                <heart-outlined @click="handleLikeClick" style="color: #000000;" />
              </template>
            </a-tooltip>
            <span style="padding-left: 8px; cursor: auto">{{ likes }}</span>
          </span>
          <span key="comment-basic-collect" class="collect-action">
            <a-tooltip title="Collect">
              <template v-if="post.isCollected">
                <star-filled @click="handleCollectClick" style="color: #000000;" />
              </template>
              <template v-else>
                <star-outlined @click="handleCollectClick" style="color: #000000;" />
              </template>
            </a-tooltip>
            <span style="padding-left: 8px; cursor: auto">{{ collects }}</span>
          </span>
          <!-- <span key="comment-basic-share">
            <a-tooltip title="Share">
              <share-alt-outlined @click="toggleShare" style="color: #1890ff;" />
            </a-tooltip>
            <span style="padding-left: 8px; cursor: auto">{{ shares }}</span>
          </span> -->
          
        </div>
        <!-- 浮動式至頂效果 -->
        <div :style="{ height: '1vh', padding: '10px' }">
          <a-back-top />
        </div>

        <!-- 檢舉按鈕 -->
        <!-- <a-float-button shape="square" description="檢舉"
            :style="{ right: '24px', bottom: '96px',}">
            <template #icon>
              <a-tooltip title="檢舉">
                <warning-outlined 
                  @click="goToReport(post.postId)" 
                  style="color: red; font-size: 20px;" />
              </a-tooltip>
            </template>
          </a-float-button> -->

        <!-- 編輯按鈕 -->
        <a-button v-if="post.userId === userId" type="primary" style="background-color: #000000; color: #ffffff;" 
          @click="() => goToEditPage(post.postId)"><EditOutlined/>編輯</a-button>
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
import { HeartFilled, HeartOutlined, StarFilled, StarOutlined, ShareAltOutlined, WarningOutlined,EditOutlined } from '@ant-design/icons-vue';
import useUserStore from "@/stores/user.js";
import comment from './Comment.vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('zh-tw'); 

const post = ref([]);
const likes = ref(0);
const collects = ref(0);
const shares = ref(0);
const loading = ref(true);
const isLoading = ref(false); // 新增的變量，控制載入狀態
const path = import.meta.env.VITE_POST_IMAGE_URL;
const userPhotoPath = import.meta.env.VITE_USER_IMAGE_URL;

const userStore = useUserStore();
const userId = Number(userStore.userId);
const route = useRoute();
const router = useRouter();
const postId = Number(route.params.id);

// 獲取文章數據
const fetchPostData = async () => {
  try {
    const response = await axiosapi.get(`/post/${postId}`);
    console.log("文章数据:",response.data); 
    post.value = response.data;
    // 設置 userDetail
    post.value.userDetail = {
      userPhoto: `${userPhotoPath}${response.data.userPhoto}`,
      userName: response.data.userName
    };
    likes.value = post.value.likes.length;
    post.value.isLiked = post.value.likes.some(like => like.userId === userId); 
    collects.value = post.value.collections.length; 
    post.value.isCollected = post.value.collections.some(collection => collection.userId === userId);

    if (Array.isArray(post.value.images)) {
      post.value.images = post.value.images
      .filter(image => !image.deletedAt)  // 過濾已刪除的圖片
      .map(image => ({
        ...image,
        imgUrl: `${path}${image.imgUrl}` //用 path 變數構建URL
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

// 導航到檢舉頁面
const goToReport = (postId) => {
  router.push({ name: 'reportPost-link', params: { id: postId } 
});
};

// // 處理圖片載入錯誤
// const handleImageError = (event: Event) => {
//   const target = event.target as HTMLImageElement;
//   target.src = 'https://via.placeholder.com/500'; // 替換為佔位符圖片 URL
// };

// 按讚沒登入邏輯
const handleLikeClick = () => {
  if (!userId) {
    router.push('/secure/login');
    return;
  }
  toggleLike();
};
// 收藏沒登入邏輯
const handleCollectClick = () => {
  if (!userId) {
    router.push('/secure/login'); 
    return;
  }
  toggleCollect(); 
};

// 點擊喜歡
const toggleLike = async () => {
  try {
    const response = await axiosapi.post("/likes/toggle", {
      userId: userId,
      postId: postId
    });
    if (response.data === "按讚成功") {
      post.value.isLiked = true; 
      likes.value += 1; 
    } else if (response.data === "按讚收回成功") {
      post.value.isLiked = false; 
      likes.value -= 1; 
    }
    console.log("喜歡:", response.data);
  } catch (error) {
    console.error("喜歡操作失败:", error);
  }
};

// 點擊收藏
const toggleCollect = async () => {
  // 重複邏輯需要多一個變量 isLoading
  if (isLoading.value) return;
  isLoading.value = true;
  try {
    const response = await axiosapi.post("/collections/toggle", {
      userId: userId,
      postId: postId
    });
    if (response.data === "收藏成功") {
      if (!post.value.isCollected) {
        post.value.isCollected = true; 
        collects.value += 1; 
      }
    } else if (response.data === "收回收藏成功") {
      if (post.value.isCollected) {
        post.value.isCollected = false; 
        collects.value -= 1; 
      }
    }
    console.log("收藏響應:", response.data);
  } catch (error) {
    console.error("收藏操作失敗:", error);
  } finally {
    isLoading.value = false;
  }
};

// 點擊分享
// const toggleShare = async () => {
//   try {
//     await axiosapi.post(`/shares`, { posts: { postId: postId }, userDetail: { id: userStore.userId } });
//     shares.value += 1;
//   } catch (error) {
//     console.error("分享失敗:", error.response ? error.response.data : error.message);
//   }
// };

// 監聽路由參數變化
watch(() => route.params.id, async (newId) => {
  if (newId) {
    loading.value = true; // 開始載入
    userId.value = newValue;
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
  justify-content: center; /*圖片在貨櫃中水平居中*/
  gap: 10px;
  margin: auto; /* 容器在頁面上居中 */
  max-width: 80%; 
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
.post-image {
  width: 100%;
  max-width: 100%; 
  height: auto; /* auto高度自動調整 */
  object-fit: cover; /* 保證圖片在容器中的覆蓋並保持比例 */
  border-radius: 8px; 
  width: calc(33.333% - 10px); 
}
.actions {
  display: flex;
  align-items: center;
}

.collect-action {
  margin-left: 16px; /* 增加間距 */
}
.author-info {
  display: flex;
  align-items: center;
}
.author-name {
  margin-left: 8px;
  color: #000000;
  font-weight: bold; 
}
.post-timestamp {
  margin-left: 10px;
  color: #666666; 
}
</style>