<template>
  <div class="container">
    <div class="content">
      <div class="rule-box">
        <a-typography>
          <a-typography-title>論壇區規範</a-typography-title>
          <a-typography-paragraph>
            本論壇為討論服飾為主，請不要發跟本版沒有關係的文章以及主題，所有違反規則的文章將有可能被自動刪除或停權帳號而不作任何通知，請各位遵守論壇規章及守則
          </a-typography-paragraph>
          <a-typography-paragraph>
            請勿連續回文，請勿複製其他的回文內容當成是自已的回文內容。近期
            <a-typography-text strong style="color: red;">詐騙</a-typography-text>
            猖狂甚多請勿發連結相關到文章，系統將自動偵查<a-typography-text strong style="color: red;">刪除</a-typography-text>。
          </a-typography-paragraph>
          <a-typography-title :level="2">發文和照片 規範及限制</a-typography-title>
          <a-typography-paragraph>
            麻煩各位遵守論壇規章
            (<a-typography-text strong style="color: red;">照片</a-typography-text>
            最多上傳3張共
            <a-typography-text strong style="color: red;">20MB</a-typography-text>
            ), 嚴禁濫發品優低劣的主題或相同的主題，請勿使用廣東話，注音文憀慁愬慇，火星文..等非正式或共通性的語言，嚴禁發表任何人身攻擊, 侮辱他人或引起國際紛争的內容，若受到不公平、不公正的對待, 歡迎向我們反映和投訴, 我們將會秉公處理。
          </a-typography-paragraph>
        </a-typography>
        <!-- 發文按鈕 -->
        <div class="buttons">
          <router-link :to="{ name: 'post-link' }">
            <a-button type="primary" style="background-color: #ff8f00; border-color: #ff8f00; height: 47px; font-size: 23px;" size="large">
              <span class="icon">
                <i class="fas fa-edit"></i>
              </span>
              <span>發文</span>
            </a-button>
          </router-link>
        </div>
      </div>
      <!-- 浮動式至頂效果 -->
      <div :style="{ height: '1vh', padding: '10px' }">
        <a-back-top />
      </div>
      <!-- 發文地方 -->
      <section>
        <a-list
          item-layout="vertical"
          size="large"
          :pagination="pagination"
          :data-source="listData"
        >
          <template #footer>
            <div class="ts-checklist">
              <div class="item is-warning">發言前請三思而後行。</div>
            </div>
          </template>
          <template #renderItem="{ item }">
            <a-list-item :key="item.postId">
              <template #actions>
                <span @click.stop="likePost(item.postId)" style="cursor: pointer; margin-right: 8px;">
                  <heart-outlined v-if="!item.liked" style="color: #eb2f96;" />
                  <heart-filled v-else style="color: #eb2f96;" />
                  {{ item.likes }}
                </span>
                <span @click.stop="collectPost(item.postId)" style="cursor: pointer; margin-right: 8px;">
                  <star-outlined v-if="!item.collected" style="color: #fadb14;" />
                  <star-filled v-else style="color: #fadb14;" />
                  {{ item.collects }}
                </span>
                <span @click.stop="commentPost(item.postId)" style="cursor: pointer; color: #1890ff;">
                  <message-outlined />
                  {{ item.comments }}
                </span>
              </template>
              <template #extra>
                <div>
                  <img v-if="item.images && item.images.length > 0" width="272" alt="Post Image" :src="`${path}${item.images[0].imgUrl}`" />
                </div>
              </template>
              <a-list-item-meta :description="item.contentText">
                <template #title>
                  <router-link :to="`/post/${item.postId}`" tag="a">{{ item.postTitle }}</router-link>
                </template>
                <template #avatar><a-avatar :src="item.avatar" /></template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axiosapi from "@/plugins/axios.js"; 
import { StarOutlined, StarFilled, HeartOutlined, HeartFilled, MessageOutlined } from '@ant-design/icons-vue';
import useUserStore from "@/stores/user.js";

