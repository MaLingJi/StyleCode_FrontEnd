<template>
    <div class="ts-container has-vertically-spaced-large">
      <!-- 桌面版佈局 -->
      <div class="desktop-layout" v-if="!isMobile">
        <div class="ts-grid">
          <div class="column is-fluid">
            <div class="carousel-container">
              <!-- 照片輪播 -->
              <transition name="fade" mode="out-in">
                <div class="ts-image main-image" :key="currentImageIndex" @click="openLightbox">
                  <img :src="getImageUrl(currentImage)" />
                </div>
              </transition>
              <!-- 往前一張or下一張 -->
              <button class="carousel-button prev" @click="prevImage">&lt;</button>
              <button class="carousel-button next" @click="nextImage">&gt;</button>
            </div>
<<<<<<< Updated upstream

            <!-- 右側：細節 -->
            <div class="column is-5-wide">
                <div class="ts-box">
                    <div class="ts-content">
                        <div class="ts-wrap">
                            <RouterLink :to="{
                                name: 'edit-share-link',
                                params: { postId: route.params.postId }
                            }">
                                <div class="ts-button" v-if="post.userId === userStore.userId" @click="editPost">編輯</div>
                            </RouterLink>
                            <div class="ts-button" v-if="post.userId === userStore.userId" @click="deletePost(post.postId)">
                                刪除</div>
                        </div>
                        <div class="ts-grid is-middle-aligned">
                            <div class="ts-image">
                                <img :src="userPhoto" width="40">
                            </div>
                            <h3>{{ post.userName || "Unknown User" }}</h3>
                        </div>
                        <h4 class="ts-header">{{ post.postTitle }}</h4>
                        <!-- <p>(Model資訊：174cm / MEN / 34歲 / 短髮)?</p> -->
                        <p><i class="ts-icon is-clock-icon"></i> {{ formatDate(post.createdAt) }}</p>

                        <div class="ts-divider"></div>

                        <h5 class="ts-header">分享單品 ({{ productTags.length }})</h5>
                        <div v-if="productTags.length" class="product-tags-container">
                            <div class="product-card" v-for="productTag in productTags" :key="productTag.id">
                                <div class="product-card-content">
                                    <div class="product-name">{{ productTag.productName }}</div>
                                    <!-- <div class="product-subcategory">{{ productTag.subcategoryName }}</div> -->
                                    <div v-if="productTag.categoryId && productTag.subcategoryId">
                                        <RouterLink :to="{
                                            name: 'shop-link',
                                            params: { categoryId: productTag.categoryId, subcategoryId: productTag.subcategoryId }
                                        }"
                                            @click.native="filterProductsBySubcategory(productTag.subcategoryId, productTag.categoryId)">
                                            {{ productTag.categoryName }} - {{ productTag.subcategoryName }}
                                        </RouterLink>
                                    </div>
                                    <div v-else>
                                        {{ productTag.categoryName }} - {{ productTag.subcategoryName }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ts-divider"></div>
                        <h5 class="ts-header">從標籤檢索搭配</h5>
                        <div class="ts-labels" v-if="tags.length">
                            <span class="ts-chip" style="cursor: pointer" v-for="tag in tags" :key="tag" @click="searchTag(tag.tagName)">{{ tag.tagName }}</span>
                        </div>

                    </div>
                </div>
=======
  
            <div v-if="isLightboxOpen" class="lightbox" @click="closeLightbox">
              <div class="lightbox-content">
                <img :src="getImageUrl(currentImage)" />
              </div>
>>>>>>> Stashed changes
            </div>
  
            <div class="ts-grid thumbnail-grid">
              <div class="column is-2-wide" v-for="(image, index) in filteredImages" :key="index">
                <div class="ts-image is-middle-aligned thumbnail" @click="setCurrentImage(index)"
                  :class="{ active: currentImageIndex === index }">
                  <img :src="getImageUrl(image.imgUrl)" />
                </div>
              </div>
            </div>
            <div class="ts-content is-vertically-padded">
              <div class="ts-wrap is-center-aligned">
                <button class="ts-button is-start-icon" :class="{ 'is-outlined': !isCollected }"
                  @click="toggleCollection">
                  <span class="ts-icon is-star-icon" :class="{ 'is-filled': isCollected }"></span>
                  {{ collectionCount }}
                </button>
                <button class="ts-button is-start-icon" :class="{ 'is-outlined': !isLiked }" @click="toggleLike">
                  <span class="ts-icon is-heart-icon" :class="{ 'is-filled': isLiked }"></span>
                  {{ likeCount }}
                </button>
              </div>
            </div>
          </div>
  
          <!-- 右側：細節 -->
          <div class="column is-5-wide">
            <div class="ts-box">
              <div class="ts-content">
                <div class="ts-wrap">
                  <RouterLink :to="{
                    name: 'edit-share-link',
                    params: { postId: route.params.postId }
                  }" v-if="post.userId === userStore.userId">
                    <div class="ts-button">編輯</div>
                  </RouterLink>
                  <div class="ts-button" v-if="post.userId === userStore.userId" @click="deletePost(post.postId)">刪除</div>
                </div>
                <div class="ts-grid is-middle-aligned">
                  <div class="ts-image">
                    <img :src="userPhoto" width="40">
                  </div>
                  <h3>{{ post.userName || "Unknown User" }}</h3>
                </div>
                <h4 class="ts-header">{{ post.postTitle }}</h4>
                <p><i class="ts-icon is-clock-icon"></i> {{ formatDate(post.createdAt) }}</p>
  
                <div class="ts-divider"></div>
  
                <h5 class="ts-header">分享單品 ({{ productTags.length }})</h5>
                <div v-if="productTags.length" class="product-tags-container">
                  <div class="product-card" v-for="productTag in productTags" :key="productTag.id">
                    <div class="product-card-content">
                      <div class="product-name">{{ productTag.productName }}</div>
                      <div v-if="productTag.categoryId && productTag.subcategoryId">
                        <RouterLink :to="{
                          name: 'shop-link',
                          params: { categoryId: productTag.categoryId, subcategoryId: productTag.subcategoryId }
                        }"
                          @click.native="filterProductsBySubcategory(productTag.subcategoryId, productTag.categoryId)">
                          {{ productTag.categoryName }} - {{ productTag.subcategoryName }}
                        </RouterLink>
                      </div>
                      <div v-else>
                        {{ productTag.categoryName }} - {{ productTag.subcategoryName }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="ts-divider"></div>
                <h5 class="ts-header">從標籤檢索搭配</h5>
                <div class="ts-labels" v-if="tags.length">
                  <span class="ts-chip" v-for="tag in tags" :key="tag">{{ tag.tagName }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 手機版佈局 -->
      <div class="mobile-layout" v-else>
        <div class="image-carousel" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
          <transition-group name="fade" tag="div">
            <div class="ts-image main-image" v-for="(image, index) in filteredImages" :key="index" v-show="currentImageIndex === index">
              <img :src="getImageUrl(image.imgUrl)" />
            </div>
          </transition-group>
        </div>
  
        <div class="action-buttons">
          <button class="ts-button is-start-icon" :class="{ 'is-outlined': !isCollected }" @click="toggleCollection">
            <span class="ts-icon is-star-icon" :class="{ 'is-filled': isCollected }"></span>
            {{ collectionCount }}
          </button>
          <button class="ts-button is-start-icon" :class="{ 'is-outlined': !isLiked }" @click="toggleLike" >
            <span class="ts-icon is-heart-icon" :class="{ 'is-filled': isLiked }"></span>
            {{ likeCount }}
          </button>
        </div>
  
        <div class="post-details">
          <div class="ts-grid is-middle-aligned">
            <div class="ts-image user-avatar">
              <img :src="userPhoto" width="40">
            </div>
            <h3>{{ post.userName || "Unknown User" }}</h3>
          </div>
          <h4 class="ts-header">{{ post.postTitle }}</h4>
          <p><i class="ts-icon is-clock-icon"></i> {{ formatDate(post.createdAt) }}</p>
  
          <div class="ts-divider"></div>
  
          <h5 class="ts-header">分享單品 ({{ productTags.length }})</h5>
          <div v-if="productTags.length" class="product-tags-container">
            <div class="product-card" v-for="productTag in productTags" :key="productTag.id">
              <div class="product-card-content">
                <div class="product-name">{{ productTag.productName }}</div>
                <div v-if="productTag.categoryId && productTag.subcategoryId">
                  <RouterLink :to="{
                    name: 'shop-link',
                    params: { categoryId: productTag.categoryId, subcategoryId: productTag.subcategoryId }
                  }"
                    @click.native="filterProductsBySubcategory(productTag.subcategoryId, productTag.categoryId)">
                    {{ productTag.categoryName }} - {{ productTag.subcategoryName }}
                  </RouterLink>
                </div>
                <div v-else>
                  {{ productTag.categoryName }} - {{ productTag.subcategoryName }}
                </div>
              </div>
            </div>
          </div>
  
          <div class="ts-divider"></div>
  
          <h5 class="ts-header">從標籤檢索搭配</h5>
          <div class="ts-labels" v-if="tags.length">
            <span class="ts-chip" v-for="tag in tags" :key="tag">{{ tag.tagName }}</span>
          </div>
        </div>
  
        <div class="edit-delete-buttons">
          <RouterLink :to="{ name: 'edit-share-link', params: { postId: route.params.postId } }" v-if="post.userId === userStore.userId">
            <div class="ts-button">編輯</div>
          </RouterLink>
          <div class="ts-button" v-if="post.userId === userStore.userId" @click="deletePost(post.postId)">刪除</div>
        </div>
      </div>
    </div>
  </template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '@/stores/product';
import axiosapi from '@/plugins/axios.js';
import Swal from 'sweetalert2';
import useUserStore from "@/stores/user.js"
// import { useProductStore } from '@/stores/product';

const userStore = useUserStore();
const productStore = useProductStore();
const route = useRoute();
const router = useRouter();
const post = ref({});
const userPhotoPath = import.meta.env.VITE_USER_IMAGE_URL;
const path = import.meta.env.VITE_POST_IMAGE_URL;
const currentImageIndex = ref(0);

const userPhoto = ref('');
const collectionCount = ref(0); // 收藏數量
const isCollected = ref(false); // 當前用戶是否已收藏
const likeCount = ref(0); // Like 數量
const isLiked = ref(false); // 當前用戶是否已 Like

const isLightboxOpen = ref(false);

const productTags = ref([]);
const tags = ref([]);

const searchTag = (tagName) => {
    router.push({ name: 'share-link', query: { tag: tagName } });
};

const openLightbox = () => {
    isLightboxOpen.value = true;
};

const closeLightbox = () => {
    isLightboxOpen.value = false;
};

const toggleCollection = () => {
    axiosapi.post('/collections/toggle', {
        userId: userStore.userId,
        postId: route.params.postId
    })
        .then(response => {
            isCollected.value = !isCollected.value;
            collectionCount.value += isCollected.value ? 1 : -1;
        })
        .catch(error => {
            console.error('Error toggling collection:', error);
        });
};

const toggleLike = () => {
    axiosapi.post('/likes/toggle', {
        userId: userStore.userId,
        postId: route.params.postId
    })
        .then(response => {
            isLiked.value = !isLiked.value;
            likeCount.value += isLiked.value ? 1 : -1;
        })
        .catch(error => {
            console.error('Error toggling like:', error);
        });
};

const filterProductsBySubcategory = (subcategoryId, categoryId) => {
    productStore.fetchProductsBySubcategory(categoryId, subcategoryId);
};

const getImageUrl = (imageName) => {
    if (imageName) {
        return `${path}${imageName}`;
    }
    return "../../../public/No_image.png";
};

const filteredImages = computed(() => {
    return post.value.images?.filter(image => !image.deletedAt) || [];
});

const currentImage = computed(() => {
    return filteredImages.value[currentImageIndex.value]?.imgUrl;
});

// 照片輪播 下一張照片
const nextImage = () => {
    currentImageIndex.value =
        (currentImageIndex.value + 1) % post.value.images.length;
};

// 照片輪播 上一張照片
const prevImage = () => {
    currentImageIndex.value =
        (currentImageIndex.value - 1 + post.value.images.length) %
        post.value.images.length;
};

const setCurrentImage = (index) => {
    currentImageIndex.value = index;
};

onMounted(() => {
    const postId = route.params.postId;

    axiosapi.get(`/collections/${userStore.userId}/${postId}`)
        .then(response => {
            isCollected.value = true;
            console.log("isCollected: ", isCollected.value)
        })
        .catch(error => {
            if (error.response && error.response.status === 404) {
                isCollected.value = false;
            } else {
                console.error('Error checking collection status:', error);
            }
        });

    axiosapi.get(`/likes/${userStore.userId}/${postId}`)
        .then(response => {
            isLiked.value = true;
        })
        .catch(error => {
            if (error.response && error.response.status === 404) {
                isLiked.value = false;
            } else {
                console.error('Error checking collection status:', error);
            }
        });

    axiosapi.get(`/post/${postId}`)
        .then(response => {
            post.value = response.data;
            console.log("post.value: ", post.value);
            // images.value = post.value.images || [];
            productTags.value = post.value.productTags || [];
            tags.value = post.value.postTags || ["Taiwan", "Taichung"];
            // console.log("tag: ", tags.value);
            // console.log("productTags: ", productTags.value);
            collectionCount.value = post.value.collections.length;
            likeCount.value = post.value.likes.length;
            // console.log("collectionCount: ", collectionCount.value);
            userPhoto.value = `${userPhotoPath}${post.value.userPhoto}`;
            console.log("userPhoto: ", userPhoto.value);
        })
        .catch(error => {
            console.error('Error loading post:', error);
        });

        checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

const deletePost = (postId) => {
    Swal.fire({
        title: '確定要刪除這篇文章嗎?',
        text: "這個操作無法撤銷!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'rgb(35 40 44)',
        cancelButtonColor: '#9e9e9e',
        confirmButtonText: '是的, 刪除它!',
        cancelButtonText: '取消'
    }).then((result) => {
        if (result.isConfirmed) {
            axiosapi.delete(`/post/${postId}`)
                .then(response => {
                    Swal.fire(
                        '已刪除!',
                        '這篇文章已經被刪除.',
                        'success'
                    );
                    // 這裡可以根據情況重定向到文章列表頁或其他頁面
                    router.push('/share');  // 假設你有一個文章列表頁面
                })
                .catch(error => {
                    Swal.fire(
                        '刪除失敗!',
                        '刪除文章的過程中發生了錯誤, 請稍後再試.',
                        'error'
                    );
                    console.error('Error deleting post:', error);
                });
        }
    });
};

function formatDate(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(date).toLocaleString('zh-TW', options);
}

//響應式
const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768; // 可以根據需要調整這個閾值
};

// 觸摸滑動相關邏輯
let touchStartX = 0;
let touchEndX = 0;

const touchStart = (e) => {
  touchStartX = e.touches[0].clientX;
};

const touchMove = (e) => {
  touchEndX = e.touches[0].clientX;
};

const touchEnd = () => {
  if (touchStartX - touchEndX > 50) {
    nextImage();
  }
  if (touchEndX - touchStartX > 50) {
    prevImage();
  }
};
</script>

<style scoped>
.carousel-container {
    position: relative;
    width: 100%;
    max-width: 500px;
    /* Match the max-width of product card */
    margin: 0 auto;
}

.main-image {
    width: 100%;
    padding-bottom: 100%;
    position: relative;
    overflow: hidden;
}

.main-image img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}


.carousel-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    z-index: 10;
}

