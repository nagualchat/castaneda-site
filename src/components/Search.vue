<template>
  <div>

    <nav class="level is-mobile search-header">
      <div class="level-left">
        <p class="level-item" @click="isOptionsOpen = !isOptionsOpen"><b-icon icon="menu-down"></b-icon><a class="invert-link">Параметры поиска</a></p>
      </div>

      <div class="level-right">
        <p class="level-item" @click="isHelpShow = !isHelpShow"><a class="invert-link">Справка</a></p>
      </div>
    </nav>

    <b-modal :active.sync="isHelpShow" :canCancel="['escape', 'outside']" has-modal-card>
      <search-help />
    </b-modal>

    <b-collapse class="search-options" :open.sync="isOptionsOpen">
      <b-field class="search-options-content" position="is-centered" grouped group-multiline>
        <div class="control">
          <a class="icon icon-link is-borderless" title="Подключить/отключить все" @click="selectAll"><b-icon icon="check-circle-outline"></b-icon></a>
        </div>

        <b-checkbox-button v-for="(item, index) in books" :key="index"
          v-model="selected" :native-value="item.id" :title="item.ashort + ' — ' + item.title" type="is-info" size="is-small">
          <span>{{ item.tshort }}</span>
        </b-checkbox-button>

      </b-field>
    </b-collapse>

    <b-field>
      <b-input ref="search" size=" is-medium" type="text" expanded v-model="query" @keyup.enter.native="doSearch(true)"></b-input>
      <div class="control">
        <a class="button is-medium" @click="doSearch"><b-icon icon="magnify"></b-icon></a>
      </div>
    </b-field>

    <div class="search-stats is-size-7">{{ total }}</div>

    <div class="search-item" v-for="(item, index) in results" :key="index">
      <div class="search-item-title">
      <router-link :to="`/reader?book=${item._source.book.id}&ch=${item._source.chapter.id}&p=${item._source.content.number}`" target="_blank">{{ item._source.book.author }} — {{ item._source.book.title }}</router-link>
      </div>
      <div class="search-item-subtitle">{{ item._source.chapter.title }}</div>
      <div class="search-item-title" v-html="item.highlight['content.text'][0]"></div>
    </div>

    <infinite-loading spinner="waveDots" v-if="isSearching" @infinite="infiniteHandler" ref="infiniteLoading">
      <span slot="no-more"></span>
      <span slot="no-results">Ничего не найдено</span>
    </infinite-loading>

  </div>
</template>

<script>
  import InfiniteLoading from "vue-infinite-loading";
  import SearchHelp from "@/components/SearchHelp";
  import { mapState } from "vuex"
  import api from "@/api/index"

  export default {
    components: {
      InfiniteLoading,
      SearchHelp
    },

    data() {
      return {
        isOptionsOpen: false,
        isHelpShow: false,
        isSearching: false,

        selected: ["cc1c", "cc2c", "cc3n", "cc4n", "cc5n", "cc6n", "cc7n", "cc8n", "cc9n", "cc10s", "cc11s", "taisha", "florinda"],
        query: null,
        offset: 0,
        total: null,
        results: []
      }
    },

    computed: {
    ...mapState({
        books: state => state.main.books
      })
    },

    created: function() {
      this.$nextTick(() => this.$refs.search.focus())
    },

    methods: {
      selectAll: function() {
        if (this.selected.length <= 0) {
          for (var item in this.books) {
            this.selected.push(this.books[item].id);
          }
        } else {
          this.selected = [];
        }
      },

      doSearch: function() {
        if (this.query && this.query.trim()) {
          this.$emit("searching")
          this.isSearching = true;

          this.results = []
          this.offset = 0

          this.$nextTick(() => {
            this.$refs.infiniteLoading.$emit("$InfiniteLoading:reset");
            this.$refs.infiniteLoading.attemptLoad();
          })
        }
      },

      infiniteHandler: function($state) {
        var filter = this.selected.join(",")

        api.search(this.query, filter, this.offset).then((result) => {
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