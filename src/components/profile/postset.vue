<template>
    <div class="ts-grid header-title is-middle-aligned is-spaced-between">
        <div class="ts-header is-huge is-heavy">所有文章</div>
        <!-- <a-input-search
            v-model:value="searchValue"
            placeholder="輸入關鍵字搜索"
            style="width: 200px; margin-left: 20px;"
            @search="onSearch"/> -->
    </div>
    
    <div class="ts-container" style="margin-top: 10px">
        <div class="ts-selection is-fluid">
            
            <label class="item">
                <input type="radio" name="language" value="share" v-model="postType" />
                <div class="text">分享區</div>
            </label>
            <label class="item">
                <input type="radio" name="language" value="forum" v-model="postType" />
                <div class="text">論壇</div>
            </label>
            <label class="item">
                <input type="radio" name="sortOrder" value="asc" v-model="sortOrder" />
                <div class="text">舊文章優先</div>
            </label>
            <label class="item">
                <input type="radio" name="sortOrder" value="desc" v-model="sortOrder" />
                <div class="text">新文章優先</div>
            </label>
        </div>
    </div>
    <!-- 浮動式至頂效果 -->
    <div :style="{ height: '1vh', padding: '10px' }">
            <a-back-top />
    </div>
    <!-------- 分享區主頁面 -------->
    <div class="ts-container has-top-spaced">
        <div v-if="postType === 'share'">
            <h2>分享文章</h2>
            <div class="share-grid">
                <div class="share-grid-item" v-for="post in sortedSharePosts" :key="post.postId">
                    <div class="share-card" @click="viewPost(post)">
                        <div class="ts-icon is-circular is-pen-icon is-large share-edit-button" @click.stop="viewPost(post)"></div>
                        <div class="share-image">
                            <img :src="post.images && post.images.length > 0 ? `${path}/${post.images[0].imgUrl}` : '/default-image.png'" />
                        </div>
                        <div class="share-info">
                            <h3>{{ post.userName }}</h3>
                            <div class="ts-grid is-spaced-between">
                                <p class="column">{{ post.postTitle }}</p>
                                <div class="ts-grid share-icons column">
                                    <div class="column">
                                        <span class="ts-icon is-heart-icon margin-right"></span>{{ post.likes.length }}
                                    </div>
                                    <div class="column">
                                        <span class="ts-icon is-bookmark-icon margin-right"></span>{{ post.collections.length }}
                                    </div>
                                </div>
                            </div>
                            <p>創建時間: {{ formatDate(post.createdAt) }}</p> <!-- 顯示創建時間 -->
                        </div>
                        <!-- <div class="ts-icon is-circular is-trash-icon is-large share-delete-button" @click.stop="deletePost(post.postId)">
                        </div> -->
                    </div>
                </div>
            </div>
            <div v-if="sortedSharePosts.length === 0">沒有分享文章</div>
        </div>

        <!-------- 論壇區主頁面 -------->
        <div v-if="postType === 'forum'">
            <h2>論壇文章</h2>
            <div v-if="sortedForumPosts.length > 0">
                <div class="ts-box is-horizontal" v-for="post in sortedForumPosts" :key="post.postId">
                    <div class="ts-image is-covered">
                        <img :src="post.images && post.images.length > 0 ? `${path}/${post.images[0].imgUrl}` : '/default-image.png'" width="150" height="100%" />
                    </div>
                    <div class="ts-content right-side">
                        <div class="ts-grid is-spaced-between">
                            <div class="ts-header column">{{ post.postTitle }}</div>
                            <div class="ts-icon is-pen-icon is-large column edit-button" @click.stop="viewPost(post)"></div>
                        </div>
                        <p>{{ post.contentText }}</p>
                        <div class="ts-grid icons">
                            <div class="column">
                                <span class="ts-icon is-heart-icon margin-right"></span>{{ post.likes.length }}
                            </div>
                            <div class="column">
                                <span class="ts-icon is-bookmark-icon margin-right"></span>{{ post.collections.length }}
                            </div>
                        </div>
                        <p>創建時間: {{ formatDate(post.createdAt) }}</p> <!-- 顯示創建時間 -->
                        <!-- <div class="ts-icon is-circular is-trash-icon is-large share-delete-button" @click.stop="deletePost(post.postId)">
                        </div> -->
                    </div>
                </div>
            </div>
            <div v-if="sortedForumPosts.length === 0">沒有論壇文章</div>
        </div>
    </div>
</template>

<script setup>
import axiosapi from "@/plugins/axios.js";
import { ref, onMounted, computed } from "vue";
import useUserStore from "@/stores/user.js";
import { useRouter } from 'vue-router';

