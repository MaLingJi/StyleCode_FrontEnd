// // router/index.js
// import { createRouter, createWebHistory } from 'vue-router';
// import { useUserStore } from '@/stores/user'; // 确保你使用了正确的路径
// import Comment from '@/components/Comment.vue'; // 确保你使用了正确的路径

// const routes = [
//   {
//     path: '/post/:postId',
//     component: Comment,
//     props: route => {
//       const userStore = useUserStore(); // 获取 Pinia store 实例
//       return {
//         postId: Number(route.params.postId),
//         userId: userStore.userId // 从 Pinia store 中获取 userId
//       };
//     }
//   }
// ];

// const router = createRouter({
//   history: createWebHistory(),
//   routes
// });

// export default router;


import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';
import Comment from '@/components/Comment.vue';
import backstage from '@/views/pages/Backstage.vue'
// import Home from '@/views/Home.vue'


const routes = [
  {
    path: '/post/:postId',
    component: Comment,
    props: route => ({
      postId: Number(route.params.postId),
      userId: useUserStore().userId
    })
  },
  
  {
    path: '/backstage',
    name: 'backstage-link',
    component: backstage,
    meta: { requiresAdmin: true }
  },
]
  // 添加其他路由...

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (to.matched.some(record => record.meta.requiresAdmin)) {
    // 檢查用戶是否已登錄且是管理員
    if (!userStore.isLogedin) {
      // 用戶未登錄，重定向到登錄頁面
      next({ name: 'longin-ling', query: { redirect: to.fullPath } });
    } else if (!userStore.isAdmin) {
      // 用戶已登錄但不是管理員，重定向到首頁或顯示錯誤頁面
      next({ name: 'home-link' });
    } else {
      // 用戶是已登錄的管理員，允許訪問
      next();
    }
  } else {
    // 不需要管理員權限的路由，直接通過
    next();
  }
});

export default router;



// const redirect = this.$route.query.redirect;
// if (redirect) {
//   this.$router.push(redirect);
// } else {
//   this.$router.push({ name: 'home-link' });
// }

// 這樣，當未登錄用戶嘗試訪問後台時，他們會被重定向到登錄頁面，登錄成功後會被帶回後台（如果他們有權限的話）。
