<template>
  <ul>
    <draggable class="drop" :list="list" :options="{ animation: 150, group: 'node', forceFallback: false }">
      <li v-for="(item, index) in list" :key="item.id" :class="{ collapsed: item.collapsed == true }">

        <div class="chevron" v-if="item.node && item.node.length > 0">
          <span @click="toggle(index)"><b-icon :icon="item.collapsed ? 'menu-right' : 'menu-down'"></b-icon></span>
        </div>

        <div class="element" :class="{ selected: selectedId === item.id }" @click="setSelectedId(item.id)" @dblclick="setRenamingId(item.id)" v-shortkey.native="shortcuts" @shortkey="keyPress">
          <input class="rename" type="text" v-if="item.id == renamingId" v-model="item.name" v-focus @keyup.enter="doneRename(item)" @keyup.esc="doneRename(item)" @blur="doneRename(item)">

          <span class="element-name" v-if="item.id != renamingId" v-shortkey="['enter']" @shortkey="enter()">{{ item.name }}</span>

          <span class="element-menu" v-if="selectedId === item.id && item.id != renamingId">
                <span @click="setAddPosition(item.id)" title="Добавить новое"><i class="icon-active mdi mdi-18px mdi-plus"></i></span>
          <span v-show="!item.link" @click="addLink(item, index)" title="Создать ссылку"><i class="icon-active mdi mdi-18px mdi-link"></i></span>
          <span v-show="!item.link" @click="setRenamingId(item.id)" title="Переименовать"><i class="icon-active mdi mdi-18px mdi-pencil"></i></span>
          <span v-show="!item.link" @click="removeItem(item)" title="Удалить"><i class="icon-active mdi mdi-18px mdi-delete"></i></span>
          <span v-show="item.link" @click="removeItem(item)" title="Удалить ссылку"><i class="icon-active mdi mdi-18px mdi-link-variant-off"></i></span>
          </span>

          <span class="element-menu" v-else-if="selectedId === item.id">
                <span @click="doneRename(item)"><i class="icon-active mdi mdi-18px mdi-check"></i></span>
          <span @click="cancelRename(item)"><i class="icon-active mdi mdi-18px mdi-close"></i></span>
          </span>

          <span class="element-menu" v-else>
                <span v-show="item.link"><i class="icon-inactive mdi mdi-18px mdi-link-variant"></i></span>
          </span>
        </div>

        <div class="element add-new" v-if="selectedId === item.id && addPosition === item.id">
          <input class="add" placeholder="Добавить в список" v-model="addingName" v-focus @keyup.enter="doneAdd(item, index)" @keyup.esc="doneAdd(item, index)" @blur="doneAdd(item, index)">
          <span class="element-menu">
                <span @click="doneAdd(item, index)"><i class="icon-active mdi mdi-18px mdi-check"></i></span>
          <span @click="doneAdd(item, index)"><i class="icon-active mdi mdi-18px mdi-close"></i></span>
          </span>
        </div>

        <tree v-if="!item.collapsed" :list="item.node" />

      </li>
    </draggable>
  </ul>
</template>

