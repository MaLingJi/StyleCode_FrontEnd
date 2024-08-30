<template>
  <div class="container">
    <section class="post-content">
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
        <!-- <button @click="toggleLike">{{ post.isLiked ? '收回讚' : '按讚' }} ({{ likes }})</button> -->
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
        <!-- <button @click="toggleCollect">{{ post.isCollected ? '取消收藏' : '收藏' }} ({{ collects }})</button> -->
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
                <p>{{ item.comment }}</p>
                <span class="comment-time">{{ dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss') }}</span>
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
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router'; 
import axiosapi from "@/plugins/axios.js"; 
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { StarFilled, StarOutlined, HeartFilled, HeartOutlined, ShareAltOutlined } from '@ant-design/icons-vue';

dayjs.extend(relativeTime);

const post = ref({
  postId: '',
  postTitle: '',
  contentText: '',
  isLiked: false,
  isCollected: false,
  likesCount: 0,
  collectionsCount: 0,
});
const comments = ref([]);
const newComment = ref('');
const submitting = ref(false);
const route = useRoute(); 

const likes = ref<number>(0);
const collects = ref<number>(0);
const shares = ref<number>(0);
const liked = ref<boolean>(false);
const collected = ref<boolean>(false);
const userId = ref<number>(1);

onMounted(() => {
  const postId = route.params.id as string; 
  fetchPost(postId);
  fetchComments(postId);
  fetchLikeStatus(postId, userId.value);
  fetchCollectStatus(postId, userId.value);
});

onBeforeUnmount(() => {
  post.value = {
    postId: '',
    postTitle: '',
    contentText: '',
    isLiked: false,
    isCollected: false,
    likesCount: 0,
    collectionsCount: 0,
  };
  comments.value = [];
  newComment.value = '';
});

function fetchPost(postId: string) {
  axiosapi.get(`/post/${postId}`).then(response => {
    post.value = {
      ...response.data,
      isLiked: response.data.isLiked || false,
      isCollected: response.data.isCollected || false,
    };
    likes.value = response.data.likesCount || 0;
    collects.value = response.data.collectionsCount || 0;
    shares.value = response.data.shares || 0;
  }).catch(error => {
    console.error("獲取文章失敗:", error);
  });
}

function fetchComments(postId: string) {
  axiosapi.get(`/comment?postId=${postId}`).then(response => {
    comments.value = response.data.map(comment => ({
      ...comment,
      userDetail: comment.userDetail || { id: 'unknown' },
      createdAt: dayjs(comment.createdAt)
    }));
  }).catch(error => {
    console.error("獲取評論失敗:", error);
  });
}

function fetchLikeStatus(postId: string, userId: number) {
  axiosapi.get(`/likes/${postId}/${userId}`).then(() => {
    liked.value = true;
    post.value.isLiked = true;
  }).catch(() => {
    liked.value = false;
    post.value.isLiked = false;
  });
}

function fetchCollectStatus(postId: string, userId: number) {
  axiosapi.get(`/collections/${postId}/${userId}`).then(() => {
    collected.value = true;
    post.value.isCollected = true;
  }).catch(() => {
    collected.value = false;
    post.value.isCollected = false;
  });
}

function handleSubmit() {
  if (!newComment.value) {
    return;
  }

  submitting.value = true;

  const postId = route.params.id as string;
  axiosapi.post(`/comment`, {
    comment: newComment.value,
    post: { postId: postId },
    createdAt: dayjs().toISOString(),
    userDetail: { id: userId.value }
  }).then(response => {
    comments.value.unshift({
      ...response.data,
      userDetail: { id: userId.value },
      createdAt: dayjs()
    });
    newComment.value = '';
  }).catch(error => {
    console.error("新增評論失敗:", error);
  }).finally(() => {
    submitting.value = false;
  });
}

const toggleLike = () => {
  const postId = post.value.postId;
  if (post.value.isLiked) {
    axiosapi.delete(`/likes/${postId}/${userId.value}`).then(() => {
      post.value.isLiked = false;
      likes.value = Math.max(likes.value - 1, 0);
      updatePostData(postId); // 更新后端数据
    }).catch(error => {
      console.error("取消點讚失敗:", error);
    });
  } else {
    axiosapi.post(`/likes`, {
      posts: { postId: postId },
      userDetail: { id: userId.value }
    }).then(() => {
      post.value.isLiked = true;
      likes.value += 1;
      updatePostData(postId); // 更新后端数据
    }).catch(error => {
      console.error("點讚失敗:", error);
    });
  }
};

const toggleCollect = () => {
  const postId = post.value.postId;
  if (post.value.isCollected) {
    axiosapi.delete(`/collections/${postId}/${userId.value}`).then(() => {
      post.value.isCollected = false;
      collects.value = Math.max(collects.value - 1, 0);
      updatePostData(postId); // 更新后端数据
    }).catch(error => {
      console.error("取消收藏失敗:", error);
    });
  } else {
    axiosapi.post(`/collections`, {
      posts: { postId: postId },
      userDetail: { id: userId.value }
    }).then(() => {
      post.value.isCollected = true;
      collects.value += 1;
      updatePostData(postId); // 更新后端数据
    }).catch(error => {
      console.error("收藏失敗:", error);
    });
  }
};

const toggleShare = () => {
  shares.value += 1;
  updatePostData(post.value.postId); // 更新后端数据
};

function updatePostData(postId: string) {
  axiosapi.put(`/post/${postId}`, {
    likesCount: likes.value,
    collectionsCount: collects.value,
    shares: shares.value
  }).catch(error => {
    console.error("更新文章數據失敗:", error);
  });
}
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