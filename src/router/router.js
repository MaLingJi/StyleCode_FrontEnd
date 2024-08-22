import { createRouter, createWebHistory } from "vue-router";

import Home from "@/views/Home.vue";
import NotFound from "@/views/NotFound.vue";
import Forbidden from "@/views/Forbidden.vue";
import Login from "@/views/secure/Login.vue";
import Shop from "@/views/pages/shop.vue";
import Forum from "@/views/pages/forum.vue";
import backstage from "@/views/pages/backstage.vue";
import Register from "@/views/secure/register.vue";

import share from "@/views/pages/share.vue";

const routes = [
  { name: "home-link", path: "/", component: Home },
  { name: "404-link", path: "/:pathMatch(.*)*", component: NotFound },
  { name: "403-link", path: "/403", component: Forbidden },

  { name: "secure-login-link", path: "/secure/login", component: Login },
  { name: "shop-link", path: "/shop", component: Shop },
  { name: "forum-link", path: "/forum", component: Forum },
  { name: "backstage-link", path: "/backstage", component: backstage },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
