<template>
  <ul>
    <draggable class="drop" :list="list" :options="{ animation: 150, group: 'node', forceFallback: false }">
        <li v-for="(item, index) in list" :key="item.id" :class="{ collapsed: item.collapsed == true }">

          <div class="chevron" v-if="item.node && item.node.length > 0">
            <span @click="toggle(index)"><b-icon :icon="[ item.collapsed ? 'menu-right' : 'menu-down' ]"></b-icon></span>
          </div>

          <div class ="element" :class="{ selected: selectItemId === item.id }"
           @click="selectItem(item)" @dblclick="editName(item)">
            <input class="rename" type="text" v-if="item.id === renameItemId"
             v-focus @keyup.enter="doneEditName(item)" @keyup.esc="cancelEditName(item)"
             @blur="doneEditName(item)" v-model="item.name">

            <span class="element-name" v-if="item.id != renameItemId">{{ showName(item) }}</span>
            <span class="element-menu" v-if="selectItemId === item.id && item.id != renameItemId">
              <span @click="addItemId = item.id" title="Добавить новое"><i class="icon-active mdi mdi-18px mdi-plus"></i></span>
              <span v-show="!item.link" @click="addLink(item, index)" title="Создать ссылку"><i class="icon-active mdi mdi-18px mdi-link"></i></span>
              <span v-show="!item.link" @click="editName(item)" title="Переименовать"><i class="icon-active mdi mdi-18px mdi-pencil"></i></span>
              <span v-show="!item.link" @click="removeItem(item)" title="Удалить"><i class="icon-active mdi mdi-18px mdi-delete"></i></span>
              <span v-show="item.link" @click="removeItem(item)" title="Удалить ссылку"><i class="icon-active mdi mdi-18px mdi-link-variant-off"></i></span>
            </span>
            <span class="element-menu" v-else-if="selectItemId === item.id">
              <span @click="doneEditName(item)"><i class="icon-active mdi mdi-18px mdi-check"></i></span>
              <span @click="cancelEditName(item)"><i class="icon-active mdi mdi-18px mdi-close"></i></span>
            </span>
            <span class="element-menu" v-else>
              <span v-show="item.link"><i class="icon-inactive mdi mdi-18px mdi-link-variant"></i></span>
            </span>
          </div>

          <div class="element add-new" v-if="selectItemId === item.id && addItemId === item.id">
            <input class="rename" placeholder="Добавить в список" v-model="addItemName"
             v-focus @keyup.esc="cancelAddItem(item)"
             @keyup.enter="doneAddItem(item, index)"
             @blur="doneAddItem(item)">
            <span class="element-menu">
              <span @click="doneAddItem(item, index)"><i class="icon-active mdi mdi-18px mdi-check"></i></span>
              <span @click="cancelAddItem(item)"><i class="icon-active mdi mdi-18px mdi-close"></i></span>
            </span>
          </div>

          <tree v-if="!item.collapsed" :list="item.node"/>

        </li>
    </draggable>
  </ul>
</template>

<script>
import Draggable from "vuedraggable";
import { uuid } from "vue-uuid";

export default {
  name: "tree",
  props: ["list"],

  components: {
    Draggable
  },

  data() {
    return {
      addItemId: null,
      addItemName: null,
      renameItemId: null,
      beforeEditCache: null,
      selectItemId: null
    };
  },

  watch: {
    list: {
      handler: function () {
        this.findRoot().$emit("charge");
      },
      deep: true
    }
  },

  methods: {
    // Функция для поиска корневого компонента (чтобы получить доступ к его data)
    findRoot() {
      var ok = false;
      var that = this;
      while (!ok) {
        if (!/draggable/.test(that.$parent.$vnode.tag) || that.$parent.data) {
          ok = true;
          break;
        }
        that = that.$parent;
      }
      return that;
    },

    // Функция рекурсивного поиска по массиву
    findItemID: function(array, id) {
      for (var item of array) {
        if (item.id === id) return item;
        var result = this.findItemID(item.node, id);
        if (result) return result;
      }
    },

    removeLinks: function(array, id) {
      var len = array.length;
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

    toggle(index) {
      this.list[index].collapsed = !this.list[index].collapsed;
    },

    showName: function(item) {
      if (item.link) {
        var found = this.findItemID(this.findRoot().list, item.link);
        return found.name;
      } else {
        return item.name;
      }
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

    removeItem: function(item) {
      this.removeLinks(this.findRoot().list, item.id);
      this.list.splice(this.list.indexOf(item), 1);
    },

    doneAddItem: function(item, index) {
      if (!this.addItemName) {
        this.addItemId = null;
        return;
      }
      var name = this.addItemName.trim();
      this.list.splice(index + 1, 0, {
        id: uuid.v4(),
        name: name,
        collapsed: false,
        node: []
      });
      this.addItemId = null;
      this.addItemName = null;
    },

    cancelAddItem: function(item) {
      this.addItemId = null;
      this.addItemName = null;
    },

    // Вывод данных о выделенном элементе за пределы компонента (чтобы работало внутри вложенных)
    selectItem: function(item) {
      this.$root.$emit("select", item.id);
    },

    editName: function(item) {
      this.beforeEditCache = item.name;
      this.renameItemId = item.id;
    },

    doneEditName: function(item) {
      this.renameItemId = null;
      item.name = item.name.trim();
      if (!item.name) {
        this.removeItem(item);
      }
    },

    cancelEditName: function(item) {
      this.renameItemId = null;
      item.name = this.beforeEditCache;
    }
  },

  mounted() {
    //Помещение данных о выделенном элементе в локальную переменную
    var vm = this;

    this.$root.$on("select", function(itemId) {
      vm.selectItemId = itemId;
    });
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

ul, li {
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
