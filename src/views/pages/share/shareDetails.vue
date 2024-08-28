<template>
    <div class="ts-container">
        <div class="ts-row">
            <!-- 左側：圖片 -->
            <!-- <div class="ts-column is-9">
                <div class="ts-card">
                    <div class="ts-image">
                        <div v-if="images.length" class="ts-placeholder is-segment">
                            <img :src="`${path}${images[1].imgUrl}`" alt="Post Image" />
                        </div>
                        <div v-else class="ts-placeholder is-segment">
                            <span class="ts-text">NO IMAGE</span>
                        </div>
                    </div>
                </div>
            </div> -->

            <div class="column is-7-wide">
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
                    <div class="column is-2-wide" v-for="(image, index) in images.value" :key="index">
                        <div class="ts-image thumbnail" @click="setCurrentImage(index)"
                            :class="{ active: currentImageIndex === index }">
                            <img :src="getImageUrl(image.imgUrl)" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右側：細節 -->
            <div class="ts-column is-3">
                <div class="ts-card">
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

        <div class="ts-row">
            <div class="ts-column">
                <div class="ts-card">
                    <div class="ts-content">
                        <button class="ts-button">收藏夾</button>
                        <button class="ts-button"><i class="ts-icon is-heart-icon"></i> 10</button>
                        <button class="ts-button"><i class="ts-icon is-comment-icon"></i> 0</button>
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

<style>
/* 添加必要的樣式來調整版面 */
.ts-placeholder img {
    width: 100%;
    height: auto;
}
</style>
