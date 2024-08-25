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
            <div class="column" v-for="post in posts" :key="post.postId">
                <ShareCard :post="post"></ShareCard>
            </div>
        </div>
    </div>
    <div class="ts-divider"></div>
    <div class="ts-content is-vertically-very-padded" style="background: var(--ts-gray-50)">
        <div class="ts-container is-narrow">
            <div class="ts-header is-large is-heavy">Tocas UI 相簿範例</div>
            <div class="ts-text is-secondary">由 Yami Odymel 製作</div>
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