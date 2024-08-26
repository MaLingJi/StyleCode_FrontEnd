<template>
  <section>
    <!-- 第一部分 -->
    <a-comment>
      <template #actions>
        <span key="comment-basic-like">
          <a-tooltip title="Like">
            <template v-if="action === 'liked'">
              <LikeFilled @click="like" />
            </template>
            <template v-else>
              <LikeOutlined @click="like" />
            </template>
          </a-tooltip>
          <span style="padding-left: 8px; cursor: auto">{{ likes }}</span>
        </span>
        <span key="comment-basic-dislike">
          <a-tooltip title="Dislike">
            <template v-if="action === 'disliked'">
              <DislikeFilled @click="dislike" />
            </template>
            <template v-else>
              <DislikeOutlined @click="dislike" />
            </template>
          </a-tooltip>
          <span style="padding-left: 8px; cursor: auto">{{ dislikes }}</span>
        </span>
        <span key="comment-basic-reply-to">回覆</span>
      </template>
      <template #author><a>漢·索羅</a></template>
      <template #avatar>
        <a-avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />
      </template>
      <template #content>
        <p>
          我帶來一些我自己的語錄以下 是我的經典語錄~
蹲得越低 插得越深
吃虧就是占便宜 吃龜就是含 舔 抿~
失敗的人找藉口 成功的人找別人來口~
當你凝視著菊花 菊花也在凝視著你~
橋對角度 你也能抵達喉嚨深處~
不脫衣服 怎麼開始~
姿勢就是力量！
        </p>
      </template>
      <template #datetime>
        <a-tooltip :title="dayjs().format('YYYY-MM-DD HH:mm:ss')">
          <span>{{ dayjs().fromNow() }}</span>
        </a-tooltip>
      </template>
    </a-comment>

    <!-- 第二部分 -->
    <a-list
      class="comment-list"
      :header="`${comments.length} 回覆`"
      item-layout="horizontal"
      :data-source="comments"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <a-comment
            :author="item.author"
            :avatar="item.avatar"
            :content="item.content"
            :datetime="item.datetime"
          >
            <template #actions>
              <span v-for="(action, index) in item.actions" :key="index">{{ action }}</span>
            </template>
          </a-comment>
        </a-list-item>
      </template>
    </a-list>

    <!-- 第三部分 -->
    <a-comment class="custom-comment">
      <template #avatar>
        <a-avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />
      </template>
      <template #content>
        <a-form-item>
          <a-textarea v-model:value="value" :rows="4" />
        </a-form-item>
        <a-form-item>
          <a-button html-type="submit" :loading="submitting" type="primary" @click="handleSubmit">
            新增評論
          </a-button>
        </a-form-item>
      </template>
    </a-comment>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import { LikeFilled, LikeOutlined, DislikeFilled, DislikeOutlined } from '@ant-design/icons-vue';

const likes = ref<number>(0);
const dislikes = ref<number>(0);
const action = ref<string>();

const like = () => {
  likes.value = 1;
  dislikes.value = 0;
  action.value = 'liked';
};

const dislike = () => {
  likes.value = 0;
  dislikes.value = 1;
  action.value = 'disliked';
};

type Comment = {
  author: string;
  avatar: string;
  content: string;
  datetime: any;
  actions?: string[];
};

const comments = ref<Comment[]>([
  {
    actions: ['回覆'],
    author: '漢·索羅',
    avatar: 'https://joeschmoe.io/api/v1/random',
    content:
      '傑哥與我們的相愛，產生了濃濃的愛與液，那股芬芳是我們都無法品嘗的滋味~',
    datetime: dayjs().subtract(1, 'days'),
  },
  {
    actions: ['回覆'],
    author: '漢·索羅',
    avatar: 'https://joeschmoe.io/api/v1/random',
    content:
      '那我不就跟吉哥產生了濃濃的愛與液，讓你們恨之入骨！',
    datetime: dayjs().subtract(2, 'days'),
  },
]);

const submitting = ref<boolean>(false);
const value = ref<string>('');

const handleSubmit = () => {
  if (!value.value) {
    return;
  }

  submitting.value = true;

  setTimeout(() => {
    submitting.value = false;
    comments.value = [
      {
        author: 'Han Solo',
        avatar: 'https://joeschmoe.io/api/v1/random',
        content: value.value,
        datetime: dayjs().fromNow(),
      },
      ...comments.value,
    ];
    value.value = '';
  }, 1000);
};
</script>
<style scoped>
.custom-comment {
  width: 800px;
  height: 250px;
  display: flex;
  flex-direction: column;
}

.custom-comment a-textarea {
  flex: 1; /* 使文本框填滿可用空間 */
  width: 100%; /* 確保文本框的寬度填滿評論框 */
  height: 100%; /* 使文本框的高度為 250px */
}
</style>