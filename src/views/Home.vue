<template>
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
                    <div class="column" v-for="post in posts" :key="post.postId">
                        <ShareCard :post="post"></ShareCard>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="ts-divider"></div>
    <div class="ts-content">Footer</div>

</template>

<script setup>
import ShareCard from '@/components/share/ShareCard.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axiosapi from '@/plugins/axios.js';
import Swal from 'sweetalert2';

const router = useRouter();

// const post = ref({});
const posts = ref([]);

onMounted(function () {
    callFind();
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