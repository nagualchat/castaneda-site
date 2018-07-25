<template>
  <div v-shortkey.native="shortcuts" @shortkey="keyPress">
    <slot/>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex';

  export default {
    name: 'hotkeys',

    data() {
      return {
        shortcuts: {
          up: ['arrowup'],
          down: ['arrowdown'],

          collapse: ['arrowleft'],
          expand: ['arrowright'],

          indent: ['tab'],
          unindent: ['shift', 'tab'],
          indent_alt: ['ctrl', 'arrowright'],
          unindent_alt: ['ctrl', 'arrowleft'],

          enter: ['enter'],
          delete: ['shift', 'del'],
          rename: ['f2'],
          note: ['='],
          complete: ['-'],

          color_1: ['1'],
          color_2: ['2'],
          color_3: ['3'],
          color_4: ['4'],
          color_0: ['0'],

          tree_debug: ['shift', 'd'],
        }
      }
    },

    computed: {
      ...mapState({
        openList: state => state.list.openList,
        flatTree: state => state.list.flatTree,
        selectedItem: state => state.list.selectedItem,
        addMode: state => state.list.addMode,
        renameMode: state => state.list.renameMode,
      }),
    },

    methods: {
      ...mapMutations(['SET_SELECTED_ITEM', 'TOGGLE_ADD_MODE', 'TOGGLE_EDIT_MODE', 'DELETE_ITEM', 'SET_EXPAND', 'TOGGLE_COMPLETE', 'SET_ITEM_COLOR', 'SET_DEBUG_MODE']),
      ...mapActions(['initList', 'addDone', 'addCancel', 'renameItem', 'renameDone', 'renameCancel', 'editNote', 'selectUp', 'selectDown', 'indentItem', 'unindentItem', 'removeItem']),

      keyPress: function(event) {
        switch (event.srcKey) {
          case 'up':
            {
              this.selectUp();
              break;
            }
          case 'down':
            {
              this.selectDown();
              break;
            }
          case 'collapse':
            {
              if (!this.addMode && !this.editMode) {
                this.SET_EXPAND({ id: null, state: false });
              }
              break;
            }
          case 'expand':
            {
              if (!this.addMode && !this.editMode) {
                this.SET_EXPAND({ id: null, state: true });
              }
              break;
            }
          case 'enter':
            {
              this.TOGGLE_ADD_MODE(true);
              break;
            }
          case 'rename':
            {
              if (!this.editMode) {
                this.renameItem(this.selectedItem);
              } else {
                this.TOGGLE_EDIT_MODE(false);
              }
              break;
            }

          case 'delete':
            {
              this.removeItem();
              break;
            }
          case 'indent':
          case 'indent_alt':
            {
              this.indentItem();
              break;
            }
          case 'unindent':
          case 'unindent_alt':
            {
              this.unindentItem();
              break;
            }
          case 'complete':
            {
              this.TOGGLE_COMPLETE();
              break;
            }
          case 'note':
            {
              this.editNote(this.selectedItem);
              break;
            }
          case /color_/.test(event.srcKey) && event.srcKey:
            {
              var colorId = event.srcKey.match(/color_(.*)/i);
              if (colorId[1] == 4) colorId[1] = 0;
              this.SET_ITEM_COLOR(colorId[1]);
              break;
            }
          case 'tree_debug':
            {
              this.SET_DEBUG_MODE();
              break;
            }
        }
      }
    },

  }
</script>