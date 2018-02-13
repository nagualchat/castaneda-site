<template>
  <ul>
    <draggable class="drop" :list="list" :options="{animation: 150, group: 'node', forceFallback: false}">
        <li v-for="(item, index) in list" :key="item.id">
      
          <div class ="element" :class="{'selected':selectItemId === item.id}" 
           @click="selectItem(item)" @dblclick="editName(item)">
            <input class="rename" type="text" v-if="item.id === renameItemId" 
             v-focus @keyup.enter="doneEditName(item)" @keyup.esc="cancelEditName(item)"
             @blur="doneEditName(item)" v-model="item.name">
              <span class="name" v-if="item.id !== renameItemId">{{item.name}}</span>
              <span class="element-menu" v-show="selectItemId === item.id">
                <span @click="addItemId = item.id"><i class="material-icons">add</i></span>
                <span @click="editName(item)"><i class="material-icons">edit</i></span>
                <span @click="removeItem(item)"><i class="material-icons">delete</i></span>
              </span>
            </div>

            <div class="element add-new" v-if="selectItemId === item.id && addItemId === item.id" @blur="cancelAddItem(item)">
              <input class="rename" placeholder="Добавить в список" v-model="addItemName" 
               v-focus @keyup.esc="cancelAddItem(item)" 
               @keyup.enter="doneAddItem(item, index)">
              <span class="element-menu">
                <span @click="doneAddItem(item, index)"><i class="material-icons">done</i></span>
                <span @click="cancelAddItem(item)"><i class="material-icons">cancel</i></span>
              </span>
            </div>

            <tree :list="item.node"/>

        </li>
    </draggable>
  </ul>
  
</template>

<script>
import { uuid } from 'vue-uuid'
import Draggable from "vuedraggable";

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
      selectItemId: null
    };
  },

  methods: {

    doneAddItem: function(item, index) {
      if (!this.addItemName) {
        this.addItemId = null
        return
      }
      var name = this.addItemName.trim()
      this.list.splice(index+1, 0, {id: uuid.v4(), name: name, node: []});
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
      // Обрезает пробелы в начале и конце строки
      item.name = item.name.trim();
      if (!item.name) {
        this.removeItem(item);
      }
    },

    cancelEditName: function(item) {
      this.renameItemId = null;
      item.name = this.beforeEditCache;
    },

    removeItem: function(item) {
      this.list.splice(this.list.indexOf(item), 1);
    }
  },

  mounted() {

    //Помещение данных о выделенном элементе в локальную переменную
    var vm = this;

    this.$root.$on("select", function(itemId) {
      vm.selectItemId = itemId;
    })
    
  },

  directives: {
    // Сразу переключает фокус на только что вставленное в DOM поле ввода
    focus: {
      inserted: function(el) {
        el.focus();
      }
    }
  }
};
</script>

<style scoped>
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
    font-size: 14px;
    padding-left: 10px;
  }

  ul li:first-child {
    padding-top: 8px;
  }

  ul li:first-child {
    padding-top: 8px;
  }

  .drop {
    min-height: 8px;
    border: 0px dotted grey;
  }

  /***/

  .material-icons {
    font-size: 20px;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.6);
  }

  .material-icons:hover {
    color: rgba(0, 0, 0, 0.9);
  }

  .element {
    padding: 8px 10px;
    border: 1px solid rgba(0, 51, 0, 0.15);
    border-radius: 2px;
    cursor: pointer;
  }

  div.element input {
    height: 20px;
  }

  div.element input:focus {
    outline: none;
  }

  .element-menu {
    float: right;
  }

  .selected {
    border: 1px solid  rgba(0, 0, 0, 0.4);

  }

  .add-new {
    border: 1px dashed rgba(0, 0, 0, 0.4);
    margin-top: 8px;
    cursor: default;
  }

</style>
