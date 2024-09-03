<template>
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
      try {
        const response = await axiosapi.get(`/images/post/${post.postId}`);
        const imagePath = response.data[0].imgUrl;
        imageUrls.value[post.postId] = `${import.meta.env.VITE_POST_IMAGE_URL}${imagePath}`;
      } catch (error) {
        console.error('Error fetching image URL:', error);
        imageUrls.value[post.postId] = '../../../public/No_image.png'; // 預設圖片
      }
    }
  }
  
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
  .full-width-carousel {
    width: 100vw;
    height: calc(100vh - 90px); /* 減去導覽列的高度 */
    position: relative;
    overflow: hidden;
    margin-top: 10px; /* 添加頂部邊距，等於導覽列的高度 */
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
  </style>