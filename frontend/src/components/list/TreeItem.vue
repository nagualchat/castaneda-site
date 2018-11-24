<template>
  <li>
    <div class="media element" :class="toggleClass(item.id)" @mousedown="SET_SELECTED_ITEM(item.id)" @touchstart="SET_SELECTED_ITEM(item.id)">

      <div class="chevron" v-if="item.children && item.children.length > 0" @click="SET_EXPAND({id: item.id })">
        <b-icon :icon="item.expand ? 'menu-down' : 'menu-right'"></b-icon>
      </div>

      <div class="media-content">
        <input type="text" placeholder="Введите новое имя" v-if="renameMode && selectedItem == item.id" v-model="nameBuffer"
         v-focus @keyup.enter="renameDone()" @keyup.esc="renameCancel()" @blur="blur('rename')">

        <input type="text" placeholder="Введите текст примечания" v-else-if="editNoteMode && selectedItem == item.id" v-model="noteBuffer"
         v-focus @keyup.enter="editNoteDone()" @keyup.esc="editNoteCancel()" @blur="blur('note')">

        <div v-else class="drag-handle-desktop">
          <span class="element-name drag-handle-touch" :class="['item-color-' + item.color, item.complete ? 'item-complete' : '']"
           @dblclick.self="renameItem()">{{ item.name | truncate(25) }}</span>
          <span v-if="item.note" class="element-note drag-handle-touch" @dblclick.self="editNote()" >({{ item.note | truncate(25) }})</span>
        </div>
      </div>

      <div class="media-right" style="">
        <div v-if="renameMode && selectedItem == item.id">
          <a class="icon element-icon invert-link" @click="renameDone()">
            <b-icon custom-size="mdi-18px" icon="check"></b-icon>
          </a>
          <a class="icon element-icon invert-link" @click="renameCancel()">
            <b-icon custom-size="mdi-18px" icon="close"></b-icon>
          </a>
        </div>

        <div v-else-if="editNoteMode && selectedItem == item.id">
          <a class="icon element-icon invert-link" @click="editNoteDone()">
            <b-icon custom-size="mdi-18px" icon="check"></b-icon>
          </a>
          <a class="icon element-icon invert-link" @click="editNoteCancel()">
            <b-icon custom-size="mdi-18px" icon="close"></b-icon>
          </a>
        </div>

        <div v-else-if="selectedItem == item.id">
          <a class="icon element-icon invert-link" @click="TOGGLE_ADD_MODE(true)" title="Добавить новое">
            <b-icon custom-size="mdi-18px" icon="plus"></b-icon>
          </a>
          <tree-item-menu :item="item" />
          <a class="icon element-icon invert-link" v-show="item.link" @click="DELETE_ITEM(item.id)" title="Удалить ссылку">
            <b-icon custom-size="mdi-18px" icon="link-variant-off"></b-icon>
          </a>
        </div>

        <div v-else>
          <a class="icon-inactive" v-show="item.link" title="Это ссылка">
            <b-icon custom-size="mdi-18px" icon="link-variant"></b-icon>
          </a>
        </div>
      </div>
    </div>

    <div class="media element edit-style element-adding" v-if="addMode && selectedItem == item.id">
      <div class="media-content">
        <input type="text" placeholder="Введите имя для добавления" v-model="addName" v-focus
         @keyup.enter="addDone()" @keyup.esc="addCancel()" @blur="blur('add')">
      </div>

      <div class="media-right">
        <a class="icon element-icon invert-link" @click="addDone()">
          <b-icon custom-size="mdi-18px" icon="check"></b-icon>
        </a>
        <a class="icon element-icon invert-link" @click="addCancel()">
          <b-icon custom-size="mdi-18px" icon="close"></b-icon>
        </a>
      </div>
    </div>

    <slot/>
  </li>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex';
  import TreeItemMenu from '@/components/list/TreeItemMenu';

  export default {
    name: 'tree-item',
    props: ['item'],

    components: {
      TreeItemMenu
    },

    computed: {
      ...mapState({
        selectedItem: state => state.list.selectedItem,
        addMode: state => state.list.addMode,
        renameMode: state => state.list.renameMode,
        editNoteMode: state => state.list.editNoteMode
      }),

      addName: {
        get() {
          return this.$store.state.list.addName;
        },
        set(value) {
          this.$store.commit('SET_ADD_NAME', value)
        }
      },

      nameBuffer: {
        get() {
          return this.$store.state.list.nameBuffer;
        },
        set(value) {
          this.$store.commit('SET_NAME_BUFFER', value)
        }
      },

      noteBuffer: {
        get() {
          return this.$store.state.list.noteBuffer;
        },
        set(value) {
          this.$store.commit('SET_NOTE_BUFFER', value)
        }
      },
    },

    methods: {
      ...mapMutations(['SET_SELECTED_ITEM', 'TOGGLE_ADD_MODE', 'DELETE_ITEM', 'SET_EXPAND']),
      ...mapActions(['addDone', 'addCancel', 'renameItem', 'renameDone', 'renameCancel', 'editNote', 'editNoteDone', 'editNoteCancel']),

      blur: function(mode) {
        setTimeout(() => {
          if (mode == 'add') {
            this.addCancel();
          } else if (mode == 'rename') {
            this.renameCancel();
          } else {
            this.editNoteCancel();
          }
        }, 200)
      },

      toggleClass: function(id) {
        if (this.editNoteMode && this.selectedItem == id) {
          return 'edit-style';
        } else if (this.renameMode && this.selectedItem == id) {
          return 'edit-style';
        } else if (!this.renameMode && this.selectedItem == id)
          return 'select-style';
      }

    }
  }
