<template>
  <ul>
    <draggable class="drop-zone" :list="treeData"
     :options="{ group: 'node', handle: dragHandle, animation: 150, disabled: isDragDisabled, forceFallback: false }">
      <tree-item :item="item" v-for="(item) in treeData" :key="item.id">
        <tree v-if="item.expand == true" :treeData="item.children"/>
      </tree-item>
    </draggable>
  </ul>
</template>

<script>
  import Draggable from 'vuedraggable';
  import debounce from 'debounce';
  import TreeItem from '@/components/list/TreeItem';

  export default {
    name: 'tree',
    props: ['treeData'],

    components: {
      Draggable,
      TreeItem
    },

    data() {
      return {
        dragHandle: ''
      }
    },

    watch: {
      treeData: {
        handler: debounce(function() {
          this.$store.dispatch('saveList');
        }, 200),
        deep: true
      }
    },

    computed: {
      isDragDisabled() {
        return this.$store.state.list.renameMode ||
          this.$store.state.list.editNoteMode ||
          this.$store.state.list.addMode;
      }
    },

    created() {
      window.addEventListener('resize', this.handleResize)
      this.handleResize();
    },

    destroyed() {
      window.removeEventListener('resize', this.handleResize)
    },

    methods: {
      handleResize() {
        if (window.innerWidth >= 1024) {
          this.dragHandle = '.drag-handle-desktop';
        } else {
          this.dragHandle = '.drag-handle-touch';
        }
      }
    }

  }
</script>

<style lang="scss">
  @import '@/assets/variables.scss';
  .sortable-ghost {
    opacity: 0;
  }

  .sortable-drag {
    opacity: 1;
  }
</style>