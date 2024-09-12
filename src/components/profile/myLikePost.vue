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
            <img
              :src="post.images && post.images.length > 0 ? `${path}/${post.images[0].imgUrl}` : '/default-image.png'"
              alt="Share Image" /> />
          </div>
          <div class="share-info">
            <h3>{{ post.userName }}</h3>
            <!-- <div class="ts-grid is-spaced-between"> -->
            <p>{{ post.postTitle }}</p>
            <div class="ts-grid share-icons column ">
              <div class="column">
                <span class="ts-icon is-heart-icon margin-right"></span>{{ post.likes.length }}
              </div>
              <div class="column">
                <span class="ts-icon is-bookmark-icon margin-right"></span>{{ post.collections.length }}
              </div>
            </div>
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
        <img :src="post.images && post.images.length > 0 ? `${path}/${post.images[0].imgUrl}` : '/default-image.png'"
          width="150" height="100%" alt="Post Image" />
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
      </div>
    </div>
  </div>
</template>

<script setup>
import axiosapi from "@/plugins/axios.js";
import { ref, watch } from "vue";
import useUserStore from "@/stores/user.js";
import { useRouter } from 'vue-router';

const userId = Number(useUserStore().userId);
const postType = ref("share");
const sharePosts = ref([]);  // 存儲分享區文章
const forumPosts = ref([]);  // 存儲論壇文章
const path = import.meta.env.VITE_POST_IMAGE_URL;
const router = useRouter();

const navigateToPost = (postId) => {
  if (postType.value === 'share') {
    router.push({ name: 'shareDetails-link', params: { postId } });
  } else if (postType.value === 'forum') {
    router.push({ name: 'postContent-link', params: { id: postId } });
  }
};

//寫法參考 page/order.vue
watch(
  postType,
  () => {
    // 清空數組
    sharePosts.value = [];
    forumPosts.value = [];
    axiosapi
      .get(`/collections/post/${userId}`)
      .then((response) => {
        const posts = response.data;
        // console.log('獲取的貼文:', posts); 
        posts.forEach(post => {
          if (post.contentType === 'forum') {
            forumPosts.value.push(post);
          } else if (post.contentType === 'share') {
            sharePosts.value.push(post);
          }
        });
        // 根據 postType 顯示相應的文章
        if (postType.value === "share") {
          console.log('分享文章:', sharePosts.value);
        } else if (postType.value === "post") {
          console.log('論壇文章:', forumPosts.value);
        }
      })
      .catch((error) => {
        console.error('取得貼文時出錯:', error.response ? error.response.data : error.message);
      });
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
      sharePosts.value = sharePosts.value.filter(post => post.postId !== postId);
    } else if (postType.value === "forum") {
      forumPosts.value = forumPosts.value.filter(post => post.postId !== postId);
    }

    console.log('收藏已移除');
    console.log('當前分享文章:', sharePosts.value);
    console.log('當前論壇文章:', forumPosts.value);
  } catch (error) {
    console.error('移除收藏時發生錯誤:', error.response ? error.response.data : error.message);
  }
};
</script>

<style scoped>
.share-card {
  width: 250px;
  /* 設置固定寬度 */
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

.share-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.share-image {
  width: 100%;
  height: 300px;
  /* 設置固定高度 */
  overflow: hidden;
}

.share-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 確保圖片填滿容器並保持比例 */
}

.share-info {
  padding: 12px;
  background-color: #f8f8f8;
}

.share-info h3 {
  margin: 0;
  font-size: 1em;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #333;
}

.share-info p {
  margin: 8px 0 0;
  font-size: 0.9em;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ts-box {
  height: 150px;
  position: relative;
}

.right-side {
  width: 100%;
}

.margin-right {
  margin-right: 10px;
}

.bookmark {
  position: absolute;
  right: 10px;
  top: -10px;
}

.edit-button:hover {
  cursor: pointer;
  color: #0050b3;
}

.share-edit-button:hover {
  cursor: pointer;
  color: cornflowerblue;
  background-color: #d6d6d6;
}

.icons {
  font-size: 18px;
}

.share-icons {
  font-size: 16px;
  margin-top: 10px;
}
</style>
