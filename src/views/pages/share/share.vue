<template>
  <div class="ts-content is-center-aligned" style="background: var(--ts-gray-50)">
    <div class="ts-container is-narrow">
      <div class="ts-header is-center-aligned is-huge is-heavy">
        <RouterLink to="/new-share"><button class="ts-button">分享你的穿搭</button></RouterLink>
      </div>
    </div>
  </div>
  <div class="ts-divider"></div>
  <div class="ts-container">
    <div class="share-grid">
      <div 
        v-for="post in filteredPosts"
        :key="post.postId"
        class="share-grid-item"
      >
        <ShareCard :post="post" style="cursor: pointer"/>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
  import ShareCard from '@/components/share/ShareCard.vue';
  import { ref, onMounted, computed } from 'vue';
  import axiosapi from '@/plugins/axios.js';
  import Swal from 'sweetalert2';
  
  const posts = ref([]);
  
  onMounted(function () {
      callFind();
  });
  
  const filteredPosts = computed(() => {
    return posts.value.filter(post => post.deletedAt === null && post.contentType === 'share');
  });
  
  function callFind() {
      console.log("callFind");
      Swal.fire({
          text: "Loading......",
          showConfirmButton: false,
          allowOutsideClick: false,
      });
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
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
}

.share-grid-item {
  width: 100%;
  display: flex;
  justify-content: center;
}

@media (max-width: 1024px) {
  .share-grid {
    gap: 15px;
    padding: 15px;
  }
}

@media (max-width: 768px) {
  .share-grid {
    gap: 10px;
    padding: 10px;
  }

  .ts-header.is-huge {
    font-size: 1.5rem;
  }

  .ts-button {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }
}

@media (max-width: 480px) {
  .share-grid {
    gap: 5px;
    padding: 5px;
  }

  .ts-header.is-huge {
    font-size: 1.2rem;
  }

  .ts-button {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
}

/* 可能需要添加到 ShareCard 组件中的样式 */
:deep(.share-card) {
  width: 100%;
  font-size: 0.9rem;
}

@media (max-width: 480px) {
  :deep(.share-card) {
    font-size: 0.8rem;
  }
}
</style>