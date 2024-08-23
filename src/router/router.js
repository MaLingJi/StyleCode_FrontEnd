import { createRouter, createWebHistory } from "vue-router";

import Home from "@/views/Home.vue";
import NotFound from "@/views/NotFound.vue";
import Forbidden from "@/views/Forbidden.vue";
import Login from "@/views/secure/Login.vue";
import Shop from "@/views/pages/shop.vue";
import Forum from "@/views/pages/forum.vue";
import backstage from "@/views/pages/backstage.vue";
import share from "@/views/pages/share.vue";
import Register from "@/views/secure/register.vue";

import comment from "@/views/pages/comment.vue"


const routes = [
  { name: "home-link", path: "/", component: Home },
  { name: "404-link", path: "/:pathMatch(.*)*", component: NotFound },
  { name: "403-link", path: "/403", component: Forbidden },

  { name: "secure-login-link", path: "/secure/login", component: Login },
  { name: "shop-link", path: "/shop", component: Shop },
  { name: "forum-link", path: "/forum", component: Forum },
  { name: "backstage-link", path: "/backstage", component: backstage },
  { name: "share-link", path: "/share", component: share },

  { name: "longin-ling", path: "/secure/login", component: Login},
  { name: "register-ling", path: "/secure/register", component: Register},
  { name: "comment-link", path: "/comment/:id", component: comment },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
