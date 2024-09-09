<template>
    <div class="ts-container has-vertically-spaced-large">
        <div class="ts-grid">
            <div class="column is-fluid">
                <div class="carousel-container">
                    <!-- 照片輪播 -->
                    <transition name="fade" mode="out-in">
                        <div class="ts-image main-image" :key="currentImageIndex">
                            <img :src="getImageUrl(currentImage)" />
                        </div>
                    </transition>
                    <!-- 往前一張or下一張 -->
                    <button class="carousel-button prev" @click="prevImage">&lt;</button>
                    <button class="carousel-button next" @click="nextImage">&gt;</button>
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
                        <button class="ts-button is-start-icon" :class="{ 'is-outlined': !isLiked }"
                            @click="toggleLike">
                            <span class="ts-icon is-heart-icon" :class="{ 'is-filled': isLiked }"></span>
                            {{ likeCount }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- 右側：細節 -->
            <div class="ts-column is-9-wide">
                <div class="ts-box">
                    <div class="ts-content">
                        <RouterLink :to="{
                            name: 'edit-share-link',
                            params: { postId: route.params.postId }
                        }">
                            <div class="ts-button" v-if="post.userId === userStore.userId" @click="editPost">編輯</div>
                        </RouterLink>
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
                        <!-- <div class="ts-divider"></div> -->


                        <h5 class="ts-header">從標籤檢索搭配</h5>
                        <div class="ts-labels" v-if="tags.length">
                            <span class="ts-chip" v-for="tag in tags" :key="tag">{{ tag.tagName }}</span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '@/stores/product';
import axiosapi from '@/plugins/axios.js';
import Swal from 'sweetalert2';
import useUserStore from "@/stores/user.js"

const userStore = useUserStore();
const productStore = useProductStore();
const route = useRoute();
const post = ref({});
const userPhotoPath = import.meta.env.VITE_USER_IMAGE_URL;
const path = import.meta.env.VITE_POST_IMAGE_URL;
const currentImageIndex = ref(0);

const userPhoto = ref('');
const collectionCount = ref(0); // 收藏數量
const isCollected = ref(false); // 當前用戶是否已收藏
const likeCount = ref(0); // Like 數量
const isLiked = ref(false); // 當前用戶是否已 Like

const productTags = ref([]);
const tags = ref([]);

const toggleCollection = () => {
    axiosapi.post('/collections/toggle', {
        userId: userStore.userId,
        postId: route.params.postId
    })
        .then(response => {
            isCollected.value = !isCollected.value;
            collectionCount.value += isCollected.value ? 1 : -1;

            Swal.fire({
                text: response.data,
                icon: 'success',
                confirmButtonText: '確認',
            });
        })
        .catch(error => {
            console.error('Error toggling collection:', error);
            Swal.fire({
                text: '操作失敗，請稍後重試。',
                icon: 'error',
                confirmButtonText: '確認',
            });
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

            Swal.fire({
                text: response.data,
                icon: 'success',
                confirmButtonText: '確認',
            });
        })
        .catch(error => {
            console.error('Error toggling like:', error);
            Swal.fire({
                text: '操作失敗，請稍後重試。',
                icon: 'error',
                confirmButtonText: '確認',
            });
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
            // console.log(userPhoto.value);
        })
        .catch(error => {
            console.error('Error loading post:', error);
        });
});

function formatDate(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(date).toLocaleString('zh-TW', options);
}
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
</style>
