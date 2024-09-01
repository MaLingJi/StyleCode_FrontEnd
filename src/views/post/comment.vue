<template>
  <div>
    <h1>{{ post.postTitle }}</h1>
    <p>{{ post.contentText }}</p>
    <img v-if="post.images.length > 0" :src="post.images[0].imgUrl" alt="Post Image" />

    <h2>新增留言</h2>
    <a-textarea v-model:value="newComment" placeholder="輸入留言" />
    <a-button @click="handleSubmit">送出</a-button>

    <h2>留言列表</h2>
    <ul>
      <li v-for="(comment, index) in comments" :key="index">
        <span v-if="!comment.isEditing">{{ comment.content }}</span>
        <a-textarea v-if="comment.isEditing" v-model:value="comment.editContent" />
        
        <a-button v-if="comment.userId === currentUserId" @click="toggleEdit(comment)">
          {{ comment.isEditing ? '保存' : '編輯' }}
        </a-button>
        <a-button v-if="comment.userId === currentUserId" @click="deleteComment(comment.id)">刪除</a-button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axiosapi from "@/plugins/axios.js";
import useUserStore from "@/stores/user.js"; 

interface Post {
  postId: number;
  postTitle: string;
  contentText: string;
  images: Array<{ imgUrl: string }>;
}

interface Comment {
  id: number;
  content: string;
  userId: number;
  isEditing?: boolean;
  editContent?: string;
}

const route = useRoute();
const postId = Number(route.params.id);
const post = ref<Post>({} as Post);
const newComment = ref('');
const comments = ref<Comment[]>([]);
const userStore = useUserStore();
const currentUserId = Number(userStore.userId);

// 獲取文章數據
const fetchPostData = async () => {
  try {
    const response = await axiosapi.get(`/post/${postId}`);
    post.value = response.data;
    await fetchComments(); 
  } catch (error) {
    console.error("獲取文章數據失敗:", error);
  }
};

// 獲取評論數據
const fetchComments = async () => {
  try {
    const response = await axiosapi.get(`/comment`);
    comments.value = response.data.filter(comment => comment.post.postId === postId).map(comment => ({
      ...comment,
      isEditing: false,
      editContent: ""
    }));
  } catch (error) {
    console.error("獲取評論數據失敗:", error);
  }
};

// 提交評論
const handleSubmit = async () => {
  if (!newComment.value) return;

  try {
    const response = await axiosapi.post(`/comment`, { 
      post: { postId: postId },
      userDetail: { id: currentUserId },
      comment: newComment.value
    });

    const newCommentData = { 
      ...response.data,
      isEditing: false,
      editContent: '',
    };
    comments.value.push(newCommentData);
    newComment.value = '';
  } catch (error) {
    console.error("新增評論失敗:", error);
  }
};

// 編輯評論
const editComment = async (commentId: number, newContent: string) => {
  try {
    await axiosapi.put(`/comment/${commentId}`, { content: newContent });
    const index = comments.value.findIndex(comment => comment.id === commentId);
    if (index !== -1) {
      comments.value[index].content = newContent;
    }
  } catch (error) {
    console.error("編輯評論失敗:", error);
  }
};

// 切換編輯狀態
const toggleEdit = (comment: Comment) => {
  if (comment.isEditing) {
    editComment(comment.id, comment.editContent!);
    comment.isEditing = false;
  } else {
    comment.editContent = comment.content;
    comment.isEditing = true;
  }
};

// 刪除評論
const deleteComment = async (commentId: number) => {
  try {
    await axiosapi.delete(`/comment/${commentId}`);
    comments.value = comments.value.filter(comment => comment.id !== commentId);
  } catch (error) {
    console.error("刪除評論失敗:", error);
  }
};

// 初始載入
onMounted(async () => {
  await fetchPostData();
});
</script>

<style scoped>

</style>
