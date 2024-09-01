<template>
  <header>
    <div>
      <Navigationbar></Navigationbar>
    </div>
  </header>

  
<RouterView></RouterView>


<footer>
  <Footerpage></Footerpage>  
</footer>
</template>

<script setup>
    // import { RouterLink, RouterView } from 'vue-router'
    import Navigationbar from './views/Navigationbar.vue';
    import Footerpage from '@/views/Footerpage.vue'
</script>
<style scoped>

</style>
