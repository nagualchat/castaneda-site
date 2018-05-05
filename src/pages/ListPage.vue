<template>
  <div id="list">
    <hotkeys>
      <div class="columns is-centered">
        <div class="column is-9-tablet is-8-desktop is-7-widescreen is-6-fullhd">

          <b-notification class="notify" :active.sync="isShowStartNotify" @close="$store.commit('SET_START_NOTIFY', false)">
            <p>На данный момент приложение хоть и более-менее работает, но оно всё ещё очень сырое, поэтому не рекомендуется его использовать для чего-то кроме тестирования.</p>
            <!-- <p>О технике перепросмотра и о том, как пользоваться этим приложением можно прочитать в <router-link to="/list-info">разделе справки</router-link>.</p> -->
          </b-notification>

          <nav class="level tree-header is-mobile">
            <div class="level-left">
              <div class="level-item">
                <a class="invert-link" @click="isListsMenu = !isListsMenu">
                  <span>{{ openList.name }}</span>
                </a>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <b-dropdown>
                  <a class="invert-link" slot="trigger">
                    <span>{{ itemsInList }}</span>
                  </a>
                  <b-dropdown-item custom>

                    <div class="level is-mobile list-stat">
                      <div class="level-item">Создан</div>
                      <div class="level-item">{{ createdDate }}</div>
                    </div>

                  </b-dropdown-item>
                </b-dropdown>
              </div>

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

          <tree :treeData="openList.tree" />
          <debug-panel @clear="сlearStorage()" v-show="isDebug" />

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
        isDebug: state => state.list.isDebug,
        isShowStartNotify: state => state.list.isShowStartNotify,
        isShowDeleteSnack: state => state.list.isShowDeleteSnack,
      }),
      ...mapGetters(['itemsInList', 'createdDate'])
    },

    created() {
      this.$store.dispatch('initList')
    },

    watch: {
      isShowDeleteSnack: {
        handler: function() {
          this.deleteSnackbar();
        }
      }
    },

    methods: {
      deleteSnackbar() {
        this.$snackbar.open({
          duration: 20000,
          message: 'Элемент удалён',
          type: 'is-danger',
          position: 'is-bottom-right',
          actionText: 'ОТМЕНА',
          queue: false,
          onAction: () => {
            console.log('ON')
          }
        })
      }
    },

    directives: {
      focus: {
        inserted: function(el) {
          el.focus();
        }
      }
    }
  };
</script>

<style lang="scss">
  @import '@/assets/variables.scss';
  .notify {
    font-size: 0.9em;
    color: desaturate(darken($primary, colorLuminance($primary) * 70%), colorLuminance($primary) * 30%);
    border: 1px solid $primary;
    background-color: lighten($primary, max((100% - lightness($primary)) - 2%, 0%)) !important;
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
</style>