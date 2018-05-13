<template>
  <li>
    <div class="icon-active chevron" v-if="item.children && item.children.length > 0">
      <span @click="SET_EXPAND({id: item.id })">
        <b-icon :icon="item.expand ? 'menu-down' : 'menu-right'"></b-icon>
      </span>
    </div>

    <div class="element" :class="[editMode && selectedItem == item.id ? 'element-selected-2' : '', !editMode && selectedItem == item.id ? 'element-selected-1' : '']" @mousedown="SET_SELECTED_ITEM(item.id)" @touchstart="SET_SELECTED_ITEM(item.id)" @dblclick="editItem(item.id)">

      <input type="text" v-if="editMode && selectedItem == item.id" v-model="editName" v-shortkey.avoid v-focus @keyup.enter="editDone()" @keyup.esc="editCancel()" @blur="editCancel()">

      <span v-else :class="['item-color-' + item.color, item.complete ? 'item-complete' : '']">{{ item.name }}</span>

      <span class="element-menu" v-if="editMode && selectedItem == item.id">
        <span @click="doneRename(item)">
          <i class="icon-active mdi mdi-18px mdi-check"></i>
        </span>
        <span @click="cancelRename(item)">
          <i class="icon-active mdi mdi-18px mdi-close"></i>
        </span>
      </span>

      <div class="element-menu" v-else-if="selectedItem == item.id">

        <a class="icon icon-active" @click="TOGGLE_ADD_MODE(true)" title="Добавить новое">
          <i class="mdi mdi-18px mdi-plus is-hidden-touch"></i>
          <i class="mdi mdi-24px mdi-plus is-hidden-desktop"></i>
        </a>

        <b-dropdown ref="listdropdown" v-show="!item.link">
          <a class="icon icon-active" slot="trigger" title="Меню" v-show="!item.link">
            <i class="mdi mdi-18px mdi-dots-vertical is-hidden-touch"></i>
            <i class="mdi mdi-24px mdi-dots-vertical is-hidden-desktop"></i>
          </a>
          <b-dropdown-item custom >
            <div class="level is-mobile"  @click="$refs.listdropdown.toggle()">
              <button class="level-item button is-small is-danger" @click="SET_ITEM_COLOR('1')">1</button>
              <button class="level-item button is-small is-success" @click="SET_ITEM_COLOR('2')">2</button>
              <button class="level-item button is-small is-info" @click="SET_ITEM_COLOR('3')">3</button>
              <button class="level-item button is-small is-black" @click="SET_ITEM_COLOR('0')">0</button>
            </div>
          </b-dropdown-item>
          <b-dropdown-item class="is-hidden-touch" custom></b-dropdown-item>
          <b-dropdown-item @click="TOGGLE_COMPLETE()">
            <i class="icon-active mdi mdi-18px mdi-spellcheck"></i>
            <span>{{ item.complete ? 'Убрать вычёркивание' : 'Вычеркнуть'}}</span>
          </b-dropdown-item>
          <b-dropdown-item separator></b-dropdown-item>
          <b-dropdown-item @click="createLink(item)">
            <i class="icon-active mdi mdi-18px mdi-link-variant"></i>
            <span>Создать ссылку</span>
          </b-dropdown-item>
          <b-dropdown-item @click="editItem(item.id)">
            <i class="icon-active mdi mdi-18px mdi-pencil"></i>
            <span>Переименовать</span>
          </b-dropdown-item>
          <b-dropdown-item @click="DELETE_ITEM(item.id)">
            <i class="icon-active mdi mdi-18px mdi-delete"></i>
            <span>Удалить</span>
          </b-dropdown-item>
        </b-dropdown>

        <span v-show="item.link" @click="DELETE_ITEM(item.id)" title="Удалить ссылку">
          <i class="icon-active mdi mdi-18px mdi-link-variant-off"></i>
        </span>
      </div>

      <span class="element-menu" v-else>
        <span v-show="item.link" title="Это ссылка">
          <i class="icon-inactive mdi mdi-18px mdi-link-variant"></i>
        </span>
      </span>
    </div>

    <div class="element element-selected-2 element-add" v-if="addMode && selectedItem == item.id">
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
  import { mapState, mapMutations, mapActions } from 'vuex';

  export default {
    name: 'tree-item',
    props: ['item'],

    computed: {
      ...mapState({
        flatTree: state => state.list.flatTree,
        selectedItem: state => state.list.selectedItem,
        addMode: state => state.list.addMode,
        editMode: state => state.list.editMode
      }),

      addName: {
        get() {
          return this.$store.state.list.addName;
        },
        set(value) {
          this.$store.commit('SET_ADD_NAME', value)
        }
      },

      editName: {
        get() {
          return this.$store.state.list.editName;
        },
        set(value) {
          this.$store.commit('SET_EDIT_NAME', value)
        }
      },
    },

    methods: {
      ...mapMutations(['SET_SELECTED_ITEM', 'TOGGLE_ADD_MODE', 'TOGGLE_EDIT_MODE', 'DELETE_ITEM', 'SET_EXPAND', 'TOGGLE_COMPLETE', 'SET_ITEM_COLOR']),
      ...mapActions(['createLink', 'addDone', 'addCancel', 'editItem', 'editDone', 'editCancel']),

      showName: function(id) {
        console.log("show")
        return this.flatTree.find(x => x.id === id).name;
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/assets/variables.scss';
  /* Расцветка элементов списка */
  .item-complete {
    text-decoration: line-through;
    text-decoration-color: $text;
  }

  .item-color-0 {
    color: $text;
  }

  .item-color-1 {
    color: $danger;
  }

  .item-color-2 {
    color: $success;
  }

  .item-color-3 {
    color: $info;
  }
  /* *********************** */

  .sortable-ghost {
    opacity: 0;
  }

  .sortable-drag {
    opacity: 1;
  }

  ul,
  li {
    list-style: none;
    padding-left: 10px;
    font-size: 0.9rem;
  }

  li:first-child {
    margin-top: 5px;
  }

  .chevron {
    float: left;
    width: 0px;
    position: relative;
    left: -25px;
    top: 7px;
    cursor: pointer;
  }

  .element {
    padding: 8px 10px;
    cursor: default;
  }

  .element input {
    height: 20px;
    border: none;
    font-size: 0.9rem;
    background-color: $white;
  }

  .element input:focus {
    outline: none;
  }

  .element-selected-1 {
    background-color: $background;
  }

  .element-selected-2 {
    border: 1px dashed $tree-border-active;
    padding-top: 7px;
    padding-bottom: 7px;
  }

  .element-add {
    margin-top: 8px;
  }

  .element-menu {
    float: right;
    line-height: 1.2;
  }

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

  .element-menu .dropdown-item > i {
    margin-right: 10px;
  }

</style>