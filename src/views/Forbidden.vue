<template>
  <div class="forbidden-page">
    <div class="error-content">
      <h1 class="error-code">403</h1>
      <h2 class="error-message">訪問被拒絕</h2>
      <p class="error-description">
        很抱歉,您沒有權限訪問此頁面。這可能是因為您尚未登入或沒有足夠的權限。
      </p>
      <div class="action-buttons">
        <button @click="redirectToLogin" class="login-button">前往登入</button>
        <router-link to="/" class="home-button">回到首頁</router-link>
      </div>
    </div>
    <div class="mosaic-grid">
      <div v-for="i in 6" :key="i" class="mosaic-item" :class="`item-${i}`">
        <div class="placeholder-image"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const redirectToLogin = () => {
  // 假設您的登入頁面路由是 '/login'
  router.push('/secure/login');
};
</script>

<style scoped>
.forbidden-page {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
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
  color: #444;
  margin-bottom: 20px;
}

.error-description {
  font-size: 1.2em;
  color: #666;
  max-width: 600px;
  margin: 0 auto 30px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.login-button, .home-button {
  display: inline-block;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease, transform 0.3s ease;
  font-weight: bold;
}

.login-button {
  background-color: #333;
  color: white;
  border: none;
  cursor: pointer;
}

.login-button:hover {
  background-color: #555;
  transform: translateY(-2px);
}

.home-button {
  background-color: #e0e0e0;
  color: #333;
  border: 1px solid #ccc;
}

.home-button:hover {
  background-color: #d0d0d0;
  transform: translateY(-2px);
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
  background-color: #e0e0e0;
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

  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }

  .login-button, .home-button {
    width: 100%;
  }

  .mosaic-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .item-1 { grid-column: span 2; grid-row: span 2; }
}
</style>