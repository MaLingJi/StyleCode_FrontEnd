<template>
  <div class="ts-content is-center-aligned" style="background: var(--ts-gray-50)">
    <div class="ts-container is-narrow">
      <div class="ts-header is-center-aligned is-huge is-heavy">
        <RouterLink to="/new-share"><button class="ts-button">分享你的穿搭</button></RouterLink>
      </div>
      <div class="ts-input">
        <input type="text" v-model="searchQuery" placeholder="搜尋標題或標籤...">
      </div>
    </div>
  </div>
  <div class="ts-divider"></div>
  <div class="ts-container">
    <div class="share-grid">
      <div v-for="post in filteredPosts" :key="post.postId" class="share-grid-item">
        <ShareCard :post="post" style="cursor: pointer" />
      </div>
    </div>
  </div>
</template>

<script setup>
import ShareCard from '@/components/share/ShareCard.vue';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axiosapi from '@/plugins/axios.js';
import Swal from 'sweetalert2';

const route = useRoute();
const posts = ref([]);
const searchQuery = ref('');

onMounted(function () {
  if (route.query.tag) {
    searchQuery.value = route.query.tag;
  }
  callFind();
});

// const filteredPosts = computed(() => {
//   return posts.value.filter(post => post.deletedAt === null && post.contentType === 'share');
// });

const filteredPosts = computed(() => {
  if (searchQuery.value.trim() === '') {
    // 如果搜索欄是空的，顯示所有符合條件的帖子
    return posts.value.filter(post => post.deletedAt === null && post.contentType === 'share');
  } else {
    // 如果有搜索欄輸入，根據輸入值過濾帖子
    const query = searchQuery.value.toLowerCase();
    return posts.value.filter(post => {
      const matchesTitle = post.postTitle?.toLowerCase().includes(query);
      const matchesTags = post.postTags && Array.isArray(post.postTags) && post.postTags.some(tag => tag.tagName?.toLowerCase().includes(query));
      return post.deletedAt === null && post.contentType === 'share' && (matchesTitle || matchesTags);
    });
  }
});

function callFind() {
  console.log("callFind");
  axiosapi.get("/post").then(function (response) {
    posts.value = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    console.log("posts.value: ", posts.value);
    
    setTimeout(function () {
      Swal.close();
    }, 500);
  }).catch(function (error) {
    console.log("callFind error", error);
    Swal.fire({
      text: '失敗：' + error.message,
      icon: 'error',
      allowOutsideClick: false,
      confirmButtonColor: 'rgb(35 40 44)',
      confirmButtonText: '確認',
    });
  });
}
</script>

<style scoped>
.share-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.share-grid-item {
  width: 100%;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .share-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .share-grid {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 10px;
  }
}
</style>