<template>
  <div class="ts-grid header-title is-middle-aligned is-spaced-between">
    <div class="ts-header is-huge is-heavy">我的文章</div>
  </div>
  <div class="ts-container" style="margin-top: 10px">
    <div class="ts-selection is-fluid">
      <label class="item">
        <input type="radio" name="language" value="share" v-model="postType" />
        <div class="text">分享區</div>
      </label>
      <label class="item">
        <input type="radio" name="language" value="post" v-model="postType" />
        <div class="text">論壇</div>
      </label>
    </div>
  </div>
  <!-------- 分 享 區 主 要 頁 面 -------->
  <div class="ts-container has-top-spaced">
    <div
      class="ts-grid is-3-columns is-relaxed is-stretched"
      v-if="postType === 'share'"
    >
      <div class="column">
        <div class="share-card" @click="">
          <div class="ts-icon is-bookmark-icon is-huge bookmark"></div>
          <!-- ^書籤按鈕^ -->
          <div class="share-image">
            <img src="/MDFK-removebg-preview.png" />
          </div>
          <div class="share-info">
            <h3>{{ "Unknown User" }}</h3>
            <div class="ts-grid is-spaced-between">
              <p class="column">{{ "postTitle" }}</p>
              <div class="ts-grid share-icons column">
                <div class="column">
                  <span class="ts-icon is-heart-icon margin-right"></span>12
                </div>
                <div class="column">
                  <span class="ts-icon is-bookmark-icon margin-right"></span>1
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="share-card" @click="">
          <div class="ts-icon is-bookmark-icon is-huge bookmark"></div>
          <!-- ^編輯按鈕^ -->
          <div class="share-image">
            <img src="/MDFK-removebg-preview.png" />
          </div>
          <div class="share-info">
            <h3>{{ "Unknown User" }}</h3>
            <div class="ts-grid is-spaced-between">
              <p class="column">{{ "postTitle" }}</p>
              <div class="ts-grid share-icons column">
                <div class="column">
                  <span class="ts-icon is-heart-icon margin-right"></span>12
                </div>
                <div class="column">
                  <span class="ts-icon is-bookmark-icon margin-right"></span>1
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="share-card" @click="">
          <div class="ts-icon is-bookmark-icon is-huge bookmark"></div>
          <!-- ^編輯按鈕^ -->
          <div class="share-image">
            <img src="/MDFK-removebg-preview.png" />
          </div>
          <div class="share-info">
            <h3>{{ "Unknown User" }}</h3>
            <div class="ts-grid is-spaced-between">
              <p class="column">{{ "postTitle" }}</p>
              <div class="ts-grid share-icons column">
                <div class="column">
                  <span class="ts-icon is-heart-icon margin-right"></span>12
                </div>
                <div class="column">
                  <span class="ts-icon is-bookmark-icon margin-right"></span>1
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-------- 論 壇 主 要 頁 面 -------->
    <div v-if="postType === 'post'">
      <div class="ts-box is-horizontal">
        <div class="ts-icon is-bookmark-icon is-huge column bookmark"></div>
        <div class="ts-image is-covered">
          <img src="/MDFK-removebg-preview.png" width="150" height="100%" />
        </div>
        <div class="ts-content right-side">
          <div class="ts-grid is-spaced-between">
            <div class="ts-header column">
              Zedd - Papercut (Audio) ft. Troye Sivan
            </div>
          </div>
          <p>Get "True Colors" on iTunes: http://smarturl.it/ZeddTrueColors</p>
          <div class="ts-grid icons">
            <div class="column">
              <span class="ts-icon is-heart-icon margin-right"></span>12
            </div>
            <div class="column">
              <span class="ts-icon is-bookmark-icon margin-right"></span>1
            </div>
          </div>
        </div>
      </div>
      <div class="ts-box is-horizontal">
        <div class="ts-icon is-bookmark-icon is-huge column bookmark"></div>
        <div class="ts-image is-covered">
          <img src="/MDFK-removebg-preview.png" width="150" height="100%" />
        </div>
        <div class="ts-content right-side">
          <div class="ts-grid is-spaced-between">
            <div class="ts-header column">
              Zedd - Papercut (Audio) ft. Troye Sivan
            </div>
          </div>
          <p>Get "True Colors" on iTunes: http://smarturl.it/ZeddTrueColors</p>
          <div class="ts-grid icons">
            <div class="column">
              <span class="ts-icon is-heart-icon margin-right"></span>12
            </div>
            <div class="column">
              <span class="ts-icon is-bookmark-icon margin-right"></span>1
            </div>
          </div>
        </div>
      </div>
      <div class="ts-box is-horizontal">
        <div class="ts-icon is-bookmark-icon is-huge column bookmark"></div>
        <div class="ts-image is-covered">
          <img src="/MDFK-removebg-preview.png" width="150" height="100%" />
        </div>
        <div class="ts-content right-side">
          <div class="ts-grid is-spaced-between">
            <div class="ts-header column">
              Zedd - Papercut (Audio) ft. Troye Sivan
            </div>
          </div>
          <p>Get "True Colors" on iTunes: http://smarturl.it/ZeddTrueColors</p>
          <div class="ts-grid icons">
            <div class="column">
              <span class="ts-icon is-heart-icon margin-right"></span>12
            </div>
            <div class="column">
              <span class="ts-icon is-bookmark-icon margin-right"></span>1
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axiosapi from "@/plugins/axios.js";
import { ref, watch } from "vue";
import useUserStore from "@/stores/user.js";

const user = useUserStore().userId;
const postType = ref("share");

//寫法參考 page/order.vue
watch(
  postType,
  () => {
    axiosapi
      .get(`/order/find/${user}?status=${postType.value}`)
      .then((response) => {
        console.log(response);
        if (response.data !== "") {
        } else {
        }
      })
      .catch((error) => {});
  },
  { immediate: true }
); // 確保元件加載時也會執行一次
</script>

<style scoped>
.share-card {
  width: 250px; /* 設置固定寬度 */
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

.share-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
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
.ts-box {
  height: 150px;
  position: relative;
}
.right-side {
  width: 100%;
}
.margin-right {
  margin-right: 10px;
}
.is-heart-icon {
  color: pink;
}
.is-bookmark-icon {
  color: cornflowerblue;
}
.bookmark {
  position: absolute;
  right: 10px;
  top: -10px;
}
.edit-button:hover {
  cursor: pointer;
  color: #0050b3;
}
.share-edit-button:hover {
  cursor: pointer;
  color: cornflowerblue;
  background-color: #d6d6d6;
}
.icons {
  font-size: 18px;
}
.share-icons {
  font-size: 16px;
}
</style>
