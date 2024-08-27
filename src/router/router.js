import { createRouter, createWebHistory } from "vue-router";

import Home from "@/views/Home.vue";
import NotFound from "@/views/NotFound.vue";
import Forbidden from "@/views/Forbidden.vue";
import Login from "@/views/secure/Login.vue";
import Shop from "@/views/pages/product/shop.vue";
import Forum from "@/views/pages/forum.vue";
import backstage from "@/views/pages/backstage.vue";
import share from "@/views/pages/share.vue";
import Register from "@/views/secure/register.vue";
import comment from "@/views/pages/comment.vue";
import cart from "@/views/pages/cart.vue";
import order from "@/views/pages/order.vue";
import newShare from "@/views/pages/newShare.vue";
import editShare from "@/views/pages/editShare.vue";
import post from "@/views/pages/post.vue";

import productDetails from '@/views/pages/product/productDetails.vue';
import paymentPage from "@/views/pages/paymentPage.vue";
import checkPaying from "@/views/pages/checkPaying.vue";
import profile from "@/views/secure/profile.vue";

const routes = [
  { name: "home-link", path: "/", component: Home },
  { name: "404-link", path: "/:pathMatch(.*)*", component: NotFound },
  { name: "403-link", path: "/403", component: Forbidden },
  
  { name: "secure-login-link", path: "/secure/login", component: Login },
  { name: "shop-link", path: "/shop", component: Shop },
  { name: "productDetails-link", path: '/product/:id', component: productDetails ,  props: true },
  { name: "forum-link", path: "/forum", component: Forum },
  { name: "backstage-link", path: "/backstage", component: backstage },
  { name: "share-link", path: "/share", component: share },
  { name: "new-share-link", path: "/new-share", component: newShare },
  { name: "edit-share-link", path: "/editShare/:postId", component: editShare },
  
  
  
  { name: "longin-ling", path: "/secure/login", component: Login},
  { name: "register-ling", path: "/secure/register", component: Register},
  { name: "profile-ling", path: "/secure/profile", component: profile},
  { name: "comment-link", path: "/comment/:id", component: comment },
  { name: "productDetails-link", path: '/product/:id', component: productDetails},
  { name: "cart-link", path: "/cart", component: cart },
  { name: "order-link", path: "/order", component: order },
  { name: "post-link", path: "/post", component: post },
  { name: "paymentPage-link", path: "/payment", component: paymentPage },
  { name: "checkPaying-link", path: "/checkPaying", component: checkPaying },
];





const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});



export default router;
