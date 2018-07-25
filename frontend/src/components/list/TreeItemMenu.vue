<template>
  <b-dropdown class="list-item-menu" ref="listdropdown" v-show="!item.link">
    <a class="icon element-icon invert-link" slot="trigger" title="Меню" v-show="!item.link">
      <b-icon custom-size="mdi-18px" icon="dots-vertical"></b-icon>
    </a>
    <b-dropdown-item custom>
      <b-icon custom-size="mdi-18px" icon="palette"></b-icon>
      <span>Цвет</span>
      <span class="colors-palette" @click="$refs.listdropdown.toggle()">
        <a class="button is-danger" @click="SET_ITEM_COLOR('1')">
          <b-icon v-if="item.color == 1 ? 'color-active' : ''" custom-size="mdi-18px" icon="check"></b-icon>
        </a>
        <a class="button is-success" @click="SET_ITEM_COLOR('2')">
          <b-icon v-if="item.color == 2 ? 'color-active' : ''" custom-size="mdi-18px" icon="check"></b-icon>
        </a>
        <a class="button is-info" @click="SET_ITEM_COLOR('3')">
          <b-icon v-if="item.color == 3 ? 'color-active' : ''" custom-size="mdi-18px" icon="check"></b-icon>
        </a>
        <a class="button is-black" @click="SET_ITEM_COLOR('0')">
          <b-icon v-if="item.color == 0 ? 'color-active' : ''" custom-size="mdi-18px" icon="check"></b-icon>
        </a>
      </span>
    </b-dropdown-item>
    <b-dropdown-item @click="editNote(item.id)">
      <b-icon custom-size="mdi-18px" icon="comment-text-outline"></b-icon>
      <span>{{ item.note ? 'Изменить примечание' : 'Добавить примечание'}}</span>
    </b-dropdown-item>
    <b-dropdown-item @click="TOGGLE_COMPLETE()">
      <b-icon custom-size="mdi-18px" icon="checkbox-marked-outline"></b-icon>
      <span>{{ item.complete ? 'Убрать отметку' : 'Отметить выполненным'}}</span>
    </b-dropdown-item>


    <b-dropdown-item separator></b-dropdown-item>
    <b-dropdown-item @click="createLink(item)">
      <b-icon custom-size="mdi-18px" icon="link-variant"></b-icon>
      <span>Создать ссылку</span>
    </b-dropdown-item>
    <b-dropdown-item @click="renameItem(item.id)">
      <b-icon custom-size="mdi-18px" icon="pencil"></b-icon>
      <span>Переименовать</span>
    </b-dropdown-item>
    <b-dropdown-item @click="removeItem(item.id)">
      <b-icon custom-size="mdi-18px" icon="delete"></b-icon>
      <span>Удалить</span>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
  import { mapMutations, mapActions } from 'vuex';

  export default {
    name: 'tree-item-menu',
    props: ['item'],

    methods: {
      ...mapMutations(['TOGGLE_COMPLETE', 'SET_ITEM_COLOR']),
      ...mapActions(['createLink', 'renameItem', 'editNote', 'removeItem', ])
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/assets/variables.scss';

  .dropdown-item > span {
    vertical-align: middle;
  }

  .colors-palette > a:first-of-type {
    margin-left: 1em;
  }

  .colors-palette a {
    font-size: $size-8;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 0.1em;
    padding: 0;
    vertical-align: top;
    @include desktop {
      vertical-align: text-top;
    }
  }

</style>