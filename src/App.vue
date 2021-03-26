<template>
  <div id="app">
    <Header class="pb-3 pt-1"/>
    <router-view/>
  </div>
</template>

<script>
  import Header from "./components/Header/Header";

  export default {
    name: 'app',
    components: {
      Header
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  .node {
    /*max-width: 200px;*/
    width: 200px !important;
  }

  .selected {
    border: 4px solid rgba(217, 83, 79, 0.3) !important;
  }
</style>
