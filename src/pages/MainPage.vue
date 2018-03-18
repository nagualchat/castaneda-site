<template>
  <div id="main">
    <div class="columns is-centered">
      <div class="column is-9-tablet is-8-desktop is-7-widescreen is-6-fullhd">

        <nav class="level nav-list is-mobile">
          <div class="level-left">
            <div class="level-item">
              <a class="link" @click="isListsMenu = !isListsMenu">
                <span>{{ list.name }}</span>
              </a>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
            <b-dropdown hoverable>
              <a class="is-text" slot="trigger">
                <span>{{ itemsInList }}</span>
              </a>
              <b-dropdown-item custom>
                <div class="dropdown-info">
                  <span>Создан:</span>
                  <span>{{ createdDate }}</span>
                </div>
              </b-dropdown-item>
            </b-dropdown>
            </div>
          </div>
        </nav>

        <b-modal :active.sync="isListsMenu" :canCancel="['escape', 'outside']" has-modal-card>
          <lists-control :lists="lists" :listId.sync="listId" @add="addList()" @select="changeList($event)" />
        </b-modal>

        <tree class="tree" :list="list.tree" />

        <debug-panel @clear="сlearStorage()" v-show="isDebug" />

      </div>
    </div>
  </div>
</template>

<script>
  import Tree from "@/components/Tree";
  import DebugPanel from "@/components/DebugPanel";
  import ListsControl from "@/components/ListsControl";
  import { mapState, mapActions, mapGetters } from 'vuex'

  export default {
    name: "MainPage",

    components: {
      Tree,
      DebugPanel,
      ListsControl
    },

    data() {
      return {
        isListsMenu: false,
        isSearch: false,
      }
    },

    computed: {
      ...mapState(['isDebug', 'listId', 'list', 'lists']),
      ...mapGetters(['itemsInList', 'createdDate'])
    },

    methods: {
      ...mapActions(['initList', 'changeList', 'addList']),
    },

    created() {
      this.initList()
    },

    directives: {
      focus: {
        inserted: function(el) {
          el.focus()
        }
      }
    }
  };
</script>

<style lang="scss">
  @import '../assets/variables.scss';

  .dropdown-info {
    min-width: 250px;
    display: flex;
    justify-content: space-between;
  }

  .tree {
    margin-right: 16px;
  }

  .nav-list {
    border-bottom: 1px solid $border;
    margin-bottom: 20px !important;
  }

  .nav-list a {
    margin: 0;
    padding: 0.5em 1em;
    color: $text;
  }

  .nav-list a:hover {
    color: $link;
  }
</style>
