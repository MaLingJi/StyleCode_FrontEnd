<template>
  <header>
    <div>
      <Navigationbar></Navigationbar>
    </div>

    
  </header>

  <RouterView></RouterView>
</template>

<script setup>
    import { RouterLink, RouterView } from 'vue-router'
    import Navigationbar from './views/Navigationbar.vue';
</script>
<style scoped></style>
