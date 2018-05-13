<template>
  <div id="nav">
    <nav class="navbar is-black">
      <div class="navbar-brand">

        <router-link class="navbar-item" to="/">
          <b-icon icon="creation"></b-icon>
          <span style="margin-left: 8px;">Путь знания</span>
        </router-link>

        <div class="navbar-burger burger" @click="isMenuOpen = !isMenuOpen">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div class="navbar-menu" :class="{ 'is-active': isMenuOpen }">
        <div class="navbar-start">
        </div>

        <div class="navbar-end" @click="isMenuOpen = !isMenuOpen">
          <router-link class="navbar-item" to="/search">Поиск</router-link>
          <router-link class="navbar-item" to="/lib">Библиотека</router-link>
          <router-link class="navbar-item" to="/list">Перепросмотр</router-link>

          <a class="navbar-item is-hidden-desktop" href="tg://resolve?domain=nagualchat" target="_blank">
            <span>Группа в телеграме</span>
            <b-icon size="is-small" icon="open-in-new"></b-icon>
          </a>

          <a class="navbar-item is-hidden-desktop" href="https://github.com/nagualchat/nagualchat-site" target="_blank">
            <span>Гитхаб</span>
            <b-icon size="is-small" icon="open-in-new"></b-icon>
          </a>

          <div class="navbar-item is-hidden" :class="{ 'is-hidden': this.$route.path != '/list' }">
            <b-switch size="is-small" v-model="isDebugChecked"></b-switch>
            <b-icon custom-size="mdi-18px" icon="code-braces"></b-icon>
          </div>

          <div class="navbar-item">
            <span class="is-hidden-desktop">Ночная тема</span>

            <b-switch size="is-small" v-model="isThemeChecked" title="Ночная тема" disabled></b-switch>
            <b-icon class="is-hidden-touch" custom-size="mdi-18px" icon="weather-night"></b-icon>

          </div>
        </div>
      </div>

    </nav>
  </div>
</template>

<script>
  export default {

    data() {
      return {
        isMenuOpen: false,
      }
    },

    computed: {
      isDebugChecked: {
        get() {
          return this.$store.state.list.isDebug;
        },
        set(value) {
          this.$store.commit('SET_DEBUG_MODE', value);
        }
      },

      isThemeChecked: {
        get() {
          return this.$store.state.main.isDarkTheme;
        },
        set(value) {
          this.$store.commit('SET_DARK_THEME', value);
        }
      }
    },

    methods: {
      isHidden(page) {
        if (/list/i.test(this.$route.path) != true) {
          return 'is-hidden';
        }
        return '';
      }
    }
  }
</script>

<style lang="scss">
  .navbar-brand>.is-active {
    background-color: inherit !important;
  }
</style>