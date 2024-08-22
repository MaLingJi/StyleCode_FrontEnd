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
                <!--  v-for="post in posts" :key="post.postId -->
                <div class="ts-grid is-3-columns is-relaxed is-stretched" v-for="post in posts" :key="post.postId"> 
                    <!-- <ShareCard></ShareCard> -->
                    <div class="ts-grid">
                        <div class="column is-4-wide">
                            <div class="ts-box">
                                <div class="ts-image">
                                    <img src="../../../public/No_image.png" />
                                </div>
                                <div class="ts-divider"></div>
                                <div class="ts-content">{{ post.contentText }}</div>
                            </div>
                        </div>
                    </div>
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

<style></style>