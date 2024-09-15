<template>
    <div class="error-page">
      <div class="error-content">
        <h1 class="error-code">{{ errorCode }}</h1>
        <h2 class="error-message">{{ errorMessage }}</h2>
        <p class="error-description">{{ errorDescription }}</p>
        <router-link to="/" class="home-button">回到首頁</router-link>
      </div>
      <div class="mosaic-grid">
        <div v-for="i in 6" :key="i" class="mosaic-item" :class="`item-${i}`">
          <div class="placeholder-image"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  
  const errorCode = computed(() => route.name === '403' ? '403' : '404');
  const errorMessage = computed(() => {
    return route.name === '403' ? '訪問被拒絕' : '頁面未找到';
  });
  const errorDescription = computed(() => {
    return route.name === '403'
      ? '您沒有權限訪問此頁面。請確認您的訪問權限或聯繫網站管理員。'
      : '您所尋找的頁面可能已被移除、名稱已更改或暫時無法使用。';
  });
  </script>
  
  <style scoped>
  .error-page {
    width: 100%;
    min-height: 100vh;
    background-color: #f0f0f0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  
  .error-content {
    text-align: center;
    margin-bottom: 40px;
  }
  
  .error-code {
    font-size: 6em;
    color: #333;
    margin-bottom: 10px;
  }
  
  .error-message {
    font-size: 2em;
    color: #555;
    margin-bottom: 20px;
  }
  
  .error-description {
    font-size: 1.2em;
    color: #777;
    max-width: 600px;
    margin: 0 auto 30px;
  }
  
  .home-button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #333;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }
  
  .home-button:hover {
    background-color: #555;
  }
  
  .mosaic-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    max-width: 600px;
    width: 100%;
  }
  
  .mosaic-item {
    position: relative;
    overflow: hidden;
    padding-bottom: 100%; /* 1:1 aspect ratio */
  }
  
  .placeholder-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #ddd;
    animation: pulse 2s infinite ease-in-out;
  }
  
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
  
  .item-1, .item-9 { grid-column: span 2; grid-row: span 2; }
  
  @media (max-width: 768px) {
    .error-code {
      font-size: 4em;
    }
  
    .error-message {
      font-size: 1.5em;
    }
  
    .error-description {
      font-size: 1em;
    }
  
    .mosaic-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  
    .item-1, .item-4 { grid-column: span 2; grid-row: span 2; }
  }
  
  @media (max-width: 480px) {
    .error-code {
      font-size: 3em;
    }
  
    .error-message {
      font-size: 1.2em;
    }
  
    .error-description {
      font-size: 0.9em;
    }
  
    .mosaic-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  
    .item-1 { grid-column: span 2; grid-row: span 2; }
  }
  </style>