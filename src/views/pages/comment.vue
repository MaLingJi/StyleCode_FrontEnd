<template>
  <section>
    <!-- 第一部分 單一評論 -->
    <a-comment>
      <template #actions>
        <span key="comment-basic-like">
          <a-tooltip title="Like">
            <template v-if="action === 'liked'">
              <heart-filled @click="toggleLike" style="color: #eb2f96;" />
            </template>
            <template v-else>
              <heart-outlined @click="toggleLike" style="color: #eb2f96;" />
            </template>
          </a-tooltip>
          <span style="padding-left: 8px; cursor: auto">{{ likes }}</span>
        </span>
        <span key="comment-basic-collect">
          <a-tooltip title="Collect">
            <template v-if="action === 'collected'">
              <star-filled @click="toggleCollect" style="color: #fadb14;" />
            </template>
            <template v-else>
              <star-outlined @click="toggleCollect" style="color: #fadb14;" />
            </template>
          </a-tooltip>
          <span style="padding-left: 8px; cursor: auto">{{ collects }}</span>
        </span>
        <span key="comment-basic-share">
          <a-tooltip title="Share">
            <share-alt-outlined @click="toggleShare" style="color: #1890ff;" />
          </a-tooltip>
        </span>
        <span key="comment-basic-reply-to">回覆</span>
      </template>
      <template #author><a>漢·索羅</a></template>
      <template #avatar>
        <a-avatar src="https://joeschmoe.io/api/v1/random" alt="漢·索羅" />
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

    <!-- 照片顯示區域 -->
    <div class="image-preview-group">
      <a-image-preview-group>
        <a-image
          v-for="(image, index) in userImages"
          :key="index"
          :width="200"
          :src="image"
        />
      </a-image-preview-group>
    </div>

    <!-- 第二部分 評論列表 -->
    <a-list
      class="comment-list"
      :header="`${comments.length} 則回覆`"
      item-layout="horizontal"
      :data-source="comments"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <a-comment :author="item.author" :avatar="item.avatar">
            <template #actions>
              <span v-for="(action, index) in item.actions" :key="index">{{ action }}</span>
            </template>
            <template #content>
              <p>{{ item.content }}</p>
            </template>
            <template #datetime>
              <a-tooltip :title="item.datetime.format('YYYY-MM-DD HH:mm:ss')">
                <span>{{ item.datetime.fromNow() }}</span>
              </a-tooltip>
            </template>
          </a-comment>
        </a-list-item>
      </template>
    </a-list>

    <!-- 第三部分 新增評論輸入框 -->
    <a-comment class="new-comment">
      <template #avatar>
        <a-avatar src="https://joeschmoe.io/api/v1/random" alt="漢·索羅" />
      </template>
      <template #content>
        <a-form-item>
          <a-textarea 
            v-model:value="newComment" 
            :rows="4" 
            placeholder="新增評論..." 
            class="comment-textarea"
          />
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
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ref } from 'vue';
import { StarFilled, StarOutlined, HeartFilled, HeartOutlined, ShareAltOutlined } from '@ant-design/icons-vue';

dayjs.extend(relativeTime);

const likes = ref<number>(0);
const collects = ref<number>(0);
const shares = ref<number>(0);
const action = ref<string>(''); // 初始化為空字符串
const newComment = ref<string>('');
const submitting = ref<boolean>(false);

// 假設的圖片數據
const userImages = ref<string[]>([
  'https://aliyuncdn.antdv.com/vue.png',
  'https://aliyuncdn.antdv.com/logo.png',
  // 可以在這裡添加更多圖片的 URL
]);

// 點讚和收藏的處理函數
const toggleLike = () => {
  if (action.value === 'liked') {
    likes.value -= 1; // 減少讚數
    action.value = ''; // 重置狀態
  } else {
    likes.value += 1; // 增加讚數
    action.value = 'liked'; // 設置為已點讚
  }
};

const toggleCollect = () => {
  if (action.value === 'collected') {
    collects.value -= 1; // 減少收藏數
    action.value = ''; // 重置狀態
  } else {
    collects.value += 1; // 增加收藏數
    action.value = 'collected'; // 設置為已收藏
  }
};

const toggleShare = () => {
  if (action.value === 'shared') {
    shares.value -= 1; // 減少分享數
    action.value = ''; // 重置狀態
  } else {
    shares.value += 1; // 增加分享數
    action.value = 'shared'; // 設置為已分享
  }
};

// 評論數據
const comments = ref([
  {
    actions: ['回覆'],
    author: '漢·索羅',
    avatar: 'https://joeschmoe.io/api/v1/random',
    content: '傑哥與我們的相愛，產生了濃濃的愛與液，那股芬芳是我們都無法品嘗的滋味~',
    datetime: dayjs().subtract(1, 'days'), // 使用 Dayjs 對象
  },
  {
    actions: ['回覆'],
    author: '漢·索羅',
    avatar: 'https://joeschmoe.io/api/v1/random',
    content: '那我不就跟吉哥產生了濃濃的愛與液，讓你們恨之入骨！',
    datetime: dayjs().subtract(2, 'days'), // 使用 Dayjs 對象
  },
]);

// 處理新增評論
const handleSubmit = () => {
  if (!newComment.value) {
    return; // 如果沒有輸入內容則返回
  }

  submitting.value = true;

  setTimeout(() => {
    submitting.value = false;
    comments.value = [
      {
        actions: ['回覆'],
        author: '漢·索羅',
        avatar: 'https://joeschmoe.io/api/v1/random',
        content: newComment.value, // 使用用戶輸入的內容
        datetime: dayjs(), // 使用 Dayjs 對象
      },
      ...comments.value, // 將新評論添加到現有評論前面
    ];
    newComment.value = ''; // 清空輸入框
  }, 1000);
};
</script>

<style scoped>
.comment-list {
  margin-top: 16px;
}

.new-comment {
  width: 800px; /* 設定新增評論的寬度 */
  height: 250px; /* 設定新增評論的高度 */
  padding: 16px; /* 添加內邊距 */
  border: 1px solid #e8e8e8; /* 添加邊框 */
  border-radius: 4px; /* 添加圓角 */
  background-color: #f9f9f9; /* 背景顏色 */
  margin-top: 16px; /* 上方間距 */
  overflow: hidden; /* 禁止滾動 */
}

.image-preview-group {
  margin-top: 16px; /* 照片區域的上方間距 */
}

.comment-textarea {
  font-size: 16px; /* 設置字體大小 */
}
</style>