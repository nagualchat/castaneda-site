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
          left: ['arrowleft'],
          right: ['arrowright'],
          enter: ['enter'],
          rename: ['f2'],
          tab: ['tab'],
          delete: ['del']
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
      ...mapMutations(['SET_SELECTED_ITEM', 'TOGGLE_ADD_MODE', 'TOGGLE_EDIT_MODE', 'DELETE_ITEM', 'TOGGLE_EXPAND', 'SET_EXPAND']),
      ...mapActions(['initList', 'addDone', 'addCancel', 'editItem', 'editDone', 'editCancel', 'selectUp', 'selectDown', 'removeItem']),

      keyPress: function(event) {
        switch (event.srcKey) {
          case 'up': // Выделение вверх
            {
              this.selectUp();
              break;
            }
          case 'down': // Выделение вниз
            {
              this.selectDown();
              break;
            }
          case 'left': // Левая стрелка сворачивает ветвь
            {
              if (!this.addMode && !this.editMode) {
                this.SET_EXPAND(false);
              }
              break;
            }
          case 'right': // Правая стрелка разворачивает
            {
              if (!this.addMode && !this.editMode) {
                this.SET_EXPAND(true);
              }
              break;
            }
          case 'enter': // Enter запускает добавление нового элемента
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
          case 'rename': // F2 запускает или отменяет переименование
            {
              if (!this.editMode) {
                this.editItem(this.selectedItem);
              } else {
                this.TOGGLE_EDIT_MODE(false);
              }
              break;
            }
          case 'delete': // Удаление выделенного
            {
              this.removeItem();
              this.selectDown();
              break;
            }
          case 'tab':
            {
              this.selectDown();
              break;
            }
        }
      }
    },

  }
</script>