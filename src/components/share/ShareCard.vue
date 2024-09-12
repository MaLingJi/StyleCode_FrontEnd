<template>
  <div class="share-card" @click="navigateToShareDetails(post.postId)">
    <div class="share-image">
      <img :src="imgUrl" :alt="post.postTitle" />
    </div>
    <div class="share-info">
      <div class="user-info">
        <div class="user-avatar">
          <div class="ts-image">
            <img :src="userPhoto" width="40">
          </div>
        </div>
        <h3>{{ post.userName || "Unknown User" }}</h3>
      </div>
      <div class="share-actions">
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
  width: 100%;
  max-width: 250px;
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
  overflow: hidden;
}

.share-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.share-info {
  padding: 12px;
  background-color: #f8f8f8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0; /* 允許 flex 項目縮小到比其內容更小 */
}

.user-avatar {
  margin-right: 8px;
  flex-shrink: 0; /* 防止頭像縮小 */
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

.share-actions {
  display: flex;
  gap: 5px;
  flex-shrink: 0; /* 防止按鈕縮小 */
}

@media (max-width: 768px) {
  .share-card {
    max-width: none; /* 在小屏幕上允許卡片佔滿寬度 */
  }

  .share-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .user-info {
    width: 100%;
    margin-bottom: 8px;
  }

  .share-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 480px) {
  .share-image {
    height: 200px; /* 在更小的屏幕上減小圖片高度 */
  }

  .share-info {
    padding: 8px;
  }

  .user-avatar .ts-image img {
    width: 32px; /* 縮小頭像大小 */
  }

  .share-info h3 {
    font-size: 0.9em;
  }

  .ts-button.is-icon.is-small {
    padding: 0.3em; /* 縮小按鈕大小 */
  }
}
</style>