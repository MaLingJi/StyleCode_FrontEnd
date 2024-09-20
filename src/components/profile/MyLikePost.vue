<template>
  <div class="ts-grid header-title is-middle-aligned is-spaced-between">
    <div class="ts-header is-huge is-heavy">我的收藏</div>
  </div>
  <div class="ts-container" style="margin-top: 10px">
    <div class="ts-selection is-fluid">
      <label class="item">
        <input type="radio" name="language" value="share" v-model="postType" />
        <div class="text">分享區</div>
      </label>
      <label class="item">
        <input type="radio" name="language" value="forum" v-model="postType" />
        <div class="text">論壇</div>
      </label>
    </div>
  </div>
  <!-------- 分 享 區 主 要 頁 面 -------->
  <div class="ts-container has-top-spaced">
    <div class="ts-grid is-3-columns is-relaxed is-stretched" v-if="postType === 'share'">
      <div class="column" v-for="(post, index) in sharePosts" :key="index">
        <div class="share-card">
          <div class="ts-icon is-bookmark-icon is-huge bookmark" @click.stop="removeBookmark(post.postId)"></div>
          <!-- ^書籤按鈕^ -->
          <div class="share-image" @click="navigateToPost(post.postId)">
            <img :src="post.images && post.images.length > 0
                ? `${path}/${post.images[0].imgUrl}`
                : '/default-image.png'
              " alt="Share Image" />
            />
          </div>
          <div class="share-info">
            <h3>{{ post.userName }}</h3>
            <!-- <div class="ts-grid is-spaced-between"> -->
            <p>{{ post.postTitle }}</p>
            <div class="ts-grid share-icons column">
              <div class="column">
                <span class="ts-icon is-heart-icon margin-right"></span>{{ post.likes.length }}
              </div>
              <div class="column">
                <span class="ts-icon is-bookmark-icon margin-right"></span>{{ post.collections.length }}
              </div>
            </div>
            <p>創建時間: {{ formatDate(post.createdAt) }}</p>
            <!-- </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-------- 論 壇 主 要 頁 面 -------->
  <div v-if="postType === 'forum'">
    <div class="ts-box is-horizontal" v-for="(post, index) in forumPosts" :key="index">
      <div class="ts-icon is-bookmark-icon is-huge column bookmark" @click="removeBookmark(post.postId)"></div>
      <div class="ts-image is-covered" @click="navigateToPost(post.postId)">
        <img :src="post.images && post.images.length > 0
            ? `${path}/${post.images[0].imgUrl}`
            : '/default-image.png'
          " width="150" height="100%" alt="Post Image" />
      </div>
      <div class="ts-content right-side">
        <div class="ts-grid is-spaced-between">
          <div class="ts-header column">{{ post.postTitle }}</div>
        </div>
        <p>{{ post.contentText }}</p>
        <div class="ts-grid icons">
          <div class="column">
            <span class="ts-icon is-heart-icon margin-right"></span>{{ post.likes.length }}
          </div>
          <div class="column">
            <span class="ts-icon is-bookmark-icon margin-right"></span>{{ post.collections.length }}
          </div>
        </div>
        <div class="post-dates">
          <div class="creation-date">創建時間: {{ formatDate(post.createdAt) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axiosapi from "@/plugins/axios.js";
import { ref, watch, onMounted } from "vue";
import useUserStore from "@/stores/user.js";
import { useRouter } from "vue-router";

const userId = Number(useUserStore().userId);
const postType = ref("share");
const sharePosts = ref([]); // 存儲分享區文章
const forumPosts = ref([]); // 存儲論壇文章
const path = import.meta.env.VITE_POST_IMAGE_URL;
const router = useRouter();

const navigateToPost = (postId) => {
  if (postType.value === "share") {
    router.push({ name: "shareDetails-link", params: { postId } });
  } else if (postType.value === "forum") {
    router.push({ name: "postContent-link", params: { id: postId } });
  }
};

const fetchCollections = async () => {
  try {
    const response = await axiosapi.get(`/collections/post/${userId}`);
    const posts = response.data;

    const validPosts = posts.filter(post => !post.deletedAt);

    sharePosts.value = [];
    forumPosts.value = [];
    validPosts.forEach((post) => {
      if (post.contentType === "forum") {
        forumPosts.value.unshift(post);
      } else if (post.contentType === "share") {
        sharePosts.value.unshift(post);
      }
    });

    console.log("分享文章:", sharePosts.value);
    console.log("論壇文章:", forumPosts.value);
  } catch (error) {
    console.error("取得貼文時出錯:",error.response ? error.response.data : error.message);
  }
};

//寫法參考 page/order.vue
watch(
  postType,
  () => {
    // 清空數組
    sharePosts.value = [];
    forumPosts.value = [];
    fetchCollections();
  },
  { immediate: true }
); //確保元件載入時也會執行一次

//取消收藏
const removeBookmark = async (postId) => {
  console.log(`要刪除的 postId: ${postId}`);
  try {
    // console.log(`刪除請求: /collections/${userId}/${postId}`);
    await axiosapi.delete(`/collections/${userId}/${postId}`);

    if (postType.value === "share") {
      sharePosts.value = sharePosts.value.filter(
        (post) => post.postId !== postId
      );
    } else if (postType.value === "forum") {
      forumPosts.value = forumPosts.value.filter(
        (post) => post.postId !== postId
      );
    }

    console.log("收藏已移除");
    console.log("當前分享文章:", sharePosts.value);
    console.log("當前論壇文章:", forumPosts.value);
  } catch (error) {
    console.error(
      "移除收藏時發生錯誤:",
      error.response ? error.response.data : error.message
    );
  }
};
onMounted(() => {
  window.scrollTo(0, 0);
});
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};
</script>

<style scoped>
.share-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.share-grid-item {
  width: 100%;
  display: flex;
  justify-content: center;
}

.share-card {
  width: 100%;
  max-width: 250px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
}

.share-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.share-image {
  width: 100%;
  padding-top: 100%;
  /* 1:1 寬高比 */
  position: relative;
  overflow: hidden;
}

.share-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.share-info {
  padding: 12px;
  background-color: #f8f8f8;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.share-info h3 {
  margin: 0 0 8px 0;
  font-size: 1em;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #333;
}

.share-info p {
  margin: 0 0 8px 0;
  font-size: 0.9em;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.share-icons {
  font-size: 14px;
  margin-top: auto;
}

.bookmark {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  padding: 5px;
}

@media (max-width: 768px) {
  .share-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 10px;
  }

  .share-card {
    max-width: none;
  }

  .share-info h3 {
    font-size: 0.9em;
  }

  .share-info p {
    font-size: 0.8em;
  }

  .share-icons {
    font-size: 12px;
  }

  .bookmark {
    font-size: 1.2em;
    right: 5px;
    top: 5px;
  }
}

@media (max-width: 480px) {
  .share-grid {
    gap: 8px;
    padding: 8px;
  }

  .share-info {
    padding: 8px;
  }

  .share-info h3 {
    font-size: 0.8em;
  }

  .share-info p {
    font-size: 0.7em;
  }

  .share-icons {
    font-size: 16px;
    margin-top: 10px;
  }
}

@media (max-width: 768px) {
  .share-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 10px;
  }

  .share-card {
    max-width: none;
  }

  .share-info h3 {
    font-size: 0.9em;
  }

  .share-info p {
    font-size: 0.8em;
  }

  .share-icons {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .share-grid {
    grid-template-columns: repeat(1, 1fr);
    gap: 8px;
    padding: 8px;
  }

  .share-info {
    padding: 8px;
  }
}
</style>