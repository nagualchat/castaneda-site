<template>
  <div id="search-result">

    <b-tag class="search-stats" type="is-white" v-if="total">Результатов: {{ total }}</b-tag>

    <div class="search-item content" v-for="(item, index) in results" :key="index">
      <div class="search-item-title">
      <router-link :to="`/reader?book=${item._source.book.id}&ch=${item._source.chapter.id}&p=${item._source.content.number}`" target="_blank">{{ item._source.book.author }} — {{ item._source.book.title }}</router-link>
      </div>
      <div class="search-item-subtitle">{{ item._source.chapter.title }}</div>
      <div class="search-item-title" v-html="item.highlight['content.text'][0]"></div>
    </div>

    <infinite-loading spinner="waveDots" v-if="query" @infinite="infiniteHandler" ref="infiniteLoading">
      <span slot="no-more"></span>
      <span slot="no-results">Ничего не найдено</span>
    </infinite-loading>

  </div>
</template>

<script>
  import InfiniteLoading from "vue-infinite-loading";
  import api from "@/api/index"

  export default {
    components: {
      InfiniteLoading
    },

    props: ["query", "books"],

    data() {
      return {
        offset: 0,
        total: null,
        results: []
      }
    },

    watch: {
      '$route' () {
        this.newSearch();
      }
    },

    methods: {
      newSearch: function() {
        this.offset = 0;
        this.total = null;
        this.results = [];

        if (!this.query) return;
        this.$nextTick(() => {
          this.$refs.infiniteLoading.$emit("$InfiniteLoading:reset");
          this.$refs.infiniteLoading.attemptLoad();
        })
      },

      infiniteHandler: function($state) {
        api.search(this.query, this.books.join(","), this.offset).then((result) => {
          this.results = this.results.concat(result.data.hits.hits);
          this.total = result.data.hits.total

          if (this.offset < this.total) {
            $state.loaded();
            this.offset = this.offset + 10;
          } else {
            $state.complete();
          }
        })

      }
    }

  }
</script>

<style lang="scss">
  @import '@/assets/variables.scss';

  #search-result {
    margin-top: 1vh;
  }

  .search-stats {
    float: right;
  }

  .search-item {
    padding: 20px 10px;
    border-bottom: 2px solid $background;
  }

  .search-item-title {
    font-size: 1em;
  }

  .search-item-subtitle {
    font-size: 0.9em;
    margin-bottom: 5px; //font-weight: bold;
  }

  .highlight {
    background-color: $highlight;
  }
</style>