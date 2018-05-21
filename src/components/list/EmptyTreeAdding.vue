<template>
  <div class="media empty-adding">
    <div class="media-content">
      <input type="text" placeholder="Введите имя для добавления" v-model="addName" v-shortkey.avoid v-focus
        @keyup.enter="addDone()">
    </div>

    <div class="media-right">
      <a class="icon element-icon invert-link" @click="addDone()">
        <b-icon custom-size="mdi-18px" icon="check"></b-icon>
      </a>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    name: 'EmptyTreeAdding',

    computed: {
      addName: {
        get() {
          return this.$store.state.list.addName;
        },
        set(value) {
          this.$store.commit('SET_ADD_NAME', value);
        }
      }
    },

    methods: {
      addDone() {
        this.$store.dispatch('addDone');
        this.$store.dispatch('saveList');
      }
    }
  }
</script>

<style lang="scss">
  @import '@/assets/variables.scss';
  .empty-adding {
    border: 1px dashed $tree-border-active !important;
    min-height: 2.6rem;
    padding: 4px 4px 4px 8px;
    font-size: $size-7;
    cursor: default;
    justify-content: center;
    align-items: center;
    @include desktop {
      min-height: 2.2rem;
    }
  }

  .empty-adding input {
    height: 20px;
    width: 100%;
    border: none;
    font-size: $size-8;
    background-color: $white;
  }

  .empty-adding input:focus {
    outline: none;
  }
</style>