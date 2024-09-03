<template>
    <div class="ts-box" @click="navigateToShareDetails(props.post.postId)">
        <div class="ts-image">
            <img :src="imgUrl" />
        </div>
        <div class="ts-divider"></div>
        <div class="share-info">
      <h3>{{ post.userName || 'Unknown User' }}</h3>
      <p>{{ post.postTitle }}</p>
    </div>
        
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// import Swal from 'sweetalert2';
const path = import.meta.env.VITE_POST_IMAGE_URL;
const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});
const imgUrl = ref('');
const router = useRouter();

onMounted(() => {
    console.log("Received post:", props.post);
    // 确保post存在
    if (props.post && props.post.images && props.post.images.length > 0) {
        imgUrl.value = `${path}${props.post.images[0].imgUrl}`;
    }
});

function navigateToShareDetails(postId) {
  router.push({ name: 'shareDetails-link', params: { postId } });
}
</script>

<style scoped>
.share-card {
  width: 210.83px; /* 設定固定寬度 */
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.share-card:hover {
  transform: translateY(-5px);
}

.share-image {
  height: 316.25px; /* 設定固定高度 */
  overflow: hidden;
}

.share-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.share-info {
  padding: 10px;
}

.share-info h3 {
  margin: 0;
  font-size: 1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.share-info p {
  margin: 5px 0 0;
  font-size: 0.9em;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>