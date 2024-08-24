<template>
  <section>
    <a-list
      item-layout="vertical"
      size="large"
      :pagination="pagination"
      :data-source="listData"
    >
      <template #footer>
        <div>
          <b>ant design vue</b>
          頁尾部分
        </div>
      </template>
      <template #renderItem="{ item }">
        <a-list-item :key="item.title">
          <template #actions>
            <span @click.stop="likePost(item.id)" style="cursor: pointer; margin-right: 8px;">
              <LikeOutlined />
              {{ item.likes }}
            </span>
            <span @click.stop="collectPost(item.id)" style="cursor: pointer; margin-right: 8px;">
              <StarOutlined />
              {{ item.collects }}
            </span>
            <span>
              <MessageOutlined />
              {{ item.comments }}
            </span>
          </template>
          <template #extra><!-- 顯示第一張照片 -->
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
import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons-vue';
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
    LikeOutlined,
    MessageOutlined,
  },
  setup() {
    const pagination = ref({
      current: 1,
      pageSize: 6,
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
        post.likes += 1; // 增加讚數
      }
    };

    const collectPost = (id: string) => {
      const post = listData.find(item => item.id === id);
      if (post) {
        post.collects += 1; // 增加收藏數
      }
    };

    return {
      listData,
      pagination,
      likePost,
      collectPost,
    };
  },
});
</script>

<style scoped>

</style>