<script>
  import Draggable from "vuedraggable";
  import { mapState, mapMutations, mapActions } from 'vuex'
  import { uuid } from "vue-uuid";

  export default {
    name: "tree",
    props: ["list", "keys"],

    components: {
      Draggable
    },

    data() {
      return {
        renameName: null,
        addingName: null,

        shortcuts: {
          up: ['arrowup'],
          down: ['arrowdown'],
          enter: ['enter'],
          rename: ['f2'],
          delete: ['del']
        }
      }
    },

    watch: {
      list: {
        handler: function() {
          this.saveList()
        },
        deep: true
      }
    },

    computed: {
      ...mapState(["listMap", "selectedId", "renamingId", "addPosition"]),
    },

    methods: {
      ...mapMutations(["setSelectedId", "setRenamingId", "setAddPosition"]),
      ...mapActions(["saveList"]),

      keyPress: function(event) {
        switch (event.srcKey) {
          case 'up':
            {
              this.setRenamingId(null)
              let index = this.listMap.indexOf(this.selectedId)
              if (index > 0) {
                this.setSelectedId(this.listMap[index - 1])
              }
              break
            }
          case 'down':
            {
              this.setRenamingId(null)
              let index = this.listMap.indexOf(this.selectedId)
              let len = this.listMap.length
              if (index < len - 1) {
                this.setSelectedId(this.listMap[index + 1])
              }
              break
            }
          case 'rename':
            {
              if (!this.renamingId) {
                this.setRenamingId(this.selectedId)
              } else {
                this.setRenamingId(null)
              }
              break
            }
          case 'enter':
            {

              if (this.renamingId) {
                this.setAddPosition(null)
                console.log(this.renamingId)
              } else {
                this.setAddPosition(this.selectedId)
              }
              break
            }
        }
      },

      enter() {
        this.setAddPosition(this.selectedId)
      },

      toggle(index) {
        this.list[index].collapsed = !this.list[index].collapsed
      },

      // Функция для поиска корневого компонента (чтобы получить доступ к его data)
      findRoot() {
        var ok = false
        var that = this
        while (!ok) {
          if (!/draggable/.test(that.$parent.$vnode.tag) || that.$parent.data) {
            ok = true
            break
          }
          that = that.$parent
        }
        return that
      },

      // Функция рекурсивного поиска по массиву
      findItemID: function(array, id) {
        for (var item of array) {
          if (item.id === id) return item
          var result = this.findItemID(item.node, id)
          if (result) return result
        }
      },

      // Промежуточная функция для удаления ссылок
      removeLinks: function(array, id) {
        var len = array.length
        while (len--) {
          if (array[len].link === id) {
            array.splice(len, 1);
            //console.log(array[len])
          } else {
            this.removeLinks(array[len].node, id);
          }
        }
        return array;
      },

      showName: function(item) {
        if (item.link) {
          var found = this.findItemID(this.findRoot().list, item.link)
          return found.name
        } else {
          return item.name
        }
      },

      removeItem: function(item) {
        this.removeLinks(this.findRoot().list, item.id)
        this.list.splice(this.list.indexOf(item), 1)
      },

      addLink: function(item, index) {
        this.list.splice(index + 1, 0, {
          id: uuid.v4(),
          name: "link",
          link: item.id,
          collapsed: false,
          node: []
        });
      },

      doneAdd: function(item, index) {
        if (!this.addingName) {
          this.setAddPosition(null)
          return
        }
        var name = this.addingName.trim();
        this.list.splice(index + 1, 0, {
          id: uuid.v4(),
          name: name,
          collapsed: false,
          node: []
        });
        this.setAddPosition(null)
        this.addingName = null
      },

      doneRename: function(item) {
        item.name = item.name.trim()
        if (!item.name) {
          this.removeItem(item)
        }
        this.setRenamingId(null)
      }
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

<style lang="scss" scoped>
  @import '../assets/variables.scss';

  /* .sortable-ghost - освободившееся и выбранное место
     .sortable-drag - перетаскиваеваемый (приподнятый) элемент */

  .sortable-ghost {
    opacity: 0;
  }

  .sortable-drag {
    opacity: 1;
  }


  /* Основа дерева */

  ul,
  li {
    list-style: none;
    padding-left: 10px;
    font-size: 0.9rem;
  }

  ul li:first-child {
    margin-top: 5px;
  }

  .drop {
    min-height: 5px;
  }


  /***/

  .icon-inactive {
    color: $tree-icon;
  }

  .icon-active {
    color: $tree-icon;
    cursor: pointer;
  }

  .icon-active:hover {
    color: $tree-icon-hover;
  }

  .element {
    padding: 8px 10px;
  }

  .element-menu {
    float: right;
    line-height: 1.2;
  }

  .collapsed {
    margin-bottom: 8px;
  }

  .chevron {
    color: $tree-icon;
    float: left;
    width: 0px;
    position: relative;
    left: -25px;
    top: 7px;
    cursor: pointer;
  }

  div.element input {
    height: 20px;
    border: none;
    font-size: 0.9rem;
  }

  div.element input:focus {
    outline: none;
  }

  .selected {
    background-color: $white-ter;
  }

  .add-new {
    border: 1px dashed $tree-border-active;
    margin-top: 8px;
    cursor: default;
  }
</style>