.carousel-button.prev {
    left: 10px;
}

.carousel-button.next {
    right: 10px;
}

.thumbnail-grid {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
}

.thumbnail {
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.3s ease;
    width: 60px;
    height: 60px;
    overflow: hidden;
    margin: 0 5px;
}


.thumbnail.active,
.thumbnail:hover {
    opacity: 1;
    border: 2px solid var(--ts-gray-400);
}


.thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.ts-box.is-segment {
    margin-top: 2rem;
}

.ts-table {
    width: 100%;
    margin-top: 1rem;
}

.ts-image img {
    max-width: 100%;
    height: auto;
    margin-top: 1rem;
    object-fit: cover;
}

.ts-image.user-avatar,
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ts-image.user-avatar img,
.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Lightbox 樣式 */
.lightbox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.lightbox-content {
    position: relative;
    max-width: 90%;
    max-height: 90%;
}

.lightbox-content img {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
}

.lightbox-close,
.lightbox-prev,
.lightbox-next {
    position: absolute;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    font-size: 24px;
}

.lightbox-close {
    top: 10px;
    right: 10px;
}

.lightbox-prev {
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
}

.lightbox-next {
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
}

/* 使主圖片可點擊 */
.main-image {
    cursor: pointer;
}

.ts-chip .ts-label {
    background-color: #9d7e7e;
    padding: 5px 5px;
    border-radius: 10px;
}