const postType = ref("share");
const sortOrder = ref("desc");
const allPosts = ref([]);
const forumposts = ref([]);
const shareposts = ref([]);
const path = import.meta.env.VITE_POST_IMAGE_URL;
const router = useRouter();
const searchValue = ref("");
const listData = ref([]); 

onMounted(() => {
    fetchAllPosts();
});

function fetchAllPosts() {
    axiosapi.get("/post").then((response) => {
        allPosts.value = response.data; 
        
        // 清空數組不互相傳遞
        forumposts.value = [];
        shareposts.value = [];
        // 遍歷所有文章
        response.data.forEach(post => {
            if (post.contentType === 'forum') {
                forumposts.value.push(post);
            } else if (post.contentType === 'share') {
                shareposts.value.push(post);
            }
        });
    })
    .catch((error) => {
        console.error('取得貼文時出錯:', error);
    });
}

const sortedSharePosts = computed(() => {
    return shareposts.value.sort((a, b) => {
        if (sortOrder.value === 'asc') {
            return new Date(a.createdAt) - new Date(b.createdAt);
        } else {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });
});

const sortedForumPosts = computed(() => {
    return forumposts.value.sort((a, b) => {
        if (sortOrder.value === 'asc') {
            return new Date(a.createdAt) - new Date(b.createdAt);
        } else {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });
});

const viewPost = (post) => {
    if (post.contentType === 'share') {
        router.push({ name: 'shareDetails-link', params: { postId: post.postId } });
    } else if (post.contentType === 'forum') {
        router.push({ name: 'postContent-link', params: { id: post.postId } });
    } else {
        console.error('未知的內容類型:', post.contentType);
    }
}

const onSearch = async () => {
    try {
        let response;
        if (postType.value === 'share') {
            response = await axiosapi.get('/post/type', {
                params: {
                    contentType: 'share',
                    keyword: searchValue.value,
                },
            });
        } else if (postType.value === 'forum') {
            response = await axiosapi.get('/post/type', {
                params: {
                    contentType: 'forum',
                    keyword: searchValue.value,
                },
            });
        } else {
            response = await axiosapi.get('/post/type', {
                params: {
                    keyword: searchValue.value,
                },
            });
        }
        listData.value = response.data;
    } catch (error) {
        console.error('搜索失敗:', error.response ? error.response.data : error.message);
    }
};

const deletePost = (postId) => {
    axiosapi
    .delete(`/post/admin/${postId}`)
    .then(() => {
        allPosts.value = allPosts.value.filter(post => post.postId !== postId);
        forumposts.value = forumposts.value.filter(post => post.postId !== postId);
        shareposts.value = shareposts.value.filter(post => post.postId !== postId);
        console.log('貼文已刪除');
    })
    .catch((error) => {
        console.error('刪除貼文時出錯:', error);
    });
}

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}
</script>

<style scoped>
.share-grid {
display: grid;
grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
gap: 20px;
padding: 20px;
}

.share-grid-item {
width: 100%;
display: flex;
justify-content: center;
}

.share-card:hover {
transform: translateY(-5px);
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.share-card {
width: 100%;
max-width: 250px;
border: 1px solid #ddd;
border-radius: 8px;
overflow: hidden;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
transition: transform 0.3s ease, box-shadow 0.3s ease;
position: relative;
}

.share-image {
width: 100%;
height: 0;
padding-bottom: 100%; /* 创建一个正方形的容器 */
position: relative;
overflow: hidden;
}

.share-image img {
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
object-fit: cover;
}

.share-info {
padding: 12px;
background-color: #f8f8f8;
}

.share-info h3 {
margin: 0;
font-size: 1em;
font-weight: bold;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
color: #333;
}

.share-info p {
margin: 8px 0 0;
font-size: 0.9em;
color: #666;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
}

.ts-box {
height: 150px;
}

.right-side {
width: 100%;
}

.margin-right {
margin-right: 10px;
}

.edit-button:hover {
cursor: pointer;
color: #0050b3;
}

.share-edit-button:hover {
cursor: pointer;
color: cornflowerblue;
background-color: #d6d6d6;
}

.share-edit-button {
position: absolute;
right: 10px;
top: 10px;
background-color: #f0f0f0;
}

.icons {
font-size: 18px;
}

.share-icons {
font-size: 16px;
}

@media (max-width: 768px) {
.share-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 10px;
}

.share-card {
    max-width: none;
}

.share-info h3 {
    font-size: 0.9em;
}

.share-info p {
    font-size: 0.8em;
}

.share-icons {
    font-size: 14px;
}
}

@media (max-width: 480px) {
.share-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    padding: 8px;
}

.share-info {
    padding: 8px;
}
}

</style>