const userStore = useUserStore();
const listData = ref([]);
const path = import.meta.env.VITE_POST_IMAGE_URL; 

const pagination = ref({
  onChange: (page) => {
    console.log(page);
  },
  pageSize: 10,
  total: 0,
});

onMounted(() => {
  callFind(); // 加載獲取所有文章
});

async function callFind() {
  try {
    const response = await axiosapi.get("/post");
    console.log("回覆:", response.data);
    // 過濾不屬於論壇和刪除過後的帖子
    const filteredPosts = response.data.filter(post => post.contentType === "forum" && !post.deletedAt && post.images && post.images.length > 0);
    // 獲取留言的數量，過濾掉已刪除的留言
    for (const post of filteredPosts) {
      post.comments = post.comments ? post.comments.filter(comment => !comment.deletedAt).length : 0;
      post.collects = post.collections ? post.collections.length : 0;
      post.likes = post.likes ? post.likes.length : 0;
      // 確保狀態正確更新
      post.liked = await checkIfUserLiked(post.postId);
      post.collected = await checkIfUserCollected(post.postId);
    }
    filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    listData.value = filteredPosts;
    pagination.value.total = listData.value.length;
  } catch (error) {
    console.error("發現錯誤:", error.response ? error.response.data : error.message);
  }
}

const checkIfUserLiked = async (postId) => {
  try {
    const response = await axiosapi.get(`/likes/${userStore.userId}/${postId}`);
    return response.status === 200; // 如果返回200，表示用戶已經點讚
  } catch (error) {
    return false; // 如果出現錯誤，表示用戶未點讚
  }
};

const checkIfUserCollected = async (postId) => {
  try {
    const response = await axiosapi.get(`/collections/${userStore.userId}/${postId}`);
    return response.status === 200; // 如果返回200，表示用戶已經收藏
  } catch (error) {
    return false; // 如果出現錯誤，表示用戶未收藏
  }
};

const likePost = async (id) => {
  try {
    const post = listData.value.find(item => item.postId === id);
    if (post) {
      if (post.liked) {
        await axiosapi.post('/likes/toggle', {
          userId: userStore.userId,
          postId: id
        });
        post.likes -= 1;
      } else {
        await axiosapi.post('/likes/toggle', {
          userId: userStore.userId,
          postId: id
        });
        post.likes += 1;
      }
      post.liked = !post.liked;
    }
  } catch (error) {
    console.error("喜歡操作失敗:", error.response ? error.response.data : error.message);
  }
};

const collectPost = async (id) => {
  try {
    const post = listData.value.find(item => item.postId === id);
    if (post) {
      if (post.collected) {
        await axiosapi.post('/collections/toggle', {
          userId: userStore.userId,
          postId: id
        });
        post.collects -= 1;
      } else {
        await axiosapi.post('/collections/toggle', {
          userId: userStore.userId,
          postId: id
        });
        post.collects += 1;
      }
      post.collected = !post.collected;
    }
  } catch (error) {
    console.error("收藏操作失敗:", error.response ? error.response.data : error.message);
  }
};

const commentPost = (id) => {
  // const post = listData.value.find(item => item.postId === id);

};
</script>

<style scoped>
img {
  max-width: 100%; 
  max-height: 250px; /* 最大高度限制 */
  height: auto; 
  width: auto; 
  border-radius: 8px; 
}
.forum-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.forum-content {
  flex: 1 0 auto;
  padding-bottom: 20px; /* 為 footer 留出空間 */
}

.container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

.content {
  width: 100%;
  background-color: white;
  border-radius: 8px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
.rule-box {
  background-color: #f0f0f0;
  padding: 1px 24px; /* 內邊距 */
  border-radius: 8px;
}

.footer {
  background-color: #f8f8f8;
  padding: 20px 0;
  margin-top: auto;
}

.footer-content {
  display: flex;
  justify-content: space-around;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-section {
  flex: 1;
  margin: 0 10px;
}

.footer-bottom {
  text-align: center;
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid #e0e0e0;
}
</style>
