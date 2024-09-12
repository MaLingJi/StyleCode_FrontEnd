<template>
  <div class="home-page">
    <!-- 輪播牆 -->
    <div class="full-width-carousel">
      <div class="carousel-container" :style="{ transform: `translateX(-${currentPage * 100}%)` }">
        <div v-for="(page, pageIndex) in carouselPages" :key="pageIndex" class="carousel-page">
          <div v-for="post in page" :key="post.postId" class="carousel-item" @click="navigateToShareDetails(post.postId)">
            <img :src="getImageUrl(post)" :alt="post.userName" />
            <div class="carousel-caption">
              <h3>{{ post.userName || 'Unknown User' }}</h3>
              <p class="post-title">{{ post.postTitle }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="carousel-indicators">
        <span 
          v-for="(page, index) in carouselPages" 
          :key="index" 
          :class="{ active: currentPage === index }"
          @click="goToPage(index)"
        ></span>
      </div>
    </div>

    <!-- 照片拼接牆 -->
    <div class="mosaic-grid">
      <div v-for="(post, index) in mosaicPosts" :key="post.postId" 
           :class="['mosaic-item', `item-${index + 1}`]"
           @click="navigateToShareDetails(post.postId)">
        <img :src="getImageUrl(post)" :alt="post.userName" />
        <div class="mosaic-caption">
          <h3>{{ post.userName || 'Unknown User' }}</h3>
          <p class="post-title">{{ post.postTitle }}</p>
        </div>
      </div>
    </div>

    <!-- 網站理念 -->
    <div class="site-philosophy">
      <h2>我們的理念</h2>
      <p>在這裡分享您的穿搭靈感，讓時尚激發無限可能！</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import axiosapi from '@/plugins/axios.js';

const router = useRouter();
const carouselPosts = ref([]);
const mosaicPosts = ref([]);
const currentPage = ref(0);
const imageUrls = ref({});

const carouselPages = computed(() => {
  const pages = [];
  for (let i = 0; i < carouselPosts.value.length; i += 3) {
    pages.push(carouselPosts.value.slice(i, i + 3));
  }
  return pages;
});

async function loadImages() {
  const allPosts = [...carouselPosts.value, ...mosaicPosts.value];
  for (const post of allPosts) {
    if (post.imageUrls && post.imageUrls.length > 0) {
      imageUrls.value[post.postId] = `${import.meta.env.VITE_POST_IMAGE_URL}${validImages[0].imgUrl}`;
    } else {
      imageUrls.value[post.postId] = '/No_image.png';
    }
  }
}

function getImageUrl(post) {
  return imageUrls.value[post.postId] || '/No_image.png';
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

onMounted(async () => {
  try {
    // 獲取最多讚的9篇文章作為輪播
    const carouselResponse = await axiosapi.get('/post/most-liked?limit=9');
    carouselPosts.value = carouselResponse.data;

    // 獲取最新的17篇分享文章作為照片牆
    const mosaicResponse = await axiosapi.get('/post/latest-share?limit=17');
    mosaicPosts.value = mosaicResponse.data;

    await loadImages();
    startAutoSlide();
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
});

// 在組件卸載時清除定時器
onUnmounted(() => {
  clearInterval(autoSlideInterval);
});
</script>

<style scoped>
.home-page {
  width: 100%;
  background-color: #f0f0f0;
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

.mosaic-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(100px, auto);
  gap: 10px;
  padding: 20px;
  background-color: #e0e0e0;
}

.mosaic-item {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.mosaic-item:hover {
  transform: scale(1.05);
}

.mosaic-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px;
  font-size: 0.8em;
}

.mosaic-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 定義每個項目的大小 */
.item-1, .item-2 { grid-column: span 2; grid-row: span 2; }
.item-3, .item-4, .item-5 { grid-column: span 1; grid-row: span 2; }
.item-6, .item-7, .item-8, .item-9, .item-10, .item-11, .item-12 { grid-column: span 1; grid-row: span 1; }
.item-13, .item-14 { grid-column: span 2; grid-row: span 2; }
.item-15, .item-16, .item-17 { grid-column: span 1; grid-row: span 2; }

.site-philosophy {
  background-color: #d0d0d0;
  padding: 40px 20px;
  text-align: center;
  color: #333333;
}

.site-philosophy h2 {
  margin-bottom: 20px;
  font-size: 2em;
}

.site-philosophy p {
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
  font-size: 1.2em;
}

@media (max-width: 768px) {
  .mosaic-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 5px;
    padding: 10px;
  }

  .item-1, .item-2 { grid-column: span 2; grid-row: span 2; }
  .item-3, .item-4, .item-5 { grid-column: span 2; grid-row: span 1; }
  .item-6, .item-7, .item-8, .item-9 { grid-column: span 1; grid-row: span 1; }
  .item-10, .item-11 { grid-column: span 2; grid-row: span 2; }
  .item-12, .item-13, .item-14 { grid-column: span 2; grid-row: span 1; }
  .item-15, .item-16, .item-17 { grid-column: span 1; grid-row: span 1; }

  .mosaic-caption {
    padding: 3px;
  }

  .mosaic-caption h3 {
    font-size: 0.7em;
    margin: 0;
  }

  .post-title {
    display: none;
  }

  .full-width-carousel {
    height: 50vh;
  }

  .carousel-caption h3 {
    font-size: 0.8em;
    margin-bottom: 0;
  }

  .carousel-caption {
    padding: 5px;
  }
}

@media (max-width: 480px) {
  .mosaic-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 3px;
    padding: 5px;
  }

  .item-1, .item-2 { grid-column: span 3; grid-row: span 2; }
  .item-3, .item-4, .item-5 { grid-column: span 1; grid-row: span 2; }
  .item-6, .item-7, .item-8, .item-9, .item-10, .item-11 { grid-column: span 1; grid-row: span 1; }
  .item-12, .item-13 { grid-column: span 3; grid-row: span 2; }
  .item-14, .item-15, .item-16 { grid-column: span 1; grid-row: span 2; }
  .item-17 { grid-column: span 3; grid-row: span 1; }

  .mosaic-caption h3 {
    font-size: 0.6em;
  }

  .full-width-carousel {
    height: 40vh;
  }

  .site-philosophy h2 {
    font-size: 1.2em;
  }

  .site-philosophy p {
    font-size: 0.9em;
  }
}
</style>