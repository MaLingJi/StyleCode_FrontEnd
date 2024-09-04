<template>
    <div class="ts-container has-vertically-spaced-large">
        <div class="ts-grid is-center-aligned">
            <div class="column is-7-wide">
                <div class="ts-box">
                    <!-- 往前一張or下一張 -->
                    <button class="carousel-button prev" @click="prevImage">&lt;</button>
                    <button class="carousel-button next" @click="nextImage">&gt;</button>
                    <div class="carousel-container">
                        <!-- 照片輪播 -->
                        <transition name="fade" mode="out-in">
                            <div class="ts-image main-image" :key="currentImageIndex">
                                <img :src="getImageUrl(currentImage)" />
                            </div>
                        </transition>
                    </div>
                    <div class="ts-grid thumbnail-grid">
                        <div class="column is-2-wide" v-for="(image, index) in images.value" :key="index">
                            <div class="ts-image thumbnail" @click="setCurrentImage(index)"
                                :class="{ active: currentImageIndex === index }">
                                <img :src="getImageUrl(image.imgUrl)" />
                            </div>
                        </div>
                    </div>
                </div>
                <!-- <div><span>{{ getImageUrl(currentImage) }}</span></div> -->
                <div class="ts-card">
                    <div class="ts-content is-horizontally-padded">
                        <button class="ts-button">收藏夾</button>
                        <button class="ts-button"><i class="ts-icon is-heart-icon"></i> 10</button>
                        <button class="ts-button"><i class="ts-icon is-comment-icon"></i> 0</button>
                    </div>
                </div>
            </div>

            <!-- 右側：細節 -->
            <div class="ts-column is-9-wide">
                <div class="ts-box">
                    <div class="ts-content">
                        <h4 class="ts-header">{{ post.postTitle }}</h4>
                        <p>Model資訊：174cm / MEN / 34歲 / 短髮</p>
                        <p><i class="ts-icon is-clock-icon"></i> {{ formatDate(post.createdAt) }}</p>

                        <div class="ts-divider"></div>

                        <h5 class="ts-header">穿著服飾 ({{ clothingItems.length }})</h5>
                        <div class="ts-list" v-if="clothingItems.length">
                            <div class="ts-item" v-for="item in clothingItems" :key="item.id">
                                <div class="ts-content">{{ item.brandName }}</div>
                                <div class="ts-meta">{{ item.itemType }}（{{ item.color }}系）</div>
                                <button class="ts-button is-link">在ZOOZOTOWN中搜尋</button>
                            </div>
                        </div>

                        <div class="ts-divider"></div>

                        <h5 class="ts-header">從標籤檢索搭配</h5>
                        <div class="ts-labels" v-if="tags.length">
                            <span class="ts-label" v-for="tag in tags" :key="tag">{{ tag }}</span>
                        </div>

                        <h5 class="ts-header">從品牌檢索搭配</h5>
                        <div class="ts-labels" v-if="brands.length">
                            <span class="ts-label" v-for="brand in brands" :key="brand">{{ brand }}</span>
                        </div>

                        <h5 class="ts-header">Ming穿搭常用品牌</h5>
                        <div class="ts-labels" v-if="commonBrands.length">
                            <span class="ts-label" v-for="commonBrand in commonBrands" :key="commonBrand">{{ commonBrand
                                }}</span>
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
import axiosapi from '@/plugins/axios.js';

const route = useRoute();
const post = ref({});
const images = ref({});
const path = import.meta.env.VITE_POST_IMAGE_URL;
const currentImageIndex = ref(0);

const clothingItems = ref([]);
const tags = ref([]);
const brands = ref([]);
const commonBrands = ref(["Slightly Numb", "OVERKILL inc.", "STUSSY", "adidas"]);

const getImageUrl = (imageName) => {
    if (imageName) {
        return `${path}${imageName}`;
    }
    return "../../../public/No_image.png";
};

const currentImage = computed(() => {
    return images.value?.[currentImageIndex.value]?.imgUrl;
});

// 照片輪播 下一張照片
const nextImage = () => {
    currentImageIndex.value =
        (currentImageIndex.value + 1) % images.value.length;
};

// 照片輪播 上一張照片
const prevImage = () => {
    currentImageIndex.value =
        (currentImageIndex.value - 1 + images.value.length) %
        images.value.length;
};

const setCurrentImage = (index) => {
    currentImageIndex.value = index;
};

onMounted(() => {
    const postId = route.params.postId;
    axiosapi.get(`/post/${postId}`)
        .then(response => {
            post.value = response.data;
            console.log("post.value: ", post.value);
            // images.value = post.value.images || [];
            clothingItems.value = post.value.clothingItems || [];
            tags.value = post.value.tags || ["Taiwan", "Taichung"];
            brands.value = post.value.brands || ["Maison MIHARA YASUHIRO", "BEAMS"];
        })
        .catch(error => {
            console.error('Error loading post:', error);
        });

    axiosapi.get(`/images/post/${postId}`)
        .then(response => {
            images.value = response.data;
            console.log("images.value: ", images.value);

            images.value.forEach(image => {
                console.log(image.imgUrl);
            });
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
/* 添加必要的樣式來調整版面 */
.ts-placeholder img {
    width: 100%;
    height: auto;
}

.product-details {
    padding: 2rem 0;
}

.carousel-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
}

.main-image img {
    position: relative;
    width: 100%;
    height: auto;

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
    left: 5px;
}

.carousel-button.next {
    right: 5px;
}

.thumbnail-grid {
    margin-top: 1rem;
}

.thumbnail {
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.3s ease;
    width: 60px;
    height: 60px;
    overflow: hidden;
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

.ts-content.is-horizontally-padded {
    display: flex;
    justify-content: center;
    gap: 10px;
    /* 按钮之间的间距 */
}

.ts-box {
    position: relative;
    width: 100%;
    /* 确保 .ts-box 使用父级元素的宽度 */
    height: 100%;
    /* 确保 .ts-box 使用父级元素的高度 */
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    /* 裁切溢出的内容 */
    margin: 0 auto;
}

.ts-image {
    width: 100%;
    /* 确保图片容器占满 ts-box 的宽度 */
    height: 100%;
    /* 确保图片容器占满 ts-box 的高度 */
    position: relative;
    overflow: hidden;
    /* 裁切溢出的内容 */
}

.ts-image img {
    object-fit: cover;
    /* 裁切图片，使图片覆盖整个容器 */
    width: 100%;
    height: 100%;
    object-position: center;
    /* 图片居中显示 */
}

.ts-card {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    /* 根据需要调整 .ts-card 的顶部间距 */
}
</style>
