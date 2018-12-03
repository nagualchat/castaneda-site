<template>
  <div id="list">
    <hotkeys>
      <div class="columns is-centered">
        <div class="column is-9-tablet is-8-desktop is-7-widescreen is-6-fullhd">

          <b-notification class="notify" :active.sync="isShowStartNotify" @close="$store.commit('SET_START_NOTIFY', false)">
            <p>О технике перепросмотра и о том, как пользоваться этим приложением можно прочитать в <router-link to="/list-info">разделе справки</router-link>.</p>
          </b-notification>

          <nav class="level tree-header is-mobile">
            <div class="level-left">
              <div class="level-item">
                <a class="invert-link" @click="isListsMenu = !isListsMenu">
                  <span>{{ openList.title }}</span>
                </a>
              </div>
            </div>

            <div class="level-right">
              <b-dropdown>
                <a class="level-item invert-link" slot="trigger">
                  <span>{{ totalItems }}</span>
                </a>
                <b-dropdown-item custom>
                  <div class="level is-mobile list-stat">
                    <div class="level-left">
                      <b-icon class="level-item" custom-size="mdi-18px" icon="calendar-clock"></b-icon>
                      <span class="level-item">Список создан</span>
                    </div>
                    <div class="level-right level-item">{{ createdDate }}</div>
                  </div>
                </b-dropdown-item>
                <b-dropdown-item v-if="completeItems" custom>
                  <div class="level is-mobile list-stat">
                    <div class="level-left">
                      <b-icon class="level-item" custom-size="mdi-18px" icon="checkbox-marked-outline"></b-icon>
                      <span class="level-item">Отмечены как выполненные</span>
                    </div>
                    <div class="level-right level-item">{{ completeItems }}</div>
                  </div>
                </b-dropdown-item>
              </b-dropdown>

              <div class="level-item">
                <router-link class="icon invert-link is-borderless" to="/list-info">
                  <b-icon icon="help-circle-outline"></b-icon>
                </router-link>
              </div>

            </div>
          </nav>

          <b-modal :active.sync="isListsMenu" :canCancel="['escape', 'outside']" has-modal-card>
            <lists-modal />
          </b-modal>

          <tree v-if="openList.tree[0]" id="tree" :treeData="openList.tree" />
          <empty-tree-adding v-if="flatTree && !openList.tree[0]" />

          <debug-panel @clear="сlearStorage()" v-if="isDebug" />

        </div>
      </div>
    </hotkeys>
  </div>
</template>

<script>
  import Tree from '@/components/list/Tree';
  import Hotkeys from '@/components/list/Hotkeys';
  import DebugPanel from '@/components/list/DebugPanel';
  import ListsModal from '@/components/list/ListsModal';
  import EmptyTreeAdding from '@/components/list/EmptyTreeAdding';

  import { mapState, mapActions, mapGetters } from 'vuex';

  export default {
    name: 'MainPage',

    metaInfo: {
      title: 'Список перепросмотра',
      meta: [
        { vmid: 'description', name: 'description', content: 'Приложение, призванное облегчить задачу составления списка перепросмотра.' }
      ]
    },

    components: {
      Tree,
      EmptyTreeAdding,
      Hotkeys,
      DebugPanel,
      ListsModal
    },

    data() {
      return {
        isListsMenu: false,
        isSearch: false,
      }
    },

    computed: {
      ...mapState({
        openList: state => state.list.openList,
        flatTree: state => state.list.flatTree,
        isDebug: state => state.list.isDebug,
        isShowStartNotify: state => state.list.isShowStartNotify,
        isShowUndoSnack: state => state.list.isShowUndoSnack,
      }),
      ...mapGetters(['totalItems', 'completeItems', 'createdDate'])
    },

    created() {
      this.$store.dispatch('initList')
    },

    watch: {
      isShowUndoSnack: {
        handler: function() {
          this.showSnackbar();
        }
      }
    },

    methods: {
      ...mapActions(['undoRemove']),

      showSnackbar() {
        this.$snackbar.open({
          duration: 10000,
          message: `Элемент удалён`,
          type: 'is-danger',
          position: 'is-bottom-right',
          actionText: 'ОТМЕНА',
          queue: true,
          onAction: () => {
            this.undoRemove();
          }
        })
      }
    }
  };
</script>

<style lang="scss">
  @import '@/assets/variables.scss';
  #tree {
    padding-left: 0.6em;
  }

  .notify {
    font-size: $size-7;
    color: $text;
    border: 1px solid $dark;
    background-color: $white !important;
  }

  .tree-header {
    border-bottom: 1px solid $border;
    margin-bottom: 20px !important;
  }

  .tree-header a {
    margin: 0;
    padding: 0.5em 1em;
  }

  .list-stat {
    @include desktop {
      width: 300px;
    }
  }

  .list-stat > div > .icon {
    margin-right: 3px !important;
  }

</style>