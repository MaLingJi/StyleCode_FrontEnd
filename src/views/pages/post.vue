<template>
    <div>
      <a-card :loading="loading" title="Post Detail">
        <p>{{ post.title }}</p>
        <p>{{ post.content }}</p>
      </a-card>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  
  export default defineComponent({
    setup() {
      const route = useRoute();
      const loading = ref(true);
      const post = ref({});
  
      onMounted(() => {
        // 假設這是你的API調用
        fetch(`https://api.example.com/post/${route.params.id}`)
          .then(res => res.json())
          .then(data => {
            loading.value = false;
            post.value = data.post;
          });
      });
  
      return {
        loading,
        post,
      };
    },
  });
  </script>