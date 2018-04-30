<template>
  <div id="search">

    <div v-if="!query" class="level is-hidden-mobile">
      <div class="level-left"></div>

      <div class="level-right">
        <a class="level-item invert-link" href="tg://resolve?domain=nagualchat" title="Группа в телеграме">
          <b-icon pack="fab" icon="telegram" size="is-medium"></b-icon>
        </a>

        <a class="level-item invert-link" href="https://github.com/nagualchat/nagualchat-site" target="_blank" title="Гитхаб">
          <b-icon pack="fab" icon="github" size="is-medium"></b-icon>
        </a>
      </div>
    </div>

    <div class="columns is-centered">
      <div class="column is-9-tablet is-8-desktop is-7-widescreen is-6-fullhd">

        <div v-if="!query" class="search-title is-hidden-mobile">
          <h1 class="is-size-1 has-text-centered">Поиск по книгам</h1>
          <h2 class="is-size-5 has-text-centered">Карлоса Кастанеды и его соратников</h2>
        </div>

        <search-bar :inputQuery="query" :inputBooks="books" />
        <search-result :query="query" :books="books" />

        <last-queries v-if="!query"/>

      </div>
    </div>
  </div>
</template>

<script>
  import SearchBar from '@/components/search/SearchBar';
  import SearchResult from '@/components/search/SearchResult';
  import LastQueries from '@/components/search/LastQueries';

  export default {
    name: 'SearchPage',
    metaInfo: {
      title: 'Поиск по книгам'
    },

    components: {
      SearchBar,
      SearchResult,
      LastQueries
    },

    data() {
      return {
        query: null,
        books: null
      }
    },

    created: function() {
      if (this.$route.query.query) this.query = this.$route.query.query;
      if (this.$route.query.books) this.books = this.$route.query.books.split(',');
    },

    watch: {
      '$route' (to, from) {
        to.query.query ? this.query = to.query.query : this.query = undefined;
        to.query.books ? this.books = to.query.books.split(',') : null;
      }
    },

  }
</script>

<style lang="scss">
  @import '@/assets/variables.scss';

  .search-title {
    font-family: 'Open Sans', sans-serif;
    margin-top: 18vh;
    margin-bottom: 3vh;
  }
</style>