<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navigationbar from './views/Navigationbar.vue';
</script>

<template>
  <header>
    <div>
        <!-- <Navigationbar></Navigationbar> -->
    </div>

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <!-- <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink> -->
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
</style>
