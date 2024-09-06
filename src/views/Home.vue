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
              <p>{{ post.postTitle }}</p>
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
        <p>{{ post.postTitle }}</p>
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
import { ref, onMounted, computed ,onUnmounted} from 'vue';
import { useRouter } from 'vue-router';
import axiosapi from '@/plugins/axios.js';

const router = useRouter();
const posts = ref([]);
const currentPage = ref(0);
const imageUrls = ref({});

const carouselPages = computed(() => {
  const pages = [];
  for (let i = 0; i < Math.min(posts.value.length, 9); i += 3) {
    pages.push(posts.value.slice(i, i + 3));
  }
  return pages;
});

const mosaicPosts = computed(() => {
  return posts.value.slice(9, 26); // 使用第10到第25張照片作為拼接牆（16張）
});

onMounted(async () => {
  try {
    const response = await axiosapi.get('/post/latest?limit=38'); // 獲取25張照片
    posts.value = response.data;
    await loadImages();
    startAutoSlide();
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

function getImageUrl(post) {
  return imageUrls.value[post.postId] || '../../../public/No_image.png';
}

function navigateToShareDetails(postId) {
  router.push({ name: 'shareDetails-link', params: { postId } });
}

function goToPage(index) {
  currentPage.value = index;
}

let autoSlideInterval;

function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    currentPage.value = (currentPage.value + 1) % carouselPages.value.length;
  }, 5000);
}

onUnmounted(() => {
  clearInterval(autoSlideInterval);
});
</script>

<style scoped>
.home-page {
  width: 100%;
  background-color: #f0f0f0; /* 淺灰色背景 */
}

/* 輪播牆樣式 */
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

/* 照片拼接牆樣式 */
.mosaic-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(100px, auto);
  gap: 10px;
  padding: 20px;
  background-color: #e0e0e0; /* 中灰色背景 */
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
.item-18, .item-19, .item-20, .item-21, .item-22, .item-23, .item-24 { grid-column: span 1; grid-row: span 1; }
.item-25, .item-26 { grid-column: span 2; grid-row: span 2; }
.item-27, .item-28, .item-29 { grid-column: span 1; grid-row: span 2; }

/* 網站理念樣式 */
.site-philosophy {
  background-color: #d0d0d0; /* 深灰色背景 */
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

/* 響應式設計 */
@media (max-width: 1024px) {
  .mosaic-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .full-width-carousel {
    height: 50vh;
  }

  .mosaic-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .carousel-caption h3, .mosaic-caption h3 {
    font-size: 1em;
  }

  .carousel-caption p, .mosaic-caption p {
    font-size: 0.8em;
  }
}

@media (max-width: 480px) {
  .full-width-carousel {
    height: 40vh;
  }

  .mosaic-grid {
    grid-template-columns: 1fr;
  }

  .mosaic-item {
    grid-column: span 1 !important;
    grid-row: span 1 !important;
  }

  .site-philosophy h2 {
    font-size: 1.5em;
  }

  .site-philosophy p {
    font-size: 0.9em;
  }
}
</style>