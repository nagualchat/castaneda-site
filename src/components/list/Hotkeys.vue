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
          enter: ['enter'],
          rename: ['f2'],
          indent: ['tab'],
          unindent: ['shift', 'tab'],
          complete: ['-'],
          delete: ['del'],
          color_1: ['1'],
          color_2: ['2'],
          color_3: ['3'],
          color_0: ['0'],
        }
      }
    },

    computed: {
      ...mapState({
        openList: state => state.list.openList,
        flatTree: state => state.list.flatTree,
        selectedItem: state => state.list.selectedItem,
        addMode: state => state.list.addMode,
        editMode: state => state.list.editMode,
      }),
    },

    methods: {
      ...mapMutations(['SET_SELECTED_ITEM', 'TOGGLE_ADD_MODE', 'TOGGLE_EDIT_MODE', 'DELETE_ITEM', 'SET_EXPAND', 'TOGGLE_COMPLETE', 'SET_ITEM_COLOR']),
      ...mapActions(['initList', 'addDone', 'addCancel', 'editItem', 'editDone', 'editCancel', 'selectUp', 'selectDown', 'indentItem', 'unindentItem', 'removeItem']),

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
                this.SET_EXPAND({id: null, state: false });
              }
              break;
            }
          case 'expand':
            {
              if (!this.addMode && !this.editMode) {
                this.SET_EXPAND({id: null, state: true });
              }
              break;
            }
          case 'enter':
            {
              //if (!this.addMode)
              //   this.addDone(this.selectedItem)
              // } else if (!this.editMode) {
              this.TOGGLE_ADD_MODE(true);
              // } else {
              //   this.editDone(this.selectedItem)
              // }
              break;
            }
          case 'rename':
            {
              if (!this.editMode) {
                this.editItem(this.selectedItem);
              } else {
                this.TOGGLE_EDIT_MODE(false);
              }
              break;
            }

          case 'delete':
            {
              this.removeItem();
              this.selectDown();
              break;
            }
          case 'indent':
            {
              this.indentItem();
              break;
            }
          case 'unindent':
            {
              this.unindentItem();
              break;
            }
          case 'complete':
            {
              this.TOGGLE_COMPLETE();
              break;
            }
          case /color_/.test(event.srcKey) && event.srcKey:
            {
              var colorId = event.srcKey.match(/color_(.*)/i);
              this.SET_ITEM_COLOR(colorId[1]);
              break;
            }
        }
      }
    },

  }
</script>