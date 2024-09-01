// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import useUserStore from '@/stores/user'; 
import comment from '@/views/pages/comment.vue'; 

const routes = [
  {
    path: '/post/:postId', // 使用冒號來定義路由參數
    component: comment,
    props: route => {
      const userStore = useUserStore(); // 獲取用戶存儲
      const postId = Number(route.params.postId);

      // 確保 postId 是有效的
      if (isNaN(postId)) {
        console.error("Invalid postId:", route.params.postId);
        return {
          postId: null,
          userId: userStore.userId 
        };
      }

      return {
        postId,
        userId: userStore.userId 
      };
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;