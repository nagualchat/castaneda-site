<template>
  <li>
    <div class="chevron" v-if="item.children && item.children.length > 0">
      <span @click="TOGGLE_EXPAND(item.id)">
        <b-icon :icon="item.expand ? 'menu-down' : 'menu-right'"></b-icon>
      </span>
    </div>

    <div class="element" :class="{ 'element-selected': selectedItem == item.id }" @click="SET_SELECTED_ITEM(item.id)" @dblclick="editItem(item.id)">

      <input type="text" v-if="editMode && selectedItem == item.id" v-model="editName" v-shortkey.avoid v-focus @keyup.enter="editDone()" @keyup.esc="editCancel()" @blur="editCancel()">

      <span v-else>{{ showName(item.id) }}</span>

      <span class="element-menu" v-if="editMode && selectedItem == item.id">
        <span @click="doneRename(item)">
          <i class="icon-active mdi mdi-18px mdi-check"></i>
        </span>
        <span @click="cancelRename(item)">
          <i class="icon-active mdi mdi-18px mdi-close"></i>
        </span>
      </span>

      <div class="element-menu" v-else-if="selectedItem == item.id">
        <span @click="TOGGLE_ADD_MODE(true)" title="Добавить новое">
          <i class="icon-active mdi mdi-18px mdi-plus"></i>
        </span>
        <span v-show="!item.link" @click="createLink(item.id)" title="Создать ссылку">
          <i class="icon-active mdi mdi-18px mdi-link"></i>
        </span>
        <span v-show="!item.link" @click="editItem(item.id)" title="Переименовать">
          <i class="icon-active mdi mdi-18px mdi-pencil"></i>
        </span>
        <span v-show="!item.link" @click="DELETE_ITEM(item.id)" title="Удалить">
          <i class="icon-active mdi mdi-18px mdi-delete"></i>
        </span>
        <span v-show="item.link" @click="DELETE_ITEM(item.id)" title="Удалить ссылку">
          <i class="icon-active mdi mdi-18px mdi-link-variant-off"></i>
        </span>
      </div>

      <span class="element-menu" v-else>
        <span v-show="item.link">
          <i class="icon-inactive mdi mdi-18px mdi-link-variant"></i>
        </span>
      </span>
    </div>

    <div class="element element-add" v-if="addMode && selectedItem == item.id">
      <input placeholder="Добавить в список" v-model="addName" v-shortkey.avoid v-focus @keyup.enter="addDone()" @keyup.esc="addCancel()"
        @blur="addCancel()">
      <div class="element-menu">
        <span @click="addDone(item.id)">
          <i class="icon-active mdi mdi-18px mdi-check"></i>
        </span>
        <span @click="addCancel()">
          <i class="icon-active mdi mdi-18px mdi-close"></i>
        </span>
      </div>
    </div>

    <slot/>

  </li>
</template>

<script>
  import { mapState, mapMutations, mapActions } from "vuex"

  export default {
    name: "tree-item",
    props: ["item"],

    computed: {
      ...mapState({
        flatTree: state => state.list.flatTree,
        selectedItem: state => state.list.selectedItem,
        addMode: state => state.list.addMode,
        editMode: state => state.list.editMode,
      }),

      addName: {
        get() {
          return this.$store.state.list.addName;
        },
        set(value) {
          this.$store.commit("SET_ADD_NAME", value)
        }
      },

      editName: {
        get() {
          return this.$store.state.list.editName;
        },
        set(value) {
          this.$store.commit("SET_EDIT_NAME", value)
        }
      },
    },

    methods: {
      ...mapMutations(["SET_SELECTED_ITEM", "TOGGLE_ADD_MODE", "TOGGLE_EDIT_MODE", "DELETE_ITEM", "TOGGLE_EXPAND"]),
      ...mapActions(["createLink", "addDone", "addCancel", "editItem", "editDone", "editCancel"]),

      showName: function(id) {
        return this.flatTree.find(x => x.id === id).name;
      }
    }
  }
</script>