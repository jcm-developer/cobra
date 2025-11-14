<script setup lang="ts">
import NavBar from './components/NavBar.vue';

</script>

<template>
  <RouterView />
  <NavBar />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background-color: #37353E;
  color: #ffffff;
}

#app {
  min-height: 100vh;
}
</style>
