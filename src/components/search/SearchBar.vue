<template>
  <div id="search-bar">

    <nav class="level is-mobile link-icons-bar">
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

    <b-collapse class="collapse-options" :class="{ 'collapse-options-open': isOptionsOpen }" :open.sync="isOptionsOpen" animation="none">
      <b-field position="is-centered" grouped group-multiline>
        <div class="control">
          <a class="toggle-icon icon invert-link is-borderless" title="Подключить/отключить все" @click="selectAll"><b-icon icon="check-circle-outline"></b-icon></a>
        </div>
        <b-checkbox-button v-for="(item, index) in libraryList" :key="index"
          v-model="books" :native-value="item.id" :title="item.ashort + ' — ' + item.title" type="is-secondary" size="is-small">
          <span>{{ item.tshort }}</span>
        </b-checkbox-button>
      </b-field>
    </b-collapse>

    <div class="field has-addons">
      <p class="control has-icons-right is-expanded">
        <input class="input is-medium" type="text" ref="searchInput" v-model="query" @keyup.enter="doSearch">
        <span class="icon is-small is-right is-clickable" v-show="query">
          <i class="mdi mdi-close" @click="clearInput"></i>
        </span>
      </p>
        <p class="control">
          <a class="button is-medium" @click="doSearch">
            <b-icon icon="magnify"></b-icon>
          </a>
        </p>
    </div>

  </div>
</template>

<script>
  import SearchHelp from '@/components/search/SearchHelp';

  export default {
    components: {
      SearchHelp
    },

    props: ['inputQuery', 'inputBooks'],

    data() {
      return {
        isOptionsOpen: false,
        isHelpShow: false,
        query: this.inputQuery,
        books: this.inputBooks || ['cc1c', 'cc2c', 'cc3n', 'cc4n', 'cc5n', 'cc6n', 'cc7n', 'cc8n', 'cc9n', 'cc10s', 'cc11s', 'taisha', 'florinda'],
      }
    },

    computed: {
      libraryList() {
        return this.$store.state.main.books;
      }
    },

    created: function() {
      this.$nextTick(() => this.$refs.searchInput.focus());
    },

    watch: {
      '$route' () {
        this.query = this.inputQuery;
      }
    },

    methods: {
      clearInput: function() {
        this.query = '';
        this.$refs.searchInput.focus();
      },

      selectAll: function() {
        if (this.books.length <= 0) {
          for (var item in this.libraryList) {
            this.books.push(this.libraryList[item].id);
          }
        } else {
          this.books = [];
        }
      },

      doSearch: function() {
        if (this.query) {
          this.$router.push({ path: 'search', query: { query: this.query.trim(), books: this.books.join(',') } });
        }
      }
    }

  }
</script>

<style lang="scss">
  @import '@/assets/variables.scss';

  .control .toggle-icon {
    vertical-align: middle;
  }

  .queries-tag {
    font-size: 0.9em !important;
    height: 1em !important;
  }

  .link-icons-bar {
    margin-bottom: 1vh !important;
  }

  .collapse-options {
    margin-bottom: 0.5vh;
  }

  .collapse-options-open {
    margin-bottom: 1.5vh;
  }
</style>