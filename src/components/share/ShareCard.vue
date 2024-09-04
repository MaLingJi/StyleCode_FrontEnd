<template>
  <div class="share-card" @click="navigateToShareDetails(post.postId)">
    <div class="share-image">
      <img :src="imgUrl" :alt="post.postTitle" />
    </div>
    <div class="share-info">
      <h3>{{ post.userName || 'Unknown User' }}</h3>
      <p>{{ post.postTitle }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

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
  if (props.post && props.post.images && props.post.images.length > 0) {
    imgUrl.value = `${path}${props.post.images[0].imgUrl}`;
  } else {
    imgUrl.value = '/path/to/default/image.jpg';
  }
});

function navigateToShareDetails(postId) {
    router.push({ name: 'shareDetails-link', params: { postId } });
}
</script>

<style scoped>
.share-card {
  width: 250px; /* 設置固定寬度 */
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.share-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.share-image {
  width: 100%;
  height: 300px; /* 設置固定高度 */
  overflow: hidden;
}

.share-image img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 確保圖片填滿容器並保持比例 */
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
</style>