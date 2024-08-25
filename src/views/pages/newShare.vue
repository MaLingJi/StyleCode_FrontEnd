<template>
    <h2>newShare</h2>

        <div class="ts-divider"></div>
        <div class="ts-container">
            <div class="ts-app-layout is-horizontal">
                <div class="cell is-fluid is-vertical">
                    <h2>標題</h2>
                    <textarea name="" id="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla ipsa provident dolores quo hic adipisci laboriosam, quibusdam est facere iusto sint, suscipit impedit illum iste fugit velit eligendi magnam mollitia?</textarea>
                </div>
                <div class="cell is-vertical" >
                    <h2>標籤</h2>
                    <textarea name="" id="">123</textarea>
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
    
<style>
    
</style>