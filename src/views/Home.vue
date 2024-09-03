<template>
<<<<<<< HEAD
    <div class="full-width-carousel">
      <div class="carousel-container" :style="{ transform: `translateX(-${currentPage * 100}%)` }">
        <div v-for="(page, pageIndex) in carouselPages" :key="pageIndex" class="carousel-page">
          <div v-for="post in page" :key="post.postId" class="carousel-item" @click="navigateToShareDetails(post.postId)">
            <img :src="getImageUrl(post)" :alt="post.userName" />
            <div class="carousel-caption">
              <h3>{{ post.userName || 'Unknown User' }}</h3>
              <p>{{ post.postTitle }}</p>
=======
    <div class="ts-app-layout is-vertical">
        <div class="ts-app-center">
            <div class="ts-content">照片輪播</div>
        </div>

        <div class="ts-app-center">
            <div class="ts-content">討論區文章輪播</div>
        </div>

        <div class="ts-app-center">
            <div class="ts-content">
                <div class="ts-text is-massive">
                    今日推薦穿搭
                </div>
            </div>
        </div>

        <div class="ts-app-center">
            <div class="ts-container">
                <div class="ts-grid is-3-columns is-relaxed is-stretched">
                    <div v-for="post in filteredPosts.slice(0, 6)" :key="post.postId" class="column">
                        <ShareCard :post="post" />
                    </div>
                </div>
                <!-- <div class="ts-grid is-3-columns is-relaxed is-stretched">
                    <div class="column" v-for="post in posts.slice(0, 6)" :key="post.postId">
                        <ShareCard :post="post"></ShareCard>
                    </div>
                </div> -->
>>>>>>> origin/MLJ
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
<<<<<<< HEAD
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
=======
    <div class="ts-divider"></div>
    <div class="ts-content">Footer</div>

</template>

<script setup>
import ShareCard from '@/components/share/ShareCard.vue';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axiosapi from '@/plugins/axios.js';
import Swal from 'sweetalert2';
// import useUserStore from "@/stores/user.js"
// const userStore = useUserStore();
// console.log("userId: ", userStore.userId);
// console.log("isLogin: ", userStore.isLogedin);
// console.log("permissions: ", userStore.permissions);
// console.log("token: ", userStore.userToken);

const router = useRouter();

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
        console.log("response: ", response);

        posts.value = response.data;
        // console.log("posts.value: ", posts.value);

        setTimeout(function () {
            Swal.close();
        }, 500);
    }).catch(function (error) {
        console.log("callFind error", error);
        Swal.fire({
            text: '失敗：' + error.message,
            icon: 'error',
            allowOutsideClick: false,
            confirmButtonText: '確認',
        });
    });
}
</script>

<style></style>
>>>>>>> origin/MLJ
