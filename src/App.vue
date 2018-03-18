<template>
  <div id="app" :class="{ 'dark': isDarkTheme }">

    <app-header/>

    <section class="section is-fullheight" style="padding-top: 1em;">
      <router-view/>
    </section>

  </div>
</template>

<script>
  import Header from "@/components/Header.vue";

  export default {
    name: 'App',
    components: {
      'app-header': Header,
    },

    computed: {
      isDarkTheme () {
        return this.$store.state.isDarkTheme
      }
    }
  }
</script>

<style lang="scss">
  @import './assets/variables.scss';

  .dark {
    @import "./assets/dark/variables.scss";
    @import "./assets/dark/overrides.scss";
  }

  @import "~bulma";
  @import "~buefy/src/scss/buefy";


  .is-fullheight {
    min-height: 100vh;
  }
</style>
