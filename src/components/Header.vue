<template>
  <div id="nav">
    <nav class="navbar is-black">

      <div class="navbar-brand">
        <router-link class="navbar-item is-size-5" to="/" exact>Список перепросмотра</router-link>

        <div class="navbar-burger burger" @click="isMenuOpen = !isMenuOpen">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div class="navbar-menu" :class="{ 'is-active': isMenuOpen }">
        <div class="navbar-start">
        </div>

        <div class="navbar-end">

          <div class="navbar-item is-hidden">
            <div class="control has-icons-left">
              <b-input placeholder="Поиск" size="is-small" icon="magnify">
              </b-input>
            </div>
          </div>

          <router-link class="navbar-item" to="/info">Справка</router-link>
          <a class="navbar-item is-hidden">
            <b-icon icon="help-circle-outline"></b-icon>
          </a>

          <div class="navbar-item" :class="{ 'is-hidden': this.$route.name != 'main' }">
            <b-switch size="is-small" v-model="isDebugChecked"></b-switch>
            <b-icon custom-size="mdi-18px" icon="code-braces"></b-icon>
          </div>
          <div class="navbar-item">
            <b-switch size="is-small" v-model="isThemeChecked"></b-switch>
            <b-icon custom-size="mdi-18px" icon="weather-night"></b-icon>
          </div>
        </div>
      </div>

    </nav>
  </div>
</template>

<script>

  export default {
    name: 'Header',
    data() {
      return {
        isMenuOpen: false,
      }
    },

    computed: {
      isDebugChecked: {
        get() {
          return this.$store.state.isDebug;
        },
        set(value) {
          this.$store.commit('setDebugMode', value)
        }
      },

      isThemeChecked: {
        get() {
          return this.$store.state.isDarkTheme;
        },
        set(value) {
          this.$store.commit('setDarkTheme', value)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/variables.scss';

  .navbar-brand > .is-active {
    background-color: inherit !important;
  }
</style>
