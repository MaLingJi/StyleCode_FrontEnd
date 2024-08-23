<template>
    <div class="ts-app-layout is-vertical">
        <div class="cell">
            <div class="ts-app-center">
                <div class="ts-content">照片輪播</div>
            </div>
        </div>
        <div class="cell">
            <div class="ts-app-center">
                <div class="ts-content">討論區文章輪播</div>
            </div>
        </div>
        <div class="cell">
            <div class="ts-app-center">
                <div class="ts-content">
                    <div class="ts-text is-massive">
                        今日推薦穿搭
                    </div>
                </div>
            </div>
        </div>
        <div class="cell">
            <div class="ts-app-center">
                <div class="ts-grid is-3-columns is-relaxed is-stretched" v-for="post in posts" :key="post.postId">
                    <ShareCard></ShareCard>
                </div>
            </div>
        </div>
        <div class="cell">
            <div class="ts-content">Footer</div>
        </div>
    </div>

</template>

<script setup>
import ShareCard from '@/components/share/ShareCard.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axiosapi from '@/plugins/axios.js';
import Swal from 'sweetalert2';

const router = useRouter();

const post = ref({});
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
    let request = {
        "start": 0,
        "rows": 3,
        "dir": true,
        "order": "id",
        "name": "a"
    };
    axiosapi.get("/post/2").then(function (response) {
        console.log("response", response);
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