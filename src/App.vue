<template>
  <div id="app" :class="{ 'dark': isDarkTheme }">

    <app-navbar/>

    <section class="section is-fullheight" style="padding-top: 1em;">
      <router-view/>
    </section>

  </div>
</template>

<script>
  import Navbar from "@/components/Navbar";

  export default {
    name: 'App',
    components: {
      'app-navbar': Navbar,
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

  @import './assets/main.scss';
  @import './assets/tree.scss';

</style>
