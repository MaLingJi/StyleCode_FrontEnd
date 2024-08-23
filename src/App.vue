<template>
  <header>
    <div>
      <Navigationbar></Navigationbar>
    </div>
  </header>

  <RouterView></RouterView>
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Navigationbar from "./views/Navigationbar.vue";
</script>

<style scoped></style>
