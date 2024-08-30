// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user'; // 确保你使用了正确的路径
import Comment from '@/components/Comment.vue'; // 确保你使用了正确的路径

const routes = [
  {
    path: '/post/:postId',
    component: Comment,
    props: route => {
      const userStore = useUserStore(); // 获取 Pinia store 实例
      return {
        postId: Number(route.params.postId),
        userId: userStore.userId // 从 Pinia store 中获取 userId
      };
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
