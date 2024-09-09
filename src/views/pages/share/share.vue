<template>

    <div class="ts-content is-center-aligned" style="background: var(--ts-gray-50)">
        <div class="ts-container is-narrow">
            <div class="ts-header is-center-aligned is-huge is-heavy">
                <RouterLink to="/new-share"><button class="ts-button">分享你的穿搭</button></RouterLink>
            </div>
        </div>
    </div>
    <div class="ts-divider"></div>
    <div class="ts-container">
        <div class="ts-grid is-3-columns is-relaxed is-stretched">
            <div 
                v-for="post in filteredPosts"
                :key="post.postId"
                class="column"
            >
                <ShareCard :post="post" style="cursor: pointer"/>
            </div>
        </div>
    </div>

</template>

<script setup>
import ShareCard from '@/components/share/ShareCard.vue';
import { ref, onMounted, computed } from 'vue';
import axiosapi from '@/plugins/axios.js';
import Swal from 'sweetalert2';

// const post = ref({});
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
        // console.log("response: ", response);

        posts.value = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        console.log("posts.value: ", posts.value);

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

<style scoped>

.share-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  justify-content: center;
  padding: 20px;
}

@media (max-width: 768px) {
  .share-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>