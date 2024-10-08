import { createRouter, createWebHistory } from "vue-router";
import useUserStore from "@/stores/user.js";

import Home from "@/views/Home.vue";
import NotFound from "@/views/NotFound.vue";
import Forbidden from "@/views/Forbidden.vue";
import Login from "@/views/secure/Login.vue";
import Forum from "@/views/pages/Forum.vue";
import backstage from "@/views/pages/Backstage.vue";
import share from "@/views/pages/share/Share.vue";
import Register from "@/views/secure/Register.vue";
import cart from "@/views/pages/Cart.vue";
import order from "@/views/pages/Order.vue";
import newShare from "@/views/pages/share/NewShare.vue";
import editShare from "@/views/pages/share/EditShare.vue";
import post from "@/views/post/Post.vue";
import comment from "@/views/post/Comment.vue";
import postContent from "@/views/post/PostContent.vue"
import editPost from "@/views/post/EditPost.vue"
import reportPost from "@/views/post/ReportPost.vue"
import postset from "@/components/profile/Postset.vue"
import LoginSuccess from "@/views/secure/LoginSuccess.vue";

import checkPaying from "@/views/pages/CheckPaying.vue";
import profile from "@/views/secure/Profile.vue";
import shareDetails from "@/views/pages/share/ShareDetails.vue";
import refund from "@/views/pages/Refund.vue";
import refundReview from "@/views/pages/RefundReview.vue";

import paymentPage from "@/views/pages/PaymentPage.vue";

import productDetails from '@/views/pages/product/ProductDetails.vue';
import addProduct from "@/components/product/AddProduct.vue";
import Shop from "@/views/pages/product/Shop.vue";
const routes = [
  { name: "home-link", path: "/", component: Home },
  { name: "404-link", path: "/:pathMatch(.*)*", component: NotFound },
  { name: "403-link", path: "/403", component: Forbidden },
  
  { name: "forum-link", path: "/forum", component: Forum },
  { name: "backstage-link", path: "/backstage", component: backstage,meta: {
    requiresAuth: true,
    requiredPermission: 'Admin'
  } },
  { name: "share-link", path: "/share", component: share },
  { name: "new-share-link", path: "/new-share", component: newShare, meta: { requiresAuth: true } },
  { name: "edit-share-link", path: "/editShare/:postId", component: editShare, meta: { requiresAuth: true } },
  { name: "shareDetails-link", path: "/shareDetails/:postId", component: shareDetails },
  
  { name: "longin-ling", path: "/secure/login", component: Login},
  { name: "register-ling", path: "/secure/register", component: Register},
  { name: "profile-ling", path: "/secure/profile/:initialView?", component: profile ,  props: true, meta: { requiresAuth: true }},
  { name: "postset-link", path: "/post/admin", component: postset},
  { name: "comment-link", path: "/comment/:id", component: comment},
  { name: "editPost-link", path: "/editPost/:id", component: editPost, meta: { requiresAuth: true }},
  { name: "postContent-link", path: "/post/:id", component: postContent },
  { name: "post-link", path: "/post", component: post, meta: { requiresAuth: true } },
  { name: "reportPost-link", path: "/report/;id", component: reportPost },
  { name: "LoginSuccess-link", path: "/LoginSuccess", component: LoginSuccess },
  
  
  { name: "refund-link", path: "/refund/:orderId", component: refund},
  { name: "refundReview-link", path: "/refundReview", component: refundReview},
  { name: "cart-link", path: "/cart", component: cart },
  { name: "order-link", path: "/order", component: order },
  { name: "paymentPage-link", path: "/payment", component: paymentPage,meta: { requiresAuth: true } },
  { name: "checkPaying-link", path: "/checkPaying", component: checkPaying,meta: { requiresAuth: true } },
  
  { name: "shop-link", path: "/shop/:categoryId?/:subcategoryId?", component: Shop },
  { name: "productDetails-link", path: '/product/:id', component: productDetails ,  props: true },
  { name: 'addProduct', path: '/addproduct',component: addProduct},
  
];





const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

//登入判斷 上面網址列 需要判斷是否登入網頁 + meta: { requiresAuth: true }
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const isAuthenticated = userStore.isLogedin
  const requiresAuth = to.meta.requiresAuth
  const requiredPermission = to.meta.requiredPermission

  if (requiresAuth && !isAuthenticated) {
    next('/403')
  }else if (requiredPermission && userStore.permissions !== requiredPermission){
    next('/403')
  } else {
    next()
  }
})

export default router;