.product-tags-container {
    display: flex;
    flex-direction: column;
    /* 將卡片改為垂直排列 */
    gap: 15px;
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #ddd;
}

.product-card {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 15px;
    width: 100%;
    /* 卡片寬度設為100%以適應容器 */
    transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.product-card-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    /* 內容左對齊 */
}

.product-name {
    font-size: 1.2em;
    font-weight: bold;
    margin-bottom: 5px;
}

.product-subcategory {
    font-size: 0.9em;
    color: #666;
}

.column.is-2-wide {
    flex: 0 0 auto;
    max-width: none;
    /* 避免預設的寬度設置影響圖片顯示 */
}

.ts-divider {
    margin: 20px 0;
    /* 確保分隔線有足夠的上下間距 */
}

/* 手機版特定樣式 */
@media (max-width: 768px) {
  .mobile-layout {
    display: flex;
    flex-direction: column;
  }

  .image-carousel {
    position: relative;
    overflow: hidden;
    height: 50vh;
  }

  .main-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .main-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    padding: 10px 0;
  }

  .action-buttons .ts-button {
    margin: 0 10px;
  }

  .post-details {
    padding: 15px;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 10px;
  }

  .edit-delete-buttons {
    display: flex;
    justify-content: center;
    padding: 15px 0;
  }

  .edit-delete-buttons .ts-button {
    margin: 0 10px;
  }

  /* 淡入淡出動畫 */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
  }

}
</style>