</script>

<style lang="scss">
  @import '@/assets/variables.scss';
  /* Расцветка отмеченных элементов списка */

  .item-complete {
    text-decoration: line-through;
    text-decoration-color: $text;
  }

  .item-color-0 {
    color: $text;
  }

  .item-color-1 {
    color: $list-color-1;
  }

  .item-color-2 {
    color: $list-color-2;
  }

  .item-color-3 {
    color: $list-color-3;
  }

  /* * * * * * * * * * * * * * */
  .drop-zone {
    min-height: 4px;
    //border: 1px dashed $tree-border-active !important;
  }

  #tree ul,
  #tree li {
    list-style: none;
    padding-left: 10px;
  }

  #tree li:first-child {
    margin-top: 4px;
  }

  .chevron {
    float: left;
    width: 0px;
    position: relative;
    left: -32px;
    top: 1px;
    cursor: pointer;
  }

  .element.media + .element.media {
    margin-top: 0rem;
    padding-top: 0rem;
  }

  .element {
    min-height: 2.6rem;
    padding: 4px 2px 4px 8px;
    font-size: $size-7;
    cursor: default;
    justify-content: center;
    align-items: center;
    @include desktop {
      min-height: 2.2rem;
    }
  }

  .element-name {
    vertical-align: middle;
    @include desktop {
      vertical-align: top;
    }
  }

  .element-note {
    margin-left: 1em;
    font-size: 0.8rem;
    color: $grey-dark;
    vertical-align: baseline;
    @include touch {
      display: block;
      margin-left: 0em;
      vertical-align: bottom;
    }
  }

  .element-icon {
    vertical-align: middle;
  }

  .element input {
    height: 20px;
    width: 100%;
    border: none;
    font-size: $size-8;
    color: $text;
    background-color: $white;
  }

  .element input:focus {
    outline: none;
  }

  .element-adding {
    padding-bottom: 0px;
    margin: 4px 0 !important;
  }

  .select-style {
    background-color: $background;
  }

  .edit-style {
    border: 1px dashed $tree-border-active !important;
  }

  .icon-inactive {
    cursor: default;
    color: $tree-icon;
  }
</style>