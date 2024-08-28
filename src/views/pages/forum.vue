<template>
  <div class="rule-box">
    <a-typography>
      <!-- 論壇規範 -->
      <a-typography-title>論壇區規範</a-typography-title>
      <a-typography-paragraph>
        本論壇為討論服飾為主，請不要發跟本版沒有關係的文章以及主題，所有違反規則的文章將有可能被自動刪除或停權帳號而不作任何通知，請各位遵守論壇規章及守則
      </a-typography-paragraph>
      <a-typography-paragraph>
        請勿連續回文，請勿複製其他的回文內容當成是自已的回文內容。
        <a-typography-text strong>
          近期
        </a-typography-text>
        <a-typography-text code>詐騙</a-typography-text>猖狂甚多請勿發連結相關到文章，系統將自動偵查刪除。
      </a-typography-paragraph>
      <a-typography-title :level="2">發文和照片 規範及限制</a-typography-title>
      <a-typography-paragraph>
        麻煩各位遵守論壇規章
        (
        <a-typography-text code>圖片</a-typography-text>
        最多上傳3張共
        <a-typography-text code>10MB</a-typography-text>
        ), 嚴禁濫發品優低劣的主題或相同的主題，請勿使用廣東話，注音文憀慁愬慇，火星文..等非正式或共通性的語言，嚴禁發表任何人身攻擊, 侮辱他人或引起國際紛争的內容，若受到不公平、不公正的對待, 歡迎向我們反映和投訴, 我們將會秉公處理。
      </a-typography-paragraph>
    </a-typography>
    
    <!-- 發文按鈕 -->
    <div class="buttons">
  <router-link :to="{ name: 'post-link' }">
    <a-button type="primary" style="background-color: #ff8f00; border-color: #ff8f00; height: 52px; font-size: 26px;" size="large">
      <span class="icon">
        <i class="fas fa-edit"></i>
      </span>
      <span>發文</span>
    </a-button>
  </router-link>
</div>
</div>
  
  <!-- 浮動式至頂效果 -->
  <div :style="{ height: '1vh', padding: '10px' }">
    <a-back-top />
  </div>
  
  <!-- 發文地方 -->
  <section>
    <a-list
      item-layout="vertical"
      size="large"
      :pagination="pagination"
      :data-source="listData"
    >
      <template #footer>
        <div class="ts-checklist">
          <div class="item is-warning">發言前請三思而後行。</div>
        </div>
      </template>
      <template #renderItem="{ item }">
        <a-list-item :key="item.title">
          <template #actions>
            <span @click.stop="likePost(item.id)" style="cursor: pointer; margin-right: 8px;">
              <heart-outlined v-if="!item.liked" style="color: #eb2f96;" />
              <heart-filled v-else style="color: #eb2f96;" />
              {{ item.likes }}
            </span>
            <span @click.stop="collectPost(item.id)" style="cursor: pointer; margin-right: 8px;">
              <star-outlined v-if="!item.collected" style="color: #fadb14;" />
              <star-filled v-else style="color: #fadb14;" />
              {{ item.collects }}
            </span>
            <span @click.stop="commentPost(item.id)" style="cursor: pointer; color: #1890ff;">
              <message-outlined />
              {{ item.comments }}
            </span>
          </template>
          <template #extra>
            <img
              width="272"
              alt="logo"
              :src="item.firstImageUrl"
            />
          </template>
          <a-list-item-meta :description="item.description">
            <template #title>
              <router-link :to="`/comment/${item.id}`" tag="a">{{ item.title }}</router-link>
            </template>
            <template #avatar><a-avatar :src="item.avatar" /></template>
          </a-list-item-meta>
          {{ item.content }}
        </a-list-item>
      </template>
    </a-list>
  </section>
</template>

<script lang="ts">
import { StarOutlined, StarFilled, HeartOutlined, HeartFilled, MessageOutlined } from '@ant-design/icons-vue';
import { defineComponent, ref } from 'vue';

const listData: Record<string, any>[] = [];

for (let i = 0; i < 50; i++) {
  listData.push({
    id: i.toString(),  // 確保每個項目都有唯一的 id
    href: 'https://www.antdv.com/',
    title: `設計標題部分 ${i}`,
    avatar: 'https://joeschmoe.io/api/v1/random',
    description: 'Ant Design，後台應用的設計語言，由 Ant UED 團隊精心打造',
    content: '我們提供一系列的設計原理、實用的圖案和優質的設計資源（Sketch和Axure），幫助人們有效率、精美地創建產品原型',
    likes: 0, // 初始讚數
    collects: 0, // 初始收藏數
    comments: 0, // 初始評論數
    liked: false, // 初始讚狀態
    collected: false, // 初始收藏狀態
    firstImageUrl: `https://example.com/user-image-${i}.jpg`, // 使用第一張照片的 URL
    imageUrls: [
      `https://example.com/user-image-${i}.jpg`,
      `https://example.com/user-image-${i}-2.jpg`,
      `https://example.com/user-image-${i}-3.jpg`,
    ], // 存儲所有照片的 URL
  });
}

export default defineComponent({
  components: {
    StarOutlined,
    StarFilled,
    HeartOutlined,
    HeartFilled,
    MessageOutlined,
  },
  setup() {
    const pagination = ref({
      current: 1,
      pageSize: 8,
      total: listData.length,
      onChange: (page: number) => {
        pagination.value.current = page;
        loadMorePosts(page);
      },
    });

    const loadMorePosts = (page: number) => {
      // 根據當前頁碼加載更多數據
      console.log(`Loading more posts for page ${page}`);
    };

    const likePost = (id: string) => {
      const post = listData.find(item => item.id === id);
      if (post) {
        if (!post.liked) {
          post.likes += 1; // 增加讚數
          post.liked = true; // 設置為已點讚
        }
      }
    };

    const collectPost = (id: string) => {
      const post = listData.find(item => item.id === id);
      if (post) {
        if (!post.collected) {
          post.collects += 1; // 增加收藏數
          post.collected = true; // 設置為已收藏
        }
      }
    };

    const commentPost = (id: string) => {
      const post = listData.find(item => item.id === id);
      if (post) {
        post.comments += 1; // 增加評論數
      }
    };

    return {
      listData,
      pagination,
      likePost,
      collectPost,
      commentPost,
      
    };
  },
});
</script>

<style scoped>
.rule-box {
  background-color: #f0f0f0;
  padding: 20px;
  border: 1px solid #dddddd;
  border-radius: 5px;
}
</style>