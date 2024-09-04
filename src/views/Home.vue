<template>
  <div class="home-page">
    <div class="full-width-carousel">
      <div class="carousel-container" :style="{ transform: `translateX(-${currentPage * 100}%)` }">
        <div v-for="(page, pageIndex) in carouselPages" :key="pageIndex" class="carousel-page">
          <div v-for="post in page" :key="post.postId" class="carousel-item" @click="navigateToShareDetails(post.postId)">
            <img :src="getImageUrl(post)" :alt="post.userName" />
            <div class="carousel-caption">
              <h3>{{ post.userName || 'Unknown User' }}</h3>
              <p>{{ post.postTitle }}</p>
            </div>
          </div>
        </div>
      </div>
      <button class="carousel-control prev" @click="prevPage">&lt;</button>
      <button class="carousel-control next" @click="nextPage">&gt;</button>
      <div class="carousel-indicators">
        <span 
          v-for="(page, index) in carouselPages" 
          :key="index" 
          :class="{ active: currentPage === index }"
          @click="goToPage(index)"
        ></span>
      </div>
    </div>

    <div class="shared-posts-section">
      <h2>最新分享</h2>
      <div class="shared-posts-grid">
        <ShareCard v-for="post in limitedSharedPosts" :key="post.postId" :post="post" />
      </div>
    </div>

    <div class="site-philosophy">
      <h2>我們的理念</h2>
      <p>在這裡分享您的穿搭靈感，讓時尚激發無限可能！</p>
    </div>
  </div>
</template>
  
  <script setup>
  import { ref, onMounted, computed ,onUnmounted} from 'vue';
  import { useRouter } from 'vue-router';
  import axiosapi from '@/plugins/axios.js';
  import ShareCard from '@/components/share/ShareCard.vue';
  
  const router = useRouter();
  const posts = ref([]);
  const currentPage = ref(0);
  const imageUrls = ref({});
  
  const carouselPages = computed(() => {
    const pages = [];
    for (let i = 0; i < posts.value.length; i += 3) {
      pages.push(posts.value.slice(i, i + 3));
    }
    return pages;
  });
  
  onMounted(async () => {
    try {
      const response = await axiosapi.get('/post/latest?limit=9');
      posts.value = response.data;
      await loadImages();
      startAutoSlide(); // 啟動自動輪播
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  });
  
  async function loadImages() {
  for (const post of posts.value) {
    if (post.imageUrls && post.imageUrls.length > 0) {
      imageUrls.value[post.postId] = `${import.meta.env.VITE_POST_IMAGE_URL}${post.imageUrls[0]}`;
    } else {
      imageUrls.value[post.postId] = '../../../public/No_image.png';
    }
  }
}

const limitedSharedPosts = computed(() => {
  return sharedPosts.value.slice(0, 15); // 限制為15個帖子（3行x5列）
});

const sharedPosts = ref([]);

onMounted(async () => {
  try {
    const response = await axiosapi.get('/post/latest?limit=9');
    posts.value = response.data;
    await loadImages();
    startAutoSlide();

    // 獲取分享文章
    const sharedResponse = await axiosapi.get('/post?contentType=分享&limit=20'); // 根據您的API調整
    sharedPosts.value = sharedResponse.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});
  
  function getImageUrl(post) {
    return imageUrls.value[post.postId] || '../../../public/No_image.png';
  }
  
  function navigateToShareDetails(postId) {
    router.push({ name: 'shareDetails-link', params: { postId } });
  }
  
  function prevPage() {
    currentPage.value = (currentPage.value - 1 + carouselPages.value.length) % carouselPages.value.length;
  }
  
  function nextPage() {
    currentPage.value = (currentPage.value + 1) % carouselPages.value.length;
  }
  
  function goToPage(index) {
    currentPage.value = index;
  }
  
  let autoSlideInterval;
  
  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      nextPage();
    }, 5000); // 每5秒自動切換一次
  }
  
  // 在組件卸載時清除定時器
  onUnmounted(() => {
    clearInterval(autoSlideInterval);
  });
  </script>
  
  <style scoped>
.home-page {
  width: 100%;
  overflow-x: hidden;
}

.full-width-carousel {
  width: 100vw;
  height: calc(100vh - 90px);
  position: relative;
  overflow: hidden;
  margin-top: 10px;
}

.carousel-container {
  display: flex;
  transition: transform 0.5s ease;
  height: 100%;
}

.carousel-page {
  display: flex;
  flex: 0 0 100%;
  width: 100%;
}

.carousel-item {
  flex: 1;
  position: relative;
  cursor: pointer;
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 10px;
}

.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.09);
  color: white;
  border: none;
  padding: 10px 15px;
  font-size: 18px;
  cursor: pointer;
}

.carousel-control.prev {
  left: 10px;
}

.carousel-control.next {
  right: 10px;
}

.carousel-indicators {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.carousel-indicators span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}

.carousel-indicators span.active {
  background: white;
}

.shared-posts-section {
  padding: 20px;
  background-color: #f0f0f0;
}

.shared-posts-section h2 {
  text-align: center;
  margin-bottom: 20px;
}

.shared-posts-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  max-width: 1300px;
  margin: 0 auto;
}

.site-philosophy {
  background-color: #e0e0e0;
  padding: 40px 20px;
  text-align: center;
}

.site-philosophy h2 {
  margin-bottom: 20px;
}

.site-philosophy p {
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}

/* 響應式設計 */
@media (max-width: 1024px) {
  .shared-posts-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .full-width-carousel {
    height: 50vh;
  }

  .shared-posts-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .carousel-caption h3 {
    font-size: 1em;
  }

  .carousel-caption p {
    font-size: 0.8em;
  }
}

@media (max-width: 480px) {
  .full-width-carousel {
    height: 40vh;
  }

  .shared-posts-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .carousel-control {
    padding: 5px 10px;
    font-size: 14px;
  }

  .site-philosophy h2 {
    font-size: 1.5em;
  }

  .site-philosophy p {
    font-size: 0.9em;
  }
}
</style>