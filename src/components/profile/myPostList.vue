<template>
  <div class="ts-grid header-title is-middle-aligned is-spaced-between">
    <div class="ts-header is-huge is-heavy">我的文章</div>
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
    <div
      class="share-grid"
      v-if="postType === 'share'"
    >
    <div class="share-grid-item" v-for="post in shareposts" :key="post.postId">
      <div class="share-card" @click="viewPost(post)">
        <div class="ts-icon is-circular is-pen-icon is-large share-edit-button" @click.stop="viewPost(post)"></div>
      <!-- ^編輯按鈕^ -->
      <div class="share-image">
        <!-- 動態綁定圖片網址，如果沒有圖片就顯示預設圖片 -->
        <img :src="post.images && post.images.length > 0 ? `${path}/${post.images[0].imgUrl}` : '/default-image.png'" />
          </div>
      <div class="share-info">
        <!-- 動態綁定用戶名稱 -->
        <h3>{{ post.userName }}</h3>
        <div class="ts-grid is-spaced-between">
          <!-- 動態綁定文章標題 -->
          <p class="column">{{ post.postTitle }}</p>
          <div class="ts-grid share-icons column">
            <div class="column">
              <!-- 動態顯示喜歡數量 -->
              <span class="ts-icon is-heart-icon margin-right"></span>{{ post.likes.length }}
            </div>
            <div class="column">
              <!-- 動態顯示收藏數量 -->
              <span class="ts-icon is-bookmark-icon margin-right"></span>{{ post.collections.length }}
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-------- 論 壇 主 要 頁 面 -------->
    <div v-if="postType === 'forum'">
    <div class="ts-box is-horizontal" v-for="post in forumposts" :key="post.postId">
      <div class="ts-image is-covered">
        <img :src="post.images && post.images.length > 0 ? `${path}/${post.images[0].imgUrl}` : '/default-image.png'" width="150" height="100%" />
      </div>
      <div class="ts-content right-side">
        <div class="ts-grid is-spaced-between">
          <div class="ts-header column">
            {{ post.postTitle }}
          </div>
          <div class="ts-icon is-pen-icon is-large column edit-button" @click.stop="viewPost(post)"></div>
          <!-- ^編輯按鈕^ -->
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
  </div>
</template>

<script setup>
import axiosapi from "@/plugins/axios.js";
import { ref, watch } from "vue";
import useUserStore from "@/stores/user.js";
import { useRouter } from 'vue-router';

const userId = useUserStore().userId;
const postType = ref("share");
const posts = ref([]);
const forumposts = ref([]);
const shareposts = ref([]);
const path = import.meta.env.VITE_POST_IMAGE_URL;
const router = useRouter();

const viewPost = (post) => {
  if (post.contentType === 'share') {
    router.push({ name: 'shareDetails-link', params: { postId: post.postId } }); 
  } else if (post.contentType === 'forum') {
    router.push({ name: 'postContent-link', params: { id: post.postId } }); 
  }
};

//寫法參考 page/order.vue
watch(
  postType,
  (newType) => {
     // 清空數組不互相傳遞
    forumposts.value = [];
    shareposts.value = [];

    axiosapi
      .get(`/post/user/${userId}?type=${newType}`)
      .then((response) => {
        posts.value = response.data
        console.log('Posts:', posts.value); // 打印所有的帖子数据
        // 遍歷所有文章
        response.data.forEach(post => {
          if (post.contentType === 'forum') {
            forumposts.value.push(post);
          } else if (post.contentType === 'share') {
            shareposts.value.push(post);
          }
        });
        console.log('論壇文章:', forumposts.value); // 打印論壇文章
        console.log('分享文章:', shareposts.value); // 打印分享文
      })
      .catch((error) => {
        console.error('取得貼文時出錯:', error);
      });
  },
  { immediate: true } // 確保元件加載時也會執行一次
);
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

.share-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
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
}

.share-image {
  width: 100%;
  height: 0;
  padding-bottom: 100%; /* 创建一个正方形的容器 */
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
}
.right-side {
  width: 100%;
}
.margin-right {
  margin-right: 10px;
}
.is-heart-icon {
  color: pink;
}
.is-bookmark-icon {
  color: cornflowerblue;
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
.share-edit-button {
  position: absolute;
  right: 10px;
  top: 10px;
  background-color: #f0f0f0;
}
.icons {
  font-size: 18px;
}
.share-icons {
  font-size: 16px;
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
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    padding: 8px;
  }

  .share-info {
    padding: 8px;
  }
}

</style>
