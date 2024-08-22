<template>
  <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="listData">
    <template #footer>
      <div>
        <b>ant design vue</b>
        頁尾部分
      </div>
    </template>
    <template #renderItem="{ item }">
      <router-link :to="`/comment/${item.id}`" tag="a">
        <a-list-item :key="item.title">
          <template #actions>
            <span v-for="{ type, text } in actions" :key="type">
              <component :is="type" style="margin-right: 8px" />
              {{ text }}
            </span>
          </template>
          <template #extra>
            <img
              width="272"
              alt="logo"
              src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
            />
          </template>
          <a-list-item-meta :description="item.description">
            <template #title>
              <a :href="item.href">{{ item.title }}</a>
            </template>
            <template #avatar><a-avatar :src="item.avatar" /></template>
          </a-list-item-meta>
          {{ item.content }}
        </a-list-item>
      </router-link>
    </template>
  </a-list>
</template>

<script lang="ts">
import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons-vue';
import { defineComponent } from 'vue';

const listData: Record<string, string>[] = [];

for (let i = 0; i < 23; i++) {
  listData.push({
    id: i.toString(),  // 確保每個項目都有唯一的 id
    href: 'https://www.antdv.com/',
    title: `設計標題部分 ${i}`,
    avatar: 'https://joeschmoe.io/api/v1/random',
    description:
      'Ant Design，後台應用的設計語言，由 Ant UED 團隊精心打造',
    content:
      '我們提供一系列的設計原理、實用的圖案和優質的設計資源（Sketch和Axure），幫助人們有效率、精美地創建產品原型',
  });
}

export default defineComponent({
  components: {
    StarOutlined,
    LikeOutlined,
    MessageOutlined,
  },
  setup() {
    const pagination = {
      onChange: (page: number) => {
        console.log(page);
      },
      pageSize: 3,
    };
    const actions: Record<string, string>[] = [
      { type: 'StarOutlined', text: '156' },
      { type: 'LikeOutlined', text: '156' },
      { type: 'MessageOutlined', text: '2' },
    ];
    return {
      listData,
      pagination,
      actions,
    };
  },
});
</script>
