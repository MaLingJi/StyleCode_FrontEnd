<template>
  <div class="share-card" @click="navigateToShareDetails(post.postId)">
    <div class="share-image">
      <img :src="imgUrl" :alt="post.postTitle" />
    </div>
    <div class="share-info">
      <div class="ts-grid is-middle-aligned">
        <div class="column is-fluid">
          <div class="ts-grid is-middle-aligned">
            <div class="ts-image">
              <img :src="userPhoto" width="40">
            </div>
            <h3>{{ post.userName || "Unknown User" }}</h3>
          </div>
        </div>
        <div class="column">
          <div class="ts-wrap">
            <button class="ts-button is-icon is-small" :class="{ 'is-outlined': !isCollected }"
              @click.stop="toggleCollection">
              <span class="ts-icon is-star-icon" :class="{ 'is-filled': isCollected }"></span>
            </button>
            <button class="ts-button is-icon is-small" :class="{ 'is-outlined': !isLiked }" @click.stop="toggleLike">
              <span class="ts-icon is-heart-icon" :class="{ 'is-filled': isLiked }"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axiosapi from '@/plugins/axios.js';
import Swal from 'sweetalert2';
import useUserStore from "@/stores/user.js";

const userPhotoPath = import.meta.env.VITE_USER_IMAGE_URL;
const path = import.meta.env.VITE_POST_IMAGE_URL;
const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});
const imgUrl = ref('');
const router = useRouter();
const userStore = useUserStore();
const userPhoto = ref('');

const isCollected = ref(false);
const isLiked = ref(false);

onMounted(() => {
  if (props.post && props.post.images && props.post.images.length > 0) {
    // 過濾掉 deletedAt 不為 null 的圖片
    const validImages = props.post.images.filter(image => !image.deletedAt);

    if (validImages.length > 0) {
      imgUrl.value = `${path}${validImages[0].imgUrl}`;
    } else {
      imgUrl.value = "../../../public/No_image.png";
    }
  } else {
    imgUrl.value = "../../../public/No_image.png";
  }

  userPhoto.value = `${userPhotoPath}${props.post.userPhoto}`;

  checkCollectionStatus();
  checkLikeStatus();
});

const checkCollectionStatus = () => {
  axiosapi.get(`/collections/${userStore.userId}/${props.post.postId}`)
    .then(response => {
      isCollected.value = true;
    })
    .catch(error => {
      if (error.response && error.response.status === 404) {
        isCollected.value = false;
      } else {
        console.error('Error checking collection status:', error);
      }
    });
};

const checkLikeStatus = () => {
  axiosapi.get(`/likes/${userStore.userId}/${props.post.postId}`)
    .then(response => {
      isLiked.value = true;
    })
    .catch(error => {
      if (error.response && error.response.status === 404) {
        isLiked.value = false;
      } else {
        console.error('Error checking like status:', error);
      }
    });
};

const toggleCollection = () => {
  axiosapi.post('/collections/toggle', {
    userId: userStore.userId,
    postId: props.post.postId
  })
    .then(response => {
      isCollected.value = !isCollected.value;

      Swal.fire({
        text: response.data,
        icon: 'success',
        confirmButtonColor: 'rgb(35 40 44)',
        confirmButtonText: '確認',
      });
    })
    .catch(error => {
      console.error('Error toggling collection:', error);
      Swal.fire({
        text: '操作失敗，請稍後重試。',
        icon: 'error',
        confirmButtonColor: 'rgb(35 40 44)',
        confirmButtonText: '確認',
      });
    });
};

const toggleLike = () => {
  axiosapi.post('/likes/toggle', {
    userId: userStore.userId,
    postId: props.post.postId
  })
    .then(response => {
      isLiked.value = !isLiked.value;

      Swal.fire({
        text: response.data,
        icon: 'success',
        confirmButtonColor: 'rgb(35 40 44)',
        confirmButtonText: '確認',
      });
    })
    .catch(error => {
      console.error('Error toggling like:', error);
      Swal.fire({
        text: '操作失敗，請稍後重試。',
        icon: 'error',
        confirmButtonColor: 'rgb(35 40 44)',
        confirmButtonText: '確認',
      });
    });
};

function navigateToShareDetails(postId) {
  router.push({ name: "shareDetails-link", params: { postId } });
}
</script>

<style scoped>
.share-card {
  width: 250px;
  /* 設置固定寬度 */
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.share-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.share-image {
  width: 100%;
  height: 300px;
  /* 設置固定高度 */
  overflow: hidden;
}

.share-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 確保圖片填滿容器並保持比例 */
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

.share-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
}
</style>
